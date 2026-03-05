require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/sequelize');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const scheduleRoutes = require('./routes/schedules');
const chapelRoutes = require('./routes/chapels');
const clergyRoutes = require('./routes/clergy');
const guideRoutes = require('./routes/guides');
const inscriptionRoutes = require('./routes/inscriptions');
const contentRoutes = require('./routes/content');
const uploadRoutes = require('./routes/upload');
const eventPhotosRoutes = require('./routes/event-photos');
const adminRoutes = require('./routes/admins');
const movementsRoutes = require('./routes/movements');
const formerPriestsRoutes = require('./routes/formerpriests');
const newsRoutes = require('./routes/news');
const carouselRoutes = require('./routes/carousel');
const registrationLinksRoutes = require('./routes/registration-links');
const liturgyRoutes = require('./routes/liturgy');
const authMiddleware = require('./middleware/auth');
const { seedDefaultContent } = require('./seeders/002-default-content');
const { autoArchiveExpiredEvents } = require('./utils/event-auto-archive');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('\n🔄 ========== INICIANDO SERVIDOR ==========');
console.log('Porta:', PORT);
console.log('Ambiente:', process.env.NODE_ENV || 'development');

// Middlewares
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://paroquiataruma.com',
    'https://www.paroquiataruma.com',
    'https://www.api.paroquiataruma.com',
    'https://admin.paroquiataruma.com',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de debug para todas as requisições
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Servir arquivos estáticos (imagens) com CORS habilitado
app.use('/api/uploads', cors(corsOptions), (req, res, next) => {
  console.log(`🖼️  Tentando acessar: ${req.path}`);
  next();
}, express.static(path.join(__dirname, '../../Styles/img'), {
  setHeaders: (res, filepath) => {
    console.log(`📤 Servindo arquivo: ${filepath}`);
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend funcionando perfeitamente!' });
});

// Public Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// Public event photos endpoint
app.get('/api/public/event-photos/:eventId', async (req, res) => {
  try {
    const { EventPhoto } = require('./models');
    const photos = await EventPhoto.findAll({
      where: { eventId: req.params.eventId },
      order: [['id', 'DESC']]
    });
    res.json(photos);
  } catch (error) {
    console.error('Erro ao buscar fotos públicas:', error);
    res.status(500).json({ message: 'Erro ao buscar fotos', error: error.message });
  }
});

// Public events endpoint
app.get('/api/public/events', async (req, res) => {
  try {
    const { Event, EventPhoto } = require('./models');
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const toDateOnly = (value) => {
      if (!value) return new Date('invalid');
      if (value instanceof Date) {
        return new Date(value.getFullYear(), value.getMonth(), value.getDate());
      }
      if (typeof value === 'string') {
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          return new Date(`${value}T00:00:00`);
        }
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
          return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
        }
      }
      const fallback = new Date(value);
      if (!Number.isNaN(fallback.getTime())) {
        return new Date(fallback.getFullYear(), fallback.getMonth(), fallback.getDate());
      }
      return new Date('invalid');
    };

    const events = await Event.findAll({
      order: [['date', 'ASC']],
      include: [{ model: EventPhoto, as: 'photos', attributes: ['id'] }]
    });

    const publicEvents = events.filter((event) => {
      return event.isPublished === true;
    }).map(e => {
      const json = e.toJSON();
      json.hasPhotos = json.photos && json.photos.length > 0;
      return json;
    });

    res.json(publicEvents);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar eventos', error: error.message });
  }
});

app.use('/api/schedules', scheduleRoutes);

app.get('/api/public/inscription-events', async (req, res) => {
  try {
    const { Event, Inscription } = require('./models');

    const events = await Event.findAll({
      where: {
        isPublished: true,
        isInscriptionEvent: true,
        isActive: true,
      },
      order: [['date', 'ASC']],
    });

    const eventsWithAvailability = await Promise.all(
      events.map(async (event) => {
        const confirmedCount = await Inscription.count({
          where: {
            eventId: event.id,
            status: 'Confirmado',
          },
        });

        const maxParticipants = Number(event.maxParticipants || 0);
        const availableSpots = Math.max(maxParticipants - confirmedCount, 0);
        const status = maxParticipants > 0 && availableSpots > 0 ? 'open' : 'closed';

        return {
          ...event.toJSON(),
          confirmedInscriptions: confirmedCount,
          availableSpots,
          status,
        };
      })
    );

    res.json(eventsWithAvailability);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar eventos de inscrição', error: error.message });
  }
});

