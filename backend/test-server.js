const express = require('express');
const app = express();
const PORT = 5000;

console.log('Criando app Express...');

app.use(express.json());

app.get('/api/health', (req, res) => {
  console.log('GET /api/health');
  res.json({ status: 'ok' });
});

app.post('/api/auth/login', (req, res) => {
  console.log('POST /api/auth/login - body:', req.body);
  res.json({ message: 'test' });
});

console.log(`Iniciando servidor na porta ${PORT}...`);
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor simples rodando em http://0.0.0.0:${PORT}`);
  console.log(`✅ Teste: curl http://localhost:${PORT}/api/health`);
});

server.on('error', (err) => {
  console.error('❌ Erro:', err.message);
});

server.on('listening', () => {
  console.log('✅ Evento listening disparado!');
});
