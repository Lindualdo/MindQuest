--
-- PostgreSQL database dump
--

-- Dumped from database version 17.6 (Debian 17.6-1.pgdg12+1)
-- Dumped by pg_dump version 17.5

-- Started on 2025-10-06 21:51:19 UTC

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

--
-- TOC entry 125 (class 2615 OID 22402)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 455 (class 1259 OID 22504)
-- Name: emocoes_plutchik; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emocoes_plutchik (
    id character varying(20) NOT NULL,
    nome character varying(50) NOT NULL,
    cor character varying(7) NOT NULL,
    emoji character varying(10) NOT NULL,
    categoria character varying(20),
    CONSTRAINT emocoes_plutchik_categoria_check CHECK (((categoria)::text = ANY ((ARRAY['primaria'::character varying, 'secundaria'::character varying])::text[])))
);


ALTER TABLE public.emocoes_plutchik OWNER TO postgres;

--
-- TOC entry 461 (class 1259 OID 22589)
-- Name: gamificacao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gamificacao (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid,
    xp_total integer DEFAULT 0,
    nivel_atual integer DEFAULT 1,
    streak_conversas_dias integer DEFAULT 0,
    conquistas_desbloqueadas text[],
    quest_diaria_status character varying(20) DEFAULT 'pendente'::character varying,
    quest_diaria_progresso integer DEFAULT 0,
    quest_diaria_descricao text,
    atualizado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT gamificacao_quest_diaria_progresso_check CHECK (((quest_diaria_progresso >= 0) AND (quest_diaria_progresso <= 100))),
    CONSTRAINT gamificacao_quest_diaria_status_check CHECK (((quest_diaria_status)::text = ANY ((ARRAY['pendente'::character varying, 'parcial'::character varying, 'completa'::character varying])::text[])))
);


ALTER TABLE public.gamificacao OWNER TO postgres;

--
-- TOC entry 3901 (class 0 OID 0)
-- Dependencies: 461
-- Name: COLUMN gamificacao.streak_conversas_dias; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.gamificacao.streak_conversas_dias IS 'Sequência de conversas diárias consecutivas';


--
-- TOC entry 462 (class 1259 OID 22611)
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
    CONSTRAINT insights_categoria_check CHECK (((categoria)::text = ANY ((ARRAY['comportamental'::character varying, 'emocional'::character varying, 'social'::character varying, 'cognitivo'::character varying])::text[]))),
    CONSTRAINT insights_prioridade_check CHECK (((prioridade)::text = ANY ((ARRAY['baixa'::character varying, 'media'::character varying, 'alta'::character varying])::text[]))),
    CONSTRAINT insights_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['padrao'::character varying, 'melhoria'::character varying, 'positivo'::character varying, 'alerta'::character varying])::text[])))
);


ALTER TABLE public.insights OWNER TO postgres;

--
-- TOC entry 454 (class 1259 OID 22459)
-- Name: perfis_big_five; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfis_big_five (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid,
    openness integer,
    conscientiousness integer,
    extraversion integer,
    agreeableness integer,
    neuroticism integer,
    confiabilidade integer,
    perfil_primario character varying(30),
    perfil_secundario character varying(30),
    metodo_deteccao character varying(20),
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT perfis_big_five_agreeableness_check CHECK (((agreeableness >= 0) AND (agreeableness <= 100))),
    CONSTRAINT perfis_big_five_confiabilidade_check CHECK (((confiabilidade >= 0) AND (confiabilidade <= 100))),
    CONSTRAINT perfis_big_five_conscientiousness_check CHECK (((conscientiousness >= 0) AND (conscientiousness <= 100))),
    CONSTRAINT perfis_big_five_extraversion_check CHECK (((extraversion >= 0) AND (extraversion <= 100))),
    CONSTRAINT perfis_big_five_metodo_deteccao_check CHECK (((metodo_deteccao)::text = ANY ((ARRAY['onboarding'::character varying, 'checkin'::character varying, 'conversa'::character varying])::text[]))),
    CONSTRAINT perfis_big_five_neuroticism_check CHECK (((neuroticism >= 0) AND (neuroticism <= 100))),
    CONSTRAINT perfis_big_five_openness_check CHECK (((openness >= 0) AND (openness <= 100))),
    CONSTRAINT perfis_big_five_perfil_primario_check CHECK (((perfil_primario)::text = ANY ((ARRAY['perfeccionista'::character varying, 'disciplinado'::character varying, 'desorganizado'::character varying, 'depressivo'::character varying])::text[])))
);


