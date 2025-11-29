import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Sparkles, Crown, Rocket, Target, Flame, Heart, Zap, Award, Sun } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import { useDashboard } from '@/store/useStore';

interface Nivel {
  nivel: number;
  nome: string;
  descricao: string;
  estagio: number;
  estagio_nome: string;
  xp_minimo: number;
  xp_proximo_nivel: number | null;
}

interface Estagio {
  numero: number;
  nome: string;
  niveis: Nivel[];
}

// Ícones para cada nível
const nivelIcons: Record<number, React.ReactNode> = {
  1: <Sun size={24} />,
  2: <Target size={24} />,
  3: <Heart size={24} />,
  4: <Flame size={24} />,
  5: <Zap size={24} />,
  6: <Rocket size={24} />,
  7: <Star size={24} />,
  8: <Award size={24} />,
  9: <Sparkles size={24} />,
  10: <Crown size={24} />,
};

// Cores para cada estágio (usando variáveis CSS do tema)
const estagioColors: Record<number, { bg: string; border: string; text: string; glow: string }> = {
  1: { bg: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  2: { bg: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
  3: { bg: 'from-purple-500/20 to-violet-500/10', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  4: { bg: 'from-amber-500/20 to-yellow-500/10', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
};

const NiveisJornadaPageV13: React.FC = () => {
  const { setView, dashboardData } = useDashboard();
  const [estagios, setEstagios] = useState<Estagio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nivelAtual, setNivelAtual] = useState(1);
  const [activeTab, setActiveTab] = useState<TabId>('ajustes');

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Usuário';

  const userId = dashboardData?.usuario?.id;

  // Handlers de navegação do menu
  const handleNavHome = () => {
    setActiveTab('home');
    setView('dashboard');
  };

  const handleNavPerfil = () => {
    setActiveTab('perfil');
    setView('dashEmocoes');
  };

  const handleNavQuests = () => {
    setActiveTab('quests');
    setView('painelQuests');
  };

  const handleNavConfig = () => {
    setActiveTab('ajustes');
    setView('evoluir');
  };

  // Carregar dados dos níveis da API
  useEffect(() => {
    const loadNiveis = async () => {
      if (!userId) {
        setError('Usuário não identificado');
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`/api/jornada?user_id=${userId}`);
        const data = await res.json();
        
        if (!res.ok || !data.success) {
          setError(data.error || 'Erro ao carregar níveis');
          setLoading(false);
          return;
        }
        
        setEstagios(data.estagios || []);
        setNivelAtual(data.usuario?.nivel_atual ?? 1);
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro ao carregar níveis';
        setError(errorMsg);
        console.error('[NiveisJornada] Erro:', err);
      } finally {
        setLoading(false);
      }
    };
    loadNiveis();
  }, [userId]);

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
        {/* Botão voltar */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setView('evoluir')}
            className="mq-btn-back"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        {/* Título da página */}
        <div className="mb-6 text-center">
          <h1 className="mq-page-title">Níveis da Jornada</h1>
          <p className="mq-page-subtitle">10 níveis • 4 estágios de evolução</p>
        </div>

        {/* Intro visual */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mq-card p-6 mb-6 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--mq-primary)]/30 to-[var(--mq-primary)]/10 mb-4">
            <Sparkles size={32} className="text-[var(--mq-primary)]" />
          </div>
          <p className="text-sm text-[var(--mq-text-muted)] max-w-xs mx-auto">
            Conversas revelam padrões. Ações mudam tudo. Celebre cada passo...
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--mq-primary)] border-t-transparent" />
          </div>
        )}

        {/* Erro */}
        {error && !loading && (
          <div className="mq-card p-6 text-center border border-red-500/30 bg-red-500/10">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Estágios e Níveis */}
        <div className="space-y-8">
          {!loading && estagios.map((estagio, estagioIndex) => {
            const colors = estagioColors[estagio.numero] || estagioColors[1];
            
            return (
              <motion.div
                key={estagio.numero}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: estagioIndex * 0.15 }}
                className="space-y-3"
              >
                {/* Header do Estágio */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center ${colors.border} border`}>
                    <span className={`text-lg font-bold ${colors.text}`}>{estagio.numero}</span>
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${colors.text}`}>Estágio {estagio.numero}</h3>
                    <p className="text-xs text-[var(--mq-text-muted)]">{estagio.nome}</p>
                  </div>
                </div>

                {/* Níveis do Estágio */}
                <div className="ml-5 border-l-2 border-[var(--mq-border)] pl-5 space-y-3">
                  {estagio.niveis.map((nivel, nivelIndex) => {
                    const isAtual = nivel.nivel === nivelAtual;
                    const isAlcancado = nivel.nivel < nivelAtual;
                    
                    return (
                      <motion.div
                        key={nivel.nivel}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: estagioIndex * 0.15 + nivelIndex * 0.08 }}
                        className={`relative mq-card p-4 transition-all ${
                          isAtual 
                            ? `ring-2 ring-[var(--mq-primary)] ${colors.glow} shadow-lg` 
                            : isAlcancado 
                              ? 'opacity-70' 
                              : 'opacity-50'
                        }`}
                      >
                        {/* Indicador de nível atual */}
                        {isAtual && (
                          <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--mq-primary)] animate-pulse" />
                        )}
                        
                        {/* Indicador de nível alcançado */}
                        {isAlcancado && (
                          <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--mq-text-muted)]" />
                        )}

                        <div className="flex items-start gap-3">
                          {/* Ícone do nível */}
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            isAtual 
                              ? `bg-gradient-to-br ${colors.bg} ${colors.text}` 
                              : isAlcancado
                                ? 'bg-[var(--mq-card)] text-[var(--mq-text-muted)]'
                                : 'bg-[var(--mq-card)] text-[var(--mq-text-subtle)]'
                          }`}>
                            {nivelIcons[nivel.nivel]}
                          </div>

                          {/* Info do nível */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                isAtual 
                                  ? `bg-[var(--mq-primary)]/20 text-[var(--mq-primary)]` 
                                  : 'bg-[var(--mq-card)] text-[var(--mq-text-muted)]'
                              }`}>
                                Nível {nivel.nivel}
                              </span>
                              {isAtual && (
                                <span className="text-xs text-[var(--mq-primary)] font-medium">
                                  ← Você está aqui
                                </span>
                              )}
                            </div>
                            <h4 className={`text-base font-bold ${
                              isAtual ? 'text-[var(--mq-text)]' : 'text-[var(--mq-text-muted)]'
                            }`}>
                              {nivel.nome}
                            </h4>
                            <p className={`text-xs mt-1 ${
                              isAtual ? 'text-[var(--mq-text-muted)]' : 'text-[var(--mq-text-subtle)]'
                            }`}>
                              {nivel.descricao}
                            </p>
                            
                            {/* Pontos necessários */}
                            <div className="flex items-center gap-2 mt-2 text-xs text-[var(--mq-text-subtle)]">
                              <span>{nivel.xp_minimo.toLocaleString('pt-BR')} pts</span>
                              {nivel.xp_proximo_nivel && (
                                <>
                                  <span>→</span>
                                  <span>{nivel.xp_proximo_nivel.toLocaleString('pt-BR')} pts</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer motivacional */}
        {!loading && estagios.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center py-8"
          >
            <p className="text-sm text-[var(--mq-text-muted)]">
              Continue sua jornada de transformação 🚀
            </p>
          </motion.div>
        )}
      </main>

      <BottomNavV1_3
        active={activeTab}
        onHome={handleNavHome}
        onPerfil={handleNavPerfil}
        onQuests={handleNavQuests}
        onConfig={handleNavConfig}
      />
    </div>
  );
};

export default NiveisJornadaPageV13;
