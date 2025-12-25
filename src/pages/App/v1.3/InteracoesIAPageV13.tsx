import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

interface InteracoesIAData {
  nome_assistente: string | null;
  sobre_voce: string | null;
  tom_conversa: 'empativo' | 'interativo' | 'educativo' | 'equilibrado' | 'direto' | null;
}

const InteracoesIAPageV13: React.FC = () => {
  const {
    dashboardData,
    setView,
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Usuário';

  const usuarioId = dashboardData?.usuario?.id;

  const [activeTab, setActiveTab] = useState<TabId>('evoluir');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<InteracoesIAData>({
    nome_assistente: null,
    sobre_voce: null,
    tom_conversa: null,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Carregar dados do perfil
  useEffect(() => {
    const loadInteracoes = async () => {
      if (!usuarioId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/perfil-pessoal?user_id=${encodeURIComponent(usuarioId)}`);
        
        if (!response.ok) {
          throw new Error(`Erro ao carregar configurações: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.perfil) {
          setFormData({
            nome_assistente: data.perfil.nome_assistente || null,
            sobre_voce: data.perfil.sobre_voce || null,
            tom_conversa: data.perfil.tom_conversa || null,
          });
        }
      } catch (error) {
        console.error('[InteracoesIA] Erro ao carregar:', error);
        setFormData({
          nome_assistente: null,
          sobre_voce: null,
          tom_conversa: null,
        });
      } finally {
        setLoading(false);
      }
    };

    loadInteracoes();
  }, [usuarioId]);

  const handleBack = () => {
    setView('ajustes');
  };

  const handleNavConversar = () => {
    setActiveTab('conversar');
    setView('conversar');
  };

  const handleNavEntender = () => {
    setActiveTab('entender');
    setView('dashEmocoes');
  };

  const handleNavAgir = () => {
    setActiveTab('agir');
    setView('painelQuests');
  };

  const handleNavEvoluir = () => {
    setActiveTab('evoluir');
    setView('jornada');
  };

  const handleSave = async () => {
    if (!usuarioId) {
      setError('Usuário não identificado');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const response = await fetch('/api/perfil-pessoal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: usuarioId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar configurações');
      }

      const data = await response.json();
      if (data.success) {
        if (data.perfil) {
          setFormData({
            nome_assistente: data.perfil.nome_assistente || null,
            sobre_voce: data.perfil.sobre_voce || null,
            tom_conversa: data.perfil.tom_conversa || null,
          });
        }
        setSuccess(true);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setTimeout(() => {
          handleBack();
        }, 2000);
      } else {
        throw new Error(data.error || 'Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('[InteracoesIA] Erro ao salvar:', error);
      setError(error instanceof Error ? error.message : 'Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mq-app-v1_3 flex min-h-screen flex-col">
        <HeaderV1_3 nomeUsuario={nomeUsuario} onBack={handleBack} />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 pb-24 pt-4">
          <Loader2 size={32} className="animate-spin text-[var(--mq-primary)]" />
          <p className="mt-4 text-sm text-[var(--mq-text-muted)]">Carregando configurações...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} onBack={handleBack} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">

        {/* Título da página */}
        <div className="mb-6 text-center">
          <h1 className="mq-page-title">
            Interações com IA
          </h1>
          <p className="mq-page-subtitle">
            Personalize como o assistente interage com você
          </p>
        </div>

        {/* Mensagens de erro/sucesso */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-xl border-2 border-green-400 bg-green-100 p-4 text-sm font-semibold text-green-800 shadow-md"
          >
            ✅ Configurações salvas com sucesso!
          </motion.div>
        )}

        {/* Formulário */}
        <div className="mq-card space-y-4 p-6" style={{ borderRadius: 24 }}>
          {/* Nome Assistente */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--mq-text)]">
              Nome do Assistente
            </label>
            <input
              type="text"
              value={formData.nome_assistente || ''}
              onChange={(e) => setFormData({ ...formData, nome_assistente: e.target.value || null })}
              className="w-full rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-4 py-3 text-sm text-[var(--mq-text)] focus:border-[var(--mq-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--mq-primary)]/20"
              placeholder="Como você quer chamar seu assistente?"
            />
            <p className="mt-1 text-xs text-[var(--mq-text-muted)]">
              Personalize como o assistente de IA se apresenta para você
            </p>
          </div>

          {/* Conte mais sobre você */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--mq-text)]">
              Conte Mais Sobre Você
            </label>
            <p className="mb-3 text-xs text-[var(--mq-text-muted)]">
              Compartilhe seu contexto: histórico relevante, valores, desafios atuais e situações importantes para personalizar sua experiência.
            </p>
            <textarea
              value={formData.sobre_voce || ''}
              onChange={(e) => setFormData({ ...formData, sobre_voce: e.target.value || null })}
              rows={4}
              className="w-full rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-4 py-3 text-sm text-[var(--mq-text)] focus:border-[var(--mq-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--mq-primary)]/20 resize-none"
              placeholder="Exemplo: Tenho dois filhos, estou divorciado há dois anos, terminei um casamento de 26 anos. Mudei recentemente para Portugal..."
            />
          </div>

          {/* Tom de Conversa */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-[var(--mq-text)]">
              Tom de Conversa
            </label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] p-4 cursor-pointer hover:border-[var(--mq-primary)] hover:bg-[var(--mq-surface)] transition-colors">
                <input
                  type="radio"
                  name="tom_conversa"
                  value="empativo"
                  checked={formData.tom_conversa === 'empativo'}
                  onChange={(e) => setFormData({ ...formData, tom_conversa: e.target.value as any })}
                  className="mt-1 h-4 w-4 accent-[var(--mq-primary)]"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[var(--mq-text)]">Empático (padrão)</div>
                  <div className="text-xs text-[var(--mq-text-muted)] mt-1">
                    Respostas compassivas e acolhedoras, focadas em entender suas emoções
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] p-4 cursor-pointer hover:border-[var(--mq-primary)] hover:bg-[var(--mq-surface)] transition-colors">
                <input
                  type="radio"
                  name="tom_conversa"
                  value="interativo"
                  checked={formData.tom_conversa === 'interativo'}
                  onChange={(e) => setFormData({ ...formData, tom_conversa: e.target.value as any })}
                  className="mt-1 h-4 w-4 accent-[var(--mq-primary)]"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[var(--mq-text)]">Interativo</div>
                  <div className="text-xs text-[var(--mq-text-muted)] mt-1">
                    Diálogo colaborativo com perguntas que te ajudam a refletir e descobrir respostas
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] p-4 cursor-pointer hover:border-[var(--mq-primary)] hover:bg-[var(--mq-surface)] transition-colors">
                <input
                  type="radio"
                  name="tom_conversa"
                  value="educativo"
                  checked={formData.tom_conversa === 'educativo'}
                  onChange={(e) => setFormData({ ...formData, tom_conversa: e.target.value as any })}
                  className="mt-1 h-4 w-4 accent-[var(--mq-primary)]"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[var(--mq-text)]">Educativo</div>
                  <div className="text-xs text-[var(--mq-text-muted)] mt-1">
                    Explicações passo a passo para te ensinar técnicas e conceitos de desenvolvimento pessoal
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] p-4 cursor-pointer hover:border-[var(--mq-primary)] hover:bg-[var(--mq-surface)] transition-colors">
                <input
                  type="radio"
                  name="tom_conversa"
                  value="equilibrado"
                  checked={formData.tom_conversa === 'equilibrado'}
                  onChange={(e) => setFormData({ ...formData, tom_conversa: e.target.value as any })}
                  className="mt-1 h-4 w-4 accent-[var(--mq-primary)]"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[var(--mq-text)]">Equilibrado</div>
                  <div className="text-xs text-[var(--mq-text-muted)] mt-1">
                    Combina acolhimento empático com perguntas interativas para uma experiência completa
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] p-4 cursor-pointer hover:border-[var(--mq-primary)] hover:bg-[var(--mq-surface)] transition-colors">
                <input
                  type="radio"
                  name="tom_conversa"
                  value="direto"
                  checked={formData.tom_conversa === 'direto'}
                  onChange={(e) => setFormData({ ...formData, tom_conversa: e.target.value as any })}
                  className="mt-1 h-4 w-4 accent-[var(--mq-primary)]"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[var(--mq-text)]">Direto/Firme</div>
                  <div className="text-xs text-[var(--mq-text-muted)] mt-1">
                    Tom mais direto e firme, como um mentor que te desafia e não tem medo de ser direto
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Botão Salvar */}
          <motion.button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mq-btn-primary w-full rounded-xl px-6 py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: saving ? 1 : 1.02 }}
            whileTap={{ scale: saving ? 1 : 0.98 }}
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={18} />
                Salvar Configurações
              </>
            )}
          </motion.button>
        </div>
      </main>

      <BottomNavV1_3
        active={activeTab}
        onConversar={handleNavConversar}
        onEntender={handleNavEntender}
        onAgir={handleNavAgir}
        onEvoluir={handleNavEvoluir}
      />
    </div>
  );
};

export default InteracoesIAPageV13;

