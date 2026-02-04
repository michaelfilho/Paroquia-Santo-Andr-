const path = require('path');
const fs = require('fs');
const sequelize = require('./src/config/sequelize');
const { Admin, Event, Chapel, ClergyMember, Guide, Inscription } = require('./src/models');
const bcrypt = require('bcryptjs');

const fullReset = async () => {
  try {
    console.log('\n🔄 ===== RESET COMPLETO DO BANCO =====\n');
    
    // Conectar
    console.log('1️⃣  Conectando...');
    await sequelize.authenticate();
    console.log('   ✅ Conectado');
    
    // Forçar sincronizar (recrear tudo)
    console.log('2️⃣  Recriando schema (force: true)...');
    await sequelize.sync({ force: true });
    console.log('   ✅ Schema recriado');
    
    // Verificar tabelas
    console.log('3️⃣  Verificando tabelas...');
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('   Tabelas criadas:', tables.join(', '));
    
    // Criar admin
    console.log('4️⃣  Criando admin...');
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@paroquia.com',
      password: 'admin123',
      active: true,
    });
    console.log('   ✅ Admin criado com ID:', admin.id);
    
    // Verificar
    console.log('5️⃣  Verificando admin...');
    const found = await Admin.findOne({ where: { username: 'admin' } });
    if (!found) {
      throw new Error('Admin não foi encontrado após criar!');
    }
    console.log('   ✅ Admin encontrado');
    
    // Testar senha
    console.log('6️⃣  Testando senha...');
    const isValid = await found.validatePassword('admin123');
    if (!isValid) {
      throw new Error('Senha inválida!');
    }
    console.log('   ✅ Senha VÁLIDA');
    
    console.log('\n✅ ===== RESET BEM-SUCEDIDO =====');
    console.log('\n🔐 Credenciais:');
    console.log('   Username: admin');
    console.log('   Password: admin123\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.error(error);
    process.exit(1);
  }
};

fullReset();
