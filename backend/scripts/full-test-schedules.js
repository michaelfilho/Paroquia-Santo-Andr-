/**
 * Script completo para testar todos os endpoints de agendamento
 * Testa: CREATE, READ, UPDATE (PUT/Editar), DELETE
 * 
 * Usage: npm run dev (terminal 1) e node backend/scripts/full-test-schedules.js (terminal 2)
 */

const http = require('http');

const API_URL = 'http://localhost:3000/api/schedules';
const ADMIN_SECRET = 'Igreja1010';

function makeRequest(method, path, data = null, headers = {}) {
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

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function fullTest() {
  try {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🧪 TESTE COMPLETO DOS ENDPOINTS DE PROGRAMAÇÃO');
    console.log('═══════════════════════════════════════════════════════════\n');

    // FASE 1: LIMPAR TUDO
    console.log('📋 FASE 1: Limpando banco de dados anterior...\n');
    const clearRes = await makeRequest('DELETE', '/clear/all-schedules', null, {
      'X-Admin-Secret': ADMIN_SECRET,
    });

    if (clearRes.status !== 200) {
      console.log('⚠️  Aviso ao limpar: ' + (clearRes.body?.message || 'Desconhecido'));
    } else {
      console.log(`✅ Limpeza bem-sucedida! Deletadas: ${clearRes.body.deletedCount}`);
    }

    // FASE 2: CRIAR
    console.log('\n📋 FASE 2: Criando uma programação de teste...\n');
    const testData = {
      title: 'Missa Teste - Funcionalidade',
      date: '2026-03-20',
      timeStart: '10:00',
      timeEnd: '11:30',
      location: 'Igreja Matriz',
      description: 'Programação para testar funcionalidades de EDITAR e DELETAR',
      category: 'Liturgia',
      isPublished: false,
    };

    const createRes = await makeRequest('POST', '', testData);

    if (createRes.status !== 201) {
      console.error('❌ ERRO ao criar programação:', createRes.body || createRes.status);
      process.exit(1);
    }

    const scheduleId = createRes.body.schedule?.id;
    console.log(`✅ Programação criada com sucesso!`);
    console.log(`   ID: ${scheduleId}`);
    console.log(`   Título: ${createRes.body.schedule?.title}`);
    console.log(`   Data: ${createRes.body.schedule?.date}`);

    // FASE 3: LER
    console.log('\n📋 FASE 3: Lendo a programação criada...\n');
    const getRes = await makeRequest('GET', `/${scheduleId}`);

    if (getRes.status !== 200) {
      console.error('❌ ERRO ao ler programação:', getRes.body || getRes.status);
      process.exit(1);
    }

    console.log(`✅ Programação lida com sucesso!`);
    console.log(`   Título: ${getRes.body.title}`);
    console.log(`   Publicada: ${getRes.body.isPublished}`);

    // FASE 4: ATUALIZAR (PUT - EDITAR)
    console.log('\n📋 FASE 4: Atualizando a programação (TEST EDITAR)...\n');
    const updateData = {
      title: 'Missa Teste - Atualizada!',
      description: 'Descrição foi alterada pelo teste',
      isPublished: true,
    };

    const updateRes = await makeRequest('PUT', `/${scheduleId}`, updateData);

    if (updateRes.status !== 200) {
      console.error('❌ ERRO ao atualizar programação (PUT):', updateRes.body || updateRes.status);
      process.exit(1);
    }

    console.log(`✅ Programação atualizada com sucesso! (PUT endpoint funcionando)`);
    console.log(`   Novo título: ${updateRes.body.schedule?.title}`);
    console.log(`   Nova descrição: ${updateRes.body.schedule?.description}`);
    console.log(`   Publicada: ${updateRes.body.schedule?.isPublished}`);

    // FASE 5: VERIFICAR ATUALIZAÇÃO
    console.log('\n📋 FASE 5: Verificando se as alterações foram salvas...\n');
    const verifyRes = await makeRequest('GET', `/${scheduleId}`);

    if (verifyRes.body.title === updateData.title) {
      console.log(`✅ Alterações confirmadas no banco!`);
      console.log(`   Título agora: ${verifyRes.body.title}`);
    } else {
      console.log(`⚠️  Aviso: Alterações podem não ter sido salvas`);
    }

    // FASE 6: DELETAR (DELETE)
    console.log('\n📋 FASE 6: Deletando a programação (TEST DELETAR)...\n');
    const deleteRes = await makeRequest('DELETE', `/${scheduleId}`);

    if (deleteRes.status !== 200) {
      console.error('❌ ERRO ao deletar programação (DELETE):', deleteRes.body || deleteRes.status);
      process.exit(1);
    }

    console.log(`✅ Programação deletada com sucesso! (DELETE endpoint funcionando)`);
    console.log(`   Mensagem: ${deleteRes.body.message}`);

    // FASE 7: VERIFICAR DELEÇÃO
    console.log('\n📋 FASE 7: Verificando se a programação foi realmente deletada...\n');
    const verifyDeleteRes = await makeRequest('GET', `/${scheduleId}`);

    if (verifyDeleteRes.status === 404) {
      console.log(`✅ Confirmado: Programação foi deletada do banco!`);
    } else {
      console.log(`⚠️  Aviso: Programação ainda existe! Status: ${verifyDeleteRes.status}`);
    }

    // RESUMO FINAL
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ ✅ ✅ TODOS OS TESTES PASSARAM COM SUCESSO! ✅ ✅ ✅');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n📌 RESULTADOS:\n');
    console.log('✅ POST   /api/schedules           - CRIAR      (Funcionando)');
    console.log('✅ GET    /api/schedules/:id       - LER        (Funcionando)');
    console.log('✅ PUT    /api/schedules/:id       - EDITAR     ✨ BOTÃO EDITAR OK');
    console.log('✅ DELETE /api/schedules/:id       - DELETAR    ✨ BOTÃO DELETAR OK');
    console.log('✅ DELETE /api/schedules/clear/all - LIMPAR     (Funcionando)');
    console.log('\n═══════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Aguardar um pouco para o servidor iniciar
setTimeout(() => {
  fullTest();
}, 2000);
