# Comando SQL direto para corrigir as colunas

## OPÇÃO 1: Executar via Docker Terminal (RECOMENDADO - AGORA!)

Copie e cole **exatamente** isto no Docker Terminal:

```sql
psql -h localhost -U paroquia_user -d paroquia_db -c "ALTER TABLE schedules ALTER COLUMN time_start TYPE VARCHAR(50); ALTER TABLE schedules ALTER COLUMN time_end TYPE VARCHAR(50);"
```

Quando pedir senha, digite: `DEV10@gmail.com`

Você deve ver:
```
ALTER TABLE
ALTER TABLE
```

---

## OPÇÃO 2: Interativo (Mais Fácil de Ver)

1. Entre no PostgreSQL:
```bash
psql -h localhost -U paroquia_user -d paroquia_db
```

2. Cole isto dentro do shell:
```sql
ALTER TABLE schedules ALTER COLUMN time_start TYPE VARCHAR(50);
ALTER TABLE schedules ALTER COLUMN time_end TYPE VARCHAR(50);
```

3. Verifique:
```sql
\d schedules
```

4. Saia:
```sql
\q
```

---

## OPÇÃO 3: Via Script Node (Se preferir)

No seu terminal local:
```bash
npm run dev  # Terminal 1

# Terminal 2 (depois que o server iniciou):
node backend/scripts/fix-schedule-columns.js
```

---

⚠️ **USE A OPÇÃO 1 OU 2 AGORA!**
