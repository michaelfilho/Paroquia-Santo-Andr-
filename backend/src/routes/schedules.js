const express = require('express');
const { Schedule, Event } = require('../models');

const router = express.Router();

// GET all schedules
router.get('/', async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            order: [['date', 'ASC']],
        });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar programações', error: error.message });
    }
});

// GET public schedules
router.get('/public', async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            where: { isPublished: true },
            order: [['date', 'ASC']],
        });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar programações públicas', error: error.message });
    }
});

// GET schedule by ID
router.get('/:id', async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (!schedule) {
            return res.status(404).json({ message: 'Programação não encontrada' });
        }
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar programação', error: error.message });
    }
});

// CREATE schedule
router.post('/', async (req, res) => {
    try {
        const { title, date, timeStart, timeEnd, location, description, category, isPublished } = req.body;

        if (!title || !date) {
            return res.status(400).json({ message: 'Título e data são obrigatórios' });
        }

        const schedule = await Schedule.create({
            title,
            date,
            timeStart,
            timeEnd,
            location,
            description,
            category,
            isPublished: isPublished !== undefined ? isPublished : false,
        });

        res.status(201).json({
            message: 'Programação criada com sucesso',
            schedule,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar programação', error: error.message });
    }
});

// UPDATE schedule
router.put('/:id', async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (!schedule) {
            return res.status(404).json({ message: 'Programação não encontrada' });
        }

        await schedule.update(req.body);
        res.json({
            message: 'Programação atualizada com sucesso',
            schedule,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar programação', error: error.message });
    }
});

// PUBLISH schedule
router.patch('/:id/publish', async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (!schedule) {
            return res.status(404).json({ message: 'Programação não encontrada' });
        }

        await schedule.update({ isPublished: true });
        res.json({
            message: 'Programação publicada com sucesso',
            schedule,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao publicar programação', error: error.message });
    }
});

// UNPUBLISH schedule
router.patch('/:id/unpublish', async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (!schedule) {
            return res.status(404).json({ message: 'Programação não encontrada' });
        }

        await schedule.update({ isPublished: false });
        res.json({
            message: 'Programação despublicada com sucesso',
            schedule,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao despublicar programação', error: error.message });
    }
});

// MOVE to EVENT
router.patch('/:id/move-to-event', async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (!schedule) {
            return res.status(404).json({ message: 'Programação não encontrada' });
        }

        const normalizeHour = (value) => {
            if (!value) return '';
            const digits = String(value).replace(/\D/g, '');
            if (digits.length === 3) {
                return `0${digits[0]}:${digits.slice(1)}`;
            }
            if (digits.length >= 4) {
                return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
            }
            return String(value).trim();
        };

        const timeStart = normalizeHour(schedule.timeStart);
        const timeEnd = normalizeHour(schedule.timeEnd) || timeStart;
        const timeString = timeStart ? `${timeStart} às ${timeEnd}` : '00:00 às 00:00';

        // Transform into event
        const newEvent = await Event.create({
            title: schedule.title || 'Sem título',
            date: schedule.date,
            time: timeString,
            location: schedule.location || 'Local não informado',
            description: schedule.description || '',
            category: schedule.category || 'Evento',
            isProgram: false,
            isActive: true,
            published: schedule.isPublished === true || schedule.isPublished === 1,
            isInscriptionEvent: false,
            maxParticipants: null,
            acceptsRegistration: false
        });

        // Delete schedule after converting
        await schedule.destroy();

        res.json({
            message: 'Programação movida para Eventos',
            event: newEvent,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao mover programação para eventos', error: error.message });
    }
});

// DELETE schedule
router.delete('/:id', async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (!schedule) {
            return res.status(404).json({ message: 'Programação não encontrada' });
        }

        await schedule.destroy();

        res.json({ message: 'Programação deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar programação', error: error.message });
    }
});

module.exports = router;
