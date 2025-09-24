/**
 * ARQUIVO: src/components/common/ErrorBoundary.tsx
 * AÇÃO: SUBSTITUIR arquivo existente
 * 
 * ErrorBoundary com import correto do React
 */

import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleRefresh = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-lg mx-4"
          >
            <div className="p-8 bg-white rounded-2xl shadow-xl border border-red-100">
              {/* Ícone e Título */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="text-red-600" size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-red-800">
                    Oops! Algo deu errado
                  </h1>
                  <p className="text-sm text-red-600">Erro inesperado na aplicação</p>
                </div>
              </div>

              {/* Mensagem principal */}
              <div className="space-y-4 mb-6">
                <p className="text-gray-700">
                  Encontramos um problema inesperado. Nosso time foi notificado e estamos 
                  trabalhando para resolver.
                </p>

                {/* Detalhes do erro (apenas em desenvolvimento) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-left">
                    <p className="font-medium text-red-800 mb-2">Detalhes técnicos:</p>
                    <pre className="text-xs text-red-700 overflow-auto max-h-32">
                      {this.state.error.message}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={this.handleRefresh}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={16} />
                    Recarregar Página
                  </button>
                  
                  <button
                    onClick={this.handleGoHome}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Home size={16} />
                    Início
                  </button>
                </div>

                <p className="text-xs text-gray-500">
                  Se o problema persistir, entre em contato via WhatsApp
                </p>
              </div>
            </div>

            {/* Informações adicionais */}
            <div className="mt-6 p-4 bg-white/80 rounded-xl border border-red-100">
              <h3 className="font-medium text-gray-800 mb-2">O que você pode fazer:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Recarregue a página</li>
                <li>• Limpe o cache do navegador</li>
                <li>• Tente novamente em alguns minutos</li>
                <li>• Verifique sua conexão com a internet</li>
              </ul>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;