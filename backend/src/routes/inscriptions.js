const express = require('express');
const { Inscription, Event } = require('../models');

const router = express.Router();

// GET all inscriptions
router.get('/', async (req, res) => {
  try {
    const inscriptions = await Inscription.findAll({
      include: [{ model: Event }],
      order: [['createdAt', 'DESC']],
    });
    res.json(inscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar inscrições', error: error.message });
  }
});

// GET inscriptions by event
router.get('/event/:eventId', async (req, res) => {
  try {
    const inscriptions = await Inscription.findAll({
      where: { eventId: req.params.eventId },
      order: [['createdAt', 'DESC']],
    });
    res.json(inscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar inscrições', error: error.message });
  }
});

// GET inscription by ID
router.get('/:id', async (req, res) => {
  try {
    const inscription = await Inscription.findByPk(req.params.id, {
      include: [{ model: Event }],
    });
    if (!inscription) {
      return res.status(404).json({ message: 'Inscrição não encontrada' });
    }
    res.json(inscription);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar inscrição', error: error.message });
  }
});

// CREATE inscription (público - sem autenticação)
router.post('/', async (req, res) => {
  try {
    const { eventId, name, email, phone } = req.body;

    if (!eventId || !name || !email || !phone) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Verify if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    if (!event.acceptsRegistration) {
      return res.status(400).json({ message: 'Este evento não aceita inscrições' });
    }

    const inscription = await Inscription.create({
      eventId,
      name,
      email,
      phone,
      status: 'Pendente',
    });

    res.status(201).json({
      message: 'Inscrição realizada com sucesso',
      inscription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar inscrição', error: error.message });
  }
});

// UPDATE inscription status
router.put('/:id', async (req, res) => {
  try {
    const inscription = await Inscription.findByPk(req.params.id);
    if (!inscription) {
      return res.status(404).json({ message: 'Inscrição não encontrada' });
    }

    const { status } = req.body;
    if (status && ['Pendente', 'Confirmado', 'Cancelado'].includes(status)) {
      await inscription.update({ status });
    } else {
      await inscription.update(req.body);
    }

    res.json({
      message: 'Inscrição atualizada com sucesso',
      inscription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar inscrição', error: error.message });
  }
});

// DELETE inscription
router.delete('/:id', async (req, res) => {
  try {
    const inscription = await Inscription.findByPk(req.params.id);
    if (!inscription) {
      return res.status(404).json({ message: 'Inscrição não encontrada' });
    }

    await inscription.destroy();
    res.json({ message: 'Inscrição deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar inscrição', error: error.message });
  }
});

module.exports = router;
