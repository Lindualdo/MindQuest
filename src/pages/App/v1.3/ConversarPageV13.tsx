import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CardInsightUltimaConversa from '@/components/app/v1.3/CardInsightUltimaConversa';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import { useDashboard } from '@/store/useStore';
import { mockWeeklyXpSummary, mockInsightCard } from '@/data/mockHomeV1_3';
import { WHATSAPP_URL } from '@/constants/whatsapp';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';

const ConversarPageV13 = () => {
  const {
    dashboardData,
    setView,
    openInsightDetail,
    insightCard,
    insightCardLoading,
    insightCardError,
    loadInsightCard,
    weeklyProgressCard,
    weeklyProgressCardLoading,
    loadWeeklyProgressCard,
    openResumoConversas,
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<TabId>('conversar');

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const userId = dashboardData?.usuario?.id;

  useEffect(() => {
    if (!userId || insightCard || insightCardLoading) return;
    loadInsightCard(userId);
  }, [userId, insightCard, insightCardLoading, loadInsightCard]);

  useEffect(() => {
    if (!userId || weeklyProgressCard || weeklyProgressCardLoading) return;
    loadWeeklyProgressCard(userId);
  }, [userId, weeklyProgressCard, weeklyProgressCardLoading, loadWeeklyProgressCard]);

  const insightCardData = insightCard ?? (!insightCardLoading ? mockInsightCard : null);
  const weeklyData = weeklyProgressCard ?? mockWeeklyXpSummary;

  const handleInsightDetail = (insightId?: string | null) => {
    const resolvedId = insightId ?? insightCard?.insight_id ?? insightCardData?.insight_id;
    if (resolvedId) {
      void openInsightDetail(resolvedId);
    }
  };

  const handleNavConversar = () => {
    setActiveTab('conversar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavEntender = () => {
    setActiveTab('entender');
    setView('dashEmocoes');
  };

  const handleNavAgir = () => {
    setActiveTab('agir');
    setView('painelQuests');
  };

  const handleNavEvoluir = () => {
    setActiveTab('evoluir');
    setView('evoluir');
  };

  const handleConversar = () => {
    window.open(WHATSAPP_URL, '_blank');
  };

  // Dados para o card de conversas da semana
  const hoje = new Date();
  const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 });
  const dias = weeklyData.dias ?? [];

  // Status config para checkboxes de conversas
  const statusConfig: Record<string, { bg: string; border: string; icon: string; color: string }> = {
    respondido: {
      bg: 'var(--mq-primary-light)',
      border: 'var(--mq-primary)',
      icon: '✓',
      color: 'var(--mq-primary)',
    },
    perdido: {
      bg: 'rgba(232,235,244,0.8)',
      border: 'var(--mq-border)',
      icon: '✕',
      color: 'var(--mq-text-muted)',
    },
    pendente: {
      bg: 'var(--mq-warning-light)',
      border: 'var(--mq-warning)',
      icon: '…',
      color: 'var(--mq-warning)',
    },
    default: {
      bg: 'rgba(232,235,244,0.8)',
      border: 'var(--mq-border)',
      icon: '—',
      color: 'var(--mq-text-muted)',
    },
  };

  const getStatusConversa = (dia: typeof dias[0]) => {
    if ((dia.xpConversa ?? 0) > 0) return 'respondido';
    const dataDia = dia.data ? new Date(dia.data + 'T00:00:00') : null;
    if (dataDia && isSameDay(dataDia, hoje)) return 'pendente';
    if (dataDia && isFuture(dataDia)) return 'default';
    return 'perdido';
  };

  // Última conversa
  const ultimaConversa = useMemo(() => {
    // Buscar a conversa mais recente nos dados
    const conversasComXp = dias
      .filter(d => (d.xpConversa ?? 0) > 0)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    
    if (conversasComXp.length > 0) {
      const ultima = conversasComXp[0];
      return {
        data: ultima.data,
        resumo: insightCardData?.texto_exibicao ?? 'Conversa realizada com sucesso.',
      };
    }
    return null;
  }, [dias, insightCardData]);

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        {/* Título da página */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-center"
        >
          <h1 className="mq-page-title">Conversar</h1>
          <p className="mq-page-subtitle">Fale com seu mentor</p>
        </motion.div>

        {/* Card Conversas da Semana */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mq-card rounded-2xl px-4 py-4"
          style={{ borderRadius: 24 }}
        >
          <p className="mq-eyebrow">Conversas da Semana</p>

          {/* Checkboxes dos dias */}
          <div className="mt-3 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => {
              const data = addDays(inicioSemana, i);
              const dataStr = format(data, 'yyyy-MM-dd');
              const dia = dias.find(d => d.data === dataStr);
              const status = dia ? getStatusConversa(dia) : 'default';
              const config = statusConfig[status] ?? statusConfig.default;
              const dataFormatada = format(data, 'dd/MM');
              const labelDia = format(data, 'EEE', { locale: ptBR }).slice(0, 3).toUpperCase();
              const isHoje = isSameDay(data, hoje);

              return (
                <div key={dataStr} className="flex flex-col items-center text-center">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl border-2 text-[0.8rem] font-semibold leading-none"
                    style={{
                      backgroundColor: config.bg,
                      borderColor: config.border,
                      color: config.color,
                      boxShadow: isHoje ? '0 0 0 2px var(--mq-primary-light)' : 'none',
                    }}
                  >
                    {config.icon}
                  </div>
                  <span className="mt-1 text-[0.56rem] font-semibold uppercase tracking-wide text-[var(--mq-text)]">
                    {labelDia}
                  </span>
                  <span className="text-[0.56rem] font-medium text-[var(--mq-text-muted)]">
                    {dataFormatada}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Link histórico */}
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => void openResumoConversas()}
              className="text-[0.65rem] font-medium text-[var(--mq-primary)] hover:underline"
            >
              Histórico completo →
            </button>
          </div>
        </motion.section>

        {/* Card Última Conversa */}
        {ultimaConversa && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mq-card rounded-2xl px-4 py-4"
            style={{ borderRadius: 24 }}
          >
            <p className="mq-eyebrow">Última Conversa</p>
            <p className="mt-2 text-[0.75rem] text-[var(--mq-text-muted)] line-clamp-2">
              {ultimaConversa.resumo}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[0.65rem] text-[var(--mq-text-subtle)]">
                {format(new Date(ultimaConversa.data + 'T00:00:00'), "dd 'de' MMMM", { locale: ptBR })}
              </span>
              <button
                type="button"
                onClick={() => void openResumoConversas()}
                className="text-[0.65rem] font-medium text-[var(--mq-primary)] hover:underline"
              >
                Ver resumo →
              </button>
            </div>
          </motion.section>
        )}

        {/* Botão Conversar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <button
            type="button"
            onClick={handleConversar}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[var(--mq-primary)] px-6 py-4 text-white font-bold shadow-lg hover:opacity-90 active:scale-98 transition-all"
            style={{ borderRadius: 24 }}
          >
            <MessageCircle size={22} />
            <span className="text-base">Conversar agora</span>
            <ExternalLink size={16} className="opacity-70" />
          </button>
          <p className="mt-2 text-center text-[0.65rem] text-[var(--mq-text-subtle)]">
            Abre o WhatsApp para conversar com seu mentor
          </p>
        </motion.div>

        {/* Card Insight */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CardInsightUltimaConversa
            data={insightCardData}
            loading={insightCardLoading}
            onSaberMais={(insightId) => handleInsightDetail(insightId)}
            onHistorico={() => {
              setView('insightsHistorico');
            }}
          />
        </motion.div>
        {!insightCardLoading && insightCardError && (
          <p className="text-center text-[0.72rem] font-medium text-rose-600">
            Não conseguimos atualizar o insight agora.
          </p>
        )}
      </main>

      <BottomNavV1_3
        active={activeTab}
        onConversar={handleNavConversar}
        onEntender={handleNavEntender}
        onAgir={handleNavAgir}
        onEvoluir={handleNavEvoluir}
      />
    </div>
  );
};

export default ConversarPageV13;

