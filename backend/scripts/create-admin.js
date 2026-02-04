const sequelize = require('../src/config/sequelize');
const { Admin } = require('../src/models');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    console.log('🔐 Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conectado');

    console.log('🔄 Sincronizando schema...');
    await sequelize.sync();
    console.log('✅ Schema sincronizado');

    console.log('👤 Verificando admin...');
    const adminExists = await Admin.findOne({ where: { username: 'admin' } });

    if (adminExists) {
      console.log('✅ Admin já existe');
    } else {
      console.log('🆕 Criando admin...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        password: hashedPassword,
      });
      console.log('✅ Admin criado com sucesso');
      console.log('👤 Usuário: admin');
      console.log('🔑 Senha: admin123');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

createAdmin();
