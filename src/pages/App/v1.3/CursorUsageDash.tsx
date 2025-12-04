import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Upload,
  Cpu,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap,
  ChevronRight,
  FileText
} from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';
import { useAuth } from '@/store/useStore';

// ====== TIPOS ======
interface UsageEvent {
  date: string;
  kind: string;
  model: string;
  maxMode: string;
  inputWithCache: number;
  inputWithoutCache: number;
  cacheRead: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
}

interface ModelStats {
  model: string;
  totalTokens: number;
  includedTokens: number; // Tokens usados dentro do limite
  onDemandTokens: number; // Tokens excedentes (cobrados)
  totalCost: number;
  requests: number;
  includedRequests: number;
  onDemandRequests: number;
  includedCost: number;
  onDemandCost: number;
}

// ====== CONFIGURAÇÃO DO CICLO ======
// Data de corte do ciclo mensal (início da assinatura Ultra)
const CYCLE_START_DATE = new Date('2025-12-04T09:00:00.000Z'); // 04/12/2025 às 09:00 UTC

// ====== LIMITES DO CURSOR - PLANO ULTRA ======
// Plano Ultra: Limite por TOKENS (não por requisições)
// Baseado na página de Billing: ~3.4M tokens incluídos no período
// Distribuição aproximada por modelo (ajustar conforme uso real)
const CURSOR_LIMITS = {
  'claude-4.5-opus-high-thinking': { name: 'Claude Opus 4.5', monthlyIncluded: 1_100_000, priority: 1 }, // ~1.1M tokens
  'claude-4.5-sonnet-thinking': { name: 'Claude Sonnet 4.5', monthlyIncluded: 2_000_000, priority: 2 },
  'gpt-5.1': { name: 'GPT-5.1', monthlyIncluded: 2_000_000, priority: 3 },
  'auto': { name: 'Auto (Sonnet)', monthlyIncluded: 2_400_000, priority: 4 }, // ~2.4M tokens (maior uso)
  'grok-code-fast-1': { name: 'Grok Code', monthlyIncluded: 2_000_000, priority: 5 },
  'gemini-3-pro-preview': { name: 'Gemini 3 Pro', monthlyIncluded: 2_000_000, priority: 6 },
};

// ====== PARSER CSV ======
function parseCSV(text: string): UsageEvent[] {
  const lines = text.trim().split('\n');
  const events: UsageEvent[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Parse CSV com aspas
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (!matches || matches.length < 10) continue;
    
    const clean = (s: string) => s.replace(/^"|"$/g, '');
    const kind = clean(matches[1]);
    
    // Ignorar erros e abortados
    if (kind.includes('Errored') || kind.includes('Aborted')) continue;
    
    events.push({
      date: clean(matches[0]),
      kind: kind,
      model: clean(matches[2]),
      maxMode: clean(matches[3]),
      inputWithCache: parseFloat(clean(matches[4])) || 0,
      inputWithoutCache: parseFloat(clean(matches[5])) || 0,
      cacheRead: parseFloat(clean(matches[6])) || 0,
      outputTokens: parseFloat(clean(matches[7])) || 0,
      totalTokens: parseFloat(clean(matches[8])) || 0,
      cost: parseFloat(clean(matches[9])) || 0,
    });
  }
  
  return events;
}

