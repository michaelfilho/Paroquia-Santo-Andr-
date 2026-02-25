const express = require('express');
const router = express.Router();
const { News } = require('../models');
const authMiddleware = require('../middleware/auth');

// Public route to get all news
router.get('/', async (req, res) => {
    try {
        const newsList = await News.findAll({
            order: [['date', 'DESC'], ['id', 'DESC']]
        });
        res.json(newsList);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Erro ao buscar notícias' });
    }
});

// Admin routes
router.post('/', authMiddleware, async (req, res) => {
    try {
        const payload = { ...req.body };
        if (!payload.id || String(payload.id).trim() === '') {
            delete payload.id;
        }
        if (payload.publishedAt) {
            payload.date = new Date(payload.publishedAt).toISOString().slice(0, 10);
        }
        if (!payload.date) {
            payload.date = new Date().toISOString().slice(0, 10);
        }
        const news = await News.create(payload);
        res.status(201).json(news);
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({ message: 'Erro ao criar notícia' });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const news = await News.findByPk(id);

        if (!news) {
            return res.status(404).json({ message: 'Notícia não encontrada' });
        }

        const payload = { ...req.body };
        delete payload.id;
        if (payload.publishedAt) {
            payload.date = new Date(payload.publishedAt).toISOString().slice(0, 10);
        }

        await news.update(payload);
        res.json(news);
    } catch (error) {
        console.error('Error updating news:', error);
        res.status(500).json({ message: 'Erro ao atualizar notícia' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const news = await News.findByPk(id);

        if (!news) {
            return res.status(404).json({ message: 'Notícia não encontrada' });
        }

        await news.destroy();
        res.json({ message: 'Notícia removida com sucesso' });
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ message: 'Erro ao remover notícia' });
    }
});

module.exports = router;
