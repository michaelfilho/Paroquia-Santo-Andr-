const express = require('express');
const { ContentText } = require('../models');

const router = express.Router();

// GET all content texts
router.get('/', async (req, res) => {
  try {
    const texts = await ContentText.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(texts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar textos', error: error.message });
  }
});

// GET content by key
router.get('/:key', async (req, res) => {
  try {
    const text = await ContentText.findOne({
      where: { key: req.params.key },
    });
    if (!text) {
      return res.status(404).json({ message: 'Texto não encontrado' });
    }
    res.json(text);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar texto', error: error.message });
  }
});

// CREATE content text
router.post('/', async (req, res) => {
  try {
    const { key, title, content } = req.body;

    if (!key || !title || !content) {
      return res.status(400).json({ message: 'Chave, título e conteúdo são obrigatórios' });
    }

    const text = await ContentText.create({
      key,
      title,
      content,
    });

    res.status(201).json({
      message: 'Texto criado com sucesso',
      text,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar texto', error: error.message });
  }
});

// UPDATE content text
router.put('/:id', async (req, res) => {
  try {
    const text = await ContentText.findByPk(req.params.id);
    if (!text) {
      return res.status(404).json({ message: 'Texto não encontrado' });
    }

    await text.update(req.body);
    res.json({
      message: 'Texto atualizado com sucesso',
      text,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar texto', error: error.message });
  }
});

// DELETE content text
router.delete('/:id', async (req, res) => {
  try {
    const text = await ContentText.findByPk(req.params.id);
    if (!text) {
      return res.status(404).json({ message: 'Texto não encontrado' });
    }

    await text.destroy();
    res.json({ message: 'Texto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar texto', error: error.message });
  }
});

module.exports = router;
