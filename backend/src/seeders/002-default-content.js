const { Event, Chapel, ClergyMember, Guide, ContentText, PastoralMovement } = require('../models');
const { Admin } = require('../models');
const bcrypt = require('bcryptjs');

const defaultChapels = [
  {
    name: 'Capela Sagrada Família',
    street: 'Avenida das Orquídeas, 980',
    neighborhood: 'Vila das Árvores',
    imageUrl: '/api/uploads/geral/8a6c26bd-70be-4e78-9deb-4200c4a5a235.png',
  },
  {
    name: 'Capela Santa Paulina e Santa Rita de Cassia',
    street: 'Rua Amapá, 105',
    neighborhood: 'Vila Brasil',
    imageUrl: '/api/uploads/geral/5173ea57-e605-499c-85a1-5b78e51a455b.png',
  },
  {
    name: 'Capela Nossa Senhora das Graças',
    street: 'Avenida Orquídeas, 285',
    neighborhood: 'Vila das Árvores',
    imageUrl: '/api/uploads/geral/c161e985-47e3-48db-a23c-0e9501a4251b.png',
  },
  {
    name: 'Capela Santa Terezinha e São José Operário',
    street: 'Rua Pequi, 1720',
    neighborhood: 'Jardim das Árvores II',
    imageUrl: '/api/uploads/geral/8966e65a-a7fb-4445-89a8-f453b433e17f.png',
  },
  {
    name: 'Capela do Santo Antônio',
    street: 'Unnamed Road',
    neighborhood: 'Unnamed Road',
    imageUrl: '/api/uploads/geral/2d590665-8e29-41da-8692-35762f21880f.png',
  },
  {
    name: 'Capela São Benedito',
    street: 'Bairro Água da Onça, Tarumã - SP',
    neighborhood: 'Água da Onça',
    imageUrl: '/api/uploads/geral/7798ad56-e6bf-4edb-86e2-40b85247c175.png',
  },
];

const defaultClergy = [
  {
    name: 'Padre José Joaquim Damásio Neto',
    role: 'Pároco',
    startYear: '2026',
    bio: '',
    isCurrent: true,
    imageUrl: '/api/uploads/whatsapp-image-2026-02-03-at-103915-1-1770643903292-690089667.jpeg',
  },
  {
    name: 'Padre Clóvis Alves Da Silva',
    role: 'Vigário Paroquial',
    startYear: '2026',
    bio: '',
    isCurrent: true,
    imageUrl: '/api/uploads/whatsapp-image-2026-02-04-at-114159-1770643998075-92467154.jpeg',
  },
];

const defaultGuides = [
  {
    title: 'Guia de Casamento',
    description: 'Informações essenciais para celebração do sacramento do matrimônio',
    details: [
      'Documentação necessária (certidão de nascimento, batismo)',
      'Preparação pré-matrimonial (3 encontros obrigatórios)',
      'Entrevista com o pároco',
      'Período de noivado recomendado',
      'Data e horários disponíveis para cerimônia',
      'Orientações sobre a liturgia do matrimônio',
      'Normas sobre padrinhos e convidados',
      'Custos e taxas da paróquia',
    ],
  },
  {
    title: 'Guia de Batismo',
    description: 'Tudo o que você precisa saber sobre o batismo e iniciação cristã',
    details: [
      'Documentação da criança (certidão de nascimento)',
      'Escolha de padrinhos qualificados',
      'Preparação espiritual dos pais',
      'Entrevista com o pároco ou catequista',
      'Escolha do nome do santo padroeiro',
      'Data e horários disponíveis para batismo',
      'Preparação da vela batismal',
      'Significado dos símbolos batismais',
    ],
  },
  {
    title: 'Guia de Catequese',
    description: 'Informações sobre os programas de catequese paroquial',
    details: [
      'Catequese infantil (6-12 anos)',
      'Catequese de adolescentes (12-17 anos)',
      'Catequese de adultos',
      'Preparação para Primeira Comunhão',
      'Preparação para Confirmação',
      'Cronograma e dias de encontro',
      'Catequistas responsáveis e horários',
      'Material didático disponível',
    ],
  },
  {
    title: 'Guia de Coroinha',
    description: 'Orientações para crianças que desejam servir no altar',
    details: [
      'Idade mínima recomendada',
      'Treinamento e preparação litúrgica',
      'Uniforme e indumentária',
      'Responsabilidades no altar',
      'Calendário de rodízios e missas',
      'Atividades sociais e confraternizações',
      'Formação espiritual contínua',
      'Requisitos de frequência',
    ],
  },
  {
    title: 'Guia de Acólito',
    description: 'Informações sobre ministério de acólito e vida litúrgica',
    details: [
      'Formação teológica básica',
      'Preparação para os sacramentos',
      'Funções litúrgicas do acólito',
      'Compromisso com a paróquia',
      'Encontros de formação regular',
      'Participação em celebrações especiais',
      'Vida espiritual e oração',
      'Possibilidade de ordenação diaconal',
    ],
  },
  {
    title: 'Guia de Ministro',
    description: 'Guia para ministros leigos que servem na comunidade paroquial',
    details: [
      'Ministério da Eucaristia',
      'Ministério da Palavra',
      'Ministério de Acompanhamento',
      'Visita aos enfermos',
      'Formação continuada obrigatória',
      'Compromisso e frequência esperados',
      'Participação em retiros espirituais',
      'Suporte e comunhão entre ministros',
    ],
  },
];

