# 📋 Guia de Uso - Nova Lógica de Eventos e Programações

## ✨ O Que Mudou

A partir de agora, o sistema de gerenciamento de eventos e programações funciona de acordo com a seguinte lógica:

### 1. **Status de Publicação (Público vs. Privado)**

#### Programações/Eventos Novos
- Quando você adiciona um novo evento no painel administrativo, ele é criado com:
  - ✅ `published: false` (não publicado)
  - ✅ `isActive: true` (ativo)
  
- Isso significa que o evento **NOT será visível** na tela inicial, mesmo que seja uma data futura.

#### Publicar um Evento
- Clique no botão **👁️ Olho (Eye)** para **PUBLICAR** o evento
- Uma vez publicado (`published: true`):
  - ✅ Aparecerá na tela inicial **apenas se for uma data futura**
  - ✅ Será visível ao público
  - ✅ Aceita inscrições (se configurado)

#### Despublicar um Evento
- Clique novamente no botão **👁️ Olho (Eye)** para **DESPUBLICAR**
- O evento desaparece da tela inicial, mesmo sendo uma data futura
- Continua no banco de dados, mas não é visível publicamente

### 2. **Arquivo Automático de Eventos Passados**

#### Fluxo Automático
1. **Evento criado**: `isActive: true, published: false`
2. **Admin publica**: Clica no 👁️ → `published: true` → Aparece na tela inicial
3. **Data passa**: O sistema automaticamente marca como `isActive: false`
4. **Resultado**: O evento sai da tela inicial e vai para a seção de "Eventos Realizados"

#### Como Funciona
- A cada **10 minutos**, o servidor verifica se há eventos com datas passadas
- Se um evento passou a data e ainda está `isActive: true`, o sistema automaticamente muda para `isActive: false`
- O evento continua existindo no banco de dados para fins de histórico

### 3. **Visualização de Status no Painel Admin**

No painel administrativo, você verá badges de status para cada evento:

| Badge | Significado |
|-------|-------------|
| 🟢 **Publicado** | Visível ao público (data futura) |
| 📁 **Arquivado** | Data passou, saiu da tela inicial |
| *(sem badge)* | Não publicado (data futura, não visível) |

### 4. **Seções de Eventos**

#### Aba "Eventos"
- Mostra eventos do tipo **missa**
- Permite gerenciar qual será mostrado na tela inicial

#### Aba "Programações"
- Mostra eventos do tipo **missa** (programações regulares)
- Mesmo sistema de publicação/arquivo

#### Aba "Eventos Realizados" (Frontend)
- Mostra **todos os eventos** com data passada (`isActive: false`)
- Não importa se foram publicados ou não
- Pode recontextualizar clicar em um evento para ver mais detalhes

## 🎯 Fluxo de Trabalho Recomendado

### Para uma Programação Regular

```
1. Acesso o painel admin → "Programações"
2. Clico "Nova Programação"
3. Preencho: Título, Data, Local, Descrição
4. Clico "Salvar Evento"
   └─ Sistema cria com published=false
5. Evento fica DESATIVADO na lista até eu publicar
6. Quando quero deixar visível, clico 👁️ (Publicar)
   └─ Aparece na tela inicial imediatamente
7. Na data marcada, o sistema automaticamente arquiva
   └─ Sai da tela inicial, vai para "Eventos Realizados"
```

### Para um Evento Que Não Quer Mais Mostrar

```
1. Acesso o painel admin
2. Localizo o evento
3. Clico 👁️ para DESPUBLICAR
4. Evento desaparece da tela inicial imediatamente
5. Continua no banco de dados para histórico
```

### Para um Evento Que Passou e Quer Republicar

```
1. No painel admin, você vê o evento marcado como "📁 Arquivado"
2. Clique 👁️ para publicar novamente
3. O evento reaparece na seção de "Eventos Realizados" com status de publicado
```

## 📊 Tabela de Estados

| Estado | published | isActive | Visível Tela Inicial? | Visível Eventos Passados? | Ações Admin |
|--------|-----------|----------|----------------------|--------------------------|------------|
| Novo (não publicado) | false | true | ❌ NÃO | ❌ NÃO | Publicar/Editar/Deletar |
| Publicado (futuro) | true | true | ✅ SIM | ❌ NÃO | Despublicar/Editar/Deletar |
| Arquivado | true | false | ❌ NÃO | ✅ SIM | Republicar/Editar/Deletar |
| Despublicado (futuro) | false | true | ❌ NÃO | ❌ NÃO | Publicar/Editar/Deletar |

## 🔧 Endpoints da API

### Publick (Visitantes)
- `GET /api/public/events` → Retorna apenas eventos com `published: true` e `isActive: true` com data futura

### Admin (Autenticados)
- `GET /api/events` → Todos os eventos
- `POST /api/events` → Criar novo evento
- `PUT /api/events/{id}` → Editar evento
- `DELETE /api/events/{id}` → Deletar evento
- `PATCH /api/events/{id}/publish` → Publicar (publicado=true)
- `PATCH /api/events/{id}/unpublish` → Despublicar (publicado=false)
- `PATCH /api/events/{id}/archive` → Arquivar (isActive=false)

## ⚙️ Configuração

### Auto-Archive Interval
- **Frequência**: A cada 10 minutos
- **Localização do código**: `backend/src/server.js`
- **Para alterar**: Mude o valor em milissegundos na linha do setInterval

### Campo no Banco de Dados
- **Coluna**: `isActive`
- **Tipo**: BOOLEAN
- **Padrão**: true
- **Adicionado em**: Atualização recente do schema

## 📝 Notas Importantes

1. **Sincronização**: O sistema assume que a data do servidor é confiável
2. **Timezone**: Verifique se o servidor está com o timezone correto
3. **Backup**: Eventos arquivados não são deletados, apenas marcados como inativos
4. **Performance**: A verificação de auto-archive ocorre a cada 10 minutos sem bloquear requisições

## 🆘 Troubleshooting

### Evento não aparece na tela inicial depois de publicado
- ✅ Verifique se o evento está com `published: true`
- ✅ Verifique se a data é futura
- ✅ Verifique se `isActive: true`

### Evento não sumiu da tela inicial depois da data passou
- ✅ A verificação de auto-archive ocorre a cada 10 minutos
- ✅ Tente aguardar ou recarregar a página
- ✅ Você pode forçar o arquivo clicando no evento e editando

### Programação criada desaparece antes da data
- ✅ Verifique se a data está no formato correto (YYYY-MM-DD)
- ✅ Confirme se você publicou (clicou no 👁️)

---

**Versão**: 2.0  
**Última Atualização**: Fevereiro 2026
