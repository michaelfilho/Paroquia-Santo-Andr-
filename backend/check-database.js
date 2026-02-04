const sequelize = require('./src/config/sequelize');
const { Admin, Event, Chapel, ClergyMember, Guide, Inscription } = require('./src/models');

const checkDatabase = async () => {
  try {
    console.log('\n📊 ===== VERIFICAÇÃO COMPLETA DO BANCO =====\n');
    
    // Conectar
    await sequelize.authenticate();
    console.log('✅ Conectado ao SQLite');
    console.log('📁 Arquivo:', sequelize.options.storage);
    console.log('');
    
    // Verificar cada tabela
    console.log('📋 TABELAS E DADOS:\n');
    
    // Admins
    const admins = await Admin.findAll();
    console.log('👤 ADMINS:', admins.length, 'registro(s)');
    if (admins.length > 0) {
      admins.forEach(a => {
        console.log(`   - ${a.username} (${a.email}) - ${a.active ? 'Ativo' : 'Inativo'}`);
      });
    }
    console.log('');
    
    // Events
    const events = await Event.findAll();
    console.log('📅 EVENTS:', events.length, 'registro(s)');
    if (events.length > 0) {
      events.forEach(e => {
        console.log(`   - ${e.title} (${e.date})`);
      });
    }
    console.log('');
    
    // Chapels
    const chapels = await Chapel.findAll();
    console.log('⛪ CHAPELS:', chapels.length, 'registro(s)');
    if (chapels.length > 0) {
      chapels.forEach(c => {
        console.log(`   - ${c.name} (${c.neighborhood})`);
      });
    }
    console.log('');
    
    // Clergy
    const clergy = await ClergyMember.findAll();
    console.log('✝️  CLERGY:', clergy.length, 'registro(s)');
    if (clergy.length > 0) {
      clergy.forEach(c => {
        console.log(`   - ${c.name} (${c.role})`);
      });
    }
    console.log('');
    
    // Guides
    const guides = await Guide.findAll();
    console.log('📖 GUIDES:', guides.length, 'registro(s)');
    if (guides.length > 0) {
      guides.forEach(g => {
        console.log(`   - ${g.title}`);
      });
    }
    console.log('');
    
    // Inscriptions
    const inscriptions = await Inscription.findAll();
    console.log('📝 INSCRIPTIONS:', inscriptions.length, 'registro(s)');
    if (inscriptions.length > 0) {
      inscriptions.forEach(i => {
        console.log(`   - ${i.name} (${i.email})`);
      });
    }
    console.log('');
    
    // Resumo
    const total = admins.length + events.length + chapels.length + clergy.length + guides.length + inscriptions.length;
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 TOTAL DE REGISTROS:', total);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    if (total === 0) {
      console.log('⚠️  Banco de dados está vazio (exceto admin)!');
    } else {
      console.log('✅ Banco de dados tem dados armazenados!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  }
};

checkDatabase();
