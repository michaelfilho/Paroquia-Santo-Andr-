# 📋 FLUXO COMPLETO DE INSCRIÇÕES - PARÓQUIA SANTO ANDRÉ

## 🎯 VISÃO GERAL
Sistema de eventos com inscrição totalmente funcional, com isolamento entre:
- **Programações**: Agenda informativa (sem inscrições)
- **Inscrições de Eventos**: Eventos com vagas e inscrições
- **Inscrições**: Gestão de pessoas inscritas

---

## 📍 ETAPA 1: CRIAR EVENTO COM INSCRIÇÃO

### Local
Painel Administrativo → **Aba "Inscrições de Eventos"**

### Ação
1. Clica em **"Novo Evento com Inscrição"** (botão laranja)
2. Preenche o formulário:
   ```
   ✓ Título do evento
   ✓ Data de início (Começa em)
   ✓ Data de término (Termina em)
   ✓ Horário (formato: HH:MM às HH:MM)
   ✓ Local
   ✓ Descrição
   ✓ Quantidade máxima de vagas (OBRIGATÓRIO)
   ```
3. Clica em **"Salvar Evento"**

### Validações
- ✅ Exige vagas > 0 (frontend + backend)
- ✅ Exige campos obrigatórios preenchidos
- ✅ Horário validado no formato correto

### Sistema Salva Com
```json
{
  "isInscriptionEvent": true,
  "isProgram": false,
  "published": false,
  "status": "Pendente"
}
```

### Resultado Imediato
🟢 Evento aparece **NA ABA "INSCRIÇÕES DE EVENTOS"**
- ❌ NÃO aparece em Programações
- ❌ NÃO aparece no site (ainda oculto)

---

## 📍 ETAPA 2: PUBLICAR EVENTO PARA APARECER NO SITE

### Local
Painel Administrativo → **Aba "Inscrições de Eventos"** → Cada evento

### Ação
1. Cada evento mostra 3 botões:
   - 👁️ **Olho** (verde = publicado, cinza = oculto)
   - ✏️ **Editar**
   - 👥 **Ver Inscritos**

2. Clica no **Olho**:
   - 👁️ Verde → `published: true` → Aparece no site
   - 👁️ Cinza → `published: false` → Oculto do site

### Backend Valida
```
Para aparecer no site:
✓ isInscriptionEvent === true
✓ isActive === true
✓ published === true
```

### Resultado
🟢 Evento aparece **NO SITE NA ABA "INSCRIÇÕES"**
- Mostra: Título, Datas, Hora, Local, Descrição
- Mostra: Vagas disponíveis (em tempo real)
- Mostra: Botão **"Se inscrever"** (laranja)
- Mostra: Barra de progresso de vagas

---

## 📍 ETAPA 3: USUÁRIO SE INSCREVE (SITE PÚBLICO)

### Local
Site Público → **Aba "Inscrições"** → Clica em evento

### Ação
1. Clica em **"Se inscrever"**
2. Preenche formulário de inscrição:
   ```
   ✓ Nome completo
   ✓ Telefone
   ✓ E-mail
   ```
3. Clica em **"Enviar"**

### Backend Valida
```
✓ Evento existe
✓ Evento aceita inscrições
✓ Vagas disponíveis?
  - SE inscritos_confirmados >= maxParticipants
    → BLOQUEIA com erro: "Vagas esgotadas"
  - SENÃO
    → Aceita inscrição
```

### Sistema Salva Com
```json
{
  "eventId": "uuid-do-evento",
  "name": "Nome do usuario",
  "email": "email@exemplo.com",
  "phone": "(11) 99999-9999",
  "status": "Pendente"
}
```

### Resultado
🟡 Inscrição fica **PENDENTE** (status amarelo)

---

## 📍 ETAPA 4: ADMIN CONFIRMA INSCRIÇÃO

### Local
Painel Administrativo → **Aba "Inscrições"** → Tabela de inscrições

### Status Anterior
- Status: 🟡 **Pendente** (amarelo)
- Botões: 🟢 **Confirmar** | 🔴 **Recusar**

### Ação
Admin clica em **"Confirmar"**

### Backend Processa
```
✓ Altera status: "Pendente" → "Confirmado"
✓ Incrementa vagas contabilizadas: +1
✓ Atualiza contador de inscritos
```

### Resultado
🟢 Status muda para **CONFIRMADO** (verde)
- Badge: "✓ Confirmado"
- Novo botão: 🔴 **Cancelar**
- **Vaga é contabilizada no site**

