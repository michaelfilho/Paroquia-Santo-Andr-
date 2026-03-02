# Dependências para rodar o projeto

Este guia traz **todos os comandos** para instalar dependências do projeto.

## 1) Pré-requisitos

- Node.js 20+
- npm 10+

Verificar:
```bash
node -v
npm -v
```

---

## 2) Instalação rápida (recomendada)

### Frontend (raiz do projeto)
```bash
npm install
```

### Backend
```bash
cd backend
npm install
```

---

## 3) Instalação explícita de todas as dependências (pacote por pacote)

Use apenas se quiser instalar manualmente sem depender do `package.json`.

### Frontend - dependencies
```bash
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip class-variance-authority clsx cmdk input-otp lucide-react next-themes react react-dom react-hook-form react-resizable-panels recharts sonner tailwind-merge vaul
```

### Frontend - devDependencies
```bash
npm install -D @types/react @types/react-dom @typescript-eslint/eslint-plugin @typescript-eslint/parser @vitejs/plugin-react autoprefixer eslint eslint-plugin-react-hooks eslint-plugin-react-refresh postcss tailwindcss typescript vite
```

### Backend - dependencies
```bash
cd backend
npm install bcryptjs cors dotenv express express-validator jsonwebtoken multer mysql2 pg pg-hstore sequelize sqlite3 uuid
```

### Backend - devDependencies
```bash
cd backend
npm install -D eslint nodemon sequelize-cli
```

---

## 4) Dependências de banco (escolha uma opção)

### Opção A: PostgreSQL (produção recomendada)
Instalar servidor PostgreSQL no sistema (Ubuntu):
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
```

No `.env` do backend:
```env
DB_DIALECT=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=paroquia_santo_andre
DB_USER=paroquia_user
DB_PASSWORD=sua_senha
```

### Opção B: SQLite (simples/local)
Não precisa instalar servidor de banco. O backend já usa arquivo local (`backend/db/paroquia.db`).

---

## 5) Comandos para rodar

### Frontend
```bash
npm run dev
```

### Backend
```bash
cd backend
npm run dev
```

---

## 6) Comandos úteis (backend)

```bash
cd backend
npm run migrate
npm run seed
npm run setup-admin
```
