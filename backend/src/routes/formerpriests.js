const express = require('express');
const router = express.Router();
const { FormerPriest } = require('../models');
const authMiddleware = require('../middleware/auth');

// Public route to get all former priests
router.get('/', async (req, res) => {
    try {
        const priests = await FormerPriest.findAll({
            order: [['period', 'ASC']]
        });
        res.json(priests);
    } catch (error) {
        console.error('Error fetching former priests:', error);
        res.status(500).json({ message: 'Erro ao buscar antigos padres' });
    }
});

// Admin routes
router.post('/', authMiddleware, async (req, res) => {
    try {
        const payload = {
            ...req.body,
            bio: req.body.description || req.body.bio || '',
        };
        if (!payload.id) {
            delete payload.id;
        }
        let priest;
        try {
            priest = await FormerPriest.create(payload);
        } catch (error) {
            const message = String(error?.message || '').toLowerCase();
            if (message.includes('subtext') || message.includes('unknown column')) {
                const { subtext, ...fallbackPayload } = payload;
                priest = await FormerPriest.create(fallbackPayload);
            } else {
                throw error;
            }
        }
        res.status(201).json(priest);
    } catch (error) {
        console.error('Error creating former priest:', error);
        res.status(500).json({ message: 'Erro ao criar antigo padre', error: error.message });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const priest = await FormerPriest.findByPk(id);

        if (!priest) {
            return res.status(404).json({ message: 'Padre não encontrado' });
        }

        const payload = {
            ...req.body,
            bio: req.body.description || req.body.bio || '',
        };
        delete payload.id;
        try {
            await priest.update(payload);
        } catch (error) {
            const message = String(error?.message || '').toLowerCase();
            if (message.includes('subtext') || message.includes('unknown column')) {
                const { subtext, ...fallbackPayload } = payload;
                await priest.update(fallbackPayload);
            } else {
                throw error;
            }
        }
        res.json(priest);
    } catch (error) {
        console.error('Error updating former priest:', error);
        res.status(500).json({ message: 'Erro ao atualizar antigo padre', error: error.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const priest = await FormerPriest.findByPk(id);

        if (!priest) {
            return res.status(404).json({ message: 'Padre não encontrado' });
        }

        await priest.destroy();
        res.json({ message: 'Padre removido com sucesso' });
    } catch (error) {
        console.error('Error deleting former priest:', error);
        res.status(500).json({ message: 'Erro ao remover antigo padre' });
    }
});

module.exports = router;
