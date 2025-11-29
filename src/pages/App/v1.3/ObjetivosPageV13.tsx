import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Loader2, CheckCircle2 } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

// Dados mockados - Áreas da Vida
const areasVida = [
  { codigo: 'carreira', nome: 'Carreira', icone: '💼' },
  { codigo: 'relacionamentos', nome: 'Relacionamentos', icone: '💛' },
  { codigo: 'espiritualidade', nome: 'Espiritualidade', icone: '🙏' },
  { codigo: 'financas', nome: 'Finanças', icone: '💰' },
  { codigo: 'saude', nome: 'Saúde', icone: '🏃' },
  { codigo: 'evolucao', nome: 'Evolução', icone: '🧠' },
];

// Dados mockados - Objetivos por Área
const objetivosCatalogo: Record<string, string[]> = {
  carreira: [
    'Mudar de emprego',
    'Mudar de área de atuação',
    'Iniciar meu próprio negócio',
    'Conseguir uma promoção',
    'Melhorar produtividade no trabalho',
  ],
  relacionamentos: [
    'Encontrar alguém para a vida',
    'Fazer novas amizades',
    'Melhorar comunicação com parceiro(a)',
    'Fortalecer laços familiares',
    'Estabelecer limites saudáveis',
  ],
  espiritualidade: [
    'Explorar uma crença ou filosofia',
    'Desenvolver prática de meditação',
    'Encontrar propósito e sentido',
    'Cultivar gratidão diária',
  ],
  financas: [
    'Aumentar minha renda',
    'Controlar gastos e contas',
    'Começar a investir',
    'Criar reserva de emergência',
    'Quitar dívidas',
  ],
  saude: [
    'Perder peso',
    'Ganhar massa muscular',
    'Melhorar qualidade do sono',
    'Reduzir ansiedade/estresse',
    'Melhorar exames (colesterol, glicose, etc.)',
  ],
  evolucao: [
    'Desenvolver autoconhecimento',
    'Aprender algo novo (idioma, habilidade)',
    'Ler mais livros',
    'Superar um medo ou bloqueio',
    'Desenvolver disciplina e consistência',
  ],
};

type Passo = 1 | 2 | 3 | 4;