// Public routes for new CMS entities
app.use('/api/public/movements', movementsRoutes);
app.use('/api/public/former-priests', formerPriestsRoutes);
app.use('/api/public/news', newsRoutes);
app.use('/api/public/carousel', carouselRoutes);
app.use('/api/public/liturgy', liturgyRoutes);
app.get('/api/public/registration-links', async (req, res) => {
  try {
    const { RegistrationLink } = require('./models');
    const items = await RegistrationLink.findAll({
      where: { isActive: true },
      order: [['date', 'ASC'], ['createdAt', 'DESC']],
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar inscrições públicas', error: error.message });
  }
});

// Public GET routes for other CMS entities
app.get('/api/public/chapels', async (req, res) => {
  try {
    const { Chapel } = require('./models');
    const chapels = await Chapel.findAll({ order: [['name', 'ASC']] });
    res.json(chapels);
  } catch (error) {
    console.error('Erro capelas:', error);
    res.status(500).json({ message: 'Erro ao buscar capelas' });
  }
});

app.get('/api/public/clergy', async (req, res) => {
  try {
    const { ClergyMember } = require('./models');
    const clergy = await ClergyMember.findAll({ order: [['name', 'ASC']] });
    res.json(clergy);
  } catch (error) {
    console.error('Erro clero:', error);
    res.status(500).json({ message: 'Erro ao buscar clero' });
  }
});

app.get('/api/public/guides', async (req, res) => {
  try {
    const { Guide } = require('./models');
    const guides = await Guide.findAll({ order: [['title', 'ASC']] });
    res.json(guides);
  } catch (error) {
    console.error('Erro guias:', error);
    res.status(500).json({ message: 'Erro ao buscar guias' });
  }
});

app.get('/api/public/content', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    const { ContentText } = require('./models');
    const texts = await ContentText.findAll();
    res.json(texts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar textos' });
  }
});

app.get('/api/public/content/:key', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    const { ContentText } = require('./models');
    const text = await ContentText.findOne({ where: { key: req.params.key } });
    if (!text) return res.status(404).json({ message: 'Texto não encontrado' });
    res.json(text);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar texto' });
  }
});

app.get('/api/public/candles/count', async (req, res) => {
  try {
    const { ContentText } = require('./models');
    const counter = await ContentText.findOne({ where: { key: 'lit_candles_count' } });
    const count = counter ? Number(counter.content || '0') : 0;
    res.json({ count: Number.isNaN(count) ? 0 : count });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar contador de velas', error: error.message });
  }
});

app.post('/api/public/candles/increment', async (req, res) => {
  try {
    const { ContentText } = require('./models');
    const counter = await ContentText.findOne({ where: { key: 'lit_candles_count' } });

    if (!counter) {
      const created = await ContentText.create({
        key: 'lit_candles_count',
        title: 'Contador de Velas Acesas',
        content: '1',
      });
      return res.json({ count: 1, recordId: created.id });
    }

    const current = Number(counter.content || '0');
    const next = (Number.isNaN(current) ? 0 : current) + 1;
    await counter.update({ content: String(next) });
    res.json({ count: next });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao incrementar contador de velas', error: error.message });
  }
});

app.get('/api/public/site-visits/count', async (req, res) => {
  try {
    const { ContentText } = require('./models');
    const counter = await ContentText.findOne({ where: { key: 'site_visits_count' } });
    const count = counter ? Number(counter.content || '0') : 0;
    res.json({ count: Number.isNaN(count) ? 0 : count });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar contador de acessos', error: error.message });
  }
});

