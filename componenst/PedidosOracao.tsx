import { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Flame, Heart } from 'lucide-react';
import { prayerRequestsAPI } from '../src/services/api';

interface Props {
    onNavigate: (page: string) => void;
    currentPage: string;
    onAdminClick: () => void;
    onCandleLit?: () => void;
}

export function PedidosOracao({ onNavigate, currentPage, onAdminClick, onCandleLit }: Props) {
    const [isLit, setIsLit] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [customIntention, setCustomIntention] = useState('');

    const lightCandle = async (intention: string) => {
        setShowOptions(false);
        setIsLit(true);
        if (onCandleLit) onCandleLit();

        try {
            await prayerRequestsAPI.create(intention);
        } catch (error) {
            console.error('Erro ao registrar pedido de oração:', error);
        }

        // Apaga a vela e mostra sucesso após 5s
        setTimeout(() => {
            setIsLit(false);
            setSuccessMessage(true);

            // Remove a mensagem após 4s
            setTimeout(() => {
                setSuccessMessage(false);
            }, 4000);

        }, 5000);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-amber-200">
            <Header onNavigate={onNavigate} currentPage={currentPage} />

            <main className="pt-32 pb-24 relative overflow-hidden min-h-[90vh] flex flex-col items-center justify-center">
                {/* Glow Effects Background */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full filter blur-[100px] transition-all duration-1000 ease-in-out mix-blend-multiply pointer-events-none ${isLit ? 'bg-amber-300/40 scale-100 opacity-100' : 'bg-transparent scale-50 opacity-0'}`} />

                <div className="max-w-4xl mx-auto px-4 w-full relative z-10 text-center">

                    <div className="mb-12">
                        <span className="text-amber-600 font-bold tracking-widest uppercase text-sm mb-4 block">Espaço Sagrado</span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-amber-900 mb-6 tracking-tight drop-shadow-sm">
                            Pedidos de Oração
                        </h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-amber-500 to-amber-700 mx-auto rounded-full mb-8 shadow-sm" />
                        <p className="text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto">
                            Acenda uma vela virtual e eleve suas intenções. Deus acolhe cada prece sussurrada com fé e amor.
                        </p>
                    </div>

                    {/* Candle Container */}
                    <div className="relative flex flex-col items-center">

                        {/* Candle Graphic */}
                        <div
                            className={`relative cursor-pointer group flex flex-col items-center transition-transform duration-300 ${!isLit && !showOptions ? 'hover:scale-105' : ''}`}
                            onClick={() => !isLit && !showOptions && setShowOptions(true)}
                        >

                            {/* Efeito de Arco / Gruta Católica (Nicho de Pedra) */}
                            <div className="absolute inset-x-[-4rem] top-[-1rem] bottom-[-2rem] pointer-events-none z-0 flex flex-col items-center">
                                {/* Corpo principal da Gruta (Cavidade em Arco) */}
                                <div className={`w-[85%] h-full rounded-t-[140px] rounded-b-[30px] transition-all duration-1000 overflow-hidden relative z-10 
                                                border-[16px] border-l-stone-600/80 border-r-stone-700/90 border-t-stone-500/80 border-b-stone-800
                                                ring-8 ring-stone-900/60 ring-inset shadow-2xl ${isLit ? 'bg-stone-800 shadow-[0_20px_80px_rgba(217,119,6,0.25)]' : 'bg-stone-900 shadow-inner'}`}>

                                    {/* Textura de Pedra Natural Realista */}
                                    <div
                                        className="absolute inset-0 opacity-90"
                                        style={{
                                            backgroundImage: `
                                                radial-gradient(ellipse at 50% 10%, rgba(120,113,108,0.7) 0%, transparent 40%),
                                                radial-gradient(circle at 20% 40%, rgba(87,83,78,0.6) 0%, transparent 30%),
                                                radial-gradient(circle at 80% 50%, rgba(168,162,158,0.5) 0%, transparent 35%),
                                                radial-gradient(circle at 50% 70%, rgba(68,64,60,0.8) 0%, transparent 50%),
                                                linear-gradient(135deg, rgba(30,27,24,0.4) 0%, transparent 50%),
                                                linear-gradient(-45deg, rgba(80,75,70,0.2) 0%, transparent 60%)
                                            `,
                                            backgroundColor: '#1c1917' // stone-900
                                        }}
                                    />

                                    {/* SVG Noise / Textura Rochosa e Rachaduras */}
                                    <div
                                        className="absolute inset-0 mix-blend-overlay opacity-60"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                                        }}
                                    />

                                    {/* Manchas de Musgo (Remete a grutas antigas) */}
                                    <div
                                        className="absolute inset-0 opacity-40 mix-blend-multiply"
                                        style={{
                                            backgroundImage: `
                                                radial-gradient(ellipse at 15% 20%, rgba(34,139,34,0.35) 0%, transparent 25%),
                                                radial-gradient(ellipse at 85% 30%, rgba(46,125,50,0.25) 0%, transparent 20%),
                                                radial-gradient(ellipse at 10% 80%, rgba(27,94,32,0.4) 0%, transparent 30%)
                                            `
                                        }}
                                    />

                                    {/* Cruz Sagrada no fundo da gruta */}
                                    <div className={`absolute top-[12%] left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-1000 ${isLit ? 'opacity-90 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]' : 'opacity-40 drop-shadow-md'}`}>
                                        <div className="w-2.5 h-24 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 rounded-sm shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),_2px_2px_8px_rgba(0,0,0,0.8)]" />
                                        <div className="absolute top-6 w-16 h-2.5 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 rounded-sm shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),_2px_2px_8px_rgba(0,0,0,0.8)]" />
                                        {/* Detalhe Dourado no Centro da Cruz */}
                                        <div className="absolute top-[26px] w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                                    </div>

                                    {/* Aprofundamento / Sombramento da Caverna */}
                                    <div className="absolute inset-0 shadow-[inset_0_120px_100px_rgba(0,0,0,0.95)] pointer-events-none" />
                                    <div className="absolute inset-0 shadow-[inset_0_-50px_80px_rgba(0,0,0,0.8)] pointer-events-none" />

                                    {/* Destaque escuro nas laterais internas para gerar o aspecto 3D do Côncavo */}
                                    <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-black/95 via-stone-900/70 to-transparent pointer-events-none" />
                                    <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-black/95 via-stone-900/70 to-transparent pointer-events-none" />

                                    {/* Iluminação refletida na imagem da gruta quando a vela está acesa */}
                                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-[28rem] rounded-t-full transition-all duration-1000 mix-blend-screen ${isLit ? 'bg-gradient-to-t from-amber-500/30 via-amber-400/10 to-transparent blur-[50px] opacity-100' : 'opacity-0'}`} />
                                    {isLit && <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/20 rounded-full blur-[60px]" />}
                                    {isLit && <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-400/25 rounded-full blur-[40px]" />}
                                </div>
                            </div>

                            {/* Chama (Flame) */}
                            <div className={`relative w-16 h-28 mb-1 transition-all duration-700 flex justify-center items-end ${isLit ? 'opacity-100' : 'opacity-0 scale-50 translate-y-4'}`}>
                                {/* Glow da chama */}
                                <div className="absolute w-32 h-40 bg-amber-400/30 rounded-full filter blur-2xl animate-pulse" />
                                <div className="absolute w-12 h-16 bg-yellow-300/60 rounded-full filter blur-md animate-pulse" />
                                <Flame className="w-16 h-16 text-amber-500 fill-amber-500 filter drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse" />
                            </div>

                            {/* Pavio (Wick) */}
                            <div className={`w-1.5 h-4 bg-amber-950 rounded-t-sm z-10 relative ${isLit ? 'bg-amber-900' : ''}`} />

                            {/* Corpo da Vela (Candle Body) */}
                            <div className={`w-20 h-56 rounded-md transition-all duration-500 shadow-xl relative z-10 border border-amber-100/50 ${isLit ? 'bg-gradient-to-b from-amber-50 via-white to-stone-100 shadow-[0_0_40px_rgba(251,191,36,0.2)]' : 'bg-gradient-to-b from-stone-100 to-stone-200'}`}>
                                {/* Efeito 3D da cera */}
                                <div className="absolute inset-x-0 top-0 h-3 rounded-full bg-white/60 shadow-inner" />
                                <div className="absolute inset-y-0 left-0 w-3 bg-black/5 rounded-l-md" />
                                <div className="absolute inset-y-0 right-0 w-2 bg-white/40 rounded-r-md" />
                                {isLit && <div className="absolute inset-x-0 top-2 h-16 bg-gradient-to-b from-amber-300/30 to-transparent" />}
                            </div>

                            {/* Base */}
                            <div className="w-28 h-5 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 rounded-full -mt-2.5 shadow-[0_10px_20px_rgba(0,0,0,0.2)] border border-amber-950 z-20 relative" />
                            <div className="w-40 h-2 bg-amber-900/10 rounded-full mt-1 blur-md z-10 relative" />

                            {/* Tooltip Hover (when unlit and options hidden) */}
                            {!isLit && !showOptions && !successMessage && (
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm border border-amber-200 text-amber-900 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-2 flex items-center gap-2 shadow-xl z-20">
                                    <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                                    Clique para acender
                                </div>
                            )}
                        </div>

                        {/* Modal de Opções */}
                        {showOptions && !isLit && (
                            <div className="absolute top-0 md:-top-16 -right-4 md:-right-24 translate-x-full bg-white/95 backdrop-blur-md border border-amber-100 p-8 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(251,191,36,0.3)] w-[320px] md:w-[400px] animate-fade-in-up z-20">
                                <div className="text-center mb-6">
                                    <h3 className="text-xl text-amber-900 font-extrabold mb-2 tracking-tight">Qual a sua intenção?</h3>
                                    <p className="text-sm text-gray-500 font-light">Escreva sua oração, pedido e/ou agradecimento!</p>
                                </div>

                                <div className="mb-2 animate-fade-in-up flex flex-col gap-4">
                                    <textarea
                                        value={customIntention}
                                        onChange={(e) => setCustomIntention(e.target.value)}
                                        placeholder="Ex: Pela saúde da minha família..."
                                        className="w-full px-5 py-4 rounded-2xl border-2 border-amber-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 outline-none text-gray-700 bg-white transition-all text-left placeholder:text-gray-300 min-h-[100px] resize-none"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey && customIntention.trim() !== '') {
                                                e.preventDefault();
                                                void lightCandle(customIntention);
                                            }
                                        }}
                                    />

                                    <button
                                        onClick={() => customIntention.trim() !== '' && void lightCandle(customIntention)}
                                        disabled={customIntention.trim() === ''}
                                        className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300 text-sm uppercase tracking-widest flex justify-center items-center gap-2"
                                    >
                                        <Flame className="w-5 h-5" />
                                        Acender Vela
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowOptions(false);
                                        setCustomIntention('');
                                    }}
                                    className="w-full mt-4 text-center text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest pt-4 border-t border-gray-100"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                        {/* Success Message Banner */}
                        <div className={`absolute -top-20 md:-top-24 w-full max-w-sm transition-all duration-700 z-30 ${successMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
                            <div className="bg-amber-50 border border-amber-200 text-amber-900 px-6 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl">
                                <Heart className="w-6 h-6 text-red-500 fill-red-500/20" />
                                <span className="font-bold text-lg">Sua prece foi ouvida.</span>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer onAdminClick={onAdminClick} />
        </div>
    );
}
