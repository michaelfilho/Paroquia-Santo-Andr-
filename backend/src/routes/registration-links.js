const express = require('express');
const { RegistrationLink } = require('../models');

const router = express.Router();

const isValidUrl = (url = '') => {
  try {
    const parsed = new URL(String(url).trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

router.get('/', async (req, res) => {
  try {
    const items = await RegistrationLink.findAll({
      order: [['date', 'ASC'], ['createdAt', 'DESC']],
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar inscrições', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, date, description, formUrl, imageUrl, isActive } = req.body;

    if (!title || !date || !description || !formUrl) {
      return res.status(400).json({ message: 'Título, data, descrição e link são obrigatórios' });
    }

    if (!isValidUrl(formUrl)) {
      return res.status(400).json({ message: 'Informe um link válido (http/https)' });
    }

    const item = await RegistrationLink.create({
      title: String(title).trim(),
      date,
      description: String(description).trim(),
      formUrl: String(formUrl).trim(),
      imageUrl: imageUrl ? String(imageUrl).trim() : null,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({ message: 'Inscrição criada com sucesso', item });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar inscrição', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await RegistrationLink.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Inscrição não encontrada' });
    }

    const { title, date, description, formUrl, imageUrl, isActive } = req.body;

    if (!title || !date || !description || !formUrl) {
      return res.status(400).json({ message: 'Título, data, descrição e link são obrigatórios' });
    }

    if (!isValidUrl(formUrl)) {
      return res.status(400).json({ message: 'Informe um link válido (http/https)' });
    }

    await item.update({
      title: String(title).trim(),
      date,
      description: String(description).trim(),
      formUrl: String(formUrl).trim(),
      imageUrl: imageUrl ? String(imageUrl).trim() : null,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.json({ message: 'Inscrição atualizada com sucesso', item });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar inscrição', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await RegistrationLink.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Inscrição não encontrada' });
    }

    await item.destroy();
    res.json({ message: 'Inscrição removida com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover inscrição', error: error.message });
  }
});

module.exports = router;
