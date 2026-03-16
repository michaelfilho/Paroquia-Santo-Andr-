# Deploy no Coolify (VPS Hostinger)

Guia para subir frontend + backend + PostgreSQL usando Coolify em uma VPS Hostinger.

Dominio deste projeto:

- Frontend: https://paroquiataruma.com
- Backend API: https://admin.paroquiataruma.com/api

## 1) Estrategia recomendada

Use 3 servicos no Coolify:

1. PostgreSQL (servico gerenciado no Coolify)
2. Backend Node.js (diretorio base: backend)
3. Frontend estatico (diretorio base: raiz do projeto)

## 2) Banco PostgreSQL no Coolify

Crie um recurso PostgreSQL no Coolify.

Anote os dados:

- host interno
- porta
- database
- username
- password

## 3) Backend no Coolify

Crie um novo app no Coolify apontando para este repositorio.

Configuracao sugerida:

- Build Pack: Nixpacks (Node)
- Base Directory: backend
- Install Command: npm ci
- Build Command: npm run migrate
- Start Command: npm run ensure-admin && npm start
- Exposed Port: 5000

Variaveis de ambiente do backend:

- NODE_ENV=production
- PORT=5000
- DB_DIALECT=postgres
- DB_HOST=<host interno do postgres>
- DB_PORT=<porta do postgres>
- DB_NAME=<database>
- DB_USER=<username>
- DB_PASSWORD=<password>
- JWT_SECRET=<segredo forte>
- JWT_EXPIRE=7d
- FRONTEND_URL=https://paroquiataruma.com
- ADMIN_USERNAME=admin@cit.com
- ADMIN_PASSWORD=<senha inicial forte>
- ADMIN_ROLE=superadmin
- UPLOAD_DIR=/app/Styles/img

Storage persistente no backend:

- Monte volume persistente em /app/Styles/img

Isso garante persistencia das imagens enviadas.

## 4) Frontend no Coolify

Crie um app de Site Estatico (ou app Node com output estatico), no mesmo repositorio.

Configuracao sugerida:

- Base Directory: /
- Install Command: npm ci
- Build Command: npm run build
- Publish Directory: dist

Variavel de ambiente do frontend:

- VITE_API_BASE_URL=https://admin.paroquiataruma.com/api

## 5) Ordem de deploy

1. Suba PostgreSQL
2. Suba Backend
3. Suba Frontend

## 6) Primeiro acesso admin

A API de login usa o campo username.

Usuario inicial (via ensure-admin):

- username: valor de ADMIN_USERNAME
- senha: valor de ADMIN_PASSWORD

Exemplo:

- username: admin@cit.com

## 7) Checklist final

- GET /api/health responde 200
- Login admin funciona
- Upload de imagem funciona
- URL da imagem abre em /api/uploads/...
- Reinicio do app mantem imagens (volume persistente)

## 8) Problemas comuns

1. Admin nao encontrado:
   - confira ADMIN_USERNAME e ADMIN_PASSWORD
   - no deploy backend, Start Command deve incluir npm run ensure-admin

2. CORS bloqueando frontend:
   - confira FRONTEND_URL no backend
   - confira VITE_API_BASE_URL no frontend

3. Upload sumindo apos restart:
   - faltou volume persistente em /app/Styles/img