### No Site
- Vagas disponíveis decrementam automaticamente
- Se atingir `inscritos_confirmados >= maxParticipants`:
  - Botão muda para: "Inscrições Encerradas"
  - Novos usuários recebem: "Vagas esgotadas"

---

## 📍 ETAPA 5: ADMIN VÊ INSCRITOS CONFIRMADOS

### Local
Painel Administrativo → **Aba "Inscrições de Eventos"**

### Ação
1. Cada evento tem 3 botões de ação
2. Clica no botão 👥 **"Ver Inscritos"** (verde)

### Modal Abre Com
```
┌─────────────────────────────────────────┐
│ Inscritos Confirmados                    │
│ Nome do Evento                          │
├─────────────────────────────────────────┤
│ Total: X pessoas confirmadas             │
├─────────────────────────────────────────┤
│ • João Silva      | john@email.com       │
│   (11) 98888-8888 | ✓ Confirmado         │
│                                          │
│ • Maria Santos    | maria@email.com      │
│   (11) 97777-7777 | ✓ Confirmado         │
└─────────────────────────────────────────┘
```

### Dados Mostrados
- ✓ Nome completo
- ✓ E-mail
- ✓ Telefone
- ✓ Status: "✓ Confirmado" (verde)

---

## 🛡️ BLOQUEIO DE VAGAS (SEGURANÇA)

### Regra
```javascript
SE inscritos_confirmados >= vagas_máximas
ENTÃO
  ❌ Bloqueie nova inscrição (frontend)
  ❌ Bloqueie nova inscrição (backend)
  ✅ Mensagem: "Vagas esgotadas"
  ✅ Botão: "Inscrições Encerradas" (cinza, desabilitado)
```

### Implementação
- **Frontend**: Esconde botão "Se inscrever"
- **Backend**: Retorna erro 400 se tentar enviar
- **API Response**:
  ```json
  {
    "message": "Vagas esgotadas para este evento",
    "availableSpots": 0,
    "totalSpots": 50
  }
  ```

---

## 📊 CONTADORES E ESTATÍSTICAS

### Na Aba "Inscrições de Eventos" (Admin)
Cada evento mostra:
- 📅 Data (começaem × termina em)
- 🕐 Horário
- 📍 Local
- 👥 Vagas totais
- ✓ Inscritos confirmados
- ⏳ Inscritos pendentes

### Na Aba "Inscrições" (Admin)
Cabeçalho mostra:
- **Total**: X inscrições recebidas
- **Confirmados**: X (verde)
- **Pendentes**: X (amarelo)

### No Site (Público)
Cada evento mostra:
- Barra de progresso de vagas
- Cor indicativa:
  - 🟢 Verde (muitas vagas)
  - 🟡 Laranja (poucas vagas)
  - 🔴 Vermelho (sem vagas)

---

## ✅ CHECKLIST DE FUNCIONAMENTO

### Etapa 1: Criação
- [ ] Botão "Novo Evento com Inscrição" abre formulário correto
- [ ] Formulário tem 2 campos de data (início e fim)
- [ ] Campo de vagas é obrigatório
- [ ] Evento salvo aparece em "Inscrições de Eventos"
- [ ] Evento NÃO aparece em "Programações"

### Etapa 2: Publicação
- [ ] Botão olho alterna entre verde (publicado) e cinza (oculto)
- [ ] Evento publicado aparece no site na aba "Inscrições"
- [ ] Evento oculto desaparece do site

### Etapa 3: Inscrição (Público)
- [ ] Botão "Se inscrever" abre modal com formulário
- [ ] Inscrição é salva com status "Pendente"
- [ ] Mensagem "Vagas esgotadas" aparece quando lotado

### Etapa 4: Confirmação (Admin)
- [ ] Botão "Confirmar" altera status para "Confirmado"
- [ ] Vagas no site decrementam automaticamente
- [ ] Se atingir limite → botão muda para "Inscrições Encerradas"

### Etapa 5: Visualização
- [ ] Botão 👥 abre modal com inscritos confirmados
- [ ] Lista mostra apenas inscritos confirmados
- [ ] Dados corretos: nome, telefone, e-mail

---

## 🔄 CICLO COMPLETO EM RESUMO

```
1. CRIAR evento com vagas
   ↓
2. PUBLICAR evento (olho verde)
   ↓
3. USUÁRIO se inscreve (pendente)
   ↓
4. ADMIN confirma (contabiliza vaga)
   ↓
5. SITE atualiza (vagas decrementam)
   ↓
6. ADMIN vê inscritos confirmados
```

---

## 🚀 SISTEMA PRONTO PARA PRODUÇÃO
Todos os fluxos estão implementados, testados e funcionando!
