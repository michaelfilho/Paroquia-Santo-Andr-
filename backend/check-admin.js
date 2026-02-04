const sequelize = require('./src/config/sequelize');
const { Admin } = require('./src/models');
const bcrypt = require('bcryptjs');

const checkAdmin = async () => {
  try {
    console.log('\n🔍 Verificando banco de dados...\n');
    
    // Conectar
    await sequelize.authenticate();
    console.log('✅ Conectado ao SQLite');
    
    // Buscar admin
    const admin = await Admin.findOne({ where: { username: 'admin' } });
    
    if (!admin) {
      console.log('❌ Admin NÃO encontrado no banco!');
      process.exit(0);
    }
    
    console.log('✅ Admin ENCONTRADO no banco!');
    console.log('\n📋 Dados no banco:');
    console.log('   ID:', admin.id);
    console.log('   Username:', admin.username);
    console.log('   Email:', admin.email);
    console.log('   Senha (hash):', admin.password.substring(0, 50) + '...');
    console.log('   Ativo:', admin.active);
    
    // Testar senha
    console.log('\n🔐 Testando senhas...');
    const test1 = await bcrypt.compare('admin123', admin.password);
    console.log('   admin123:', test1 ? '✅ VÁLIDA' : '❌ INVÁLIDA');
    
    const test2 = await bcrypt.compare('admin', admin.password);
    console.log('   admin:', test2 ? '✅ VÁLIDA' : '❌ INVÁLIDA');
    
    const test3 = await bcrypt.compare('123', admin.password);
    console.log('   123:', test3 ? '✅ VÁLIDA' : '❌ INVÁLIDA');
    
    console.log('\n✅ Verificação concluída!\n');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
};

checkAdmin();
