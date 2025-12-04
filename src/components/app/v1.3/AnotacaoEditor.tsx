import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { apiService } from '@/services/apiService';

interface AnotacaoEditorProps {
  tipo: 'conversa' | 'quest';
  id: string;
  usuarioId: string;
  anotacaoInicial?: string | null;
  onClose: () => void;
  onSave?: (anotacao: string | null) => void;
}

const AnotacaoEditor: React.FC<AnotacaoEditorProps> = ({
  tipo,
  id,
  usuarioId,
  anotacaoInicial = null,
  onClose,
  onSave,
}) => {
  const [anotacao, setAnotacao] = useState(anotacaoInicial || '');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSalvar = async () => {
    setErro(null);
    setSalvando(true);

    try {
      // Preservar o texto mesmo se for apenas espaços (será trimado no backend se necessário)
      const anotacaoFinal = anotacao.trim().length > 0 ? anotacao.trim() : null;
      await apiService.salvarAnotacao(tipo, id, anotacaoFinal, usuarioId);
      
      if (onSave) {
        onSave(anotacaoFinal);
      }
      
      onClose();
    } catch (error) {
      console.error('[AnotacaoEditor] Erro ao salvar:', error);
      setErro(error instanceof Error ? error.message : 'Erro ao salvar anotação');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="mq-card w-full max-w-md rounded-3xl p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="mq-page-title text-lg">
            {tipo === 'conversa' ? 'Anotação da Conversa' : 'Anotação da Quest'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[var(--mq-text-muted)] hover:bg-[var(--mq-surface)] hover:text-[var(--mq-text)] transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <textarea
            value={anotacao}
            onChange={(e) => setAnotacao(e.target.value)}
            placeholder="Digite sua anotação aqui..."
            className="w-full min-h-[200px] rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-4 py-3 text-sm text-[var(--mq-text)] placeholder:text-[var(--mq-text-subtle)] focus:border-[var(--mq-primary)] focus:outline-none resize-none"
            autoFocus
          />
        </div>

        {erro && (
          <div className="mb-4 rounded-xl bg-[var(--mq-error-light)] px-3 py-2 text-sm text-[var(--mq-error)]">
            {erro}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={salvando}
            className="flex-1 rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-4 py-3 text-sm font-semibold text-[var(--mq-text)] hover:bg-[var(--mq-surface)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSalvar}
            disabled={salvando}
            className="mq-btn-primary flex-1 rounded-2xl px-4 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {salvando ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={16} />
                Salvar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnotacaoEditor;

