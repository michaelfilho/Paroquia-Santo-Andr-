const express = require('express');
const { Event, Inscription } = require('../models');

const router = express.Router();

// GET events with inscription count
router.get('/public/with-counts', async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['createdAt', 'DESC']],
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
    const events = await Event.findAll({
      order: [['createdAt', 'DESC']],
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
    const { title, date, time, location, description, category, acceptsRegistration, maxParticipants } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json({ message: 'Título, data e local são obrigatórios' });
    }

    const event = await Event.create({
      title,
      date,
      time,
      location,
      description,
      category,
      acceptsRegistration,
      maxParticipants,
      published: true,
      isActive: true,
      isProgram: true,
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

    await event.update(req.body);
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

    await event.update({ published: true });
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

    await event.update({ published: false });
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

// MOVE event to EVENT (from PROGRAM)
router.patch('/:id/move-to-event', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    await event.update({ isProgram: false, published: false });
    res.json({
      message: 'Evento movido para aba de Eventos',
      event,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao mover evento', error: error.message });
  }
});

// MOVE event to PROGRAM (from EVENT)
router.patch('/:id/move-to-program', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    await event.update({ isProgram: true });
    res.json({
      message: 'Evento movido para aba de Programações',
      event,
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

    // Delete associated inscriptions first
    await Inscription.destroy({ where: { eventId: req.params.id } });
    await event.destroy();

    res.json({ message: 'Evento deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar evento', error: error.message });
  }
});

module.exports = router;
