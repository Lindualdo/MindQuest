import React, { useMemo } from 'react';
import { ArrowLeft, ArrowRight, Award, Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';
import { computeLevelHistory } from '@/utils/gamificationView';
import { gamificacaoLevels } from '@/data/gamificacaoLevels';

const ConquistasPage: React.FC = () => {
  const { dashboardData, setView } = useDashboard();
  const { gamificacao } = dashboardData;

  const levelHistory = useMemo(
    () => computeLevelHistory(gamificacao),
    [gamificacao]
  );

  const conquistasOrdenadas = useMemo(() => {
    return [...(gamificacao.conquistas_desbloqueadas || [])]
      .map((conquista) => ({
        ...conquista,
        dataUnix: conquista.desbloqueada_em
          ? new Date(conquista.desbloqueada_em).getTime()
          : 0
      }))
      .sort((a, b) => b.dataUnix - a.dataUnix);
  }, [gamificacao.conquistas_desbloqueadas]);

  const proximasConquistas = useMemo(() => {
    return [...(gamificacao.conquistas_proximas || [])]
      .sort(
        (a, b) => (b.progresso_percentual ?? 0) - (a.progresso_percentual ?? 0)
      )
      .slice(0, 4);
  }, [gamificacao.conquistas_proximas]);

  const latestConquistas = useMemo(
    () => conquistasOrdenadas.slice(0, 6),
    [conquistasOrdenadas]
  );

  const xpBonusTotal = conquistasOrdenadas.reduce(
    (total, conquista) => total + conquista.xp_bonus,
    0
  );
  const categoriasUnicas = new Set(
    conquistasOrdenadas.map((conquista) => conquista.categoria)
  );

  const currentLevel = gamificacaoLevels.find(
    (level) => level.nivel === gamificacao.nivel_atual
  );

  const formatDate = (value?: string | null) => {
    if (!value) return 'Data pendente';
    const data = new Date(value);
    if (Number.isNaN(data.getTime())) return value;
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatStatus = (valor: string) => {
    if (!valor) return 'Pendente';
    const normalized = valor.replace(/_/g, ' ').toLowerCase();
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const formatXP = (value?: number | null) => {
    if (!value || Number.isNaN(value)) return '0';
    return value.toLocaleString('pt-BR');
  };

  const levelHighlights = useMemo(() => {
    return levelHistory.map((level) => {
      const totalQuests = level.quests.length;
      const totalXp = level.quests.reduce(
        (acc, quest) => acc + (quest.xp_bonus || 0),
        0
      );
      const destaque = level.quests
        .slice()
        .sort((a, b) => {
          const dateA = a.desbloqueada_em
            ? new Date(a.desbloqueada_em).getTime()
            : 0;
          const dateB = b.desbloqueada_em
            ? new Date(b.desbloqueada_em).getTime()
            : 0;
          return dateB - dateA;
        })[0];

      return {
        nivel: level.nivel,
        titulo: level.titulo,
        descricao: level.descricao,
        dataConclusao: level.desbloqueadoEm,
        totalQuests,
        totalXp,
        destaqueNome: destaque?.nome,
        destaqueData: destaque?.desbloqueada_em,
        destaqueXp: destaque?.xp_bonus
      };
    });
  }, [levelHistory]);

  const handleBack = () => {
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FFE4FA] pb-12">
      <header className="sticky top-0 z-40 border-b border-[#E8F3F5] bg-[#FFE4FA]/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
          <button
            onClick={handleBack}
            className="rounded-full bg-white px-3 py-2 text-[#1C2541] shadow-sm transition-colors hover:bg-[#E8F3F5]"
            aria-label="Voltar para o dashboard"
            type="button"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#3083DC]">
              MindQuest
            </p>
            <h1 className="text-lg font-semibold text-[#1C2541]">
              Histórico de conquistas
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-4xl space-y-6 px-4">
        <Card hover={false} className="bg-white/80">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#1C2541]/60">
                Nível atual
              </p>
              <h2 className="text-2xl font-semibold text-[#1C2541]">
                {currentLevel?.titulo || `Nível ${gamificacao.nivel_atual}`}
              </h2>
              <p className="mt-1 text-sm text-[#1C2541]/70">
                {currentLevel?.descricao ||
                  'Siga construindo consistência e completando desafios para subir de nível.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center text-sm text-[#1C2541] sm:grid-cols-4">
              <div className="rounded-xl border border-[#E8F3F5] bg-[#F9FBFC] px-3 py-3">
                <p className="text-xs uppercase tracking-wide text-[#3083DC]">
                  XP total
                </p>
                <p className="text-lg font-semibold text-[#3083DC]">
                  {formatXP(gamificacao.xp_total)}
                </p>
              </div>
              <div className="rounded-xl border border-[#E8F3F5] bg-[#F9FBFC] px-3 py-3">
                <p className="text-xs uppercase tracking-wide text-[#3083DC]">
                  Streak
                </p>
                <p className="text-lg font-semibold text-[#1C2541]">
                  {gamificacao.streak_conversas_dias} dia(s)
                </p>
              </div>
              <div className="rounded-xl border border-[#E8F3F5] bg-[#F9FBFC] px-3 py-3">
                <p className="text-xs uppercase tracking-wide text-[#3083DC]">
                  Conquistas
                </p>
                <p className="text-lg font-semibold text-[#1C2541]">
                  {conquistasOrdenadas.length}
                </p>
              </div>
              <div className="rounded-xl border border-[#E8F3F5] bg-[#F9FBFC] px-3 py-3">
                <p className="text-xs uppercase tracking-wide text-[#3083DC]">
                  Categorias
                </p>
                <p className="text-lg font-semibold text-[#1C2541]">
                  {categoriasUnicas.size}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {proximasConquistas.length > 0 && (
          <Card hover={false} className="bg-[#E8F3F5] text-[#1C2541]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#3083DC]">
                  O que está por vir
                </p>
                <h2 className="text-lg font-semibold text-[#1C2541]">
                  Próximas conquistas
                </h2>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#3083DC]">
                {proximasConquistas.length}{' '}
                {proximasConquistas.length === 1 ? 'desafio' : 'desafios'} em
                andamento
              </span>
            </div>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {proximasConquistas.map((conquista) => (
                <li
                  key={conquista.id}
                  className="rounded-2xl border border-[#3083DC]/20 bg-white px-4 py-3 text-sm shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{conquista.nome}</span>
                    <span className="text-xs font-semibold text-[#3083DC]">
                      +{formatXP(conquista.xp_bonus)} XP
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#1C2541]/60">
                    Status: {formatStatus(conquista.status)}
                  </p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#3083DC]/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#3083DC] to-[#7EBDC2]"
                      style={{
                        width: `${Math.min(
                          conquista.progresso_percentual ?? 0,
                          100
                        )}%`
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card hover={false} className="bg-white/80">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#3083DC]">
                Linha de progressão
              </p>
              <h2 className="text-lg font-semibold text-[#1C2541]">
                Resumo por nível concluído
              </h2>
              <p className="text-sm text-[#1C2541]/70">
                Principais marcos e quanto cada nível contribuiu para o seu XP.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#1C2541]/60">
              {levelHighlights.length}{' '}
              {levelHighlights.length === 1
                ? 'nível concluído'
                : 'níveis concluídos'}
            </span>
          </div>

          {levelHighlights.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-[#7EBDC2]/60 bg-[#F8FBFC] p-6 text-sm text-[#1C2541]/70">
              Ainda não há níveis concluídos. Complete suas primeiras quests
              para montar o histórico.
            </div>
          ) : (
            <div className="relative mt-6 pl-6">
              <div className="absolute left-3 top-1 bottom-1 w-px bg-[#E8F3F5]" />
              <div className="space-y-4">
                {levelHighlights.map((level, index) => (
                  <div
                    key={level.nivel}
                    className="relative rounded-2xl border border-[#E8F3F5] bg-[#F9FBFC] p-4 shadow-sm"
                  >
                    <span className="absolute -left-3 top-5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#3083DC] text-xs font-semibold text-white shadow">
                      {level.nivel}
                    </span>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#3083DC]">
                          {level.titulo}
                        </h3>
                        <p className="text-xs text-[#1C2541]/70 line-clamp-2">
                          {level.descricao}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs text-[#1C2541]/70">
                        {level.dataConclusao
                          ? formatDate(level.dataConclusao)
                          : 'Data n/d'}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-semibold text-[#3083DC]">
                        {level.totalQuests} quest
                        {level.totalQuests === 1 ? '' : 's'}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-semibold text-[#3083DC]">
                        +{formatXP(level.totalXp)} XP
                      </span>
                      {level.destaqueNome && (
                        <span className="inline-flex flex-wrap items-center gap-1 rounded-full bg-white px-3 py-1 text-[#1C2541]/80">
                          <span className="font-semibold text-[#1C2541]">
                            Destaque:
                          </span>
                          <span className="font-medium text-[#3083DC]">
                            {level.destaqueNome}
                          </span>
                          {level.destaqueData && (
                            <span className="text-[10px] text-[#1C2541]/60">
                              {formatDate(level.destaqueData)}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card hover={false} className="bg-white/80">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#3083DC]">
                Linha do tempo
              </p>
              <h2 className="text-lg font-semibold text-[#1C2541]">
                Conquistas em ordem cronológica
              </h2>
              <p className="text-sm text-[#1C2541]/70">
                Cada quest concluída soma energia para os próximos níveis.
              </p>
            </div>
            <span className="rounded-full bg-[#E8F3F5] px-3 py-1 text-xs font-semibold text-[#3083DC]">
              {conquistasOrdenadas.length}{' '}
              {conquistasOrdenadas.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {latestConquistas.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-[#7EBDC2]/60 bg-[#F8FBFC] p-6 text-sm text-[#1C2541]/70">
              Ainda não há conquistas registradas. Complete desafios para ver
              esta linha do tempo ganhar vida.
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#E8F3F5]">
              <table className="min-w-full divide-y divide-[#E8F3F5] text-sm text-[#1C2541]">
                <thead className="bg-[#F9FBFC] text-xs uppercase tracking-wide text-[#3083DC]">
                  <tr>
                    <th className="px-4 py-3 text-left">Conquista</th>
                    <th className="px-4 py-3 text-left">Categoria</th>
                    <th className="px-4 py-3 text-left">Data</th>
                    <th className="px-4 py-3 text-right">XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8F3F5]">
                  {latestConquistas.map((conquista) => (
                    <tr key={conquista.id} className="bg-white/90">
                      <td className="px-4 py-3 font-semibold">
                        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#3083DC]/10 text-[#3083DC]">
                          {conquista.emoji || <Award size={14} />}
                        </span>
                        {conquista.nome}
                      </td>
                      <td className="px-4 py-3 text-xs uppercase text-[#3083DC]">
                        {conquista.categoria}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#1C2541]/70">
                        {formatDate(conquista.desbloqueada_em)}
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-semibold text-[#3083DC]">
                        +{formatXP(conquista.xp_bonus)} XP
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {conquistasOrdenadas.length > latestConquistas.length && (
                <div className="bg-[#F9FBFC] px-4 py-3 text-xs text-[#1C2541]/60">
                  {conquistasOrdenadas.length - latestConquistas.length} outras
                  conquistas ficam disponíveis ao exportar o histórico completo.
                </div>
              )}
            </div>
          )}
        </Card>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setView('proximosNiveis')}
            className="inline-flex items-center gap-2 rounded-full bg-[#3083DC] px-5 py-2 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#2567B5]"
          >
            Ver próximos níveis
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default ConquistasPage;
