# 🚨 IMPORTANTE: Correção do Nome da Pasta

A pasta `componenst` está com erro de digitação. Para corrigir:

## Opção 1 - Usando o Terminal PowerShell:
```powershell
# No diretório raiz do projeto
Rename-Item -Path "componenst" -NewName "components"
```

## Opção 2 - Manualmente:
1. Renomeie a pasta `componenst` para `components`
2. Atualize os imports em todos os arquivos

## Depois da correção:

Atualize os imports em `App.tsx`:
```typescript
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Clergy } from './components/Clergy';
import { Map } from './components/Map';
import { PastEvents } from './components/PastEvents';
import { FutureEvents } from './components/FutureEvents';
import { Footer } from './components/Footer';
import { EventGallery } from './components/EventGallery';
import { Inscricoes } from './components/Inscricoes';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
```

## Ou continue usando "componenst"

Se preferir manter o nome atual, o projeto funcionará normalmente! A correção é apenas uma sugestão para seguir a convenção padrão.
