import { Header } from './Header';
import { Footer } from './Footer';
import { Heart, Landmark, Smartphone, Copy, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { contentAPI } from '../src/services/api';
import pixImg from '../Styles/img/pix.png';

interface Props {
    onNavigate: (page: string) => void;
    currentPage: string;
    onAdminClick: () => void;
}

export function Dizimo({ onNavigate, currentPage, onAdminClick }: Props) {
    const [copied, setCopied] = useState(false);
    const [config] = useState({
        pixKey: 'parsanat@hotmail.com',
        whatsappUrl: 'https://wa.me/5518997994927',
        quote: '"Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria."',
        quoteRef: '(2 Coríntios 9:7)',
        bankName: 'SICOOB - CREDIMOTA',
        agency: '3190',
        account: '32.586-4',
        holder: 'Paróquia Santo André - Tarumã/SP',
        cnpj: '44.375.186/0032-35',
    });

    const handleCopy = () => {
        navigator.clipboard.writeText(config.pixKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-amber-200">
            <Header onNavigate={onNavigate} currentPage={currentPage} />

            <main className="pt-32 pb-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-16 animate-fade-in-up">
                        <span className="text-amber-600 font-bold tracking-widest uppercase text-sm">Gratidão e Partilha</span>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-amber-900 mt-4 mb-6 tracking-tight flex items-center justify-center gap-4">
                            <Heart className="w-10 h-10 md:w-12 md:h-12 text-amber-600 fill-amber-600" />
                            Dízimo e Ofertas
                        </h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-amber-500 to-amber-700 mx-auto rounded-full mb-8 shadow-sm" />
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {config.quote} <br />
                            <span className="text-sm font-semibold text-amber-700 mt-2 block">{config.quoteRef}</span>
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">

                        {/* Texto Explicativo */}
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-amber-50 space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold text-amber-900 mb-4 border-b pb-2 border-amber-100">O que é o Dízimo?</h3>
                                <p className="text-gray-600 leading-relaxed text-justify">
                                    O dízimo não é uma taxa, mas um gesto de fé, gratidão e amor. É a devolução de uma pequena parte que Deus nos concede. Através dele, a paróquia se mantém viva, realizando sua missão evangelizadora, socorrendo os mais necessitados e mantendo o templo sagrado.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-amber-900 mb-4 border-b pb-2 border-amber-100">As Dimensões do Dízimo</h3>
                                <ul className="space-y-4 pt-2">
                                    <li className="flex items-start gap-3">
                                        <span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 font-bold text-amber-800">1</span>
                                        <div>
                                            <strong className="text-gray-900 block mb-1">Dimensão Religiosa</strong>
                                            <span className="text-gray-600 text-sm">Supre as necessidades para o culto: hóstias, vinho, velas, folhetos, energia e manutenção do templo.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 font-bold text-amber-800">2</span>
                                        <div>
                                            <strong className="text-gray-900 block mb-1">Dimensão Social</strong>
                                            <span className="text-gray-600 text-sm">Atendimento aos irmãos menos favorecidos através da Pastoral Social com cestas básicas e auxílios.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 font-bold text-amber-800">3</span>
                                        <div>
                                            <strong className="text-gray-900 block mb-1">Dimensão Missionária</strong>
                                            <span className="text-gray-600 text-sm">Apoio a missões e contribuição na formação de novos seminaristas e sacerdotes.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Formas de Contribuição */}
                        <div className="space-y-8">

                            {/* Seja Dizimista via WhatsApp */}
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 shadow-lg border border-amber-200 relative overflow-hidden">
                                <h3 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-3 relative z-10">
                                    <Heart className="w-7 h-7 text-red-500 fill-red-500 animate-pulse" />
                                    Seja um Dizimista!
                                </h3>
                                <p className="text-gray-700 mb-6 relative z-10">
                                    Deseja fazer o seu cadastro ou tem dúvidas sobre como se tornar dizimista? Fale diretamente conosco pelo WhatsApp.
                                </p>
                                <a
                                    href={config.whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 relative z-10"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-5 h-5"
                                    >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                    Falar no WhatsApp
                                </a>
                            </div>

                            {/* PIX / QR Code Card */}
                            <div className="bg-gradient-to-br from-amber-700 to-amber-900 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />

                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                                    <Smartphone className="w-7 h-7 text-amber-300" />
                                    Contribua via PIX
                                </h3>

                                <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
                                    {/* QR Code */}
                                    <div className="w-40 h-40 bg-white rounded-2xl p-3 shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
                                        <img src={pixImg} alt="QR Code PIX Paróquia Santo André" className="max-w-full max-h-full rounded-xl object-contain" />
                                    </div>

                                    <div className="flex-1 w-full space-y-4">
                                        <p className="text-amber-100 text-sm">Escaneie o código ao lado com o app do seu banco ou use a chave abaixo:</p>

                                        <div className="bg-black/20 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                                            <p className="text-xs text-amber-200/70 mb-1 font-semibold uppercase tracking-wider">Chave PIX (E-mail)</p>
                                            <p className="text-white font-mono break-all font-medium text-lg">{config.pixKey}</p>
                                        </div>

                                        <button
                                            onClick={handleCopy}
                                            className="w-full bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
                                        >
                                            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                            {copied ? 'Chave Copiada!' : 'Copiar Chave PIX'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Transferência Bancária Card */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-50">
                                <h3 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-3">
                                    <Landmark className="w-7 h-7 text-amber-600" />
                                    Dados Bancários
                                </h3>

                                <div className="space-y-4 text-gray-700">
                                    <div className="flex flex-col sm:flex-row sm:justify-between pb-3 border-b border-gray-100">
                                        <span className="text-gray-500 font-medium text-sm">Banco</span>
                                        <strong className="text-gray-900 text-lg">{config.bankName}</strong>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between pb-3 border-b border-gray-100">
                                        <span className="text-gray-500 font-medium text-sm">Agência</span>
                                        <strong className="text-gray-900 text-lg">{config.agency}</strong>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between pb-3 border-b border-gray-100">
                                        <span className="text-gray-500 font-medium text-sm">Conta Corrente</span>
                                        <strong className="text-gray-900 text-lg">{config.account}</strong>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between">
                                        <span className="text-gray-500 font-medium text-sm">Titular / CNPJ</span>
                                        <div className="text-right">
                                            <strong className="text-gray-900 block text-lg">{config.holder}</strong>
                                            <span className="text-sm">{config.cnpj}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            <Footer onAdminClick={onAdminClick} />
        </div>
    );
}
