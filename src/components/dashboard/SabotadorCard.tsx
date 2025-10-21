/**
 * ARQUIVO: src/components/dashboard/SabotadorCard.tsx
 * AÇÃO: CRIAR novo componente
 *
 * Card de sabotadores internos conforme especificação v1.1
 * Destaca o padrão principal com insight e contramedida
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb, Target, ShieldCheck, Compass } from 'lucide-react';
import { useDashboard } from '../../store/useStore';
import Card from '../ui/Card';
import { getSabotadorById } from '../../data/sabotadoresCatalogo';

const SabotadorCard: React.FC = () => {
  const { dashboardData, openSabotadorDetail } = useDashboard();
  const principal = dashboardData?.sabotadores?.padrao_principal;
  const catalogInfo = principal?.id ? getSabotadorById(principal.id) : null;

  const impactoChave = catalogInfo?.impacto?.emSi?.[0] ?? catalogInfo?.impacto?.nosOutros?.[0] ?? null;
  const passoSugerido = catalogInfo?.estrategiasAntidoto?.[0] ?? null;

  const highlightCandidates = [
    catalogInfo?.descricao
      ? {
          key: 'descricao',
          title: 'Descrição essencial',
          text: catalogInfo.descricao,
          Icon: Lightbulb,
          iconColor: 'text-amber-500'
        }
      : null,
    catalogInfo?.funcaoOriginal
      ? {
          key: 'funcao',
          title: 'Função original',
          text: catalogInfo.funcaoOriginal,
          Icon: Compass,
          iconColor: 'text-blue-500'
        }
      : null,
    impactoChave
      ? {
          key: 'impacto',
          title: 'Impacto imediato',
          text: impactoChave,
          Icon: Target,
          iconColor: 'text-rose-500'
        }
      : null,
    passoSugerido
      ? {
          key: 'passo',
          title: 'Primeiro passo sugerido',
          text: passoSugerido,
          Icon: ShieldCheck,
          iconColor: 'text-emerald-500'
        }
      : null
  ].filter(Boolean) as Array<{
    key: string;
    title: string;
    text: string;
    Icon: typeof Lightbulb;
    iconColor: string;
  }>;

  const highlights = highlightCandidates.slice(0, 3);

  if (!principal) {
    return (
      <Card className="flex h-full items-center justify-center text-sm text-gray-500">
        Dados de sabotadores indisponíveis.
      </Card>
    );
  }

  const handleOpenDetail = () => openSabotadorDetail(principal.id);

  return (
    <Card className="h-full flex flex-col overflow-visible">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-5 h-full"
      >
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Sabotador mais ativo
            </span>
            <div className="mt-2">
              <p className="text-2xl font-bold text-gray-800">
                {principal.nome.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Apelido interno: <span className="font-semibold text-gray-600">{principal.apelido}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          {highlights.length > 0 ? (
            highlights.map(({ key, title, text, Icon, iconColor }) => (
              <div
                key={key}
                className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className={`mt-1 rounded-full bg-gray-50 p-2 ${iconColor}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-xs uppercase font-semibold text-gray-500">
                    {title}
                  </p>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
              Continue conversando para destravar mais insights sobre este sabotador.
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpenDetail}
          className="mt-auto self-center inline-flex w-fit items-center justify-center gap-2 rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200/60 transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:ring-offset-2"
          type="button"
        >
          Saiba mais sobre o sabotador
          <ArrowRight size={16} className="text-white/80" />
        </motion.button>
      </motion.div>
    </Card>
  );
};

export default SabotadorCard;
