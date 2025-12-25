import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import { useAuth } from '@/store/useStore';
import { useDashboard } from '@/store/useStore';

const CursorCobrancaPage: React.FC = () => {
  const { dashboardData } = useDashboard();
  const { isAuthenticated } = useAuth();
  const nomeUsuario = isAuthenticated 
    ? (dashboardData?.usuario?.nome_preferencia ?? dashboardData?.usuario?.nome ?? 'Usuário')
    : 'Visitante';

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/app/cursor-usage';
    }
  };

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-24 pt-4">
        <div className="mb-4">
          <button type="button" onClick={handleBack} className="mq-btn-back">
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        <div className="mb-6 text-center">
          <h1 className="mq-page-title flex items-center justify-center gap-2">
            <DollarSign size={24} />
            Como Funciona a Cobrança
          </h1>
          <p className="mq-page-subtitle">Plano Ultra - Modelo de cobrança</p>
        </div>

        <div className="space-y-4">
          {/* Limite do Plano */}
          <motion.div 
            className="mq-card p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-semibold text-[var(--mq-text)] mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" />
              1. Limite do Plano Ultra (Included)
            </h2>
            <ul className="text-sm text-[var(--mq-text-muted)] space-y-2 ml-6">
              <li>• Limite mensal = <strong className="text-[var(--mq-text)]">por TOKENS</strong> (não por requisições)</li>
              <li>• Exemplo: ~3.4M tokens incluídos no período</li>
              <li>• Distribuição aproximada:
                <ul className="ml-4 mt-1 space-y-1">
                  <li>- Auto: ~2.4M tokens</li>
                  <li>- Claude Opus 4.5: ~1.1M tokens</li>
                  <li>- Outros modelos: ~2M tokens cada</li>
                </ul>
              </li>
              <li>• Dentro do limite: <span className="text-green-500 font-medium">já pago na assinatura</span></li>
              <li>• O custo mostrado é referência do valor consumido do plano</li>
            </ul>
          </motion.div>

          {/* Excesso On-Demand */}
          <motion.div 
            className="mq-card p-4 bg-amber-500/10 border-amber-500/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-semibold text-[var(--mq-text)] mb-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              2. Excesso (On-Demand)
            </h2>
            <ul className="text-sm text-[var(--mq-text-muted)] space-y-2 ml-6">
              <li>• Quando excede o limite de <strong className="text-[var(--mq-text)]">TOKENS</strong>: <span className="text-amber-500 font-medium">cobrado extra</span></li>
              <li>• Cobrança = <strong className="text-[var(--mq-text)]">por TOKENS</strong> (input + output tokens)</li>
              <li>• Preço varia por modelo:
                <ul className="ml-4 mt-1 space-y-1">
                  <li>- Claude Opus 4.5: <span className="text-red-500">$0.60-4.50</span> por requisição (muito caro!)</li>
                  <li>- Claude Sonnet 4.5: <span className="text-amber-500">$0.20-0.80</span> por requisição</li>
                  <li>- GPT-5.1: <span className="text-green-500">$0.10-0.30</span> por requisição</li>
                </ul>
              </li>
            </ul>
          </motion.div>

          {/* Exemplo Prático */}
          <motion.div 
            className="mq-card p-4 bg-blue-500/10 border-blue-500/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-semibold text-[var(--mq-text)] mb-3">Exemplo Prático</h2>
            <div className="text-sm text-[var(--mq-text-muted)] space-y-2">
              <div>
                <strong className="text-[var(--mq-text)]">Cenário 1: Dentro do limite</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Sonnet: 1.4M tokens → <span className="text-green-500">$0 (incluso)</span></li>
                  <li>• GPT-5.1: 300K tokens → <span className="text-green-500">$0 (incluso)</span></li>
                  <li>• Opus: 110K tokens → <span className="text-green-500">$0 (incluso)</span></li>
                  <li><strong>Total: $0</strong></li>
                </ul>
              </div>
              <div className="pt-2 border-t border-blue-500/20">
                <strong className="text-[var(--mq-text)]">Cenário 2: Excesso de 500K tokens</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Se exceder com Sonnet: <span className="text-amber-500">~$0.15-0.30</span></li>
                  <li>• Se exceder com Opus: <span className="text-red-500">~$0.60-1.50</span> ⚠️</li>
                  <li><strong>Recomendação:</strong> Prefira exceder com Sonnet/GPT-5.1</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Dica Final */}
          <motion.div 
            className="mq-card p-4 bg-purple-500/10 border-purple-500/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-[var(--mq-text-muted)]">
              <strong className="text-[var(--mq-text)]">Lightbulb Dica:</strong> Monitore o uso de <strong>tokens</strong>, não apenas requisições. 
              On-Demand é cobrado por tokens excedentes. Use o dashboard para acompanhar em tempo real.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CursorCobrancaPage;

