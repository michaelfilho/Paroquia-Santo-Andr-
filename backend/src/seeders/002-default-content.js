const { Event, Chapel, ClergyMember, Guide, ContentText } = require('../models');
const { Admin } = require('../models');
const bcrypt = require('bcryptjs');

const defaultClergy = [
  {
    name: 'Pe. Joaquim Neto',
    role: 'Pároco',
    period: '2020 - Presente',
    bio: 'Ordenado em 2010, Pe. João Carlos dedica-se à evangelização e ao fortalecimento da comunidade paroquial. Com formação em Teologia Pastoral, tem focado em renovar as pastorais e ampliar o alcance missionário da paróquia.',
    email: 'pe.joao@paroquiasantoandre.org.br',
    phone: '(14) 3234-5678',
    imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    current: true,
  },
  {
    name: 'Pe. Antonio Mendes',
    role: 'Pároco',
    period: '2010 - 2020',
    bio: 'Durante sua atuação, Pe. Antonio foi responsável pela restauração da igreja matriz em 2010 e pela fundação de dois novos grupos de jovens. Hoje atua em outra diocese, mas mantém carinho especial pela Paróquia Santo André.',
    imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    current: false,
  },
  {
    name: 'Pe. Francisco Rodrigues',
    role: 'Pároco Fundador',
    period: '1952 - 1985',
    bio: 'Pe. Francisco foi o fundador e primeiro pároco da Paróquia Santo André. Sob sua liderança, a igreja matriz foi construída e a paróquia estabeleceu suas raízes profundas na comunidade de Tarumã.',
    imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    current: false,
  },
  {
    name: 'Pe. Lucas Fernandes',
    role: 'Vigário Paroquial',
    period: '2022 - Presente',
    bio: 'Recém-ordenado, Pe. Lucas traz energia e renovação à paróquia. Atua especialmente com os jovens e na coordenação da catequese, implementando novas metodologias de evangelização.',
    email: 'pe.lucas@paroquiasantoandre.org.br',
    phone: '(14) 3234-5679',
    imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    current: true,
  },
  {
    name: 'Pe. Rafael Santos',
    role: 'Vigário Paroquial',
    period: '2018 - 2022',
    bio: 'Pe. Rafael desenvolveu trabalhos importantes nas comunidades rurais da paróquia, levando a palavra de Deus aos locais mais afastados. Hoje serve como missionário em outra região.',
    imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    current: false,
  },
  {
    name: 'Papa Francisco',
    role: 'Papa',
    period: '2013 - Presente',
    bio: 'Jorge Mario Bergoglio, Papa Francisco, eleito em 2013, é o 266º Papa da Igreja Católica Apostólica Romana. Primeiro Papa das Américas e primeiro Papa jesuíta, dedica-se à missão de renovação da Igreja e ao cuidado com os pobres e excluídos, seguindo as pegadas de São Francisco.',
    imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    current: true,
  },
  {
    name: 'Dom Cerineu Pivatto',
    role: 'Bispo',
    period: '2006 - Presente',
    bio: 'Dom Cerineu Pivatto é o bispo responsável pela Diocese que abrange nossa Paróquia Santo André. Dedica-se ao pastoreio dos fiéis, à formação do clero e ao fortalecimento das comunidades paroquiais em sua jurisdição.',
    email: 'bispo@diocese.org.br',
    phone: '(14) 3232-2010',
    imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    current: true,
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

const defaultEvents = [
  {
    title: 'Missa Dominical',
    date: '2026-02-02',
    time: '19:00',
    location: 'Igreja Matriz Santo André',
    description: 'Missa de domingo com celebração eucarística e cânticos.',
    category: 'missa',
    acceptsRegistration: false,
  },
  {
    title: 'Grupo de Oração',
    date: '2026-02-05',
    time: '20:00',
    location: 'Salão Paroquial',
    description: 'Encontro semanal do grupo de oração com louvor, palavra e partilha.',
    category: 'evento',
    acceptsRegistration: true,
  },
  {
    title: 'Retiro de Quaresma',
    date: '2026-02-28',
    time: '18:00 (Sexta)',
    location: 'Casa de Retiros São Francisco',
    description: 'Retiro espiritual de preparação para a Quaresma.',
    category: 'retiro',
    acceptsRegistration: true,
  },
  {
    title: 'Quarta-feira de Cinzas',
    date: '2026-03-04',
    time: '07:00, 12:00 e 19:00',
    location: 'Igreja Matriz',
    description: 'Celebrações com imposição das cinzas.',
    category: 'missa',
    acceptsRegistration: false,
  },
  {
    title: 'Encontro de Casais',
    date: '2026-03-14',
    time: '19:00 (Sábado)',
    location: 'Salão Paroquial',
    description: 'Encontro para casais com palestras e espiritualidade.',
    category: 'evento',
    acceptsRegistration: true,
  },
  {
    title: 'Páscoa 2026',
    date: '2026-04-05',
    time: '06:00 (Vigília)',
    location: 'Igreja Matriz',
    description: 'Vigília Pascal e Missa da Ressurreição.',
    category: 'festa',
    acceptsRegistration: false,
  },
  {
    title: 'Festa de Santo André 2025',
    date: '2025-11-30',
    time: '18:00',
    location: 'Igreja Matriz',
    description: 'Celebração tradicional em honra ao nosso padroeiro, com missa solene, procissão e confraternização.',
    category: 'festa',
    acceptsRegistration: false,
  },
  {
    title: 'Natal Solidário 2024',
    date: '2024-12-24',
    time: '19:00',
    location: 'Igreja Matriz',
    description: 'Missa de Natal seguida de distribuição de presentes para crianças carentes da comunidade.',
    category: 'missa',
    acceptsRegistration: false,
  },
  {
    title: 'Romaria da Juventude',
    date: '2024-10-15',
    time: '07:00',
    location: 'Várias Capelas',
    description: 'Caminhada de fé pelos bairros de Tarumã, com visitação às cinco capelas da paróquia.',
    category: 'evento',
    acceptsRegistration: false,
  },
  {
    title: 'Semana Santa 2024',
    date: '2024-03-24',
    time: '19:00',
    location: 'Igreja Matriz',
    description: 'Celebrações da Semana Santa incluindo Via Sacra, Lava-Pés, Vigília Pascal e Missa da Ressurreição.',
    category: 'missa',
    acceptsRegistration: false,
  },
  {
    title: 'Festa Junina Paroquial',
    date: '2024-06-29',
    time: '19:00',
    location: 'Salão Paroquial',
    description: 'Tradicional festa junina com quadrilha, comidas típicas e apresentações culturais.',
    category: 'festa',
    acceptsRegistration: false,
  },
];

const seedDefaultContent = async () => {
  const [eventCount, chapelCount, clergyCount, guideCount, contentCount, adminCount] = await Promise.all([
    Event.count(),
    Chapel.count(),
    ClergyMember.count(),
    Guide.count(),
    ContentText.count(),
    Admin.count(),
  ]);

  if (adminCount === 0) {
    await Admin.create({
      username: 'admin',
      password: 'admin123',
    });
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

  if (contentCount === 0) {
    await ContentText.bulkCreate([
      {
        key: 'about',
        title: 'Sobre Nós',
        content: 'A Paróquia Santo André é uma comunidade de fé localizada em Tarumã, dedicada ao serviço pastoral e à evangelização. Fundada em 1952, a paróquia tem crescido e se desenvolvido ao longo dos anos, sempre mantendo seu compromisso com os valores cristãos e a transformação social da comunidade. Nossa missão é promover a vida cristã através dos sacramentos, da catequese e do trabalho comunitário.',
      },
    ]);
  }
};

module.exports = { seedDefaultContent };
