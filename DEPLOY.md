# 🚀 Guia de Deploy - Paróquia Santo André

Este documento fornece um passo a passo completo para colocar o site da Paróquia Santo André no ar usando a hospedagem **Hostinger**.

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Build do Frontend](#build-do-frontend)
3. [Preparação de Arquivos](#preparação-de-arquivos)
4. [Deploy na Hostinger](#deploy-na-hostinger)
5. [Configuração do Backend](#configuração-do-backend)
6. [Conectar Frontend com Backend](#conectar-frontend-com-backend)
7. [Verificação Final](#verificação-final)

---

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter:

- ✅ Hospedagem contratada na **Hostinger** (recomendado plano **Premium ou Business** para suportar Node.js)
- ✅ Acesso ao **cPanel** e **FTP** da hospedagem
- ✅ Projeto local funcionando corretamente
- ✅ Git ou acesso aos arquivos via FTP

---

## 🏗️ Build do Frontend

### Passo 1: Construir o projeto para produção

```bash
cd "D:\2025\Paroquia Santo André"
npm run build
```

**O que acontece:**
- TypeScript é compilado
- React é otimizado
- CSS é minificado
- Arquivos são gerados na pasta `dist/`

**Saída esperada:**
```
✓ 1486 modules transformed.
dist/index.html                   0.61 kB │ gzip:  0.39 kB
dist/assets/index-Q6IX2Nmt.css  106.06 kB │ gzip: 17.35 kB
dist/assets/index-5_Q9dbJq.js   287.73 kB │ gzip: 75.02 kB
✓ built in 35.19s
```

---

## 📦 Preparação de Arquivos

### Passo 2: Arquivos necessários

Após o build, você terá os seguintes arquivos prontos:

```
dist/
├── index.html              ← Arquivo principal
├── .htaccess              ← Configuração de roteamento
└── assets/
    ├── index-Q6IX2Nmt.css ← Estilos
    └── index-5_Q9dbJq.js  ← JavaScript
```

**O arquivo `.htaccess` já foi criado** e contém as regras de roteamento para o React funcionar corretamente em um servidor Apache.

---

## 🌐 Deploy na Hostinger

### Passo 3: Acessar o cPanel

1. Acesse: `https://seudominio.com:2083` (ou como fornecido pela Hostinger)
2. Faça login com suas credenciais

### Passo 4: Usar o gerenciador de arquivos ou FTP

#### **Opção A: Gerenciador de Arquivos (Recomendado)**

1. No cPanel, procure por **"File Manager"** (Gerenciador de Arquivos)
2. Abra a pasta `public_html`
3. Faça upload de **todos os arquivos da pasta `dist/`** incluindo:
   - `index.html`
   - `.htaccess`
   - Pasta `assets/` completa

#### **Opção B: FTP (FileZilla)**

1. Abra **FileZilla** ou outro cliente FTP
2. Conecte com as credenciais fornecidas pela Hostinger
3. Navegue até `public_html`
4. Faça upload dos arquivos da pasta `dist/`

**Estrutura final esperada:**
```
public_html/
├── index.html
├── .htaccess
└── assets/
    ├── index-Q6IX2Nmt.css
    └── index-5_Q9dbJq.js
```

---

## ⚙️ Configuração do Backend

### Passo 5: Upload do Backend

1. No cPanel, crie uma pasta chamada `backend` na raiz da hospedagem
2. Faça upload de toda a pasta `backend/` do projeto local
3. A estrutura deverá ser:

```
backend/
├── src/
│   ├── server.js
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── ...
├── db/
├── scripts/
├── package.json
└── ...
```

### Passo 6: Instalar dependências

1. No cPanel, procure por **"Terminal"** (pode ser chamado de SSH ou Shell)
2. Navegue até a pasta backend:
   ```bash
   cd ~/backend
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. (Opcional) Execute o script de reset de capelas:
   ```bash
   node scripts/reset-chapels.js
   ```

### Passo 7: Iniciar o servidor Node.js

Na Hostinger, você pode:

**Opção A: Usar o gerenciador de aplicações Node.js**
1. No cPanel, procure por **"Node.js"** ou **"Application Manager"**
2. Crie uma nova aplicação apontando para:
   - **Arquivo principal:** `src/server.js`
   - **Porta:** `3000` (ou escolha outra disponível)
   - **Domínio:** um subdomínio como `api.seudominio.com`

**Opção B: Via Terminal (SSH)**
1. Conecte via SSH:
   ```bash
   ssh usuario@seudominio.com
   ```

2. Inicie o servidor:
   ```bash
   cd ~/backend
   npm start
   ```

3. Para manter rodando em background, use PM2:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name "paroquia-api"
   pm2 startup
   pm2 save
   ```

---

## 🔗 Conectar Frontend com Backend

### Passo 8: Atualizar URL da API

Agora que tanto frontend quanto backend estão online, precisamos conectá-los.

1. Abra o arquivo `src/services/api.ts` no seu projeto local

2. Localize esta linha:
```typescript
const API_BASE = 'http://localhost:3000/api';
```

3. Substitua pela URL do seu backend na Hostinger:
```typescript
const API_BASE = 'https://api.seudominio.com/api';
// ou se for na mesma hospedagem:
const API_BASE = 'https://seudominio.com/api';
```

4. Faça o build novamente:
```bash
npm run build
```

5. Faça upload dos novos arquivos da pasta `dist/` para `public_html/`

---

## ✅ Verificação Final

### Passo 9: Testar o site

1. Abra seu navegador e acesse: `https://seudominio.com`

2. Verifique se:
   - ✅ A página carrega corretamente
   - ✅ Os estilos (CSS) aparecem
   - ✅ As imagens carregam
   - ✅ O mapa do Google Maps funciona
   - ✅ As capelas aparecem na seção "Nossas Capelas"

3. Teste a seção de inscrições:
   - Clique em "Inscrições"
   - Preencha o formulário
   - Verifique se a inscrição é salva no banco de dados

4. Verifique o painel administrativo:
   - Acesse: `https://seudominio.com/admin` (ou a rota configurada)
   - Faça login com:
     - **Usuário:** `admin`
     - **Senha:** `admin@123`

### Passo 10: Troubleshooting

**Problema: Página em branco ou erro 404**
- Verifique se o `.htaccess` foi enviado corretamente
- Certifique-se de que o mod_rewrite está ativado no servidor

**Problema: API não conecta**
- Verifique a URL do backend em `api.ts`
- Certifique-se de que o backend está rodando
- Verifique CORS no backend (`src/server.js`)

**Problema: Banco de dados vazio**
- Execute o script reset:
  ```bash
  cd ~/backend
  node scripts/reset-chapels.js
  ```

---

## 📝 Variáveis de Ambiente (Opcional)

Para maior segurança, você pode usar variáveis de ambiente:

1. Crie um arquivo `.env` na raiz do backend:
```env
NODE_ENV=production
PORT=3000
DB_PATH=./db/paroquia.db
```

2. Atualize `src/server.js` para usar essas variáveis:
```javascript
const PORT = process.env.PORT || 3000;
```

---

## 🔐 Dicas de Segurança

1. **Altere a senha do admin**
   - Acesse o painel administrativo
   - Mude a senha padrão imediatamente

2. **Use HTTPS**
   - Hostinger fornece certificado SSL gratuito
   - Ative sempre que possível

3. **Configure firewall**
   - Restrinja acesso ao painel admin se possível
   - Use senhas fortes

4. **Backups regulares**
   - Configure backups automáticos
   - Exporte o banco de dados regularmente

---

## 📞 Suporte Hostinger

Se encontrar problemas durante o deploy:

1. Acesse o painel de suporte: `https://hostinger.com/support`
2. Contate o suporte técnico
3. Forneça os detalhes do erro

---

## ✨ Conclusão

Parabéns! Seu site está no ar! 🎉

**Resumo do que foi feito:**
- ✅ Frontend otimizado e enviado para hospedagem
- ✅ Backend Node.js configurado e rodando
- ✅ Banco de dados SQLite funcional
- ✅ API conectada ao frontend
- ✅ Capelas cadastradas
- ✅ Mapa de Tarumã integrado
- ✅ Painel administrativo acessível

**Para manutenção futura:**
- Todas as mudanças no código devem ser feitas localmente
- Execute `npm run build` após alterações
- Faça upload dos arquivos `dist/` atualizados

Bom site! 🙏
