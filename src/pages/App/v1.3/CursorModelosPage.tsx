import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, TrendingUp, Zap, AlertTriangle } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import { useAuth } from '@/store/useStore';
import { useDashboard } from '@/store/useStore';

const CursorModelosPage: React.FC = () => {
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
            <Cpu size={24} />
            Qual Modelo Usar
          </h1>
          <p className="mq-page-subtitle">Melhor uso dos tokens - React/TS + n8n</p>
        </div>

        <div className="space-y-4">
          {/* Estratégia Recomendada */}
          <motion.div 
            className="mq-card p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-semibold text-[var(--mq-text)] mb-3 flex items-center gap-2">
              <TrendingUp size={18} className="text-green-500" />
              Estratégia Recomendada (Plano Ultra)
            </h2>
            <div className="text-sm text-[var(--mq-text-muted)] space-y-2">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-green-500/20 rounded">
                  <div className="font-bold text-green-500">70%</div>
                  <div className="text-xs">Sonnet 4.5</div>
                </div>
                <div className="p-2 bg-blue-500/20 rounded">
                  <div className="font-bold text-blue-500">15%</div>
                  <div className="text-xs">GPT-5.1</div>
                </div>
                <div className="p-2 bg-amber-500/20 rounded">
                  <div className="font-bold text-amber-500">10%</div>
                  <div className="text-xs">Opus 4.5</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Claude Sonnet 4.5 */}
          <motion.div 
            className="mq-card p-4 border-l-4 border-green-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-[var(--mq-text)] flex items-center gap-2">
                  Claude Sonnet 4.5 ⭐⭐⭐⭐⭐
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-500">
                    RECOMENDADO
                  </span>
                </h3>
                <p className="text-xs text-[var(--mq-text-muted)]">Melhor custo-benefício</p>
              </div>
            </div>
            <div className="text-sm text-[var(--mq-text-muted)] space-y-1 mt-2">
              <p><strong className="text-[var(--mq-text)]">Quando usar:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• Componentes React (70% das tarefas)</li>
                <li>• Lógica TypeScript</li>
                <li>• Workflows n8n</li>
                <li>• Refatorações médias</li>
              </ul>
              <div className="mt-2 pt-2 border-t border-[var(--mq-border)]">
                <p><strong className="text-[var(--mq-text)]">Limite:</strong> ~2M tokens/mês</p>
                <p><strong className="text-[var(--mq-text)]">Custo On-Demand:</strong> $0.20-0.80/req</p>
              </div>
            </div>
          </motion.div>

          {/* GPT-5.1 */}
          <motion.div 
            className="mq-card p-4 border-l-4 border-blue-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-[var(--mq-text)] flex items-center gap-2">
                  GPT-5.1 ⭐⭐⭐⭐
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500">
                    RÁPIDO
                  </span>
                </h3>
                <p className="text-xs text-[var(--mq-text-muted)]">Rápido e barato</p>
              </div>
            </div>
            <div className="text-sm text-[var(--mq-text-muted)] space-y-1 mt-2">
              <p><strong className="text-[var(--mq-text)]">Quando usar:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• Completions simples</li>
                <li>• Edições pontuais</li>
                <li>• Tarefas rápidas</li>
                <li>• Código TypeScript simples</li>
              </ul>
              <div className="mt-2 pt-2 border-t border-[var(--mq-border)]">
                <p><strong className="text-[var(--mq-text)]">Limite:</strong> ~2M tokens/mês</p>
                <p><strong className="text-[var(--mq-text)]">Custo On-Demand:</strong> $0.10-0.30/req</p>
              </div>
            </div>
          </motion.div>

          {/* Claude Opus 4.5 */}
          <motion.div 
            className="mq-card p-4 border-l-4 border-amber-500 bg-amber-500/5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-[var(--mq-text)] flex items-center gap-2">
                  Claude Opus 4.5 ⭐⭐⭐⭐⭐
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
                    USAR COM MODERAÇÃO
                  </span>
                </h3>
                <p className="text-xs text-[var(--mq-text-muted)]">Qualidade excepcional, custo alto</p>
              </div>
            </div>
            <div className="text-sm text-[var(--mq-text-muted)] space-y-1 mt-2">
              <p><strong className="text-[var(--mq-text)]">Quando usar:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• Apenas quando Sonnet não resolve</li>
                <li>• Refatorações arquiteturais grandes</li>
                <li>• Debugging de problemas complexos</li>
                <li>• Análise profunda de código</li>
              </ul>
              <div className="mt-2 pt-2 border-t border-amber-500/20">
                <p><strong className="text-[var(--mq-text)]">Limite:</strong> ~1.1M tokens/mês ⚠️ (menor)</p>
                <p><strong className="text-red-500">Custo On-Demand:</strong> $0.60-4.50/req (muito caro!)</p>
              </div>
            </div>
          </motion.div>

          {/* Evitar */}
          <motion.div 
            className="mq-card p-4 bg-red-500/10 border-red-500/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-semibold text-red-500 flex items-center gap-2 mb-2">
              <AlertTriangle size={18} />
              Evitar
            </h3>
            <ul className="text-sm text-[var(--mq-text-muted)] space-y-1 ml-4">
              <li>• <strong>Auto:</strong> Escolhe modelos aleatoriamente, desperdiça tokens</li>
              <li>• <strong>Grok Code Fast:</strong> Menor qualidade, não vale o custo</li>
              <li>• <strong>Gemini 3 Pro:</strong> Menos eficiente para código TypeScript</li>
            </ul>
          </motion.div>

          {/* Regras de Ouro */}
          <motion.div 
            className="mq-card p-4 bg-purple-500/10 border-purple-500/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="font-semibold text-purple-500 flex items-center gap-2 mb-2">
              <Zap size={18} />
              Regras de Ouro
            </h3>
            <ol className="text-sm text-[var(--mq-text-muted)] space-y-2 ml-4 list-decimal">
              <li><strong className="text-[var(--mq-text)]">Nunca use "Auto"</strong> - desperdiça tokens</li>
              <li><strong className="text-[var(--mq-text)]">Comece sempre com Sonnet 4.5</strong> - resolve 80% das tarefas</li>
              <li><strong className="text-[var(--mq-text)]">Use Opus 4.5 apenas quando:</strong> Sonnet não consegue resolver</li>
              <li><strong className="text-[var(--mq-text)]">Use GPT-5.1 para:</strong> Completions simples e edições pontuais</li>
            </ol>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CursorModelosPage;