const defaultEvents = [
  {
    title: 'Missa Solene de Santo André',
    date: '2026-11-30',
    time: '19:30',
    location: 'Igreja Matriz Santo André',
    description: 'Celebração em honra ao padroeiro da paróquia com participação das pastorais.',
    category: 'liturgia',
    isProgram: false,
    isActive: true,
    isPublished: true,
  },
  {
    title: 'Adoração ao Santíssimo',
    date: '2026-03-05',
    time: '20:00 às 20:00',
    location: 'Capela do Santíssimo',
    description: 'Momento comunitário de oração, silêncio e intercessão.',
    category: 'Evento',
    isProgram: false,
    isActive: false,
    isPublished: true,
  },
];

const defaultPastoralMovements = [
  {
    name: 'Catequese Paroquial',
    description:
      'A principal missão da catequese é a Iniciação à Vida Cristã. O grupo acompanha crianças, jovens e adultos na preparação para os sacramentos do Batismo, Eucaristia e Crisma.',
    meetings: 'Sábados às 09h e Domingos às 08h30',
  },
  {
    name: 'Ministério de Música',
    description:
      'Responsável por animar as Santas Missas e demais celebrações da paróquia. Através do canto e dos instrumentos, ajudam a assembleia a rezar e louvar a Deus.',
    meetings: 'Ensaios às Quartas-feiras, 19h30',
  },
  {
    name: 'Grupo de Oração (RCC)',
    description:
      'Encontros semanais de louvor, pregação da Palavra, oração por cura e libertação, vivenciando a espiritualidade da Renovação Carismática Católica.',
    meetings: 'Terças-feiras às 20h',
  },
];

