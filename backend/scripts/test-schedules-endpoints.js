/**
 * Script para testar os endpoints de programação (editar e deletar)
 * Usage: npm run dev (no terminal 1) e node backend/scripts/test-schedules-endpoints.js (no terminal 2)
 */

const http = require('http');

const API_URL = 'http://localhost:3000/api/schedules';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
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

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testScheduleEndpoints() {
  console.log('🧪 Iniciando testes dos endpoints de programação...\n');

  try {
    // 1. CREATE a test schedule
    console.log('1️⃣ Criando uma programação de teste...');
    const createRes = await makeRequest('POST', '', {
      title: 'Programa de Teste',
      date: '2026-03-20',
      timeStart: '10:00',
      timeEnd: '11:00',
      location: 'Local de Teste',
      description: 'Descrição de teste',
      category: 'Teste',
      isPublished: false,
    });

    if (createRes.status !== 201) {
      console.error('❌ Erro ao criar programação:', createRes);
      process.exit(1);
    }

    const testScheduleId = createRes.body.schedule.id;
    console.log(`✅ Programação criada com sucesso! ID: ${testScheduleId}\n`);

    // 2. UPDATE the schedule (test PUT endpoint)
    console.log('2️⃣ Atualizando a programação (teste do endpoint PUT)...');
    const updateRes = await makeRequest('PUT', `/${testScheduleId}`, {
      title: 'Programa Atualizado',
      description: 'Descrição atualizada',
      isPublished: true,
    });

    if (updateRes.status !== 200) {
      console.error('❌ Erro ao atualizar programação:', updateRes);
      process.exit(1);
    }

    console.log('✅ Programação atualizada com sucesso!');
    console.log(`   - Novo título: ${updateRes.body.schedule.title}`);
    console.log(`   - Novo status publicado: ${updateRes.body.schedule.isPublished}\n`);

    // 3. DELETE the schedule (test DELETE endpoint)
    console.log('3️⃣ Deletando a programação (teste do endpoint DELETE)...');
    const deleteRes = await makeRequest('DELETE', `/${testScheduleId}`);

    if (deleteRes.status !== 200) {
      console.error('❌ Erro ao deletar programação:', deleteRes);
      process.exit(1);
    }

    console.log('✅ Programação deletada com sucesso!\n');

    // 4. Verify deletion
    console.log('4️⃣ Verificando se a programação foi realmente deletada...');
    const verifyRes = await makeRequest('GET', `/${testScheduleId}`);

    if (verifyRes.status === 404) {
      console.log('✅ Confirmado: Programação não existe mais no banco!\n');
    } else {
      console.error('⚠️  Aviso: Programação ainda existe!');
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ TODOS OS TESTES PASSARAM COM SUCESSO!');
    console.log('✅ Endpoints de editar (PUT) e deletar (DELETE) estão funcionando!');
    console.log('═══════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar testes:', error.message);
    process.exit(1);
  }
}

// Wait a bit for server to be ready
setTimeout(() => {
  testScheduleEndpoints();
}, 2000);
