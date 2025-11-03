--
-- PostgreSQL database dump
--

\restrict NFfhBKff7mQYsR3cFgZxgkcQxQA8pJdiAWQ3dlDnfUIuVl3yBtJa884dvs2Q06c

-- Dumped from database version 17.6 (Debian 17.6-1.pgdg12+1)
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-03 09:38:21 WET

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 482 (class 1259 OID 36530)
-- Name: gamificacao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gamificacao (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    xp_total integer DEFAULT 0,
    nivel_atual integer DEFAULT 1,
    xp_proximo_nivel integer DEFAULT 200,
    titulo_nivel character varying(50) DEFAULT 'Explorador'::character varying,
    streak_conversas_dias integer DEFAULT 0,
    streak_protecao_usada boolean DEFAULT false,
    streak_protecao_resetada_em date,
    ultima_conversa_data date,
    melhor_streak integer DEFAULT 0,
    quest_diaria_status character varying(20) DEFAULT 'pendente'::character varying,
    quest_diaria_progresso integer DEFAULT 0,
    quest_diaria_descricao text,
    quest_diaria_data date,
    quest_streak_dias integer DEFAULT 0,
    conquistas_desbloqueadas jsonb DEFAULT '[]'::jsonb,
    total_conversas integer DEFAULT 0,
    total_reflexoes integer DEFAULT 0,
    total_xp_ganho_hoje integer DEFAULT 0,
    ultima_conquista_id character varying(50),
    ultima_conquista_data timestamp without time zone,
    criado_em timestamp without time zone DEFAULT now(),
    atualizado_em timestamp without time zone DEFAULT now(),
    CONSTRAINT gamificacao_nivel_atual_check CHECK (((nivel_atual >= 1) AND (nivel_atual <= 20))),
    CONSTRAINT gamificacao_quest_progresso_check CHECK (((quest_diaria_progresso >= 0) AND (quest_diaria_progresso <= 100))),
    CONSTRAINT gamificacao_quest_status_check CHECK (((quest_diaria_status)::text = ANY ((ARRAY['pendente'::character varying, 'parcial'::character varying, 'completa'::character varying])::text[]))),
    CONSTRAINT gamificacao_xp_total_check CHECK ((xp_total >= 0))
);


ALTER TABLE public.gamificacao OWNER TO postgres;

--
-- TOC entry 491 (class 1259 OID 72027)
-- Name: gamificacao_niveis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gamificacao_niveis (
    nivel integer NOT NULL,
    xp_minimo integer NOT NULL,
    xp_proximo_nivel integer,
    titulo character varying(60) NOT NULL,
    descricao text,
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT gamificacao_niveis_check CHECK (((xp_proximo_nivel IS NULL) OR (xp_proximo_nivel > xp_minimo))),
    CONSTRAINT gamificacao_niveis_xp_minimo_check CHECK ((xp_minimo >= 0))
);


ALTER TABLE public.gamificacao_niveis OWNER TO postgres;

--
-- TOC entry 477 (class 1259 OID 22611)
-- Name: insights; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.insights (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid,
    tipo character varying(20),
    categoria character varying(20),
    titulo character varying(150) NOT NULL,
    descricao text NOT NULL,
    icone character varying(10),
    prioridade character varying(10),
    ativo boolean DEFAULT true,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    chat_id uuid,
    resumo_situacao text,
    feedback_positivo text,
    feedback_desenvolvimento text,
    feedback_motivacional text,
    recursos_sugeridos jsonb,
    baseado_em text[],
    CONSTRAINT insights_categoria_check CHECK (((categoria)::text = ANY ((ARRAY['comportamental'::character varying, 'emocional'::character varying, 'social'::character varying, 'cognitivo'::character varying])::text[]))),
    CONSTRAINT insights_prioridade_check CHECK (((prioridade)::text = ANY ((ARRAY['baixa'::character varying, 'media'::character varying, 'alta'::character varying])::text[]))),
    CONSTRAINT insights_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['padrao'::character varying, 'melhoria'::character varying, 'positivo'::character varying, 'alerta'::character varying])::text[])))
);