ALTER TABLE public.perfis_big_five OWNER TO postgres;

--
-- TOC entry 459 (class 1259 OID 22559)
-- Name: pilares_vida_catalogo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pilares_vida_catalogo (
    id character varying(30) NOT NULL,
    nome character varying(50) NOT NULL,
    emoji character varying(10),
    descricao text,
    areas_avaliacao text[],
    perguntas_reflexao text[]
);


ALTER TABLE public.pilares_vida_catalogo OWNER TO postgres;

--
-- TOC entry 457 (class 1259 OID 22530)
-- Name: sabotadores_catalogo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sabotadores_catalogo (
    id character varying(30) NOT NULL,
    nome character varying(50) NOT NULL,
    emoji character varying(10),
    descricao text,
    contextos_tipicos text[],
    contramedidas_sugeridas text[]
);


ALTER TABLE public.sabotadores_catalogo OWNER TO postgres;

--
-- TOC entry 463 (class 1259 OID 25461)
-- Name: usr_chat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usr_chat (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid,
    whatsapp_numero character varying(20) NOT NULL,
    session_id character varying(200) DEFAULT gen_random_uuid(),
    data_conversa date NOT NULL,
    horario_inicio time without time zone,
    horario_fim time without time zone,
    total_interactions integer DEFAULT 0,
    status character varying(20) DEFAULT 'incompleta'::character varying,
    mensagens jsonb,
    contexto_final jsonb,
    contexto_validado boolean DEFAULT false,
    --humor_autoavaliado integer,
    --emocao_primaria character varying(50),
    --intensidade_emocao integer,
    --energia_detectada integer,
    qualidade_interacao integer,
    --emoji_dia character varying(10),
    --insights_extraidos jsonb,
    --sabotadores_detectados jsonb,
    processada_em timestamp without time zone,
    observacoes_usuario text,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT usr_chat_energia_detectada_check CHECK (((energia_detectada >= 1) AND (energia_detectada <= 10))),
    CONSTRAINT usr_chat_humor_autoavaliado_check CHECK (((humor_autoavaliado >= 1) AND (humor_autoavaliado <= 10))),
    CONSTRAINT usr_chat_intensidade_emocao_check CHECK (((intensidade_emocao >= 1) AND (intensidade_emocao <= 10))),
    CONSTRAINT usr_chat_qualidade_interacao_check CHECK (((qualidade_interacao >= 1) AND (qualidade_interacao <= 10))),
    CONSTRAINT usr_chat_status_check CHECK (((status)::text = ANY ((ARRAY['completa'::character varying, 'incompleta'::character varying, 'processada'::character varying])::text[])))
);


ALTER TABLE public.usr_chat OWNER TO postgres;

--
-- TOC entry 453 (class 1259 OID 22442)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    whatsapp_numero character varying(20) NOT NULL,
    nome character varying(100),
    nome_preferencia character varying(50),
    token_acesso character varying(255),
    token_expira_em timestamp without time zone,
    cronotipo_detectado character varying(20),
    status_onboarding character varying(20) DEFAULT 'pendente'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modo_teste boolean DEFAULT false,
    CONSTRAINT usuarios_cronotipo_detectado_check CHECK (((cronotipo_detectado)::text = ANY ((ARRAY['matutino'::character varying, 'vespertino'::character varying, 'noturno'::character varying])::text[]))),
    CONSTRAINT usuarios_status_onboarding_check CHECK (((status_onboarding)::text = ANY ((ARRAY['pendente'::character varying, 'parcial'::character varying, 'completo'::character varying])::text[])))
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 456 (class 1259 OID 22510)
-- Name: usuarios_emocoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios_emocoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid,
    emocao_id character varying(20),
    intensidade integer,
    detectado_em date,
    contexto character varying(100),
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    chat_id uuid,
    CONSTRAINT usuarios_emocoes_intensidade_check CHECK (((intensidade >= 0) AND (intensidade <= 100)))
);


ALTER TABLE public.usuarios_emocoes OWNER TO postgres;

