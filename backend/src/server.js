require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/sequelize');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const chapelRoutes = require('./routes/chapels');
const clergyRoutes = require('./routes/clergy');
const guideRoutes = require('./routes/guides');
const inscriptionRoutes = require('./routes/inscriptions');
const contentRoutes = require('./routes/content');
const authMiddleware = require('./middleware/auth');
const { seedDefaultContent } = require('./seeders/002-default-content');

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
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend funcionando perfeitamente!' });
});

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes (requerem autenticação)
app.use('/api/events', authMiddleware, eventRoutes);
app.use('/api/chapels', authMiddleware, chapelRoutes);
app.use('/api/clergy', authMiddleware, clergyRoutes);
app.use('/api/guides', authMiddleware, guideRoutes);
app.use('/api/inscriptions', authMiddleware, inscriptionRoutes);
app.use('/api/content', authMiddleware, contentRoutes);

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
    
    console.log('🔄 Sincronizando schema...');
    await sequelize.sync({ alter: true });
    console.log('✅ Schema sincronizado');

    console.log('🌱 Verificando conteúdo padrão...');
    await seedDefaultContent();
    console.log('✅ Conteúdo padrão verificado');
    
    console.log(`🚀 Iniciando servidor na porta ${PORT}...`);
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Servidor ATIVO em http://localhost:${PORT}`);
      console.log(`✅ CORS habilitado para frontend`);
      console.log('========== SERVIDOR PRONTO PARA REQUISIÇÕES =========\n');
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
