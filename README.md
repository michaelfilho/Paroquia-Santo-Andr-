# 🏛️ Paróquia Santo André - Site Oficial

Site oficial da Paróquia Santo André em Tarumã - SP. Desenvolvido com React, TypeScript e Tailwind CSS.

## 📋 Funcionalidades

- ✨ **Página Inicial** - Hero section com informações da paróquia
- 📖 **Sobre Nós** - História e missão da paróquia
- 👥 **Clero** - Informações sobre padres e vigários
- 🗺️ **Mapa** - Localização das capelas em Tarumã
- 📅 **Eventos Passados** - Galeria de eventos realizados
- 🎯 **Eventos Futuros** - Programação de eventos e celebrações
- 📝 **Inscrições** - Sistema de inscrição para eventos
- 🔐 **Painel Admin** - Área administrativa para gerenciar conteúdo

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Iniciar servidor de desenvolvimento:**
```bash
npm run dev
```

3. **Acessar o site:**
Abra o navegador em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`.

## 🔐 Acesso Administrativo

- **Usuário:** `xxxx`
- **Senha:** `xxxx`

## 📁 Estrutura do Projeto

```
Paroquia Santo André/
├── componenst/          # Componentes React
│   ├── Header.tsx       # Cabeçalho e navegação
│   ├── Hero.tsx         # Seção principal
│   ├── About.tsx        # Sobre a paróquia
│   ├── Clergy.tsx       # Informações do clero
│   ├── Map.tsx          # Mapa das capelas
│   ├── PastEvents.tsx   # Eventos passados
│   ├── FutureEvents.tsx # Eventos futuros
│   ├── EventGallery.tsx # Galeria de fotos
│   ├── Inscrições.tsx   # Formulário de inscrições
│   ├── AdminLogin.tsx   # Login administrativo
│   ├── AdminDashboard.tsx # Painel administrativo
│   ├── Footer.tsx       # Rodapé
│   └── figma/
│       └── image.tsx    # Componente de imagem
├── Styles/
│   └── global.css       # Estilos globais
├── App.tsx              # Componente principal
├── main.tsx             # Entrada da aplicação
├── index.html           # HTML principal
└── package.json         # Dependências
```

## 🎨 Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Vite** - Build tool e dev server
- **Lucide React** - Biblioteca de ícones

## 🌐 Deploy no Hostinger

1. Execute o build:
```bash
npm run build
```

2. Faça upload dos arquivos da pasta `dist/` para o servidor via FTP ou painel do Hostinger

3. Configure o domínio para apontar para a pasta onde os arquivos foram enviados

## 📝 Personalização

### Alterar Informações da Paróquia

Edite os arquivos dos componentes em `componenst/` para atualizar:
- Textos e descrições
- Informações de contato
- Eventos e programações
- Dados do clero

### Alterar Cores e Estilos

O tema principal usa tons de âmbar/dourado. Para alterar:
1. Edite `tailwind.config.js` para mudar as cores
2. Ajuste `Styles/global.css` para estilos globais

## 🔧 Suporte

Para dúvidas ou suporte, entre em contato com o desenvolvedor.

## 📄 Licença

© 2026 Paróquia Santo André - Todos os direitos reservados.
