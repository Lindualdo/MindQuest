/**
 * ARQUIVO: src/components/auth/AuthGuard.tsx
 * AÇÃO: CRIAR novo arquivo
 * 
 * Componente de proteção de rotas
 * Verifica autenticação antes de renderizar o dashboard
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../store/useStore';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, error, initializeAuth } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authChecked) {
        await initializeAuth();
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [initializeAuth, authChecked]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isAuthenticated) {
      return;
    }

    const currentPath = window.location.pathname.toLowerCase();
    // Redirecionar para /app/1.3 após autenticação bem-sucedida
    if (currentPath === '/auth' || currentPath === '/app/auth' || currentPath === '/app') {
      const search = window.location.search;
      window.history.replaceState({}, document.title, `/app/1.3${search}`);
    }
  }, [isAuthenticated]);

  // Loading inicial
  if (isLoading || !authChecked) {
    return (
      <div className="mq-app-v1_3 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--mq-bg)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mq-card p-6 mb-6" style={{ borderRadius: 'var(--mq-radius-lg)' }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--mq-primary)' }}>
                <Brain className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--mq-primary)' }}>
                  MindQuest
                </h1>
                <p className="text-sm" style={{ color: 'var(--mq-text-muted)' }}>Carregando sua experiência...</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2" style={{ color: 'var(--mq-text-muted)' }}>
              <RefreshCw className="animate-spin" size={20} />
              <span>Validando acesso...</span>
            </div>
          </div>
          
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--mq-primary)' }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Erro de autenticação
  if (error || !isAuthenticated) {
    if (error) {
      console.warn('[MindQuest][auth] Falha na autenticação:', error);
    }

    const friendlyMessage =
      'Não foi possível validar seu token de acesso. Solicite um novo link ou tente novamente em instantes.';

    return (
      <div className="mq-app-v1_3 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--mq-bg)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-4"
        >
          <div className="mq-card p-8" style={{ borderRadius: 'var(--mq-radius-lg)' }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--mq-error-light)' }}>
                <AlertTriangle size={32} style={{ color: 'var(--mq-error)' }} />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--mq-error)' }}>
                  Acesso Negado
                </h1>
                <p className="text-sm" style={{ color: 'var(--mq-error)' }}>Problema de autenticação</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p style={{ color: 'var(--mq-text)' }}>{friendlyMessage}</p>
              
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--mq-error-light)', border: '1px solid var(--mq-error)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--mq-error)' }}>
                  Possíveis causas:
                </p>
                <ul className="text-sm mt-2 space-y-1" style={{ color: 'var(--mq-error)' }}>
                  <li>• Token expirado (válido por 7 dias)</li>
                  <li>• Link de acesso inválido</li>
                  <li>• Problemas de conexão</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold"
                  style={{ 
                    backgroundColor: 'var(--mq-error)', 
                    color: '#fff',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  <RefreshCw size={16} />
                  Tentar Novamente
                </button>
                
                <p className="text-xs" style={{ color: 'var(--mq-text-muted)' }}>
                  Se o problema persistir, solicite um novo link de acesso via WhatsApp
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Usuário autenticado - renderiza o conteúdo protegido
  return <>{children}</>;
};

export default AuthGuard;
