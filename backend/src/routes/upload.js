const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const upload = require('../config/upload');
const { UploadedFile } = require('../models');

const toSafeFolder = (folder) => {
  const normalized = String(folder || 'geral').trim().replace(/[^a-zA-Z0-9_-]/g, '');
  return normalized || 'geral';
};

const buildStoredName = (originalname) => {
  const ext = path.extname(originalname || '').toLowerCase();
  return `${uuidv4()}${ext}`;
};

// POST - Upload de imagem dinâmico em /api/upload/:folder
router.post('/:folder', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem foi enviada' });
    }

    const folder = toSafeFolder(req.params.folder);
    const storedName = buildStoredName(req.file.originalname);

    await UploadedFile.create({
      folder,
      storedName,
      originalName: req.file.originalname || storedName,
      mimeType: req.file.mimetype || 'application/octet-stream',
      sizeBytes: Number(req.file.size || 0),
      data: req.file.buffer,
    });

    const filePath = `/api/uploads/${folder}/${storedName}`;
    res.status(201).json({
      success: true,
      url: filePath,
      imageUrl: filePath,
      filename: storedName,
    });
  } catch (error) {
    console.error('❌ Erro no upload:', error);
    res.status(500).json({ message: 'Erro ao fazer upload da imagem', error: error.message });
  }
});

// Suportar rota padrão raiz
router.post('/', upload.single('image'), async (req, res) => {
  req.params.folder = 'geral';

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem foi enviada' });
    }

    const folder = 'geral';
    const storedName = buildStoredName(req.file.originalname);

    await UploadedFile.create({
      folder,
      storedName,
      originalName: req.file.originalname || storedName,
      mimeType: req.file.mimetype || 'application/octet-stream',
      sizeBytes: Number(req.file.size || 0),
      data: req.file.buffer,
    });

    const filePath = `/api/uploads/geral/${storedName}`;
    res.status(201).json({
      success: true,
      url: filePath,
      imageUrl: filePath,
      filename: storedName,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer upload da imagem', error: error.message });
  }
});

module.exports = router;
