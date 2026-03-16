require('dotenv').config();

const sequelize = require('../src/config/sequelize');
const { Admin } = require('../src/models');

const resolveRole = (role) => {
  if (role === 'superadmin' || role === 'admin') return role;
  return 'superadmin';
};

async function ensureAdmin() {
  const username = (process.env.ADMIN_USERNAME || 'admin@cit.com').trim();
  const password = process.env.ADMIN_PASSWORD || 'Troque_Essa_Senha_123!';
  const role = resolveRole((process.env.ADMIN_ROLE || 'superadmin').trim());

  if (!username || !password) {
    throw new Error('ADMIN_USERNAME e ADMIN_PASSWORD sao obrigatorios.');
  }

  try {
    await sequelize.authenticate();

    const existing = await Admin.findOne({ where: { username } });
    if (existing) {
      if (existing.role !== role) {
        await existing.update({ role });
        console.log(`Admin existente atualizado: ${username} (role=${role})`);
      } else {
        console.log(`Admin ja existe: ${username}`);
      }
      process.exit(0);
    }

    await Admin.create({ username, password, role });
    console.log(`Admin criado: ${username} (role=${role})`);
    process.exit(0);
  } catch (error) {
    console.error('Erro ao garantir admin:', error.message);
    process.exit(1);
  }
}

ensureAdmin();