const ObjetivosPageV13: React.FC = () => {
  const {
    dashboardData,
    setView,
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Usuário';

  const usuarioId = dashboardData?.usuario?.id;

  const [activeTab, setActiveTab] = useState<TabId>('ajustes');
  const [passoAtual, setPassoAtual] = useState<Passo>(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estado do formulário
  const [areaSelecionada, setAreaSelecionada] = useState<string | null>(null);
  const [objetivoSelecionado, setObjetivoSelecionado] = useState<string | null>(null);
  const [objetivoCustomizado, setObjetivoCustomizado] = useState<string>('');
  const [detalhamento, setDetalhamento] = useState<string>('');
  const [prazoDias, setPrazoDias] = useState<30 | 45 | 60 | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleBack = () => {
    if (passoAtual > 1) {
      setPassoAtual((prev) => (prev - 1) as Passo);
    } else {
      setView('jornada');
    }
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

  const handleProximoPasso = () => {
    if (passoAtual < 4) {
      setPassoAtual((prev) => (prev + 1) as Passo);
    }
  };

  const handleCriarObjetivo = async () => {
    if (!usuarioId) {
      setError('Usuário não identificado');
      return;
    }

    if (!areaSelecionada) {
      setError('Selecione uma área da vida');
      setPassoAtual(1);
      return;
    }

    const titulo = objetivoSelecionado === 'outro' ? objetivoCustomizado : objetivoSelecionado;
    if (!titulo || titulo.trim().length < 3) {
      setError('Defina um objetivo');
      setPassoAtual(2);
      return;
    }

    if (!detalhamento || detalhamento.trim().length < 20) {
      setError('Detalhe seu objetivo com pelo menos 20 caracteres');
      setPassoAtual(3);
      return;
    }

    if (!prazoDias) {
      setError('Selecione um prazo');
      setPassoAtual(4);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // TODO: Integrar com API real
      // const response = await fetch('/api/objetivos', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     user_id: usuarioId,
      //     area_vida_id: areaSelecionada,
      //     titulo,
      //     detalhamento,
      //     prazo_dias: prazoDias,
      //   }),
      // });

      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => {
        setView('jornada');
      }, 2000);
    } catch (error) {
      console.error('[Objetivos] Erro ao criar:', error);
      setError(error instanceof Error ? error.message : 'Erro ao criar objetivo');
    } finally {
      setSaving(false);
    }
  };

  const objetivosDisponiveis = areaSelecionada ? objetivosCatalogo[areaSelecionada] || [] : [];

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
          <h1 className="mq-page-title">Definir Objetivo</h1>
          <p className="mq-page-subtitle">O que você quer conquistar?</p>
        </div>

        {/* Mensagens de erro/sucesso */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-xl border border-[var(--mq-error)] bg-[var(--mq-error-light)] p-3 text-sm text-[var(--mq-error)]"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-xl border-2 border-green-400 bg-green-100 p-4 text-sm font-semibold text-green-800 shadow-md"
          >
            ✅ Objetivo criado com sucesso!
          </motion.div>
        )}

        {/* Formulário com passos */}
        <div className="mq-card p-6" style={{ borderRadius: 24 }}>
          <AnimatePresence mode="wait">
            {/* PASSO 1: Escolha a área da vida */}
            {passoAtual === 1 && (
              <motion.div
                key="passo1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="mb-4">
                  <p className="mq-eyebrow mb-2">PASSO 1</p>
                  <h3 className="text-base font-bold text-[var(--mq-text)]">Escolha a área da vida</h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {areasVida.map((area) => (
                    <button
                      key={area.codigo}
                      type="button"
                      onClick={() => {
                        setAreaSelecionada(area.codigo);
                        setTimeout(() => handleProximoPasso(), 300);
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        areaSelecionada === area.codigo
                          ? 'border-[var(--mq-primary)] bg-[var(--mq-primary-light)]'
                          : 'border-[var(--mq-border)] bg-[var(--mq-card)] hover:border-[var(--mq-primary)]/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{area.icone}</div>
                      <div className="text-xs font-semibold text-[var(--mq-text)] leading-tight">
                        {area.nome}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* PASSO 2: Escolha o objetivo */}
            {passoAtual === 2 && (
              <motion.div
                key="passo2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="mb-4">
                  <p className="mq-eyebrow mb-2">PASSO 2</p>
                  <h3 className="text-base font-bold text-[var(--mq-text)]">Escolha o objetivo (ou crie)</h3>
                </div>

                <div className="space-y-2">
                  {objetivosDisponiveis.map((objetivo) => (
                    <label
                      key={objetivo}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        objetivoSelecionado === objetivo
                          ? 'border-[var(--mq-primary)] bg-[var(--mq-primary-light)]'
                          : 'border-[var(--mq-border)] bg-[var(--mq-card)] hover:border-[var(--mq-primary)]/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="objetivo"
                        value={objetivo}
                        checked={objetivoSelecionado === objetivo}
                        onChange={(e) => {
                          setObjetivoSelecionado(e.target.value);
                          setObjetivoCustomizado('');
                        }}
                        className="h-4 w-4 accent-[var(--mq-primary)]"
                      />
                      <span className="text-sm text-[var(--mq-text)] flex-1">{objetivo}</span>
                    </label>
                  ))}

                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      objetivoSelecionado === 'outro'
                        ? 'border-[var(--mq-primary)] bg-[var(--mq-primary-light)]'
                        : 'border-[var(--mq-border)] bg-[var(--mq-card)] hover:border-[var(--mq-primary)]/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="objetivo"
                      value="outro"
                      checked={objetivoSelecionado === 'outro'}
                      onChange={(e) => {
                        setObjetivoSelecionado('outro');
                        setObjetivoCustomizado('');
                      }}
                      className="h-4 w-4 accent-[var(--mq-primary)]"
                    />
                    <div className="flex-1">
                      <span className="text-sm text-[var(--mq-text)]">Outro: </span>
                      <input
                        type="text"
                        value={objetivoCustomizado}
                        onChange={(e) => setObjetivoCustomizado(e.target.value)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setObjetivoSelecionado('outro');
                        }}
                        placeholder="Digite seu objetivo"
                        className="text-sm text-[var(--mq-text)] bg-transparent border-none outline-none flex-1 w-full"
                      />
                    </div>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleProximoPasso}
                  disabled={!objetivoSelecionado || (objetivoSelecionado === 'outro' && !objetivoCustomizado.trim())}
                  className="mq-btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </motion.div>
            )}

            {/* PASSO 3: Detalhe seu objetivo */}
            {passoAtual === 3 && (
              <motion.div
                key="passo3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="mb-4">
                  <p className="mq-eyebrow mb-2">PASSO 3</p>
                  <h3 className="text-base font-bold text-[var(--mq-text)]">Detalhe seu objetivo</h3>
                </div>

                <div>
                  <textarea
                    value={detalhamento}
                    onChange={(e) => setDetalhamento(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-4 py-3 text-sm text-[var(--mq-text)] focus:border-[var(--mq-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--mq-primary)]/20 resize-none"
                    placeholder="Exemplo: Quero conseguir a vaga de gerente no meu departamento até março. Preciso melhorar minha comunicação e visibilidade com a diretoria."
                  />
                  <p className="mt-2 text-xs text-[var(--mq-text-muted)]">
                    Mínimo 20 caracteres ({detalhamento.length}/20)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleProximoPasso}
                  disabled={detalhamento.trim().length < 20}
                  className="mq-btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </motion.div>
            )}

            {/* PASSO 4: Defina o prazo */}
            {passoAtual === 4 && (
              <motion.div
                key="passo4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="mb-4">
                  <p className="mq-eyebrow mb-2">PASSO 4</p>
                  <h3 className="text-base font-bold text-[var(--mq-text)]">Defina o prazo</h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {([30, 45, 60] as const).map((dias) => (
                    <button
                      key={dias}
                      type="button"
                      onClick={() => setPrazoDias(dias)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        prazoDias === dias
                          ? 'border-[var(--mq-primary)] bg-[var(--mq-primary-light)]'
                          : 'border-[var(--mq-border)] bg-[var(--mq-card)] hover:border-[var(--mq-primary)]/50'
                      }`}
                    >
                      <div className="text-lg font-bold text-[var(--mq-text)] mb-1">{dias}</div>
                      <div className="text-xs text-[var(--mq-text-muted)]">dias</div>
                      {prazoDias === dias && (
                        <div className="mt-2 text-[var(--mq-primary)]">✓</div>
                      )}
                    </button>
                  ))}
                </div>

                <motion.button
                  type="button"
                  onClick={handleCriarObjetivo}
                  disabled={saving || !prazoDias}
                  className="mq-btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: saving ? 1 : 1.02 }}
                  whileTap={{ scale: saving ? 1 : 0.98 }}
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Criar Objetivo
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
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

export default ObjetivosPageV13;
