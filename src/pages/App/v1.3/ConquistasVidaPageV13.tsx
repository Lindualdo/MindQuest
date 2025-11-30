import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Target, Check, Loader2, Calendar, Clock, Star } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

interface Objetivo {
  id: string;
  titulo: string;
  detalhamento: string;
  status: 'ativo' | 'alcancado' | 'expirado' | 'cancelado';
  data_inicio: string;
  data_limite: string;
  alcancado_em: string | null;
  area_nome: string;
  area_icone: string;
  dias_restantes: number | null;
  is_padrao?: boolean;
}

const ConquistasVidaPageV13: React.FC = () => {
  const { dashboardData, setView } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Usuário';

  const userId = dashboardData?.usuario?.id;

  const [activeTab, setActiveTab] = useState<TabId>('ajustes');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [objetivosAtivos, setObjetivosAtivos] = useState<Objetivo[]>([]);
  const [objetivosAlcancados, setObjetivosAlcancados] = useState<Objetivo[]>([]);
  const [totalAlcancados, setTotalAlcancados] = useState(0);

  const [confirmando, setConfirmando] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!userId) {
        setError('Usuário não identificado');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/conquista-objetivo?user_id=${userId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.error || 'Erro ao carregar dados');
          setLoading(false);
          return;
        }

        setObjetivosAtivos(data.objetivos_ativos || []);
        setObjetivosAlcancados(data.objetivos_alcancados || []);
        setTotalAlcancados(data.total_alcancados || 0);
        setError(null);
      } catch (err) {
        console.error('[ConquistasVida] Erro:', err);
        setError('Erro ao conectar ao serviço');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleBack = () => {
    setView('evoluir');
  };

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

  const handleMarcarAlcancado = async (objetivoId: string) => {
    if (!userId) return;

    setSaving(objetivoId);
    setError(null);

    try {
      const res = await fetch('/api/conquista-objetivo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, objetivo_id: objetivoId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Erro ao marcar objetivo');
        setSaving(null);
        return;
      }

      // Atualizar listas localmente
      const objetivoAlcancado = objetivosAtivos.find((o) => o.id === objetivoId);
      if (objetivoAlcancado) {
        setObjetivosAtivos((prev) => prev.filter((o) => o.id !== objetivoId));
        setObjetivosAlcancados((prev) => [
          { ...objetivoAlcancado, status: 'alcancado', alcancado_em: new Date().toISOString() },
          ...prev,
        ]);
        setTotalAlcancados((prev) => prev + 1);
      }

      setSuccess(objetivoId);
      setConfirmando(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('[ConquistasVida] Erro ao salvar:', err);
      setError('Erro ao conectar ao serviço');
    } finally {
      setSaving(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
        {/* Botão voltar */}
        <div className="mb-4">
          <button type="button" onClick={handleBack} className="mq-btn-back">
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        {/* Título da página */}
        <div className="mb-6 text-center">
          <h1 className="mq-page-title">Conquistas na Vida</h1>
          <p className="mq-page-subtitle">
            {totalAlcancados > 0
              ? `${totalAlcancados} objetivo${totalAlcancados > 1 ? 's' : ''} alcançado${totalAlcancados > 1 ? 's' : ''}`
              : 'Celebre suas vitórias reais'}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--mq-primary)] border-t-transparent" />
          </div>
        )}

        {/* Erro */}
        {error && !loading && (
          <div className="mq-card p-6 text-center border border-red-500/30 bg-red-500/10 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Conteúdo */}
        {!loading && !error && (
          <div className="space-y-6">
            {/* Objetivos Ativos */}
            {objetivosAtivos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Target size={18} className="text-[var(--mq-primary)]" />
                  <h2 className="text-sm font-bold text-[var(--mq-text)]">
                    Objetivos em Andamento
                  </h2>
                </div>

                <div className="space-y-3">
                  {objetivosAtivos.map((objetivo, index) => (
                    <motion.div
                      key={objetivo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="mq-card p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{objetivo.area_icone}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-[var(--mq-text)]">
                            {objetivo.titulo}
                          </h3>
                          <p className="text-xs text-[var(--mq-text-muted)] mt-1">
                            {objetivo.area_nome}
                          </p>
                          {objetivo.detalhamento && (
                            <p className="text-xs text-[var(--mq-text-subtle)] mt-2 line-clamp-2">
                              {objetivo.detalhamento}
                            </p>
                          )}
                          {!objetivo.is_padrao && objetivo.dias_restantes !== null && (
                            <div className="flex items-center gap-3 mt-3 text-xs text-[var(--mq-text-muted)]">
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                Limite: {formatDate(objetivo.data_limite)}
                              </span>
                              <span
                                className={`flex items-center gap-1 ${
                                  objetivo.dias_restantes <= 7
                                    ? 'text-[var(--mq-error)]'
                                    : objetivo.dias_restantes <= 14
                                    ? 'text-[var(--mq-warning)]'
                                    : ''
                                }`}
                              >
                                <Clock size={12} />
                                {objetivo.dias_restantes > 0
                                  ? `${objetivo.dias_restantes} dias`
                                  : 'Vencido'}
                              </span>
                            </div>
                          )}
                          {objetivo.is_padrao && (
                            <div className="mt-3">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--mq-card)] text-[var(--mq-text-subtle)] border border-[var(--mq-border)]">
                                Objetivo Padrão (permanente)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Ações - não mostrar para objetivo padrão */}
                      {!objetivo.is_padrao && (
                      <AnimatePresence mode="wait">
                        {confirmando === objetivo.id ? (
                          <motion.div
                            key="confirm"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-[var(--mq-border)]"
                          >
                            <p className="text-sm text-center text-[var(--mq-text)] mb-3">
                              🎉 Confirma que alcançou este objetivo?
                            </p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setConfirmando(null)}
                                className="flex-1 py-2 px-4 rounded-xl text-sm font-medium border border-[var(--mq-border)] text-[var(--mq-text-muted)] hover:bg-[var(--mq-surface)]"
                              >
                                Cancelar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMarcarAlcancado(objetivo.id)}
                                disabled={saving === objetivo.id}
                                className="flex-1 py-2 px-4 rounded-xl text-sm font-medium bg-[var(--mq-success)] text-white flex items-center justify-center gap-2 disabled:opacity-50"
                              >
                                {saving === objetivo.id ? (
                                  <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Salvando...
                                  </>
                                ) : (
                                  <>
                                    <Trophy size={16} />
                                    Sim, conquistei!
                                  </>
                                )}
                              </button>
                            </div>
                          </motion.div>
                        ) : success === objetivo.id ? (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 pt-4 border-t border-green-500/30 text-center"
                          >
                            <p className="text-sm text-green-500 font-medium flex items-center justify-center gap-2">
                              <Trophy size={18} />
                              Parabéns pela conquista!
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="action"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 pt-4 border-t border-[var(--mq-border)]"
                          >
                            <button
                              type="button"
                              onClick={() => setConfirmando(objetivo.id)}
                              className="w-full py-3 rounded-xl text-sm font-medium border-2 border-dashed border-[var(--mq-success)] text-[var(--mq-success)] hover:bg-[var(--mq-success)]/10 flex items-center justify-center gap-2 transition-all"
                            >
                              <Trophy size={18} />
                              Marcar como Conquistado
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Sem objetivos ativos */}
            {objetivosAtivos.length === 0 && objetivosAlcancados.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mq-card p-6 text-center"
              >
                <Target size={48} className="mx-auto mb-4 text-[var(--mq-text-muted)]" />
                <h3 className="text-base font-bold text-[var(--mq-text)] mb-2">
                  Nenhum objetivo definido
                </h3>
                <p className="text-sm text-[var(--mq-text-muted)] mb-4">
                  Defina seus objetivos para acompanhar suas conquistas.
                </p>
                <button
                  type="button"
                  onClick={() => setView('objetivos')}
                  className="mq-btn-primary px-6 py-3 rounded-xl text-sm"
                >
                  Definir Objetivos
                </button>
              </motion.div>
            )}

            {/* Objetivos Alcançados */}
            {objetivosAlcancados.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Trophy size={18} className="text-[var(--mq-warning)]" />
                  <h2 className="text-sm font-bold text-[var(--mq-text)]">
                    Conquistas ({objetivosAlcancados.length})
                  </h2>
                </div>

                <div className="space-y-3">
                  {objetivosAlcancados.map((objetivo, index) => (
                    <motion.div
                      key={objetivo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="mq-card p-4 border border-[var(--mq-warning)]/20 bg-[var(--mq-warning)]/5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <span className="text-2xl">{objetivo.area_icone}</span>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--mq-warning)] flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-[var(--mq-text)]">
                            {objetivo.titulo}
                          </h3>
                          <p className="text-xs text-[var(--mq-text-muted)] mt-1">
                            {objetivo.area_nome}
                          </p>
                          {objetivo.alcancado_em && (
                            <p className="text-xs text-[var(--mq-warning)] mt-2 flex items-center gap-1">
                              <Star size={12} />
                              Conquistado em {formatDate(objetivo.alcancado_em)}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
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

export default ConquistasVidaPageV13;
