import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import Card from '@/components/ui/Card';
import { apiService } from '@/services/apiService';
import type { QuestTipo, QuestAreaVida } from '@/types/emotions';

interface PlanejamentoQuestsPageProps {
  onBack: () => void;
  usuarioId: string;
  onQuestCreated: () => void;
}

type RecorrenciaDias = 3 | 5 | 7 | 10 | 15;

const TIPOS_QUEST: { value: QuestTipo; label: string }[] = [
  { value: 'sabotador', label: 'Sabotador' },
  { value: 'tcc', label: 'TCC' },
  { value: 'reflexao_diaria', label: 'Reflexão Diária' },
  { value: 'personalizada', label: 'Personalizada' },
];

const AREAS_VIDA: QuestAreaVida[] = [
  'Saúde Emocional',
  'Trabalho e Finanças',
  'Relacionamentos e Vida Pessoal',
  'Saúde Física',
];

const RECORRENCIAS: RecorrenciaDias[] = [3, 5, 7, 10, 15];

const PlanejamentoQuestsPage: React.FC<PlanejamentoQuestsPageProps> = ({
  onBack,
  usuarioId,
  onQuestCreated,
}) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipoQuest, setTipoQuest] = useState<QuestTipo>('personalizada');
  const [areaVida, setAreaVida] = useState<QuestAreaVida | ''>('');
  const [recorrencia, setRecorrencia] = useState<RecorrenciaDias | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titulo.trim()) {
      setError('Título é obrigatório');
      return;
    }

    if (!areaVida) {
      setError('Área da vida é obrigatória');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiService.criarQuest(usuarioId, {
        titulo,
        descricao: descricao || undefined,
        tipo: tipoQuest,
        area_vida: areaVida,
        recorrencia_dias: recorrencia || undefined,
      });

      // Após criar, chamar callback
      onQuestCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar quest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col bg-[#F5EBF3]">
      <HeaderV1_3 nomeUsuario="" />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
        {/* Botão voltar */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[0.75rem] font-semibold text-[#1C2541] shadow"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>

        {/* Título da página */}
        <h1 className="mb-6 text-center text-2xl font-bold text-[#1C2541]">
          Planejar Nova Quest
        </h1>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-semibold text-[#1C2541] mb-2">
              Título *
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Praticar Mindfulness"
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#1C2541] placeholder:text-[#94A3B8] focus:border-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="descricao" className="block text-sm font-semibold text-[#1C2541] mb-2">
              Descrição (opcional)
            </label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva sua quest..."
              rows={3}
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#1C2541] placeholder:text-[#94A3B8] focus:border-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 resize-none"
            />
          </div>

          {/* Tipo de Quest */}
          <div>
            <label htmlFor="tipoQuest" className="block text-sm font-semibold text-[#1C2541] mb-2">
              Tipo de Quest
            </label>
            <select
              id="tipoQuest"
              value={tipoQuest}
              onChange={(e) => setTipoQuest(e.target.value as QuestTipo)}
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#1C2541] focus:border-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20"
            >
              {TIPOS_QUEST.map(tipo => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Área da Vida */}
          <div>
            <label htmlFor="areaVida" className="block text-sm font-semibold text-[#1C2541] mb-2">
              Área da Vida *
            </label>
            <select
              id="areaVida"
              value={areaVida}
              onChange={(e) => setAreaVida(e.target.value as QuestAreaVida | '')}
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#1C2541] focus:border-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20"
              required
            >
              <option value="">Selecione uma área</option>
              {AREAS_VIDA.map(area => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Recorrência */}
          <div>
            <label className="block text-sm font-semibold text-[#1C2541] mb-2">
              Recorrência (dias)
            </label>
            <div className="flex flex-wrap gap-2">
              {RECORRENCIAS.map(dias => (
                <button
                  key={dias}
                  type="button"
                  onClick={() => setRecorrencia(recorrencia === dias ? null : dias)}
                  className={`
                    flex-1 min-w-[60px] rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all
                    ${recorrencia === dias
                      ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white'
                      : 'border-[#CBD5E1] bg-white text-[#1C2541] hover:border-[#0EA5E9]'
                    }
                  `}
                >
                  {dias} dias
                </button>
              ))}
            </div>
            {recorrencia && (
              <p className="mt-2 text-xs text-[#64748B]">
                Quest será repetida a cada {recorrencia} dias
              </p>
            )}
          </div>

          {/* Erro */}
          {error && (
            <Card className="!p-3 !bg-red-50 border-red-200" hover={false}>
              <p className="text-sm text-red-600">{error}</p>
            </Card>
          )}

          {/* Botão Salvar */}
          <button
            type="submit"
            disabled={loading || !titulo.trim() || !areaVida}
            className={`
              w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-md transition-all
              ${loading || !titulo.trim() || !areaVida
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#0EA5E9] hover:bg-[#0C8BD6] active:scale-[0.98]'
              }
            `}
          >
            {loading ? 'Salvando...' : 'Salvar Quest'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default PlanejamentoQuestsPage;

