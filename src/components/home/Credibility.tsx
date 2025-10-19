export default function Credibility() {
  return (
    <section aria-labelledby="credibility-title">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 id="credibility-title" className="text-center text-2xl md:text-3xl font-extrabold">
          A inteligência por trás do MindQuest
        </h2>
        <p className="mx-auto mt-2 max-w-3xl text-center text-slate-600">
          Por trás da conversa leve no WhatsApp, existe uma equipe de IAs trabalhando em conjunto.
Cada uma foi treinada em neurociência, comportamento humano e filosofias práticas para transformar emoções em foco e clareza.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {/* Coluna 1 */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>🧠</span>
              <div className="font-bold">Neurociência aplicada</div>
            </div>
            <p className="mt-2 text-slate-600">
              Modelos baseados em atenção, emoção e foco mental deixam as conversas mais objetivas e úteis,
              sem jargões ou complexidade.
            </p>
          </div>

          {/* Coluna 2 */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>⚙️</span>
              <div className="font-bold">Psicologia comportamental</div>
            </div>
            <p className="mt-2 text-slate-600">
              Técnicas consagradas — como <strong>TCC</strong>, <strong>PANAS</strong> e <strong>Big Five</strong> —
              ajudam a identificar padrões, emoções e pontos de atenção do seu dia a dia.
            </p>
          </div>

          {/* Coluna 3 */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>🌿</span>
              <div className="font-bold">Filosofias de vida</div>
            </div>
            <p className="mt-2 text-slate-600">
              Inspiração em métodos práticos como <strong>Roda da Vida</strong>, <strong>Sabotadores</strong> de
              Shirzad Chamine e princípios <strong>estoicos</strong> — para agir com equilíbrio e consistência.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-center">
          <p className="text-indigo-900">
            <strong>Vários assistentes de IA</strong> atuam em conjunto — cada um focado em um desses pilares — para
            gerar insights práticos, perguntas certeiras e pequenas missões que mantêm seu progresso.
          </p>
        </div>
      </div>
    </section>
  );
}