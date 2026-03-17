/**
 * Script para remover TODAS as programações do banco de produção
 * Suporta SQLite (local) e PostgreSQL (produção)
 * 
 * Usage: 
 *   npm run dev (deixar rodando)
 *   Em outro terminal: node backend/scripts/clear-all-schedules.js
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const sequelize = require('../src/config/sequelize');
const { Schedule } = require('../src/models');

const clearAllSchedules = async () => {
  try {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🗑️  LIMPEZA COMPLETA DE TODAS AS PROGRAMAÇÕES');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('⏳ Conectando ao banco de dados...');
    console.log(`   Tipo: ${sequelize.options.dialect}`);
    console.log(`   Host: ${sequelize.options.host || 'SQLite (local)'}\n`);

    await sequelize.authenticate();
    console.log('✅ Conexão com sucesso!\n');

    // 1. Verificar dados antes
    console.log('1️⃣ Verificando programações existentes...');
    const beforeCount = await Schedule.count();
    console.log(`   Total de programações encontradas: ${beforeCount}\n`);

    if (beforeCount === 0) {
      console.log('✅ Nenhuma programação encontrada. Banco já está limpo!');
      console.log('═══════════════════════════════════════════════════════════\n');
      process.exit(0);
    }

    // 2. Remover todas
    console.log('2️⃣ Deletando todas as programações...');
    const deleteResult = await Schedule.destroy({
      where: {},
      truncate: true,
      force: true,
    });
    console.log(`   Registros deletados: ${deleteResult}\n`);

    // 3. Verificar dados depois
    console.log('3️⃣ Verificando se foram realmente deletados...');
    const afterCount = await Schedule.count();
    console.log(`   Total de programações restantes: ${afterCount}\n`);

    if (afterCount === 0) {
      console.log('✅ SUCESSO! Todas as programações foram removidas do banco!');
    } else {
      console.error(`⚠️  AVISO: Ainda existem ${afterCount} programações no banco!`);
    }

    console.log('═══════════════════════════════════════════════════════════\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

clearAllSchedules();
