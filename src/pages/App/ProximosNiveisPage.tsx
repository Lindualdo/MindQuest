import React, { useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Flag,
  Calendar,
  Trophy
} from 'lucide-react';

import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';
import { gamificacaoLevels } from '@/data/gamificacaoLevels';
import { computeUpcomingLevels } from '@/utils/gamificationView';

const ProximosNiveisPage: React.FC = () => {
  const { dashboardData, setView } = useDashboard();
  const { gamificacao } = dashboardData;

  const currentLevel = gamificacaoLevels.find(
    (level) => level.nivel === gamificacao.nivel_atual
  );

  const upcomingLevels = useMemo(
    () => computeUpcomingLevels(gamificacao),
    [gamificacao]
  );

  const timeline = useMemo(() => {
    type TimelineItem = {
      nivel: number;
      titulo: string;
      status: 'atual' | 'futuro';
    };
    const base: TimelineItem[] = [
      {
        nivel: gamificacao.nivel_atual,
        titulo: currentLevel?.titulo || `Nível ${gamificacao.nivel_atual}`,
        status: 'atual'
      }
    ];
    upcomingLevels.forEach((nivel) => {
      base.push({
        nivel: nivel.nivel,
        titulo: nivel.titulo,
        status: 'futuro'
      });
    });
    return base.slice(0, 6);
  }, [gamificacao.nivel_atual, upcomingLevels, currentLevel]);

  const formatXP = (valor: number) =>
    valor.toLocaleString('pt-BR', { maximumFractionDigits: 0 });

  const formatDescricao = (descricao?: string | null) =>
    descricao ||
    'Continue mantendo consistência e aplicando os insights para desbloquear este nível.';

  const proximasQuests = gamificacao.conquistas_proximas || [];

  return (
    <div className="min-h-screen bg-[#FFE4FA] pb-10">
      <header className="sticky top-0 z-40 border-b border-[#E8F3F5] bg-[#FFE4FA]/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('dashboard')}
              className="rounded-full bg-white px-3 py-2 text-[#1C2541] shadow-sm transition-colors hover:bg-[#E8F3F5]"
              type="button"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <p className="text-sm font-semibold text-[#3083DC] uppercase tracking-wide">
                Projeção de progresso
              </p>
              <h1 className="text-lg font-semibold text-[#1C2541]">
                Próximos níveis
              </h1>
            </div>
          </div>
          <div className="rounded-full bg-[#1C2541] px-4 py-2 text-xs font-semibold text-[#FFE4FA]">
            Atual: {currentLevel?.titulo || `Nível ${gamificacao.nivel_atual}`}
          </div>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-4xl space-y-6 px-4">
        <Card hover={false} className="bg-white/80 shadow-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#1C2541]">
                Pontuação atual
              </p>
              <p className="text-3xl font-bold text-[#3083DC]">
                {formatXP(gamificacao.xp_total)} XP
              </p>
              <p className="mt-1 text-sm text-[#1C2541]/70">
                Falta {formatXP(upcomingLevels[0]?.xp_restante || 0)} XP para o
                próximo salto.
              </p>
            </div>
            <div className="rounded-2xl border border-[#7EBDC2]/40 bg-[#E8F3F5] px-4 py-3 text-sm text-[#1C2541]">
              <p className="font-semibold">Destaques recentes</p>
              <div className="mt-2 space-y-1 text-xs text-[#1C2541]/80">
                <div className="flex items-center gap-2">
                  <Trophy size={12} className="text-[#3083DC]" />
                  Última conquista: {gamificacao.ultima_conquista_id || '—'}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-[#3083DC]" />
                  Atualizado em:{' '}
                  {gamificacao.ultima_atualizacao
                    ? new Date(gamificacao.ultima_atualizacao).toLocaleString(
                        'pt-BR',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }
                      )
                    : 'n/d'}
                </div>
                <div className="flex items-center gap-2">
                  <Flag size={12} className="text-[#7EBDC2]" />
                  Streak atual: {gamificacao.streak_conversas_dias} dia(s)
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card hover={false} className="bg-white/70 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#3083DC]">
            Linha de progressão
          </p>
          <div className="mt-4 flex items-center justify-between overflow-x-auto rounded-2xl border border-[#E8F3F5] bg-[#F8FBFC] px-4 py-5 text-sm text-[#1C2541]">
            {timeline.map((item, index) => (
              <div key={item.nivel} className="flex items-center gap-4">
                <div
                className={`flex h-14 w-14 items-center justify-center rounded-full border-2 ${
                  item.status === 'atual'
                    ? 'border-[#3083DC] bg-[#3083DC]/10 text-[#3083DC]'
                    : 'border-[#7EBDC2] bg-white text-[#1C2541]'
                }`}
                >
                  {item.nivel}
                </div>
                <div className="min-w-[120px]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#1C2541]/60">
                    {item.status === 'atual' ? 'Atual' : 'Futuro'}
                  </p>
                  <p className="text-sm font-medium">{item.titulo}</p>
                </div>
                {index < timeline.length - 1 && (
                  <ArrowRight size={16} className="text-[#7EBDC2]" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {upcomingLevels.length === 0 ? (
          <Card hover={false} className="bg-white/70 text-[#1C2541]/70">
            Não há níveis futuros mapeados ainda. Continue acumulando XP para
            desbloquear novos marcos.
          </Card>
        ) : (
          upcomingLevels.map((nivel, index) => (
            <Card
              key={nivel.nivel}
              hover={false}
              className="bg-white text-[#1C2541] shadow-md"
            >
              <div className="flex flex-col gap-3 border-b border-[#E8F3F5] pb-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#3083DC]">
                    Próximo nível
                  </p>
                  <h2 className="text-lg font-semibold">
                    Nível {nivel.nivel} · {nivel.titulo}
                  </h2>
                </div>
                <div className="rounded-full bg-[#E8F3F5] px-4 py-2 text-xs font-semibold text-[#3083DC]">
                  Falta {formatXP(nivel.xp_restante)} XP
                </div>
              </div>

              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-[#7EBDC2]/40 bg-[#F8FBFC] p-4 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#1C2541]/60">
                    O que muda
                  </p>
                  <p className="mt-2 text-sm text-[#1C2541]/80">
                    {formatDescricao(nivel.descricao)}
                  </p>
                  <div className="mt-3 rounded-xl bg-white px-4 py-3 text-xs text-[#1C2541]/70">
                    <p>
                      Meta: alcançar {formatXP(nivel.xp_minimo)} XP acumulados.
                    </p>
                    <p>
                      Ritmo sugerido: manter streak + completar quests
                      personalizadas.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#3083DC]/20 bg-[#E8F3F5] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#3083DC]">
                    Ações recomendadas
                  </p>
                  {index === 0 ? (
                    proximasQuests.length === 0 ? (
                      <p className="mt-3 text-xs text-[#1C2541]/70">
                        Nenhuma quest personalizada pendente. Aproveite para
                        criar um desafio a partir dos insights.
                      </p>
                    ) : (
                      <ul className="mt-3 space-y-2">
                        {proximasQuests.map((quest) => (
                          <li
                            key={quest.id}
                            className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 text-xs text-[#1C2541]"
                          >
                            <span className="font-medium">{quest.nome}</span>
                            <span className="text-[#3083DC]">
                              +{formatXP(quest.xp_bonus)} XP
                            </span>
                          </li>
                        ))}
                      </ul>
                    )
                  ) : (
                    <div className="mt-3 space-y-2 text-xs text-[#1C2541]/70">
                      <p>
                        Continue acumulando pontos após concluir o nível atual.
                      </p>
                      <p>
                        As ações recomendadas serão liberadas assim que o nível
                        anterior for concluído.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </main>
    </div>
  );
};

export default ProximosNiveisPage;
