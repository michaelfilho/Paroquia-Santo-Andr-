import { Church, Mail, Phone, MapPin, Instagram, Facebook, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { contentAPI } from '../src/services/api';

interface FooterProps {
  onAdminClick?: () => void;
}

export function Footer({ onAdminClick }: FooterProps) {
  const [config, setConfig] = useState({
    parishName: 'Paróquia Santo André',
    cityState: 'Tarumã - SP',
    aboutText: 'Uma comunidade de fé, esperança e amor servindo Tarumã desde 1952.',
    phone: '(18) 99799-4927',
    phoneLink: '18997994927',
    email: 'parsant@hotmail.com',
    addressLines: ['Rua das Violetas, 257', 'Centro - Tarumã/SP', 'CEP: 19820035'],
    instagramUrl: 'https://www.instagram.com/paroquiasantoandre.taruma/',
    facebookUrl: 'https://www.facebook.com/paroquiasantoandretaruma',
    copyrightText: '© 2026 Paróquia Santo André. Todos os direitos reservados.',
    privacyLabel: 'Política de Privacidade',
    termsLabel: 'Termos de Uso',
  });

  useEffect(() => {
    const loadFooterConfig = async () => {
      try {
        const data = await contentAPI.getByKey('footer_config');
        if (data?.content) {
          const parsed = JSON.parse(data.content);
          setConfig((prev) => ({ ...prev, ...parsed }));
        }
      } catch (error) {
        console.error('Erro ao carregar configuração do rodapé:', error);
      }
    };

    loadFooterConfig();
  }, []);

  return (
    <footer className="bg-gradient-to-br from-amber-950 via-amber-900 to-amber-950 text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-700/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-800/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <Church className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-xl">{config.parishName}</h3>
                <p className="text-amber-300 text-sm font-medium">{config.cityState}</p>
              </div>
            </div>
            <p className="text-amber-100 leading-relaxed">
              {config.aboutText}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-xl mb-6 text-amber-200">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <Phone className="w-5 h-5 text-amber-300 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <a href={`tel:${config.phoneLink}`} className="hover:text-amber-200 transition-colors">
                    {config.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <Mail className="w-5 h-5 text-amber-300 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <a href={`mailto:${config.email}`} className="hover:text-amber-200 transition-colors break-all">
                    {config.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-amber-300 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  {config.addressLines.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-xl mb-6 text-amber-200">Redes Sociais</h4>
            <p className="text-amber-100 mb-6 leading-relaxed">
              Acompanhe nossas atividades e fique por dentro de tudo que acontece na paróquia.
            </p>
            <div className="flex space-x-4">
              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.facebook.com/paroquiasantoandretaruma"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-amber-700/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-amber-200 text-center md:text-left">
              {config.copyrightText}
            </p>
            <div className="flex items-center space-x-6 text-amber-200">
              <button className="hover:text-white transition-colors">
                {config.privacyLabel}
              </button>
              <span className="text-amber-700">•</span>
              <button className="hover:text-white transition-colors">
                {config.termsLabel}
              </button>
              {onAdminClick && (
                <>
                  <span className="text-amber-700">•</span>
                  <button 
                    onClick={onAdminClick}
                    className="flex items-center space-x-1 hover:text-white transition-colors group"
                  >
                    <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Admin</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}