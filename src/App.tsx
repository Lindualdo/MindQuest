/**
 * ARQUIVO: src/App.tsx
 * AÇÃO: SUBSTITUIR arquivo existente
 * 
 * App final limpo e funcional
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle, BookOpen } from 'lucide-react';
import DashboardPage from './pages/App/DashboardPage';
import AuthGuard from './components/auth/AuthGuard';
import HumorHistoryPage from './pages/App/HumorHistoryPage';
import FullChatPage from './pages/App/FullChatPage';
import InsightDetailPage from './pages/App/InsightDetailPage';
import InsightDetailPageV13 from './pages/App/v1.3/InsightDetailPageV13';
import QuestDetailPageV13 from './pages/App/v1.3/QuestDetailPageV13';
import DashPerfilPageV13 from './pages/App/v1.3/DashPerfilPage';
import HumorHistoryPageV13 from './pages/App/v1.3/HumorHistoryPageV13';
import ConversaResumoPageV13 from './pages/App/v1.3/ConversaResumoPageV13';
import MapaMentalPage from './pages/App/v1.3/MapaMentalPage';
import MapaMentalVisualPage from './pages/App/v1.3/MapaMentalVisualPage';
import { useDashboard } from './store/useStore';
import ConquistasPage from './pages/App/ConquistasPage';
import ProximosNiveisPage from './pages/App/ProximosNiveisPage';
import SabotadorDetailPage from './pages/App/SabotadorDetailPage';
import SabotadorDetailPageV13 from './pages/App/v1.3/SabotadorDetailPageV13';
import ResumoConversasPage from './pages/App/ResumoConversasPage';
import PainelQuestsPage from './pages/App/PainelQuestsPage';
import PainelQuestsPageV13 from './pages/App/v1.3/PainelQuestsPageV13';
import PanasDetailPage from './pages/App/PanasDetailPage';
import EmocoesDashboardPage from './pages/App/EmocoesDashboardPage';
import SabotadoresDashboardPage from './pages/App/SabotadoresDashboardPage';
import InsightsDashboardPage from './pages/App/InsightsDashboardPage';
import ConversationGuidePage from './pages/Suport/ConversationGuidePage';
import ComecarAgoraLandingPage from './pages/Marketing/ComecarAgoraLandingPage';
import HomeV1_2 from './pages/App/v1.2/HomeV1_2';
import HomeV1_2_2 from './pages/App/v1.2/HomeV1_2_2';
import HomeV1_3 from './pages/App/v1.3/HomeV1_3';
import mindquestLogo from '@/img/mindquest_logo_vazado_small.png';
import { authService } from './services/authService';

declare global {
  interface Window {
    __MINDQUEST_ROUTING__?: {
      currentPath: string;
      sanitizedPath: string;
      normalizedPath: string;
      resolvedPath?: string;
    };
  }
}

const NotFound: React.FC<{ message?: string }> = ({ message }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg w-full rounded-3xl bg-white p-8 shadow-xl border border-slate-200 text-center space-y-4"
    >
      <h1 className="text-2xl font-bold text-slate-800">Página não encontrada</h1>
      <p className="text-slate-600">
        {message ??
          'Esta rota não está disponível. Verifique o endereço ou acesse o painel pelo domínio principal.'}
      </p>
      <a
        href="/app"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-600 hover:to-purple-600"
      >
        Ir para o painel
      </a>
    </motion.div>
  </div>
);

function App() {
  const rawPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const currentPath = rawPath.toLowerCase();

  const withoutIndex = currentPath.replace(/\/index\.html$/, '/');
  const sanitizedPath = withoutIndex.replace(/\/+$/, '') || '/';
  const normalizedPath = sanitizedPath.replace(/\.html$/, '') || '/';
  const blogSegmentIndex = normalizedPath.indexOf('/blog');
  const resolvedPath =
    blogSegmentIndex >= 0 ? normalizedPath.slice(blogSegmentIndex) || '/blog' : normalizedPath;
  const isBlogPath = blogSegmentIndex >= 0;
  const isSupportConversationGuide = resolvedPath === '/suporte/conversation-guide';
  const isLandingRoute = resolvedPath === '/' || resolvedPath === '/comecar-agora';
  const isAppRoute = resolvedPath === '/app' || resolvedPath.startsWith('/app/');
  const isAppPreviewV12 = resolvedPath === '/app/1.2';
  const isAppPreviewV12_2 = resolvedPath === '/app/1.2.2';
  const isAppPreviewV13 = resolvedPath === '/app/1.3';
  const isRootPath = resolvedPath === '/';
  const redirectHandledRef = useRef(false);

  if (typeof window !== 'undefined') {
    window.__MINDQUEST_ROUTING__ = {
      currentPath,
      sanitizedPath,
      normalizedPath,
      resolvedPath,
    };
    if (import.meta.env.PROD) {
      console.debug('[MindQuest][routing]', {
        currentPath,
        sanitizedPath,
        normalizedPath,
        resolvedPath,
      });
    }
  }

  if (isSupportConversationGuide) {
    return <ConversationGuidePage />;
  }

  if (isAppPreviewV12) {
    return (
      <AuthGuard>
        <HomeV1_2 />
      </AuthGuard>
    );
  }

  if (isAppPreviewV12_2) {
    return (
      <AuthGuard>
        <HomeV1_2_2 />
      </AuthGuard>
    );
  }

  const { 
    dashboardData, 
    refreshData, 
    isLoading, 
    error,
    ultimaAtualizacao,
    view
  } = useDashboard();

  const handleRefresh = async () => {
    await refreshData();
  };

  useEffect(() => {
    if (!isRootPath || redirectHandledRef.current) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const search = window.location.search;
    const hasTokenInQuery = /([?&])token=/i.test(search);
    const hasStoredToken = authService.hasTokenAvailable();

    if (hasTokenInQuery || hasStoredToken) {
      redirectHandledRef.current = true;
      const target = hasTokenInQuery ? `/app${search}` : '/app';
      window.location.replace(target);
    }
  }, [isRootPath]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [view]);

  if (isLandingRoute) {
    return <ComecarAgoraLandingPage />;
  }

  if (isBlogPath) {
    return <NotFound message="Esta página de conteúdo ainda não existe. Atualize os links para os novos caminhos." />;
  }

  if (!isAppRoute && resolvedPath !== '/auth') {
    return <NotFound />;
  }

  // Se há erro nos dados (não confundir com erro de auth)
  if (error && !isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-4"
          >
            <div className="p-8 bg-white rounded-2xl shadow-xl border border-orange-100">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <AlertCircle className="text-orange-600" size={32} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-orange-800">
                    Erro ao Carregar
                  </h1>
                  <p className="text-sm text-orange-600">Dados indisponíveis</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">{error}</p>
                
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={isLoading ? 'animate-spin' : ''} size={16} />
                  {isLoading ? 'Carregando...' : 'Tentar Novamente'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AuthGuard>
    );
  }

  if (isAppRoute && view === 'humorHistorico') {
    return (
      <AuthGuard>
        {isAppPreviewV13 ? <HumorHistoryPageV13 /> : <HumorHistoryPage />}
      </AuthGuard>
    );
  }

  if (isAppPreviewV13) {
    let previewPage: JSX.Element;
    switch (view) {
      case 'insightDetail':
        previewPage = <InsightDetailPageV13 />;
        break;
      case 'dashEmocoes':
        previewPage = <DashPerfilPageV13 />;
        break;
      case 'dashInsights':
        previewPage = <InsightsDashboardPage />;
        break;
      case 'painelQuests':
        previewPage = <PainelQuestsPageV13 />;
        break;
      case 'questDetail':
        previewPage = <QuestDetailPageV13 />;
        break;
      case 'resumoConversas':
        previewPage = <ResumoConversasPage />;
        break;
      case 'conversaResumo':
        previewPage = <ConversaResumoPageV13 />;
        break;
      case 'sabotadorDetail':
        previewPage = <SabotadorDetailPageV13 />;
        break;
      case 'mapaMental':
        previewPage = <MapaMentalPage />;
        break;
      case 'mapaMentalVisual':
        previewPage = <MapaMentalVisualPage />;
        break;
      default:
        previewPage = <HomeV1_3 />;
        break;
    }

    return (
      <AuthGuard>
        {previewPage}
      </AuthGuard>
    );
  }

  if (isAppRoute && view === 'insightDetail') {
    return (
      <AuthGuard>
        {isAppPreviewV13 ? <InsightDetailPageV13 /> : <InsightDetailPage />}
      </AuthGuard>
    );
  }

  if (isAppRoute && view === 'conquistas') {
    return (
      <AuthGuard>
        <ConquistasPage />
      </AuthGuard>
    );
  }

  if (isAppRoute && view === 'proximosNiveis') {
    return (
      <AuthGuard>
        <ProximosNiveisPage />
      </AuthGuard>
    );
  }

  if (isAppRoute && view === 'dashEmocoes') {
    return (
      <AuthGuard>
        <EmocoesDashboardPage />
      </AuthGuard>
    );
  }

  if (isAppRoute && view === 'mapaMental') {
    return (
      <AuthGuard>
        <MapaMentalPage />
      </AuthGuard>
    );
  }

  if (isAppRoute && view === 'conversaResumo') {
    return (
      <AuthGuard>
        <ConversaResumoPageV13 />
      </AuthGuard>
    );
  }

  if (isAppRoute && view === 'mapaMentalVisual') {
    return (
      <AuthGuard>
        <MapaMentalVisualPage />
      </AuthGuard>
    );
  }

  if (isAppRoute && view === 'dashSabotadores') {
    return (
      <AuthGuard>
        <SabotadoresDashboardPage />
      </AuthGuard>
    );
  }

  if (isAppRoute && view === 'dashInsights') {
    return (
      <AuthGuard>
        <InsightsDashboardPage />
      </AuthGuard>
    );
  }

  if (isAppRoute && view === 'sabotadorDetail') {
    return (
      <AuthGuard>
        {isAppPreviewV13 ? <SabotadorDetailPageV13 /> : <SabotadorDetailPage />}
      </AuthGuard>
    );
  }

  if (isAppRoute && view === 'panasDetail') {
    return (
      <AuthGuard>
        <PanasDetailPage />
      </AuthGuard>
    );
  }

  if (isAppRoute && view === 'resumoConversas') {
    return (
      <AuthGuard>
        <ResumoConversasPage />
      </AuthGuard>
    );
  }

  if (isAppRoute && view === 'fullChatDetail') {
    return (
      <AuthGuard>
        <FullChatPage />
      </AuthGuard>
    );
  }

  if (isAppRoute && view === 'painelQuests') {
    return (
      <AuthGuard>
      {isAppPreviewV13 ? <PainelQuestsPageV13 /> : <PainelQuestsPage />}
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="mindquest-dashboard min-h-screen">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border-b border-white/20 sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:h-16">
              <div className="flex items-center gap-3">
                <img
                  src={mindquestLogo}
                  alt="MindQuest"
                  width={40}
                  height={40}
                  decoding="async"
                  className="h-10 w-auto drop-shadow-sm"
                />
                <div className="leading-tight">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: '#D90368' }}
                  >
                    MindQuest
                  </p>
                  <p
                    className="text-xs font-medium"
                    style={{ color: '#4F5779' }}
                  >
                    mente clara, resultados reais · v1.1.6
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                {dashboardData?.usuario && (
                  <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>
                      Perfil: {dashboardData.usuario.perfil_detectado.perfil_primario}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 text-sm font-medium text-gray-800 sm:flex-row sm:items-center sm:text-right">
                  <span>
                    Olá, {dashboardData?.usuario?.nome_preferencia || 'Usuário'}! 👋
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRefresh}
                      disabled={isLoading}
                      className="p-2 bg-white/80 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
                      title="Atualizar dados"
                    >
                      <RefreshCw
                        className={`text-gray-600 ${isLoading ? 'animate-spin' : ''}`}
                        size={16}
                      />
                    </motion.button>
                    <a
                      href="/suporte/conversation-guide"
                      className="inline-flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 text-xs font-semibold text-indigo-600 shadow-sm hover:bg-white"
                    >
                      <BookOpen size={16} />
                      Guia de Conversa
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Conteúdo Principal */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Indicador de última atualização */}
          {ultimaAtualizacao && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-4"
            >
              <p className="text-xs text-gray-400">
                Última atualização: {new Date(ultimaAtualizacao).toLocaleString('pt-BR')}
              </p>
            </motion.div>
          )}

          {/* Dashboard */}
          <DashboardPage />
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-gray-400 py-6"
        >
          <div className="max-w-7xl mx-auto px-4">
            <p>MindQuest v1.1.6 - Mente clara, resultados reais.</p>
          </div>
        </motion.footer>
      </div>
    </AuthGuard>
  );
}

export default App;