const defaultContentEntries = [
  {
    key: 'about',
    title: 'Sobre Nós',
    content: 'A Paróquia Santo André é uma comunidade de fé localizada em Tarumã,',
  },
  {
    key: 'full_history',
    title: 'Nossa História Completa',
    content:
      'A história da Paróquia Santo André se entrelaça intimamente com as raízes de Tarumã.\nNos idos de 1952, uma modesta porção de terras doada por famílias pioneiras serviu como solo fértil para a primeira capelinha. Os corações dos antigos habitantes batiam em uníssono sob os repiques do pequeno sino improvisado que conclamava à oração. Era uma época de estradas de terra roxa e campos abertos, onde a fé era o alicerce principal diante do cansaço da lavoura.\nAo longo dos anos, o amor abnegado dos presbíteros e da comunidade leiga provou-se formidável. As tradicionais quermesses ganharam fama, mobilizando jovens e adultos que preparavam de mãos dadas os doces caseiros e os enfeites no pátio, revertendo todas as economias para as obras da Casa do Senhor.\nSob o patrocínio de Santo André Apóstolo, aprendemos a ser "pescadores", lançando as redes do evangelho nas realidades difíceis. Desde a fundação do vicentos e a criação de corais que ainda hoje ecoam sob a abóbada principal, cada tijolo desta igreja matriz tem incrustada a lágrima e a prece sincera de nosso povo. Hoje, miramos um futuro cheio de sol, baseados na firme rocha plantada por aqueles gigantes do passado.',
  },
  {
    key: 'about_stats',
    title: 'Sobre - Estatísticas',
    content: JSON.stringify({ chapelsCount: '5', pastoralGroups: '10+', yearsHistory: '72' }),
  },
  {
    key: 'footer_config',
    title: 'Rodapé - Configuração',
    content: JSON.stringify({
      parishName: 'Paróquia Santo André',
      cityState: 'Tarumã - SP',
      aboutText: 'Uma comunidade de fé, esperança e amor servindo Tarumã desde 1952.',
      phone: '(18) 99799-4927',
      phoneLink: '18997994927',
      email: 'parsant@hotmail.com',
      addressLines: ['Rua das Violetas, 126', 'Centro - Tarumã/SP', 'CEP: 19820035'],
      instagramUrl: 'https://www.instagram.com/paroquiasantoandre.taruma/',
      facebookUrl: 'https://www.facebook.com/paroquia.santoandre.37',
      copyrightText: '© 2026 Paróquia Santo André. Todos os direitos reservados.',
      privacyLabel: 'Política de Privacidade',
      termsLabel: 'Termos de Uso',
    }),
  },
  {
    key: 'dizimo_config',
    title: 'Dízimo - Configuração',
    content: JSON.stringify({
      pixKey: 'paroquia@santoandre.org.br',
      whatsappUrl: 'https://wa.me/5518997994927',
      quote: '"Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria."',
      quoteRef: '(2 Coríntios 9:7)',
      bankName: 'SICOOB - CREDIMOTA',
      agency: '3190',
      account: '32.586-4',
      holder: 'Paróquia Santo André - Tarumã/SP',
      cnpj: '44.375.186/0032-35',
    }),
  },
  { key: 'lit_candles_count', title: 'Contador de Velas Acesas', content: '0' },
  { key: 'site_visits_count', title: 'Contador de Acessos ao Site', content: '0' },
  {
    key: 'brasao',
    title: 'Brasão Paroquial',
    content:
      'No alvorecer dos tempos, quando a esperança ainda era cultivada com as mãos e a fé guiava os caminhos, ergueu-se um símbolo destinado a perpetuar valores que jamais deveriam se perder.\n\nEste brasão nasce da união entre coragem, sabedoria e perseverança. Cada elemento nele presente carrega consigo uma história: as cores representam virtudes eternas, as formas revelam a harmonia entre força e humildade, e os símbolos recordam que todo caminho exige esforço, fé e dedicação.\n\nDiz-se que aqueles que o carregam não apenas herdam um emblema, mas assumem um compromisso — o de honrar o passado, agir com justiça no presente e construir um futuro digno.\n\nO escudo protege, mas também ensina: é na adversidade que se fortalece o caráter. O ornamento não é apenas beleza, mas sinal de dignidade. E o lema, inscrito com firmeza, ecoa como um chamado à missão.\n\nAssim, este brasão não é apenas um símbolo.\nÉ um legado.\n\nUm testemunho de que, mesmo diante das tempestades, aqueles que permanecem firmes na verdade e na fé jamais serão vencidos.',
    imageUrl: '/api/uploads/geral/8597d873-d861-4955-8b67-24b0d7aae47a.png',
  },
  {
    key: 'hero_primary_slide',
    title: 'Slide principal da Home',
    content: JSON.stringify({
      imageUrl: '/api/uploads/geral/9745bcfa-cc9a-4520-b26e-d061fd3457a3.jpeg',
      mobileImageUrl: '/api/uploads/geral/ddf48dc0-b656-4b63-b076-515523b4e09d.jpeg',
      title: 'Bem-vindo à',
      titleHighlight: 'Paróquia Santo André',
      subtitle: 'Uma comunidade de fé, esperança e amor em Tarumã',
      link: '#sobre',
      buttonText: 'Conheça Nossa História',
      titleColor: '#FFFFFF',
      titleColorEnd: '#F59E0B',
      subtitleColor: '#F3F4F6',
      linkColor: '#FFFFFF',
    }),
    imageUrl: '/api/uploads/geral/9745bcfa-cc9a-4520-b26e-d061fd3457a3.jpeg',
  },
  {
    key: 'map_main_card',
    title: 'Card principal do mapa',
    content: JSON.stringify({
      imageUrl: '/api/uploads/geral/6383e4e8-aa18-4143-96b7-991b62400603.jpeg',
      title: 'Paróquia Santo André',
      badge: 'Centro',
      address: 'R. das Violetas, 126',
      googleMapsUrl:
        'https://www.google.com/maps/dir/?api=1&destination=Paróquia+Santo+André,+R.+das+Violetas,+126,+Tarumã+-+SP,+19820-000',
      routeLabel: 'Ver rota no Google Maps',
    }),
  },
  {
    key: 'full_history_timeline',
    title: 'Linha do Tempo Paroquial',
    content: JSON.stringify([
      { year: '2010', title: 'Inauguração da Igreja Matriz', description: 'inauguração da nossa igreja matriz pelo pároco didi', icon: 'church' },
      { year: '2026', title: 'lançamento do site', description: 'lancamento', icon: 'calendar-heart' },
    ]),
  },
];

