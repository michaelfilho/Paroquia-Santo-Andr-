const express = require('express');

const router = express.Router();

const CANCao_NOVA_URL = 'https://liturgia.cancaonova.com/pb/';
const CACHE_TTL_MS = 15 * 60 * 1000;

const cache = {
  dateKey: '',
  fetchedAt: 0,
  payload: null,
};

const monthMap = {
  jan: '01',
  fev: '02',
  mar: '03',
  abr: '04',
  mai: '05',
  jun: '06',
  jul: '07',
  ago: '08',
  set: '09',
  out: '10',
  nov: '11',
  dez: '12',
};

const decodeHtmlEntities = (text = '') => {
  return text
    .replace(/&#8211;/g, '-')
    .replace(/&#8220;|&#8221;|&#8243;/g, '"')
    .replace(/&#8216;|&#8217;|&#8242;/g, "'")
    .replace(/&#8230;/g, '...')
    .replace(/&#160;|&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&aacute;/g, 'á')
    .replace(/&eacute;/g, 'é')
    .replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
    .replace(/&atilde;/g, 'ã')
    .replace(/&otilde;/g, 'õ')
    .replace(/&ccedil;/g, 'ç')
    .replace(/&Aacute;/g, 'Á')
    .replace(/&Eacute;/g, 'É')
    .replace(/&Iacute;/g, 'Í')
    .replace(/&Oacute;/g, 'Ó')
    .replace(/&Uacute;/g, 'Ú')
    .replace(/&Atilde;/g, 'Ã')
    .replace(/&Otilde;/g, 'Õ')
    .replace(/&Ccedil;/g, 'Ç')
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)));
};

const cleanText = (text = '') => {
  return decodeHtmlEntities(text)
    .replace(/\r/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
};

const stripHtmlToText = (html = '') => {
  const withoutMedia = html
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<div class="embeds-audio">[\s\S]*?<\/div>/gi, '');

  const paragraphized = withoutMedia
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/div>/gi, '\n')
    .replace(/<div[^>]*>/gi, '');

  const noTags = paragraphized.replace(/<[^>]+>/g, '');
  return cleanText(noTags);
};

const sanitizeReadingHtml = (html = '') => {
  const withoutMedia = html
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<div class="embeds-audio">[\s\S]*?<\/div>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');

  const normalized = withoutMedia
    .replace(/<p[^>]*>/gi, '<p>')
    .replace(/<(strong|em|b|i|u|span)[^>]*>/gi, '<$1>')
    .replace(/<\/span>/gi, '')
    .replace(/<br\s*\/?>/gi, '<br/>')
    .replace(/<\/div>/gi, '')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<!--([\s\S]*?)-->/g, '');

  const allowedOnly = normalized.replace(/<(?!\/?(p|strong|em|b|i|u|br)\b)[^>]+>/gi, '');
  const compact = allowedOnly
    .replace(/\r/g, '')
    .replace(/\n{2,}/g, '\n')
    .replace(/<p>\s*<\/p>/gi, '')
    .replace(/>\s+</g, '><')
    .trim();

  return decodeHtmlEntities(compact);
};

const extractMatch = (html, regex) => {
  const match = html.match(regex);
  return cleanText(match?.[1] || '');
};

const extractTabMeta = (html, tabId) => {
  const escaped = tabId.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`<a[^>]+href="#${escaped}"[\\s\\S]*?<label[^>]*>([\\s\\S]*?)<\\/label>[\\s\\S]*?<div class="referencia">([\\s\\S]*?)<\\/div>`, 'i');
  const match = html.match(regex);

  return {
    title: cleanText(match?.[1] || ''),
    reference: cleanText(match?.[2] || ''),
  };
};

const extractSectionHtml = (html, sectionId) => {
  const escaped = sectionId.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`<div id="${escaped}"[^>]*>([\\s\\S]*?)(?=<div id="liturgia-\\d+"|<p style="font-style: italic;color: #a7a7a7|<\\/article>)`, 'i');
  const match = html.match(regex);
  return match?.[1] || '';
};

