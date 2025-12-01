import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Target, ChevronRight, Loader2, CheckCircle2, Calendar, AlertCircle } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

// Tipos
interface Area {
  id: string;
  codigo: string;
  nome: string;
  icone: string;
  ordem: number;
}

interface ObjetivoCatalogo {
  id: string;
  codigo: string;
  titulo: string;
  ordem: number;
}

interface ObjetivoUsuario {
  id: string;
  area: {
    id: string;
    codigo: string;
    nome: string;
    icone: string;
  };
  titulo: string;
  detalhamento: string;
  prazo_dias: number;
  data_inicio: string;
  data_limite: string;
  dias_restantes: number | null;
  status: string;
  is_padrao?: boolean;
}

// Fallback do catálogo (caso API não esteja disponível)
const FALLBACK_AREAS: Area[] = [
  { id: '22222222-2222-4222-8222-222222222222', codigo: 'trabalho', nome: 'Trabalho', icone: '💼', ordem: 1 },
  { id: '66666666-6666-4666-8666-666666666666', codigo: 'relacionamentos', nome: 'Relacionamentos', icone: '💛', ordem: 2 },
  { id: '44444444-4444-4444-8444-444444444444', codigo: 'espiritualidade', nome: 'Espiritualidade', icone: '🙏', ordem: 3 },
  { id: '33333333-3333-4333-8333-333333333333', codigo: 'financas', nome: 'Finanças', icone: '💰', ordem: 4 },
  { id: '11111111-1111-4111-8111-111111111111', codigo: 'saude', nome: 'Saúde', icone: '🏃', ordem: 5 },
  { id: '88888888-8888-4888-8888-888888888888', codigo: 'evolucao', nome: 'Evolução', icone: '🧠', ordem: 6 },
];

const FALLBACK_OBJETIVOS: Record<string, ObjetivoCatalogo[]> = {
  '22222222-2222-4222-8222-222222222222': [
    { id: '1', codigo: 'mudar_emprego', titulo: 'Mudar de emprego', ordem: 1 },
    { id: '2', codigo: 'mudar_area', titulo: 'Mudar de área de atuação', ordem: 2 },
    { id: '3', codigo: 'proprio_negocio', titulo: 'Iniciar meu próprio negócio', ordem: 3 },
    { id: '4', codigo: 'promocao', titulo: 'Conseguir uma promoção', ordem: 4 },
    { id: '5', codigo: 'produtividade', titulo: 'Melhorar produtividade no trabalho', ordem: 5 },
  ],
  '66666666-6666-4666-8666-666666666666': [
    { id: '6', codigo: 'encontrar_alguem', titulo: 'Encontrar alguém para a vida', ordem: 1 },
    { id: '7', codigo: 'novas_amizades', titulo: 'Fazer novas amizades', ordem: 2 },
    { id: '8', codigo: 'comunicacao_parceiro', titulo: 'Melhorar comunicação com parceiro(a)', ordem: 3 },
    { id: '9', codigo: 'lacos_familiares', titulo: 'Fortalecer laços familiares', ordem: 4 },
    { id: '10', codigo: 'limites_saudaveis', titulo: 'Estabelecer limites saudáveis', ordem: 5 },
  ],
  '44444444-4444-4444-8444-444444444444': [
    { id: '11', codigo: 'explorar_crenca', titulo: 'Explorar uma crença ou filosofia', ordem: 1 },
    { id: '12', codigo: 'meditacao', titulo: 'Desenvolver prática de meditação', ordem: 2 },
    { id: '13', codigo: 'proposito', titulo: 'Encontrar propósito e sentido', ordem: 3 },
    { id: '14', codigo: 'gratidao', titulo: 'Cultivar gratidão diária', ordem: 4 },
  ],
  '33333333-3333-4333-8333-333333333333': [
    { id: '15', codigo: 'aumentar_renda', titulo: 'Aumentar minha renda', ordem: 1 },
    { id: '16', codigo: 'controlar_gastos', titulo: 'Controlar gastos e contas', ordem: 2 },
    { id: '17', codigo: 'comecar_investir', titulo: 'Começar a investir', ordem: 3 },
    { id: '18', codigo: 'reserva_emergencia', titulo: 'Criar reserva de emergência', ordem: 4 },
    { id: '19', codigo: 'quitar_dividas', titulo: 'Quitar dívidas', ordem: 5 },
  ],
  '11111111-1111-4111-8111-111111111111': [
    { id: '20', codigo: 'perder_peso', titulo: 'Perder peso', ordem: 1 },
    { id: '21', codigo: 'ganhar_massa', titulo: 'Ganhar massa muscular', ordem: 2 },
    { id: '22', codigo: 'qualidade_sono', titulo: 'Melhorar qualidade do sono', ordem: 3 },
    { id: '23', codigo: 'reduzir_ansiedade', titulo: 'Reduzir ansiedade/estresse', ordem: 4 },
    { id: '24', codigo: 'melhorar_exames', titulo: 'Melhorar exames (colesterol, glicose, etc.)', ordem: 5 },
  ],
  '88888888-8888-4888-8888-888888888888': [
    { id: '25', codigo: 'autoconhecimento', titulo: 'Desenvolver autoconhecimento', ordem: 1 },
    { id: '26', codigo: 'aprender_novo', titulo: 'Aprender algo novo (idioma, habilidade)', ordem: 2 },
    { id: '27', codigo: 'ler_mais', titulo: 'Ler mais livros', ordem: 3 },
    { id: '28', codigo: 'superar_medo', titulo: 'Superar um medo ou bloqueio', ordem: 4 },
    { id: '29', codigo: 'disciplina', titulo: 'Desenvolver disciplina e consistência', ordem: 5 },
  ],
};

