/**
 * Script para resetar banco de dados e recriar admin
 * Executa: node scripts/reset-db.js
 */

const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const resetDatabase = async () => {
  try {
    const dbPath = path.join(__dirname, '../db/paroquia.db');

    // Deletar banco antigo
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('📁 Banco de dados antigo removido');
    }

    // Criar nova conexão
    const { Sequelize } = require('sequelize');
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbPath,
      logging: false,
    });

    console.log('🔗 Conectando ao SQLite...');
    await sequelize.authenticate();

    // Definir Admin model
    const Admin = sequelize.define('Admin', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    }, { 
      timestamps: true,
      underscored: true,
    });

    // Sincronizar (criar tabelas)
    console.log('📊 Criando tabelas...');
    await sequelize.sync({ force: true });

    // Criar admin
    console.log('👤 Criando usuário admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await Admin.create({
      id: '123e4567-e89b-12d3-a456-426614174000',
      username: 'admin',
      email: 'admin@paroquia.com',
      password: hashedPassword,
      active: true,
    });

    console.log('✅ Banco de dados resetado com sucesso!');
    console.log('👤 Admin criado:');
    console.log('   Usuário: admin');
    console.log('   Senha: admin123');
    console.log('   Email: admin@paroquia.com');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao resetar banco:', error.message);
    process.exit(1);
  }
};

resetDatabase();
