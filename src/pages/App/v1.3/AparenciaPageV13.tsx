import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Sun, Moon } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';
import { useThemeContext } from '@/components/app/v1.3/ThemeProvider';
import type { ThemeId, ThemeInfo } from '@/hooks/useTheme';

// Componente de Preview em Miniatura
const ThemePreview: React.FC<{
  tema: ThemeInfo;
  isSelected: boolean;
  onClick: () => void;
}> = ({ tema, isSelected, onClick }) => {
  const { cores, tipo } = tema;
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative w-full rounded-2xl p-1.5 transition-all duration-200
        ${isSelected 
          ? 'ring-2 ring-[var(--mq-primary)] ring-offset-2 ring-offset-[var(--mq-bg)]' 
          : 'hover:scale-[1.02]'
        }
      `}
    >
      {/* Preview da Interface em Miniatura */}
      <div 
        className="relative overflow-hidden rounded-xl"
        style={{ 
          backgroundColor: cores.bg,
          aspectRatio: '9/16',
          maxHeight: '180px',
        }}
      >
        {/* Header mini */}
        <div 
          className="flex items-center justify-between px-2 py-1.5"
          style={{ backgroundColor: cores.surface }}
        >
          <div className="flex items-center gap-1">
            <div 
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: cores.accent }}
            />
            <div 
              className="h-1.5 w-8 rounded-full"
              style={{ backgroundColor: cores.text, opacity: 0.3 }}
            />
          </div>
          <div 
            className="h-1.5 w-10 rounded-full"
            style={{ backgroundColor: cores.text, opacity: 0.2 }}
          />
        </div>

        {/* Conteúdo mini */}
        <div className="space-y-2 p-2">
          {/* Card 1 */}
          <div 
            className="rounded-lg p-2"
            style={{ backgroundColor: cores.surface }}
          >
            <div 
              className="mb-1.5 h-1.5 w-12 rounded-full"
              style={{ backgroundColor: cores.primary, opacity: 0.8 }}
            />
            <div 
              className="h-1 w-full rounded-full"
              style={{ backgroundColor: cores.text, opacity: 0.15 }}
            />
            <div 
              className="mt-1 h-1 w-3/4 rounded-full"
              style={{ backgroundColor: cores.text, opacity: 0.15 }}
            />
            {/* Barra de progresso mini */}
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-4 w-2 rounded-sm"
                  style={{ 
                    backgroundColor: i <= 3 ? cores.primary : cores.surface,
                    border: `1px solid ${cores.text}20`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Card 2 */}
          <div 
            className="rounded-lg p-2"
            style={{ backgroundColor: cores.surface }}
          >
            <div className="flex items-center justify-between">
              <div 
                className="h-1.5 w-10 rounded-full"
                style={{ backgroundColor: cores.text, opacity: 0.2 }}
              />
              <div 
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: cores.accent }}
              />
            </div>
          </div>

          {/* Botão CTA mini */}
          <div 
            className="rounded-full py-1.5 text-center"
            style={{ backgroundColor: cores.primary }}
          >
            <div 
              className="mx-auto h-1 w-8 rounded-full"
              style={{ backgroundColor: '#fff', opacity: 0.8 }}
            />
          </div>
        </div>

        {/* Nav mini */}
        <div 
          className="absolute inset-x-0 bottom-0 flex items-center justify-around py-1.5"
          style={{ backgroundColor: `${cores.bg}ee` }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-0.5"
            >
              <div 
                className="h-2.5 w-2.5 rounded-sm"
                style={{ 
                  backgroundColor: i === 1 ? cores.accent : cores.text,
                  opacity: i === 1 ? 1 : 0.3,
                }}
              />
              <div 
                className="h-0.5 w-4 rounded-full"
                style={{ backgroundColor: cores.text, opacity: 0.2 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Badge de seleção */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--mq-primary)] text-white shadow-lg"
        >
          <Check size={14} strokeWidth={3} />
        </motion.div>
      )}

      {/* Ícone de tipo (sol/lua) */}
      <div 
        className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full"
        style={{ backgroundColor: `${cores.card}cc` }}
      >
        {tipo === 'light' ? (
          <Sun size={12} style={{ color: cores.text }} />
        ) : (
          <Moon size={12} style={{ color: cores.text }} />
        )}
      </div>
    </button>
  );
};

const AparenciaPageV13: React.FC = () => {
  const { dashboardData, setView } = useDashboard();
  const { theme, setTheme, temas, currentTheme } = useThemeContext();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const [activeTab, setActiveTab] = useState<TabId>('ajustes');

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

  const handleSelectTheme = (temaId: ThemeId) => {
    setTheme(temaId);
  };

  const temasLight = temas.filter(t => t.tipo === 'light');
  const temasDark = temas.filter(t => t.tipo === 'dark');

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
        {/* Botão voltar */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="mq-btn-back"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        {/* Título da página */}
        <div className="mb-6 text-center">
          <h1 className="mq-page-title">Aparência</h1>
          <p className="mq-page-subtitle">Escolha o visual do seu app</p>
        </div>

        {/* Tema atual */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mq-card mb-6 p-4"
        >
          <div className="flex items-center gap-3">
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: currentTheme.cores.primary + '20' }}
            >
              {currentTheme.tipo === 'light' ? (
                <Sun size={20} className="text-[var(--mq-primary)]" />
              ) : (
                <Moon size={20} className="text-[var(--mq-primary)]" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-text-subtle)]">
                Tema atual
              </p>
              <p className="text-base font-bold text-[var(--mq-text)]">
                {currentTheme.nome}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Seção: Temas Claros */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <Sun size={16} className="text-[var(--mq-warning)]" />
            <h2 className="text-sm font-bold text-[var(--mq-text)]">
              Temas Claros
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {temasLight.map((tema) => (
              <div key={tema.id} className="flex flex-col">
                <ThemePreview
                  tema={tema}
                  isSelected={theme === tema.id}
                  onClick={() => handleSelectTheme(tema.id)}
                />
                <div className="mt-2 text-center">
                  <p className="text-sm font-semibold text-[var(--mq-text)]">
                    {tema.nome}
                  </p>
                  <p className="text-[0.65rem] text-[var(--mq-text-muted)] line-clamp-1">
                    {tema.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Seção: Temas Escuros */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <Moon size={16} className="text-[var(--mq-primary)]" />
            <h2 className="text-sm font-bold text-[var(--mq-text)]">
              Temas Escuros
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {temasDark.map((tema) => (
              <div key={tema.id} className="flex flex-col">
                <ThemePreview
                  tema={tema}
                  isSelected={theme === tema.id}
                  onClick={() => handleSelectTheme(tema.id)}
                />
                <div className="mt-2 text-center">
                  <p className="text-sm font-semibold text-[var(--mq-text)]">
                    {tema.nome}
                  </p>
                  <p className="text-[0.65rem] text-[var(--mq-text-muted)] line-clamp-1">
                    {tema.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Dica */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-[var(--mq-primary)]/20 bg-[var(--mq-primary-light)] p-3"
        >
          <p className="text-xs text-[var(--mq-text)]">
            💡 <span className="font-semibold text-[var(--mq-primary)]">Dica:</span> O tema escuro pode ajudar a reduzir o cansaço visual durante a noite.
          </p>
        </motion.div>
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

export default AparenciaPageV13;

