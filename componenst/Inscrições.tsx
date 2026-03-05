import { useEffect, useState } from 'react';
import { Calendar, ExternalLink, FileText } from 'lucide-react';
import { registrationLinksAPI } from '../src/services/api';
import { resolveAssetUrl } from '../src/services/assetUrl';

interface RegistrationLinkItem {
  id: string;
  title: string;
  date: string;
  description: string;
  formUrl: string;
  imageUrl?: string;
  isActive: boolean;
}

export function Inscricoes() {
  const [items, setItems] = useState<RegistrationLinkItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await registrationLinksAPI.getPublic();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erro ao carregar inscrições:', error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-white via-amber-50/30 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center mb-14">
          <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">Participe Conosco</span>
          <h2 className="text-5xl md:text-6xl font-bold text-amber-900 mt-3 mb-5 tracking-tight">Inscrições</h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-6" />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Escolha uma inscrição e você será redirecionado para o link informado.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Carregando inscrições...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-amber-200 rounded-2xl text-gray-500 bg-white/70">
            Nenhuma inscrição disponível no momento.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <article key={item.id} className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                {item.imageUrl ? (
                  <img
                    src={resolveAssetUrl(item.imageUrl)}
                    alt={item.title}
                    className="w-full h-52 object-cover"
                  />
                ) : (
                  <div className="w-full h-52 bg-amber-50 flex items-center justify-center text-amber-700">
                    <FileText className="w-12 h-12" />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-amber-900 mb-3">{item.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                    {new Date(`${item.date}T12:00:00`).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 min-h-[72px]">{item.description}</p>

                  <a
                    href={item.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-5 py-3 rounded-xl font-semibold transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Fazer inscrição
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
