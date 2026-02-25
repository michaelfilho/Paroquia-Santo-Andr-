const express = require('express');
const router = express.Router();
const upload = require('../config/upload');

// POST - Upload de imagem dinâmico em /api/upload/:folder
router.post('/:folder', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem foi enviada' });
    }

    console.log('📸 Upload recebido na pasta:', req.params.folder);

    // Salvar o caminho como /api/uploads/NOME_PASTA/arquivo.jpg
    const filePath = `/api/uploads/${req.params.folder}/${req.file.filename}`;

    res.status(201).json({
      success: true,
      url: filePath,
      imageUrl: filePath, // Para retrocompatibilidade de logs frontend
      filename: req.file.filename,
    });
  } catch (error) {
    console.error('❌ Erro no upload:', error);
    res.status(500).json({ message: 'Erro ao fazer upload da imagem', error: error.message });
  }
});

// Suportar rota padrão raiz
router.post('/', upload.single('image'), (req, res) => {
  req.params.folder = 'geral';

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem foi enviada' });
    }

    const filePath = `/api/uploads/geral/${req.file.filename}`;

    res.status(201).json({
      success: true,
      url: filePath,
      imageUrl: filePath,
      filename: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer upload da imagem' });
  }
});

module.exports = router;