ALTER TABLE public.insights OWNER TO postgres;

--
-- TOC entry 485 (class 1259 OID 69569)
-- Name: quest_catalog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quest_catalog (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sequencia bigint NOT NULL,
    codigo character varying(64) NOT NULL,
    titulo character varying(120) NOT NULL,
    descricao text,
    categoria character varying(30) NOT NULL,
    tipo character varying(20) DEFAULT 'sistema'::character varying NOT NULL,
    gatilho_tipo character varying(30) NOT NULL,
    gatilho_valor integer,
    xp_recompensa integer DEFAULT 0 NOT NULL,
    repeticao character varying(20) DEFAULT 'unica'::character varying NOT NULL,
    ordem_inicial smallint,
    ativo boolean DEFAULT true NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT quest_catalog_categoria_check CHECK (((categoria)::text = ANY ((ARRAY['primeiros_passos'::character varying, 'consistencia'::character varying, 'profundidade'::character varying, 'engajamento'::character varying, 'diaria'::character varying])::text[]))),
    CONSTRAINT quest_catalog_gatilho_tipo_check CHECK (((gatilho_tipo)::text = ANY ((ARRAY['total_conversas'::character varying, 'dias_consecutivos'::character varying, 'total_reflexoes'::character varying, 'manual'::character varying, 'diario'::character varying])::text[]))),
    CONSTRAINT quest_catalog_repeticao_check CHECK (((repeticao)::text = ANY ((ARRAY['unica'::character varying, 'recorrente'::character varying, 'diaria'::character varying])::text[]))),
    CONSTRAINT quest_catalog_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['sistema'::character varying, 'diaria'::character varying, 'assistente'::character varying])::text[]))),
    CONSTRAINT quest_catalog_xp_recompensa_check CHECK ((xp_recompensa >= 0))
);


ALTER TABLE public.quest_catalog OWNER TO postgres;

--
-- TOC entry 484 (class 1259 OID 69568)
-- Name: quest_catalog_sequencia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.quest_catalog ALTER COLUMN sequencia ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.quest_catalog_sequencia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 478 (class 1259 OID 25461)
-- Name: usr_chat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usr_chat (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid,
    session_id character varying(200) DEFAULT gen_random_uuid(),
    data_conversa date NOT NULL,
    horario_inicio time without time zone,
    horario_fim time without time zone,
    total_interactions integer DEFAULT 0,
    status character varying(20) DEFAULT 'incompleta'::character varying,
    mensagens jsonb,
    processada_em timestamp without time zone,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    resumo_conversa text,
    tem_reflexao boolean DEFAULT false,
    total_palavras_usuario integer DEFAULT 0,
    CONSTRAINT usr_chat_status_check CHECK (((status)::text = ANY ((ARRAY['completa'::character varying, 'incompleta'::character varying, 'processada'::character varying])::text[])))
);


ALTER TABLE public.usr_chat OWNER TO postgres;

--
-- TOC entry 3900 (class 0 OID 0)
-- Dependencies: 478
-- Name: COLUMN usr_chat.resumo_conversa; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.usr_chat.resumo_conversa IS 'Resumo conciso da conversa gerado pela IA';


--
-- TOC entry 3901 (class 0 OID 0)
-- Dependencies: 478
-- Name: COLUMN usr_chat.tem_reflexao; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.usr_chat.tem_reflexao IS 'Indica se o usuário demonstrou reflexão profunda';


--
-- TOC entry 3902 (class 0 OID 0)
-- Dependencies: 478
-- Name: COLUMN usr_chat.total_palavras_usuario; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.usr_chat.total_palavras_usuario IS 'Total de palavras nas falas do usuário';