type Passo = 0 | 1 | 2 | 3 | 4; // 0 = Lista de objetivos

const ObjetivosPageV13: React.FC = () => {
  const { dashboardData, setView } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Usuário';

  const usuarioId = dashboardData?.usuario?.id;

  const [activeTab, setActiveTab] = useState<TabId>('evoluir');
  const [passoAtual, setPassoAtual] = useState<Passo>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Dados do usuário
  const [objetivosUsuario, setObjetivosUsuario] = useState<ObjetivoUsuario[]>([]);
  const [podeCriar, setPodeCriar] = useState(true);
  const [totalAtivos, setTotalAtivos] = useState(0);
  const [limiteAtivos, setLimiteAtivos] = useState(3);

  // Catálogo
  const [areas, setAreas] = useState<Area[]>(FALLBACK_AREAS);
  const [objetivosPorArea, setObjetivosPorArea] = useState<Record<string, ObjetivoCatalogo[]>>(FALLBACK_OBJETIVOS);

  // Estado do formulário
  const [areaSelecionada, setAreaSelecionada] = useState<Area | null>(null);
  const [objetivoSelecionado, setObjetivoSelecionado] = useState<ObjetivoCatalogo | null>(null);
  const [objetivoCustomizado, setObjetivoCustomizado] = useState<string>('');
  const [detalhamento, setDetalhamento] = useState<string>('');
  const [prazoDias, setPrazoDias] = useState<30 | 45 | 60 | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    if (usuarioId) {
      loadData();
    }
  }, [usuarioId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Carregar objetivos do usuário
      const objetivosRes = await fetch(`/api/objetivos?user_id=${usuarioId}`);
      let objetivosCarregados: ObjetivoUsuario[] = [];
      let podecriarFlag = true;
      
      if (objetivosRes.ok) {
        const data = await objetivosRes.json();
        if (data.success) {
          objetivosCarregados = data.objetivos || [];
          podecriarFlag = data.pode_criar ?? true;
          setObjetivosUsuario(objetivosCarregados);
          setPodeCriar(podecriarFlag);
          setTotalAtivos(data.total_ativos ?? 0);
          setLimiteAtivos(data.limite_ativos ?? 3);
        }
      }

      // Tentar carregar catálogo (usar fallback se falhar)
      try {
        const catalogoRes = await fetch('/api/objetivos?action=catalogo');
        if (catalogoRes.ok) {
          const catalogoData = await catalogoRes.json();
          if (catalogoData.success) {
            setAreas(catalogoData.areas || FALLBACK_AREAS);
            setObjetivosPorArea(catalogoData.objetivos_por_area || FALLBACK_OBJETIVOS);
          }
        }
      } catch {
        // Usar fallback silenciosamente
      }

      // Se não tem objetivos e pode criar, ir direto para escolha de área
      if (objetivosCarregados.length === 0 && podecriarFlag) {
        setPassoAtual(1);
      }
    } catch (err) {
      console.error('[Objetivos] Erro ao carregar:', err);
      setError('Erro ao carregar objetivos');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (passoAtual > 0) {
      setPassoAtual((prev) => (prev - 1) as Passo);
    } else {
      setView('jornada');
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
    setView('jornada');
  };

  const iniciarCriacao = () => {
    if (!podeCriar) {
      setError('Você já tem 3 objetivos ativos (limite máximo). Conclua ou cancele um para criar outro.');
      return;
    }
    setPassoAtual(1);
    setAreaSelecionada(null);
    setObjetivoSelecionado(null);
    setObjetivoCustomizado('');
    setDetalhamento('');
    setPrazoDias(null);
    setError(null);
    setSuccess(false);
  };

  const handleProximoPasso = () => {
    if (passoAtual < 4) {
      setPassoAtual((prev) => (prev + 1) as Passo);
    }
  };

  const handleCriarObjetivo = async () => {
    if (!usuarioId || !areaSelecionada) {
      setError('Dados incompletos');
      return;
    }

    const titulo = objetivoSelecionado?.titulo || objetivoCustomizado;
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
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const response = await fetch('/api/objetivos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: usuarioId,
          area_vida_id: areaSelecionada.id,
          objetivo_catalogo_id: objetivoSelecionado?.id || null,
          titulo,
          detalhamento,
          prazo_dias: prazoDias,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao criar objetivo');
      }

      setSuccess(true);
      
      // Recarregar lista
      await loadData();
      
      setTimeout(() => {
        setPassoAtual(0);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('[Objetivos] Erro ao criar:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar objetivo');
    } finally {
      setSaving(false);
    }
  };

  const objetivosDisponiveis = useMemo(() => {
    if (!areaSelecionada) return [];
    return objetivosPorArea[areaSelecionada.id] || [];
  }, [areaSelecionada, objetivosPorArea]);

  // Filtra apenas as 6 primeiras áreas para exibição
  const areasExibir = useMemo(() => {
    return areas.slice(0, 6);
  }, [areas]);

  const objetivosAtivos = useMemo(() => {
    return objetivosUsuario.filter(o => o.status === 'ativo');
  }, [objetivosUsuario]);

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
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
            {passoAtual === 0 ? 'Meus Objetivos' : 'Definir Objetivo'}
          </h1>
          <p className="mq-page-subtitle">
            {passoAtual === 0
              ? `${totalAtivos}/${limiteAtivos} objetivos ativos`
              : 'O que você quer conquistar?'}
          </p>
        </div>

        {/* Mensagens de erro/sucesso */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 rounded-xl border border-[var(--mq-error)] bg-[var(--mq-error-light)] p-3 text-sm text-[var(--mq-error)] flex items-center gap-2"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 rounded-xl border-2 border-green-400 bg-green-100 p-4 text-sm font-semibold text-green-800 shadow-md flex items-center gap-2"
            >
              <CheckCircle2 size={20} />
              Objetivo criado com sucesso!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-[var(--mq-primary)]" />
          </div>
        )}

        {/* Conteúdo */}
        {!loading && (
          <AnimatePresence mode="wait">
            {/* PASSO 0: Lista de objetivos */}
            {passoAtual === 0 && (
              <motion.div
                key="lista"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Objetivos ativos */}
                {objetivosAtivos.length > 0 && (
                  <div className="space-y-3">
                    {objetivosAtivos.map((obj) => (
                      <motion.div
                        key={obj.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mq-card p-4 ${obj.is_padrao ? 'opacity-80' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{obj.area.icone}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-[var(--mq-text-muted)]">
                                {obj.area.nome}
                              </span>
                              {!obj.is_padrao && obj.dias_restantes !== null && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  obj.dias_restantes <= 7
                                    ? 'bg-[var(--mq-warning-light)] text-[var(--mq-warning)]'
                                    : 'bg-[var(--mq-primary-light)] text-[var(--mq-primary)]'
                                }`}>
                                  {obj.dias_restantes > 0 ? `${obj.dias_restantes} dias` : 'Vence hoje!'}
                                </span>
                              )}
                              {obj.is_padrao && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--mq-card)] text-[var(--mq-text-subtle)] border border-[var(--mq-border)]">
                                  Padrão
                                </span>
                              )}
                            </div>
                            <h3 className="text-sm font-bold text-[var(--mq-text)] mb-1">
                              {obj.titulo}
                            </h3>
                            <p className="text-xs text-[var(--mq-text-muted)] line-clamp-2">
                              {obj.detalhamento}
                            </p>
                          </div>
                          {!obj.is_padrao && (
                            <ChevronRight size={18} className="text-[var(--mq-text-subtle)] mt-1" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {objetivosAtivos.length === 0 && (
                  <div className="mq-card p-8 text-center">
                    <Target size={48} className="mx-auto mb-4 text-[var(--mq-text-subtle)]" />
                    <h3 className="text-base font-bold text-[var(--mq-text)] mb-2">
                      Nenhum objetivo definido
                    </h3>
                    <p className="text-sm text-[var(--mq-text-muted)]">
                      Defina até 2 objetivos para focar sua jornada de transformação.
                    </p>
                  </div>
                )}

                {/* Botão criar */}
                <motion.button
                  type="button"
                  onClick={iniciarCriacao}
                  disabled={!podeCriar}
                  className={`w-full p-4 rounded-xl border-2 border-dashed transition-all flex items-center justify-center gap-2 ${
                    podeCriar
                      ? 'border-[var(--mq-primary)] text-[var(--mq-primary)] hover:bg-[var(--mq-primary-light)]'
                      : 'border-[var(--mq-border)] text-[var(--mq-text-muted)] cursor-not-allowed'
                  }`}
                  whileHover={podeCriar ? { scale: 1.02 } : {}}
                  whileTap={podeCriar ? { scale: 0.98 } : {}}
                >
                  <Plus size={20} />
                  <span className="font-semibold">
                    {podeCriar ? 'Novo Objetivo' : `Limite atingido (${totalAtivos}/${limiteAtivos})`}
                  </span>
                </motion.button>
              </motion.div>
            )}

            {/* PASSO 1: Escolha a área da vida */}
            {passoAtual === 1 && (
              <motion.div
                key="passo1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mq-card p-6"
                style={{ borderRadius: 24 }}
              >
                <div className="mb-4">
                  <p className="mq-eyebrow mb-2">PASSO 1 DE 4</p>
                  <h3 className="text-base font-bold text-[var(--mq-text)]">
                    Escolha a área da vida
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {areasExibir.map((area) => (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => {
                        setAreaSelecionada(area);
                        setTimeout(() => handleProximoPasso(), 200);
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        areaSelecionada?.id === area.id
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
                className="mq-card p-6"
                style={{ borderRadius: 24 }}
              >
                <div className="mb-4">
                  <p className="mq-eyebrow mb-2">PASSO 2 DE 4</p>
                  <h3 className="text-base font-bold text-[var(--mq-text)]">
                    Escolha o objetivo
                  </h3>
                  <p className="text-xs text-[var(--mq-text-muted)] mt-1">
                    {areaSelecionada?.icone} {areaSelecionada?.nome}
                  </p>
                </div>

                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                  {objetivosDisponiveis.map((objetivo) => (
                    <button
                      key={objetivo.id}
                      type="button"
                      onClick={() => {
                        setObjetivoSelecionado(objetivo);
                        setObjetivoCustomizado('');
                        setPassoAtual(3); // Avança automaticamente
                      }}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all w-full text-left ${
                        objetivoSelecionado?.id === objetivo.id
                          ? 'border-[var(--mq-primary)] bg-[var(--mq-primary-light)]'
                          : 'border-[var(--mq-border)] bg-[var(--mq-card)] hover:border-[var(--mq-primary)]/50'
                      }`}
                    >
                      <span className="text-sm text-[var(--mq-text)] flex-1">
                        {objetivo.titulo}
                      </span>
                      <ChevronRight size={16} className="text-[var(--mq-text-subtle)]" />
                    </button>
                  ))}

                  {/* Objetivo customizado */}
                  <div
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${
                      objetivoCustomizado
                        ? 'border-[var(--mq-primary)] bg-[var(--mq-primary-light)]'
                        : 'border-[var(--mq-border)] bg-[var(--mq-card)]'
                    }`}
                  >
                    <div className="flex-1">
                      <span className="text-sm text-[var(--mq-text)]">Outro:</span>
                      <input
                        type="text"
                        value={objetivoCustomizado}
                        onChange={(e) => {
                          setObjetivoCustomizado(e.target.value);
                          setObjetivoSelecionado(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && objetivoCustomizado.trim()) {
                            setPassoAtual(3);
                          }
                        }}
                        placeholder="Digite seu objetivo e pressione Enter"
                        className="text-sm text-[var(--mq-text)] bg-transparent border-none outline-none w-full mt-1"
                      />
                    </div>
                    {objetivoCustomizado.trim() && (
                      <button
                        type="button"
                        onClick={() => setPassoAtual(3)}
                        className="text-[var(--mq-primary)] hover:text-[var(--mq-primary-dark)]"
                      >
                        <ChevronRight size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PASSO 3: Detalhe seu objetivo */}
            {passoAtual === 3 && (
              <motion.div
                key="passo3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mq-card p-6"
                style={{ borderRadius: 24 }}
              >
                <div className="mb-4">
                  <p className="mq-eyebrow mb-2">PASSO 3 DE 4</p>
                  <h3 className="text-base font-bold text-[var(--mq-text)]">
                    Detalhe seu objetivo
                  </h3>
                  <p className="text-xs text-[var(--mq-text-muted)] mt-1">
                    {objetivoSelecionado?.titulo || objetivoCustomizado}
                  </p>
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
                className="mq-card p-6"
                style={{ borderRadius: 24 }}
              >
                <div className="mb-4">
                  <p className="mq-eyebrow mb-2">PASSO 4 DE 4</p>
                  <h3 className="text-base font-bold text-[var(--mq-text)]">
                    Defina o prazo
                  </h3>
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
                        <div className="mt-2 text-[var(--mq-primary)]">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Resumo */}
                <div className="mt-6 p-4 rounded-xl bg-[var(--mq-background)] border border-[var(--mq-border)]">
                  <h4 className="text-xs font-bold text-[var(--mq-text-muted)] mb-2">RESUMO</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-[var(--mq-text-muted)]">Área:</span> {areaSelecionada?.icone} {areaSelecionada?.nome}</p>
                    <p><span className="text-[var(--mq-text-muted)]">Objetivo:</span> {objetivoSelecionado?.titulo || objetivoCustomizado}</p>
                    <p><span className="text-[var(--mq-text-muted)]">Prazo:</span> {prazoDias ? `${prazoDias} dias` : '-'}</p>
                  </div>
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
                      <Target size={18} />
                      Criar Objetivo
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
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

export default ObjetivosPageV13;
