const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { EventPhoto, UploadedFile } = require('../models');

const router = express.Router();

const storage = multer.memoryStorage();

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
      const storedName = `event-${uuidv4()}${path.extname(file.originalname || '').toLowerCase()}`;

      await UploadedFile.create({
        folder: 'eventos',
        storedName,
        originalName: file.originalname || storedName,
        mimeType: file.mimetype || 'application/octet-stream',
        sizeBytes: Number(file.size || 0),
        data: file.buffer,
      });

      const imagePath = `/api/uploads/eventos/${storedName}`;
      const photo = await EventPhoto.create({
        eventId: eventId,
        filename: storedName,
        path: imagePath,
        imageUrl: imagePath,
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
      order: [['id', 'DESC']]
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

    if (photo.filename) {
      await UploadedFile.destroy({
        where: {
          folder: 'eventos',
          storedName: photo.filename,
        },
      });
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
