import React from 'react';
import {
  Sparkles,
  Compass,
  TrendingUp,
  Users,
  MessageSquareHeart,
  ArrowRight,
  Target,
  Star,
  Layers,
  Brain,
} from 'lucide-react';
import Card from '../components/ui/Card';

const metrics = [
  {
    label: 'Conversas frequentes',
    value: '≥ 30%',
    description: 'Usuários conversando 3+ dias por semana.',
  },
  {
    label: 'Retenção inicial',
    value: '1,5 sessões/dia',
    description: 'Média nos primeiros 7 dias de uso.',
  },
  {
    label: 'Engajamento no dashboard',
    value: '≥ 40%',
    description: 'Acessos ao painel após a primeira conversa.',
  },
  {
    label: 'Retorno após 5 dias',
    value: '≥ 25%',
    description: 'Usuários que mantêm o hábito.',
  },
  {
    label: 'Interesse no Premium',
    value: '≥ 10%',
    description: 'Cliques em “Quero ser avisado”.',
  },
];

const dashboardFeatures = [
  { feature: 'Humor atual', free: 'Incluído', premium: 'Incluído' },
  { feature: 'Roda das emoções (média semanal)', free: 'Incluído', premium: 'Incluído' },
  { feature: 'Sentimentos PANAS (média semanal)', free: 'Incluído', premium: 'Incluído' },
  { feature: 'Sabotadores – o mais ativo', free: 'Incluído', premium: 'Incluído' },
  {
    feature: 'Histórico de humor + gatilhos',
    free: 'Últimos 3 dias',
    premium: 'Completo com filtros',
  },
  {
    feature: 'Histórico de emoções (áreas da vida)',
    free: '—',
    premium: 'Incluído',
  },
  {
    feature: 'Histórico de sabotadores (insights + contramedidas)',
    free: '—',
    premium: 'Incluído',
  },
  {
    feature: 'Gamificação (ações orientadas)',
    free: '1 ação por semana',
    premium: 'Plano completo com IA',
  },
  {
    feature: 'Insights',
    free: 'Visualização simples',
    premium: 'Transformar em planos acionáveis',
  },
  { feature: 'Histórico e resumo de conversas', free: 'Incluído', premium: 'Incluído' },
];

const chatFeatures = [
  {
    feature: 'Conversa diária com a IA pessoal',
    free: '1 conversa/dia (5–8 interações)',
    premium: 'Até 5 conversas/dia',
  },
];

const interactionFeatures = [
  { feature: 'Convite para conversa', free: 'Incluído', premium: 'Incluído' },
  { feature: 'Convite para metas e ações', free: '1 por semana', premium: 'Ilimitado' },
  { feature: 'Resumo da semana', free: 'Incluído', premium: 'Incluído' },
  {
    feature: 'Resumo do mês (ações, metas, evolução, raio X das emoções)',
    free: '—',
    premium: 'Incluído',
  },
];

const mentorFeatures = [
  'Conversas livres a qualquer hora do dia',
  'Orientações práticas e técnicas de crescimento pessoal',
  'Filosofias de vida e hábitos mentais eficientes',
  'Visão 360° da evolução do usuário',
  'Acompanhamento como “versão aprimorada da mente”',
];

const journeySteps = [
  {
    title: 'Conversa (Chat)',
    description: 'A IA colhe emoções, fatos e traça o estado mental atual.',
  },
  {
    title: 'Insight / Estado Atual (Dash)',
    description: 'Dashboard compila humor, sabotadores e emoções prioritárias.',
  },
  {
    title: 'Ação concreta (Interações)',
    description: 'Sugestões de metas e micro-ações alinhadas aos objetivos.',
  },
  {
    title: 'Reengajar (Convite IA)',
    description: 'Lembretes inteligentes para manter o ciclo ativo.',
  },
  {
    title: 'Progresso visualizado',
    description: 'Indicadores atualizados reforçam conquistas e próximos passos.',
  },
];

const mindMapClusters = [
  {
    title: '📊 Dash',
    items: [
      'Humor atual',
      'Roda das emoções (média semanal)',
      'Sentimentos PANAS (média semanal)',
      'Sabotador mais ativo',
      'Histórico de humor com gatilhos',
      'Histórico de emoções (Premium)',
      'Histórico de sabotadores (Premium)',
      'Gamificação orientada',
      'Insights acionáveis (Premium)',
      'Histórico completo de conversas',
      'Resumo das conversas + conversa completa',
    ],
  },
  {
    title: '💬 Chat',
    items: [
      'Reflexão Guiada por IA',
      'Free: 1 conversa por dia',
      'Premium: até 5 conversas/dia',
    ],
  },
  {
    title: '🔄 Interações',
    items: [
      'Lembrete para reflexões guiadas',
      'Definir metas e ações',
      'Resumo semanal inteligente',
      'Resumo mensal completo (Premium)',
      'Motivacional/inspiração',
      'Sabotadores/contramedidas/insigts',
    ],
  },
  {
    title: '🧠 Mentor Virtual',
    items: [
      'Conversa 24h com orientações aprofundadas',
      'Integra filosofias e práticas de crescimento',
      'Acompanha evolução integral do usuário',
      'Funciona como “versão aprimorada” da mente',
    ],
  },
];

const ProductDefinitionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-indigo-950/80 via-slate-900/60 to-purple-950/60">
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        <div className="mx-auto flex min-h-[420px] max-w-6xl flex-col justify-center gap-10 px-6 py-16 md:px-10 lg:px-12">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-600/20 px-4 py-1 text-sm font-medium text-indigo-200 ring-1 ring-indigo-500/40">
              <Sparkles size={16} />
              Produto · MindQuest v1.1
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Uma plataforma de evolução pessoal guiada por IA
            </h1>
            <p className="text-lg text-slate-300">
              Sua mente fala com você todos os dias. O MindQuest transforma ruidos em clareza e ações em resultados 
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <Users className="mb-4 text-indigo-300" size={32} />
              <h3 className="text-xl font-semibold text-white">Público focal</h3>
              <p className="mt-2 text-sm text-slate-300">
                Mulheres (≈80%) e pessoas com projetos travados que buscam clareza, coragem e
                progresso consistente.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <Target className="mb-4 text-indigo-300" size={32} />
              <h3 className="text-xl font-semibold text-white">Proposta única</h3>
              <p className="mt-2 text-sm text-slate-300">
                Sua mente fala todos os dias. O MindQuest te ensina a ouvir, entender e evoluir.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <TrendingUp className="mb-4 text-indigo-300" size={32} />
              <h3 className="text-xl font-semibold text-white">Engajamento real</h3>
              <p className="mt-2 text-sm text-slate-300">
                Ciclo contínuo que integra conversa orientada, dashboards intuitivos e planos de ação
                personalizados.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <MessageSquareHeart className="mb-4 text-indigo-300" size={32} />
              <h3 className="text-xl font-semibold text-white">Experiência premium</h3>
              <p className="mt-2 text-sm text-slate-300">
                Mentor virtual 24h, insights acionáveis e acompanhamento 360° da jornada emocional.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 md:px-10 lg:px-12">
        <section id="metricas">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-semibold text-white">Métricas-chave do MVP</h2>
              <p className="mt-2 text-base text-slate-300">
                Foco em engajamento recorrente, retorno de aprendizados e ativação do plano Premium.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1 text-sm font-medium text-emerald-200 ring-1 ring-emerald-500/50">
              <TrendingUp size={16} />
              Product KPIs
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric) => (
              <Card key={metric.label} hover={false} className="bg-slate-900/80 p-6 shadow-none">
                <p className="text-sm uppercase tracking-widest text-indigo-200/80">
                  {metric.label}
                </p>
                <div className="mt-2 flex items-baseline gap-2 text-white">
                  <span className="text-3xl font-semibold">{metric.value}</span>
                </div>
                <p className="mt-3 text-sm text-slate-300">{metric.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="estrutura">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <h2 className="text-3xl font-semibold text-white">Estrutura do Produto por Interface</h2>
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-200 ring-1 ring-purple-500/40">
              <Layers size={14} />
              Free vs Premium
            </span>
          </div>

          <div className="mt-8 space-y-12">
            <article>
              <header className="flex items-center gap-3 text-lg font-semibold text-white">
                <Compass size={20} className="text-indigo-300" />
                <span>Dashboard de Evolução</span>
              </header>
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
                <table className="min-w-full divide-y divide-white/10 text-sm">
                  <thead className="bg-white/5 text-slate-200">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left font-semibold uppercase tracking-widest">
                        Bloco
                      </th>
                      <th scope="col" className="px-4 py-3 text-left font-semibold uppercase tracking-widest">
                        Free
                      </th>
                      <th scope="col" className="px-4 py-3 text-left font-semibold uppercase tracking-widest">
                        Premium
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {dashboardFeatures.map((row) => (
                      <tr key={row.feature} className="hover:bg-white/5">
                        <td className="px-4 py-3 text-slate-100">{row.feature}</td>
                        <td className="px-4 py-3 text-slate-300">{row.free}</td>
                        <td className="px-4 py-3 text-slate-300">{row.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article>
              <header className="flex items-center gap-3 text-lg font-semibold text-white">
                <MessageSquareHeart size={20} className="text-indigo-300" />
                <span>Chat · Assistente Pessoal</span>
              </header>
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
                <table className="min-w-full divide-y divide-white/10 text-sm">
                  <thead className="bg-white/5 text-slate-200">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left font-semibold uppercase tracking-widest">
                        Recurso
                      </th>
                      <th scope="col" className="px-4 py-3 text-left font-semibold uppercase tracking-widest">
                        Free
                      </th>
                      <th scope="col" className="px-4 py-3 text-left font-semibold uppercase tracking-widest">
                        Premium
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {chatFeatures.map((row) => (
                      <tr key={row.feature} className="hover:bg-white/5">
                        <td className="px-4 py-3 text-slate-100">{row.feature}</td>
                        <td className="px-4 py-3 text-slate-300">{row.free}</td>
                        <td className="px-4 py-3 text-slate-300">{row.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article>
              <header className="flex items-center gap-3 text-lg font-semibold text-white">
                <Sparkles size={20} className="text-indigo-300" />
                <span>Interações Inteligentes</span>
              </header>
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
                <table className="min-w-full divide-y divide-white/10 text-sm">
                  <thead className="bg-white/5 text-slate-200">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left font-semibold uppercase tracking-widest">
                        Recurso
                      </th>
                      <th scope="col" className="px-4 py-3 text-left font-semibold uppercase tracking-widest">
                        Free
                      </th>
                      <th scope="col" className="px-4 py-3 text-left font-semibold uppercase tracking-widest">
                        Premium
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {interactionFeatures.map((row) => (
                      <tr key={row.feature} className="hover:bg-white/5">
                        <td className="px-4 py-3 text-slate-100">{row.feature}</td>
                        <td className="px-4 py-3 text-slate-300">{row.free}</td>
                        <td className="px-4 py-3 text-slate-300">{row.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article>
              <header className="flex items-center gap-3 text-lg font-semibold text-white">
                <Brain size={20} className="text-indigo-300" />
                <span>Mentor Virtual · Premium</span>
              </header>
              <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-300">
                {mentorFeatures.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Star size={16} className="mt-0.5 text-purple-300" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="ciclo" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <h2 className="text-3xl font-semibold text-white">Ciclo de Experiência do Usuário</h2>
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-medium text-rose-200 ring-1 ring-rose-500/40">
              <ArrowRight size={14} />
              Conversa → Insight → Ação
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            {journeySteps.map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/30 text-sm font-semibold text-indigo-100">
                  {index + 1}
                </span>
                <h3 className="text-base font-semibold text-white">{step.title}</h3>
                <p className="text-sm text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="mapa-mental">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <h2 className="text-3xl font-semibold text-white">Mapa Mental das Funcionalidades</h2>
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-3 py-1 text-xs font-medium text-sky-200 ring-1 ring-sky-500/40">
              <Compass size={14} />
              Visão 360°
            </span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {mindMapClusters.map((cluster) => (
              <Card key={cluster.title} hover={false} className="bg-slate-900/70 p-6 text-sm">
                <header className="mb-4 text-base font-semibold text-white">{cluster.title}</header>
                <ul className="space-y-2 text-slate-300">
                  {cluster.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        <section id="estrategia" className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">Estratégia Free x Premium</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card hover={false} className="bg-slate-900/70 p-6 text-sm text-slate-300">
              <header className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <Star className="text-indigo-300" size={18} />
                MindQuest Free
              </header>
              <ul className="space-y-3">
                <li>Entrega valor real em curto prazo com dados e orientações suficientes.</li>
                <li>Permite experimentar todo o fluxo (chat → dash → ações) com limites leves.</li>
                <li>Apresenta gatilhos para curiosidade sobre recursos avançados.</li>
              </ul>
            </Card>
            <Card hover={false} className="bg-slate-900/70 p-6 text-sm text-slate-300">
              <header className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <Sparkles className="text-purple-300" size={18} />
                MindQuest Premium
              </header>
              <ul className="space-y-3">
                <li>Expande profundidade e continuidade: histórico completo, múltiplas conversas.</li>
                <li>Inclui mentor virtual e insights acionáveis orientados pela IA.</li>
                <li>Entrega acompanhamento ativo focado em crescimento pessoal.</li>
              </ul>
            </Card>
          </div>
        </section>

        <section id="cta" className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600/30 via-purple-600/20 to-emerald-500/20 p-8 text-center text-white shadow-xl">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-white">
              <Sparkles size={16} />
              Briefing pronto para o time de Marketing
            </span>
            <h2 className="text-3xl font-semibold">
              Transforme estes pilares em narrativas cativantes
            </h2>
            <p className="text-base text-white/90">
              Use esta página como referência visual e textual para landing pages, campanhas,
              apresentações e materiais promocionais do MindQuest v1.1.
            </p>
            <a
              href="mailto:marketing@mindquest.com?subject=Briefing%20MindQuest%20v1.1"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Enviar para o time de marketing
              <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDefinitionPage;
