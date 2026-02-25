const express = require('express');
const router = express.Router();
const { CarouselItem } = require('../models');


router.get('/', async (req, res) => {
    try {
        const items = await CarouselItem.findAll({
            order: [['order', 'ASC']],
        });
        res.json(items);
    } catch (error) {
        console.error('Erro ao buscar itens do carrossel:', error);
        res.status(500).json({ error: 'Erro ao buscar itens do carrossel' });
    }
});

// Pegar apenas os ativos para o frontend (público)
router.get('/public', async (req, res) => {
    try {
        const items = await CarouselItem.findAll({
            where: { isActive: true },
            order: [['order', 'ASC']],
        });
        res.json(items);
    } catch (error) {
        console.error('Erro ao buscar itens públicos do carrossel:', error);
        res.status(500).json({ error: 'Erro ao buscar itens do carrossel' });
    }
});

// Criar novo item no carrossel
router.post('/', async (req, res) => {
    try {
        const { title, titleHighlight, subtitle, link, buttonText, titleColor, titleColorEnd, subtitleColor, linkColor, imageUrl, order, isActive } = req.body;
        const newItem = await CarouselItem.create({
            title,
            titleHighlight,
            subtitle,
            link,
            buttonText: buttonText || 'Saiba Mais',
            titleColor: titleColor || '#FFFFFF',
            titleColorEnd: titleColorEnd || titleColor || '#F59E0B',
            subtitleColor: subtitleColor || '#F3F4F6',
            linkColor: linkColor || '#FFFFFF',
            imageUrl,
            order: order || 0,
            isActive: isActive !== undefined ? isActive : true
        });
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Erro ao criar item do carrossel:', error);
        res.status(500).json({ error: 'Erro ao criar item do carrossel' });
    }
});

// Atualizar um item do carrossel
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, titleHighlight, subtitle, link, buttonText, titleColor, titleColorEnd, subtitleColor, linkColor, imageUrl, order, isActive } = req.body;

        const item = await CarouselItem.findByPk(id);
        if (!item) {
            return res.status(404).json({ error: 'Item não encontrado' });
        }

        await item.update({
            title,
            titleHighlight,
            subtitle,
            link,
            buttonText: buttonText || 'Saiba Mais',
            titleColor: titleColor || '#FFFFFF',
            titleColorEnd: titleColorEnd || titleColor || '#F59E0B',
            subtitleColor: subtitleColor || '#F3F4F6',
            linkColor: linkColor || '#FFFFFF',
            imageUrl,
            order,
            isActive
        });

        res.json(item);
    } catch (error) {
        console.error('Erro ao atualizar item do carrossel:', error);
        res.status(500).json({ error: 'Erro ao atualizar item do carrossel' });
    }
});

// Excluir um item
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const item = await CarouselItem.findByPk(id);

        if (!item) {
            return res.status(404).json({ error: 'Item não encontrado' });
        }

        await item.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir item do carrossel:', error);
        res.status(500).json({ error: 'Erro ao excluir item do carrossel' });
    }
});

module.exports = router;
