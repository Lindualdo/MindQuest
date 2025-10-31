import React, { useMemo } from 'react';
import { ArrowLeft, Award, Calendar, Layers, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';

const ConquistasPage: React.FC = () => {
  const { dashboardData, setView } = useDashboard();
  const { gamificacao } = dashboardData;

  const conquistasOrdenadas = useMemo(() => {
    return [...(gamificacao.conquistas_desbloqueadas || [])]
      .map((conquista) => ({
        ...conquista,
        dataUnix: conquista.desbloqueada_em ? new Date(conquista.desbloqueada_em).getTime() : 0
      }))
      .sort((a, b) => b.dataUnix - a.dataUnix);
  }, [gamificacao.conquistas_desbloqueadas]);

  const xpBonusTotal = conquistasOrdenadas.reduce(
    (total, conquista) => total + conquista.xp_bonus,
    0
  );
  const categoriasUnicas = new Set(conquistasOrdenadas.map((conquista) => conquista.categoria));

  const formatarData = (valor: string) => {
    if (!valor) return 'Data pendente';
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return valor;
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBack = () => {
    setView('dashboard');
  };

  return (
    <div className="mindquest-dashboard min-h-screen pb-10">
      <header className="sticky top-0 z-40 border-b border-white/50 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <button
            onClick={handleBack}
            className="rounded-xl bg-white p-2 shadow transition-all hover:shadow-md"
            aria-label="Voltar para o dashboard"
            type="button"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: '#D90368' }}
            >
              MindQuest
            </p>
            <h1 className="text-lg font-semibold text-slate-800">Conquistas</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-6">
        <Card className="!p-0 overflow-hidden" hover={false}>
          <div className="flex items-start gap-3 border-b border-white/40 bg-white/70 p-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">Conquistas</h2>
              <p className="mt-1 text-sm text-gray-600">
                Acompanhe todas as conquistas liberadas através da sua jornada no MindQuest.
              </p>
            </div>
            <div className="rounded-xl bg-yellow-100 p-3">
              <Award className="text-yellow-700" size={24} />
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/60 bg-white/70 p-4 text-center">
                <p className="text-xs font-semibold uppercase text-gray-500">Conquistas</p>
                <p className="text-xl font-bold text-gray-800">{conquistasOrdenadas.length}</p>
              </div>
              <div className="rounded-xl border border-white/60 bg-white/70 p-4 text-center">
                <p className="text-xs font-semibold uppercase text-gray-500">XP bônus</p>
                <p className="text-xl font-bold text-purple-700">+{xpBonusTotal}</p>
              </div>
              <div className="rounded-xl border border-white/60 bg-white/70 p-4 text-center">
                <p className="text-xs font-semibold uppercase text-gray-500">Categorias</p>
                <p className="text-xl font-bold text-blue-600">{categoriasUnicas.size}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Star className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {gamificacao.titulo_nivel || `Nível ${gamificacao.nivel_atual}`}
                  </p>
                  <p className="text-xs text-gray-600">
                    {gamificacao.xp_total} XP • {gamificacao.streak_conversas_dias} conversas seguidas
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Última atualização:{' '}
                {gamificacao.ultima_atualizacao
                  ? formatarData(gamificacao.ultima_atualizacao)
                  : 'aguardando sincronia'}
              </div>
            </div>

            {conquistasOrdenadas.length === 0 ? (
              <div className="rounded-xl bg-white/70 p-4 text-center text-sm text-gray-600">
                Você ainda não desbloqueou conquistas. Volte ao dashboard para completar quests e
                conversas!
              </div>
            ) : (
              <div className="space-y-3">
                {conquistasOrdenadas.map((conquista, index) => (
                  <motion.div
                    key={conquista.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{conquista.emoji || '🏆'}</div>
                      <div className="flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{conquista.nome}</p>
                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Layers size={12} className="text-purple-500" />
                                {conquista.categoria}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={12} className="text-blue-500" />
                                {formatarData(conquista.desbloqueada_em)}
                              </span>
                            </div>
                          </div>
                          <div className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                            +{conquista.xp_bonus} XP
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ConquistasPage;
