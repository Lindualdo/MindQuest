import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Award, Target, Brain } from 'lucide-react';
import Card from '../ui/Card';
import { useDashboard } from '@/store/useStore';
import { apiService } from '@/services/apiService';
import type { BigFivePerfilData } from '@/types/emotions';
import { getPerfilById } from '@/data/bigFiveCatalogo';

const CardPerfilBigFive: React.FC = () => {
  const { dashboardData } = useDashboard();
  const [perfil, setPerfil] = useState<BigFivePerfilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const userId = dashboardData?.usuario?.id;

  useEffect(() => {
    if (!userId) {
      setError('Usuário não identificado');
      setLoading(false);
      return;
    }

    const loadPerfil = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getPerfilBigFive(userId);
        
        if (response.success && response.perfil) {
          setPerfil(response.perfil);
        } else {
          setError(response.error || 'Perfil não encontrado');
        }
      } catch (err) {
        console.error('Erro ao carregar perfil Big Five:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    };

    loadPerfil();
  }, [userId]);

  if (loading) {
    return (
      <Card className="mq-card min-h-[360px] flex items-center justify-center" style={{ borderRadius: 24 }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--mq-primary)] mx-auto mb-2"></div>
          <p className="text-sm text-[var(--mq-text-muted)]">Carregando perfil...</p>
        </div>
      </Card>
    );
  }

  if (error || !perfil) {
    return (
      <Card className="mq-card min-h-[360px] flex items-center justify-center" style={{ borderRadius: 24 }}>
        <div className="text-center text-[var(--mq-text-muted)]">
          <p className="text-sm">{error || 'Perfil não disponível'}</p>
        </div>
      </Card>
    );
  }

  const perfilPrimario = perfil.perfil_primario ? getPerfilById(perfil.perfil_primario) : null;
  const perfilSecundario = perfil.perfil_secundario ? getPerfilById(perfil.perfil_secundario) : null;

  // Top 3 traços
  const top3Traços = perfil.tracos_ordenados.slice(0, 3);

  return (
    <Card className="mq-card rounded-3xl" style={{ borderRadius: 24 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Brain size={20} className="text-[var(--mq-primary)]" />
            <h3 className="text-lg font-bold text-[var(--mq-text)]">Perfil pessoal</h3>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className="p-1.5 rounded-full bg-[var(--mq-card)] text-[var(--mq-primary)] hover:bg-[var(--mq-card)] transition-colors"
        >
          <Info size={16} />
        </button>
      </div>

      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 rounded-xl bg-[var(--mq-card)] p-3 text-xs text-[var(--mq-text-muted)]"
        >
          <p className="font-semibold mb-1">O que é o Big Five?</p>
          <p>Modelo de personalidade baseado em 5 dimensões fundamentais que influenciam seu comportamento e preferências.</p>
        </motion.div>
      )}

      {/* Perfis Dominantes */}
      {(perfilPrimario || perfilSecundario) && (
        <div className="mb-4 space-y-2">
          {perfilPrimario && (
            <div className="rounded-xl bg-white/80 p-3 border-l-4 border-[#2F76D1]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-500">Perfil Primário</span>
              </div>
              <h4 className="font-bold text-[#1C2541] text-sm">{perfilPrimario.nome_pt}</h4>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">{perfilPrimario.resumo}</p>
            </div>
          )}
          
          {perfilSecundario && (
            <div className="rounded-xl bg-white/60 p-3 border-l-4 border-slate-300">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-500">Perfil Secundário</span>
              </div>
              <h4 className="font-bold text-[#1C2541] text-sm">{perfilSecundario.nome_pt}</h4>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">{perfilSecundario.resumo}</p>
            </div>
          )}
        </div>
      )}

      {/* Top 3 Traços com Scores */}
      {top3Traços.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Top 3 Traços</h4>
          <div className="space-y-2">
            {top3Traços.map((traco, idx) => {
              const score = Math.round(traco.score);
              const catalogInfo = getPerfilById(traco.nome);
              
              return (
                <div key={traco.nome} className="rounded-lg bg-white/60 p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1C2541]">{traco.nome_pt}</span>
                    </div>
                    <span className="text-xs font-bold text-[#2F76D1]">{score}/100</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="h-1.5 rounded-full bg-gradient-to-r from-[#2F76D1] to-[#0EA5E9]"
                    />
                  </div>
                  {catalogInfo?.pontos_fortes?.[0] && (
                    <p className="text-[10px] text-slate-500 mt-1.5 line-clamp-1">
                      {catalogInfo.pontos_fortes[0]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resumo do Perfil */}
      {perfil.resumo_perfil && (
        <div className="mt-4 rounded-xl bg-white/80 p-3">
          <div className="flex items-start gap-2">
            <Target size={16} className="text-[#2F76D1] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1">Resumo do Perfil</p>
              <p className="text-xs text-slate-600 leading-relaxed">{perfil.resumo_perfil}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Confiabilidade e Atualização */}
      <div className="mt-4 pt-3 border-t border-white/60 flex items-center justify-between text-[10px] text-slate-500">
        <div className="flex items-center gap-1">
          <Award size={12} />
          <span>Confiabilidade: {Math.round(perfil.confianca_media)}%</span>
        </div>
        {perfil.ultima_atualizacao && (
          <span>
            {new Date(perfil.ultima_atualizacao).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
            })}
          </span>
        )}
      </div>
    </Card>
  );
};

export default CardPerfilBigFive;

