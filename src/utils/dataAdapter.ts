/**
 * ARQUIVO: src/utils/dataAdapter.ts
 * AÇÃO: SUBSTITUIR arquivo existente
 * 
 * DataAdapter com correções específicas dos erros mostrados
 */

import type { 
  DashboardData, 
  PerfilDetectado, 
  CheckinDiario, 
  PlutchikEmotion, 
  DistribuicaoPanas, 
  Gamificacao, 
  SabotadorPadrao, 
  Insight
} from '../types/emotions';

// Interface da API N8N (conforme retorno real)
interface ApiData {
  user: {
    id: string;
    nome: string;
    nome_preferencia: string;
    whatsapp_numero: string;
    cronotipo_detectado: string | null;
    status_onboarding: string;
    criado_em: string;
  };
  perfil_big_five: {
    openness: string | null;
    conscientiousness: string | null;
    extraversion: string | null;
    agreeableness: string | null;
    neuroticism: string | null;
    confiabilidade: string | null;
    perfil_primario: string | null;
    perfil_secundario: string | null;
  };
  gamificacao: {
    xp_total: string | null;
    nivel_atual: string | null;
    streak_checkins_dias: string | null;
    conquistas_desbloqueadas: string | null;
    quest_diaria_status: string | null;
    quest_diaria_progresso: string | null;
  };
  sabotador: {
    id: string | null;
    nome: string | null;
    emoji: string | null;
    apelido_personalizado: string | null;
    total_deteccoes: string | null;
  };
  metricas_semana: {
    checkins_total: string;
    checkins_respondidos: string;
    humor_medio: string | null;
    ultima_emocao: string | null;
    ultimo_checkin_data: string | null;
    ultimo_checkin_emoji: string | null;
  };
  timestamp: string;
}

class DataAdapter {
  /**
   * Converte string "null" para null real, mantendo outros valores
   */
  private parseNullString<T>(value: string | null | undefined): T | null {
    if (value === null || value === undefined || value === 'null' || value === '') {
      return null;
    }
    return value as unknown as T;
  }

  /**
   * Converte string para número, tratando "null"
   */
  private parseNumber(value: string | null | undefined): number | null {
    const parsed = this.parseNullString<string>(value);
    if (parsed === null) return null;
    
    const num = Number(parsed);
    return isNaN(num) ? null : num;
  }

  /**
   * Gera perfil detectado baseado nos dados disponíveis
   */
  private generatePerfilDetectado(apiData: ApiData): PerfilDetectado {
    const bigFive = apiData.perfil_big_five;
    const perfilPrimario = this.parseNullString<string>(bigFive.perfil_primario);
    const perfilSecundario = this.parseNullString<string>(bigFive.perfil_secundario);
    const confiabilidade = this.parseNumber(bigFive.confiabilidade);
    
    // CORREÇÃO: Retornar tipo exato sem null para perfil_primario
    const mapearPerfilPrimario = (perfil: string | null) => {
      if (!perfil) return 'disciplinado';
      switch (perfil.toLowerCase()) {
        case 'perfeccionista': return 'perfeccionista';
        case 'disciplinado': return 'disciplinado';
        case 'desorganizado': return 'desorganizado';
        case 'depressivo': return 'depressivo';
        default: return 'disciplinado';
      }
    };

    // CORREÇÃO: Perfil secundário pode ser null
    const mapearPerfilSecundario = (perfil: string | null) => {
      if (!perfil) return null;
      switch (perfil.toLowerCase()) {
        case 'perfeccionista': return 'perfeccionista';
        case 'disciplinado': return 'disciplinado';
        case 'desorganizado': return 'desorganizado';
        case 'depressivo': return 'depressivo';
        default: return null;
      }
    };

    return {
      perfil_primario: mapearPerfilPrimario(perfilPrimario),
      perfil_secundario: mapearPerfilSecundario(perfilSecundario),
      confiabilidade: confiabilidade || 0,
      metodo_deteccao: perfilPrimario ? 'onboarding' : 'checkin',
      big_five_scores: {
        openness: this.parseNumber(bigFive.openness) || 0,
        conscientiousness: this.parseNumber(bigFive.conscientiousness) || 0,
        extraversion: this.parseNumber(bigFive.extraversion) || 0,
        agreeableness: this.parseNumber(bigFive.agreeableness) || 0,
        neuroticism: this.parseNumber(bigFive.neuroticism) || 0
      },
      descricao_comportamental: perfilPrimario ? 
        'Perfil baseado nas interações e análises comportamentais.' :
        'Perfil ainda sendo construído através das interações diárias.',
      tendencias_identificadas: perfilPrimario ? 
        ['Consistência em check-ins', 'Padrões emocionais estáveis'] :
        ['Novo usuário', 'Em processo de descoberta'],
      data_ultima_atualizacao: new Date().toISOString()
    };
  }