app.post('/api/public/site-visits/increment', async (req, res) => {
  try {
    const { ContentText } = require('./models');
    const counter = await ContentText.findOne({ where: { key: 'site_visits_count' } });

    if (!counter) {
      const created = await ContentText.create({
        key: 'site_visits_count',
        title: 'Contador de Acessos ao Site',
        content: '1',
      });
      return res.json({ count: 1, recordId: created.id });
    }

    const current = Number(counter.content || '0');
    const next = (Number.isNaN(current) ? 0 : current) + 1;
    await counter.update({ content: String(next) });
    res.json({ count: next });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao incrementar contador de acessos', error: error.message });
  }
});

app.post('/api/public/prayer-requests', async (req, res) => {
  try {
    const { PrayerRequest } = require('./models');
    const intention = typeof req.body?.intention === 'string' ? req.body.intention.trim() : '';

    if (!intention) {
      return res.status(400).json({ message: 'Intenção de oração é obrigatória' });
    }

    const prayerRequest = await PrayerRequest.create({ intention });
    res.status(201).json({ message: 'Pedido de oração registrado com sucesso', prayerRequest });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar pedido de oração', error: error.message });
  }
});

// Protected Routes (requerem autenticação)
app.use('/api/events', authMiddleware, eventRoutes);
app.use('/api/chapels', authMiddleware, chapelRoutes);
app.use('/api/clergy', authMiddleware, clergyRoutes);
app.use('/api/guides', authMiddleware, guideRoutes);
app.use('/api/inscriptions', authMiddleware, inscriptionRoutes);
app.use('/api/content', authMiddleware, contentRoutes);
app.use('/api/event-photos', authMiddleware, eventPhotosRoutes);
app.use('/api/admins', authMiddleware, adminRoutes);
app.use('/api/movements', authMiddleware, movementsRoutes);
app.use('/api/former-priests', authMiddleware, formerPriestsRoutes);
app.use('/api/news', authMiddleware, newsRoutes);
app.use('/api/carousel', authMiddleware, carouselRoutes);
app.use('/api/registration-links', authMiddleware, registrationLinksRoutes);

// Serve event photos
app.use('/api/uploads/eventos', cors(corsOptions), express.static(path.join(__dirname, '../../Styles/img/eventos'), {
  setHeaders: (res, filepath) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
    status: err.status || 500,
  });
});