// ====== COMPONENTE PRINCIPAL ======
const CursorUsageDash: React.FC = () => {
  const { dashboardData, setView } = useDashboard();
  const { isAuthenticated } = useAuth();
  
  // Se autenticado, usa nome do usuário; senão, usa "Visitante"
  const nomeUsuario = isAuthenticated 
    ? (dashboardData?.usuario?.nome_preferencia ?? dashboardData?.usuario?.nome ?? 'Usuário')
    : 'Visitante';

  const [activeTab, setActiveTab] = useState<TabId>('evoluir');
  const [events, setEvents] = useState<UsageEvent[]>([]);
  const [fileName, setFileName] = useState<string>('');

  // ====== HANDLERS DE ARQUIVO ======
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);
      setEvents(parsed);
    };
    reader.readAsText(file);
  }, []);

  // ====== CÁLCULOS ======
  const stats = useMemo(() => {
    if (!events.length) return null;

    // Filtrar apenas eventos do ciclo atual (após data de corte)
    // Data de corte: 04/12/2025 às 09:00 UTC
    const cycleStart = CYCLE_START_DATE;
    const cycleStartTime = cycleStart.getTime();
    
    const cycleEvents = events.filter(ev => {
      const eventDate = new Date(ev.date);
      const eventTime = eventDate.getTime();
      // Apenas eventos a partir de 09:00 UTC do dia 04/12/2025
      return eventTime >= cycleStartTime;
    });

    if (!cycleEvents.length) {
      return {
        byModel: {},
        modelList: [],
        totalCost: 0,
        includedCost: 0,
        onDemandCost: 0,
        totalRequests: 0,
        period: {
          start: cycleStart.toLocaleDateString('pt-BR'),
          end: new Date().toLocaleDateString('pt-BR'),
        },
        cycleInfo: {
          start: cycleStart,
          daysElapsed: Math.floor((Date.now() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)),
          daysInMonth: 30, // Aproximação
        },
      };
    }

    const byModel: Record<string, ModelStats> = {};
    let totalCost = 0;
    let includedCost = 0;
    let onDemandCost = 0;
    let totalRequests = 0;

    cycleEvents.forEach(ev => {
      const model = ev.model;
      if (!byModel[model]) {
        byModel[model] = {
          model,
          totalTokens: 0,
          includedTokens: 0,
          onDemandTokens: 0,
          totalCost: 0,
          requests: 0,
          includedRequests: 0,
          onDemandRequests: 0,
          includedCost: 0,
          onDemandCost: 0,
        };
      }
      
      byModel[model].totalTokens += ev.totalTokens;
      byModel[model].totalCost += ev.cost;
      byModel[model].requests += 1;
      totalCost += ev.cost;
      totalRequests += 1;

      if (ev.kind === 'On-Demand') {
        byModel[model].onDemandRequests += 1;
        byModel[model].onDemandTokens += ev.totalTokens;
        byModel[model].onDemandCost += ev.cost;
        onDemandCost += ev.cost;
      } else {
        byModel[model].includedRequests += 1;
        byModel[model].includedTokens += ev.totalTokens;
        byModel[model].includedCost += ev.cost;
        includedCost += ev.cost;
      }
    });

    // Ordenar por custo total
    const modelList = Object.values(byModel).sort((a, b) => b.totalCost - a.totalCost);

    // Período do ciclo atual
    const cycleDates = cycleEvents.map(e => new Date(e.date));
    const maxDate = cycleDates.length > 0
      ? new Date(Math.max(...cycleDates.map(d => d.getTime())))
      : new Date();

    // Calcular próximo ciclo
    const nextCycleStart = new Date(cycleStart);
    nextCycleStart.setMonth(nextCycleStart.getMonth() + 1);

    // Dias decorridos desde o início do ciclo
    const daysElapsed = Math.max(1, Math.floor((Date.now() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)));
    const daysInMonth = 30; // Aproximação padrão
    const daysRemaining = Math.max(0, daysInMonth - daysElapsed);

    return {
      byModel,
      modelList,
      totalCost,
      includedCost,
      onDemandCost,
      totalRequests,
      period: {
        start: cycleStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        end: maxDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      },
      cycleInfo: {
        start: cycleStart,
        nextCycle: nextCycleStart,
        daysElapsed,
        daysRemaining,
        daysInMonth,
      },
    };
  }, [events]);

  // ====== NAVEGAÇÃO ======
  const handleBack = () => {
    if (isAuthenticated) {
      setView('ajustes');
    } else {
      window.location.href = '/';
    }
  };
  const handleNavConversar = () => { 
    if (isAuthenticated) {
      setActiveTab('conversar'); 
      setView('conversar'); 
    }
  };
  const handleNavEntender = () => { 
    if (isAuthenticated) {
      setActiveTab('entender'); 
      setView('dashEmocoes'); 
    }
  };
  const handleNavAgir = () => { 
    if (isAuthenticated) {
      setActiveTab('agir'); 
      setView('painelQuests'); 
    }
  };
  const handleNavEvoluir = () => { 
    if (isAuthenticated) {
      setActiveTab('evoluir'); 
      setView('jornada'); 
    }
  };

  // ====== HELPERS DE FORMATAÇÃO ======
  const formatTokens = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return n.toString();
  };

  const getModelInfo = (model: string) => {
    return CURSOR_LIMITS[model as keyof typeof CURSOR_LIMITS] || { name: model, monthlyIncluded: 0, priority: 99 };
  };

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-24 pt-4">
        {/* Voltar */}
        <div className="mb-4">
          <button type="button" onClick={handleBack} className="mq-btn-back">
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        {/* Título */}
        <div className="mb-6 text-center">
          <h1 className="mq-page-title flex items-center justify-center gap-2">
            <Cpu size={24} />
            Cursor Usage Monitor
          </h1>
          <p className="mq-page-subtitle">Monitore seu consumo de tokens</p>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30">
            <span className="text-xs font-semibold text-purple-500">Plano Ultra</span>
            <span className="text-xs text-[var(--mq-text-muted)]">• Limites aumentados</span>
          </div>
        </div>

        {/* Upload CSV */}
        <motion.div 
          className="mq-card mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="flex cursor-pointer flex-col items-center gap-3 p-6 border-2 border-dashed rounded-xl border-[var(--mq-border)] hover:border-[var(--mq-primary)] transition-colors">
            <Upload size={32} className="text-[var(--mq-primary)]" />
            <span className="text-[var(--mq-text)]">
              {fileName || 'Clique para carregar usage-events.csv'}
            </span>
            <span className="text-xs text-[var(--mq-text-muted)]">
              Baixe em: Settings → Usage → Export CSV
            </span>
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </motion.div>

        {/* Links para Guias */}
        <motion.div 
          className="grid grid-cols-1 gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
        >
          <a 
            href="/app/cursor-cobranca"
            className="mq-card p-4 hover:bg-[var(--mq-primary)]/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign size={20} className="text-[var(--mq-primary)]" />
                <div>
                  <div className="font-medium text-[var(--mq-text)]">Como Funciona a Cobrança</div>
                  <div className="text-xs text-[var(--mq-text-muted)]">Limite por tokens, Included vs On-Demand</div>
                </div>
              </div>
              <ChevronRight size={18} className="text-[var(--mq-text-muted)]" />
            </div>
          </a>

          <a 
            href="/app/cursor-modelos"
            className="mq-card p-4 hover:bg-[var(--mq-primary)]/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cpu size={20} className="text-[var(--mq-primary)]" />
                <div>
                  <div className="font-medium text-[var(--mq-text)]">Qual Modelo Usar</div>
                  <div className="text-xs text-[var(--mq-text-muted)]">Melhor uso dos tokens - React/TS + n8n</div>
                </div>
              </div>
              <ChevronRight size={18} className="text-[var(--mq-text-muted)]" />
            </div>
          </a>

          <a 
            href="/app/cursor-contexto"
            className="mq-card p-4 hover:bg-[var(--mq-primary)]/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-[var(--mq-primary)]" />
                <div>
                  <div className="font-medium text-[var(--mq-text)]">Contexto Eficiente</div>
                  <div className="text-xs text-[var(--mq-text-muted)]">Sem desperdício de tokens</div>
                </div>
              </div>
              <ChevronRight size={18} className="text-[var(--mq-text-muted)]" />
            </div>
          </a>
        </motion.div>

        {/* Dashboard */}
        {stats && (
          <>
            {/* Resumo Geral */}
            <motion.div 
              className="grid grid-cols-2 gap-3 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mq-card p-4 text-center">
                <div className="text-xs text-[var(--mq-text-muted)] mb-1">Total Requests</div>
                <div className="text-2xl font-bold text-[var(--mq-text)]">{stats.totalRequests}</div>
              </div>
              <div className="mq-card p-4 text-center">
                <div className="text-xs text-[var(--mq-text-muted)] mb-1">Total Tokens</div>
                <div className="text-lg font-bold text-[var(--mq-text)]">
                  {formatTokens(stats.modelList.reduce((sum, m) => sum + m.totalTokens, 0))}
                </div>
              </div>
              <div className="mq-card p-4 text-center bg-green-500/10">
                <div className="flex items-center justify-center gap-1 text-xs text-green-500 mb-1">
                  <CheckCircle size={12} /> Incluso (Plano)
                </div>
                <div className="text-xl font-bold text-green-500">${stats.includedCost.toFixed(2)}</div>
                <div className="text-xs text-green-500/70 mt-1">
                  {stats.modelList.reduce((sum, m) => sum + m.includedRequests, 0)} requests
                </div>
              </div>
              <div className="mq-card p-4 text-center bg-amber-500/10">
                <div className="flex items-center justify-center gap-1 text-xs text-amber-500 mb-1">
                  <AlertTriangle size={12} /> On-Demand (Extra)
                </div>
                <div className="text-xl font-bold text-amber-500">${stats.onDemandCost.toFixed(2)}</div>
                <div className="text-xs text-amber-500/70 mt-1">
                  {stats.modelList.reduce((sum, m) => sum + m.onDemandRequests, 0)} requests
                </div>
              </div>
            </motion.div>

            {/* Explicação do Modelo de Cobrança */}
            <motion.div 
              className="mq-card mb-6 p-4 bg-blue-500/10 border-blue-500/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-medium text-blue-500 flex items-center gap-2 mb-2">
                <DollarSign size={16} /> Como Funciona a Cobrança
              </h3>
              <div className="text-sm text-[var(--mq-text-muted)] space-y-2">
                <div>
                  <strong className="text-[var(--mq-text)]">1. Limite do Plano Ultra (Included):</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Limite mensal = <strong>por TOKENS</strong> (não por requisições)</li>
                    <li>• Exemplo: ~3.4M tokens incluídos no período (Auto: 2.4M, Opus: 1.1M)</li>
                    <li>• Dentro do limite: <span className="text-green-500">já pago na assinatura</span></li>
                    <li>• O custo mostrado é referência do valor consumido do plano</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-[var(--mq-text)]">2. Excesso (On-Demand):</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Quando excede o limite de <strong>TOKENS</strong>: <span className="text-amber-500">cobrado extra</span></li>
                    <li>• Cobrança = <strong>por TOKENS</strong> (input + output tokens)</li>
                    <li>• Preço varia por modelo (Opus é mais caro que Sonnet)</li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-blue-500/20">
                  <strong className="text-[var(--mq-text)]">💡 Dica:</strong> Monitore o uso de <strong>tokens</strong>, não apenas requisições. On-Demand é cobrado por tokens excedentes!
                </div>
              </div>
            </motion.div>

            {/* Período do Ciclo */}
            {stats.cycleInfo && stats.cycleInfo.nextCycle && (
              <div className="mq-card mb-4 p-3 text-center">
                <div className="text-xs text-[var(--mq-text-muted)] mb-1">Ciclo Atual</div>
                <div className="text-sm font-semibold text-[var(--mq-text)]">
                  {stats.period.start} → {stats.cycleInfo.nextCycle.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </div>
                <div className="text-xs text-[var(--mq-text-muted)] mt-1">
                  {stats.cycleInfo.daysElapsed} dias decorridos • {stats.cycleInfo.daysRemaining} dias restantes
                </div>
              </div>
            )}

            {/* Por Modelo */}
            <h2 className="text-lg font-semibold text-[var(--mq-text)] mb-3 flex items-center gap-2">
              <TrendingUp size={18} /> Uso por Modelo
            </h2>

            <div className="space-y-3">
              {stats.modelList.map((m, i) => {
                const info = getModelInfo(m.model);
                const isOnDemandHeavy = m.onDemandRequests > 0;
                // Limite é por TOKENS - calcular % real (pode exceder 100% se ultrapassar limite)
                const usagePercent = info.monthlyIncluded > 0 
                  ? (m.includedTokens / info.monthlyIncluded) * 100
                  : 0;

                return (
                  <motion.div 
                    key={m.model}
                    className="mq-card p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-[var(--mq-text)] flex items-center gap-2">
                          {info.name}
                          {isOnDemandHeavy && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
                              On-Demand
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[var(--mq-text-muted)]">
                          {m.requests} requests • {formatTokens(m.totalTokens)} tokens
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[var(--mq-primary)]">${m.totalCost.toFixed(2)}</div>
                      </div>
                    </div>

                    {/* Barra de uso - por TOKENS */}
                    {info.monthlyIncluded > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--mq-text-muted)]">
                            {formatTokens(m.includedTokens)}/{formatTokens(info.monthlyIncluded)} tokens (Included)
                            {m.onDemandTokens > 0 && (
                              <span className="text-amber-500 ml-1">
                                +{formatTokens(m.onDemandTokens)} extra
                              </span>
                            )}
                          </span>
                          <span className={usagePercent >= 100 ? 'text-red-500' : usagePercent >= 80 ? 'text-amber-500' : 'text-green-500'}>
                            {usagePercent.toFixed(0)}%
                          </span>
                        </div>
                        {/* Projeção mensal */}
                        {stats.cycleInfo && stats.cycleInfo.daysElapsed > 0 && usagePercent > 0 && (
                          <div className="text-xs text-[var(--mq-text-muted)] mt-1">
                            Projeção: ~{formatTokens(Math.round((m.includedTokens / stats.cycleInfo.daysElapsed) * stats.cycleInfo.daysInMonth))} tokens/mês
                            {usagePercent > 100 && (
                              <span className="text-red-500 ml-1 font-semibold">⚠️ Limite excedido! ({usagePercent.toFixed(0)}%)</span>
                            )}
                          </div>
                        )}
                        <div className="h-2 bg-[var(--mq-bar)] rounded-full overflow-hidden relative">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              usagePercent >= 100 ? 'bg-red-500' :
                              usagePercent >= 80 ? 'bg-amber-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(100, usagePercent)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Detalhes Included vs On-Demand */}
                    {(m.includedRequests > 0 || m.onDemandRequests > 0) && (
                      <div className="mt-3 pt-3 border-t border-[var(--mq-border)] grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <CheckCircle size={12} className="text-green-500" />
                          <span className="text-[var(--mq-text-muted)]">Incluso:</span>
                          <span className="text-green-500 font-medium">
                            {m.includedRequests} (${m.includedCost.toFixed(2)})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign size={12} className="text-amber-500" />
                          <span className="text-[var(--mq-text-muted)]">Extra:</span>
                          <span className="text-amber-500 font-medium">
                            {m.onDemandRequests} (${m.onDemandCost.toFixed(2)})
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Recomendações */}
            {stats.onDemandCost > 0 && (
              <motion.div 
                className="mq-card mt-6 p-4 bg-amber-500/10 border-amber-500/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="font-medium text-amber-500 flex items-center gap-2 mb-2">
                  <Zap size={16} /> Dicas de Otimização
                </h3>
                <ul className="text-sm text-[var(--mq-text-muted)] space-y-1">
                  <li>• <strong>Claude Sonnet 4.5</strong>: ⭐ Melhor custo-benefício. Use para 70% das tarefas (React/TS/n8n).</li>
                  <li>• <strong>GPT-5.1</strong>: Rápido e barato. Use para completions simples e edições pontuais.</li>
                  <li>• <strong>Claude Opus 4.5</strong>: ⚠️ Use apenas para tarefas complexas (10-15% do uso). Muito caro!</li>
                  <li>• <strong>Auto</strong>: ❌ Evite - desperdiça tokens escolhendo modelos aleatoriamente.</li>
                  <li>• <strong>Estratégia:</strong> Sonnet padrão → GPT-5.1 rápido → Opus apenas se necessário.</li>
                </ul>
              </motion.div>
            )}
          </>
        )}

        {/* Estado vazio */}
        {!stats && (
          <div className="text-center py-12 text-[var(--mq-text-muted)]">
            <Cpu size={48} className="mx-auto mb-4 opacity-30" />
            <p>Carregue o CSV de uso do Cursor</p>
            <p className="text-xs mt-2">Settings → Usage → Export CSV</p>
          </div>
        )}
      </main>

      {isAuthenticated && (
        <BottomNavV1_3
          active={activeTab}
          onConversar={handleNavConversar}
          onEntender={handleNavEntender}
          onAgir={handleNavAgir}
          onEvoluir={handleNavEvoluir}
        />
      )}
    </div>
  );
};

export default CursorUsageDash;