  /**
   * Gera check-ins histórico (mockado por enquanto)
   */
  private generateCheckinsHistorico(): CheckinDiario[] {
    return [];
  }

  /**
   * Gera roda de emoções padrão
   */
  private generateRodaEmocoes(): PlutchikEmotion[] {
    const emocoesPadrao: PlutchikEmotion[] = [
      { id: 'joy', nome: 'Alegria', intensidade: 0, cor: '#FFD700', emoji: '😊', categoria: 'primaria' },
      { id: 'trust', nome: 'Confiança', intensidade: 0, cor: '#90EE90', emoji: '🤗', categoria: 'primaria' },
      { id: 'fear', nome: 'Medo', intensidade: 0, cor: '#FF6347', emoji: '😨', categoria: 'primaria' },
      { id: 'surprise', nome: 'Surpresa', intensidade: 0, cor: '#FF69B4', emoji: '😲', categoria: 'primaria' },
      { id: 'sadness', nome: 'Tristeza', intensidade: 0, cor: '#4169E1', emoji: '😢', categoria: 'primaria' },
      { id: 'disgust', nome: 'Nojo', intensidade: 0, cor: '#8B4513', emoji: '🤢', categoria: 'primaria' },
      { id: 'anger', nome: 'Raiva', intensidade: 0, cor: '#DC143C', emoji: '😠', categoria: 'primaria' },
      { id: 'anticipation', nome: 'Expectativa', intensidade: 0, cor: '#FFA500', emoji: '🤔', categoria: 'primaria' }
    ];

    return emocoesPadrao;
  }

  /**
   * Gera distribuição PANAS baseada nas métricas
   * CORREÇÃO: Usar 'progresso' ao invés de 'em_progresso'
   */
  private generateDistribuicaoPanas(metricas: ApiData['metricas_semana']): DistribuicaoPanas {
    const humorMedio = this.parseNumber(metricas.humor_medio);
    
    if (humorMedio && humorMedio >= 7) {
      return {
        positivas: 75,
        negativas: 15,
        neutras: 10,
        meta_positividade: 70,
        status_meta: 'atingida'
      };
    }
    
    return {
      positivas: 50,
      negativas: 30,
      neutras: 20,
      meta_positividade: 70,
      status_meta: 'progresso' // CORREÇÃO: usar 'progresso'
    };
  }

  /**
   * Converte gamificação da API
   */
  private convertGamificacao(gamificacao: ApiData['gamificacao']): Gamificacao {
    const xpTotal = this.parseNumber(gamificacao.xp_total) || 0;
    const nivelAtual = this.parseNumber(gamificacao.nivel_atual) || 1;
    const streakDias = this.parseNumber(gamificacao.streak_checkins_dias) || 0;
    const questStatusRaw = this.parseNullString<string>(gamificacao.quest_diaria_status);
    
    // Mapear status corretamente para o tipo esperado
    let questStatus: 'pendente' | 'parcial' | 'completa' = 'pendente';
    if (questStatusRaw === 'parcial') questStatus = 'parcial';
    else if (questStatusRaw === 'completa') questStatus = 'completa';
    
    return {
      xp_total: xpTotal,
      nivel_atual: nivelAtual,
      streak_checkins_dias: streakDias,
      conquistas_desbloqueadas: [],
      quest_diaria_status: questStatus,
      quest_diaria_progresso: this.parseNumber(gamificacao.quest_diaria_progresso) || 0,
      quest_diaria_descricao: 'Complete sua conversa diária',
      proximo_nivel_xp: (nivelAtual + 1) * 200
    };
  }

