/**
 * Script para criar/resetar usuário admin
 * Executa: node scripts/setup-admin.js
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config();

const setupAdmin = async () => {
  try {
    const dbPath = path.join(__dirname, '../db/paroquia.db');

    // Deletar banco antigo
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('📁 Banco de dados antigo removido');
    }

    // Importar Sequelize configurado
    const sequelize = require('../src/config/sequelize');

    console.log('🔗 Conectando ao SQLite...');
    await sequelize.authenticate();
    console.log('✅ Conexão estabelecida');

    // Importar todos os modelos
    const { Admin, Event, Chapel, ClergyMember, Guide, Inscription } = require('../src/models');

    // Sincronizar (criar tabelas)
    console.log('📊 Criando schema do banco de dados...');
    await sequelize.sync({ force: true });
    console.log('✅ Schema criado');

    // Criar admin
    console.log('👤 Criando usuário admin...');
    
    // A senha será hasheada pelo hook beforeCreate do modelo Admin
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@paroquia.com',
      password: 'admin123',  // Senha em plaintext - será hasheada pelo hook
      active: true,
    });

    console.log('\n✅ ========== SETUP CONCLUÍDO COM SUCESSO ==========');
    console.log('👤 Usuário Admin Criado:');
    console.log('   ID: ' + admin.id);
    console.log('   Usuário: admin');
    console.log('   Senha: admin123');
    console.log('   Email: admin@paroquia.com');
    console.log('   Status: Ativo');
    console.log('\n🔓 USE ESSAS CREDENCIAIS PARA LOGIN:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('================================================\n');
    
    // Verificar que foi criado e testar password
    const verify = await Admin.findOne({ where: { username: 'admin' } });
    if (verify) {
      console.log('✅ Verificação: Admin encontrado no banco de dados');
      const isValid = await verify.validatePassword('admin123');
      console.log('✅ Verificação de senha: ' + (isValid ? 'VÁLIDA' : 'INVÁLIDA'));
    }
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERRO ao configurar admin:');
    console.error('Mensagem:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
};

setupAdmin();