// Sincronizar banco dados primeiro, depois iniciar servidor
const initializeServer = async () => {
  try {
    console.log('📊 Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Banco de dados autenticado');

    const ensureSQLiteColumns = async () => {
      if (!sequelize.getDialect || sequelize.getDialect() !== 'sqlite') return;

      const ensureColumns = async (tableName, columns) => {
        const [info] = await sequelize.query(`PRAGMA table_info(${tableName});`);
        const existing = new Set((info || []).map((column) => column.name));

        for (const column of columns) {
          if (existing.has(column.name)) continue;
          const sql = `ALTER TABLE ${tableName} ADD COLUMN ${column.name} ${column.type};`;
          await sequelize.query(sql);
          console.log(`🔧 Coluna adicionada: ${tableName}.${column.name}`);
        }
      };

      await ensureColumns('chapels', [
        { name: 'coordinator', type: 'TEXT' },
        { name: 'phone', type: 'TEXT' },
        { name: 'email', type: 'TEXT' },
        { name: 'description', type: 'TEXT' },
      ]);

      await ensureColumns('news', [
        { name: 'summary', type: 'TEXT' },
      ]);

      await ensureColumns('old_priests', [
        { name: 'subtext', type: 'TEXT' },
      ]);

      await ensureColumns('carousel', [
        { name: 'button_text', type: "TEXT DEFAULT 'Saiba Mais'" },
        { name: 'title_highlight', type: 'TEXT' },
        { name: 'title_color', type: "TEXT DEFAULT '#FFFFFF'" },
        { name: 'title_color_end', type: "TEXT DEFAULT '#F59E0B'" },
        { name: 'subtitle_color', type: "TEXT DEFAULT '#F3F4F6'" },
        { name: 'link_color', type: "TEXT DEFAULT '#FFFFFF'" },
        { name: 'mobile_image_url', type: 'TEXT' },
      ]);
    };

    await ensureSQLiteColumns();
    // Ensure existing rows in key tables have unique, non-null ids before running
    // `sync({ alter: true })` — SQLite/Sequelize may create a backup table and
    // copy data, which fails if there are duplicate/null primary keys.
    const ensureUniqueIdsForTable = async (tableName, label) => {
      try {
        // Only run this for SQLite where the issue was observed
        if (sequelize.getDialect && sequelize.getDialect() !== 'sqlite') return;

        console.log(`🔍 Verificando ids da tabela \`${label}\` (pre-sync)...`);
        // Get all rows with their rowid and id
        const [rows] = await sequelize.query(`SELECT rowid, id FROM ${tableName};`);

        if (!rows || rows.length === 0) {
          console.log(`ℹ️  Tabela \`${label}\` vazia — nada a fazer`);
          return;
        }

        const crypto = require('crypto');

        // Map id -> occurrences (array of rowids)
        const idMap = new Map();
        for (const r of rows) {
          const rid = r.rowid;
          const id = r.id;
          if (id === null || id === undefined || id === '') {
            // Assign a new uuid immediately
            const newId = crypto.randomUUID();
            await sequelize.query(`UPDATE ${tableName} SET id = :newId WHERE rowid = :rid;`, {
              replacements: { newId, rid },
            });
            console.log(`🔧 [${label}] Preenchido id nulo para rowid=${rid}`);
            // add to map
            idMap.set(newId, [rid]);
            continue;
          }
          if (!idMap.has(id)) idMap.set(id, []);
          idMap.get(id).push(rid);
        }

        // For any id that appears more than once, keep the first row and
        // assign new uuids to the rest.
        for (const [id, occ] of idMap.entries()) {
          if (occ.length > 1) {
            // skip the first occurrence
            for (let i = 1; i < occ.length; i++) {
              const rid = occ[i];
              const newId = crypto.randomUUID();
              await sequelize.query(`UPDATE ${tableName} SET id = :newId WHERE rowid = :rid;`, {
                replacements: { newId, rid },
              });
              console.log(`🔧 [${label}] Corrigido id duplicado (original=${id}) para rowid=${rid}`);
            }
          }
        }

        console.log(`✅ Verificação de ids concluída para \`${label}\``);
      } catch (err) {
        console.error(`❌ Falha ao garantir ids únicos em \`${label}\`:`, err.message || err);
        // don't rethrow — sync should still run and surface errors if any
      }
    };

    await ensureUniqueIdsForTable('events', 'events');
    await ensureUniqueIdsForTable('news', 'news');

    console.log('🔄 Sincronizando schema...');
    let foreignKeysDisabled = false;
    try {
      if (sequelize.getDialect && sequelize.getDialect() === 'sqlite') {
        console.log('⚠️  SQLite detectado — desabilitando foreign_keys para sincronização');
        await sequelize.query('PRAGMA foreign_keys = OFF;');
        foreignKeysDisabled = true;
      }

      await sequelize.sync();
      console.log('✅ Schema sincronizado');
    } finally {
      if (foreignKeysDisabled) {
        try {
          await sequelize.query('PRAGMA foreign_keys = ON;');
          console.log('✅ foreign_keys reabilitado');
        } catch (err) {
          console.error('Erro ao reabilitar foreign_keys:', err.message || err);
        }
      }
    }

    console.log('🌱 Verificando conteúdo padrão...');
    await seedDefaultContent();
    console.log('✅ Conteúdo padrão verificado');

    console.log(`🚀 Iniciando servidor na porta ${PORT}...`);
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Servidor ATIVO em http://localhost:${PORT}`);
      console.log(`✅ CORS habilitado para frontend`);
      console.log('========== SERVIDOR PRONTO PARA REQUISIÇÕES =========\n');

      // Iniciar auto-archive de eventos a cada 10 minutos
      setInterval(async () => {
        try {
          const result = await autoArchiveExpiredEvents();
          if (result.archived > 0) {
            console.log(`🔄 Auto-archive: ${result.archived} evento(s) arquivado(s)`);
          }
        } catch (error) {
          console.error('❌ Erro no auto-archive:', error.message);
        }
      }, 10 * 60 * 1000); // 10 minutos
    });

    server.on('error', (err) => {
      console.error('❌ ERRO NO SERVIDOR:', err.message);
      console.error(err);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Erro ao inicializar servidor:', error.message);
    console.error(error);
    process.exit(1);
  }
};

initializeServer();
