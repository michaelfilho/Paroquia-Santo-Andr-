/**
 * Script para limpar todas as programações via HTTP request
 * Funciona em produção e desenvolvimento
 * 
 * Usage: node backend/scripts/http-clear-schedules.js
 */

const http = require('http');

const API_URL = process.env.API_URL || 'http://localhost:3000/api/schedules';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'Igreja1010';

function makeRequest(method, path, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: body ? JSON.parse(body) : null,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: body,
          });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function clearSchedules() {
  try {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🗑️  REMOVENDO TODAS AS PROGRAMAÇÕES VIA HTTP');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log(`📡 Conectando a: ${API_URL}`);
    console.log(`🔐 Secret: ${ADMIN_SECRET}\n`);

    // Fazer requisition DELETE para o novo endpoint
    console.log('⏳ Enviando requisição de limpeza...\n');
    
    const response = await makeRequest(
      'DELETE',
      '/clear/all-schedules',
      {
        'X-Admin-Secret': ADMIN_SECRET,
      }
    );

    console.log(`Status: ${response.status}`);
    console.log('Resposta:');
    console.log(JSON.stringify(response.body, null, 2));

    if (response.status === 200) {
      console.log('\n✅ SUCESSO! Todas as programações foram deletadas!');
      console.log(`   Deletadas: ${response.body.deletedCount}`);
      console.log(`   Restantes: ${response.body.afterCount}`);
    } else if (response.status === 401) {
      console.log('\n❌ ERRO: Não autorizado! Secret inválida.');
    } else {
      console.log('\n⚠️  Aviso: Status inesperado.');
    }

    console.log('\n═══════════════════════════════════════════════════════════\n');
    process.exit(response.status === 200 ? 0 : 1);
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    process.exit(1);
  }
}

clearSchedules();
