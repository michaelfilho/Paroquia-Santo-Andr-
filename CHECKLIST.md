# ✅ CHECKLIST - PASSO A PASSO COMPLETO

## 📋 Lista de Verificação para Colocar o Site no Ar

### FASE 1: INSTALAÇÃO E TESTE LOCAL

#### ✅ 1. Instalar Node.js
- [ ] Baixar Node.js de https://nodejs.org/
- [ ] Instalar versão LTS (recomendada)
- [ ] Abrir PowerShell e verificar: `node --version`
- [ ] Verificar npm: `npm --version`

#### ✅ 2. Instalar Dependências
```powershell
# No diretório do projeto
npm install
```
- [ ] Aguardar instalação completa (2-5 minutos)
- [ ] Verificar se não houve erros

#### ✅ 3. Testar Localmente
```powershell
npm run dev
```
- [ ] Abrir navegador em http://localhost:5173
- [ ] Testar navegação entre páginas
- [ ] Verificar se todas as seções funcionam
- [ ] Testar no mobile (pressione F12 > ícone de celular)

---

### FASE 2: PERSONALIZAÇÃO

#### ✅ 4. Atualizar Informações Básicas

**Header (componenst/Header.tsx):**
- [ ] Nome da paróquia (linha 79)
- [ ] Cidade (linha 80)
- [ ] Link do Instagram (linha 96)

**Hero (componenst/Hero.tsx):**
- [ ] Título principal (linhas 29-35)
- [ ] Subtítulo (linhas 38-41)
- [ ] Substituir imagem de fundo (linha 5)

**Footer (componenst/Footer.tsx):**
- [ ] Telefone (linha 42)
- [ ] Email (linha 51)
- [ ] Endereço completo (linhas 58-60)
- [ ] Horários de missa (linhas 75-96)
- [ ] Links de redes sociais (linhas 102-115)

#### ✅ 5. Atualizar Conteúdo

**Sobre Nós (componenst/About.tsx):**
- [ ] História da paróquia (linhas 32-52)
- [ ] Valores e missão (linhas 54-96)

**Clero (componenst/Clergy.tsx):**
- [ ] Informações dos padres (linha 17+)
- [ ] Fotos dos padres (URLs das imagens)
- [ ] Emails e telefones

**Mapa (componenst/Map.tsx):**
- [ ] Nomes das capelas (linha 14+)
- [ ] Endereços
- [ ] Coordenadores
- [ ] Contatos

**Eventos (componenst/PastEvents.tsx e FutureEvents.tsx):**
- [ ] Adicionar eventos reais
- [ ] Atualizar datas
- [ ] Descrições corretas

#### ✅ 6. Configurar Inscrições

**Inscrições (componenst/Inscrições.tsx):**
- [ ] Adicionar eventos com inscrição aberta
- [ ] Configurar número de vagas
- [ ] Ajustar categorias

⚠️ **IMPORTANTE:** O formulário não envia emails ainda!
- [ ] Implementar backend ou serviço de email
- [ ] Ou configurar integração com Google Forms/EmailJS

#### ✅ 7. Segurança Admin

**Login Admin (componenst/adminLogin.tsx):**
- [ ] ⚠️ **URGENTE:** Alterar senha padrão (linha 23)
- [ ] Implementar sistema real de autenticação (futuro)

---

### FASE 3: IMAGENS E ASSETS

#### ✅ 8. Adicionar Imagens Reais

Criar pasta: `public/images/`

**Imagens necessárias:**
- [ ] Igreja/Fachada (1920x1080px ou maior)
- [ ] Foto Pe. [Nome] (400x400px)
- [ ] Foto Pe. [Nome] (400x400px)
- [ ] Logo/Brasão da paróquia (200x200px PNG transparente)
- [ ] Fotos de eventos (800x600px)

**Atualizar URLs nos arquivos:**
- [ ] Hero.tsx (linha 5)
- [ ] Clergy.tsx (imageUrl nos padres)
- [ ] PastEvents.tsx (se tiver fotos locais)

---

### FASE 4: TESTES FINAIS

#### ✅ 9. Testar Todas as Funcionalidades

**Navegação:**
- [ ] Menu desktop funciona
- [ ] Menu mobile funciona
- [ ] Scroll suave entre seções
- [ ] Logo volta para o topo

