import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Loader2, ChevronRight, Check, Target } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

interface Objetivo {
  id: string;
  titulo: string;
  area_nome: string;
  area_icone: string;
  semana_atual: string;
  checkin_feito: boolean;
}

interface CheckinData {
  objetivo_id: string;
  pontuacao: number;
  observacoes: string;
}

const CheckinSemanalPageV13: React.FC = () => {
  const { dashboardData, setView } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Usuário';

  const userId = dashboardData?.usuario?.id;

  const [activeTab, setActiveTab] = useState<TabId>('ajustes');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dados da API
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [semanaAtual, setSemanaAtual] = useState<string>('');

  // Estado do formulário em steps
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [checkinData, setCheckinData] = useState<CheckinData>({
    objetivo_id: '',
    pontuacao: 0,
    observacoes: '',
  });

  // Carregar objetivos ativos
  useEffect(() => {
    const loadData = async () => {
      if (!userId) {
        setError('Usuário não identificado');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/checkin-objetivo?user_id=${userId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.error || 'Erro ao carregar dados');
          setLoading(false);
          return;
        }

        setObjetivos(data.objetivos_ativos || []);
        setSemanaAtual(data.semana_atual || '');
        setError(null);
      } catch (err) {
        console.error('[CheckinSemanal] Erro:', err);
        setError('Erro ao conectar ao serviço');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    } else {
      setView('evoluir');
    }
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

  const handleSelectObjetivo = (objetivoId: string) => {
    setCheckinData({ ...checkinData, objetivo_id: objetivoId });
    setStep(2);
  };

  const handleSelectPontuacao = (pontuacao: number) => {
    setCheckinData({ ...checkinData, pontuacao });
    setStep(3);
  };

  const handleSave = async () => {
    if (!userId || !checkinData.objetivo_id || checkinData.pontuacao === 0) {
      setError('Dados incompletos');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/checkin-objetivo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          objetivo_id: checkinData.objetivo_id,
          pontuacao: checkinData.pontuacao,
          observacoes: checkinData.observacoes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Erro ao salvar check-in');
        setSaving(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        setView('evoluir');
      }, 2000);
    } catch (err) {
      console.error('[CheckinSemanal] Erro ao salvar:', err);
      setError('Erro ao conectar ao serviço');
    } finally {
      setSaving(false);
    }
  };

  const getProgressLabel = (valor: number) => {
    if (valor === 1) return 'Muito baixo';
    if (valor === 2) return 'Baixo';
    if (valor === 3) return 'Médio';
    if (valor === 4) return 'Bom';
    return 'Excelente';
  };

  const getProgressColor = (valor: number) => {
    if (valor <= 2) return 'var(--mq-error)';
    if (valor === 3) return 'var(--mq-warning)';
    return 'var(--mq-success)';
  };

  const selectedObjetivo = objetivos.find((o) => o.id === checkinData.objetivo_id);

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
          <h1 className="mq-page-title">Check-in Semanal</h1>
          <p className="mq-page-subtitle">
            {semanaAtual ? `Semana ${semanaAtual.replace('-W', '/')}` : 'Como está seu progresso?'}
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

        {/* Sem objetivos */}
        {!loading && !error && objetivos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mq-card p-6 text-center"
          >
            <Target size={48} className="mx-auto mb-4 text-[var(--mq-text-muted)]" />
            <h3 className="text-base font-bold text-[var(--mq-text)] mb-2">
              Nenhum objetivo ativo
            </h3>
            <p className="text-sm text-[var(--mq-text-muted)] mb-4">
              Defina seus objetivos para começar a fazer check-ins semanais.
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

        {/* Mensagem de sucesso */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-xl border-2 border-green-400 bg-green-100 p-4 text-sm font-semibold text-green-800 shadow-md"
          >
            ✅ Check-in salvo com sucesso!
          </motion.div>
        )}

        {/* Steps */}
        {!loading && !error && objetivos.length > 0 && !success && (
          <AnimatePresence mode="wait">
            {/* Step 1: Escolher objetivo */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="mq-card p-4">
                  <p className="text-sm text-[var(--mq-text-muted)] text-center mb-4">
                    Passo 1 de 3 — Escolha o objetivo
                  </p>

                  <div className="space-y-3">
                    {objetivos.map((objetivo, index) => (
                      <motion.button
                        key={objetivo.id}
                        type="button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSelectObjetivo(objetivo.id)}
                        className={`w-full p-4 rounded-xl border transition-all flex items-center gap-3 text-left ${
                          objetivo.checkin_feito
                            ? 'border-green-500/30 bg-green-500/10'
                            : 'border-[var(--mq-border)] bg-[var(--mq-card)] hover:border-[var(--mq-primary)]'
                        }`}
                      >
                        <span className="text-2xl">{objetivo.area_icone}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-[var(--mq-text)] truncate">
                            {objetivo.titulo}
                          </h3>
                          <p className="text-xs text-[var(--mq-text-muted)]">
                            {objetivo.area_nome}
                          </p>
                        </div>
                        {objetivo.checkin_feito ? (
                          <Check size={20} className="text-green-500 shrink-0" />
                        ) : (
                          <ChevronRight size={20} className="text-[var(--mq-text-subtle)] shrink-0" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Escolher pontuação */}
            {step === 2 && selectedObjetivo && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="mq-card p-4">
                  <p className="text-sm text-[var(--mq-text-muted)] text-center mb-4">
                    Passo 2 de 3 — Como foi seu progresso?
                  </p>

                  {/* Objetivo selecionado */}
                  <div className="p-4 rounded-xl bg-[var(--mq-surface)] mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{selectedObjetivo.area_icone}</span>
                      <div>
                        <h3 className="text-sm font-bold text-[var(--mq-text)]">
                          {selectedObjetivo.titulo}
                        </h3>
                        <p className="text-xs text-[var(--mq-text-muted)]">
                          {selectedObjetivo.area_nome}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Escala 1-5 */}
                  <p className="text-xs text-center text-[var(--mq-text-muted)] mb-3">
                    1 = Muito baixo • 5 = Excelente
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <button
                        key={valor}
                        type="button"
                        onClick={() => handleSelectPontuacao(valor)}
                        className={`flex-1 py-4 rounded-xl text-lg font-bold transition-all ${
                          checkinData.pontuacao === valor
                            ? 'text-white shadow-md scale-105'
                            : 'bg-[var(--mq-surface)] text-[var(--mq-text-muted)] hover:bg-[var(--mq-card)]'
                        }`}
                        style={{
                          backgroundColor:
                            checkinData.pontuacao === valor ? getProgressColor(valor) : undefined,
                        }}
                      >
                        {valor}
                      </button>
                    ))}
                  </div>

                  {checkinData.pontuacao > 0 && (
                    <p
                      className="text-sm text-center font-semibold mt-3"
                      style={{ color: getProgressColor(checkinData.pontuacao) }}
                    >
                      {getProgressLabel(checkinData.pontuacao)}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Observações */}
            {step === 3 && selectedObjetivo && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="mq-card p-4">
                  <p className="text-sm text-[var(--mq-text-muted)] text-center mb-4">
                    Passo 3 de 3 — Conte mais sobre seu progresso
                  </p>

                  {/* Resumo */}
                  <div className="p-4 rounded-xl bg-[var(--mq-surface)] mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{selectedObjetivo.area_icone}</span>
                        <div>
                          <h3 className="text-sm font-bold text-[var(--mq-text)]">
                            {selectedObjetivo.titulo}
                          </h3>
                          <p className="text-xs text-[var(--mq-text-muted)]">
                            {selectedObjetivo.area_nome}
                          </p>
                        </div>
                      </div>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: getProgressColor(checkinData.pontuacao) }}
                      >
                        {checkinData.pontuacao}
                      </div>
                    </div>
                  </div>

                  {/* Campo de observações */}
                  <label className="block mb-2">
                    <span className="text-sm font-semibold text-[var(--mq-text)]">
                      Observações (opcional)
                    </span>
                  </label>
                  <textarea
                    value={checkinData.observacoes}
                    onChange={(e) =>
                      setCheckinData({ ...checkinData, observacoes: e.target.value })
                    }
                    placeholder="O que aconteceu essa semana? O que funcionou? O que pode melhorar?"
                    rows={4}
                    className="w-full p-4 rounded-xl border border-[var(--mq-border)] bg-[var(--mq-surface)] text-[var(--mq-text)] placeholder:text-[var(--mq-text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--mq-primary)] resize-none"
                  />

                  {/* Botão Salvar */}
                  <motion.button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="mq-btn-primary w-full rounded-xl px-6 py-4 text-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: saving ? 1 : 1.02 }}
                    whileTap={{ scale: saving ? 1 : 0.98 }}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Salvar Check-in
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

export default CheckinSemanalPageV13;
