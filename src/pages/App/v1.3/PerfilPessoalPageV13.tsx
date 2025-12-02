import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

interface PerfilPessoalData {
  nome_preferencia: string;
}

const PerfilPessoalPageV13: React.FC = () => {
  const {
    dashboardData,
    setView,
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const usuarioId = dashboardData?.usuario?.id;

  const [activeTab, setActiveTab] = useState<TabId>('evoluir');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<PerfilPessoalData>({
    nome_preferencia: nomeUsuario,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Carregar dados do perfil
  useEffect(() => {
    const loadPerfil = async () => {
      if (!usuarioId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/perfil-pessoal?user_id=${encodeURIComponent(usuarioId)}`);
        
        if (!response.ok) {
          throw new Error(`Erro ao carregar perfil: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.perfil) {
          setFormData({
            nome_preferencia: data.perfil.nome_preferencia || nomeUsuario,
          });
        }
      } catch (error) {
        console.error('[PerfilPessoal] Erro ao carregar perfil:', error);
        // Em caso de erro, usar dados do dashboard
        setFormData({
          nome_preferencia: nomeUsuario,
        });
      } finally {
        setLoading(false);
      }
    };

    loadPerfil();
  }, [usuarioId, nomeUsuario, dashboardData?.usuario?.cronotipo_detectado]);

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
        throw new Error(errorData.error || 'Erro ao salvar perfil');
      }

      const data = await response.json();
      if (data.success) {
        // Atualizar dados do formulário com a resposta
        if (data.perfil) {
          setFormData({
            nome_preferencia: data.perfil.nome_preferencia || formData.nome_preferencia,
          });
        }
        setSuccess(true);
        // Scroll para o topo para mostrar mensagem de sucesso
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Voltar automaticamente após 2 segundos
        setTimeout(() => {
          handleBack();
        }, 2000);
      } else {
        throw new Error(data.error || 'Erro ao salvar perfil');
      }
    } catch (error) {
      console.error('[PerfilPessoal] Erro ao salvar:', error);
      setError(error instanceof Error ? error.message : 'Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mq-app-v1_3 flex min-h-screen flex-col">
        <HeaderV1_3 nomeUsuario={nomeUsuario} />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 pb-24 pt-4">
          <Loader2 size={32} className="animate-spin text-[var(--mq-primary)]" />
          <p className="mt-4 text-sm text-[var(--mq-text-muted)]">Carregando perfil...</p>
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
          <h1 className="mq-page-title">
            Perfil Pessoal
          </h1>
          <p className="mq-page-subtitle">
            Personalize sua experiência
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
            ✅ Perfil salvo com sucesso!
          </motion.div>
        )}

        {/* Formulário */}
        <div className="mq-card space-y-4 p-6" style={{ borderRadius: 24 }}>
          {/* Nome Preferido */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--mq-text)]">
              Nome Preferido
            </label>
            <input
              type="text"
              value={formData.nome_preferencia}
              onChange={(e) => setFormData({ ...formData, nome_preferencia: e.target.value })}
              className="w-full rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-4 py-3 text-sm text-[var(--mq-text)] focus:border-[var(--mq-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--mq-primary)]/20"
              placeholder="Como você prefere ser chamado?"
            />
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
                Salvar Perfil
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

export default PerfilPessoalPageV13;

