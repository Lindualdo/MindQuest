import React, { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';
import { getPerfilById, bigFiveCatalogo } from '@/data/bigFiveCatalogo';

// Mapeamento de nomes antigos para novos (igual ao card)
const mapearNomeTraco = (nomeOriginal: string): string => {
  const mapeamento: Record<string, string> = {
    'Conscienciosidade': 'Disciplina',
    'Abertura à Experiência': 'Curiosidade',
    'Abertura': 'Curiosidade',
    'Neuroticismo': 'Instabilidade',
    'Amabilidade': 'Gentileza',
    'Extroversão': 'Sociabilidade',
  };
  return mapeamento[nomeOriginal] || nomeOriginal;
};

const SectionList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => {
  if (!items.length) return null;
  return (
    <Card className="!p-4 mq-card">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-text-muted)] mb-3">{title}</h3>
      <ul className="space-y-2 text-sm text-[var(--mq-text)]">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--mq-accent-light)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

const PerfilBigFiveDetailPageV13: React.FC = () => {
  const { dashboardData, setView, selectedPerfilBigFiveId, perfilBigFiveDetailReturnView } = useDashboard();
  const [activeTab, setActiveTab] = useState<TabId>('entender');

  const tracoId = selectedPerfilBigFiveId ?? '';
  const traco = useMemo(() => getPerfilById(tracoId), [tracoId]);
  const overview = bigFiveCatalogo.overview;

  const handleBack = () => {
    const returnView = perfilBigFiveDetailReturnView ?? 'dashEmocoes';
    if (returnView === 'dashEmocoes') {
      setView('dashEmocoes');
      setActiveTab('entender');
    } else {
      setView('dashEmocoes');
      setActiveTab('entender');
    }
  };

  const handleNavConversar = () => {
    setActiveTab('conversar');
    setView('conversar');
  };

  const handleNavEntender = () => {
    setActiveTab('entender');
    setView('dashEmocoes');
  };

  const handleNavAgir = () => {
    setActiveTab('agir');
    setView('painelQuests');
  };

  const handleNavEvoluir = () => {
    setActiveTab('evoluir');
    setView('evoluir');
  };

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  if (!traco) {
    return (
      <div className="mq-app-v1_3 flex min-h-screen flex-col">
        <HeaderV1_3 nomeUsuario={nomeUsuario} />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
          <Card className="mq-card">
            <p className="text-sm text-[var(--mq-text-muted)]">Perfil não encontrado.</p>
            <button
              type="button"
              onClick={handleBack}
              className="mt-4 w-full rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-4 py-2 text-sm font-semibold text-[var(--mq-text)]"
            >
              Voltar
            </button>
          </Card>
        </main>
        <BottomNavV1_3
          active={activeTab}
          onConversar={handleNavConversar}
          onEntender={handleNavEntender}
          onAgir={handleNavAgir}
          onEvoluir={handleNavEvoluir}
        />
      </div>
    );
  }

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        {/* Botão voltar */}
        <div className="mb-4">
          <button type="button" onClick={handleBack} className="mq-btn-back">
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        {/* Título da página */}
        <div className="mb-6 text-center">
          <h1 className="mq-page-title">
            {mapearNomeTraco(traco.nome_pt)}
          </h1>
          <p className="mq-page-subtitle">{traco.resumo}</p>
        </div>

        {/* Descrição */}
        {traco.descricao && (
          <Card className="mq-card">
            <p className="text-sm leading-relaxed text-[var(--mq-text)]">{traco.descricao}</p>
          </Card>
        )}

        {/* Características */}
        <SectionList title="Características marcantes" items={traco.caracteristicas} />

        {/* Pontos Fortes */}
        {traco.pontos_fortes && traco.pontos_fortes.length > 0 && (
          <Card className="!p-4 mq-card">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-text-muted)] mb-3">
              Pontos Fortes
            </h3>
            <ul className="space-y-2 text-sm text-[var(--mq-text)]">
              {traco.pontos_fortes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--mq-success-light)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Áreas de Melhoria */}
        {traco.areas_melhoria && traco.areas_melhoria.length > 0 && (
          <Card className="!p-4 mq-card">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-text-muted)] mb-3">
              Áreas de Melhoria
            </h3>
            <ul className="space-y-2 text-sm text-[var(--mq-text)]">
              {traco.areas_melhoria.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--mq-warning-light)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Preferências de Trabalho */}
        {traco.preferencias_trabalho && traco.preferencias_trabalho.length > 0 && (
          <Card className="!p-4 mq-card">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-text-muted)] mb-3">
              Preferências de Trabalho
            </h3>
            <ul className="space-y-2 text-sm text-[var(--mq-text)]">
              {traco.preferencias_trabalho.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--mq-primary-light)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Relacionamentos */}
        {traco.relacionamentos && traco.relacionamentos.length > 0 && (
          <Card className="!p-4 mq-card">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-text-muted)] mb-3">
              Relacionamentos
            </h3>
            <ul className="space-y-2 text-sm text-[var(--mq-text)]">
              {traco.relacionamentos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--mq-accent-light)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Estratégias de Desenvolvimento */}
        {traco.estrategias_desenvolvimento && traco.estrategias_desenvolvimento.length > 0 && (
          <Card className="!p-4 mq-card">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-text-muted)] mb-3">
              Estratégias de Desenvolvimento
            </h3>
            <ul className="space-y-2 text-sm text-[var(--mq-text)]">
              {traco.estrategias_desenvolvimento.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--mq-primary-light)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </main>

      <BottomNavV1_3
        active={activeTab}
        onConversar={handleNavConversar}
        onEntender={handleNavEntender}
        onAgir={handleNavAgir}
        onEvoluir={handleNavEvoluir}
      />
    </div>
  );
};

export default PerfilBigFiveDetailPageV13;

