const express = require('express');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

const router = express.Router();

const toClientRole = (role) => (role === 'superadmin' ? 'super' : role);

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('🔐 Login attempt:', { username, password: password ? '***' : 'vazio' });

    if (!username || !password) {
      console.log('❌ Campos vazios');
      return res.status(400).json({ message: 'Username e password são obrigatórios' });
    }

    const admin = await Admin.findOne({ where: { username } });
    console.log('👤 Admin encontrado:', admin ? `Sim (ID: ${admin.id})` : 'Não');

    if (!admin) {
      console.log('❌ Admin não encontrado com username:', username);
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    if (!admin.role) {
      admin.role = admin.username === 'admin' ? 'superadmin' : 'admin';
      await admin.save();
    }

    const isPasswordValid = await admin.validatePassword(password);
    console.log('🔑 Senha válida:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Senha inválida');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    console.log('✅ Login bem-sucedido, token gerado');

    res.json({
      message: 'Login realizado com sucesso',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: toClientRole(admin.role),
      },
    });
  } catch (error) {
    console.error('❌ Erro no login:', error.message);
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
});

router.post('/verify-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, message: 'Token inválido ou expirado' });
  }
});

module.exports = router;
