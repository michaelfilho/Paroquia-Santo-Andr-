const express = require('express');
const { Chapel } = require('../models');

const router = express.Router();

// GET all chapels
router.get('/', async (req, res) => {
  try {
    const chapels = await Chapel.findAll({
      order: [['name', 'ASC']],
    });
    res.json(chapels);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar capelas', error: error.message });
  }
});

// GET chapel by ID
router.get('/:id', async (req, res) => {
  try {
    const chapel = await Chapel.findByPk(req.params.id);
    if (!chapel) {
      return res.status(404).json({ message: 'Capela não encontrada' });
    }
    res.json(chapel);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar capela', error: error.message });
  }
});

// CREATE chapel
router.post('/', async (req, res) => {
  try {
    const { name, neighborhood, coordinator, address, phone, email, description, photoUrl, imageUrl } = req.body;

    if (!name || !neighborhood) {
      return res.status(400).json({ message: 'Nome e bairro são obrigatórios' });
    }

    const chapel = await Chapel.create({
      name,
      neighborhood,
      coordinator,
      address,
      phone,
      email,
      description,
      imageUrl: photoUrl || imageUrl || null,
    });

    res.status(201).json({
      message: 'Capela criada com sucesso',
      chapel,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar capela', error: error.message });
  }
});

// UPDATE chapel
router.put('/:id', async (req, res) => {
  try {
    const chapel = await Chapel.findByPk(req.params.id);
    if (!chapel) {
      return res.status(404).json({ message: 'Capela não encontrada' });
    }

    const {
      name,
      neighborhood,
      coordinator,
      address,
      phone,
      email,
      description,
      photoUrl,
      imageUrl,
      number,
    } = req.body;

    await chapel.update({
      name,
      neighborhood,
      coordinator,
      address,
      phone,
      email,
      description,
      number,
      imageUrl: photoUrl || imageUrl || chapel.imageUrl || null,
    });
    res.json({
      message: 'Capela atualizada com sucesso',
      chapel,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar capela', error: error.message });
  }
});

// DELETE chapel
router.delete('/:id', async (req, res) => {
  try {
    const chapel = await Chapel.findByPk(req.params.id);
    if (!chapel) {
      return res.status(404).json({ message: 'Capela não encontrada' });
    }

    await chapel.destroy();
    res.json({ message: 'Capela deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar capela', error: error.message });
  }
});

module.exports = router;
