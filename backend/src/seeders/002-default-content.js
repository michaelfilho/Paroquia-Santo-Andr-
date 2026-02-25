const { Event, Chapel, ClergyMember, Guide, ContentText } = require('../models');
const { Admin } = require('../models');
const bcrypt = require('bcryptjs');

const defaultClergy = [
  {
    name: 'Pe. Joaquim Neto',
    role: 'Pároco',
    startYear: '2020',
    bio: 'Ordenado em 2010, Pe. João Carlos dedica-se à evangelização e ao fortalecimento da comunidade paroquial. Com formação em Teologia Pastoral, tem focado em renovar as pastorais e ampliar o alcance missionário da paróquia.',
    email: 'pe.joao@paroquiasantoandre.org.br',
    phone: '(14) 3234-5678',
    imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isCurrent: true,
  },
  {
    name: 'Pe. Antonio Mendes',
    role: 'Pároco',
    startYear: '2010',
    bio: 'Durante sua atuação, Pe. Antonio foi responsável pela restauração da igreja matriz em 2010 e pela fundação de dois novos grupos de jovens. Hoje atua em outra diocese, mas mantém carinho especial pela Paróquia Santo André.',
    imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isCurrent: false,
  },
  {
    name: 'Pe. Francisco Rodrigues',
    role: 'Pároco Fundador',
    startYear: '1952',
    bio: 'Pe. Francisco foi o fundador e primeiro pároco da Paróquia Santo André. Sob sua liderança, a igreja matriz foi construída e a paróquia estabeleceu suas raízes profundas na comunidade de Tarumã.',
    imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isCurrent: false,
  },
  {
    name: 'Pe. Lucas Fernandes',
    role: 'Vigário Paroquial',
    startYear: '2022',
    bio: 'Recém-ordenado, Pe. Lucas traz energia e renovação à paróquia. Atua especialmente com os jovens e na coordenação da catequese, implementando novas metodologias de evangelização.',
    email: 'pe.lucas@paroquiasantoandre.org.br',
    phone: '(14) 3234-5679',
    imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isCurrent: true,
  },
  {
    name: 'Pe. Rafael Santos',
    role: 'Vigário Paroquial',
    startYear: '2018',
    bio: 'Pe. Rafael desenvolveu trabalhos importantes nas comunidades rurais da paróquia, levando a palavra de Deus aos locais mais afastados. Hoje serve como missionário em outra região.',
    imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isCurrent: false,
  },
  {
    name: 'Papa Francisco',
    role: 'Papa',
    startYear: '2013',
    bio: 'Jorge Mario Bergoglio, Papa Francisco, eleito em 2013, é o 266º Papa da Igreja Católica Apostólica Romana. Primeiro Papa das Américas e primeiro Papa jesuíta, dedica-se à missão de renovação da Igreja e ao cuidado com os pobres e excluídos, seguindo as pegadas de São Francisco.',
    imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isCurrent: true,
  },
  {
    name: 'Dom Cerineu Pivatto',
    role: 'Bispo',
    startYear: '2006',
    bio: 'Dom Cerineu Pivatto é o bispo responsável pela Diocese que abrange nossa Paróquia Santo André. Dedica-se ao pastoreio dos fiéis, à formação do clero e ao fortalecimento das comunidades paroquiais em sua jurisdição.',
    email: 'bispo@diocese.org.br',
    phone: '(14) 3232-2010',
    imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isCurrent: true,
  },
];

