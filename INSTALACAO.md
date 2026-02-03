# 🚀 INSTALAÇÃO E EXECUÇÃO

## Passo a Passo para Iniciar o Projeto

### 1️⃣ Instalar Node.js

Se ainda não tem o Node.js instalado:
1. Acesse https://nodejs.org/
2. Baixe a versão LTS (recomendada)
3. Instale seguindo as instruções
4. Verifique a instalação abrindo o PowerShell e digitando:
```powershell
node --version
npm --version
```

### 2️⃣ Instalar Dependências

Abra o PowerShell nesta pasta e execute:

```powershell
npm install
```

⏱️ **Aguarde:** Este processo pode levar alguns minutos.

### 3️⃣ Iniciar o Servidor de Desenvolvimento

Após a instalação das dependências:

```powershell
npm run dev
```

✅ **Pronto!** O site estará disponível em: `http://localhost:5173`

### 4️⃣ Acessar o Site

Abra seu navegador e acesse:
```
http://localhost:5173
```

---

## 🔧 Comandos Disponíveis

### Desenvolvimento
```powershell
npm run dev
```
Inicia o servidor de desenvolvimento com hot-reload

### Build (Compilação para Produção)
```powershell
npm run build
```
Cria a versão otimizada na pasta `dist/`

### Pré-visualização da Build
```powershell
npm run preview
```
Testa a versão compilada localmente

---

## ❓ Problemas Comuns

### Erro: "npm não é reconhecido"
**Solução:** Node.js não está instalado ou não está no PATH
- Reinstale o Node.js
- Reinicie o computador
- Abra um novo terminal PowerShell

### Erro durante npm install
**Solução 1:** Limpe o cache
```powershell
npm cache clean --force
npm install
```

**Solução 2:** Delete a pasta `node_modules` e tente novamente
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### Porta 5173 já está em uso
**Solução:** O Vite escolherá automaticamente outra porta (5174, 5175, etc.)
Ou você pode especificar uma porta:
```powershell
npm run dev -- --port 3000
```

### Página em branco no navegador
**Solução:**
1. Verifique o console do navegador (F12)
2. Certifique-se de que não há erros de compilação no terminal
3. Limpe o cache do navegador (Ctrl+Shift+R)

---

## 📦 O que foi instalado?

As principais dependências:
- **React** - Biblioteca para construção da interface
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Vite** - Build tool rápido
- **Lucide React** - Ícones

Todas as dependências estão listadas no arquivo `package.json`

---

## 🌐 Próximos Passos

Depois que o projeto estiver funcionando:

1. ✅ Teste todas as páginas e funcionalidades
2. 📝 Personalize os textos e informações (veja `PERSONALIZACAO.md`)
3. 🖼️ Adicione as imagens reais da paróquia
4. 🎨 Ajuste as cores se necessário
5. 🚀 Faça o deploy no Hostinger (veja instruções no `README.md`)

---

## 💡 Dica

Mantenha o terminal aberto enquanto desenvolve. Ele mostrará:
- ✅ Compilação bem-sucedida
- ❌ Erros de código
- 🔄 Atualizações automáticas

**Pressione `Ctrl + C` para parar o servidor de desenvolvimento.**

---

## 📞 Precisa de Ajuda?

Se tiver problemas:
1. Verifique se seguiu todos os passos
2. Leia as mensagens de erro no terminal
3. Pesquise o erro no Google
4. Entre em contato com o desenvolvedor

**Boa sorte! 🎉**
