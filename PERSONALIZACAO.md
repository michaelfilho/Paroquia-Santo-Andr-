# 📝 Guia de Personalização - Paróquia Santo André

## 🎨 Como Personalizar o Site

### 1. Informações da Paróquia

#### **Header (Cabeçalho)**
Arquivo: `componenst/Header.tsx`
- **Nome da Paróquia:** Linha 84-85
- **Cidade:** Linha 86
- **Link Instagram:** Linha 108

```tsx
<h1>Paróquia Santo André</h1>
<p>Tarumã - SP</p>
```

#### **Hero (Seção Principal)**
Arquivo: `componenst/Hero.tsx`
- **Título Principal:** Linha 29-33
- **Subtítulo:** Linha 37-39
- **Imagem de Fundo:** Linha 5 (substitua a URL)

```tsx
const churchImage = 'URL_DA_SUA_IMAGEM_AQUI';
```

### 2. Sobre a Paróquia

Arquivo: `componenst/About.tsx`
- **Título:** Linha 18
- **História:** Linhas 32-52
- **Valores/Missão:** Linhas 63-95

### 3. Clero (Padres e Vigários)

Arquivo: `componenst/Clergy.tsx`

Para adicionar/editar padres, modifique o array `priests` (linha 17):

```tsx
{
  id: '1',
  name: 'Pe. João Carlos Silva',
  role: 'Pároco',
  period: '2020 - Presente',
  bio: 'Descrição do padre...',
  email: 'email@paroquia.com.br',
  phone: '(14) 3234-5678',
  imageUrl: 'URL_DA_FOTO',
  current: true,
}
```

### 4. Mapa das Capelas

Arquivo: `componenst/Map.tsx`

Edite o array `chapels` (linha 14):

```tsx
{
  id: '1',
  name: 'Igreja Matriz Santo André',
  neighborhood: 'Centro',
  coordinator: 'Nome do Coordenador',
  phone: '(14) 3234-5678',
  email: 'email@paroquia.com.br',
  position: { x: 50, y: 45 }, // Posição no mapa (%)
}
```

### 5. Eventos Passados

Arquivo: `componenst/PastEvents.tsx`

Adicione eventos no array `events` (linha 24):

```tsx
{
  id: '1',
  title: 'Nome do Evento',
  date: '30 de Novembro de 2025',
  location: 'Local',
  attendees: 1200,
  description: 'Descrição do evento...',
  hasPhotos: true,
}
```

### 6. Eventos Futuros

Arquivo: `componenst/FutureEvents.tsx`

Edite o array `events` (linha 16):

```tsx
{
  id: '1',
  title: 'Missa Dominical',
  date: '2 de Fevereiro de 2026',
  month: 'Fevereiro 2026',
  time: '19:00',
  location: 'Igreja Matriz',
  description: 'Descrição...',
  category: 'missa', // ou 'evento', 'retiro', 'festa'
}
```

### 7. Inscrições

Arquivo: `componenst/Inscrições.tsx`

Configure eventos com inscrições (linha 25):

```tsx
{
  id: '1',
  title: 'Nome do Evento',
  date: '28 de Fevereiro - 2 de Março',
  time: '18:00',
  location: 'Local',
  description: 'Descrição completa...',
  category: 'Retiro',
  availableSpots: 15,  // Vagas disponíveis
  totalSpots: 50,      // Total de vagas
  status: 'open',      // ou 'closed'
}
```

### 8. Rodapé (Footer)

Arquivo: `componenst/Footer.tsx`

- **Informações de Contato:** Linhas 42-67
- **Horário de Missas:** Linhas 71-98
- **Redes Sociais:** Linhas 102-115

```tsx
// Contato
<a href="tel:1432345678">(14) 3234-5678</a>
<a href="mailto:email@paroquia.com.br">email@paroquia.com.br</a>

// Endereço
<p>Rua Principal, 123</p>
<p>Centro, Tarumã - SP</p>
<p>CEP: 00000-000</p>
```

### 9. Login Administrativo

Arquivo: `componenst/AdminLogin.tsx`

**⚠️ IMPORTANTE: Alterar usuário e senha padrão!**

Linha 23-26:
```tsx
if (username === "padre" && password === "123") {
  onLogin();
}
```

**Para produção, implemente um sistema de autenticação real!**

### 10. Cores do Site

Arquivo: `tailwind.config.js`

O site usa tons de âmbar/dourado. Para mudar:

```javascript
theme: {
  extend: {
    colors: {
      // Adicione suas cores personalizadas
      'primary': '#92400e',  // Âmbar escuro
      'secondary': '#f59e0b', // Âmbar claro
    }
  }
}
```

## 🖼️ Adicionando Imagens Reais

### Imagens Recomendadas:

1. **Igreja (Hero):** 1920x1080px ou maior
2. **Fotos dos Padres:** 400x400px (quadradas)
3. **Eventos:** 800x600px ou maior
4. **Logo/Brasão:** 200x200px (transparente PNG)

### Onde colocar as imagens:

1. Crie uma pasta `public/images/`
2. Coloque suas imagens lá
3. Atualize os caminhos nos componentes:

```tsx
// Antes
const churchImage = 'URL_UNSPLASH';

// Depois
const churchImage = '/images/igreja.jpg';
```

## 📧 Configurando Formulário de Inscrição

O formulário atualmente não envia emails. Para implementar:

1. **Backend com Node.js:** Use nodemailer
2. **Serviço Third-party:** EmailJS, SendGrid, etc.
3. **Firebase:** Configure Firestore + Cloud Functions

Exemplo básico no arquivo `Inscrições.tsx`, linha 95:

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // TODO: Implementar envio real
  // Exemplo com fetch:
  // const response = await fetch('/api/inscricao', {
  //   method: 'POST',
  //   body: JSON.stringify(formData)
  // });
  
  setShowSuccess(true);
};
```

## 🚀 Deploy (Publicação)

### Preparar para Deploy:

1. **Build do projeto:**
```bash
npm run build
```

2. **Testar localmente:**
```bash
npm run preview
```

### Hostinger:

1. Faça upload da pasta `dist/` via FTP
2. Configure o domínio para apontar para essa pasta
3. Adicione arquivo `.htaccess` se necessário:

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

## 🔧 Problemas Comuns

### Imagens não carregam:
- Verifique se o caminho está correto
- Use caminhos absolutos começando com `/`
- Coloque imagens na pasta `public/`

### Estilos não aparecem:
- Execute `npm install` novamente
- Limpe o cache: `npm run dev -- --force`
- Verifique se o Tailwind CSS está configurado

### Navegação não funciona:
- Verifique os IDs das seções (`id="sobre"`, etc.)
- Confirme que os nomes correspondem nos botões

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador (F12)
2. Leia a documentação do React/Vite
3. Entre em contato com o desenvolvedor

---

**Última atualização:** Fevereiro de 2026
