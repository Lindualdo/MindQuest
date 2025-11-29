import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

// Dados mockados
const mockObjetivos = [
  { id: '1', titulo: 'Melhorar comunicação no trabalho', area: 'Carreira' },
  { id: '2', titulo: 'Reduzir ansiedade e estresse', area: 'Saúde' },
];

const CheckinSemanalPageV13: React.FC = () => {
  const {
    dashboardData,
    setView,
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Usuário';

  const [activeTab, setActiveTab] = useState<TabId>('ajustes');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progresso, setProgresso] = useState<Record<string, number>>({
    '1': 3,
    '2': 4,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleBack = () => {
    setView('jornada');
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
    setView('jornada');
  };

  const handleSave = async () => {
    setSaving(true);
    // Simular salvamento
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => {
        handleBack();
      }, 2000);
    }, 1000);
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

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
        {/* Botão voltar */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="mq-btn-back"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        {/* Título da página */}
        <div className="mb-6 text-center">
          <h1 className="mq-page-title">Check-in Semanal</h1>
          <p className="mq-page-subtitle">Como está seu progresso real?</p>
        </div>

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

        {/* Formulário */}
        <div className="mq-card space-y-6 p-6" style={{ borderRadius: 24 }}>
          <p className="text-sm text-[var(--mq-text-muted)] text-center">
            Avalie seu progresso em cada objetivo nesta semana (1 = muito baixo, 5 = excelente)
          </p>

          {mockObjetivos.map((objetivo, index) => (
            <motion.div
              key={objetivo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <div>
                <h3 className="text-base font-bold text-[var(--mq-text)] mb-1">
                  {objetivo.titulo}
                </h3>
                <p className="text-xs text-[var(--mq-text-muted)]">{objetivo.area}</p>
              </div>

              {/* Escala 1-5 */}
              <div className="flex items-center justify-between gap-2">
                {[1, 2, 3, 4, 5].map((valor) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => setProgresso({ ...progresso, [objetivo.id]: valor })}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                      progresso[objetivo.id] === valor
                        ? 'bg-[var(--mq-primary)] text-white shadow-md scale-105'
                        : 'bg-[var(--mq-card)] text-[var(--mq-text-muted)] hover:bg-[var(--mq-surface)]'
                    }`}
                    style={{
                      backgroundColor: progresso[objetivo.id] === valor ? getProgressColor(progresso[objetivo.id]) : undefined,
                    }}
                  >
                    {valor}
                  </button>
                ))}
              </div>

              {/* Label do progresso */}
              <p className="text-xs text-center font-semibold" style={{ color: getProgressColor(progresso[objetivo.id]) }}>
                {getProgressLabel(progresso[objetivo.id])}
              </p>
            </motion.div>
          ))}

          {/* Botão Salvar */}
          <motion.button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mq-btn-primary w-full rounded-xl px-6 py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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

