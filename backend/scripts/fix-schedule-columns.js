/**
 * Script para corrigir o tamanho das colunas time_start e time_end
 * Executa SQL direto no PostgreSQL
 * 
 * Usage: node backend/scripts/fix-schedule-columns.js
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const sequelize = require('../src/config/sequelize');

const fixScheduleColumns = async () => {
  try {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🔧 CORRIGINDO COLUNAS time_start E time_end');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('⏳ Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conectado com sucesso!\n');

    console.log('🔍 Verificando estrutura atual das colunas...');
    
    // Executar query para aumentar as colunas
    const dialect = sequelize.options.dialect;
    
    if (dialect === 'sqlite') {
      console.log('📊 Banco: SQLite (não precisa de ALTER)');
      console.log('✅ SQLite não tem limite de tamanho de VARCHAR fixo\n');
    } else if (dialect === 'postgres' || dialect === 'postgresql') {
      console.log('📊 Banco: PostgreSQL');
      console.log('⏳ Executando ALTER TABLE...\n');

      // Aumentar time_start
      console.log('1️⃣ Aumentando coluna time_start de 10 para 50 caracteres...');
      await sequelize.query(`
        ALTER TABLE schedules 
        ALTER COLUMN time_start TYPE VARCHAR(50);
      `);
      console.log('✅ time_start alterada com sucesso!\n');

      // Aumentar time_end
      console.log('2️⃣ Aumentando coluna time_end de 10 para 50 caracteres...');
      await sequelize.query(`
        ALTER TABLE schedules 
        ALTER COLUMN time_end TYPE VARCHAR(50);
      `);
      console.log('✅ time_end alterada com sucesso!\n');

      // Verificar o resultado
      console.log('3️⃣ Verificando estrutura atualizada...');
      const result = await sequelize.query(`
        SELECT column_name, data_type, character_maximum_length 
        FROM information_schema.columns 
        WHERE table_name = 'schedules' 
        AND column_name IN ('time_start', 'time_end');
      `);
      
      console.log('Colunas atuais:');
      result[0].forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}(${col.character_maximum_length})`);
      });
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ CORRIGIDO COM SUCESSO!');
    console.log('═══════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

fixScheduleColumns();
