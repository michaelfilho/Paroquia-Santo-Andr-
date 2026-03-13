export type LiturgicalColor = 'verde' | 'roxo' | 'branco' | 'vermelho' | 'rosa' | 'preto' | 'dourado';

export interface DailyLiturgy {
  date: string;
  liturgyTitle: string;
  liturgicalColor: LiturgicalColor;
  liturgicalTime: string;
  quote: string;
  reference: string;
  readings: {
    first: {
      title: string;
      reference: string;
      text: string;
      html?: string;
    };
    psalm: {
      title: string;
      reference: string;
      refrain?: string;
      text: string;
      html?: string;
    };
    gospel: {
      title: string;
      reference: string;
      text: string;
      html?: string;
    };
  };
  source: string;
}

interface RawReading {
  referencia?: string;
  titulo?: string;
  texto?: string;
  refrao?: string;
  html?: string;
}

interface RawLiturgy {
  data?: string;
  liturgia?: string;
  cor?: string;
  leituras?: {
    primeiraLeitura?: RawReading[];
    salmo?: RawReading[];
    evangelho?: RawReading[];
  };
  primeiraLeitura?: RawReading;
  salmo?: RawReading;
  evangelho?: RawReading;
}

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : 'https://admin.paroquiataruma.com/api');
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');
const LITURGY_API_URL = `${API_BASE_URL}/public/liturgy/daily`;

const liturgicalTimeRules: Array<{ pattern: RegExp; time: string }> = [
  { pattern: /quaresma/i, time: 'Quaresma' },
  { pattern: /advento/i, time: 'Advento' },
  { pattern: /pascoa|pascal/i, time: 'Tempo Pascal' },
  { pattern: /natal/i, time: 'Tempo do Natal' },
  { pattern: /comum/i, time: 'Tempo Comum' },
];

const colorMap: Record<string, LiturgicalColor> = {
  verde: 'verde',
  roxo: 'roxo',
  branco: 'branco',
  vermelha: 'vermelho',
  vermelho: 'vermelho',
  rosa: 'rosa',
  preto: 'preto',
  dourado: 'dourado',
  ouro: 'dourado',
};

const cleanSpaces = (text: string) => text.replace(/\s+/g, ' ').trim();

const normalizeColor = (rawColor?: string): LiturgicalColor => {
  if (!rawColor) return 'verde';
  const key = cleanSpaces(rawColor).toLowerCase();
  return colorMap[key] || 'verde';
};

const inferLiturgicalTime = (title?: string) => {
  const normalized = cleanSpaces(title || '');
  for (const rule of liturgicalTimeRules) {
    if (rule.pattern.test(normalized)) {
      return rule.time;
    }
  }
  return 'Tempo Comum';
};

const extractQuote = (text?: string) => {
  const normalized = cleanSpaces(text || '');
  if (!normalized) {
    return 'A Palavra de Deus se renova em cada dia para iluminar o nosso caminho.';
  }

  const quoted = normalized.match(/["“](.+?)["”]/);
  if (quoted?.[1]) {
    return quoted[1];
  }

  const sentence = normalized.match(/(.+?[.!?])\s/);
  if (sentence?.[1]) {
    return sentence[1];
  }

  return normalized.slice(0, 220);
};

const getReading = (arrayReading?: RawReading[], objectReading?: RawReading): RawReading => {
  if (Array.isArray(arrayReading) && arrayReading.length > 0) {
    return arrayReading[0];
  }

  if (objectReading) {
    return objectReading;
  }

  return {};
};

export const fetchDailyLiturgy = async (): Promise<DailyLiturgy> => {
  const response = await fetch(LITURGY_API_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar a liturgia diaria.');
  }

  const payload: RawLiturgy = await response.json();
  const primeiraLeitura = getReading(payload.leituras?.primeiraLeitura, payload.primeiraLeitura);
  const salmo = getReading(payload.leituras?.salmo, payload.salmo);
  const evangelho = getReading(payload.leituras?.evangelho, payload.evangelho);

  return {
    date: payload.data || new Date().toLocaleDateString('pt-BR'),
    liturgyTitle: cleanSpaces(payload.liturgia || 'Liturgia do dia'),
    liturgicalColor: normalizeColor(payload.cor),
    liturgicalTime: inferLiturgicalTime(payload.liturgia),
    quote: extractQuote(evangelho?.texto),
    reference: cleanSpaces(evangelho?.referencia || 'Evangelho do dia'),
    readings: {
      first: {
        title: cleanSpaces(primeiraLeitura?.titulo || 'Primeira Leitura'),
        reference: cleanSpaces(primeiraLeitura?.referencia || ''),
        text: cleanSpaces(primeiraLeitura?.texto || 'Leitura indisponivel para hoje.'),
        html: primeiraLeitura?.html || '',
      },
      psalm: {
        title: 'Salmo',
        reference: cleanSpaces(salmo?.referencia || ''),
        refrain: cleanSpaces(salmo?.refrao || ''),
        text: cleanSpaces(salmo?.texto || 'Salmo indisponivel para hoje.'),
        html: salmo?.html || '',
      },
      gospel: {
        title: cleanSpaces(evangelho?.titulo || 'Evangelho'),
        reference: cleanSpaces(evangelho?.referencia || ''),
        text: cleanSpaces(evangelho?.texto || 'Evangelho indisponivel para hoje.'),
        html: evangelho?.html || '',
      },
    },
    source: 'Canção Nova',
  };
};

export interface LiturgicalTheme {
  main: string;
  soft: string;
  contrast: string;
}

const themeByColor: Record<LiturgicalColor, LiturgicalTheme> = {
  verde: { main: '#2f7d32', soft: 'rgba(47, 125, 50, 0.12)', contrast: '#f6fff7' },
  roxo: { main: '#5a2a7d', soft: 'rgba(90, 42, 125, 0.14)', contrast: '#fbf7ff' },
  branco: { main: '#9a8f56', soft: 'rgba(154, 143, 86, 0.10)', contrast: '#fffdf4' },
  vermelho: { main: '#b02a37', soft: 'rgba(176, 42, 55, 0.13)', contrast: '#fff5f6' },
  rosa: { main: '#ad476a', soft: 'rgba(173, 71, 106, 0.12)', contrast: '#fff7fb' },
  preto: { main: '#2f2f2f', soft: 'rgba(47, 47, 47, 0.14)', contrast: '#f6f6f6' },
  dourado: { main: '#9a7b1f', soft: 'rgba(154, 123, 31, 0.14)', contrast: '#fffbeb' },
};

export const getThemeFromLiturgicalColor = (color: LiturgicalColor): LiturgicalTheme => {
  return themeByColor[color] || themeByColor.verde;
};
