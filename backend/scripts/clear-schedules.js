/**
 * Script para remover todas as programações do banco de dados
 * Usage: node backend/scripts/clear-schedules.js
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const sequelize = require('../src/config/sequelize');
const { Schedule } = require('../src/models');

const clearSchedules = async () => {
  try {
    console.log('Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados com sucesso.');

    console.log('\n🔍 Verificando programações existentes...');
    const scheduleCount = await Schedule.count();
    console.log(`Found ${scheduleCount} schedule(s)`);

    if (scheduleCount === 0) {
      console.log('✅ Nenhuma programação encontrada. Banco já está limpo.');
      process.exit(0);
    }

    console.log('\n🗑️ Removendo todas as programações...');
    await Schedule.destroy({
      where: {},
      truncate: true,
      force: true,
    });

    const newCount = await Schedule.count();
    console.log(`✅ Programações removidas com sucesso! Restantes: ${newCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao limpar programações:', error);
    process.exit(1);
  }
};

clearSchedules();