const defaultContentEntries = [
  {
    key: 'about',
    title: 'Sobre Nós',
    content: 'A Paróquia Santo André é uma comunidade de fé localizada em Tarumã, dedicada ao serviço pastoral e à evangelização. Fundada em 1952, a paróquia tem crescido e se desenvolvido ao longo dos anos, sempre mantendo seu compromisso com os valores cristãos e a transformação social da comunidade. Nossa missão é promover a vida cristã através dos sacramentos, da catequese e do trabalho comunitário.',
  },
  {
    key: 'full_history',
    title: 'Nossa História Completa',
    content: 'A história da Paróquia Santo André se entrelaça intimamente com as raízes de Tarumã.\nNos idos de 1952, uma modesta porção de terras doada por famílias pioneiras serviu como solo fértil para a primeira capelinha. Os corações dos antigos habitantes batiam em uníssono sob os repiques do pequeno sino improvisado que conclamava à oração. Era uma época de estradas de terra roxa e campos abertos, onde a fé era o alicerce principal diante do cansaço da lavoura.\nAo longo dos anos, o amor abnegado dos presbíteros e da comunidade leiga provou-se formidável. As tradicionais quermesses ganharam fama, mobilizando jovens e adultos que preparavam de mãos dadas os doces caseiros e os enfeites no pátio, revertendo todas as economias para as obras da Casa do Senhor.\nSob o patrocínio de Santo André Apóstolo, aprendemos a ser "pescadores", lançando as redes do evangelho nas realidades difíceis. Desde a fundação do vicentos e a criação de corais que ainda hoje ecoam sob a abóbada principal, cada tijolo desta igreja matriz tem incrustada a lágrima e a prece sincera de nosso povo. Hoje, miramos um futuro cheio de sol, baseados na firme rocha plantada por aqueles gigantes do passado.',
  },
  {
    key: 'about_stats',
    title: 'Sobre - Estatísticas',
    content: JSON.stringify({
      chapelsCount: '5',
      pastoralGroups: '10+',
      yearsHistory: '72',
    }),
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
      addressLines: ['Rua das Violetas, 257', 'Centro - Tarumã/SP', 'CEP: 19820035'],
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
      pixKey: 'parsanat@hotmail.com',
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
  {
    key: 'lit_candles_count',
    title: 'Contador de Velas Acesas',
    content: '0',
  },
];

const defaultChapels = [
  {
    name: 'Igreja Matriz Santo André',
    neighborhood: 'Centro',
    coordinator: 'Maria José da Silva',
    phone: '(14) 3234-5678',
    email: 'matriz@paroquiasantoandre.org.br',
  },
  {
    name: 'Capela São Pedro',
    neighborhood: 'Jardim Paraíso',
    coordinator: 'João Batista Santos',
    phone: '(14) 3234-5680',
    email: 'saopedro@paroquiasantoandre.org.br',
  },
  {
    name: 'Capela Santa Rita',
    neighborhood: 'Vila Nova',
    coordinator: 'Ana Paula Oliveira',
    phone: '(14) 3234-5681',
    email: 'santarita@paroquiasantoandre.org.br',
  },
  {
    name: 'Capela Nossa Senhora',
    neighborhood: 'Bairro Alto',
    coordinator: 'Carlos Eduardo Lima',
    phone: '(14) 3234-5682',
    email: 'nossasenhora@paroquiasantoandre.org.br',
  },
  {
    name: 'Capela São José',
    neighborhood: 'Jardim das Flores',
    coordinator: 'Mariana Costa Pereira',
    phone: '(14) 3234-5683',
    email: 'saojose@paroquiasantoandre.org.br',
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
    isProgram: true,
    isActive: true,
    isPublished: true,
  },
  {
    title: 'Retiro Paroquial de Jovens',
    date: '2026-07-20',
    dateEnd: '2026-07-22',
    time: '08:00',
    location: 'Casa de Retiro Diocesana',
    description: 'Encontro de espiritualidade e formação para jovens da comunidade.',
    category: 'formacao',
    isProgram: false,
    isActive: true,
    isInscriptionEvent: true,
    acceptsRegistration: true,
    maxParticipants: 120,
    isPublished: true,
  },
  {
    title: 'Adoração ao Santíssimo',
    date: '2026-03-05',
    time: '20:00',
    location: 'Capela do Santíssimo',
    description: 'Momento comunitário de oração, silêncio e intercessão.',
    category: 'oracao',
    isProgram: true,
    isActive: true,
    isPublished: true,
  },
];

const defaultGuides = [
  {
    title: 'Guia de Casamento',
    content: 'Informações essenciais para celebração do sacramento do matrimônio',
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
    content: 'Tudo o que você precisa saber sobre o batismo e iniciação cristã',
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
    content: 'Informações sobre os programas de catequese paroquial',
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
    content: 'Orientações para crianças que desejam servir no altar',
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
    content: 'Informações sobre ministério de acólito e vida litúrgica',
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
    content: 'Guia para ministros leigos que servem na comunidade paroquial',
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

const seedDefaultContent = async () => {
  const [eventCount, chapelCount, clergyCount, guideCount, adminCount] = await Promise.all([
    Event.count(),
    Chapel.count(),
    ClergyMember.count(),
    Guide.count(),
    Admin.count(),
  ]);

  if (adminCount === 0) {
    await Admin.create({
      username: 'admin',
      password: 'Igreja1010',
      role: 'super',
    });
  } else {
    const primaryAdmin = await Admin.findOne({ where: { username: 'admin' } });
    if (primaryAdmin && (!primaryAdmin.role || primaryAdmin.role !== 'super')) {
      await primaryAdmin.update({ role: 'super' });
    }
  }

  if (chapelCount === 0) {
    await Chapel.bulkCreate(defaultChapels);
  }

  if (clergyCount === 0) {
    await ClergyMember.bulkCreate(defaultClergy);
  }

  if (guideCount === 0) {
    await Guide.bulkCreate(defaultGuides);
  }

  if (eventCount === 0) {
    await Event.bulkCreate(defaultEvents);
  }

  for (const entry of defaultContentEntries) {
    await ContentText.findOrCreate({
      where: { key: entry.key },
      defaults: entry,
    });
  }

  // Sincronizar banco para assumir nova estrutura destrutivamente (só em dev, se usar SQLite puro, recriará)
  console.log('✅ Banco sincronizado e populado com sucesso.');
};

module.exports = { seedDefaultContent };
