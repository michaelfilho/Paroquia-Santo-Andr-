const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  console.log('✅ GET /api/health');
  res.json({ status: 'ok' });
});

app.post('/api/auth/login', (req, res) => {
  console.log('POST /api/auth/login:', req.body);
  res.json({ token: 'test-token' });
});

console.log('Iniciando Express...');
const server = app.listen(PORT, () => {
  console.log(`✅ Server rodando na porta ${PORT}`);
});

server.on('error', (e) => console.error('Error:', e));
