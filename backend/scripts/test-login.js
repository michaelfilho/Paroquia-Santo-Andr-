/**
 * Script de teste para verificar login via API
 * Executa: node scripts/test-login.js
 */

const http = require('http');

const testLogin = () => {
  const data = JSON.stringify({
    username: 'admin',
    password: 'admin123',
  });

  const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      console.log('\n📨 Resposta do servidor:');
      console.log('Status:', res.statusCode);
      console.log('Corpo:', body);
      try {
        const json = JSON.parse(body);
        if (json.token) {
          console.log('✅ LOGIN FUNCIONANDO!');
          console.log('Token:', json.token.substring(0, 50) + '...');
        }
      } catch (e) {
        console.log('Resposta não é JSON');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erro na requisição:', error.message);
    console.error('Código:', error.code);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Backend não está rodando na porta 5000!');
      console.error('Execute: npm run dev');
    }
  });

  console.log('🧪 Testando login...');
  console.log('Username: admin');
  console.log('Password: admin123');
  console.log('URL: http://localhost:5000/api/auth/login\n');
  
  req.write(data);
  req.end();
};

testLogin();