--
-- TOC entry 464 (class 1259 OID 30316)
-- Name: usuarios_humor_energia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios_humor_energia (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    chat_id uuid NOT NULL,
    data_registro date NOT NULL,
    hora_registro time without time zone NOT NULL,
    detectado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    periodo_dia character varying(20),
    humor_dia integer NOT NULL,
    energia_nivel integer NOT NULL,
    variacao_humor character varying(20),
    variacao_energia character varying(20),
    justificativa_humor text,
    justificativa_energia text,
    evidencias_textuais jsonb,
    confianca_analise integer,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT usuarios_humor_energia_confianca_analise_check CHECK (((confianca_analise >= 0) AND (confianca_analise <= 100))),
    CONSTRAINT usuarios_humor_energia_energia_nivel_check CHECK (((energia_nivel >= 1) AND (energia_nivel <= 10))),
    CONSTRAINT usuarios_humor_energia_humor_dia_check CHECK (((humor_dia >= 1) AND (humor_dia <= 10)))
);


ALTER TABLE public.usuarios_humor_energia OWNER TO postgres;

--
-- TOC entry 460 (class 1259 OID 22566)
-- Name: usuarios_pilares; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios_pilares (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid,
    pilar_id character varying(30),
    avaliacao_atual integer,
    meta_definida integer,
    observacoes text,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT usuarios_pilares_avaliacao_atual_check CHECK (((avaliacao_atual >= 1) AND (avaliacao_atual <= 10))),
    CONSTRAINT usuarios_pilares_meta_definida_check CHECK (((meta_definida >= 1) AND (meta_definida <= 10)))
);


ALTER TABLE public.usuarios_pilares OWNER TO postgres;

--
-- TOC entry 458 (class 1259 OID 22537)
-- Name: usuarios_sabotadores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios_sabotadores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    sabotador_id character varying(30) NOT NULL,
    apelido_personalizado character varying(50),
    total_deteccoes integer DEFAULT 0,
    contexto_principal character varying(100),
    insight_atual text,
    contramedida_ativa text,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    intensidade_acumulada_dia integer DEFAULT 0,
    total_deteccoes_dia integer DEFAULT 0,
    data_ultima_atividade date,
    sabotador_predominante boolean DEFAULT false,
    periodo_analise character varying(20) DEFAULT 'ultimos_30_dias'::character varying,
    intensidade_media integer,
    chat_id uuid
);


ALTER TABLE public.usuarios_sabotadores OWNER TO postgres;

--
-- TOC entry 3697 (class 2606 OID 22509)
-- Name: emocoes_plutchik emocoes_plutchik_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emocoes_plutchik
    ADD CONSTRAINT emocoes_plutchik_pkey PRIMARY KEY (id);


--
-- TOC entry 3720 (class 2606 OID 22604)
-- Name: gamificacao gamificacao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gamificacao
    ADD CONSTRAINT gamificacao_pkey PRIMARY KEY (id);


--
-- TOC entry 3725 (class 2606 OID 22623)
-- Name: insights insights_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insights
    ADD CONSTRAINT insights_pkey PRIMARY KEY (id);


--
-- TOC entry 3695 (class 2606 OID 22474)
-- Name: perfis_big_five perfis_big_five_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfis_big_five
    ADD CONSTRAINT perfis_big_five_pkey PRIMARY KEY (id);


--
-- TOC entry 3715 (class 2606 OID 22565)
-- Name: pilares_vida_catalogo pilares_vida_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pilares_vida_catalogo
    ADD CONSTRAINT pilares_vida_catalogo_pkey PRIMARY KEY (id);


--
-- TOC entry 3706 (class 2606 OID 22536)
-- Name: sabotadores_catalogo sabotadores_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sabotadores_catalogo
    ADD CONSTRAINT sabotadores_catalogo_pkey PRIMARY KEY (id);


--
-- TOC entry 3727 (class 2606 OID 25479)
-- Name: usr_chat usr_chat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usr_chat
    ADD CONSTRAINT usr_chat_pkey PRIMARY KEY (id);


--
-- TOC entry 3702 (class 2606 OID 30532)
-- Name: usuarios_emocoes usuarios_emocoes_chat_emocao_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_emocoes
    ADD CONSTRAINT usuarios_emocoes_chat_emocao_unique UNIQUE (chat_id, emocao_id);


