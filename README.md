# Paróquia Santo André — Site + API

Projeto completo do site oficial da Paróquia Santo André (Tarumã/SP), com:

- Frontend em React + TypeScript + Vite
- Backend em Node.js + Express + Sequelize
- Banco local com SQLite (desenvolvimento) e opção de PostgreSQL/MySQL em produção

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Express
- Sequelize

## Estrutura

```text
.
├─ App.tsx / main.tsx            # Frontend (Vite)
├─ componenst/                   # Componentes React
├─ src/services/api.ts           # Cliente HTTP do frontend
├─ Styles/                       # CSS global e imagens
└─ backend/
	├─ src/server.js              # API principal
	├─ src/models/                # Modelos Sequelize
	├─ src/routes/                # Rotas da API
	├─ scripts/                   # Scripts de setup/migração/admin
	└─ db/                        # SQLite local
```

## Pré-requisitos

- Node.js 20+
- npm 10+

## Setup local (frontend + backend)

### 1) Instalar dependências

Na raiz:

```bash
npm install
```

No backend:

```bash
cd backend
npm install
```

### 2) Configurar variáveis de ambiente

Backend (`backend/.env`) — exemplo local mínimo:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=troque_por_um_segredo_forte
JWT_EXPIRE=7d
```

Frontend (`.env.development`) — já compatível com backend local em `3000`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3) Rodar o backend

```bash
cd backend
npm run dev
```

### 4) Rodar o frontend

Em outro terminal, na raiz:

```bash
npm run dev
```

### 5) Acessar

- Frontend: `http://localhost:5173`
- Health da API: `http://localhost:3000/api/health`

## Banco de dados

- Desenvolvimento: SQLite automático em `backend/db/paroquia.db`
- Produção: configure `DB_DIALECT`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

Exemplo completo de produção: `backend/.env.example`

## Scripts úteis

### Frontend (raiz)

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run wifi
```

`npm run wifi` inicia backend + frontend para acesso na rede local (Wi-Fi) usando o script `start-wifi.ps1`.

### Backend (`backend/`)

```bash
npm run dev
npm start
npm run migrate
npm run migrate:undo
npm run seed
npm run setup-admin
```

## Admin

As credenciais de acesso não ficam fixas neste README.

Para criar/recriar administrador local, use:

```bash
cd backend
npm run setup-admin
```

## Deploy

Guias detalhados no repositório:

- `DEPLOY_VPS_POSTGRES.md`
- `COMANDOS_PRODUCAO_RAPIDO.md`
- `DEPENDENCIAS_PARA_RODAR.md`

## Observações

- Algumas rotas e uploads usam URL base em `localhost:3000` no ambiente local.
- Para produção, ajuste `VITE_API_BASE_URL` para o domínio público da API (ex.: `https://seu-dominio/api`).
