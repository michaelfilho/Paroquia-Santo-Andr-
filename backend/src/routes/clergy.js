const express = require('express');
const { ClergyMember } = require('../models');

const router = express.Router();

// GET all clergy members
router.get('/', async (req, res) => {
  try {
    const clergy = await ClergyMember.findAll({
      order: [['name', 'ASC']],
    });
    res.json(clergy);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar clero', error: error.message });
  }
});

// GET clergy member by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await ClergyMember.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Membro do clero não encontrado' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar membro', error: error.message });
  }
});

// CREATE clergy member
router.post('/', async (req, res) => {
  try {
    const { name, role, startYear, bio, email, phone, imageUrl, current } = req.body;

    if (!name || !role || !startYear) {
      return res.status(400).json({ message: 'Nome, função e ano de início são obrigatórios' });
    }

    const member = await ClergyMember.create({
      name,
      role,
      startYear,
      bio,
      email,
      phone,
      imageUrl,
      isCurrent: current,
    });

    res.status(201).json({
      message: 'Membro do clero criado com sucesso',
      member,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar membro', error: error.message });
  }
});

// UPDATE clergy member
router.put('/:id', async (req, res) => {
  try {
    const member = await ClergyMember.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Membro do clero não encontrado' });
    }

    await member.update(req.body);
    res.json({
      message: 'Membro do clero atualizado com sucesso',
      member,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar membro', error: error.message });
  }
});

// DELETE clergy member
router.delete('/:id', async (req, res) => {
  try {
    const member = await ClergyMember.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Membro do clero não encontrado' });
    }

    await member.destroy();
    res.json({ message: 'Membro do clero deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar membro', error: error.message });
  }
});

module.exports = router;
