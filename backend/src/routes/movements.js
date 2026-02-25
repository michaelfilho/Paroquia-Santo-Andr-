const express = require('express');
const router = express.Router();
const { PastoralMovement } = require('../models');
const authMiddleware = require('../middleware/auth');

// Public route to get all movements
router.get('/', async (req, res) => {
    try {
        const movements = await PastoralMovement.findAll({
            order: [['name', 'ASC']]
        });
        res.json(movements);
    } catch (error) {
        console.error('Error fetching pastoral movements:', error);
        res.status(500).json({ message: 'Erro ao buscar movimentos pastorais' });
    }
});

// Admin routes
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { id, ...body } = req.body || {};
        const payload = {
            ...body,
            imageUrl: req.body.iconUrl || req.body.imageUrl || null,
        };
        const movement = await PastoralMovement.create(payload);
        res.status(201).json(movement);
    } catch (error) {
        console.error('Error creating pastoral movement:', error);
        res.status(500).json({ message: 'Erro ao criar movimento pastoral' });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const movement = await PastoralMovement.findByPk(id);

        if (!movement) {
            return res.status(404).json({ message: 'Movimento não encontrado' });
        }

        const { id: bodyId, ...body } = req.body || {};
        const payload = {
            ...body,
            imageUrl: req.body.iconUrl || req.body.imageUrl || null,
        };
        await movement.update(payload);
        res.json(movement);
    } catch (error) {
        console.error('Error updating pastoral movement:', error);
        res.status(500).json({ message: 'Erro ao atualizar movimento pastoral' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const movement = await PastoralMovement.findByPk(id);

        if (!movement) {
            return res.status(404).json({ message: 'Movimento não encontrado' });
        }

        await movement.destroy();
        res.json({ message: 'Movimento removido com sucesso' });
    } catch (error) {
        console.error('Error deleting pastoral movement:', error);
        res.status(500).json({ message: 'Erro ao remover movimento pastoral' });
    }
});

router.delete('/by-name/:name', authMiddleware, async (req, res) => {
    try {
        const name = String(req.params.name || '').trim();

        if (!name) {
            return res.status(400).json({ message: 'Nome do movimento é obrigatório' });
        }

        const movement = await PastoralMovement.findOne({ where: { name } });

        if (!movement) {
            return res.status(404).json({ message: 'Movimento não encontrado' });
        }

        await movement.destroy();
        res.json({ message: 'Movimento removido com sucesso' });
    } catch (error) {
        console.error('Error deleting pastoral movement by name:', error);
        res.status(500).json({ message: 'Erro ao remover movimento pastoral' });
    }
});

module.exports = router;
