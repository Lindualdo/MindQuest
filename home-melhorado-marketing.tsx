import { useEffect } from "react";

/** WhatsApp */
const WHATSAPP_NUMBER = "351928413957";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Oi! Quero começar meu MindQuest (versão gratuita)."
)}`;

export default function Index() {
  useEffect(() => {
    document.title = "MindQuest — Produtividade com conforto mental";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Converse com sua mente pelo WhatsApp e veja seu progresso em um painel interativo. Cadastre-se grátis — só diga seu nome. Clareza emocional em minutos, sem login e sem senha."
      );
    }
  }, []);

  return (
    <main className="min-h-screen">
      <Hero />
      <Benefits />
      <Dashboard />
      <Premium />
      <HowItWorks />
      <Comparison />
      <FAQ />
      <CTA />
    </main>
  );
}

/* ----------------------- HERO ----------------------- */
function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 py-16 grid gap-8 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Produtividade com conforto mental
          </h1>

          <p className="mt-3 text-slate-600 text-lg">
            O <strong>MindQuest</strong> é um assistente de IA que conversa com você pelo
            WhatsApp e transforma suas emoções em clareza, foco e ação no seu
            <em> dashboard</em> pessoal.
          </p>

          <ul className="mt-4 space-y-2 text-slate-700">
            <li>• Cadastre-se grátis — só diga seu nome no WhatsApp.</li>
            <li>• Clareza emocional em minutos, sem formulários ou senhas.</li>
            <li>• Seu painel atualiza automaticamente a cada conversa.</li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={WHATSAPP_URL}
              className="inline-block rounded-xl bg-violet-700 px-5 py-3 font-bold text-white"
            >
              Começar agora no WhatsApp
            </a>
            <a
              href="#como-funciona"
              className="inline-block rounded-xl border border-indigo-200 px-5 py-3 font-semibold text-indigo-900"
            >
              Como funciona
            </a>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Segurança: acesso por <strong>token</strong> renovado a cada sessão e conversas protegidas.
            Sem login e sem senha.
          </p>
        </div>

        {/* Mantém o card/preview do seu layout */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-600">
            Prévia do painel: humor, roda emocional e gamificação.
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- BENEFITS ----------------------- */
function Benefits() {
  const items = [
    {
      title: "Clareza emocional instantânea",
      desc:
        "Converse livremente e veja seus sentimentos traduzidos em métricas visuais que orientam suas próximas ações.",
    },
    {
      title: "Descoberta de padrões",
      desc:
        "Identifique sabotadores, gatilhos e tendências ao longo dos dias para tomar decisões com mais confiança.",
    },
    {
      title: "Plano em movimento",
      desc:
        "Receba pequenas missões personalizadas para manter o foco e avançar com consistência.",
    },
  ];

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-extrabold">
          Um painel que transforma emoção em estratégia
        </h2>
        <p className="mt-2 text-slate-600">
          Cada conversa alimenta seu dashboard com evolução, conquistas e próximos passos — tudo em um só lugar.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="font-bold">{it.title}</div>
              <p className="mt-1 text-slate-600">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------- DASHBOARD PREVIEW ----------------------- */
function Dashboard() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-extrabold">Seu painel de progresso</h2>
        <p className="mt-2 text-slate-600">
          Humor, energia, roda emocional, sabotador ativo, gamificação, histórico e insights — tudo organizado para
          decisões mais claras.
        </p>

        <div className="mt-5 h-56 w-full rounded-2xl border border-dashed border-slate-300 grid place-items-center text-slate-500">
          Prévia do Dashboard
        </div>
      </div>
    </section>
  );
}

/* ----------------------- PREMIUM ----------------------- */
function Premium() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-extrabold">MindQuest Premium</h2>
        <p className="mt-2 text-slate-600">
          Para quem quer ritmo, foco e conversas ativas com a IA.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <ul className="space-y-2 text-slate-700">
              <li>• Conversas em tempo real com o assistente de IA</li>
              <li>• Histórico completo e linha do tempo interativa</li>
              <li>• Jornadas personalizadas e automação de lembretes</li>
              <li>• Recomendações acionáveis aprofundadas</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-slate-600">Conteúdo visual do bloco Premium (inalterado).</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- HOW IT WORKS ----------------------- */
function HowItWorks() {
  const steps = [
    {
      n: 1,
      t: "Diga o que está acontecendo",
      d: "Envie uma mensagem no WhatsApp. Não há formulário: só o seu nome para começar.",
    },
    { n: 2, t: "Receba perguntas poderosas", d: "A IA conduz uma reflexão leve e objetiva." },
    { n: 3, t: "Valide seu insight", d: "Ajuste o que for necessário para refletir sua visão." },
    { n: 4, t: "Veja o painel atualizar", d: "Seu dashboard registra métricas e recomendações automaticamente." },
  ];

  return (
    <section id="como-funciona">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-extrabold">Como funciona</h2>
        <div className="mt-6 grid gap-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="grid grid-cols-[40px_1fr] items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-indigo-100 font-extrabold text-indigo-900">
                {s.n}
              </div>
              <div>
                <div className="font-bold">{s.t}</div>
                <div className="text-slate-600">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------- COMPARISON ----------------------- */
function Comparison() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-extrabold">Compare planos</h2>
        <p className="mt-2 text-slate-600">Comece grátis e evolua no seu ritmo.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-baseline justify-between">
              <div className="text-lg font-extrabold">Free</div>
              <div className="text-sm text-slate-500">€0</div>
            </div>
            <ul className="mt-3 space-y-2 text-slate-700">
              <li>• Cadastro pelo WhatsApp (apenas nome)</li>
              <li>• Registro das conversas (resumos e transcrições)</li>
              <li>• Visualização de 7 dias no dashboard</li>
              <li>• Notificações básicas</li>
            </ul>
            <a
              href={WHATSAPP_URL}
              className="mt-4 inline-block rounded-xl bg-sky-600 px-5 py-3 font-bold text-white"
            >
              Começar grátis
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-baseline justify-between">
              <div className="text-lg font-extrabold">Premium</div>
              <div className="text-sm text-slate-500">Em breve</div>
            </div>
            <ul className="mt-3 space-y-2 text-slate-700">
              <li>• Conversas ativas com a IA (respostas em tempo real)</li>
              <li>• Histórico completo e linha do tempo interativa</li>
              <li>• Jornadas personalizadas e automação de lembretes</li>
              <li>• Recomendações acionáveis aprofundadas</li>
            </ul>
            <a
              href={WHATSAPP_URL}
              className="mt-4 inline-block rounded-xl border border-slate-300 px-5 py-3 font-bold"
            >
              Quero ser avisado
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- FAQ (com respostas preenchidas onde estavam claras) ----------------------- */
type QA = { q: string; a: string };

const faq: QA[] = [
  {
    q: "O que é o MindQuest?",
    a: "Um assistente de IA que conversa com você pelo WhatsApp e atualiza seu dashboard com métricas emocionais e recomendações.",
  },
  {
    q: "Como inicio meu cadastro?",
    a: "Clique em ‘Começar no WhatsApp’, diga seu nome e siga as instruções do assistente.",
  },
  {
    q: "Por que o acesso usa token e não login/senha?",
    a: "Tokens são únicos, expiram automaticamente e são renovados a cada sessão, garantindo segurança com menos fricção.",
  },
  {
    q: "Meus dados estão protegidos?",
    a: "Sim. As conversas e o acesso ao painel são protegidos.",
  },
  {
    q: "Posso usar apenas pelo celular?",
    a: "Sim. O fluxo via WhatsApp e o dashboard responsivo funcionam no smartphone.",
  },

  // Novas perguntas (preenchidas quando já estavam claras no contexto)
  {
    q: "O que acontece depois que eu envio minha primeira mensagem no WhatsApp?",
    a: "O assistente fará perguntas simples para entender seu momento, gerará um resumo com seus principais pontos e atualizará automaticamente seu dashboard. Ao final, seu token é renovado.",
  },
  {
    q: "Preciso pagar algo para começar?",
    a: "Não. Você começa na versão Free, com cadastro pelo WhatsApp e acesso ao dashboard com histórico dos últimos 7 dias.",
  },
  {
    q: "E se eu não souber o que dizer na conversa?",
    a: "Tudo bem. Envie um ‘oi’ — o assistente inicia com perguntas curtas e objetivas. Você pode responder por texto ou áudio.",
  },
  {
    q: "O MindQuest é um app, um site ou um assistente virtual?",
    a: "É um assistente de IA que interage via WhatsApp e conta com um dashboard web/app para acompanhar seu progresso.",
  },
  {
    q: "Como o dashboard é atualizado?",
    a: "Automaticamente ao final de cada conversa. As métricas, insights e recomendações aparecem no painel sem você precisar fazer nada.",
  },
  {
    q: "O que ganho ao usar o MindQuest diariamente?",
    a: "Clareza emocional, foco em ações pequenas e consistentes, acompanhamento visual do humor/energia, insights sobre padrões e missões que mantêm o progresso.",
  },
  {
    q: "Qual a diferença para apps de meditação ou produtividade?",
    a: "Em vez de listas de tarefas ou meditações genéricas, o MindQuest converte sua conversa em dados emocionais e recomendações personalizadas. Não é terapia; é um sistema de auto-gestão com conforto mental.",
  },
  {
    q: "Posso pausar meu progresso e continuar depois?",
    a: "Sim. Você pode retomar a qualquer momento. Seus registros anteriores permanecem disponíveis no dashboard.",
  },
  {
    q: "Como o sistema garante uso ético das minhas respostas?",
    a: "As respostas servem para personalizar sua experiência e gerar métricas no painel. O acesso é controlado por token e você decide quando interagir.",
  },
  {
    q: "Posso usar o MindQuest para desempenho no trabalho ou em relacionamentos?",
    a: "Sim. O assistente adapta as recomendações ao seu contexto — como foco no trabalho, decisões pessoais e hábitos que sustentam seus objetivos.",
  },
];

function FAQ() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-extrabold">FAQ Oficial</h2>
        <div className="mt-4 grid gap-3">
          {faq.map(({ q, a }, i) => (
            <details key={i} className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-bold">{q}</summary>
              <div className="mt-2 text-slate-700">
                {a ? a : <em className="opacity-75">(Resposta em breve)</em>}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------- CTA ----------------------- */
function CTA() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold">
          Pronto para sentir a diferença na primeira semana?
        </h2>
        <p className="mt-2 text-slate-600">
          Cadastre-se no WhatsApp, descubra seu primeiro insight em minutos e veja seu painel ganhar vida.
        </p>
        <a
          href={WHATSAPP_URL}
          className="mt-5 inline-block rounded-xl bg-violet-700 px-6 py-3 font-bold text-white"
        >
          Começar agora no WhatsApp
        </a>
        <div className="mt-2 text-xs text-slate-500">
          Acesso por token renovado a cada sessão. Sem login e sem senha.
        </div>
      </div>
    </section>
  );
}
