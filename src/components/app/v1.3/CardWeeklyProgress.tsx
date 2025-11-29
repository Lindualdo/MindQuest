import { format, startOfWeek, addDays, isSameDay, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { WeeklyProgressCardData } from '@/types/emotions';

type Props = {
  summary: WeeklyProgressCardData;
  onContinue: () => void;
  onHistorico?: () => void;
};

const CardWeeklyProgress = ({ summary, onContinue, onHistorico }: Props) => {
  const dias = summary.dias ?? [];
  const hoje = new Date();
  const inicioSemana = startOfWeek(hoje, { weekStartsOn: 0 }); // 0 = domingo

  // Calcular totais da semana
  const xpConversaTotal = dias.reduce((sum, dia) => sum + (dia.xpConversa ?? 0), 0);
  const metaConversaTotal = dias.reduce((sum, dia) => sum + (dia.metaConversa ?? 0), 0);
  const progressoConversa = metaConversaTotal > 0 
    ? Math.min(100, Math.round((xpConversaTotal / metaConversaTotal) * 100)) 
    : 0;

  // Meta semanal de quests (usa valor do backend, padrão 7 se não vier)
  const metaQuestsSemanal = summary.qtdQuestsPrevistasSemana ?? 7;
  // Quests concluídas (usa valor do backend, senão soma dos dias)
  const questsConcluidasSemanal = summary.qtdQuestsConcluidasSemana ?? dias.reduce((sum, dia) => sum + (dia.qtdQuestsConcluidas ?? 0), 0);
  const progressoQuests = metaQuestsSemanal > 0 
    ? Math.min(100, Math.round((questsConcluidasSemanal / metaQuestsSemanal) * 100))
    : 0;

  // Status config para checkboxes de conversas - usando CSS vars
  const statusConfig: Record<string, { bg: string; border: string; icon: string; color: string }> = {
    respondido: {
      bg: 'var(--mq-primary-light)',
      border: 'var(--mq-primary)',
      icon: '✓',
      color: 'var(--mq-primary)',
    },
    perdido: {
      bg: 'rgba(232,235,244,0.8)',
      border: 'var(--mq-border)',
      icon: '✕',
      color: 'var(--mq-text-muted)',
    },
    pendente: {
      bg: 'var(--mq-warning-light)',
      border: 'var(--mq-warning)',
      icon: '…',
      color: 'var(--mq-warning)',
    },
    default: {
      bg: 'rgba(232,235,244,0.8)',
      border: 'var(--mq-border)',
      icon: '—',
      color: 'var(--mq-text-muted)',
    },
  };

  // Status config para checkboxes de conversas
  const getStatusConversa = (dia: typeof dias[0]) => {
    if ((dia.xpConversa ?? 0) > 0) return 'respondido';
    const dataDia = dia.data ? new Date(dia.data + 'T00:00:00') : null;
    if (dataDia && isSameDay(dataDia, hoje)) return 'pendente';
    if (dataDia && isFuture(dataDia)) return 'default';
    return 'perdido';
  };

  return (
    <section
      className="mq-card rounded-2xl px-4 py-3"
      style={{ borderRadius: 24 }}
    >
      {/* Título */}
      <p className="mq-eyebrow">
        Meu progresso Semanal
      </p>

      {/* Seção Conversas */}
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <p className="text-[0.7rem] font-semibold text-[var(--mq-text)]">Conversas</p>
          {onHistorico && (
            <button
              type="button"
              onClick={onHistorico}
              className="text-[0.65rem] font-medium text-[var(--mq-primary)] hover:underline"
            >
              Histórico &gt;
            </button>
          )}
        </div>
        
        {/* Checkboxes dos dias */}
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => {
            const data = addDays(inicioSemana, i);
            const dataStr = format(data, 'yyyy-MM-dd');
            const dia = dias.find(d => d.data === dataStr);
            const status = dia ? getStatusConversa(dia) : 'default';
            const config = statusConfig[status] ?? statusConfig.default;
            const dataFormatada = format(data, 'dd/MM');
            const labelDia = format(data, 'EEE', { locale: ptBR }).slice(0, 3).toUpperCase();
            const isHoje = isSameDay(data, hoje);

            return (
              <div
                key={dataStr}
                className="flex flex-col items-center text-center"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl border-2 text-[0.8rem] font-semibold leading-none"
                  style={{
                    backgroundColor: config.bg,
                    borderColor: config.border,
                    color: config.color,
                    boxShadow: isHoje ? '0 0 0 2px var(--mq-primary-light)' : 'none',
                  }}
                >
                  {config.icon}
                </div>
                <span className="mt-1 text-[0.56rem] font-semibold uppercase tracking-wide text-[var(--mq-text)]">
                  {labelDia}
                </span>
                <span className="text-[0.56rem] font-medium text-[var(--mq-text-muted)]">
                  {dataFormatada}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Linha divisória */}
      <div className="my-3 h-[1px] w-full bg-[var(--mq-border)]" />

      {/* Seção Quests */}
      <div>
        <p className="text-[0.7rem] font-semibold text-[var(--mq-text)]">Quests / Ações</p>
        
        {/* Barra de progresso horizontal */}
        <div className="mt-2 flex items-center gap-4">
          <span className="text-[0.65rem] font-semibold text-[var(--mq-text-subtle)] whitespace-nowrap">{questsConcluidasSemanal}</span>
          <div className="relative h-2 flex-1 rounded-full bg-[var(--mq-bar)]">
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ 
                width: `${progressoQuests}%`,
                background: 'linear-gradient(to right, var(--mq-success), var(--mq-primary))'
              }}
            />
          </div>
          <span className="text-[0.65rem] font-semibold text-[var(--mq-text-subtle)] whitespace-nowrap">{metaQuestsSemanal}</span>
        </div>

        {/* Barras verticais por dia */}
        <div className="mt-8 flex h-14 items-end justify-between gap-1">
          {Array.from({ length: 7 }).map((_, i) => {
            const data = addDays(inicioSemana, i);
            const dataStr = format(data, 'yyyy-MM-dd');
            const dia = dias.find(d => d.data === dataStr);
            const qtdPrevistas = dia?.qtdQuestsPrevistas ?? 0;
            const qtdConcluidas = dia?.qtdQuestsConcluidas ?? 0;
            
            // Calcular altura da barra baseado em quantidade de quests (não mais XP)
            const trackHeight = 40;
            let ratio = 0;
            if (qtdPrevistas > 0) {
              // Se há quests previstas, calcular proporção normalmente
              ratio = Math.min(1, qtdConcluidas / qtdPrevistas);
            } else if (qtdConcluidas > 0) {
              // Se não há previstas mas há concluídas (ex: conversas), barra completa
              // Porque se há algo concluído, significa que havia algo planejado
              ratio = 1; // 100% da barra
            }
            const fillHeight = ratio > 0 ? Math.max(4, ratio * trackHeight) : 0; // Mínimo de 4px quando tem progresso
            
            const dataFormatada = format(data, 'dd/MM');
            const labelDia = format(data, 'EEE', { locale: ptBR }).slice(0, 3).toUpperCase();

            return (
              <div
                key={dataStr}
                className="flex flex-1 flex-col items-center justify-end gap-0.5"
              >
                {/* Número acima da barra - mostrar concluídas se não há previstas */}
                <span className="text-[0.65rem] font-semibold text-[var(--mq-text-subtle)] mb-1.5">
                  {qtdPrevistas > 0 ? qtdPrevistas : (qtdConcluidas > 0 ? qtdConcluidas : 0)}
                </span>
                
                {/* Barra vertical */}
                <div
                  className="relative overflow-hidden rounded-full bg-[var(--mq-bar)]"
                  style={{ height: `${trackHeight}px`, width: '10px' }}
                >
                  {fillHeight > 0 && (
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-full bg-[var(--mq-success)]"
                      style={{ height: `${fillHeight}px` }}
                    />
                  )}
                </div>
                
                {/* Label do dia */}
                <span className="text-[0.56rem] font-semibold uppercase tracking-wide text-[var(--mq-text)]">
                  {labelDia}
                </span>
                
                {/* Data abaixo do label */}
                <span className={`text-[0.56rem] font-medium ${isSameDay(data, hoje) ? 'text-[var(--mq-primary)] font-semibold' : 'text-[var(--mq-text-muted)]'}`}>
                  {dataFormatada}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botão CTA */}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          className="mq-btn-primary rounded-full px-4 py-2 text-[0.75rem] uppercase tracking-wide"
        >
          Ver detalhes
        </button>
      </div>
    </section>
  );
};

export default CardWeeklyProgress;