--
-- TOC entry 3704 (class 2606 OID 22517)
-- Name: usuarios_emocoes usuarios_emocoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_emocoes
    ADD CONSTRAINT usuarios_emocoes_pkey PRIMARY KEY (id);


--
-- TOC entry 3733 (class 2606 OID 30491)
-- Name: usuarios_humor_energia usuarios_humor_energia_chat_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_humor_energia
    ADD CONSTRAINT usuarios_humor_energia_chat_id_unique UNIQUE (chat_id);


--
-- TOC entry 3735 (class 2606 OID 30328)
-- Name: usuarios_humor_energia usuarios_humor_energia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_humor_energia
    ADD CONSTRAINT usuarios_humor_energia_pkey PRIMARY KEY (id);


--
-- TOC entry 3718 (class 2606 OID 22577)
-- Name: usuarios_pilares usuarios_pilares_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_pilares
    ADD CONSTRAINT usuarios_pilares_pkey PRIMARY KEY (id);


--
-- TOC entry 3688 (class 2606 OID 22452)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 3713 (class 2606 OID 22547)
-- Name: usuarios_sabotadores usuarios_sabotadores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_sabotadores
    ADD CONSTRAINT usuarios_sabotadores_pkey PRIMARY KEY (id);


--
-- TOC entry 3690 (class 2606 OID 22456)
-- Name: usuarios usuarios_token_acesso_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_token_acesso_key UNIQUE (token_acesso);


--
-- TOC entry 3692 (class 2606 OID 22454)
-- Name: usuarios usuarios_whatsapp_numero_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_whatsapp_numero_key UNIQUE (whatsapp_numero);


--
-- TOC entry 3721 (class 1259 OID 22610)
-- Name: idx_gamificacao_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_gamificacao_usuario ON public.gamificacao USING btree (usuario_id);


--
-- TOC entry 3728 (class 1259 OID 30342)
-- Name: idx_humor_energia_chat; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_humor_energia_chat ON public.usuarios_humor_energia USING btree (chat_id);


--
-- TOC entry 3729 (class 1259 OID 30340)
-- Name: idx_humor_energia_data; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_humor_energia_data ON public.usuarios_humor_energia USING btree (data_registro);


--
-- TOC entry 3730 (class 1259 OID 30341)
-- Name: idx_humor_energia_periodo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_humor_energia_periodo ON public.usuarios_humor_energia USING btree (usuario_id, data_registro);


--
-- TOC entry 3731 (class 1259 OID 30339)
-- Name: idx_humor_energia_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_humor_energia_usuario ON public.usuarios_humor_energia USING btree (usuario_id);


--
-- TOC entry 3722 (class 1259 OID 22630)
-- Name: idx_insights_tipo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_insights_tipo ON public.insights USING btree (tipo);


--
-- TOC entry 3723 (class 1259 OID 22629)
-- Name: idx_insights_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_insights_usuario ON public.insights USING btree (usuario_id);


--
-- TOC entry 3693 (class 1259 OID 22480)
-- Name: idx_perfis_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_perfis_usuario ON public.perfis_big_five USING btree (usuario_id);


--
-- TOC entry 3698 (class 1259 OID 30530)
-- Name: idx_usuarios_emocoes_chat; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_emocoes_chat ON public.usuarios_emocoes USING btree (chat_id);


--
-- TOC entry 3699 (class 1259 OID 22529)
-- Name: idx_usuarios_emocoes_data; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_emocoes_data ON public.usuarios_emocoes USING btree (detectado_em);


--
-- TOC entry 3700 (class 1259 OID 22528)
-- Name: idx_usuarios_emocoes_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_emocoes_usuario ON public.usuarios_emocoes USING btree (usuario_id);


--
-- TOC entry 3716 (class 1259 OID 22588)
-- Name: idx_usuarios_pilares_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_pilares_usuario ON public.usuarios_pilares USING btree (usuario_id);


--
-- TOC entry 3707 (class 1259 OID 30847)
-- Name: idx_usuarios_sabotadores_criado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_sabotadores_criado ON public.usuarios_sabotadores USING btree (criado_em DESC);


--
-- TOC entry 3708 (class 1259 OID 30845)
-- Name: idx_usuarios_sabotadores_sabotador; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_sabotadores_sabotador ON public.usuarios_sabotadores USING btree (sabotador_id);