--
-- TOC entry 486 (class 1259 OID 69593)
-- Name: usuarios_quest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios_quest (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    quest_id uuid NOT NULL,
    chat_id uuid,
    status character varying(20) DEFAULT 'pendente'::character varying NOT NULL,
    progresso_atual integer DEFAULT 0 NOT NULL,
    progresso_meta integer,
    progresso_percentual integer DEFAULT 0 NOT NULL,
    xp_concedido integer DEFAULT 0 NOT NULL,
    referencia_data date,
    dados_extras jsonb,
    ativado_em timestamp without time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp without time zone DEFAULT now() NOT NULL,
    concluido_em timestamp without time zone,
    insight_id uuid,
    insight_tipo character varying(20),
    CONSTRAINT usuarios_quest_insight_tipo_check CHECK (((insight_tipo)::text = ANY ((ARRAY['usuario'::character varying, 'assistente'::character varying])::text[]))),
    CONSTRAINT usuarios_quest_progresso_atual_check CHECK ((progresso_atual >= 0)),
    CONSTRAINT usuarios_quest_progresso_percentual_check CHECK (((progresso_percentual >= 0) AND (progresso_percentual <= 100))),
    CONSTRAINT usuarios_quest_status_check CHECK (((status)::text = ANY ((ARRAY['pendente'::character varying, 'ativa'::character varying, 'completa'::character varying, 'expirada'::character varying, 'arquivada'::character varying])::text[]))),
    CONSTRAINT usuarios_quest_xp_concedido_check CHECK ((xp_concedido >= 0))
);


ALTER TABLE public.usuarios_quest OWNER TO postgres;

--
-- TOC entry 3741 (class 2606 OID 72037)
-- Name: gamificacao_niveis gamificacao_niveis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gamificacao_niveis
    ADD CONSTRAINT gamificacao_niveis_pkey PRIMARY KEY (nivel);


--
-- TOC entry 3720 (class 2606 OID 36557)
-- Name: gamificacao gamificacao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gamificacao
    ADD CONSTRAINT gamificacao_pkey PRIMARY KEY (id);


--
-- TOC entry 3716 (class 2606 OID 22623)
-- Name: insights insights_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insights
    ADD CONSTRAINT insights_pkey PRIMARY KEY (id);


--
-- TOC entry 3727 (class 2606 OID 69589)
-- Name: quest_catalog quest_catalog_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quest_catalog
    ADD CONSTRAINT quest_catalog_codigo_key UNIQUE (codigo);


--
-- TOC entry 3729 (class 2606 OID 69587)
-- Name: quest_catalog quest_catalog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quest_catalog
    ADD CONSTRAINT quest_catalog_pkey PRIMARY KEY (id);


--
-- TOC entry 3718 (class 2606 OID 25479)
-- Name: usr_chat usr_chat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usr_chat
    ADD CONSTRAINT usr_chat_pkey PRIMARY KEY (id);


--
-- TOC entry 3739 (class 2606 OID 69610)
-- Name: usuarios_quest usuarios_quest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_quest
    ADD CONSTRAINT usuarios_quest_pkey PRIMARY KEY (id);


--
-- TOC entry 3721 (class 1259 OID 36564)
-- Name: idx_gamificacao_conquistas; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_gamificacao_conquistas ON public.gamificacao USING gin (conquistas_desbloqueadas);


--
-- TOC entry 3722 (class 1259 OID 36565)
-- Name: idx_gamificacao_ultima_conversa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_gamificacao_ultima_conversa ON public.gamificacao USING btree (ultima_conversa_data);


--
-- TOC entry 3723 (class 1259 OID 36563)
-- Name: idx_gamificacao_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_gamificacao_usuario ON public.gamificacao USING btree (usuario_id);


--
-- TOC entry 3712 (class 1259 OID 35779)
-- Name: idx_insights_chat; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_insights_chat ON public.insights USING btree (chat_id);


--
-- TOC entry 3713 (class 1259 OID 22630)
-- Name: idx_insights_tipo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_insights_tipo ON public.insights USING btree (tipo);


--
-- TOC entry 3714 (class 1259 OID 22629)
-- Name: idx_insights_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_insights_usuario ON public.insights USING btree (usuario_id);


