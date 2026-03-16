'use strict';

/**
 * Seeder 002-default-contest.js
 * Popula o banco com todos os dados padrão da Paróquia Santo André - Tarumã/SP.
 * Compatível com Sequelize CLI (queryInterface.bulkInsert).
 *
 * Tabelas cobertas:
 *   admins · chapels · clergy · guides · content_texts · events
 *   pastorals · old_priests · news · carousel · schedules · history
 *   registration_links
 */

const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

module.exports = {
  /* ─────────────────────────────────────────────── UP ───────── */
  async up(queryInterface) {
    const now = new Date();
    const hashedPassword = await bcrypt.hash('Igreja1010', 10);

    /* ── 1. ADMINS ────────────────────────────────────────────── */
    await queryInterface.bulkInsert(
      'admins',
      [
        {
          username: 'admin',
          password: hashedPassword,
          role: 'superadmin',
        },
      ],
      { ignoreDuplicates: true },
    );

    /* ── 2. CAPELAS (chapels) ─────────────────────────────────── */
    await queryInterface.bulkInsert(
      'chapels',
      [
        {
          id: '096b7dff-4e3f-4130-91ab-8696a3db8bdb',
          name: 'Capela Sagrada Família',
          neighborhood: 'Vila das Árvores',
          street: 'Avenida das Orquídeas, 980',
          number: null,
          coordinator: '',
          phone: '',
          email: null,
          description: null,
          image_url: '/api/uploads/geral/8a6c26bd-70be-4e78-9deb-4200c4a5a235.png',
        },
        {
          id: '386ca72a-344b-4566-ae10-22a51a3d03c1',
          name: 'Capela Santa Paulina e Santa Rita de Cassia',
          neighborhood: 'Vila Brasil',
          street: 'Rua Amapá, 105',
          number: null,
          coordinator: '',
          phone: '',
          email: null,
          description: null,
          image_url: '/api/uploads/geral/5173ea57-e605-499c-85a1-5b78e51a455b.png',
        },
        {
          id: '7ad5fbcb-6f88-4754-9226-497dbccdb7bb',
          name: 'Capela Nossa Senhora das Graças',
          neighborhood: 'Vila das Árvores',
          street: 'Avenida Orquídeas, 285',
          number: null,
          coordinator: '',
          phone: '',
          email: null,
          description: null,
          image_url: '/api/uploads/geral/c161e985-47e3-48db-a23c-0e9501a4251b.png',
        },
        {
          id: '54e3b3b9-79a5-4f64-a9a7-5ae7b2f19658',
          name: 'Capela Santa Terezinha e São José Operário',
          neighborhood: 'Jardim das Árvores II',
          street: 'Rua Pequi, 1720',
          number: null,
          coordinator: '',
          phone: '',
          email: null,
          description: null,
          image_url: '/api/uploads/geral/8966e65a-a7fb-4445-89a8-f453b433e17f.png',
        },
        {
          id: 'b992c28b-9142-449b-8bc5-6e3e28953392',
          name: 'Capela do Santo Antônio',
          neighborhood: 'Unnamed Road',
          street: 'Unnamed Road',
          number: null,
          coordinator: '',
          phone: '',
          email: null,
          description: null,
          image_url: '/api/uploads/geral/2d590665-8e29-41da-8692-35762f21880f.png',
        },
        {
          id: '2e57445f-88cd-448c-a9b8-3f40aabcbb25',
          name: 'Capela São Benedito',
          neighborhood: 'Água da Onça',
          street: 'Bairro Água da Onça, Tarumã - SP',
          number: null,
          coordinator: '',
          phone: '',
          email: null,
          description: null,
          image_url: '/api/uploads/geral/7798ad56-e6bf-4edb-86e2-40b85247c175.png',
        },
      ],
      { ignoreDuplicates: true },
    );

    /* ── 3. CLERO (clergy) ────────────────────────────────────── */
    await queryInterface.bulkInsert(
      'clergy',
      [
        {
          id: '1e11a8b2-7efb-4265-8683-4145c768234d',
          name: 'Padre José Joaquim Damásio Neto',
          role: 'Pároco',
          start_year: '2026',
          bio: 'Pároco responsável pela Paróquia Santo André de Tarumã.',
          image_url: '/api/uploads/whatsapp-image-2026-02-03-at-103915-1-1770643903292-690089667.jpeg',
          is_current: true,
        },
        {
          id: 'bab8644b-1761-4bde-af03-d7af0a8f7dbd',
          name: 'Padre Clóvis Alves Da Silva',
          role: 'Vigário Paroquial',
          start_year: '2026',
          bio: 'Vigário paroquial da Paróquia Santo André de Tarumã.',
          image_url: '/api/uploads/whatsapp-image-2026-02-04-at-114159-1770643998075-92467154.jpeg',
          is_current: true,
        },
      ],
      { ignoreDuplicates: true },
    );

    /* ── 4. GUIAS (guides) ────────────────────────────────────── */
    await queryInterface.bulkInsert(
      'guides',
      [
        {
          id: '4fa4500c-8cae-457a-a689-12cedbeecd6a',
          title: 'Guia de Casamento',
          description:
            'Informações essenciais para celebração do sacramento do matrimônio',
          details: JSON.stringify([
            'Documentação necessária (certidão de nascimento, batismo)',
            'Preparação pré-matrimonial (3 encontros obrigatórios)',
            'Entrevista com o pároco',
            'Período de noivado recomendado',
            'Data e horários disponíveis para cerimônia',
            'Orientações sobre a liturgia do matrimônio',
            'Normas sobre padrinhos e convidados',
            'Custos e taxas da paróquia',
          ]),
          image_url: null,
        },
        {
          id: 'bd02ce57-45d0-453b-a34d-870c285343b9',
          title: 'Guia de Batismo',
          description:
            'Tudo o que você precisa saber sobre o batismo e iniciação cristã',
          details: JSON.stringify([
            'Documentação da criança (certidão de nascimento)',
            'Escolha de padrinhos qualificados',
            'Preparação espiritual dos pais',
            'Entrevista com o pároco ou catequista',
            'Escolha do nome do santo padroeiro',
            'Data e horários disponíveis para batismo',
            'Preparação da vela batismal',
            'Significado dos símbolos batismais',
          ]),
          image_url: null,
        },
        {
          id: 'cfe47a39-6e3d-4f33-8e40-d122217a11fa',
          title: 'Guia de Catequese',
          description: 'Informações sobre os programas de catequese paroquial',
          details: JSON.stringify([
            'Catequese infantil (6-12 anos)',
            'Catequese de adolescentes (12-17 anos)',
            'Catequese de adultos',
            'Preparação para Primeira Comunhão',
            'Preparação para Confirmação',
            'Cronograma e dias de encontro',
            'Catequistas responsáveis e horários',
            'Material didático disponível',
          ]),
          image_url: null,
        },
        {
          id: 'affbc02f-b38c-4695-9ce8-6ced6c5e1e6b',
          title: 'Guia de Coroinha',
          description: 'Orientações para crianças que desejam servir no altar',
          details: JSON.stringify([
            'Idade mínima recomendada',
            'Treinamento e preparação litúrgica',
            'Uniforme e indumentária',
            'Responsabilidades no altar',
            'Calendário de rodízios e missas',
            'Atividades sociais e confraternizações',
            'Formação espiritual contínua',
            'Requisitos de frequência',
          ]),
          image_url: null,
        },
        {
          id: '4b2a426a-edec-468a-8c25-0a1be3b764a2',
          title: 'Guia de Acólito',
          description:
            'Informações sobre ministério de acólito e vida litúrgica',
          details: JSON.stringify([
            'Formação teológica básica',
            'Preparação para os sacramentos',
            'Funções litúrgicas do acólito',
            'Compromisso com a paróquia',
            'Encontros de formação regular',
            'Participação em celebrações especiais',
            'Vida espiritual e oração',
            'Possibilidade de ordenação diaconal',
          ]),
          image_url: null,
        },
        {
          id: randomUUID(),
          title: 'Guia de Ministro',
          description:
            'Guia para ministros leigos que servem na comunidade paroquial',
          details: JSON.stringify([
            'Ministério da Eucaristia',
            'Ministério da Palavra',
            'Ministério de Acompanhamento',
            'Visita aos enfermos',
            'Formação continuada obrigatória',
            'Compromisso e frequência esperados',
            'Participação em retiros espirituais',
            'Suporte e comunhão entre ministros',
          ]),
          image_url: null,
        },
      ],
      { ignoreDuplicates: true },
    );

    /* ── 5. TEXTOS DE CONTEÚDO (content_texts) ───────────────── */
    await queryInterface.bulkInsert(
      'content_texts',
      [
        {
          id: 'd251eba6-d167-43f8-ad11-8479db0e92f5',
          key: 'about',
          title: 'Sobre Nós',
          content:
            'A Paróquia Santo André é uma comunidade de fé localizada em Tarumã,',
          image_url: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: randomUUID(),
          key: 'full_history',
          title: 'Nossa História Completa',
          content:
            'A história da Paróquia Santo André se entrelaça intimamente com as raízes de Tarumã.\nNos idos de 1952, uma modesta porção de terras doada por famílias pioneiras serviu como solo fértil para a primeira capelinha. Os corações dos antigos habitantes batiam em uníssono sob os repiques do pequeno sino improvisado que conclamava à oração. Era uma época de estradas de terra roxa e campos abertos, onde a fé era o alicerce principal diante do cansaço da lavoura.\nAo longo dos anos, o amor abnegado dos presbíteros e da comunidade leiga provou-se formidável. As tradicionais quermesses ganharam fama, mobilizando jovens e adultos que preparavam de mãos dadas os doces caseiros e os enfeites no pátio, revertendo todas as economias para as obras da Casa do Senhor.\nSob o patrocínio de Santo André Apóstolo, aprendemos a ser "pescadores", lançando as redes do evangelho nas realidades difíceis. Desde a fundação dos vicentinos e a criação de corais que ainda hoje ecoam sob a abóbada principal, cada tijolo desta igreja matriz tem incrustada a lágrima e a prece sincera de nosso povo. Hoje, miramos um futuro cheio de sol, baseados na firme rocha plantada por aqueles gigantes do passado.',
          image_url: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: randomUUID(),
          key: 'about_stats',
          title: 'Sobre - Estatísticas',
          content: JSON.stringify({
            chapelsCount: '5',
            pastoralGroups: '10+',
            yearsHistory: '72',
          }),
          image_url: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: randomUUID(),
          key: 'footer_config',
          title: 'Rodapé - Configuração',
          content: JSON.stringify({
            parishName: 'Paróquia Santo André',
            cityState: 'Tarumã - SP',
            aboutText:
              'Uma comunidade de fé, esperança e amor servindo Tarumã desde 1952.',
            phone: '(18) 99799-4927',
            phoneLink: '18997994927',
            email: 'parsant@hotmail.com',
            addressLines: [
              'Rua das Violetas, 257',
              'Centro - Tarumã/SP',
              'CEP: 19820035',
            ],
            instagramUrl:
              'https://www.instagram.com/paroquiasantoandre.taruma/',
            facebookUrl:
              'https://www.facebook.com/paroquia.santoandre.37',
            copyrightText:
              '© 2026 Paróquia Santo André. Todos os direitos reservados.',
            privacyLabel: 'Política de Privacidade',
            termsLabel: 'Termos de Uso',
          }),
          image_url: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: randomUUID(),
          key: 'dizimo_config',
          title: 'Dízimo - Configuração',
          content: JSON.stringify({
            pixKey: 'paroquia@santoandre.org.br',
            whatsappUrl: 'https://wa.me/5518997994927',
            quote:
              '"Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria."',
            quoteRef: '(2 Coríntios 9:7)',
            bankName: 'SICOOB - CREDIMOTA',
            agency: '3190',
            account: '32.586-4',
            holder: 'Paróquia Santo André - Tarumã/SP',
            cnpj: '44.375.186/0032-35',
          }),
          image_url: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: randomUUID(),
          key: 'lit_candles_count',
          title: 'Contador de Velas Acesas',
          content: '0',
          image_url: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: randomUUID(),
          key: 'site_visits_count',
          title: 'Contador de Acessos ao Site',
          content: '0',
          image_url: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: randomUUID(),
          key: 'hero_primary_slide',
          title: 'Hero - Slide Principal',
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
          image_url: '/api/uploads/geral/9745bcfa-cc9a-4520-b26e-d061fd3457a3.jpeg',
          created_at: now,
          updated_at: now,
        },
        {
          id: randomUUID(),
          key: 'brasao',
          title: 'Brasão Paroquial',
          content:
            'No alvorecer dos tempos, quando a esperança ainda era cultivada com as mãos e a fé guiava os caminhos, ergueu-se um símbolo destinado a perpetuar valores que jamais deveriam se perder.\n\nEste brasão nasce da união entre coragem, sabedoria e perseverança. Cada elemento nele presente carrega consigo uma história: as cores representam virtudes eternas, as formas revelam a harmonia entre força e humildade, e os símbolos recordam que todo caminho exige esforço, fé e dedicação.\n\nDiz-se que aqueles que o carregam não apenas herdam um emblema, mas assumem um compromisso — o de honrar o passado, agir com justiça no presente e construir um futuro digno.\n\nO escudo protege, mas também ensina: é na adversidade que se fortalece o caráter. O ornamento não é apenas beleza, mas sinal de dignidade. E o lema, inscrito com firmeza, ecoa como um chamado à missão.\n\nAssim, este brasão não é apenas um símbolo.\nÉ um legado.\n\nUm testemunho de que, mesmo diante das tempestades, aqueles que permanecem firmes na verdade e na fé jamais serão vencidos.',
          image_url: '/api/uploads/geral/8597d873-d861-4955-8b67-24b0d7aae47a.png',
          created_at: now,
          updated_at: now,
        },
        {
          id: randomUUID(),
          key: 'map_main_card',
          title: 'Card principal do mapa',
          content: JSON.stringify({
            imageUrl: '/api/uploads/geral/6383e4e8-aa18-4143-96b7-991b62400603.jpeg',
            title: 'Paróquia Santo André',
            badge: 'Centro',
            address: 'R. das Violetas, 257',
            googleMapsUrl:
              'https://www.google.com/maps/dir/?api=1&destination=Paróquia+Santo+André,+R.+das+Violetas,+257,+Tarumã+-+SP,+19820-000',
            routeLabel: 'Ver rota no Google Maps',
          }),
          image_url: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: randomUUID(),
          key: 'full_history_timeline',
          title: 'Linha do Tempo Paroquial',
          content: JSON.stringify([
            {
              year: '2010',
              title: 'Inauguração da Igreja Matriz',
              description: 'inauguração da nossa igreja matriz pelo pároco didi',
              icon: 'church',
            },
            {
              year: '2026',
              title: 'lançamento do site',
              description: 'lancamento',
              icon: 'calendar-heart',
            },
          ]),
          image_url: null,
          created_at: now,
          updated_at: now,
        },
      ],
      { ignoreDuplicates: true },
    );

    /* ── 6. EVENTOS (events) ──────────────────────────────────── */
    await queryInterface.bulkInsert(
      'events',
      [
        {
          id: '1a271b37-2ee7-45dd-862e-ac9b2e82eb24',
          title: 'Missa Solene de Santo André',
          date: '2026-11-30',
          date_end: null,
          time: '19:30',
          location: 'Igreja Matriz Santo André',
          description:
            'Celebração em honra ao padroeiro da paróquia com participação das pastorais.',
          category: 'liturgia',
          accepts_registration: false,
          is_published: true,
          is_active: true,
          is_program: false,
          is_inscription_event: false,
          max_participants: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: '014d40cb-d378-48ea-8936-3b8eda26a68b',
          title: 'Adoração ao Santíssimo',
          date: '2026-03-05',
          date_end: null,
          time: '20:00 às 20:00',
          location: 'Capela do Santíssimo',
          description:
            'Momento comunitário de oração, silêncio e intercessão.',
          category: 'Evento',
          accepts_registration: false,
          is_published: true,
          is_active: false,
          is_program: false,
          is_inscription_event: false,
          max_participants: null,
          created_at: now,
          updated_at: now,
        },
      ],
      { ignoreDuplicates: true },
    );

    /* ── 7. MOVIMENTOS PASTORAIS (pastorals) ─────────────────── */
    await queryInterface.bulkInsert(
      'pastorals',
      [
        {
          id: 'd9894f0e-825c-48c3-98d5-379978e6b3c9',
          name: 'Catequese Paroquial',
          description:
            'A principal missão da catequese é a Iniciação à Vida Cristã. O grupo acompanha crianças, jovens e adultos na preparação para os sacramentos do Batismo, Eucaristia e Crisma.',
          meetings: 'Sábados às 09h e Domingos às 08h30',
          coordinator: '',
          image_url: null,
        },
        {
          id: '53351be9-2083-4bbe-9114-23ec8301ba36',
          name: 'Ministério de Música',
          description:
            'Responsável por animar as Santas Missas e demais celebrações da paróquia. Através do canto e dos instrumentos, ajudam a assembleia a rezar e louvar a Deus.',
          meetings: 'Ensaios às Quartas-feiras, 19h30',
          coordinator: '',
          image_url: null,
        },
        {
          id: '39689e3d-f5f1-4599-befe-5fe80bbac4a0',
          name: 'Grupo de Oração (RCC)',
          description:
            'Encontros semanais de louvor, pregação da Palavra, oração por cura e libertação, vivenciando a espiritualidade da Renovação Carismática Católica.',
          meetings: 'Terças-feiras às 20h',
          coordinator: '',
          image_url: null,
        },
      ],
      { ignoreDuplicates: true },
    );


    /* ── 9. NOTÍCIAS (news) ───────────────────────────────────── */
    await queryInterface.bulkInsert(
      'news',
      [
        {
          id: randomUUID(),
          title: 'Semana Santa 2026 — Programação Completa',
          content:
            'A Paróquia Santo André convida todos os fiéis para participar da Semana Santa 2026. As celebrações iniciam no Domingo de Ramos com a bênção dos ramos e Missa às 9h e 19h. Na Quinta-feira Santa haverá a Missa da Ceia do Senhor às 19h30. Na Sexta-feira Santa, a Celebração da Paixão do Senhor às 15h, seguida do Via Sacra pelas ruas do centro. No Sábado Santo a Vigília Pascal acontecerá às 21h. No Domingo de Páscoa, missas às 8h, 10h e 19h — Aleluia!',
          summary:
            'Confira a programação completa das celebrações da Semana Santa 2026 na Paróquia Santo André.',
          date: '2026-03-20',
          image_url: null,
          is_published: true,
        },
        {
          id: randomUUID(),
          title: 'Festa de Santo André — 30 de Novembro',
          content:
            'A Paróquia Santo André celebra com alegria a festa do nosso padroeiro no dia 30 de novembro. A programação inclui: alvorada festiva às 7h, missa solene às 10h celebrada pelo Bispo Diocesano, procissão com a imagem de Santo André, almoço comunitário e atividades para toda a família. Venham todos comemorar conosco!',
          summary:
            'Prepare-se para a festa do padroeiro Santo André com uma programação especial para toda a comunidade.',
          date: '2026-11-01',
          image_url: null,
          is_published: true,
        },
        {
          id: randomUUID(),
          title: 'Inscrições Abertas para a Catequese 2026',
          content:
            'As inscrições para a catequese de 2026 estão abertas! A Paróquia Santo André oferece catequese infantil, para adolescentes e adultos. Os encontros acontecem aos sábados. Para se inscrever, compareça à secretaria paroquial de segunda a sexta das 8h às 12h e das 14h às 17h, ou entre em contato pelo WhatsApp.',
          summary:
            'As inscrições para a catequese paroquial estão abertas. Venha fazer parte da nossa comunidade de fé.',
          date: '2026-02-15',
          image_url: null,
          is_published: true,
        },
      ],
      { ignoreDuplicates: true },
    );

    /* ── 10. CARROSSEL (carousel) ─────────────────────────────── */
    await queryInterface.bulkInsert(
      'carousel',
      [
        {
          id: randomUUID(),
          title: 'Semana Santa 2026',
          title_highlight: 'Viva a Páscoa',
          subtitle: 'Participe das celebrações da Semana Santa em nossa paróquia',
          description:
            'Programação completa de liturgias e encontros da Semana Santa.',
          link: '#noticias',
          button_text: 'Ver Programação',
          title_color: '#FFFFFF',
          title_color_end: '#F59E0B',
          subtitle_color: '#F3F4F6',
          link_color: '#FFFFFF',
          image_url: null,
          mobile_image_url: null,
          order: 1,
          is_active: true,
        },
        {
          id: randomUUID(),
          title: 'Festa de',
          title_highlight: 'Santo André',
          subtitle: '30 de Novembro — Celebração do Padroeiro',
          description:
            'Grande festa em honra ao padroeiro com procissão e missa solene presidida pelo Bispo.',
          link: '#eventos-futuros',
          button_text: 'Saiba Mais',
          title_color: '#FFFFFF',
          title_color_end: '#F59E0B',
          subtitle_color: '#F3F4F6',
          link_color: '#FFFFFF',
          image_url: null,
          mobile_image_url: null,
          order: 2,
          is_active: true,
        },
        {
          id: randomUUID(),
          title: 'Catequese',
          title_highlight: '2026',
          subtitle: 'Inscrições abertas para todas as faixas etárias',
          description:
            'Catequese infantil, para adolescentes e adultos. Inscreva-se na secretaria paroquial.',
          link: '#sobre',
          button_text: 'Inscreva-se',
          title_color: '#FFFFFF',
          title_color_end: '#F59E0B',
          subtitle_color: '#F3F4F6',
          link_color: '#FFFFFF',
          image_url: null,
          mobile_image_url: null,
          order: 3,
          is_active: true,
        },
      ],
      { ignoreDuplicates: true },
    );

    /* ── 11. PROGRAMAÇÕES (schedules) ────────────────────────── */
    await queryInterface.bulkInsert(
      'schedules',
      [
        {
          id: randomUUID(),
          title: 'Missa — Domingo (manhã)',
          date: '2026-03-22',
          time_start: '08:00',
          time_end: '09:00',
          location: 'Igreja Matriz Santo André',
          category: 'missa',
          description: 'Missa dominical das 8h.',
          is_published: true,
        },
        {
          id: randomUUID(),
          title: 'Missa — Domingo (manhã)',
          date: '2026-03-22',
          time_start: '10:00',
          time_end: '11:00',
          location: 'Igreja Matriz Santo André',
          category: 'missa',
          description: 'Missa dominical das 10h.',
          is_published: true,
        },
        {
          id: randomUUID(),
          title: 'Missa — Domingo (noite)',
          date: '2026-03-22',
          time_start: '19:00',
          time_end: '20:00',
          location: 'Igreja Matriz Santo André',
          category: 'missa',
          description: 'Missa dominical das 19h.',
          is_published: true,
        },
        {
          id: randomUUID(),
          title: 'Missa Diária (Seg–Sex)',
          date: '2026-03-23',
          time_start: '07:00',
          time_end: '07:45',
          location: 'Igreja Matriz Santo André',
          category: 'missa',
          description: 'Missa diária de segunda-feira a sexta-feira.',
          is_published: true,
        },
        {
          id: randomUUID(),
          title: 'Missa — Sábado',
          date: '2026-03-21',
          time_start: '19:00',
          time_end: '20:00',
          location: 'Igreja Matriz Santo André',
          category: 'missa',
          description: 'Missa de sábado.',
          is_published: true,
        },
        {
          id: randomUUID(),
          title: 'Adoração ao Santíssimo',
          date: '2026-04-03',
          time_start: '20:00',
          time_end: '22:00',
          location: 'Igreja Matriz Santo André',
          category: 'adoração',
          description: 'Adoração ao Santíssimo Sacramento — aberta a todos os fiéis.',
          is_published: true,
        },
        {
          id: randomUUID(),
          title: 'Catequese',
          date: '2026-03-21',
          time_start: '14:00',
          time_end: '16:00',
          location: 'Salão Paroquial',
          category: 'formação',
          description: 'Encontros de catequese (infantil e adultos) — sábados.',
          is_published: true,
        },
      ],
      { ignoreDuplicates: true },
    );

    /* ── 12. HISTÓRIA (history) ───────────────────────────────── */
    await queryInterface.bulkInsert(
      'history',
      [
        {
          id: randomUUID(),
          title: 'Fundação da Paróquia (1952)',
          content:
            'A Paróquia Santo André foi fundada em 1952 por Pe. Francisco Rodrigues. Uma modesta porção de terras doada por famílias pioneiras serviu como solo fértil para a primeira capelinha, que logo se tornou o centro espiritual da comunidade tarumãense.',
        },
        {
          id: randomUUID(),
          title: 'Crescimento e Expansão (1970–2000)',
          content:
            'Nas décadas seguintes, a paróquia cresceu significativamente. Novas capelas foram abertas nos bairros e zona rural, as tradicionais quermesses ganharam fama regional e movimentos pastorais foram criados para atender às diversas necessidades espirituais e sociais da comunidade.',
        },
        {
          id: randomUUID(),
          title: 'Renovação e Modernização (2000–2026)',
          content:
            'No início do século XXI, a paróquia investiu na modernização de suas instalações e na ampliação das pastorais sociais. A presença digital foi estabelecida e os sacramentos e eventos passaram a ser melhor comunicados à comunidade, aproximando a paróquia de cada família.',
        },
      ],
      { ignoreDuplicates: true },
    );

    /* ── 13. LINKS DE INSCRIÇÃO (registration_links) ─────────── */
    await queryInterface.bulkInsert(
      'registration_links',
      [
        {
          id: randomUUID(),
          title: 'Inscrição — Catequese 2026',
          date: '2026-07-31',
          description:
            'Faça sua inscrição para a catequese paroquial de 2026. Vagas disponíveis para crianças (6-12 anos), adolescentes (13-17 anos) e adultos.',
          form_url: 'https://wa.me/5518997994927',
          image_url: null,
          is_active: true,
          created_at: now,
          updated_at: now,
        },
      ],
      { ignoreDuplicates: true },
    );
  },

  /* ─────────────────────────────────────────────── DOWN ──────── */
  async down(queryInterface) {
    await queryInterface.bulkDelete('registration_links', null, {});
    await queryInterface.bulkDelete('history', null, {});
    await queryInterface.bulkDelete('schedules', null, {});
    await queryInterface.bulkDelete('carousel', null, {});
    await queryInterface.bulkDelete('news', null, {});
    await queryInterface.bulkDelete('old_priests', null, {});
    await queryInterface.bulkDelete('pastorals', null, {});
    await queryInterface.bulkDelete('events', null, {});
    await queryInterface.bulkDelete('content_texts', null, {});
    await queryInterface.bulkDelete('guides', null, {});
    await queryInterface.bulkDelete('clergy', null, {});
    await queryInterface.bulkDelete('chapels', null, {});
    await queryInterface.bulkDelete('admins', null, {});
  },
};

// Compatibility with server.js which calls seedDefaultContent() directly
module.exports.seedDefaultContent = async () => {
  const sequelize = require('../config/sequelize');
  const queryInterface = sequelize.getQueryInterface();
  await module.exports.up(queryInterface);
};
