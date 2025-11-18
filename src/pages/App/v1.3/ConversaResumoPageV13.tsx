import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import HeaderV1_2 from '@/components/app/v1.2/HeaderV1_2';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';
import { format } from 'date-fns';

const ConversaResumoPageV13 = () => {
  const {
    dashboardData,
    conversaResumo,
    conversaResumoLoading,
    conversaResumoError,
    selectedConversationId,
    loadConversaResumo,
    closeConversaResumo,
    setView,
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const [activeTab, setActiveTab] = useState<TabId>('home');

  const conversaIdAtual = useMemo(() => {
    if (!conversaResumo) return null;
    const rawId =
      (conversaResumo.conversa_id as string | number | undefined) ??
      (conversaResumo.id as string | number | undefined) ??
      (conversaResumo.chat_id as string | number | undefined);
    if (typeof rawId === 'number') return String(rawId);
    if (typeof rawId === 'string') return rawId;
    return null;
  }, [conversaResumo]);

  useEffect(() => {
    if (!selectedConversationId) {
      setView('humorHistorico');
      return;
    }

    if (!conversaResumo || conversaIdAtual !== String(selectedConversationId)) {
      void loadConversaResumo(selectedConversationId);
    }
  }, [selectedConversationId, conversaResumo, conversaIdAtual, loadConversaResumo, setView]);

  const paragraphs = useMemo(() => {
    const texto = conversaResumo?.resumo_conversa?.trim();
    if (!texto) return [];
    return texto.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
  }, [conversaResumo]);

  const detalhesExtras = useMemo(() => {
    if (!conversaResumo) return [];
    const ignorar = new Set([
      'resumo_conversa',
      'data_conversa',
      'conversa_id',
      'id',
      'chat_id',
    ]);
    return Object.entries(conversaResumo)
      .filter(([key, value]) => !ignorar.has(key) && value !== undefined && value !== null)
      .map(([key, value]) => ({ key, value }));
  }, [conversaResumo]);

  const handleBack = () => {
    closeConversaResumo();
    setActiveTab('home');
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
  };

  return (
    <div className="mq-app-v1_2 flex min-h-screen flex-col bg-[#F5EBF3]">
      <HeaderV1_2 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[0.75rem] font-semibold text-[#1C2541] shadow"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          <div className="flex-1 text-right text-[0.7rem] font-semibold uppercase tracking-wide text-[#1C2541]">
            Resumo da conversa
          </div>
        </div>

        <Card className="!p-0 overflow-hidden" hover={false}>
          <div className="flex items-start gap-3 border-b border-white/40 bg-white/80 p-5">
            <div className="rounded-2xl bg-[#E0F2FE] p-3">
              <MessageSquare className="text-[#1D4ED8]" size={18} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[#1C2541]">Resumo da conversa</h2>
            </div>
          </div>

          <div className="space-y-4 p-5">
            {conversaResumoLoading && (
              <p className="text-center text-sm text-[#475569]">Carregando resumo…</p>
            )}

            {conversaResumoError && (
              <p className="text-center text-sm text-red-500">{conversaResumoError}</p>
            )}

            {!conversaResumoLoading && !conversaResumoError && !conversaResumo && (
              <p className="text-center text-sm text-[#475569]">
                Nenhum resumo disponível para esta conversa.
              </p>
            )}

            {conversaResumo && (
              <div className="space-y-4">
                {conversaResumo.data_conversa && (
                  <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white px-3 py-2 text-xs font-semibold text-[#475569]">
                    <span>Conversa</span>
                    <span className="rounded-full bg-[#E0F2FE] px-2 py-0.5 text-[0.65rem] font-semibold text-[#1D4ED8]">
                      {format(new Date(conversaResumo.data_conversa), 'dd/MM/yyyy')}
                    </span>
                  </div>
                )}

                {paragraphs.length > 0 && (
                  <div className="space-y-3 rounded-2xl border border-white/60 bg-white px-4 py-3 text-sm leading-relaxed text-[#1F2937]">
                    {paragraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}

                {detalhesExtras.length > 0 && (
                  <div className="space-y-2 rounded-2xl border border-white/60 bg-white px-4 py-3 text-xs text-[#475569]">
                    {detalhesExtras.map(({ key, value }) => (
                      <div key={key}>
                        <p className="font-semibold uppercase tracking-wide text-[#94A3B8]">{key}</p>
                        <p className="text-sm text-[#1F2937]">
                          {typeof value === 'string' || typeof value === 'number'
                            ? value
                            : JSON.stringify(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
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

export default ConversaResumoPageV13;
