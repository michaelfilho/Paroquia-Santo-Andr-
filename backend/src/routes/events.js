const express = require('express');
const fs = require('fs');
const path = require('path');
const { Event, Inscription, EventPhoto } = require('../models');

const router = express.Router();

const normalizeEventPayload = (payload = {}) => {
  const normalized = { ...payload };
  
  // Handle published/isPublished conversion
  if (Object.prototype.hasOwnProperty.call(normalized, 'published')) {
    normalized.isPublished = normalized.published;
    delete normalized.published;
  }
  
  // Convert schedule time fields (timeStart/timeEnd) to event time format
  if (normalized.timeStart || normalized.timeEnd) {
    const start = normalized.timeStart || '00:00';
    const end = normalized.timeEnd || '23:59';
    normalized.time = `${start} às ${end}`;
    delete normalized.timeStart;
    delete normalized.timeEnd;
  }
  
  return normalized;
};

// GET events with inscription count
router.get('/public/with-counts', async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { isInscriptionEvent: false },
      order: [['date', 'DESC']],
    });

    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const confirmedCount = await Inscription.count({
          where: { eventId: event.id, status: 'Confirmado' },
        });
        return {
          ...event.toJSON(),
          confirmedInscriptions: confirmedCount,
        };
      })
    );

    res.json(eventsWithCounts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar eventos', error: error.message });
  }
});

// GET all events
router.get('/', async (req, res) => {
  try {
    // If includeInscription=true is provided, return all events (for admin views)
    const includeInscription = req.query.includeInscription === 'true';
    const where = includeInscription ? {} : { isInscriptionEvent: false };

    const events = await Event.findAll({
      where,
      order: [['date', 'DESC']],
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar eventos', error: error.message });
  }
});

// GET event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar evento', error: error.message });
  }
});

// CREATE event (padrão: published=false, isActive=true)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      date,
      dateEnd,
      time,
      location,
      description,
      isProgram,
      isInscriptionEvent,
      maxParticipants,
      acceptsRegistration,
      category,
      published,
    } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json({ message: 'Título, data e local são obrigatórios' });
    }

    if (!time || !String(time).trim()) {
      return res.status(400).json({ message: 'Horário é obrigatório' });
    }

    const event = await Event.create({
      title,
      date,
      dateEnd: dateEnd || null,
      time,
      location,
      description,
      category: category || 'Evento',
      isPublished: published !== undefined ? published : false,
      isActive: true,
      isProgram: isProgram !== undefined ? isProgram : true,
      isInscriptionEvent: isInscriptionEvent !== undefined ? isInscriptionEvent : false,
      maxParticipants: maxParticipants || null,
      acceptsRegistration: acceptsRegistration !== undefined ? acceptsRegistration : true,
    });

    res.status(201).json({
      message: 'Evento criado com sucesso',
      event,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar evento', error: error.message });
  }
});

// UPDATE event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    const payload = normalizeEventPayload(req.body);

    await event.update(payload);
    res.json({
      message: 'Evento atualizado com sucesso',
      event,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar evento', error: error.message });
  }
});

// PUBLISH event (Tornar visível ao público)
router.patch('/:id/publish', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    await event.update({ isPublished: true });
    res.json({
      message: 'Evento publicado com sucesso',
      event,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao publicar evento', error: error.message });
  }
});

// UNPUBLISH event (Remover da visualização pública)
router.patch('/:id/unpublish', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    await event.update({ isPublished: false });
    res.json({
      message: 'Evento despublicado com sucesso',
      event,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao despublicar evento', error: error.message });
  }
});

// ARCHIVE event (Marcar como inativo quando a data passa)
router.patch('/:id/archive', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    await event.update({ isActive: false });
    res.json({
      message: 'Evento arquivado com sucesso',
      event,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao arquivar evento', error: error.message });
  }
});

// MOVE event to PROGRAM (from EVENT)
router.patch('/:id/move-to-program', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    let timeStart = event.time;
    let timeEnd = null;
    if (event.time && event.time.includes(' às ')) {
      const parts = event.time.split(' às ');
      timeStart = parts[0];
      timeEnd = parts[1];
    }

    const { Schedule, EventPhoto, Inscription } = require('../models');

    const newSchedule = await Schedule.create({
      title: event.title,
      date: event.date,
      timeStart: timeStart || '',
      timeEnd: timeEnd,
      location: event.location,
      description: event.description,
      category: 'Evento',
      isPublished: false
    });

    // Delete associated photos and inscriptions
    const path = require('path');
    const fs = require('fs');

    const photos = await EventPhoto.findAll({ where: { eventId: req.params.id } });
    for (const photo of photos) {
      const filepath = path.join(__dirname, '../../../Styles/img/eventos', photo.filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      await photo.destroy();
    }

    await Inscription.destroy({ where: { eventId: req.params.id } });
    await event.destroy();

    res.json({
      message: 'Evento movido para aba de Programações',
      schedule: newSchedule,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao mover evento', error: error.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    // Delete associated photos (db + filesystem) first
    const photos = await EventPhoto.findAll({ where: { eventId: req.params.id } });
    for (const photo of photos) {
      const filepath = path.join(__dirname, '../../../Styles/img/eventos', photo.filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      await photo.destroy();
    }

    // Delete associated inscriptions first
    await Inscription.destroy({ where: { eventId: req.params.id } });
    await event.destroy();

    res.json({ message: 'Evento deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar evento', error: error.message });
  }
});

module.exports = router;