  /**
   * Converte sabotador da API
   */
  private convertSabotador(sabotador: ApiData['sabotador']): SabotadorPadrao {
    const id = this.parseNullString<string>(sabotador.id);
    const nome = this.parseNullString<string>(sabotador.nome);
    const emoji = this.parseNullString<string>(sabotador.emoji);
    const apelidoPersonalizado = this.parseNullString<string>(sabotador.apelido_personalizado);
    const totalDeteccoes = this.parseNumber(sabotador.total_deteccoes);
    
    if (!id || !nome) {
      return {
        id: 'none',
        nome: 'Nenhum detectado',
        emoji: '😌',
        apelido: 'Ainda descobrindo',
        detectado_em: 0,
        total_conversas: 1,
        insight_contexto: 'Continue conversando para identificarmos seus padrões internos.',
        contramedida: 'Mantenha a consistência em suas reflexões diárias.'
      };
    }

    return {
      id,
      nome,
      emoji: emoji || '🤔',
      apelido: apelidoPersonalizado || 'Sem nome',
      detectado_em: totalDeteccoes || 0,
      total_conversas: 7,
      insight_contexto: 'Padrão identificado nas conversas recentes.',
      contramedida: 'Continue monitorando e aplicando as técnicas sugeridas.'
    };
  }

  /**
   * Gera insights baseados nos dados
   */
  private generateInsights(apiData: ApiData): Insight[] {
    const insights: Insight[] = [];
    const metricas = apiData.metricas_semana;
    const checkins = this.parseNumber(metricas.checkins_respondidos) || 0;

    if (checkins > 0) {
      insights.push({
        id: 'insight_consistency',
        tipo: 'positivo',
        titulo: 'Primeiros passos!',
        descricao: 'Você começou sua jornada de autoconhecimento. Continue assim!',
        icone: '🎯',
        data_criacao: new Date().toISOString(),
        prioridade: 'media',
        categoria: 'comportamental'
      });
    }

    if (checkins === 0) {
      insights.push({
        id: 'insight_welcome',
        tipo: 'melhoria',
        titulo: 'Bem-vindo ao MindQuest!',
        descricao: 'Comece sua jornada fazendo seu primeiro check-in diário via WhatsApp.',
        icone: '👋',
        data_criacao: new Date().toISOString(),
        prioridade: 'alta',
        categoria: 'cognitivo'
      });
    }

    return insights;
  }

  /**
   * Converte dados da API para estrutura do Dashboard
   */
  public convertApiToDashboard(apiData: ApiData): DashboardData {
    const perfilDetectado = this.generatePerfilDetectado(apiData);
    const metricas = apiData.metricas_semana;
    const humorMedio = this.parseNumber(metricas.humor_medio);
    const cronotipoRaw = this.parseNullString<string>(apiData.user.cronotipo_detectado);

    // Mapear cronotipo para tipo válido
    let cronotipo: 'matutino' | 'vespertino' | 'noturno' = 'matutino';
    if (cronotipoRaw === 'vespertino') cronotipo = 'vespertino';
    else if (cronotipoRaw === 'noturno') cronotipo = 'noturno';

    const dashboardData: DashboardData = {
      usuario: {
        nome: apiData.user.nome,
        nome_preferencia: apiData.user.nome_preferencia,
        cronotipo_detectado: cronotipo,
        perfil_detectado: perfilDetectado
      },
      
      mood_gauge: {
        nivel_atual: humorMedio ? (humorMedio - 5) : 0,
        emoji_atual: this.parseNullString<string>(metricas.ultimo_checkin_emoji) || '😐',
        tendencia_semanal: humorMedio ? (humorMedio > 6 ? 1 : humorMedio < 4 ? -1 : 0) : 0,
        cor_indicador: humorMedio && humorMedio >= 7 ? '#10B981' : '#6B7280'
      },
      
      checkins_historico: this.generateCheckinsHistorico(),
      roda_emocoes: this.generateRodaEmocoes(),
      distribuicao_panas: this.generateDistribuicaoPanas(metricas),
      gamificacao: this.convertGamificacao(apiData.gamificacao),
      
      sabotadores: {
        padrao_principal: this.convertSabotador(apiData.sabotador)
      },
      
      insights: this.generateInsights(apiData),
      alertas_background: [],
      
      metricas_periodo: {
        periodo_selecionado: 'semana',
        data_inicio: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        data_fim: new Date().toISOString().split('T')[0],
        total_checkins: this.parseNumber(metricas.checkins_total) || 0,
        taxa_resposta: (() => {
          const total = this.parseNumber(metricas.checkins_total);
          const respondidos = this.parseNumber(metricas.checkins_respondidos);
          if (!total || total === 0) return 0;
          return (respondidos! / total) * 100;
        })(),
        humor_medio: humorMedio || 5,
        emocao_dominante: this.parseNullString<string>(metricas.ultima_emocao) || 'neutral'
      }
    };

    return dashboardData;
  }
}

export const dataAdapter = new DataAdapter();
export default dataAdapter;