--
-- TOC entry 3709 (class 1259 OID 22558)
-- Name: idx_usuarios_sabotadores_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_sabotadores_usuario ON public.usuarios_sabotadores USING btree (usuario_id);


--
-- TOC entry 3710 (class 1259 OID 30844)
-- Name: idx_usuarios_sabotadores_usuario_chat; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_sabotadores_usuario_chat ON public.usuarios_sabotadores USING btree (usuario_id, chat_id);


--
-- TOC entry 3711 (class 1259 OID 30846)
-- Name: idx_usuarios_sabotadores_usuario_periodo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_sabotadores_usuario_periodo ON public.usuarios_sabotadores USING btree (usuario_id, criado_em DESC);


--
-- TOC entry 3685 (class 1259 OID 22458)
-- Name: idx_usuarios_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_token ON public.usuarios USING btree (token_acesso);


--
-- TOC entry 3686 (class 1259 OID 22457)
-- Name: idx_usuarios_whatsapp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_whatsapp ON public.usuarios USING btree (whatsapp_numero);


--
-- TOC entry 3740 (class 2606 OID 24773)
-- Name: usuarios_sabotadores fk_usuarios_sabotadores_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_sabotadores
    ADD CONSTRAINT fk_usuarios_sabotadores_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 3745 (class 2606 OID 22605)
-- Name: gamificacao gamificacao_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gamificacao
    ADD CONSTRAINT gamificacao_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 3746 (class 2606 OID 22624)
-- Name: insights insights_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insights
    ADD CONSTRAINT insights_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 3736 (class 2606 OID 22475)
-- Name: perfis_big_five perfis_big_five_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfis_big_five
    ADD CONSTRAINT perfis_big_five_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 3747 (class 2606 OID 25480)
-- Name: usr_chat usr_chat_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usr_chat
    ADD CONSTRAINT usr_chat_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 3737 (class 2606 OID 30525)
-- Name: usuarios_emocoes usuarios_emocoes_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_emocoes
    ADD CONSTRAINT usuarios_emocoes_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.usr_chat(id) ON DELETE CASCADE;


--
-- TOC entry 3738 (class 2606 OID 22523)
-- Name: usuarios_emocoes usuarios_emocoes_emocao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_emocoes
    ADD CONSTRAINT usuarios_emocoes_emocao_id_fkey FOREIGN KEY (emocao_id) REFERENCES public.emocoes_plutchik(id);


--
-- TOC entry 3739 (class 2606 OID 22518)
-- Name: usuarios_emocoes usuarios_emocoes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_emocoes
    ADD CONSTRAINT usuarios_emocoes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 3748 (class 2606 OID 30334)
-- Name: usuarios_humor_energia usuarios_humor_energia_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_humor_energia
    ADD CONSTRAINT usuarios_humor_energia_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.usr_chat(id) ON DELETE CASCADE;


--
-- TOC entry 3749 (class 2606 OID 30329)
-- Name: usuarios_humor_energia usuarios_humor_energia_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_humor_energia
    ADD CONSTRAINT usuarios_humor_energia_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 3743 (class 2606 OID 22583)
-- Name: usuarios_pilares usuarios_pilares_pilar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_pilares
    ADD CONSTRAINT usuarios_pilares_pilar_id_fkey FOREIGN KEY (pilar_id) REFERENCES public.pilares_vida_catalogo(id);


--
-- TOC entry 3744 (class 2606 OID 22578)
-- Name: usuarios_pilares usuarios_pilares_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_pilares
    ADD CONSTRAINT usuarios_pilares_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 3741 (class 2606 OID 30839)
-- Name: usuarios_sabotadores usuarios_sabotadores_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_sabotadores
    ADD CONSTRAINT usuarios_sabotadores_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.usr_chat(id);


--
-- TOC entry 3742 (class 2606 OID 22553)
-- Name: usuarios_sabotadores usuarios_sabotadores_sabotador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_sabotadores
    ADD CONSTRAINT usuarios_sabotadores_sabotador_id_fkey FOREIGN KEY (sabotador_id) REFERENCES public.sabotadores_catalogo(id);


--
-- TOC entry 3900 (class 0 OID 0)
-- Dependencies: 125
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2025-10-06 21:51:31 UTC

--
-- PostgreSQL database dump complete
--