**Páginas:**
- [ ] Página Inicial carrega corretamente
- [ ] Seção Sobre funciona
- [ ] Clero exibe informações
- [ ] Mapa mostra capelas
- [ ] Eventos Passados abre galeria de fotos
- [ ] Eventos Futuros exibe programação
- [ ] Página de Inscrições funciona
- [ ] Formulário de inscrição valida campos

**Admin:**
- [ ] Login funciona (padre/123)
- [ ] Dashboard carrega
- [ ] Tabs do admin funcionam
- [ ] Logout funciona

**Responsividade:**
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1920px)

---

### FASE 5: BUILD E DEPLOY

#### ✅ 10. Criar Build de Produção

```powershell
npm run build
```

- [ ] Build completa sem erros
- [ ] Pasta `dist/` foi criada
- [ ] Testar build localmente: `npm run preview`

#### ✅ 11. Deploy no Hostinger

**Preparar arquivos:**
- [ ] Fazer backup da pasta `dist/`
- [ ] Compactar se necessário

**No Hostinger:**
- [ ] Acessar painel de controle
- [ ] Ir para File Manager
- [ ] Navegar até public_html (ou pasta do domínio)
- [ ] Fazer upload de todos os arquivos de `dist/`
- [ ] Ou usar FTP (FileZilla)

**FTP (alternativa):**
- [ ] Instalar FileZilla
- [ ] Conectar com credenciais do Hostinger
- [ ] Upload da pasta dist/ para public_html/
- [ ] Mover conteúdo de dist/ para raiz

#### ✅ 12. Configurar Domínio

**DNS:**
- [ ] Configurar domínio para apontar para o servidor
- [ ] Aguardar propagação (até 48h)
- [ ] Testar acesso pelo domínio

**SSL (HTTPS):**
- [ ] Ativar SSL gratuito no painel Hostinger
- [ ] Forçar HTTPS
- [ ] Testar certificado

#### ✅ 13. Criar .htaccess (para Single Page App)

Na pasta public_html, criar arquivo `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

- [ ] Criar arquivo .htaccess
- [ ] Upload para servidor
- [ ] Testar navegação direta

---

### FASE 6: PÓS-LANÇAMENTO

#### ✅ 14. Testes em Produção

**Funcionalidade:**
- [ ] Site abre corretamente
- [ ] Todas as páginas funcionam
- [ ] Imagens carregam
- [ ] Formulários funcionam
- [ ] Admin funciona

**Performance:**
- [ ] Teste no Google PageSpeed Insights
- [ ] Otimizar se necessário

**SEO:**
- [ ] Título da página correto
- [ ] Meta descrição configurada
- [ ] Favicon carrega

#### ✅ 15. Divulgação

- [ ] Postar no Instagram da paróquia
- [ ] Avisar na missa
- [ ] Enviar para grupos de WhatsApp
- [ ] Adicionar no Google Meu Negócio

#### ✅ 16. Manutenção

**Criar rotina de atualização:**
- [ ] Atualizar eventos mensalmente
- [ ] Adicionar fotos de eventos realizados
- [ ] Verificar funcionamento semanal
- [ ] Backup mensal

---

## 🎯 PRIORIDADES

### 🔴 URGENTE (Antes do Deploy)
1. Alterar senha do admin
2. Atualizar informações de contato
3. Adicionar fotos reais
4. Testar todas as páginas

### 🟡 IMPORTANTE (Primeira Semana)
1. Configurar envio de emails (inscrições)
2. Adicionar eventos reais
3. Atualizar sobre a paróquia
4. Testar em diferentes dispositivos

### 🟢 DESEJÁVEL (Primeiro Mês)
1. Implementar analytics
2. Adicionar mais fotos
3. Criar conteúdo para blog (futuro)
4. Integração com redes sociais

---

## 📞 CONTATOS DE SUPORTE

### Hostinger
- Site: hostinger.com.br
- Suporte: 24/7 via chat

### Desenvolvedor
- [Adicionar contato se necessário]

---

## 🎉 PARABÉNS!

Quando completar todos os itens, seu site estará no ar! 🚀

**Última atualização:** 3 de Fevereiro de 2026
