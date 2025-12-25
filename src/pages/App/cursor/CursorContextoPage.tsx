import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Target, X, CheckCircle } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import { useAuth } from '@/store/useStore';
import { useDashboard } from '@/store/useStore';

const CursorContextoPage: React.FC = () => {
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
            <FileText size={24} />
            Contexto Eficiente
          </h1>
          <p className="mq-page-subtitle">Sem desperdício de tokens</p>
        </div>

        <div className="space-y-4">
          {/* Princípios */}
          <motion.div 
            className="mq-card p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-semibold text-[var(--mq-text)] mb-3 flex items-center gap-2">
              <Target size={18} className="text-blue-500" />
              Princípios Básicos
            </h2>
            <ul className="text-sm text-[var(--mq-text-muted)] space-y-2 ml-4">
              <li>• <strong className="text-[var(--mq-text)]">Inclua apenas arquivos relevantes</strong> - não adicione tudo</li>
              <li>• <strong className="text-[var(--mq-text)]">Use @ para arquivos específicos</strong> - mais preciso que selecionar tudo</li>
              <li>• <strong className="text-[var(--mq-text)]">Evite Max Mode</strong> - consome muito mais tokens</li>
              <li>• <strong className="text-[var(--mq-text)]">Limpe contexto antigo</strong> - feche chats antigos</li>
            </ul>
          </motion.div>

          {/* O Que Fazer */}
          <motion.div 
            className="mq-card p-4 bg-green-500/10 border-green-500/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-semibold text-[var(--mq-text)] mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" />
              O Que Fazer
            </h2>
            <div className="text-sm text-[var(--mq-text-muted)] space-y-3">
              <div>
                <strong className="text-[var(--mq-text)]">1. Selecione arquivos específicos</strong>
                <p className="ml-4 mt-1">Use @nome-arquivo.tsx ao invés de incluir toda a pasta</p>
              </div>
              <div>
                <strong className="text-[var(--mq-text)]">2. Use @codebase para busca</strong>
                <p className="ml-4 mt-1">Pesquise código antes de incluir arquivos grandes</p>
              </div>
              <div>
                <strong className="text-[var(--mq-text)]">3. Inclua apenas o necessário</strong>
                <p className="ml-4 mt-1">Para refatorar um componente, inclua só ele + dependências diretas</p>
              </div>
              <div>
                <strong className="text-[var(--mq-text)]">4. Feche chats antigos</strong>
                <p className="ml-4 mt-1">Contexto acumulado consome tokens desnecessariamente</p>
              </div>
              <div>
                <strong className="text-[var(--mq-text)]">5. Use Composer para novas tarefas</strong>
                <p className="ml-4 mt-1">Contexto limpo = menos tokens = mais eficiente</p>
              </div>
            </div>
          </motion.div>

          {/* O Que Evitar */}
          <motion.div 
            className="mq-card p-4 bg-red-500/10 border-red-500/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-semibold text-[var(--mq-text)] mb-3 flex items-center gap-2">
              <X size={18} className="text-red-500" />
              O Que Evitar
            </h2>
            <div className="text-sm text-[var(--mq-text-muted)] space-y-3">
              <div>
                <strong className="text-[var(--mq-text)]">1. Não use Max Mode desnecessariamente</strong>
                <p className="ml-4 mt-1">Expande contexto para o máximo - só use quando realmente necessário</p>
              </div>
              <div>
                <strong className="text-[var(--mq-text)]">2. Não inclua node_modules ou .git</strong>
                <p className="ml-4 mt-1">Arquivos de dependências não são necessários</p>
              </div>
              <div>
                <strong className="text-[var(--mq-text)]">3. Não mantenha múltiplos chats abertos</strong>
                <p className="ml-4 mt-1">Cada chat mantém contexto = mais tokens consumidos</p>
              </div>
              <div>
                <strong className="text-[var(--mq-text)]">4. Não inclua arquivos de build</strong>
                <p className="ml-4 mt-1">dist/, build/, .next/ não são necessários</p>
              </div>
              <div>
                <strong className="text-[var(--mq-text)]">5. Não adicione logs ou dados de teste</strong>
                <p className="ml-4 mt-1">Arquivos grandes com dados poluem o contexto</p>
              </div>
            </div>
          </motion.div>

          {/* Exemplos Práticos */}
          <motion.div 
            className="mq-card p-4 bg-blue-500/10 border-blue-500/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-semibold text-[var(--mq-text)] mb-3">Exemplos Práticos</h2>
            <div className="text-sm text-[var(--mq-text-muted)] space-y-3">
              <div>
                <strong className="text-[var(--mq-text)]">Cenário 1: Refatorar componente React</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>Check Inclua: @Componente.tsx + @tipos.ts (se necessário)</li>
                  <li>X Não inclua: Toda a pasta src/, outros componentes</li>
                  <li><strong>Economia:</strong> ~50-70% de tokens</li>
                </ul>
              </div>
              <div className="pt-2 border-t border-blue-500/20">
                <strong className="text-[var(--mq-text)]">Cenário 2: Criar workflow n8n</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>Check Use: @codebase para buscar exemplos similares</li>
                  <li>Check Inclua: Apenas nodes específicos necessários</li>
                  <li>X Não inclua: Workflows inteiros não relacionados</li>
                  <li><strong>Economia:</strong> ~60-80% de tokens</li>
                </ul>
              </div>
              <div className="pt-2 border-t border-blue-500/20">
                <strong className="text-[var(--mq-text)]">Cenário 3: Debug de erro</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>Check Inclua: Arquivo com erro + stack trace</li>
                  <li>Check Use: @codebase para encontrar código relacionado</li>
                  <li>X Não inclua: Toda a aplicação</li>
                  <li><strong>Economia:</strong> ~70-90% de tokens</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Dica Final */}
          <motion.div 
            className="mq-card p-4 bg-purple-500/10 border-purple-500/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-sm text-[var(--mq-text-muted)]">
              <strong className="text-[var(--mq-text)]">Lightbulb Regra de Ouro:</strong> Se você não precisa do arquivo para a tarefa atual, 
              não inclua no contexto. Menos contexto = menos tokens = mais eficiência.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CursorContextoPage;