const extractDate = (html) => {
  const day = extractMatch(html, /<span class='dia'>(\d{1,2})<\/span>/i).padStart(2, '0');
  const monthRaw = extractMatch(html, /<span class='mes'>([A-Za-z\u00c0-\u00ff]{3})<\/span>/i).toLowerCase();
  const year = extractMatch(html, /<span class='ano'>(\d{4})<\/span>/i);
  const month = monthMap[monthRaw] || '01';

  if (!day || !year) return '';
  return `${day}/${month}/${year}`;
};

const extractPsalmRefrain = (text = '') => {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const refrain = lines.find((line) => /E feliz|refrao|\(R\./i.test(line));
  return refrain || '';
};

const todayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const fetchCancaonovaLiturgy = async () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(CANCao_NOVA_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'ParoquiaSantoAndre/1.0 (+https://paroquiataruma.com)',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Canção Nova retornou status ${response.status}`);
    }

    const html = await response.text();

    const liturgyTitle = extractMatch(html, /<h1 class="entry-title">([\s\S]*?)<\/h1>/i);
    const liturgicalColorRaw = extractMatch(html, /<span class="cor-liturgica">[\s\S]*?:\s*([^<]+)<\/span>/i);

    const firstMeta = extractTabMeta(html, 'liturgia-1');
    const psalmMeta = extractTabMeta(html, 'liturgia-2');
    const secondMeta = extractTabMeta(html, 'liturgia-3');
    const gospelMeta = extractTabMeta(html, 'liturgia-4');

    const firstSectionHtml = extractSectionHtml(html, 'liturgia-1');
    const psalmSectionHtml = extractSectionHtml(html, 'liturgia-2');
    const secondSectionHtml = extractSectionHtml(html, 'liturgia-3');
    const gospelSectionHtml = extractSectionHtml(html, 'liturgia-4');

    const firstText = stripHtmlToText(firstSectionHtml);
    const psalmText = stripHtmlToText(psalmSectionHtml);
    const secondText = stripHtmlToText(secondSectionHtml);
    const gospelText = stripHtmlToText(gospelSectionHtml);
    const firstHtml = sanitizeReadingHtml(firstSectionHtml);
    const psalmHtml = sanitizeReadingHtml(psalmSectionHtml);
    const secondHtml = sanitizeReadingHtml(secondSectionHtml);
    const gospelHtml = sanitizeReadingHtml(gospelSectionHtml);

    const hasSecondReading = Boolean(secondText);

    if (!liturgyTitle || !firstText || !gospelText) {
      throw new Error('Nao foi possivel interpretar a liturgia da Canção Nova.');
    }

    return {
      source: 'Canção Nova',
      data: extractDate(html),
      liturgia: liturgyTitle,
      cor: liturgicalColorRaw || 'Verde',
      leituras: {
        primeiraLeitura: [{
          titulo: firstMeta.title || '1a Leitura',
          referencia: firstMeta.reference,
          texto: firstText,
          html: firstHtml,
        }],
        segundaLeitura: hasSecondReading ? [{
          titulo: secondMeta.title || '2a Leitura',
          referencia: secondMeta.reference,
          texto: secondText,
          html: secondHtml,
        }] : [],
        salmo: [{
          titulo: psalmMeta.title || 'Salmo',
          referencia: psalmMeta.reference,
          refrao: extractPsalmRefrain(psalmText),
          texto: psalmText,
          html: psalmHtml,
        }],
        evangelho: [{
          titulo: gospelMeta.title || 'Evangelho',
          referencia: gospelMeta.reference,
          texto: gospelText,
          html: gospelHtml,
        }],
      },
    };
  } finally {
    clearTimeout(timer);
  }
};

router.get('/daily', async (req, res) => {
  try {
    const key = todayKey();
    const isFresh = cache.payload && cache.dateKey === key && (Date.now() - cache.fetchedAt) < CACHE_TTL_MS;

    if (isFresh) {
      return res.json(cache.payload);
    }

    const payload = await fetchCancaonovaLiturgy();
    cache.dateKey = key;
    cache.fetchedAt = Date.now();
    cache.payload = payload;

    return res.json(payload);
  } catch (error) {
    console.error('Erro ao buscar liturgia na Canção Nova:', error.message || error);
    return res.status(502).json({
      message: 'Nao foi possivel buscar a liturgia da Canção Nova neste momento.',
      error: error.message || 'erro_desconhecido',
    });
  }
});

module.exports = router;
