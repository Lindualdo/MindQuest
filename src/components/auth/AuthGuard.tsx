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
    if (typeof window === 'undefined') {
      return;
    }

    const currentPath = window.location.pathname.toLowerCase();
    // Redirecionar para /app/1.3 após autenticação bem-sucedida
    if (isAuthenticated && (currentPath === '/auth' || currentPath === '/app/auth')) {
      window.history.replaceState({}, document.title, '/app/1.3');
    }
  }, [isAuthenticated]);

  // Loading inicial
  if (isLoading || !authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="p-6 bg-white rounded-2xl shadow-xl border border-white/20 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Brain className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MindQuest
                </h1>
                <p className="text-sm text-gray-500">Carregando sua experiência...</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <RefreshCw className="animate-spin" size={20} />
              <span>Validando acesso...</span>
            </div>
          </div>
          
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-600 rounded-full"
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-4"
        >
          <div className="p-8 bg-white rounded-2xl shadow-xl border border-red-100">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="text-red-600" size={32} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-red-800">
                  Acesso Negado
                </h1>
                <p className="text-sm text-red-600">Problema de autenticação</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700">{friendlyMessage}</p>
              
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-700">
                  <strong>Possíveis causas:</strong>
                </p>
                <ul className="text-sm text-red-600 mt-2 space-y-1">
                  <li>• Token expirado (válido por 7 dias)</li>
                  <li>• Link de acesso inválido</li>
                  <li>• Problemas de conexão</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  Tentar Novamente
                </button>
                
                <p className="text-xs text-gray-500">
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
