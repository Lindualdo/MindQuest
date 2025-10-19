import React, { useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { ArrowLeft, Info } from 'lucide-react';
import Card from '../components/ui/Card';
import { useDashboard } from '../store/useStore';

const HumorHistoryPage: React.FC = () => {
  const {
    dashboardData,
    humorHistorico,
    humorHistoricoLoading,
    humorHistoricoError,
    loadHumorHistorico,
    setView
  } = useDashboard();

  const userId = dashboardData?.usuario?.id;

  useEffect(() => {
    if (!userId) return;
    if (!humorHistorico && !humorHistoricoLoading) {
      loadHumorHistorico().catch(() => null);
    }
  }, [userId, humorHistorico, humorHistoricoLoading, loadHumorHistorico]);

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
        const dateValue = (entry as Record<string, unknown>).data ?? null;
        const horaValue = (entry as Record<string, unknown>).hora ?? null;
        const timestamp = parseDateTime(dateValue, horaValue);
        const dateLabel = formatLabel(dateValue, horaValue, index + 1);
        const humorValue = Number(
          (entry as Record<string, unknown>).humor ??
            (entry as Record<string, unknown>).pico_dia ??
            (entry as Record<string, unknown>).humor_medio ??
            0
        );
        const energiaValue = Number(
          (entry as Record<string, unknown>).energia ??
            (entry as Record<string, unknown>).energia_media ??
            0
        );
        const emoji =
          (entry as Record<string, unknown>).emoji ??
          (entry as Record<string, unknown>).conversa?.emoji ??
          null;
        const emocao =
          (entry as Record<string, unknown>).emocao ??
          (entry as Record<string, unknown>).conversa?.emocao ??
          null;

        return {
          label: dateLabel,
          humor: humorValue,
          energia: energiaValue,
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

  const infoLabel =
    'Cada ponto registra uma leitura de humor/energia (geralmente por conversa). Use o gráfico para observar oscilações no período e a lista para ver justificativas e conversas associadas.';

  const handleBack = () => {
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-10">
      <header className="sticky top-0 z-40 border-b border-white/50 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
          <button
            onClick={handleBack}
            className="rounded-xl bg-white p-2 shadow transition-all hover:shadow-md"
            aria-label="Voltar para o dashboard"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">MindQuest</p>
            <h1 className="text-lg font-semibold text-slate-800">Histórico de Humor</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-6">
        <Card className="!p-0 overflow-hidden" hover={false}>
          <div className="flex items-start gap-3 border-b border-white/40 bg-white/80 p-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">Histórico de Humor</h2>
              <p className="mt-1 text-sm text-gray-600">
                Evolução das leituras de humor e energia durante o período selecionado.
              </p>
            </div>
            <div className="relative group">
              <Info className="text-blue-500" size={20} />
              <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white/95 p-3 text-xs text-gray-600 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                {infoLabel}
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6">
            {dashboardData?.mood_gauge && (
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <div className="rounded-xl bg-blue-50 p-3 text-center">
                  <p className="text-xs font-semibold uppercase text-blue-600">Humor atual</p>
                  <p className="text-lg font-bold text-blue-700">
                    {dashboardData.mood_gauge.nivel_atual.toFixed(1)}
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-center">
                  <p className="text-xs font-semibold uppercase text-amber-600">Humor médio</p>
                  <p className="text-lg font-bold text-amber-700">
                    {Number(dashboardData.metricas_periodo?.humor_medio ?? 0).toFixed(1)}
                  </p>
                </div>
                {humorHistorico?.serie && humorHistorico.serie.length > 0 && (
                  <div className="rounded-xl bg-purple-50 p-3 text-center">
                    <p className="text-xs font-semibold uppercase text-purple-600">Registros</p>
                    <p className="text-lg font-bold text-purple-700">{humorHistorico.serie.length}</p>
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
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        if (name === 'humor') return [value.toFixed(1), 'Humor'];
                        if (name === 'energia') return [value.toFixed(1), 'Energia'];
                        return [value, name];
                      }}
                      labelFormatter={(label, payload = []) => {
                        const data = payload[0]?.payload as (typeof chartData)[number] | undefined;
                        if (!data) return label;
                        return `${label}${data.emoji ? ` ${data.emoji}` : ''}${
                          data.emocao ? ` • ${data.emocao}` : ''
                        }`;
                      }}
                    />
                    <Legend formatter={(value) => (value === 'humor' ? 'Humor' : 'Energia')} />
                    <Line
                      type="monotone"
                      dataKey="humor"
                      stroke="#2563EB"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="energia"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {humorHistorico && humorHistorico.periodo && (
              <div className="text-xs text-gray-500">
                Período: {format(new Date(humorHistorico.periodo.inicio), 'dd/MM/yyyy')} —{' '}
                {format(new Date(humorHistorico.periodo.fim), 'dd/MM/yyyy')}
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
                              </span>{' '}
                              • Energia:{' '}
                              <span className="font-semibold text-amber-600">{detail.energia.toFixed(1)}</span>
                            </p>
                          </div>
                          {detail.emotion && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                              Emoção: {detail.emotion}
                            </span>
                          )}
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
    </div>
  );
};

export default HumorHistoryPage;
