import { useMemo, useState } from 'react';
import { BookOpenText } from 'lucide-react';
import type { DailyLiturgy, LiturgicalTheme } from '../src/services/liturgia';

interface DailyLiturgyProps {
  liturgy: DailyLiturgy | null;
  isLoading: boolean;
  error: string | null;
  theme: LiturgicalTheme;
}

const getReadableColor = (colorKey: DailyLiturgy['liturgicalColor']) => {
  const map = {
    verde: 'Verde',
    roxo: 'Roxo',
    branco: 'Branco',
    vermelho: 'Vermelho',
    rosa: 'Rosa',
    preto: 'Preto',
    dourado: 'Dourado',
  } as const;

  return map[colorKey] || 'Verde';
};

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '').trim();
  if (normalized.length !== 6) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  if ([red, green, blue].some(Number.isNaN)) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const removeDuplicateBoldPsalmReference = (html: string, reference?: string) => {
  if (!html || !reference) return html;

  const normalizedReference = reference.trim();
  if (!normalizedReference) return html;

  const referencePattern = escapeRegex(normalizedReference).replace(/\s+/g, '\\s+');

  const boldParagraphPattern = new RegExp(
    `<p>\\s*<(?:strong|b)>\\s*${referencePattern}\\s*<\\/(?:strong|b)>\\s*<\\/p>`,
    'i',
  );

  if (boldParagraphPattern.test(html)) {
    return html.replace(boldParagraphPattern, '').trim();
  }

  const inlineBoldPattern = new RegExp(`<(?:strong|b)>\\s*${referencePattern}\\s*<\\/(?:strong|b)>`, 'i');
  return html.replace(inlineBoldPattern, '').trim();
};

const cleanupGospelHtml = (html: string) => {
  if (!html) return html;

  return html
    .replace(
      /^(?:\s|<br\s*\/?>)*(?:<p>)\s*<(?:strong|b)>\s*Evangelho[\s\S]*?<\/(?:strong|b)>\s*<\/p>/i,
      '',
    )
    .replace(/^(?:\s|<br\s*\/?>)*(?:<h[1-6][^>]*>)\s*Evangelho[\s\S]*?<\/h[1-6]>/i, '')
    .replace(/^(?:\s|<br\s*\/?>)*(?:<(?:strong|b)>)\s*Evangelho[\s\S]*?<\/(?:strong|b)>/i, '')
    .replace(
      /^(?:\s|<br\s*\/?>)*(?:<p>)\s*(?:<(?:em|i)>)?\s*["“][\s\S]*?["”]\s*(?:<\/(?:em|i)>)?\s*<\/p>/i,
      '',
    )
    .trim();
};

