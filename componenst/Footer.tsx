import { Church, Mail, Phone, MapPin, Instagram, Facebook, Shield } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
}

export function Footer({ onAdminClick }: FooterProps) {
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
                <h3 className="font-bold text-xl">Paróquia Santo André</h3>
                <p className="text-amber-300 text-sm font-medium">Tarumã - SP</p>
              </div>
            </div>
            <p className="text-amber-100 leading-relaxed">
              Uma comunidade de fé, esperança e amor servindo Tarumã desde 1952.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-xl mb-6 text-amber-200">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <Phone className="w-5 h-5 text-amber-300 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <a href="tel:1432345678" className="hover:text-amber-200 transition-colors">
                    (14) 3234-5678
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <Mail className="w-5 h-5 text-amber-300 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <a href="mailto:contato@paroquiasantoandre.org.br" className="hover:text-amber-200 transition-colors break-all">
                    contato@paroquiasantoandre.org.br
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-amber-300 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  Rua da Igreja, 123<br />
                  Centro - Tarumã/SP<br />
                  CEP: 18500-000
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
                href="https://instagram.com/paroquiasantoandre"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://facebook.com/paroquiasantoandre"
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
              © 2026 Paróquia Santo André. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-6 text-amber-200">
              <button className="hover:text-white transition-colors">
                Política de Privacidade
              </button>
              <span className="text-amber-700">•</span>
              <button className="hover:text-white transition-colors">
                Termos de Uso
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