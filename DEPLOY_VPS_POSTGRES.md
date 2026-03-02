# Deploy VPS (Node + Nginx + PostgreSQL + Upload Persistente)

## 1) Pré-requisitos na VPS (Ubuntu)
```bash
sudo apt update
sudo apt install -y nginx postgresql postgresql-contrib
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## 2) Banco PostgreSQL
```bash
sudo -u postgres psql
```
No `psql`:
```sql
CREATE DATABASE paroquia_santo_andre;
CREATE USER paroquia_user WITH ENCRYPTED PASSWORD 'SENHA_FORTE_AQUI';
GRANT ALL PRIVILEGES ON DATABASE paroquia_santo_andre TO paroquia_user;
\q
```

## 3) Backend: configuração de ambiente
No diretório `backend`, crie/edite `.env`:
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

## 4) Instalar dependências e iniciar backend
```bash
cd backend
npm install
npm run migrate
npm run seed
npm start
```

## 5) Upload de imagem persistente (obrigatório)
As imagens ficam em disco (`Styles/img`). Em VPS, a pasta deve persistir entre reinícios/deploys.

Crie e dê permissão:
```bash
cd ..
mkdir -p Styles/img/eventos
chmod -R 775 Styles/img
```

Se usar Docker, monte volume para essa pasta (exemplo):
```yaml
volumes:
  - /var/www/paroquia/uploads:/app/Styles/img
```

## 6) Nginx (reverse proxy)
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

## 7) Frontend em produção
No frontend, build com API pública correta:
```bash
# na raiz do projeto
# ajuste VITE_API_BASE_URL para https://SEU_DOMINIO/api
npm install
npm run build
```
Copie a pasta `dist` para o `root` do Nginx (`/var/www/paroquia/dist`).

## 8) Checklist final
- Login admin funciona
- Upload de imagem funciona
- URL da imagem abre em `/api/uploads/...`
- Reiniciou serviço e imagens continuam (persistência OK)
- CRUD de conteúdo e timeline funcionando

## 9) Observação importante
Trocar MySQL/SQLite para PostgreSQL **não quebra upload**. Upload depende de:
1. Escrita em disco no servidor
2. Pasta persistente
3. Rota estática `/api/uploads` exposta
4. `imageUrl` salva no banco
