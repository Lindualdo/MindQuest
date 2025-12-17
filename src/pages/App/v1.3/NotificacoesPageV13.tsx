import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2, Bell, MessageCircle, Mail, Smartphone, MessageSquare, Clock } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

type CanalNotificacao = 'whatsapp' | 'email' | 'push' | 'sms';
type PeriodoDia = 'manha' | 'tarde' | 'noite';

interface NotificacoesData {
  // Conversas Direcionadas da IA (WhatsApp)
  conversas_ia_ativo: boolean;
  conversas_ia_periodo: PeriodoDia;
  conversas_ia_motivacionais: boolean;
  conversas_ia_sabotadores: boolean;
  conversas_ia_resumo_semanal: boolean;
  
  // Lembretes/Alertas
  lembretes_ativo: boolean;
  lembretes_periodo: PeriodoDia;
  lembretes_conversas_diarias: boolean;
  lembretes_quests: boolean;
  lembretes_conquistas: boolean;
  lembretes_canais: CanalNotificacao[]; // Múltiplos canais
}

const NotificacoesPageV13: React.FC = () => {
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

  const [formData, setFormData] = useState<NotificacoesData>({
    // Conversas Direcionadas da IA
    conversas_ia_ativo: true,
    conversas_ia_periodo: 'manha',
    conversas_ia_motivacionais: true,
    conversas_ia_sabotadores: true,
    conversas_ia_resumo_semanal: true,
    
    // Lembretes/Alertas
    lembretes_ativo: true,
    lembretes_periodo: 'manha',
    lembretes_conversas_diarias: true,
    lembretes_quests: true,
    lembretes_conquistas: true,
    lembretes_canais: ['whatsapp'],
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Carregar dados das notificações
  useEffect(() => {
    const loadNotificacoes = async () => {
      if (!usuarioId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/notificacoes?user_id=${encodeURIComponent(usuarioId)}`);
        
        if (!response.ok) {
          throw new Error(`Erro ao carregar configurações: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.notificacoes) {
          setFormData({
            conversas_ia_ativo: data.notificacoes.conversas_ia_ativo ?? true,
            conversas_ia_periodo: data.notificacoes.conversas_ia_periodo || 'manha',
            conversas_ia_motivacionais: data.notificacoes.conversas_ia_motivacionais ?? true,
            conversas_ia_sabotadores: data.notificacoes.conversas_ia_sabotadores ?? true,
            conversas_ia_resumo_semanal: data.notificacoes.conversas_ia_resumo_semanal ?? true,
            lembretes_ativo: data.notificacoes.lembretes_ativo ?? true,
            lembretes_periodo: data.notificacoes.lembretes_periodo || 'manha',
            lembretes_conversas_diarias: data.notificacoes.lembretes_conversas_diarias ?? true,
            lembretes_quests: data.notificacoes.lembretes_quests ?? true,
            lembretes_conquistas: data.notificacoes.lembretes_conquistas ?? true,
            lembretes_canais: data.notificacoes.lembretes_canais || ['whatsapp'],
          });
        }
      } catch (error) {
        console.error('[Notificacoes] Erro ao carregar:', error);
        // Manter valores padrão em caso de erro
      } finally {
        setLoading(false);
      }
    };

    loadNotificacoes();
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

      // Garantir que WhatsApp sempre esteja nos canais
      const canaisComWhatsApp = formData.lembretes_canais.includes('whatsapp')
        ? formData.lembretes_canais
        : ['whatsapp', ...formData.lembretes_canais];

      const response = await fetch('/api/notificacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: usuarioId,
          ...formData,
          lembretes_canais: canaisComWhatsApp,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar configurações');
      }

      const data = await response.json();
      if (data.success) {
        if (data.notificacoes) {
          setFormData(data.notificacoes);
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
      console.error('[Notificacoes] Erro ao salvar:', error);
      setError(error instanceof Error ? error.message : 'Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const toggleCanal = (canal: CanalNotificacao) => {
    const canais = formData.lembretes_canais || [];
    if (canais.includes(canal)) {
      setFormData({
        ...formData,
        lembretes_canais: canais.filter(c => c !== canal),
      });
    } else {
      setFormData({
        ...formData,
        lembretes_canais: [...canais, canal],
      });
    }
  };

  const getCanalIcon = (canal: CanalNotificacao) => {
    switch (canal) {
      case 'whatsapp':
        return <MessageCircle size={18} />;
      case 'email':
        return <Mail size={18} />;
      case 'push':
        return <Smartphone size={18} />;
      case 'sms':
        return <MessageSquare size={18} />;
    }
  };

  const getCanalLabel = (canal: CanalNotificacao) => {
    switch (canal) {
      case 'whatsapp':
        return 'WhatsApp';
      case 'email':
        return 'E-mail';
      case 'push':
        return 'Notificações do celular';
      case 'sms':
        return 'SMS';
    }
  };

  if (loading) {
    return (
      <div className="mq-app-v1_3 flex min-h-screen flex-col">
        <HeaderV1_3 nomeUsuario={nomeUsuario} />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 pb-24 pt-4">
          <Loader2 size={32} className="animate-spin text-[var(--mq-primary)]" />
          <p className="mt-4 text-sm text-[var(--mq-text-muted)]">Carregando configurações...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
        {/* Botão voltar */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="mq-btn-back"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        {/* Título da página */}
        <div className="mb-6 text-center">
          <h1 className="mq-page-title">Notificações</h1>
          <p className="mq-page-subtitle">Configure como e quando receber notificações</p>
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
        <div className="space-y-6">
          {/* Seção: Conversas Direcionadas da IA */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mq-card p-6"
            style={{ borderRadius: 24 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[var(--mq-primary-light)]">
                <MessageCircle size={20} className="text-[var(--mq-primary)]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--mq-text)]">Conversas Direcionadas da IA</h2>
                <p className="text-xs text-[var(--mq-text-muted)]">Mensagens via WhatsApp</p>
              </div>
            </div>

            {/* Toggle principal */}
            <div className="mb-4 flex items-center justify-between rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] p-4">
              <div>
                <p className="text-sm font-semibold text-[var(--mq-text)]">Ativar conversas direcionadas</p>
                <p className="text-xs text-[var(--mq-text-muted)]">Receber mensagens da IA no WhatsApp</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, conversas_ia_ativo: !formData.conversas_ia_ativo })}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  formData.conversas_ia_ativo ? 'bg-[var(--mq-primary)]' : 'bg-[var(--mq-border)]'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    formData.conversas_ia_ativo ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {formData.conversas_ia_ativo && (
              <div className="space-y-4">
                {/* Período */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--mq-text)]">
                    <Clock size={16} />
                    Período preferido
                  </label>
                  <select
                    value={formData.conversas_ia_periodo}
                    onChange={(e) => setFormData({ ...formData, conversas_ia_periodo: e.target.value as PeriodoDia })}
                    className="w-full rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-4 py-3 text-sm text-[var(--mq-text)] focus:border-[var(--mq-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--mq-primary)]/20"
                  >
                    <option value="manha">Manhã</option>
                    <option value="tarde">Tarde</option>
                    <option value="noite">Noite</option>
                  </select>
                </div>

                {/* Tipos de conversas */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[var(--mq-text)]">Tipos de mensagens:</p>
                  
                  <label className="flex items-start gap-3 rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] p-4 cursor-pointer hover:border-[var(--mq-primary)] hover:bg-[var(--mq-surface)] transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.conversas_ia_motivacionais}
                      onChange={(e) => setFormData({ ...formData, conversas_ia_motivacionais: e.target.checked })}
                      className="mt-1 h-4 w-4 accent-[var(--mq-primary)]"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-[var(--mq-text)]">Mensagens motivacionais</div>
                      <div className="text-xs text-[var(--mq-text-muted)] mt-1">
                        Receber mensagens inspiradoras e motivacionais
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] p-4 cursor-pointer hover:border-[var(--mq-primary)] hover:bg-[var(--mq-surface)] transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.conversas_ia_sabotadores}
                      onChange={(e) => setFormData({ ...formData, conversas_ia_sabotadores: e.target.checked })}
                      className="mt-1 h-4 w-4 accent-[var(--mq-primary)]"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-[var(--mq-text)]">Alertas sobre sabotadores</div>
                      <div className="text-xs text-[var(--mq-text-muted)] mt-1">
                        Receber dicas e alertas quando detectarmos padrões de sabotadores
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] p-4 cursor-pointer hover:border-[var(--mq-primary)] hover:bg-[var(--mq-surface)] transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.conversas_ia_resumo_semanal}
                      onChange={(e) => setFormData({ ...formData, conversas_ia_resumo_semanal: e.target.checked })}
                      className="mt-1 h-4 w-4 accent-[var(--mq-primary)]"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-[var(--mq-text)]">Resumo semanal</div>
                      <div className="text-xs text-[var(--mq-text-muted)] mt-1">
                        Receber resumo semanal com emoções e conquistas
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </motion.section>

          {/* Seção: Lembretes e Alertas */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mq-card p-6"
            style={{ borderRadius: 24 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[var(--mq-warning-light)]">
                <Bell size={20} className="text-[var(--mq-warning)]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--mq-text)]">Lembretes e Alertas</h2>
                <p className="text-xs text-[var(--mq-text-muted)]">Notificações sobre conversas, quests e conquistas</p>
              </div>
            </div>

            {/* Toggle principal */}
            <div className="mb-4 flex items-center justify-between rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] p-4">
              <div>
                <p className="text-sm font-semibold text-[var(--mq-text)]">Ativar lembretes</p>
                <p className="text-xs text-[var(--mq-text-muted)]">Receber notificações de lembretes</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, lembretes_ativo: !formData.lembretes_ativo })}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  formData.lembretes_ativo ? 'bg-[var(--mq-primary)]' : 'bg-[var(--mq-border)]'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    formData.lembretes_ativo ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {formData.lembretes_ativo && (
              <div className="space-y-4">
                {/* TODO: Período preferido - habilitar em versão futura
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--mq-text)]">
                    <Clock size={16} />
                    Período preferido
                  </label>
                  <select
                    value={formData.lembretes_periodo}
                    onChange={(e) => setFormData({ ...formData, lembretes_periodo: e.target.value as PeriodoDia })}
                    className="w-full rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-4 py-3 text-sm text-[var(--mq-text)] focus:border-[var(--mq-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--mq-primary)]/20"
                  >
                    <option value="manha">Manhã</option>
                    <option value="tarde">Tarde</option>
                    <option value="noite">Noite</option>
                  </select>
                </div>
                */}

                {/* Tipos de lembretes */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[var(--mq-text)]">Tipos de lembretes:</p>
                  
                  <label className="flex items-start gap-3 rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] p-4 cursor-pointer hover:border-[var(--mq-primary)] hover:bg-[var(--mq-surface)] transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lembretes_conversas_diarias}
                      onChange={(e) => setFormData({ ...formData, lembretes_conversas_diarias: e.target.checked })}
                      className="mt-1 h-4 w-4 accent-[var(--mq-primary)]"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-[var(--mq-text)]">Conversas diárias</div>
                      <div className="text-xs text-[var(--mq-text-muted)] mt-1">
                        Lembrar sobre conversas diárias com o mentor
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] p-4 cursor-pointer hover:border-[var(--mq-primary)] hover:bg-[var(--mq-surface)] transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lembretes_quests}
                      onChange={(e) => setFormData({ ...formData, lembretes_quests: e.target.checked })}
                      className="mt-1 h-4 w-4 accent-[var(--mq-primary)]"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-[var(--mq-text)]">Quests e ações</div>
                      <div className="text-xs text-[var(--mq-text-muted)] mt-1">
                        Lembrar sobre quests pendentes e ações planejadas
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] p-4 cursor-pointer hover:border-[var(--mq-primary)] hover:bg-[var(--mq-surface)] transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lembretes_conquistas}
                      onChange={(e) => setFormData({ ...formData, lembretes_conquistas: e.target.checked })}
                      className="mt-1 h-4 w-4 accent-[var(--mq-primary)]"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-[var(--mq-text)]">Conquistas e níveis</div>
                      <div className="text-xs text-[var(--mq-text-muted)] mt-1">
                        Parabenizar conquistas e mudanças de nível
                      </div>
                    </div>
                  </label>
                </div>

                {/* Canais de notificação */}
                <div>
                  <p className="mb-3 text-sm font-semibold text-[var(--mq-text)]">Canais de notificação:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {(['whatsapp', 'email', 'push', 'sms'] as CanalNotificacao[]).map((canal) => {
                      const isWhatsApp = canal === 'whatsapp';
                      const isSelected = isWhatsApp || formData.lembretes_canais.includes(canal);
                      const isDisabled = !isWhatsApp; // Apenas WhatsApp habilitado por enquanto
                      return (
                        <button
                          key={canal}
                          type="button"
                          onClick={() => !isWhatsApp && !isDisabled && toggleCanal(canal)}
                          disabled={isDisabled}
                          className={`flex items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                            isWhatsApp
                              ? 'border-[var(--mq-primary)] bg-[var(--mq-primary-light)]'
                              : 'border-[var(--mq-border)] bg-[var(--mq-card)] opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className={`${isWhatsApp ? 'text-[var(--mq-primary)]' : 'text-[var(--mq-text-muted)]'}`}>
                            {getCanalIcon(canal)}
                          </div>
                          <span className={`text-xs font-semibold ${isWhatsApp ? 'text-[var(--mq-primary)]' : 'text-[var(--mq-text-muted)]'}`}>
                            {getCanalLabel(canal)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-xs text-[var(--mq-text-muted)]">
                    Outros canais em breve
                  </p>
                </div>
              </div>
            )}
          </motion.section>

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

export default NotificacoesPageV13;

