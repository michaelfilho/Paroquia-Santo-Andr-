const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const sequelize = require('../src/config/sequelize');
const { Event, Inscription } = require('../src/models');

const clearAllEvents = async () => {
  try {
    console.log('\n🔄 ========== LIMPANDO BANCO DE DADOS ==========');
    
    await sequelize.authenticate();
    console.log('✅ Banco de dados autenticado');
    
    // Contar eventos antes
    const eventCountBefore = await Event.count();
    const inscriptionCountBefore = await Inscription.count();
    
    console.log(`\n📊 Estado atual:`);
    console.log(`   - Eventos: ${eventCountBefore}`);
    console.log(`   - Inscrições: ${inscriptionCountBefore}`);
    
    // Deletar todas as inscrições primeiro
    const deletedInscriptions = await Inscription.destroy({ where: {} });
    console.log(`\n🗑️  Deletadas ${deletedInscriptions} inscrições`);
    
    // Deletar todos os eventos
    const deletedEvents = await Event.destroy({ where: {} });
    console.log(`🗑️  Deletados ${deletedEvents} eventos`);
    
    // Verificar resultado
    const eventCountAfter = await Event.count();
    const inscriptionCountAfter = await Inscription.count();
    
    console.log(`\n✅ Estado após limpeza:`);
    console.log(`   - Eventos: ${eventCountAfter}`);
    console.log(`   - Inscrições: ${inscriptionCountAfter}`);
    
    console.log('\n✅ Limpeza concluída com sucesso!');
    console.log('========== FIM DA LIMPEZA ==========\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro ao limpar banco de dados:', error.message);
    console.error(error);
    process.exit(1);
  }
};

clearAllEvents();
