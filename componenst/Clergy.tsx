import { Mail, Phone } from 'lucide-react';
import { ImageWithFallback } from './figma/image';
import currentPriestImage from '../Styles/img/WhatsApp Image 2026-02-03 at 10.39.15.jpeg';

interface ClergyMember {
  id: string;
  name: string;
  role: string;
  period: string;
  bio: string;
  email?: string;
  phone?: string;
  imageUrl: string;
  current: boolean;
}

export function Clergy() {
  const priests: ClergyMember[] = [
    {
      id: '1',
      name: 'Pe. Joaquim Neto',
      role: 'Pároco',
      period: '2020 - Presente',
      bio: 'Ordenado em 2010, Pe. João Carlos dedica-se à evangelização e ao fortalecimento da comunidade paroquial. Com formação em Teologia Pastoral, tem focado em renovar as pastorais e ampliar o alcance missionário da paróquia.',
      email: 'pe.joao@paroquiasantoandre.org.br',
      phone: '(14) 3234-5678',
      imageUrl: currentPriestImage,
      current: true,
    },
    {
      id: '2',
      name: 'Pe. Antonio Mendes',
      role: 'Pároco',
      period: '2010 - 2020',
      bio: 'Durante sua atuação, Pe. Antonio foi responsável pela restauração da igreja matriz em 2010 e pela fundação de dois novos grupos de jovens. Hoje atua em outra diocese, mas mantém carinho especial pela Paróquia Santo André.',
      imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      current: false,
    },
    {
      id: '3',
      name: 'Pe. Francisco Rodrigues',
      role: 'Pároco Fundador',
      period: '1952 - 1985',
      bio: 'Pe. Francisco foi o fundador e primeiro pároco da Paróquia Santo André. Sob sua liderança, a igreja matriz foi construída e a paróquia estabeleceu suas raízes profundas na comunidade de Tarumã.',
      imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      current: false,
    },
  ];

  const vicars: ClergyMember[] = [
    {
      id: '4',
      name: 'Pe. Lucas Fernandes',
      role: 'Vigário Paroquial',
      period: '2022 - Presente',
      bio: 'Recém-ordenado, Pe. Lucas traz energia e renovação à paróquia. Atua especialmente com os jovens e na coordenação da catequese, implementando novas metodologias de evangelização.',
      email: 'pe.lucas@paroquiasantoandre.org.br',
      phone: '(14) 3234-5679',
      imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      current: true,
    },
    {
      id: '5',
      name: 'Pe. Rafael Santos',
      role: 'Vigário Paroquial',
      period: '2018 - 2022',
      bio: 'Pe. Rafael desenvolveu trabalhos importantes nas comunidades rurais da paróquia, levando a palavra de Deus aos locais mais afastados. Hoje serve como missionário em outra região.',
      imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      current: false,
    },
  ];

  const pope: ClergyMember[] = [
    {
      id: '6',
      name: 'Papa Francisco',
      role: 'Papa',
      period: '2013 - Presente',
      bio: 'Jorge Mario Bergoglio, Papa Francisco, eleito em 2013, é o 266º Papa da Igreja Católica Apostólica Romana. Primeiro Papa das Américas e primeiro Papa jesuíta, dedica-se à missão de renovação da Igreja e ao cuidado com os pobres e excluídos, seguindo as pegadas de São Francisco.',
      imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      current: true,
    },
  ];

  const bishops: ClergyMember[] = [
    {
      id: '7',
      name: 'Dom Cerineu Pivatto',
      role: 'Bispo',
      period: '2006 - Presente',
      bio: 'Dom Cerineu Pivatto é o bispo responsável pela Diocese que abrange nossa Paróquia Santo André. Dedica-se ao pastoreio dos fiéis, à formação do clero e ao fortalecimento das comunidades paroquiais em sua jurisdição.',
      email: 'bispo@diocese.org.br',
      phone: '(14) 3232-2010',
      imageUrl: 'https://images.unsplash.com/photo-1661448836587-f9ea11d601ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMHByaWVzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTk2NDAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      current: true,
    },
  ];

  const ClergyCard = ({ member }: { member: ClergyMember }) => (
    <div className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-amber-100/50">
      <div className="relative h-80 overflow-hidden">
        <ImageWithFallback
          src={member.imageUrl}
          alt={member.name}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
            member.current ? 'object-[20%_20%]' : 'object-center'
          }`}
        />
        {member.current && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            Atual
          </div>
        )}
      </div>

      <div className="p-8">
        <h3 className="text-2xl font-bold text-amber-900 mb-2">
          {member.name}
        </h3>
        <p className="text-amber-600 font-semibold mb-1">{member.role}</p>
        <p className="text-gray-500 text-sm mb-5">{member.period}</p>

        {/* BIO JUSTIFICADA */}
        <p className="text-gray-600 leading-relaxed mb-6 text-justify">
          {member.bio}
        </p>

        {member.current && (member.email || member.phone) && (
          <div className="border-t border-gray-200 pt-5 space-y-3">
            {member.email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-5 h-5 mr-3 text-amber-600" />
                <a
                  href={`mailto:${member.email}`}
                  className="hover:text-amber-700 transition-colors truncate"
                >
                  {member.email}
                </a>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-5 h-5 mr-3 text-amber-600" />
                <a
                  href={`tel:${member.phone.replace(/\D/g, '')}`}
                  className="hover:text-amber-700 transition-colors"
                >
                  {member.phone}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section id="clero" className="py-24 bg-gradient-to-b from-white to-amber-50/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-amber-900">
            Nosso Clero
          </h2>
        </div>

        <div className="mb-24">
          <h3 className="text-4xl font-bold text-amber-900 mb-12 text-center">
            Papa
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {pope.map(member => (
              <ClergyCard key={member.id} member={member} />
            ))}
          </div>
        </div>

        <div className="mb-24">
          <h3 className="text-4xl font-bold text-amber-900 mb-12 text-center">
            Bispo
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {bishops.map(bishop => (
              <ClergyCard key={bishop.id} member={bishop} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-4xl font-bold text-amber-900 mb-12 text-center">
            Sacerdotes
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {priests.map(priest => (
              <ClergyCard key={priest.id} member={priest} />
            ))}
            {vicars.map(vicar => (
              <ClergyCard key={vicar.id} member={vicar} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
