const express = require('express');
const { Admin } = require('../models');

const router = express.Router();

const toClientRole = (role) => (role === 'superadmin' ? 'super' : role);
const toDbRole = (role) => (role === 'super' ? 'superadmin' : role);

const normalizeRole = (admin) => {
  if (!admin.role) {
    return admin.username === 'admin' ? 'superadmin' : 'admin';
  }
  return toDbRole(admin.role);
};

const toSafeAdmin = (admin) => ({
  id: admin.id,
  username: admin.username,
  role: toClientRole(normalizeRole(admin)),
});

router.use(async (req, res, next) => {
  try {
    const currentAdmin = await Admin.findByPk(req.user?.id);
    if (!currentAdmin) {
      return res.status(404).json({ message: 'Admin não encontrado' });
    }

    const role = normalizeRole(currentAdmin);
    if (!currentAdmin.role || currentAdmin.role !== role) {
      currentAdmin.role = role;
      await currentAdmin.save();
    }

    req.currentAdmin = currentAdmin;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao validar admin', error: error.message });
  }
});

const requireSuperAdmin = (req, res, next) => {
  if (normalizeRole(req.currentAdmin) !== 'superadmin') {
    return res.status(403).json({ message: 'Acesso restrito ao administrador principal' });
  }
  next();
};

router.get('/me', (req, res) => {
  res.json(toSafeAdmin(req.currentAdmin));
});

router.put('/me', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username && !password) {
      return res.status(400).json({ message: 'Informe dados para atualizar' });
    }

    const updates = {};

    if (username) {
      const trimmed = username.trim();
      if (trimmed.length < 3) {
        return res.status(400).json({ message: 'Username deve ter pelo menos 3 caracteres' });
      }
      const existing = await Admin.findOne({ where: { username: trimmed } });
      if (existing && existing.id !== req.currentAdmin.id) {
        return res.status(409).json({ message: 'Username já está em uso' });
      }
      updates.username = trimmed;
    }

    if (password) {
      if (String(password).length < 6) {
        return res.status(400).json({ message: 'Senha deve ter pelo menos 6 caracteres' });
      }
      updates.password = password;
    }

    await req.currentAdmin.update(updates);
    res.json({
      message: 'Dados atualizados com sucesso',
      admin: toSafeAdmin(req.currentAdmin),
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar dados', error: error.message });
  }
});

router.get('/', requireSuperAdmin, async (req, res) => {
  try {
    const admins = await Admin.findAll({ order: [['username', 'ASC']] });
    res.json(admins.map(toSafeAdmin));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar administradores', error: error.message });
  }
});

router.post('/', requireSuperAdmin, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username e senha são obrigatórios' });
    }

    const trimmed = username.trim();
    if (trimmed.length < 3) {
      return res.status(400).json({ message: 'Username deve ter pelo menos 3 caracteres' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Senha deve ter pelo menos 6 caracteres' });
    }

    const existing = await Admin.findOne({ where: { username: trimmed } });
    if (existing) {
      return res.status(409).json({ message: 'Username já está em uso' });
    }

    const admin = await Admin.create({
      username: trimmed,
      password,
      role: 'admin',
    });

    res.status(201).json({
      message: 'Administrador criado com sucesso',
      admin: toSafeAdmin(admin),
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar administrador', error: error.message });
  }
});

router.put('/:id', requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (String(req.currentAdmin.id) === String(id)) {
      return res.status(400).json({ message: 'Use a rota /me para atualizar sua conta' });
    }

    const target = await Admin.findByPk(id);
    if (!target) {
      return res.status(404).json({ message: 'Administrador não encontrado' });
    }

    const { username, password, role } = req.body;
    const updates = {};

    if (username) {
      const trimmed = username.trim();
      if (trimmed.length < 3) {
        return res.status(400).json({ message: 'Username deve ter pelo menos 3 caracteres' });
      }
      const existing = await Admin.findOne({ where: { username: trimmed } });
      if (existing && existing.id !== target.id) {
        return res.status(409).json({ message: 'Username já está em uso' });
      }
      updates.username = trimmed;
    }

    if (password) {
      if (String(password).length < 6) {
        return res.status(400).json({ message: 'Senha deve ter pelo menos 6 caracteres' });
      }
      updates.password = password;
    }

    if (role) {
      if (!['admin', 'super', 'superadmin'].includes(role)) {
        return res.status(400).json({ message: 'Role inválido' });
      }
      updates.role = toDbRole(role);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'Informe dados para atualizar' });
    }

    await target.update(updates);
    res.json({
      message: 'Administrador atualizado com sucesso',
      admin: toSafeAdmin(target),
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar administrador', error: error.message });
  }
});

router.delete('/:id', requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (String(req.currentAdmin.id) === String(id)) {
      return res.status(400).json({ message: 'Você não pode excluir seu próprio usuário' });
    }

    const target = await Admin.findByPk(id);
    if (!target) {
      return res.status(404).json({ message: 'Administrador não encontrado' });
    }

    await target.destroy();
    res.json({ message: 'Administrador removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover administrador', error: error.message });
  }
});

module.exports = router;
