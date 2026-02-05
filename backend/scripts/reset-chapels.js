const sequelize = require('../src/config/sequelize');
const Chapel = require('../src/models/Chapel');

const chapels = [
  {
    name: 'Igreja Matriz Santo André',
    neighborhood: 'Centro',
    coordinator: 'Padre João Carlos Silva',
    phone: '(14) 3234-5678',
    email: 'matriz@paroquiasantoandre.org.br',
    position: JSON.stringify({ x: 50, y: 45 }),
  },
  {
    name: 'Capela São José Operário',
    neighborhood: 'Vila dos Lagos',
    coordinator: 'Maria Aparecida Santos',
    phone: '(14) 3234-5680',
    email: 'saojoseoperario@paroquiasantoandre.org.br',
    position: JSON.stringify({ x: 35, y: 60 }),
  },
  {
    name: 'Capela Santa Terezinha',
    neighborhood: 'Árvores',
    coordinator: 'José Fernando Lima',
    phone: '(14) 3234-5681',
    email: 'santaterezinha@paroquiasantoandre.org.br',
    position: JSON.stringify({ x: 65, y: 35 }),
  },
  {
    name: 'Capela Nossa Senhora das Graças',
    neighborhood: 'Vila Dourados',
    coordinator: 'Ana Paula Rodrigues',
    phone: '(14) 3234-5682',
    email: 'nossasenhoragracas@paroquiasantoandre.org.br',
    position: JSON.stringify({ x: 70, y: 65 }),
  },
  {
    name: 'Capela Santa Paulina',
    neighborhood: 'Vila Brasil',
    coordinator: 'Carlos Eduardo Ferreira',
    phone: '(14) 3234-5683',
    email: 'santapaulina@paroquiasantoandre.org.br',
    position: JSON.stringify({ x: 30, y: 30 }),
  },
  {
    name: 'Capela Sagrada Família',
    neighborhood: 'Vila Cristal',
    coordinator: 'Mariana Costa Oliveira',
    phone: '(14) 3234-5684',
    email: 'sagradafamilia@paroquiasantoandre.org.br',
    position: JSON.stringify({ x: 55, y: 70 }),
  },
];

async function resetChapels() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    await sequelize.authenticate();
    
    console.log('🗑️  Removendo capelas existentes...');
    await Chapel.destroy({ where: {}, truncate: true });
    
    console.log('➕ Criando novas capelas...');
    for (const chapel of chapels) {
      await Chapel.create(chapel);
      console.log(`   ✅ ${chapel.name} - ${chapel.neighborhood}`);
    }
    
    console.log('\n✨ Capelas resetadas com sucesso!');
    console.log(`📊 Total: ${chapels.length} capelas cadastradas\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao resetar capelas:', error);
    process.exit(1);
  }
}

resetChapels();
