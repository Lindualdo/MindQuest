/**
 * ARQUIVO: src/App.tsx
 * AÇÃO: SUBSTITUIR arquivo existente
 * 
 * App final limpo e funcional
 */

import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle } from 'lucide-react';
import DashboardPage from './pages/App/DashboardPage';
import AuthGuard from './components/auth/AuthGuard';
import HumorHistoryPage from './pages/App/HumorHistoryPage';
import FullChatPage from './pages/App/FullChatPage';
import InsightDetailPage from './pages/App/InsightDetailPage';
import { useDashboard } from './store/useStore';
import ConquistasPage from './pages/App/ConquistasPage';
import SabotadorDetailPage from './pages/App/SabotadorDetailPage';
import ResumoConversasPage from './pages/App/ResumoConversasPage';
import PanasDetailPage from './pages/App/PanasDetailPage';
import ConversationGuidePage from './pages/Suport/ConversationGuidePage';
import ComecarAgoraLandingPage from './pages/Marketing/ComecarAgoraLandingPage';
import mindquestLogo from '@/img/mindquest_logo_vazado_small.png';

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

  if (isAppRoute && view === 'insightDetail') {
    return (
      <AuthGuard>
        <InsightDetailPage />
      </AuthGuard>
    );
  }

  if (isAppRoute && view === 'humorHistorico') {
    return (
      <AuthGuard>
        <HumorHistoryPage />
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

  if (isAppRoute && view === 'sabotadorDetail') {
    return (
      <AuthGuard>
        <SabotadorDetailPage />
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
              {/* Logo e Nome */}
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

              {/* Informações do usuário */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                {/* Perfil detectado (sutil) - só mostra se tiver dados */}
                {dashboardData?.usuario && (
                  <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>
                      Perfil: {dashboardData.usuario.perfil_detectado.perfil_primario}
                    </span>
                  </div>
                )}

                {/* Saudação personalizada */}
                <div className="flex items-center justify-between gap-3 text-sm font-medium text-gray-800 sm:flex-row sm:items-center sm:text-right">
                  <span>
                    Olá, {dashboardData?.usuario?.nome_preferencia || 'Usuário'}! 👋
                  </span>

                  {/* Botões de ação */}
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