--
-- TOC entry 3724 (class 1259 OID 69591)
-- Name: idx_quest_catalog_categoria; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quest_catalog_categoria ON public.quest_catalog USING btree (categoria);


--
-- TOC entry 3725 (class 1259 OID 69592)
-- Name: idx_quest_catalog_tipo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quest_catalog_tipo ON public.quest_catalog USING btree (tipo);


--
-- TOC entry 3731 (class 1259 OID 69629)
-- Name: idx_usuarios_quest_chat; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_quest_chat ON public.usuarios_quest USING btree (chat_id);


--
-- TOC entry 3732 (class 1259 OID 72044)
-- Name: idx_usuarios_quest_insight; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_quest_insight ON public.usuarios_quest USING btree (insight_id);


--
-- TOC entry 3733 (class 1259 OID 69628)
-- Name: idx_usuarios_quest_quest; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_quest_quest ON public.usuarios_quest USING btree (quest_id);


--
-- TOC entry 3734 (class 1259 OID 69627)
-- Name: idx_usuarios_quest_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_quest_status ON public.usuarios_quest USING btree (status);


--
-- TOC entry 3735 (class 1259 OID 69626)
-- Name: idx_usuarios_quest_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_quest_usuario ON public.usuarios_quest USING btree (usuario_id);


--
-- TOC entry 3730 (class 1259 OID 69590)
-- Name: uq_quest_catalog_sequencia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_quest_catalog_sequencia ON public.quest_catalog USING btree (sequencia);


--
-- TOC entry 3736 (class 1259 OID 69631)
-- Name: uq_usuarios_quest_diaria; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_usuarios_quest_diaria ON public.usuarios_quest USING btree (usuario_id, quest_id, referencia_data) WHERE (referencia_data IS NOT NULL);


--
-- TOC entry 3737 (class 1259 OID 69630)
-- Name: uq_usuarios_quest_unica; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_usuarios_quest_unica ON public.usuarios_quest USING btree (usuario_id, quest_id) WHERE (referencia_data IS NULL);


--
-- TOC entry 3745 (class 2606 OID 36558)
-- Name: gamificacao gamificacao_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gamificacao
    ADD CONSTRAINT gamificacao_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 3742 (class 2606 OID 35774)
-- Name: insights insights_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insights
    ADD CONSTRAINT insights_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.usr_chat(id) ON DELETE CASCADE;


--
-- TOC entry 3743 (class 2606 OID 22624)
-- Name: insights insights_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insights
    ADD CONSTRAINT insights_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 3744 (class 2606 OID 25480)
-- Name: usr_chat usr_chat_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usr_chat
    ADD CONSTRAINT usr_chat_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 3746 (class 2606 OID 69621)
-- Name: usuarios_quest usuarios_quest_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_quest
    ADD CONSTRAINT usuarios_quest_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.usr_chat(id) ON DELETE SET NULL;


--
-- TOC entry 3747 (class 2606 OID 72038)
-- Name: usuarios_quest usuarios_quest_insight_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_quest
    ADD CONSTRAINT usuarios_quest_insight_id_fkey FOREIGN KEY (insight_id) REFERENCES public.insights(id) ON DELETE SET NULL;


--
-- TOC entry 3748 (class 2606 OID 69616)
-- Name: usuarios_quest usuarios_quest_quest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_quest
    ADD CONSTRAINT usuarios_quest_quest_id_fkey FOREIGN KEY (quest_id) REFERENCES public.quest_catalog(id) ON DELETE CASCADE;


--
-- TOC entry 3749 (class 2606 OID 69611)
-- Name: usuarios_quest usuarios_quest_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_quest
    ADD CONSTRAINT usuarios_quest_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


-- Completed on 2025-11-03 09:38:37 WET

--
-- PostgreSQL database dump complete
--

\unrestrict NFfhBKff7mQYsR3cFgZxgkcQxQA8pJdiAWQ3dlDnfUIuVl3yBtJa884dvs2Q06c

