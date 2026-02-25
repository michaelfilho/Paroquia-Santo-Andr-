const express = require('express');
const { Guide } = require('../models');

const router = express.Router();

// GET all guides
router.get('/', async (req, res) => {
  try {
    const guides = await Guide.findAll({
      order: [['title', 'ASC']],
    });
    const normalized = guides.map((guide) => {
      const json = guide.toJSON();
      return {
        ...json,
        content: json.description || '',
      };
    });
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar guias', error: error.message });
  }
});

// GET guide by ID
router.get('/:id', async (req, res) => {
  try {
    const guide = await Guide.findByPk(req.params.id);
    if (!guide) {
      return res.status(404).json({ message: 'Guia não encontrado' });
    }
    res.json(guide);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar guia', error: error.message });
  }
});

// CREATE guide
router.post('/', async (req, res) => {
  try {
    const { title, content, details, icon } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Título e conteúdo são obrigatórios' });
    }

    const guide = await Guide.create({
      title,
      description: content,
      details: details || [],
      icon,
    });

    res.status(201).json({
      message: 'Guia criado com sucesso',
      guide,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar guia', error: error.message });
  }
});

// UPDATE guide
router.put('/:id', async (req, res) => {
  try {
    const guide = await Guide.findByPk(req.params.id);
    if (!guide) {
      return res.status(404).json({ message: 'Guia não encontrado' });
    }

    const payload = {
      ...req.body,
      description: req.body.content ?? req.body.description,
    };

    await guide.update(payload);
    res.json({
      message: 'Guia atualizado com sucesso',
      guide,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar guia', error: error.message });
  }
});

// DELETE guide
router.delete('/:id', async (req, res) => {
  try {
    const guide = await Guide.findByPk(req.params.id);
    if (!guide) {
      return res.status(404).json({ message: 'Guia não encontrado' });
    }

    await guide.destroy();
    res.json({ message: 'Guia deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar guia', error: error.message });
  }
});

module.exports = router;