const seedDefaultContent = async () => {
  const shouldSeedDemoContent =
    process.env.SEED_DEMO_CONTENT === 'true' || process.env.NODE_ENV !== 'production';

  const [eventCount, chapelCount, clergyCount, guideCount, adminCount, pastoralCount] =
    await Promise.all([
      Event.count(),
      Chapel.count(),
      ClergyMember.count(),
      Guide.count(),
      Admin.count(),
      PastoralMovement.count(),
    ]);

  if (adminCount === 0) {
    await Admin.create({
      username: 'admin',
      password: 'Igreja1010',
      role: 'superadmin',
    });
  } else {
    const primaryAdmin = await Admin.findOne({ where: { username: 'admin' } });
    if (primaryAdmin && (!primaryAdmin.role || primaryAdmin.role !== 'superadmin')) {
      await primaryAdmin.update({ role: 'superadmin' });
    }
  }

  if (!shouldSeedDemoContent) {
    console.log('ℹ️ Seed de conteúdo demo desativado em produção (SEED_DEMO_CONTENT != true).');
    console.log('✅ Admin verificado com sucesso.');
    return;
  }

  if (chapelCount === 0) {
    await Chapel.bulkCreate(defaultChapels);
  }

  if (clergyCount === 0) {
    const allowedRoles = new Set(
      (ClergyMember.rawAttributes?.role?.values || ['Pároco']).map((v) => String(v))
    );
    const fallbackRole = allowedRoles.has('Pároco') ? 'Pároco' : Array.from(allowedRoles)[0] || 'Pároco';

    await ClergyMember.bulkCreate(
      defaultClergy.map((member) => ({
        ...member,
        role: allowedRoles.has(member.role) ? member.role : fallbackRole,
        imageUrl: typeof member.imageUrl === 'string' ? member.imageUrl.slice(0, 255) : member.imageUrl,
      }))
    );
  }

  if (guideCount === 0) {
    await Guide.bulkCreate(defaultGuides);
  }

  if (eventCount === 0) {
    await Event.bulkCreate(defaultEvents);
  }

  if (pastoralCount === 0) {
    await PastoralMovement.bulkCreate(defaultPastoralMovements);
  }

  for (const entry of defaultContentEntries) {
    await ContentText.findOrCreate({
      where: { key: entry.key },
      defaults: entry,
    });
  }

  console.log('✅ Banco sincronizado e populado com sucesso.');
};

module.exports = { seedDefaultContent };