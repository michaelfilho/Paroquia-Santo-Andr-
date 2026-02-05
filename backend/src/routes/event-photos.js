const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { EventPhoto } = require('../models');

const router = express.Router();

// Configure storage for event photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../../Styles/img/eventos');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas!'));
    }
  }
});

// Upload multiple photos for an event
router.post('/event/:eventId', upload.array('photos', 20), async (req, res) => {
  try {
    const { eventId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'Nenhuma foto foi enviada' });
    }

    const savedPhotos = [];

    for (const file of files) {
      const photo = await EventPhoto.create({
        eventId: eventId,
        filename: file.filename,
        path: `/api/uploads/eventos/${file.filename}`
      });
      savedPhotos.push(photo);
    }

    res.status(201).json({
      message: `${savedPhotos.length} foto(s) enviada(s) com sucesso`,
      photos: savedPhotos
    });
  } catch (error) {
    console.error('Erro ao fazer upload de fotos:', error);
    res.status(500).json({ message: 'Erro ao fazer upload de fotos', error: error.message });
  }
});

// Get all photos for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const photos = await EventPhoto.findAll({
      where: { eventId: eventId },
      order: [['createdAt', 'DESC']]
    });

    res.json(photos);
  } catch (error) {
    console.error('Erro ao buscar fotos:', error);
    res.status(500).json({ message: 'Erro ao buscar fotos', error: error.message });
  }
});

// Delete a photo
router.delete('/:photoId', async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await EventPhoto.findByPk(photoId);

    if (!photo) {
      return res.status(404).json({ message: 'Foto não encontrada' });
    }

    // Delete file from filesystem
    const filepath = path.join(__dirname, '../../../Styles/img/eventos', photo.filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    // Delete from database
    await photo.destroy();

    res.json({ message: 'Foto deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar foto:', error);
    res.status(500).json({ message: 'Erro ao deletar foto', error: error.message });
  }
});

module.exports = router;
