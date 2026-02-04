const express = require('express');
const cors = require('cors');
const net = require('net');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  console.log('✅ [health] GET /api/health');
  res.json({ status: 'ok' });
});

app.post('/api/auth/login', (req, res) => {
  console.log('✅ [login] POST /api/auth/login:', req.body);
  res.json({ token: 'test-token-123', username: req.body.username });
});

console.log('\n🔄 Iniciando servidor...');
console.log(`📍 Tentando escutar em 0.0.0.0:${PORT}\n`);

const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(`✅ CALLBACK: Servidor está escutando na porta ${PORT}`);
  
  // Verificar se realmente está escutando
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const tester = net.createConnection(PORT, '127.0.0.1');
  tester.on('connect', () => {
    console.log('✅ VERIFICAÇÃO: Porta 3000 está respondendo!');
    tester.destroy();
  });
  tester.on('error', (err) => {
    console.error('❌ VERIFICAÇÃO FALHOU:', err.message);
  });
});

server.on('error', (err) => {
  console.error('❌ ERRO NO SERVIDOR:', err.message);
  console.error('Detalhes:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Servidor interrompido');
  process.exit(0);
});
