import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Palette, 
  Bot, 
  Bell,
  Download,
  Shield, 
  HelpCircle,
  ChevronRight 
} from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  iconBgClass?: string;
  onClick?: () => void;
}

const AjustesPageV13: React.FC = () => {
  const {
    dashboardData,
    setView,
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Usuário';

  const [activeTab, setActiveTab] = useState<TabId>('ajustes');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleBack = () => {
    setView('jornada');
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
    setView('jornada');
  };

  const menuItems: MenuItem[] = [
    {
      id: 'perfil',
      icon: <User size={20} className="text-[var(--mq-primary)]" />,
      title: 'Perfil Pessoal',
      subtitle: 'Nome, foto e preferências',
      onClick: () => {
        setView('perfilPessoal');
      },
    },
    {
      id: 'aparencia',
      icon: <Palette size={20} className="text-[var(--mq-accent)]" />,
      title: 'Aparência',
      subtitle: 'Tema e personalização visual',
      onClick: () => {
        setView('aparencia');
      },
    },
    {
      id: 'ia',
      icon: <Bot size={20} className="text-[var(--mq-primary)]" />,
      title: 'Interações com IA',
      subtitle: 'Tom e frequência das mensagens',
      onClick: () => {
        setView('interacoesIA');
      },
    },
    {
      id: 'notificacoes',
      icon: <Bell size={20} className="text-[var(--mq-warning)]" />,
      title: 'Notificações e interação com IA',
      subtitle: 'Lembretes e frequência de mensagens',
      onClick: () => {
        // TODO: Implementar página de notificações
        console.log('Notificações e interação com IA');
      },
    },
    {
      id: 'exportar',
      icon: <Download size={20} className="text-[var(--mq-primary)]" />,
      title: 'Exportar dados',
      subtitle: 'Conversas, emoções, humor, energia, sabotadores e perfil',
      onClick: () => {
        // TODO: Implementar página de exportação
        console.log('Exportar dados');
      },
    },
    {
      id: 'seguranca',
      icon: <Shield size={20} className="text-[var(--mq-success)]" />,
      title: 'Segurança',
      subtitle: 'Senha e privacidade',
      onClick: () => {
        // TODO: Implementar página de segurança
        console.log('Segurança');
      },
    },
    {
      id: 'ajuda',
      icon: <HelpCircle size={20} className="text-[var(--mq-info)]" />,
      title: 'Ajuda e Feedback',
      subtitle: 'FAQ, suporte e sugestões',
      onClick: () => {
        // TODO: Implementar página de ajuda
        console.log('Ajuda e Feedback');
      },
    },
  ];

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
          <h1 className="mq-page-title">Ajustes</h1>
          <p className="mq-page-subtitle">Personalize sua experiência</p>
        </div>

        {/* Menu de opções */}
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <motion.section
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + index * 0.04 }}
              className="mq-card overflow-hidden"
            >
              <button
                type="button"
                onClick={item.onClick}
                className="w-full p-4 flex items-center justify-between hover:bg-[var(--mq-card)]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[var(--mq-card)]">
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-bold text-[var(--mq-text)]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[var(--mq-text-muted)]">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-[var(--mq-text-subtle)]" />
              </button>
            </motion.section>
          ))}
        </div>
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

export default AjustesPageV13;

