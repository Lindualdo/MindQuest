import React, { useMemo } from 'react';
import { ArrowLeft, Award, Calendar, Layers, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import { useDashboard } from '../store/useStore';

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

  const xpBonusTotal = conquistasOrdenadas.reduce((total, conquista) => total + conquista.xp_bonus, 0);
  const categoriasUnicas = new Set(conquistasOrdenadas.map((conquista) => conquista.categoria));

  const formatarData = (valor: string) => {
    if (!valor) return 'Data pendente';
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return valor;
    return data.toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <button
          onClick={() => setView('dashboard')}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600"
          type="button"
        >
          <ArrowLeft size={18} /> Voltar
        </button>

        <Card className="!p-0 overflow-hidden" hover={false}>
          <div className="p-6 border-b border-white/40 flex items-start gap-3">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">Conquistas</h2>
              <p className="text-sm text-gray-600 mt-1">
                Acompanhe todas as conquistas liberadas através da sua jornada no MindQuest.
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Award className="text-yellow-700" size={24} />
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-white/70 rounded-xl border border-white/60 text-center">
                <p className="text-xs uppercase text-gray-500 font-semibold">Conquistas</p>
                <p className="text-xl font-bold text-gray-800">{conquistasOrdenadas.length}</p>
              </div>
              <div className="p-4 bg-white/70 rounded-xl border border-white/60 text-center">
                <p className="text-xs uppercase text-gray-500 font-semibold">XP bônus</p>
                <p className="text-xl font-bold text-purple-700">+{xpBonusTotal}</p>
              </div>
              <div className="p-4 bg-white/70 rounded-xl border border-white/60 text-center">
                <p className="text-xs uppercase text-gray-500 font-semibold">Categorias</p>
                <p className="text-xl font-bold text-blue-600">{categoriasUnicas.size}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                Última atualização: {gamificacao.ultima_atualizacao
                  ? formatarData(gamificacao.ultima_atualizacao)
                  : 'aguardando sincronia'}
              </div>
            </div>

            {conquistasOrdenadas.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600 text-center">
                Você ainda não desbloqueou conquistas. Volte ao dashboard para completar quests e conversas!
              </div>
            ) : (
              <div className="space-y-3">
                {conquistasOrdenadas.map((conquista, index) => (
                  <motion.div
                    key={conquista.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{conquista.emoji || '🏆'}</div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {conquista.nome}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
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
                          <div className="px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-xs font-semibold text-purple-600">
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
      </div>
    </div>
  );
};

export default ConquistasPage;
