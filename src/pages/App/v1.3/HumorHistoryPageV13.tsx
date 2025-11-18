import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { ArrowLeft } from 'lucide-react';
import HeaderV1_2 from '@/components/app/v1.2/HeaderV1_2';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';

const HumorHistoryPage: React.FC = () => {
  const {
    dashboardData,
    humorHistorico,
    humorHistoricoLoading,
    humorHistoricoError,
    loadHumorHistorico,
    setView
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const [activeTab, setActiveTab] = useState<TabId>('home');

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
      const base = format(new Date(String(dateValue)), 'dd/MM/yyyy');
      if (horaValue) {
        const time = String(horaValue).slice(0, 5);
        return `${base} ${time}`;
      }
      return base;
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

  const chartData = useMemo(() => {
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

        return {
          label: dateLabel,
          humor: humorValue,
          emoji,
          emocao,
          raw: entry,
          timestamp
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [humorHistorico]);

  const detailsData = useMemo(() => {
    if (!humorHistorico?.detalhes || humorHistorico.detalhes.length === 0) {
      return [];
    }

    return humorHistorico.detalhes
      .map((entry, index) => {
        const timestamp = parseDateTime(entry.data, entry.hora);
        const label = formatLabel(entry.data, entry.hora, index + 1);
        const justification = normalizeJustificativa(entry.justificativa);
        const insights = Array.isArray(entry.insights) ? entry.insights : [];

        return {
          key: `${timestamp || index}-${index}`,
          label,
          humor: Number(entry.humor ?? entry.pico_dia ?? entry.humor_medio ?? 0),
          energia: Number(entry.energia ?? entry.energia_media ?? 0),
          emoji: entry.emoji ?? entry.conversa?.emoji ?? null,
          emotion: entry.emocao ?? entry.conversa?.emocao ?? null,
          justification,
          conversationEmoji: entry.conversa?.emoji ?? null,
          conversationEmotion: entry.conversa?.emocao ?? null,
          conversationId: entry.conversa?.id ?? null,
          insights,
          timestamp,
          raw: entry
        };
      })
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [humorHistorico]);

  const handleBack = () => {
    setView('dashboard');
    setActiveTab('home');
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
  };

  return (
    <div className="mq-app-v1_2 flex min-h-screen flex-col bg-[#F5EBF3]">
      <HeaderV1_2 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[0.75rem] font-semibold text-[#1C2541] shadow"
              aria-label="Voltar para o dashboard"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
            <div className="flex-1 text-right text-[0.7rem] font-semibold uppercase tracking-wide text-[#1C2541]">
              Histórico de humor
            </div>
          </div>
        </div>

        <Card className="!p-0 overflow-hidden" hover={false}>
          <div className="flex items-start gap-3 border-b border-white/40 bg-white/80 p-5">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">Histórico de Humor</h2>
              <p className="mt-1 text-sm text-gray-600">
                Seu humor registrado nas últimas conversas.
              </p>
            </div>
          </div>

          <div className="space-y-6 p-5">
            {dashboardData?.mood_gauge && (
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-[#E8F3F5] p-3 text-center text-[#1C2541]">
                  <p className="text-xs font-semibold uppercase">Humor atual</p>
                  <p className="text-lg font-bold">
                    {dashboardData.mood_gauge.nivel_atual.toFixed(1)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#E8F3F5] p-3 text-center text-[#1C2541]">
                  <p className="text-xs font-semibold uppercase">Humor médio</p>
                  <p className="text-lg font-bold">
                    {Number(dashboardData.metricas_periodo?.humor_medio ?? 0).toFixed(1)}
                  </p>
                </div>
                {humorHistorico?.serie && humorHistorico.serie.length > 0 && (
                  <div className="rounded-xl bg-[#E8F3F5] p-3 text-center text-[#1C2541]">
                    <p className="text-xs font-semibold uppercase">Registros</p>
                    <p className="text-lg font-bold">{humorHistorico.serie.length}</p>
                  </div>
                )}
              </div>
            )}

            {humorHistoricoLoading && (
              <div className="text-center text-sm text-gray-500">Carregando histórico…</div>
            )}

            {humorHistoricoError && (
              <div className="text-center text-sm text-red-500">{humorHistoricoError}</div>
            )}

            {!humorHistoricoLoading && !humorHistoricoError && chartData.length === 0 && (
              <div className="text-center text-sm text-gray-500">
                Nenhum registro disponível para este período.
              </div>
            )}

            {!humorHistoricoLoading && !humorHistoricoError && chartData.length > 0 && (
              <div className="space-y-2">
                {humorHistorico?.periodo && (
                  <div className="text-xs text-gray-500">
                    Período: {format(new Date(humorHistorico.periodo.inicio), 'dd/MM/yyyy')} —{' '}
                    {format(new Date(humorHistorico.periodo.fim), 'dd/MM/yyyy')}
                  </div>
                )}
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value: number) => [value.toFixed(1), 'Humor']}
                        labelFormatter={(label, payload = []) => {
                          const data = payload[0]?.payload as (typeof chartData)[number] | undefined;
                          if (!data) return label;
                          return `${label}${data.emoji ? ` ${data.emoji}` : ''}${
                            data.emocao ? ` • ${data.emocao}` : ''
                          }`;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="humor"
                        stroke="#2563EB"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {!humorHistoricoLoading &&
              !humorHistoricoError &&
              detailsData.length > 0 && (
                <div className="space-y-4 border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                    Detalhes por registro
                  </h3>
                  {detailsData.map((detail) => (
                    <div
                      key={detail.key}
                      className="rounded-xl border border-gray-100 bg-white/70 p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {detail.label}
                            {detail.emoji && <span className="ml-2 text-lg">{detail.emoji}</span>}
                          </p>
                          <p className="text-xs text-gray-500">
                            Humor:{' '}
                            <span className="font-semibold text-blue-600">
                              {detail.humor.toFixed(1)}
                            </span>
                          </p>
                        </div>
                      </div>
                      {detail.justification && (
                        <div className="mt-3 border-t border-gray-100 pt-3 text-xs leading-relaxed text-gray-600">
                          <span className="font-semibold text-gray-700">Justificativa:</span> {detail.justification}
                        </div>
                      )}
                      {detail.insights.length > 0 && (
                        <div className="mt-3 space-y-2 text-xs text-gray-600">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                            Insights relacionados
                          </p>
                          {detail.insights.map((insight: unknown, idx: number) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-gray-100 bg-white/80 p-2 leading-relaxed"
                            >
                              {typeof insight === 'string' ? insight : JSON.stringify(insight)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
          </div>
        </Card>
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

export default HumorHistoryPage;
