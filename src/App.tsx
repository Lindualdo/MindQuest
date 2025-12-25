/**
 * ARQUIVO: src/App.tsx
 * AÇÃO: App limpo - apenas v1.3, marketing e suporte
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle } from 'lucide-react';
import AuthGuard from './components/auth/AuthGuard';
import InsightDetailPageV13 from './pages/App/v1.3/InsightDetailPageV13';
import QuestDetailPageV13 from './pages/App/v1.3/QuestDetailPageV13';
import DashPerfilPageV13 from './pages/App/v1.3/DashPerfilPage';
import HumorHistoryPageV13 from './pages/App/v1.3/HumorHistoryPageV13';
import ConversaResumoPageV13 from './pages/App/v1.3/ConversaResumoPageV13';
import MapaMentalPage from './pages/App/v1.3/MapaMentalPage';
import MapaMentalVisualPage from './pages/App/v1.3/MapaMentalVisualPage';
import { useDashboard } from './store/useStore';
import SabotadorDetailPageV13 from './pages/App/v1.3/SabotadorDetailPageV13';
import SabotadorAcoesPage from './pages/App/v1.3/SabotadorAcoesPage';
import SabotadorOcorrenciasPage from './pages/App/v1.3/SabotadorOcorrenciasPage';
import PerfilBigFiveDetailPageV13 from './pages/App/v1.3/PerfilBigFiveDetailPageV13';
import PainelQuestsPageV13 from './pages/App/v1.3/PainelQuestsPageV13';
import InsightsDashboardPageV13 from './pages/App/v1.3/InsightsDashboardPageV13';
import InsightsHistoricoPageV13 from './pages/App/v1.3/InsightsHistoricoPageV13';
import EvoluirPageV13 from './pages/App/v1.3/EvoluirPageV13';
import AjustesPageV13 from './pages/App/v1.3/AjustesPageV13';
import InteracoesIAPageV13 from './pages/App/v1.3/InteracoesIAPageV13';
import PerfilPessoalPageV13 from './pages/App/v1.3/PerfilPessoalPageV13';
import NotificacoesPageV13 from './pages/App/v1.3/NotificacoesPageV13';
import ObjetivosPageV13 from './pages/App/v1.3/ObjetivosPageV13';
import AparenciaPageV13 from './pages/App/v1.3/AparenciaPageV13';
import CheckinSemanalPageV13 from './pages/App/v1.3/CheckinSemanalPageV13';
import ConquistasVidaPageV13 from './pages/App/v1.3/ConquistasVidaPageV13';
import ConexaoAcoesObjetivosPageV13 from './pages/App/v1.3/ConexaoAcoesObjetivosPageV13';
import ConexaoAcoesSabotadoresPageV13 from './pages/App/v1.3/ConexaoAcoesSabotadoresPageV13';
import NiveisJornadaPageV13 from './pages/App/v1.3/NiveisJornadaPageV13';
import AjudaPageV13 from './pages/App/v1.3/AjudaPageV13';
import CursorUsageDash from './pages/App/cursor/CursorUsageDash';
import CursorCobrancaPage from './pages/App/cursor/CursorCobrancaPage';
import CursorModelosPage from './pages/App/cursor/CursorModelosPage';
import CursorContextoPage from './pages/App/cursor/CursorContextoPage';
import ConversationGuidePage from './pages/Suport/ConversationGuidePage';
import ComecarAgoraLandingPage from './pages/Marketing/ComecarAgoraLandingPage';
import ConversarPageV13 from './pages/App/v1.3/ConversarPageV13';
import { ThemeProvider } from './components/app/v1.3/ThemeProvider';
import { registerPushToken } from './utils/pushNotifications';

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
        href="/app/1.3"
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

  // Rotas públicas: Cursor Usage Dashboard e Guias
  const isCursorUsageRoute = 
    resolvedPath === '/app/cursor-usage' || 
    resolvedPath === '/cursor-usage' ||
    resolvedPath === '/app/1.3/cursor-usage' ||
    (isAppRoute && typeof window !== 'undefined' && 
     (window.location.pathname.toLowerCase().includes('cursor-usage') || 
      window.location.search.includes('view=cursorUsage')));
  
  const isCursorCobrancaRoute = 
    resolvedPath === '/app/cursor-cobranca' || 
    resolvedPath === '/cursor-cobranca' ||
    (isAppRoute && typeof window !== 'undefined' && 
     window.location.pathname.toLowerCase().includes('cursor-cobranca'));
  
  const isCursorModelosRoute = 
    resolvedPath === '/app/cursor-modelos' || 
    resolvedPath === '/cursor-modelos' ||
    (isAppRoute && typeof window !== 'undefined' && 
     window.location.pathname.toLowerCase().includes('cursor-modelos'));
  
  const isCursorContextoRoute = 
    resolvedPath === '/app/cursor-contexto' || 
    resolvedPath === '/cursor-contexto' ||
    (isAppRoute && typeof window !== 'undefined' && 
     window.location.pathname.toLowerCase().includes('cursor-contexto'));
  
  if (isCursorUsageRoute) {
    return (
      <ThemeProvider>
        <CursorUsageDash />
      </ThemeProvider>
    );
  }
  
  if (isCursorCobrancaRoute) {
    return (
      <ThemeProvider>
        <CursorCobrancaPage />
      </ThemeProvider>
    );
  }
  
  if (isCursorModelosRoute) {
    return (
      <ThemeProvider>
        <CursorModelosPage />
      </ThemeProvider>
    );
  }
  
  if (isCursorContextoRoute) {
    return (
      <ThemeProvider>
        <CursorContextoPage />
      </ThemeProvider>
    );
  }

  const { 
    refreshData, 
    isLoading, 
    error,
    view,
    dashboardData,
    isAuthenticated
  } = useDashboard();

  const handleRefresh = async () => {
    await refreshData();
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [view]);

  // Registrar push notifications quando usuário estiver autenticado
  useEffect(() => {
    if (!isAppRoute) return;
    if (!isAuthenticated) return;
    if (!dashboardData?.usuario?.id) return;
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const userId = dashboardData.usuario.id;
    
    // Aguardar um pouco para garantir que o app está carregado
    const timer = setTimeout(() => {
      registerPushToken(userId).catch((error) => {
        console.error('[App] Erro ao registrar push token:', error);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAppRoute, isAuthenticated, dashboardData?.usuario?.id]);

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

  // Rotas v1.3 - todas as rotas de app agora usam v1.3
  if (isAppRoute) {
    let page: React.ReactElement;

    switch (view) {
      case 'insightDetail':
        page = <InsightDetailPageV13 />;
        break;
      case 'dashEmocoes':
        page = <DashPerfilPageV13 />;
        break;
      case 'dashInsights':
        page = <InsightsDashboardPageV13 />;
        break;
      case 'insightsHistorico':
        page = <InsightsHistoricoPageV13 />;
        break;
      case 'painelQuests':
        page = <PainelQuestsPageV13 />;
        break;
      case 'questDetail':
        page = <QuestDetailPageV13 />;
        break;
      case 'resumoConversas':
        // Fallback para conversaResumo
        page = <ConversaResumoPageV13 />;
        break;
      case 'conversaResumo':
        page = <ConversaResumoPageV13 />;
        break;
      case 'sabotadorDetail':
        page = <SabotadorDetailPageV13 />;
        break;
      case 'sabotadorAcoes':
        page = <SabotadorAcoesPage />;
        break;
      case 'perfilBigFiveDetail':
        page = <PerfilBigFiveDetailPageV13 />;
        break;
      case 'sabotadorOcorrencias':
        page = <SabotadorOcorrenciasPage />;
        break;
      case 'mapaMental':
        page = <MapaMentalPage />;
        break;
      case 'mapaMentalVisual':
        page = <MapaMentalVisualPage />;
        break;
      case 'humorHistorico':
        page = <HumorHistoryPageV13 />;
        break;
      case 'evoluir':
      case 'jornada':
        page = <EvoluirPageV13 />;
        break;
      case 'ajustes':
        page = <AjustesPageV13 />;
        break;
      case 'interacoesIA':
        page = <InteracoesIAPageV13 />;
        break;
      case 'perfilPessoal':
        page = <PerfilPessoalPageV13 />;
        break;
      case 'objetivos':
        page = <ObjetivosPageV13 />;
        break;
      case 'aparencia':
        page = <AparenciaPageV13 />;
        break;
      case 'notificacoes':
        page = <NotificacoesPageV13 />;
        break;
      case 'checkinSemanal':
        page = <CheckinSemanalPageV13 />;
        break;
      case 'conquistasVida':
        page = <ConquistasVidaPageV13 />;
        break;
      case 'conexaoAcoesObjetivos':
        page = <ConexaoAcoesObjetivosPageV13 />;
        break;
      case 'conexaoAcoesSabotadores':
        page = <ConexaoAcoesSabotadoresPageV13 />;
        break;
      case 'niveisJornada':
        page = <NiveisJornadaPageV13 />;
        break;
      case 'ajuda':
        page = <AjudaPageV13 />;
        break;
      case 'conversar':
      case 'dashboard':
      default:
        page = <ConversarPageV13 />;
        break;
    }

    return (
      <ThemeProvider>
        <AuthGuard>
          {page}
        </AuthGuard>
      </ThemeProvider>
    );
  }

  // Fallback: redirecionar para v1.3
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-4"
        >
          <div className="p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
            <h1 className="text-xl font-bold text-slate-800 mb-4">Redirecionando...</h1>
            <p className="text-slate-600 mb-6">
              Você será redirecionado para a versão mais recente do app.
            </p>
            <a
              href="/app/1.3"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-600 hover:to-purple-600"
            >
              Ir para o painel
            </a>
          </div>
        </motion.div>
      </div>
    </AuthGuard>
  );
}

export default App;
