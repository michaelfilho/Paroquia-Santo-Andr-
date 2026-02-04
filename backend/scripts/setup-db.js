/**
 * Script para criar banco de dados SQLite
 * Executa: node scripts/setup-db.js
 */

const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');

const createDatabase = async () => {
  try {
    const dbPath = path.join(__dirname, '../db');
    const dbFile = path.join(dbPath, 'paroquia.db');

    // Criar pasta db se não existir
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
      console.log(`📁 Pasta "db" criada`);
    }

    // Criar conexão com SQLite
    console.log('🔗 Conectando ao SQLite...');
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbFile,
      logging: false,
    });

    // Testar conexão
    await sequelize.authenticate();
    console.log('✅ Conexão com SQLite estabelecida com sucesso!');
    
    console.log(`📦 Banco de dados em: ${dbFile}`);
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar banco de dados:', error.message);
    process.exit(1);
  }
};

createDatabase();
