import React from 'react';

const ROWS = [
  {
    feature: 'Conversas com a IA',
    free: 'Resumos automáticos das conversas registradas',
    premium: 'Diálogo ativo em tempo real (5 sessões por dia)',
  },
  {
    feature: 'Histórico de dados',
    free: 'Últimos 7 dias com métricas essenciais',
    premium: 'Linha do tempo completa e comparativos avançados',
  },
  {
    feature: 'Ações e missões',
    free: 'Missões sugeridas a partir dos insights principais',
    premium: 'Playbooks personalizados com acompanhamento humano',
  },
  {
    feature: 'Suporte',
    free: 'FAQ inteligente e recomendações automáticas',
    premium: 'Time MindQuest disponível para suporte estratégico',
  },
];

const Comparison: React.FC = () => (
  <section className="bg-white py-24">
    <div className="mx-auto max-w-5xl px-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Free x Premium</h2>
        <p className="mt-4 text-base text-slate-500">
          Escolha o ritmo. O MindQuest se adapta ao momento da sua jornada.
        </p>
      </div>
      <div className="mt-12 overflow-hidden rounded-3xl border border-slate-100 shadow-lg">
        <table className="w-full table-fixed text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-6 py-4">Recursos</th>
              <th className="px-6 py-4 text-center">Free</th>
              <th className="px-6 py-4 text-center">Premium</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, index) => (
              <tr
                key={row.feature}
                className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
              >
                <td className="px-6 py-4 font-semibold text-slate-900">{row.feature}</td>
                <td className="px-6 py-4 text-center">{row.free}</td>
                <td className="px-6 py-4 text-center text-indigo-600 font-medium">{row.premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default Comparison;
