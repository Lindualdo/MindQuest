import React, { useMemo } from 'react';
import {
  ArrowLeft,
  Smile,
  Frown,
  BarChart3,
  Sparkles,
  Target,
  BookOpen,
  Compass,
  Activity
} from 'lucide-react';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';
import type { PlutchikEmotion } from '@/types/emotions';

const emotionTone: Record<string, 'positivo' | 'negativo' | 'neutro'> = {
  alegria: 'positivo',
  confianca: 'positivo',
  surpresa: 'positivo',
  antecipacao: 'positivo',
  tristeza: 'negativo',
  medo: 'negativo',
  raiva: 'negativo',
  aversao: 'negativo'
};

const toneLabel: Record<'positivo' | 'negativo' | 'neutro', { label: string; color: string }> = {
  positivo: { label: 'Direciona para energia positiva', color: 'text-green-600' },
  negativo: { label: 'Sinaliza necessidade de cuidado', color: 'text-rose-600' },
  neutro: { label: 'Mantém equilíbrio', color: 'text-slate-500' }
};

const PanasDetailPage: React.FC = () => {
  const { dashboardData, setView } = useDashboard();
  const { distribuicao_panas, roda_emocoes } = dashboardData ?? {};

  const handleBack = () => setView('dashboard');

  if (!distribuicao_panas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <header className="sticky top-0 z-40 border-b border-white/50 bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
            <button
              onClick={handleBack}
              className="rounded-xl bg-white p-2 shadow transition-all hover:shadow-md"
              aria-label="Voltar para o dashboard"
              type="button"
            >
              <ArrowLeft size={18} className="text-slate-600" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">MindQuest</p>
              <h1 className="text-lg font-semibold text-slate-800">PANAS</h1>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 pt-12">
          <Card hover={false}>
            <p className="text-sm text-gray-600">
              Ainda não há dados do PANAS disponíveis. Volte ao dashboard quando os check-ins forem
              concluídos.
            </p>
          </Card>
        </main>
      </div>
    );
  }

  const chartBlocks = [
    {
      label: 'Afetos positivos',
      value: distribuicao_panas.positivas,
      description: 'Sensações que ampliam energia, criatividade e abertura para novas ações.',
      icon: Smile,
      gradient: 'from-emerald-300 via-emerald-400 to-teal-400',
      bg: 'bg-emerald-50',
      barColor: 'bg-emerald-400',
      barTrack: 'bg-emerald-100'
    },
    {
      label: 'Afetos desafiadores',
      value: distribuicao_panas.negativas,
      description: 'Emoções que pedem acolhimento, pausa ou mudança de estratégia.',
      icon: Frown,
      gradient: 'from-rose-300 via-rose-400 to-rose-500',
      bg: 'bg-rose-50',
      barColor: 'bg-rose-400',
      barTrack: 'bg-rose-100'
    },
    {
      label: 'Estado neutro / calmo',
      value: distribuicao_panas.neutras,
      description: 'Momentos de estabilidade. Ótimos para consolidar hábitos e planejar próximas ações.',
      icon: Activity,
      gradient: 'from-slate-300 via-indigo-400 to-slate-500',
      bg: 'bg-slate-100',
      barColor: 'bg-indigo-400',
      barTrack: 'bg-slate-200'
    }
  ];

  const topEmotions = useMemo(() => {
    if (!roda_emocoes?.length) return [];
    return [...roda_emocoes]
      .sort((a, b) => b.intensidade - a.intensidade)
      .slice(0, 4);
  }, [roda_emocoes]);

  const emotionPanels = useMemo(() => {
    if (!topEmotions.length) return [];
    return topEmotions.map((emotion: PlutchikEmotion) => {
      const tone = emotionTone[emotion.nome.toLowerCase()] ?? 'neutro';
      return {
        ...emotion,
        tone,
        toneLabel: toneLabel[tone]
      };
    });
  }, [topEmotions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-16">
      <header className="sticky top-0 z-40 border-b border-white/50 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
          <button
            onClick={handleBack}
            className="rounded-xl bg-white p-2 shadow transition-all hover:shadow-md"
            aria-label="Voltar para o dashboard"
            type="button"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">MindQuest | Guia rápido</p>
            <h1 className="text-lg font-semibold text-slate-800">PANAS – Panorama emocional em contexto</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-5 px-4 pt-6">
        <Card hover={false} className="!cursor-default !p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-sky-500/10 px-6 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                  Positive and Negative Affect Schedule
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-800">
                  Por que o MindQuest usa o PANAS?
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                  O PANAS é um inventário científico que organiza emoções em dois polos: afetos
                  positivos e afetos negativos. Ele ajuda a entender rapidamente como o seu estado
                  emocional muda ao longo do tempo e como isso se conecta às decisões que você toma.
                  A versão MindQuest relaciona cada resultado com a Roda das Emoções de Plutchik,
                  para que você saiba quais emoções estão pedindo mais atenção no dia a dia.
                </p>
              </div>
              <div className="rounded-2xl bg-white/70 p-4 shadow-md">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <BarChart3 className="text-indigo-500" size={24} />
                  <span>
                    Atualizado com seus últimos 7 dias de check-ins e conversas orientadas pela IA.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          {chartBlocks.map((block) => (
            <Card
              key={block.label}
              hover={false}
              className="!cursor-default bg-white/80 p-0"
            >
              <div className={`rounded-t-2xl bg-gradient-to-br ${block.gradient} px-5 py-4 text-white drop-shadow-sm`}>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/90">
                  <block.icon size={18} />
                  <span>{block.label}</span>
                </div>
                <p className="mt-2 text-3xl font-bold text-white">{block.value}%</p>
              </div>
              <div className={`space-y-3 px-5 py-4 text-sm text-slate-700 ${block.bg}`}>
                <p className="font-medium text-slate-800">{block.description}</p>
                <div className={`h-2 w-full rounded-full ${block.barTrack}`}>
                  <div
                    className={`h-2 rounded-full transition-all ${block.barColor}`}
                    style={{ width: `${Math.max(Math.min(block.value, 100), 0)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600">
                  Leitura rápida: valores até 33% indicam atenção; acima de 60% apontam tendência
                  dominante nesta semana.
                </p>
              </div>
            </Card>
          ))}
        </section>

        <Card hover={false} className="!cursor-default">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
                <Sparkles size={18} />
                Sintetizando sentimentos em ações
              </div>
              <h3 className="mt-2 text-xl font-semibold text-slate-800">
                Como interpretar cada polo emocional
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                Use a combinação de afetos positivos, desafiadores e neutros para planejar o ritmo da
                semana. Em vez de buscar “apenas emoções boas”, procure equilibrar cuidado e energia.
              </p>
            </div>
            <div className="grid w-full gap-3 text-sm text-slate-600 md:max-w-xs">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
                <p className="font-semibold text-emerald-700">Quando os positivos lideram</p>
                <p className="mt-1 text-xs">
                  Investir em projetos, networking e decisões estratégicas ganha força.
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3">
                <p className="font-semibold text-rose-700">Quando os desafiadores aparecem</p>
                <p className="mt-1 text-xs">
                  Priorize autocuidado, conversas de apoio e pausas conscientes.
                </p>
              </div>
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3">
                <p className="font-semibold text-indigo-700">Quando o neutro equilibra</p>
                <p className="mt-1 text-xs">
                  Excelente momento para revisar hábitos, planejar e organizar rotinas.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card hover={false} className="!cursor-default">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-purple-600">
            <Compass size={18} />
            Conexão com a Roda das Emoções
          </div>
          <p className="mt-2 text-sm text-slate-600">
            A análise do PANAS é alimentada pelas emoções que você relatou (ou que a IA detectou) na
            Roda das Emoções. Abaixo estão as emoções mais frequentes neste ciclo:
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {emotionPanels.length ? (
              emotionPanels.map((emotion) => (
                <div
                  key={emotion.id}
                  className="flex items-start gap-3 rounded-xl border border-white/50 bg-white/80 p-4 shadow-sm"
                >
                  <span
                    className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-lg shadow"
                    style={{ backgroundColor: `${emotion.cor}20`, color: emotion.cor }}
                  >
                    {emotion.emoji}
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-800 capitalize">
                      {emotion.nome}
                    </p>
                    <p className={`text-xs font-medium ${emotion.toneLabel.color}`}>
                      {emotion.toneLabel.label}
                    </p>
                    <p className="text-xs text-slate-500">
                      Intensidade registrada: {emotion.intensidade}%
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 p-4 text-sm text-slate-500">
                Ainda não temos emoções suficientes na Roda para gerar este mapa. Continue registrando
                como se sente ao longo do dia.
              </div>
            )}
          </div>
        </Card>

        <section className="grid gap-4 md:grid-cols-2">
          <Card hover={false} className="!cursor-default">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
              <BookOpen size={18} />
              Exemplos práticos
            </div>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
              <li>
                <span className="font-semibold text-blue-700">Antes de uma reunião importante:</span>{' '}
                revise sua última leitura PANAS. Se afetos positivos estiverem altos, aproveite a
                energia; se estiverem baixos, planeje uma pausa respiratória de 5 minutos.
              </li>
              <li>
                <span className="font-semibold text-blue-700">Quando notar emoções desafiadoras:</span>{' '}
                busque na Roda das Emoções quais sentimentos específicos apareceram (ex.: medo →
                apreensão). Isso direciona ações alinhadas, como pedir apoio ou renegociar prazos.
              </li>
              <li>
                <span className="font-semibold text-blue-700">Para celebrar avanços:</span> combine os
                afetos positivos com conquistas registradas. Isso reforça hábitos que mantêm seu
                progresso constante.
              </li>
            </ul>
          </Card>

          <Card hover={false} className="!cursor-default">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-amber-600">
              <Target size={18} />
              Próximos passos sugeridos
            </div>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
              <li>
                <span className="font-semibold text-amber-700">1. Diário emocional em camadas:</span>{' '}
                registre um ponto positivo, um desafio e o que você aprendeu com ambos.
              </li>
              <li>
                <span className="font-semibold text-amber-700">2. Alinhamento com o corpo:</span>{' '}
                escolha uma rotina rápida (respiração, alongamento, caminhada) quando os afetos
                desafiadores ultrapassarem 40%.
              </li>
              <li>
                <span className="font-semibold text-amber-700">3. Checklist de propósito:</span>{' '}
                ao final da semana, avalie como cada emoção registrou impacto nos pilares da Roda (ex.:
                alegria → conexões; medo → segurança).
              </li>
            </ul>
          </Card>
        </section>

        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-5 py-2 text-sm font-semibold text-indigo-600 shadow-md transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:ring-offset-2"
          >
            <ArrowLeft size={16} />
            Voltar para o dashboard
          </button>
        </div>
      </main>
    </div>
  );
};

export default PanasDetailPage;
