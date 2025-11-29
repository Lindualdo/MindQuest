import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

interface PerfilPessoalData {
  nome_preferencia: string;
  nome_assistente: string | null;
  tom_conversa: 'empativo' | 'interativo' | 'educativo' | 'equilibrado' | 'direto' | null;
  sobre_voce: string | null;
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

  const [activeTab, setActiveTab] = useState<TabId>('ajustes');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<PerfilPessoalData>({
    nome_preferencia: nomeUsuario,
    nome_assistente: null,
    tom_conversa: null,
    sobre_voce: null,
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
            nome_assistente: data.perfil.nome_assistente || null,
            tom_conversa: data.perfil.tom_conversa || null,
            sobre_voce: data.perfil.sobre_voce || null,
          });
        }
      } catch (error) {
        console.error('[PerfilPessoal] Erro ao carregar perfil:', error);
        // Em caso de erro, usar dados do dashboard
        setFormData({
          nome_preferencia: nomeUsuario,
          nome_assistente: null,
          tom_conversa: null,
          sobre_voce: null,
        });
      } finally {
        setLoading(false);
      }
    };

    loadPerfil();
  }, [usuarioId, nomeUsuario, dashboardData?.usuario?.cronotipo_detectado]);

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
    setView('dashEmocoes');
  };

  const handleNavQuests = () => {
    setActiveTab('quests');
    setView('painelQuests');
  };

  const handleNavConfig = () => {
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
            nome_assistente: data.perfil.nome_assistente || null,
            tom_conversa: data.perfil.tom_conversa || null,
            sobre_voce: data.perfil.sobre_voce || null,
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
          <Loader2 size={32} className="animate-spin text-[#0EA5E9]" />
          <p className="mt-4 text-sm text-[#64748B]">Carregando perfil...</p>
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
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1C2541] shadow-md hover:shadow-lg transition-all active:scale-98"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        {/* Título da página */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#1C2541] mb-1">
            Perfil Pessoal
          </h1>
          <p className="text-sm text-[#64748B]">
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
        <div className="space-y-4 rounded-2xl bg-[#E8F3F5] p-6 border border-[#B6D6DF]">
          {/* Nome Preferido */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1C2541]">
              Nome Preferido
            </label>
            <input
              type="text"
              value={formData.nome_preferencia}
              onChange={(e) => setFormData({ ...formData, nome_preferencia: e.target.value })}
              className="w-full rounded-xl border border-[#B6D6DF] bg-white px-4 py-3 text-sm text-[#1C2541] focus:border-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20"
              placeholder="Como você prefere ser chamado?"
            />
          </div>

          {/* Nome Assistente */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1C2541]">
              Nome do Assistente
            </label>
            <input
              type="text"
              value={formData.nome_assistente || ''}
              onChange={(e) => setFormData({ ...formData, nome_assistente: e.target.value || null })}
              className="w-full rounded-xl border border-[#B6D6DF] bg-white px-4 py-3 text-sm text-[#1C2541] focus:border-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20"
              placeholder="Como você quer chamar seu assistente?"
            />
            <p className="mt-1 text-xs text-[#64748B]">
              Personalize como o assistente de IA se apresenta para você
            </p>
          </div>

          {/* Tom de Conversa */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-[#1C2541]">
              Tom de Conversa
            </label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 rounded-xl border border-[#B6D6DF] bg-white p-4 cursor-pointer hover:border-[#0EA5E9] hover:bg-[#E8F3F5]/50 transition-colors">
                <input
                  type="radio"
                  name="tom_conversa"
                  value="empativo"
                  checked={formData.tom_conversa === 'empativo'}
                  onChange={(e) => setFormData({ ...formData, tom_conversa: e.target.value as any })}
                  className="mt-1 h-4 w-4 text-[#0EA5E9] focus:ring-[#0EA5E9]"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[#1C2541]">Empático (padrão)</div>
                  <div className="text-xs text-[#64748B] mt-1">
                    Respostas compassivas e acolhedoras, focadas em entender suas emoções
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-[#B6D6DF] bg-white p-4 cursor-pointer hover:border-[#0EA5E9] hover:bg-[#E8F3F5]/50 transition-colors">
                <input
                  type="radio"
                  name="tom_conversa"
                  value="interativo"
                  checked={formData.tom_conversa === 'interativo'}
                  onChange={(e) => setFormData({ ...formData, tom_conversa: e.target.value as any })}
                  className="mt-1 h-4 w-4 text-[#0EA5E9] focus:ring-[#0EA5E9]"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[#1C2541]">Interativo</div>
                  <div className="text-xs text-[#64748B] mt-1">
                    Diálogo colaborativo com perguntas que te ajudam a refletir e descobrir respostas
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-[#B6D6DF] bg-white p-4 cursor-pointer hover:border-[#0EA5E9] hover:bg-[#E8F3F5]/50 transition-colors">
                <input
                  type="radio"
                  name="tom_conversa"
                  value="educativo"
                  checked={formData.tom_conversa === 'educativo'}
                  onChange={(e) => setFormData({ ...formData, tom_conversa: e.target.value as any })}
                  className="mt-1 h-4 w-4 text-[#0EA5E9] focus:ring-[#0EA5E9]"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[#1C2541]">Educativo</div>
                  <div className="text-xs text-[#64748B] mt-1">
                    Explicações passo a passo para te ensinar técnicas e conceitos de desenvolvimento pessoal
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-[#B6D6DF] bg-white p-4 cursor-pointer hover:border-[#0EA5E9] hover:bg-[#E8F3F5]/50 transition-colors">
                <input
                  type="radio"
                  name="tom_conversa"
                  value="equilibrado"
                  checked={formData.tom_conversa === 'equilibrado'}
                  onChange={(e) => setFormData({ ...formData, tom_conversa: e.target.value as any })}
                  className="mt-1 h-4 w-4 text-[#0EA5E9] focus:ring-[#0EA5E9]"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[#1C2541]">Equilibrado</div>
                  <div className="text-xs text-[#64748B] mt-1">
                    Combina acolhimento empático com perguntas interativas para uma experiência completa
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-[#B6D6DF] bg-white p-4 cursor-pointer hover:border-[#0EA5E9] hover:bg-[#E8F3F5]/50 transition-colors">
                <input
                  type="radio"
                  name="tom_conversa"
                  value="direto"
                  checked={formData.tom_conversa === 'direto'}
                  onChange={(e) => setFormData({ ...formData, tom_conversa: e.target.value as any })}
                  className="mt-1 h-4 w-4 text-[#0EA5E9] focus:ring-[#0EA5E9]"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[#1C2541]">Direto/Firme</div>
                  <div className="text-xs text-[#64748B] mt-1">
                    Tom mais direto e firme, como um mentor que te desafia e não tem medo de ser direto
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Conte mais sobre você */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1C2541]">
              Conte Mais Sobre Você
            </label>
            <p className="mb-3 text-xs text-[#64748B]">
              Compartilhe seu contexto: histórico relevante, valores, desafios atuais e situações importantes para personalizar sua experiência.
            </p>
            <textarea
              value={formData.sobre_voce || ''}
              onChange={(e) => setFormData({ ...formData, sobre_voce: e.target.value || null })}
              rows={4}
              className="w-full rounded-xl border border-[#B6D6DF] bg-white px-4 py-3 text-sm text-[#1C2541] focus:border-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 resize-none"
              placeholder="Exemplo: Tenho dois filhos, estou divorciado há dois anos, terminei um casamento de 26 anos. Mudei recentemente para Portugal..."
            />
          </div>

          {/* Botão Salvar */}
          <motion.button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-xl bg-[#0EA5E9] px-6 py-4 text-sm font-bold text-white shadow-lg hover:bg-[#0C94D2] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
        onHome={handleNavHome}
        onPerfil={handleNavPerfil}
        onQuests={handleNavQuests}
        onConfig={handleNavConfig}
      />
    </div>
  );
};

export default PerfilPessoalPageV13;

