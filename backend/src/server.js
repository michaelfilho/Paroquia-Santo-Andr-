require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/sequelize');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const chapelRoutes = require('./routes/chapels');
const clergyRoutes = require('./routes/clergy');
const guideRoutes = require('./routes/guides');
const inscriptionRoutes = require('./routes/inscriptions');
const contentRoutes = require('./routes/content');
const uploadRoutes = require('./routes/upload');
const eventPhotosRoutes = require('./routes/event-photos');
const adminRoutes = require('./routes/admins');
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
      order: [['createdAt', 'DESC']]
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
    const { Event, Inscription } = require('./models');
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

    // Buscar eventos que devem aparecer publicamente
    const events = await Event.findAll({
      where: { isInscriptionEvent: false },
      order: [['date', 'ASC']],
    });

    // Filtrar apenas eventos que devem aparecer ao público
    const publicEvents = events.filter((event) => {
      const eventDate = toDateOnly(event.date);

      // Programações: aparecem se publicadas
      if (event.isProgram === true && event.published === true) {
        return true;
      }

      // Eventos realizados: aparecem somente se publicados manualmente (isProgram false)
      if (event.isProgram === false && event.published === true) {
        return true;
      }

      return false;
    });

    const eventsWithCounts = await Promise.all(
      publicEvents.map(async (event) => {
        const confirmedCount = await Inscription.count({
          where: { eventId: event.id, status: 'Confirmado' },
        });
        return {
          ...event.toJSON(),
          confirmedInscriptions: confirmedCount,
        };
      })
    );

    res.json(eventsWithCounts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar eventos', error: error.message });
  }
});

// Public inscription events endpoint - SOMENTE eventos criados na aba Inscrições
app.get('/api/public/inscription-events', async (req, res) => {
  try {
    const { Event, Inscription } = require('./models');

    // Buscar eventos de inscricao publicados (independente de isActive)
    const events = await Event.findAll({
      where: {
        isInscriptionEvent: true,
        published: true,
      },
      order: [['date', 'ASC']],
    });

    // Adicionar contagem de inscrições
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const confirmedCount = await Inscription.count({
          where: { eventId: event.id, status: 'Confirmado' },
        });
        
        const availableSpots = event.maxParticipants 
          ? Math.max(0, event.maxParticipants - confirmedCount)
          : null;

        return {
          ...event.toJSON(),
          confirmedInscriptions: confirmedCount,
          availableSpots: availableSpots,
          status: event.maxParticipants && confirmedCount >= event.maxParticipants ? 'closed' : 'open',
        };
      })
    );

    res.json(eventsWithCounts);
  } catch (error) {
    console.error('Erro ao buscar eventos de inscrição:', error);
    res.status(500).json({ message: 'Erro ao buscar eventos de inscrição', error: error.message });
  }
});

// Public inscription creation route (sem autenticação)
app.post('/api/public/inscriptions', async (req, res) => {
  try {
    const { eventId, name, phone } = req.body;

    if (!eventId || !name || !phone) {
      return res.status(400).json({ message: 'Nome e telefone são obrigatórios' });
    }

    const { Inscription, Event } = require('./models');

    // Verify if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    if (!event.acceptsRegistration) {
      return res.status(400).json({ message: 'Este evento não aceita inscrições' });
    }

    // VALIDAÇÃO DE LIMITE DE VAGAS
    if (event.maxParticipants && event.maxParticipants > 0) {
      const confirmedCount = await Inscription.count({
        where: { 
          eventId: eventId, 
          status: 'Confirmado' 
        }
      });

      if (confirmedCount >= event.maxParticipants) {
        return res.status(400).json({ 
          message: 'Vagas esgotadas para este evento',
          availableSpots: 0,
          totalSpots: event.maxParticipants
        });
      }
    }

    const inscription = await Inscription.create({
      eventId,
      name,
      email: null,
      phone,
      status: 'Pendente',
    });

    res.status(201).json({
      message: 'Inscrição realizada com sucesso',
      inscription,
    });
  } catch (error) {
    console.error('Erro ao criar inscrição pública:', error);
    res.status(500).json({ message: 'Erro ao criar inscrição', error: error.message });
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
    // Ensure existing rows in `events` have unique, non-null ids before running
    // `sync({ alter: true })` — SQLite/Sequelize may create a backup table and
    // copy data, which fails if there are duplicate/null primary keys.
    const ensureUniqueEventIds = async () => {
      try {
        // Only run this for SQLite where the issue was observed
        if (sequelize.getDialect && sequelize.getDialect() !== 'sqlite') return;

        console.log('🔍 Verificando ids da tabela `events` (pre-sync)...');
        // Get all rows with their rowid and id
        const [rows] = await sequelize.query('SELECT rowid, id FROM events;');

        if (!rows || rows.length === 0) {
          console.log('ℹ️  Tabela `events` vazia — nada a fazer');
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
            await sequelize.query('UPDATE events SET id = :newId WHERE rowid = :rid;', {
              replacements: { newId, rid },
            });
            console.log(`🔧 Preenchido id nulo para rowid=${rid}`);
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
              await sequelize.query('UPDATE events SET id = :newId WHERE rowid = :rid;', {
                replacements: { newId, rid },
              });
              console.log(`🔧 Corrigido id duplicado (original=${id}) para rowid=${rid}`);
            }
          }
        }

        console.log('✅ Verificação de ids concluída');
      } catch (err) {
        console.error('❌ Falha ao garantir ids únicos em `events`:', err.message || err);
        // don't rethrow — sync should still run and surface errors if any
      }
    };

    await ensureUniqueEventIds();

    console.log('🔄 Sincronizando schema...');
    let foreignKeysDisabled = false;
    try {
      if (sequelize.getDialect && sequelize.getDialect() === 'sqlite') {
        console.log('⚠️  SQLite detectado — desabilitando foreign_keys para sincronização');
        await sequelize.query('PRAGMA foreign_keys = OFF;');
        foreignKeysDisabled = true;
      }

      await sequelize.sync({ alter: true });
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
