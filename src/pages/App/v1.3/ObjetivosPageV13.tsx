import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2, CheckCircle2 } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

const ObjetivosPageV13: React.FC = () => {
  const {
    dashboardData,
    setView,
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const usuarioId = dashboardData?.usuario?.id;

  const [activeTab, setActiveTab] = useState<TabId>('ajustes');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [objetivo, setObjetivo] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Carregar dados dos objetivos
  useEffect(() => {
    const loadObjetivos = async () => {
      if (!usuarioId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/objetivos?user_id=${encodeURIComponent(usuarioId)}`);
        
        if (!response.ok) {
          throw new Error(`Erro ao carregar objetivos: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.objetivo) {
          setObjetivo(data.objetivo || '');
        }
      } catch (error) {
        console.error('[Objetivos] Erro ao carregar objetivos:', error);
        setObjetivo('');
      } finally {
        setLoading(false);
      }
    };

    loadObjetivos();
  }, [usuarioId]);

  const handleBack = () => {
    setView('evoluir');
    setActiveTab('ajustes');
  };

  const handleNavHome = () => {
    setActiveTab('home');
    setView('dashboard');
  };

  const handleNavPerfil = () => {
    setActiveTab('perfil');
    setView('perfil');
  };

  const handleNavQuests = () => {
    setActiveTab('quests');
    setView('painelQuests');
  };

  const handleNavAjustes = () => {
    setActiveTab('ajustes');
    setView('evoluir');
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

      const response = await fetch('/api/objetivos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: usuarioId,
          objetivo: objetivo || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Scroll para o topo para mostrar mensagem de sucesso
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Esconder mensagem de sucesso e voltar para a página Evoluir após 2 segundos
        setTimeout(() => {
          setSuccess(false);
          setView('evoluir'); // Redireciona para a página Evoluir
        }, 2000);
      } else {
        throw new Error(data.error || 'Erro ao salvar objetivos');
      }
    } catch (error) {
      console.error('[Objetivos] Erro ao salvar:', error);
      setError(error instanceof Error ? error.message : 'Erro ao salvar objetivos');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mq-app-v1_3 flex min-h-screen flex-col bg-[#F5EBF3]">
        <HeaderV1_3 nomeUsuario={nomeUsuario} />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#0EA5E9]" />
        </main>
        <BottomNavV1_3
          activeTab={activeTab}
          onNavHome={handleNavHome}
          onNavPerfil={handleNavPerfil}
          onNavQuests={handleNavQuests}
          onNavAjustes={handleNavAjustes}
        />
      </div>
    );
  }

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col bg-[#F5EBF3]">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
        {/* Botão voltar */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1C2541] shadow-md hover:shadow-lg transition-all active:scale-98"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        {/* Título da página */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#1C2541] mb-1">
            Objetivos
          </h1>
          <p className="text-sm text-[#64748B]">
            Defina sua meta de transformação
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
            className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
          >
            <CheckCircle2 size={18} />
            Objetivos salvos com sucesso!
          </motion.div>
        )}

        {/* Formulário */}
        <div className="space-y-4 rounded-2xl bg-[#E8F3F5] p-6 border border-[#B6D6DF]">
          {/* Objetivos */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1C2541]">
              Meus Objetivos
            </label>
            <p className="mb-3 text-xs text-[#64748B]">
              Liste seus principais objetivos por ordem de prioridade. O sistema usará essas informações para personalizar suas quests e ações.
            </p>
            <textarea
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              rows={6}
              className="w-full rounded-xl border border-[#B6D6DF] bg-white px-4 py-3 text-sm text-[#1C2541] focus:border-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 resize-none"
              placeholder="Exemplo:&#10;1. Desenvolver mais autoconhecimento e melhorar meus relacionamentos&#10;2. Aumentar minha produtividade no trabalho&#10;3. Melhorar minha saúde emocional e bem-estar..."
            />
          </div>
        </div>

        {/* Botão Salvar */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-xl bg-[#0EA5E9] px-6 py-4 text-sm font-bold text-white shadow-lg hover:bg-[#0C94D2] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={18} />
                Salvar Objetivos
              </>
            )}
          </button>
        </div>
      </main>

      <BottomNavV1_3
        activeTab={activeTab}
        onNavHome={handleNavHome}
        onNavPerfil={handleNavPerfil}
        onNavQuests={handleNavQuests}
        onNavAjustes={handleNavAjustes}
      />
    </div>
  );
};

export default ObjetivosPageV13;

