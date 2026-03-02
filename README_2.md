# Backend - Paróquia Santo André

API completa em Node.js com Express para gerenciamento da Paróquia Santo André.

## Configuração

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar banco de dados PostgreSQL

Você precisa ter PostgreSQL instalado. Crie um banco de dados:

```sql
CREATE DATABASE paroquia_santo_andre;
```

### 3. Configurar variáveis de ambiente

Edite o arquivo `.env` com suas configurações:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=paroquia_santo_andre
DB_USER=postgres
DB_PASSWORD=seu_password_aqui
JWT_SECRET=seu_jwt_secret_aqui
FRONTEND_URL=http://localhost:5173
```

### 4. Executar migrações

```bash
npm run migrate
```

### 5. Iniciar o servidor

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

## Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login do admin
- `POST /api/auth/verify-token` - Verificar token

### Eventos (requer autenticação)
- `GET /api/events` - Listar todos os eventos
- `GET /api/events/:id` - Obter evento por ID
- `POST /api/events` - Criar novo evento
- `PUT /api/events/:id` - Atualizar evento
- `DELETE /api/events/:id` - Deletar evento

### Capelas (requer autenticação)
- `GET /api/chapels` - Listar todas as capelas
- `GET /api/chapels/:id` - Obter capela por ID
- `POST /api/chapels` - Criar nova capela
- `PUT /api/chapels/:id` - Atualizar capela
- `DELETE /api/chapels/:id` - Deletar capela

### Clero (requer autenticação)
- `GET /api/clergy` - Listar todo clero
- `GET /api/clergy/:id` - Obter membro por ID
- `POST /api/clergy` - Criar novo membro
- `PUT /api/clergy/:id` - Atualizar membro
- `DELETE /api/clergy/:id` - Deletar membro

### Guias (requer autenticação)
- `GET /api/guides` - Listar todos os guias
- `GET /api/guides/:id` - Obter guia por ID
- `POST /api/guides` - Criar novo guia
- `PUT /api/guides/:id` - Atualizar guia
- `DELETE /api/guides/:id` - Deletar guia

### Inscrições
- `GET /api/inscriptions` - Listar todas (requer autenticação)
- `GET /api/inscriptions/event/:eventId` - Inscrições por evento (requer autenticação)
- `POST /api/inscriptions` - Criar inscrição (público)
- `PUT /api/inscriptions/:id` - Atualizar inscrição (requer autenticação)
- `DELETE /api/inscriptions/:id` - Deletar inscrição (requer autenticação)

## Autenticação

As requisições protegidas devem incluir o header:
```
Authorization: Bearer {token_jwt}
```

## Estrutura do Projeto

```
backend/
├── src/
│   ├── config/          # Configurações (BD, JWT)
│   ├── middleware/      # Middlewares (autenticação)
│   ├── models/          # Modelos Sequelize
│   ├── routes/          # Rotas da API
│   └── server.js        # Arquivo principal
├── .env                 # Variáveis de ambiente
├── package.json
└── README.md
```

## Tecnologias

- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **Sequelize** - ORM para Node.js
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **CORS** - Cross-Origin Resource Sharing

## Autor

Desenvolvido como backend profissional para Paróquia Santo André.
