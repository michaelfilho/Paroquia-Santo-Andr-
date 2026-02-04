const path = require('path');
const fs = require('fs');

// Criar pasta se não existir
const dbDir = path.join(__dirname, '../db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('✅ Pasta db criada');
}

console.log('📁 Caminho do banco:', path.join(dbDir, 'paroquia.db'));

// Agora carregar o Sequelize
const sequelize = require('../src/config/sequelize');
const { Admin, Event, Chapel, ClergyMember, Guide, Inscription } = require('../src/models');
const bcrypt = require('bcryptjs');

const setup = async () => {
  try {
    console.log('\n🔄 ===== SETUP FINAL DO BANCO =====\n');
    
    // Conectar
    console.log('1️⃣  Conectando ao SQLite...');
    await sequelize.authenticate();
    console.log('   ✅ Conectado');
    
    // Sincronizar com force
    console.log('2️⃣  Criando schema (force: true)...');
    await sequelize.sync({ force: true });
    console.log('   ✅ Schema criado');
    
    // Listar tabelas
    console.log('3️⃣  Verificando tabelas...');
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('   Tabelas:', tables.join(', '));
    
    // Criar admin
    console.log('4️⃣  Criando admin...');
    const admin = await Admin.create({
      username: 'admin',
      password: 'admin123',
    });
    console.log('   ✅ Admin criado:', admin.id);
    
    // Verificar admin
    console.log('5️⃣  Buscando admin no banco...');
    const found = await Admin.findOne({ where: { username: 'admin' } });
    if (!found) throw new Error('Admin não encontrado!');
    console.log('   ✅ Admin encontrado:', found.username);
    
    // Testar senha
    console.log('6️⃣  Testando senha...');
    const valid = await found.validatePassword('admin123');
    console.log('   Senha admin123:', valid ? '✅ VÁLIDA' : '❌ INVÁLIDA');
    
    if (!valid) throw new Error('Senha não é válida!');
    
    console.log('\n✅ ===== SETUP CONCLUÍDO COM SUCESSO =====');
    console.log('\n🔐 Login:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n📁 Banco salvo em:', path.join(dbDir, 'paroquia.db'));
    console.log('\n✅ Próximo passo: npm run dev\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  }
};

setup();
