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

  const chartData = useMemo(() => {
    const parseDateTime = (dateValue: any, horaValue: any): number => {
      if (!dateValue) return 0;
      try {
        const dateString = typeof dateValue === 'string' ? dateValue.replace(/"/g, '') : String(dateValue);
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

    const source = humorHistorico?.detalhes && humorHistorico.detalhes.length > 0
      ? humorHistorico.detalhes
      : humorHistorico?.serie || [];

    return source.map((entry, index) => {
      const dateValue = (entry as any).data ?? null;
      const horaValue = (entry as any).hora ?? null;
      const timestamp = parseDateTime(dateValue, horaValue);
      const dateLabel = dateValue
        ? format(new Date(dateValue), 'dd/MM') + (horaValue ? ` ${horaValue.toString().slice(0, 5)}` : '')
        : `#${index + 1}`;
      const humorValue = Number(
        (entry as any).humor ?? (entry as any).pico_dia ?? (entry as any).humor_medio ?? 0
      );
      const energiaValue = Number(
        (entry as any).energia ?? (entry as any).energia_media ?? 0
      );
      const emoji = (entry as any).emoji ?? (entry as any).conversa?.emoji ?? null;
      const emocao = (entry as any).emocao ?? (entry as any).conversa?.emocao ?? null;

      return {
        label: dateLabel,
        humor: humorValue,
        energia: energiaValue,
        emoji,
        emocao,
        raw: entry,
        timestamp
      };
    }).sort((a, b) => a.timestamp - b.timestamp);
  }, [humorHistorico]);

  const infoLabel = `Cada ponto registra uma leitura de humor/energia (geralmente por conversa). Use o gráfico para observar oscilações no período e a lista para ver justificativas e conversas associadas.`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <button
          onClick={() => setView('dashboard')}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600"
        >
          <ArrowLeft size={18} /> Voltar
        </button>

        <Card className="!p-0 overflow-hidden" hover={false}>
          <div className="p-6 border-b border-white/40 flex items-start gap-3">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">Histórico de Humor</h2>
              <p className="text-sm text-gray-600 mt-1">
                Evolução das leituras de humor e energia durante o período selecionado.
              </p>
            </div>
            <div className="relative group">
              <Info className="text-blue-500" size={20} />
              <div className="absolute right-0 mt-2 w-64 p-3 bg-white/95 rounded-lg shadow-lg text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {infoLabel}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {dashboardData?.mood_gauge && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
                <div className="p-3 bg-blue-50 rounded-xl text-center">
                  <p className="text-xs uppercase text-blue-600 font-semibold">Humor atual</p>
                  <p className="text-lg font-bold text-blue-700">{dashboardData.mood_gauge.nivel_atual.toFixed(1)}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl text-center">
                  <p className="text-xs uppercase text-amber-600 font-semibold">Humor médio</p>
                  <p className="text-lg font-bold text-amber-700">
                    {Number(dashboardData.metricas_periodo?.humor_medio ?? 0).toFixed(1)}
                  </p>
                </div>
                {/* Campo 'Primeiro registro' removido */}
                {humorHistorico?.serie && humorHistorico.serie.length > 0 && (
                  <div className="p-3 bg-purple-50 rounded-xl text-center">
                    <p className="text-xs uppercase text-purple-600 font-semibold">Registros</p>
                    <p className="text-lg font-bold text-purple-700">{humorHistorico.serie.length}</p>
                  </div>
                )}
              </div>
            )}
            {humorHistoricoLoading && (
              <div className="text-center text-sm text-gray-500">Carregando histórico…</div>
            )}

            {humorHistoricoError && (
              <div className="text-center text-sm text-red-500">
                {humorHistoricoError}
              </div>
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
                        return `${label}${data.emoji ? ` ${data.emoji}` : ''}${data.emocao ? ` • ${data.emocao}` : ''}`;
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
                Período: {format(new Date(humorHistorico.periodo.inicio), 'dd/MM/yyyy')} — {format(new Date(humorHistorico.periodo.fim), 'dd/MM/yyyy')}
              </div>
            )}

            {!humorHistoricoLoading && !humorHistoricoError && humorHistorico?.detalhes && humorHistorico.detalhes.length > 0 && (
              <div className="space-y-4 border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Detalhes por registro</h3>
                <div className="space-y-4">
                  {humorHistorico.detalhes.map((detalhe, index) => (
                    <div key={`${detalhe.data}-${detalhe.hora ?? index}`} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="text-sm font-medium text-gray-800">
                          {format(new Date(detalhe.data), 'dd/MM/yyyy')}
                          {detalhe.hora ? ` • ${detalhe.hora.slice(0, 5)}` : ''}
                        </div>
                        <div className="text-sm text-gray-600">
                          Humor {detalhe.humor}/10 · Energia {detalhe.energia}/10
                        </div>
                      </div>
                      {detalhe.justificativa && (
                        <p className="text-sm text-gray-700 mb-2">
                          {detalhe.justificativa.replace(/^\"|\"$/g, '')}
                        </p>
                      )}
                      {detalhe.conversa && (
                        <div className="text-xs text-gray-500">
                          Conversa: {detalhe.conversa.emocao || 'não identificada'}
                          {detalhe.conversa.emoji ? ` ${detalhe.conversa.emoji}` : ''}
                          {detalhe.conversa.observacoes ? ` • ${detalhe.conversa.observacoes}` : ''}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HumorHistoryPage;
