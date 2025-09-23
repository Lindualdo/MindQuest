/**
 * ARQUIVO: src/App.tsx
 * AÇÃO: SUBSTITUIR o arquivo existente
 * 
 * Aplicação principal baseada na Especificação v1.1
 * Header com informações do usuário e dashboard completo
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Settings, User, RefreshCw } from 'lucide-react';
import Dashboard from './components/dashboard/Dashboard';
import { useStore } from './store/useStore';

function App() {
  const { dashboardData, refreshData, isLoading } = useStore();
  const { usuario } = dashboardData;

  const handleRefresh = async () => {
    await refreshData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card border-b border-white/20 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo e Nome */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Brain className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MindQuest
                </h1>
                <p className="text-xs text-gray-500">v1.1 - Mente clara, resultados reais</p>
              </div>
            </div>

            {/* Informações do usuário */}
            <div className="flex items-center gap-4">
              {/* Perfil detectado (sutil) */}
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Perfil: {usuario.perfil_detectado.perfil_primario}</span>
                <span className="text-xs text-gray-400">
                  ({usuario.perfil_detectado.confiabilidade_geral}% confiança)
                </span>
              </div>

              {/* Saudação personalizada */}
              <div className="text-right">
                <div className="text-sm font-medium text-gray-800">
                  Olá, {usuario.nome_preferencia}! 👋
                </div>
                <div className="text-xs text-gray-500">
                  Cronotipo: {usuario.cronotipo_detectado}
                </div>
              </div>

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
                    size={18} 
                  />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/80 hover:bg-white rounded-lg transition-colors"
                  title="Configurações"
                >
                  <Settings className="text-gray-600" size={18} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/80 hover:bg-white rounded-lg transition-colors"
                  title="Perfil do usuário"
                >
                  <User className="text-gray-600" size={18} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard />
      </main>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
}

export default App;