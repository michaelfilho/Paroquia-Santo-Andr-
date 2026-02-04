const path = require('path');
const fs = require('fs');
const sequelize = require('./src/config/sequelize');

console.log('\n📊 ===== DIAGNÓSTICO DO BANCO =====\n');

// Mostrar config
const config = require('./src/config/database');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

console.log('🔧 Configuração:');
console.log('   Ambiente:', env);
console.log('   Storage:', dbConfig.storage);
console.log('   Arquivo existe:', fs.existsSync(dbConfig.storage) ? '✅ SIM' : '❌ NÃO');

if (fs.existsSync(dbConfig.storage)) {
  const stats = fs.statSync(dbConfig.storage);
  console.log('   Tamanho:', stats.size, 'bytes');
  console.log('   Modificado:', stats.mtime);
}

console.log('\n🔗 Sequelize:');
console.log('   Storage:', sequelize.options.storage);
console.log('   Mesmo arquivo:', sequelize.options.storage === dbConfig.storage ? '✅ SIM' : '❌ NÃO');

// Listar todos os .db na pasta
console.log('\n📁 Arquivos .db encontrados:');
const dbDir = path.dirname(dbConfig.storage);
if (fs.existsSync(dbDir)) {
  const files = fs.readdirSync(dbDir);
  if (files.length === 0) {
    console.log('   Nenhum arquivo .db found');
  } else {
    files.forEach(f => {
      const fullPath = path.join(dbDir, f);
      const stats = fs.statSync(fullPath);
      console.log(`   ${f} (${stats.size} bytes)`);
    });
  }
}

process.exit(0);
