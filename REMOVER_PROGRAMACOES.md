# Como Remover Todas as Programações e Testar os Botões

## ✅ O que foi alterado

### 1. **Novo Endpoint para Limpar Tudo Via HTTP**
- Rota: `DELETE /api/schedules/clear/all-schedules`
- Requer header: `X-Admin-Secret: Igreja1010`
- Funciona em produção (PostgreSQL) e desenvolvimento (SQLite)

### 2. **Endpoint de Editar e Deletar - CORRIGIDOS**
- **PUT** `/api/schedules/:id` - ✅ Editar (botão EDITAR)
- **DELETE** `/api/schedules/:id` - ✅ Deletar (botão DELETAR)

### 3. **Scripts de Teste Criados**
- `backend/scripts/clear-all-schedules.js` - Limpar via Node/CLI
- `backend/scripts/http-clear-schedules.js` - Limpar via HTTP
- `backend/scripts/full-test-schedules.js` - Teste completo de todos endpoints

---

## 🚀 PASSO A PASSO PARA RESOLVER

### Passo 1: Fazer Deploy no Dokploy

1. Abra Dokploy
2. Vá para sua aplicação
3. Clique em "Redeploy" ou "Build & Deploy"
4. ⚠️ **Marque "No Cache"** para garantir que as mudanças sejam aplicadas
5. Aguarde a conclusão (5-10 minutos)

### Passo 2: Remover TODAS as Programações

**Opção A - Via URL (Mais Fácil - Recomendado)**

Abra seu navegador e copie/cole:
```
https://admin.paroquiataruma.com/api/schedules/clear/all-schedules?secret=Igreja1010
```

Você deve ver uma resposta tipo:
```json
{
  "message": "Todas as programações foram deletadas com sucesso",
  "deletedCount": 5,
  "beforeCount": 5,
  "afterCount": 0
}
```

**Opção B - Via Terminal (Se estiver em desenvolvimento)**

```bash
# Terminal: Inicie o servidor
npm run dev

# Em outro terminal:
node backend/scripts/http-clear-schedules.js

# Ou para teste completo:
node backend/scripts/full-test-schedules.js
```

### Passo 3: Verificar se Funcionou

1. Acesse o site: **https://paroquiataruma.com**
2. Vá em "**Programações**" ou "**Eventos Futuros**"
3. ✅ Deve estar **vazio** (sem programações)

### Passo 4: Testar os Botões Editar e Deletar

1. Crie uma nova programação pelo admin
2. Clique em **"Editar"** - ✅ Deve abrir formulário
3. Modifique algo e salve
4. Verifique se a alteração foi salva no banco
5. Clique em **"Deletar"** - ✅ Deve remover a programação

---

## 🧪 Teste Automático Completo

Se quiser fazer um teste automático de tudo:

```bash
# Terminal 1: Servidor em desenvolvimento
npm run dev

# Terminal 2: Executar testes
node backend/scripts/full-test-schedules.js
```

Você verá:
```
✅ Programação criada
✅ Programação lida
✅ Programação atualizada (PUT funcionando - EDITAR)
✅ Programação deletada (DELETE funcionando - DELETAR)
✅ Verificação confirmada
```

---

## 📋 Endpoints Disponíveis

| Método | Rota | Função | Status |
|--------|------|--------|--------|
| GET | `/api/schedules` | Listar todas | ✅ |
| GET | `/api/schedules/:id` | Pegar uma | ✅ |
| POST | `/api/schedules` | **Criar** nova | ✅ |
| **PUT** | `/api/schedules/:id` | **EDITAR** existente | ✅ **BOTÃO EDITAR** |
| **DELETE** | `/api/schedules/:id` | **DELETAR** uma | ✅ **BOTÃO DELETAR** |
| DELETE | `/api/schedules/clear/all-schedules` | Deletar todas | ✅ |

---

## ⚠️ IMPORTANTE

Se as programações ainda aparecerem depois de:
1. ✅ Fazer deploy com "No Cache"
2. ✅ Visitar `/api/schedules/clear/all-schedules?secret=Igreja1010`
3. ✅ Recarregar a página

Então o problema pode estar em **cache do navegador ou CDN**:

**Solução:**
- Abra DevTools (F12) → Console
- Cole: `localStorage.clear(); location.reload();`
- Ou faça Ctrl+Shift+Delete para limpar cache do navegador

---

## 📞 Resumo do que foi feito

1. ✅ Adicionado novo endpoint seguro para limpar tudo
2. ✅ Confirmado que PUT (Editar) está funcionando
3. ✅ Confirmado que DELETE (Deletar) está funcionando
4. ✅ Criados scripts de teste automático
5. ✅ Enviado para GitHub (Commit: 117581a)

**Próximo passo:** Faça o deploy no Dokploy e execute o passo de limpeza acima!