export function LiturgiaDiariaCard({ liturgy, isLoading, error, theme }: DailyLiturgyProps) {
  const [activeTab, setActiveTab] = useState<'first' | 'psalm' | 'gospel'>('first');

  const tabData = useMemo(() => {
    if (!liturgy) return null;

    if (activeTab === 'first') {
      return {
        tabTitle: '1a Leitura',
        title: liturgy.readings.first.title,
        reference: liturgy.readings.first.reference,
        subline: '',
        text: liturgy.readings.first.text,
        html: liturgy.readings.first.html || '',
      };
    }

    if (activeTab === 'psalm') {
      return {
        tabTitle: 'Salmo',
        title: liturgy.readings.psalm.title,
        reference: liturgy.readings.psalm.reference || '',
        subline: liturgy.readings.psalm.refrain || '',
        text: liturgy.readings.psalm.text,
        html: liturgy.readings.psalm.html || '',
      };
    }

    return {
      tabTitle: 'Evangelho',
      title: liturgy.readings.gospel.title,
      reference: liturgy.readings.gospel.reference,
      subline: '',
      text: liturgy.readings.gospel.text,
      html: liturgy.readings.gospel.html || '',
    };
  }, [activeTab, liturgy]);

  const renderedHtml = useMemo(() => {
    if (!tabData?.html) return '';

    if (activeTab === 'psalm') {
      return removeDuplicateBoldPsalmReference(tabData.html, tabData.reference);
    }

    if (activeTab === 'gospel') {
      return cleanupGospelHtml(tabData.html);
    }

    return tabData.html;
  }, [activeTab, tabData?.html, tabData?.reference]);

  return (
    <section id="liturgia-diaria" className="py-14 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div
          className="mx-auto rounded-3xl border shadow-sm px-5 py-8 md:px-10 md:py-10"
          style={{
            borderColor: theme.soft,
            background: `linear-gradient(135deg, rgba(255,255,255,0.98)}, rgba(250,250,250,0.96))`,
            boxShadow: `0 14px 38px ${hexToRgba(theme.main, 0.24)}`,
          }}
        >
          <div className="flex justify-center mb-4" style={{ color: theme.main }}>
            <BookOpenText className="w-9 h-9" />
          </div>

          <h2 className="text-center text-3xl md:text-4xl font-semibold mb-2" style={{ color: theme.main }}>
            Palavra Biblica do Dia
          </h2>

          {isLoading && (
            <p className="text-center text-gray-600 italic">Carregando liturgia diaria...</p>
          )}

          {error && !isLoading && (
            <p className="text-center text-red-700">{error}</p>
          )}

          {!isLoading && !error && liturgy && (
            <>
              <p className="text-center text-xl md:text-3xl font-semibold mb-6" style={{ color: theme.main }}>
                {liturgy.liturgyTitle}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 border rounded-lg overflow-hidden mb-6" style={{ borderColor: theme.soft }}>
                <button
                  onClick={() => setActiveTab('first')}
                  className="px-4 py-3 text-base font-semibold border-b md:border-b-0 md:border-r transition-colors"
                  style={{
                    borderColor: theme.soft,
                    backgroundColor: activeTab === 'first' ? theme.main : 'transparent',
                    color: activeTab === 'first' ? '#ffffff' : '#6b7280',
                  }}
                >
                  1a Leitura
                </button>

                <button
                  onClick={() => setActiveTab('psalm')}
                  className="px-4 py-3 text-base font-semibold border-b md:border-b-0 md:border-r transition-colors"
                  style={{
                    borderColor: theme.soft,
                    backgroundColor: activeTab === 'psalm' ? theme.main : 'transparent',
                    color: activeTab === 'psalm' ? '#ffffff' : '#6b7280',
                  }}
                >
                  Salmo
                </button>

                <button
                  onClick={() => setActiveTab('gospel')}
                  className="px-4 py-3 text-base font-semibold transition-colors"
                  style={{
                    backgroundColor: activeTab === 'gospel' ? theme.main : 'transparent',
                    color: activeTab === 'gospel' ? '#ffffff' : '#6b7280',
                  }}
                >
                  Evangelho
                </button>
              </div>

              <div className="rounded-xl border px-4 py-6 md:px-7" style={{ borderColor: theme.soft, backgroundColor: '#ffffff' }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: theme.main }}>
                  {tabData?.tabTitle}
                </p>

                {activeTab === 'gospel' && tabData?.reference && (
                  <p className="text-2xl font-bold text-slate-700">Evangelho ({tabData.reference})</p>
                )}

                {renderedHtml ? (
                  <div
                    className="mt-5 cn-reading-content"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                  />
                ) : (
                  <p className="mt-5 text-[1.15rem] leading-10 text-slate-700 whitespace-pre-line text-justify">
                    {tabData?.text}
                  </p>
                )}
              </div>

              <div className="mt-7 flex justify-center">
                <div
                  className="rounded-2xl px-4 py-3 border text-center min-w-[280px]"
                  style={{ borderColor: theme.soft, backgroundColor: theme.contrast }}
                >
                  <p className="text-xs uppercase tracking-wider text-gray-500">Tempo Liturgico Atual</p>
                  <p className="text-lg font-semibold" style={{ color: theme.main }}>{liturgy.liturgicalTime}</p>
                  <p className="text-sm text-gray-600">Cor: {getReadableColor(liturgy.liturgicalColor)}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
