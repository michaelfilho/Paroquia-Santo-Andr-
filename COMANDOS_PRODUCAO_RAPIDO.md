# Comandos rápidos (produção VPS)

## 1) Pacotes do sistema (Ubuntu)
```bash
sudo apt update
sudo apt install -y nginx postgresql postgresql-contrib
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## 2) Banco PostgreSQL
```bash
sudo -u postgres psql
```
```sql
CREATE DATABASE paroquia_santo_andre;
CREATE USER paroquia_user WITH ENCRYPTED PASSWORD 'SENHA_FORTE_AQUI';
GRANT ALL PRIVILEGES ON DATABASE paroquia_santo_andre TO paroquia_user;
\q
```

## 3) Dependências do projeto
```bash
# na raiz do projeto
npm install
cd backend
npm install
```

## 4) .env do backend (produção)
Crie `backend/.env`:
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://SEU_DOMINIO
DB_DIALECT=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=paroquia_santo_andre
DB_USER=paroquia_user
DB_PASSWORD=SENHA_FORTE_AQUI
JWT_SECRET=COLOQUE_UM_SEGREDO_GRANDE_E_UNICO
JWT_EXPIRE=7d
```

## 5) Migração + seed
```bash
cd backend
npm run migrate
npm run seed
```

## 6) Build frontend
```bash
# raiz do projeto
npm run build
```

## 7) Subir backend
```bash
cd backend
npm start
```

## 8) Persistência de uploads
```bash
# na raiz do projeto
mkdir -p Styles/img/eventos
chmod -R 775 Styles/img
```

## 9) Nginx (SPA + API)
Arquivo `/etc/nginx/sites-available/paroquia`:
```nginx
server {
    listen 80;
    server_name SEU_DOMINIO;

    root /var/www/paroquia/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Ativar:
```bash
sudo ln -s /etc/nginx/sites-available/paroquia /etc/nginx/sites-enabled/paroquia
sudo nginx -t
sudo systemctl restart nginx
```
