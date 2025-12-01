import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { ArrowLeft } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';
import { getHumorDescriptor } from '@/data/humorEnergyCatalog';

type ChartEntry = {
  label: string;
  humor: number;
  emoji: string | null;
  emocao: string | null;
  justification: string;
  conversationEmotion: string | null;
  conversationEmoji: string | null;
  conversationId: string | number | null;
  timestamp: number;
};

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: ChartEntry }>;
};

const HumorHistoryPage: React.FC = () => {
  const {
    dashboardData,
    humorHistorico,
    humorHistoricoLoading,
    humorHistoricoError,
    loadHumorHistorico,
    humorHistoricoReturnView,
    setView,
    openConversaResumo
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const [activeTab, setActiveTab] = useState<TabId>('conversar');
  const [selectedBar, setSelectedBar] = useState<ChartEntry | null>(null);

  const userId = dashboardData?.usuario?.id;

  useEffect(() => {
    if (!userId) return;
    if (!humorHistorico && !humorHistoricoLoading) {
      loadHumorHistorico().catch(() => null);
    }
  }, [userId, humorHistorico, humorHistoricoLoading, loadHumorHistorico]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);


  const parseDateTime = (dateValue: unknown, horaValue: unknown): number => {
    if (!dateValue) return 0;
    try {
      const dateString =
        typeof dateValue === 'string' ? dateValue.replace(/"/g, '') : String(dateValue);
      const timeString = horaValue ? String(horaValue).replace(/"/g, '') : null;
      const isoCandidate = timeString ? `${dateString}T${timeString}` : dateString;
      const parsed = new Date(isoCandidate);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.getTime();
      }
      const fallback = new Date(dateString);
      return Number.isNaN(fallback.getTime()) ? 0 : fallback.getTime();
    } catch (_) {
      return 0;
    }
  };

  const formatLabel = (dateValue: unknown, horaValue: unknown, fallbackIndex: number): string => {
    if (!dateValue) {
      return `Registro ${fallbackIndex}`;
    }
    try {
      return format(new Date(String(dateValue)), 'dd/MM');
    } catch (error) {
      return String(dateValue);
    }
  };

  const normalizeJustificativa = (value: unknown): string => {
    if (typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      try {
        return JSON.parse(trimmed);
      } catch (_) {
        return trimmed.slice(1, -1);
      }
    }
    return trimmed;
  };

  const chartData = useMemo<ChartEntry[]>(() => {
    const source =
      humorHistorico?.detalhes && humorHistorico.detalhes.length > 0
        ? humorHistorico.detalhes
        : humorHistorico?.serie || [];

    return source
      .map((entry, index) => {
        const dateValue = entry.data ?? null;
        const horaValue = 'hora' in entry ? entry.hora ?? null : null;
        const timestamp = parseDateTime(dateValue, horaValue);
        const dateLabel = formatLabel(dateValue, horaValue, index + 1);
        const humorValue = Number(entry.humor ?? entry.pico_dia ?? entry.humor_medio ?? 0);
        const emoji = entry.emoji ?? (entry.conversa ? entry.conversa.emoji : null);
        const emocao = entry.emocao ?? (entry.conversa ? entry.conversa.emocao : null);
        const justification = normalizeJustificativa(entry.justificativa ?? entry.justification ?? '');
        const conversationEmotion = entry.conversa?.emocao ?? entry.conversa?.emotion ?? null;
        const conversationEmoji = entry.conversa?.emoji ?? null;
        const conversationId = entry.conversa?.id ?? entry.conversa?.chat_id ?? entry.chat_id ?? null;

        return {
          label: dateLabel,
          humor: humorValue,
          emoji,
          emocao,
          justification,
          conversationEmotion,
          conversationEmoji,
          conversationId,
          timestamp
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [humorHistorico]);

  const recentSummary = useMemo(() => {
    const recentEntries = chartData.slice(-7);
    const count = recentEntries.length;
    const sum = recentEntries.reduce((acc, entry) => acc + entry.humor, 0);
    const average = count > 0 ? sum / count : null;
    return { count, average };
  }, [chartData]);

  const humorDescriptor = useMemo(() => {
    if (recentSummary.average === null) return null;
    const level = Math.max(1, Math.min(10, Math.round(recentSummary.average)));
    return getHumorDescriptor(level);
  }, [recentSummary]);

  const humorAtualDescriptor = useMemo(() => {
    const nivelAtual = dashboardData?.mood_gauge?.nivel_atual;
    if (typeof nivelAtual !== 'number') return null;
    const level = Math.max(1, Math.min(10, Math.round(nivelAtual)));
    return getHumorDescriptor(level);
  }, [dashboardData?.mood_gauge?.nivel_atual]);

  const handleBarClick = (data: { payload?: ChartEntry }) => {
    if (data?.payload) {
      setSelectedBar(data.payload);
    }
  };

  const renderBarTooltip = ({ active, payload }: TooltipProps) => {
    if (!active || !payload || payload.length === 0) return null;
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-3 py-2 text-xs text-[var(--mq-text)] shadow-lg">
        <p className="font-semibold">{data.label}</p>
        <p className="mt-1 text-[0.7rem] text-[var(--mq-text-muted)]">
          Humor:
          {' '}
          <span className="font-semibold text-[var(--mq-primary)]">{Math.round(data.humor)}</span>
          {data.emocao && ` • ${data.emocao}`}
        </p>
      </div>
    );
  };

  useEffect(() => {
    setSelectedBar(null);
  }, [humorHistorico]);

  const handleBack = () => {
    const returnView = humorHistoricoReturnView ?? 'dashboard';
    if (returnView === 'dashboard') {
      setView('conversar');
      setActiveTab('conversar');
    } else if (returnView === 'dashEmocoes') {
      setView('dashEmocoes');
      setActiveTab('entender');
    } else {
      setView('conversar');
      setActiveTab('conversar');
    }
  };

  const handleNavConversar = () => {
    setActiveTab('conversar');
    setView('conversar');
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

  const handleOpenResumoConversa = (conversaId: string | number) => {
    if (!conversaId) return;
    openConversaResumo(String(conversaId)).catch(() => null);
  };

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBack}
              className="mq-btn-back text-[0.75rem] px-3 py-1"
              aria-label="Voltar para o dashboard"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
            <div className="flex-1 text-right text-[0.7rem] font-semibold uppercase tracking-wide text-[var(--mq-text)]">
              Histórico de humor
            </div>
          </div>
        </div>

        <Card className="!p-0 overflow-hidden mq-card !bg-[var(--mq-surface)]" hover={false}>
          <div className="space-y-4 p-5">
            {/* Título */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--mq-text)]">Histórico de Humor</h2>
              <p className="mt-1 text-sm text-[var(--mq-text-muted)]">
                Seu humor registrado nas últimas conversas.
              </p>
            </div>
            {(dashboardData?.mood_gauge || recentSummary.count > 0) && (
              <div className="grid grid-cols-3 gap-3 text-xs">
                {dashboardData?.mood_gauge && humorAtualDescriptor && (
                  <div className="rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-3 py-2 text-center text-[var(--mq-text-muted)] shadow-sm">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--mq-text-subtle)]">
                      Humor atual
                    </p>
                    <p className="text-sm font-semibold capitalize text-[var(--mq-text)]">
                      {humorAtualDescriptor.titulo}
                    </p>
                  </div>
                )}
                <div className="rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-3 py-2 text-center text-[var(--mq-text-muted)] shadow-sm">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--mq-text-subtle)]">
                    Humor médio
                  </p>
                  <p className="text-sm font-semibold capitalize text-[var(--mq-text)]">
                    {recentSummary.average !== null && humorDescriptor ? humorDescriptor.titulo : '--'}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-3 py-2 text-center text-[var(--mq-text-muted)] shadow-sm">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--mq-text-subtle)]">
                    Conversas
                  </p>
                  <p className="text-sm font-semibold text-[var(--mq-text)]">{recentSummary.count}</p>
                </div>
              </div>
            )}

            {humorHistoricoLoading && (
              <div className="text-center text-sm text-[var(--mq-text-muted)]">Carregando histórico…</div>
            )}

            {humorHistoricoError && (
              <div className="text-center text-sm text-[var(--mq-error)]">{humorHistoricoError}</div>
            )}

            {!humorHistoricoLoading && !humorHistoricoError && chartData.length === 0 && (
              <div className="text-center text-sm text-[var(--mq-text-muted)]">
                Nenhum registro disponível para este período.
              </div>
            )}

            {!humorHistoricoLoading && !humorHistoricoError && chartData.length > 0 && (
              <div className="space-y-4">
                {humorHistorico?.periodo && (
                  <div className="text-xs text-[var(--mq-text-muted)]">
                    Período: {format(new Date(humorHistorico.periodo.inicio), 'dd/MM/yyyy')} —{' '}
                    {format(new Date(humorHistorico.periodo.fim), 'dd/MM/yyyy')}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-card)] p-4 shadow">
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 8, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--mq-border)" />
                          <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--mq-text-muted)' }} />
                          <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: 'var(--mq-text-muted)' }} />
                          <Tooltip content={renderBarTooltip} cursor={{ fill: 'rgba(48,131,220,0.08)' }} />
                          <Bar
                            dataKey="humor"
                            radius={[8, 8, 0, 0]}
                            onClick={handleBarClick}
                            cursor="pointer"
                            maxBarSize={32}
                          >
                            {chartData.map((entry) => (
                              <Cell
                                key={entry.label}
                                fill={selectedBar?.label === entry.label ? 'var(--mq-accent)' : 'var(--mq-primary)'}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-card)] p-4 shadow">
                    {selectedBar ? (
                      <div className="space-y-2 text-xs text-[var(--mq-text-muted)]">
                        <p className="text-sm font-semibold text-[var(--mq-text)]">
                          {selectedBar.label}
                          {selectedBar.emoji && <span className="ml-2 text-lg">{selectedBar.emoji}</span>}
                        </p>
                        <p>
                          Humor:{' '}
                          <span className="font-semibold text-[var(--mq-primary)] capitalize">
                            {getHumorDescriptor(selectedBar.humor).titulo}
                          </span>
                        </p>
                        {selectedBar.justification && (
                          <p className="leading-relaxed">
                            <span className="font-semibold text-[var(--mq-text)]">Justificativa:</span>{' '}
                            {selectedBar.justification}
                          </p>
                        )}
                        {selectedBar.conversationEmotion && (
                          <p>
                            <span className="font-semibold text-[var(--mq-text)]">Emoção predominante:</span>{' '}
                            {selectedBar.conversationEmotion}
                            {selectedBar.conversationEmoji && ` ${selectedBar.conversationEmoji}`}
                          </p>
                        )}
                        {selectedBar.conversationId && (
                          <button
                            type="button"
                            onClick={() => handleOpenResumoConversa(selectedBar.conversationId as string | number)}
                            className="text-[0.7rem] font-semibold text-[var(--mq-primary)] underline-offset-2 hover:underline"
                          >
                            Ver resumo da conversa
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--mq-text-muted)]">
                        Toque em uma barra explorar detalhes.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Detalhes individuais removidos conforme solicitado */}
          </div>
        </Card>
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

export default HumorHistoryPage;
