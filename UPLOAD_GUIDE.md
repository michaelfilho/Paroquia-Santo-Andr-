# 📸 Guia Completo de Upload de Imagens

## ✅ Sistema de Upload Implementado

Você agora pode fazer upload de imagens de duas formas:

### **1. Upload Direto via Arquivo**
- Clique no botão "Clique para selecionar uma imagem"
- Selecione uma imagem do seu computador (JPEG, PNG, GIF ou WebP)
- Máximo 5MB por arquivo
- A imagem é automaticamente enviada ao servidor
- A URL é preenchida no campo de imagem

### **2. Inserir URL Diretamente**
- Cole uma URL de uma imagem já hospedada
- Exemplo: `https://exemplo.com/foto.jpg`
- A imagem é carregada automaticamente na pré-visualização

## 🎯 Onde Usar o Upload

### **Membros do Clero (Paróquia Tab)**
1. Vá para o painel administrativo
2. Clique em "Paróquia"
3. Clique em "Adicionar Membro" ou editar um existente
4. No formulário:
   - Preencha Nome, Função, Período
   - Role para baixo até "Ou faça upload de uma foto"
   - **Opção A:** Clique no botão de upload e selecione uma foto
   - **Opção B:** Cole a URL de uma foto externa
5. Clique em "Salvar Membro"

## 🔒 Segurança

- ✅ Apenas imagens são permitidas
- ✅ Máximo 5MB por arquivo
- ✅ Arquivos validados antes do upload
- ✅ Armazenadas em pasta segura do servidor
- ✅ Requer autenticação para upload

## 📱 Formatos Suportados

- **JPEG** (.jpg, .jpeg) - Ideal para fotos
- **PNG** (.png) - Com transparência
- **GIF** (.gif) - Animações simples
- **WebP** (.webp) - Formato moderno

## 🌐 Acessando Imagens

As imagens uploaded ficam acessíveis em:
```
http://localhost:3000/api/uploads/[nome-do-arquivo]
```

Exemplo:
```
http://localhost:3000/api/uploads/foto-1707040200000-123456789.jpg
```

## ⚠️ Dicas Importantes

1. **Compressão:** Comprima suas fotos antes de fazer upload para melhor desempenho
2. **Tamanho:** Use fotos com resolução mínima de 200x200px
3. **Formato:** JPEGs são geralmente menores que PNGs
4. **Backup:** Guarde cópias locais de suas fotos importantes

## 🛠️ Troubleshooting

### "Erro ao fazer upload"
- Verifique o tamanho do arquivo (máx. 5MB)
- Verifique o formato (JPEG, PNG, GIF, WebP)
- Verifique sua conexão com o servidor

### "Imagem não aparece"
- Aguarde o upload completar (observe o botão)
- Refresque a página
- Tente novamente

## 📝 Próximas Funcionalidades

Planejado:
- [ ] Upload de imagens para eventos
- [ ] Upload de imagens para capelas
- [ ] Galeria de imagens de eventos
- [ ] Editor de corte de imagens
- [ ] Compressão automática
