# 🚀 GUIA DE INICIALIZAÇÃO - PARÓQUIA SANTO ANDRÉ

## ✅ SISTEMA PRONTO PARA USO

Todo o sistema está **100% completo e integrado**:
- ✅ Frontend React + TypeScript
- ✅ Backend Node.js + Express
- ✅ Banco de dados SQLite
- ✅ API RESTful com JWT
- ✅ Autenticação Segura
- ✅ Persistência de Dados

---

## 📋 PRÉ-REQUISITOS

Verifique se você tem instalado:
- **Node.js** (v18+) - [Download](https://nodejs.org)
- **Git** (opcional, mas recomendado)

Para verificar se está tudo instalado:
```bash
node --version
npm --version
```

---

## 🎯 COMO INICIAR A APLICAÇÃO

### **PASSO 1: Abra dois terminais (PowerShell)**

Terminal 1 será para o **Backend**
Terminal 2 será para o **Frontend**

---

### **PASSO 2: INICIE O BACKEND**

No **Terminal 1**, execute:

```bash
cd "d:\2025\Paroquia Santo André\backend"
npm run dev
```

✅ Você deve ver:
```
✅ Servidor rodando na porta 5000
📊 Banco de dados conectado com sucesso!
```

**O backend está pronto em `http://localhost:5000`**

---

### **PASSO 3: INICIE O FRONTEND**

No **Terminal 2**, execute:

```bash
cd "d:\2025\Paroquia Santo André"
npm run dev
```

✅ Você deve ver:
```
VITE v5.4.21  ready in XXX ms
Local:   http://localhost:5174/
```

**O frontend está pronto em `http://localhost:5174`**

---

## 🔐 CREDENCIAIS DE ACESSO

### Admin Dashboard

**Usuário:** `admin`
**Senha:** `admin123`

Para acessar o painel administrativo:
1. Abra `http://localhost:5174`
2. Clique em "Admin" no topo
3. Digite as credenciais acima
4. Você terá acesso completo para:
   - 📅 Gerenciar Eventos
   - ⛪ Gerenciar Capelas
   - 🕯️ Gerenciar Clero
   - 📖 Gerenciar Guias
   - 📝 Visualizar Inscrições

---

## 🌐 URLs DA APLICAÇÃO

| Seção | URL |
|-------|-----|
| **Frontend (Site Principal)** | `http://localhost:5174` |
| **Admin Dashboard** | `http://localhost:5174` (clique em Admin) |
| **Backend API** | `http://localhost:5000` |
| **API Docs** | Veja [INTEGRACAO.md](./INTEGRACAO.md) |

---

## 📦 BANCO DE DADOS

O banco de dados SQLite está em:
```
d:\2025\Paroquia Santo André\backend\db\paroquia.db
```

**Dados persistem automaticamente!**
Todos os eventos, capelas, clero e inscrições são salvos permanentemente.

---

## 🧪 FUNCIONALIDADES PRINCIPAIS

### 👥 Para Visitantes
- ✅ Ver página inicial com informações
- ✅ Ver clero da paróquia
- ✅ Ver guias (Casamento, Batismo, etc)
- ✅ **Inscrever-se em eventos** (formulário público)

### 🔑 Para Administradores
- ✅ **Login seguro** com JWT
- ✅ Criar/Editar/Deletar **Eventos**
- ✅ Criar/Editar/Deletar **Capelas**
- ✅ Criar/Editar/Deletar **Membros do Clero**
- ✅ Criar/Editar/Deletar **Guias**
- ✅ Visualizar e gerenciar **Inscrições**
- ✅ Exportar dados (em desenvolvimento)

---

## 🛑 PARAR A APLICAÇÃO

### Para parar o Backend:
No Terminal 1, pressione: `Ctrl + C`

### Para parar o Frontend:
No Terminal 2, pressione: `Ctrl + C`

---

## ⚠️ TROUBLESHOOTING

### **"Porta 5000 já está em uso"**
```bash
# Procure e mate o processo
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### **"Porta 5174 já está em uso"**
O Vite pode usar automaticamente a próxima porta (5175, 5176, etc)

### **"Cannot find module 'api'"**
Certifique-se que:
1. O backend está rodando
2. Os arquivos estão na pasta correta
3. Rode: `npm install` em ambas pastas

### **"Erro ao conectar ao banco"**
Verifique se a pasta `backend/db/` existe. Se não:
```bash
cd backend
npm run setup-db
npm run migrate
npm run seed
```

---

## 📁 ESTRUTURA DO PROJETO

```
d:\2025\Paroquia Santo André\
├── frontend/                 (React + Vite)
│   ├── componenst/          (Componentes React)
│   ├── src/                 (Código-fonte)
│   │   └── services/
│   │       └── api.ts       (Cliente API)
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                 (Node.js + Express)
│   ├── src/
│   │   ├── server.js        (Servidor principal)
│   │   ├── models/          (Modelos do BD)
│   │   ├── routes/          (Endpoints da API)
│   │   ├── middleware/      (Autenticação)
│   │   └── config/          (Configuração do BD)
│   ├── db/
│   │   └── paroquia.db      (Banco SQLite)
│   ├── migrations/          (Schema do BD)
│   └── package.json
│
└── Documentação/
    ├── README.md            (Informações gerais)
    ├── INTEGRACAO.md        (Integração frontend-backend)
    ├── STARTUP.md           (Este arquivo)
    └── ... outros arquivos
```

---

## 🔧 COMANDOS ÚTEIS

### Frontend
```bash
cd "d:\2025\Paroquia Santo André"

npm run dev              # Inicia em desenvolvimento
npm run build            # Build para produção
npm run preview          # Visualiza build
npm run lint             # Verifica código
```

### Backend
```bash
cd "d:\2025\Paroquia Santo André\backend"

npm run dev              # Inicia com nodemon (auto-reload)
npm start                # Inicia produção
npm run migrate          # Roda migrações
npm run seed             # Popula dados iniciais
npm run setup-db         # Cria banco de dados
```

---

## 📖 DOCUMENTAÇÃO ADICIONAL

- **[INTEGRACAO.md](./INTEGRACAO.md)** - Como a API funciona
- **[README.md](./README.md)** - Informações do projeto
- **[PERSONALIZACAO.md](./PERSONALIZACAO.md)** - Como personalizar

---

## ✨ PRONTO PARA COMEÇAR!

Agora é só:
1. ✅ Abrir dois terminais
2. ✅ Iniciar backend (`npm run dev`)
3. ✅ Iniciar frontend (`npm run dev`)
4. ✅ Abrir `http://localhost:5174` no navegador
5. ✅ Pronto! A aplicação está rodando! 🎉

---

## 📞 SUPORTE

Se encontrar problemas:
1. Verifique se seguiu EXATAMENTE os passos acima
2. Certifique-se que ambos terminais estão rodando
3. Procure mensagens de erro nos terminais
4. Verifique o guia de troubleshooting acima

---

**Aplicação criada para Paróquia Santo André - 2026** ⛪🙏
