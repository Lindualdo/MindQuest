import React, { useEffect } from 'react';

const styleContent = `
  :root {
    --primary:#6b5cff;
    --primary-dark:#4c3df2;
    --accent:#0fc7d8;
    --accent-dark:#0891b2;
    --surface:#0b1021;
    --white:#ffffff;
    --muted:#667085;
    --muted-light:#94a3b8;
    --border:rgba(255,255,255,.12);
    --card-border:rgba(15,23,42,.08);
    --bg-1:#f8fbff;
    --bg-2:#eef3ff;
    --radius-md:18px;
    --radius-lg:28px;
    --shadow-sm:0 20px 40px rgba(15,23,42,.08);
    --shadow-lg:0 40px 120px rgba(91,76,255,.25);
    font-family: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  * { box-sizing:border-box; margin:0; padding:0; }
  html, body { min-height:100%; background:linear-gradient(160deg,#f6f7ff 0%,#eef6ff 45%,#fefbff 100%); color:#0f172a; }
  body { line-height:1.6; -webkit-font-smoothing:antialiased; }
  a { color:inherit; text-decoration:none; }
  img { max-width:100%; display:block; }
  .shell { width: min(1180px, 92vw); margin:0 auto; position:relative; }
  .section { padding: clamp(80px, 9vw, 120px) 0; position:relative; }
  .section::before { content:""; position:absolute; inset:0; pointer-events:none; opacity:.65; }
  .section--gradient::before { background:radial-gradient( circle at 0% 0%, rgba(107,92,255,.12), transparent 55%), radial-gradient(circle at 100% 12%, rgba(15,199,216,.14), transparent 45%); }
  .section--on-surface { background:#ffffff; }
  .glass {
    background:rgba(255,255,255,.78);
    border-radius:var(--radius-lg);
    border:1px solid rgba(148,163,184,.18);
    box-shadow:var(--shadow-sm);
    backdrop-filter:blur(18px);
  }
  .headline { font-size:clamp(2.4rem, 4vw, 3.2rem); font-weight:800; letter-spacing:-.02em; line-height:1.12; }
  .subhead { font-size:clamp(1.05rem, 1.4vw, 1.25rem); color:var(--muted); max-width:66ch; }
  .tagline { text-transform:uppercase; letter-spacing:.28em; font-size:.75rem; color:var(--muted-light); font-weight:600; }
  .pill {
    display:inline-flex; align-items:center; gap:.45rem;
    padding:.5rem .95rem; border-radius:999px;
    background:linear-gradient(120deg, rgba(107,92,255,.16), rgba(15,199,216,.16));
    border:1px solid rgba(107,92,255,.25);
    font-size:.85rem; font-weight:600; color:#4338ca;
  }
  .button {
    display:inline-flex; align-items:center; justify-content:center;
    gap:.55rem; padding:.85rem 1.35rem; border-radius:999px; font-weight:700;
    border:1px solid transparent; transition:transform .16s ease, box-shadow .16s ease, background .2s ease;
  }
  .button--primary {
    background:linear-gradient(120deg,var(--primary),var(--accent));
    color:var(--white); box-shadow:var(--shadow-lg);
  }
  .button--primary:hover { transform:translateY(-2px); box-shadow:0 36px 90px rgba(79,70,229,.32); }
  .button--outline {
    border:1px solid rgba(107,92,255,.22); background:rgba(255,255,255,.85); color:#3730a3;
  }
  .button--outline:hover { background:rgba(107,92,255,.08); }
  .grid { display:grid; gap: clamp(24px, 3vw, 36px); }
  .grid--2 { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .grid--3 { grid-template-columns:repeat(3,minmax(0,1fr)); }
  .grid--4 { grid-template-columns:repeat(4,minmax(0,1fr)); }
  @media (max-width:980px){ .grid--2, .grid--3, .grid--4 { grid-template-columns:repeat(1,minmax(0,1fr)); } }
  .card {
    position:relative; background:linear-gradient(145deg, rgba(255,255,255,.96), rgba(255,255,255,.86));
    border-radius:var(--radius-md); border:1px solid rgba(209,213,219,.4);
    padding:clamp(22px, 3vw, 32px);
    box-shadow:0 24px 60px rgba(15,23,42,.08);
  }
  .card::after {
    content:""; position:absolute; inset:-1px; border-radius:inherit; pointer-events:none;
    background:linear-gradient(120deg, rgba(107,92,255,.28), rgba(15,199,216,.12));
    opacity:.25; z-index:-1;
  }
  .card--flat { box-shadow:none; background:#ffffff; }
  .list-check { margin-top:1.2rem; display:grid; gap:.65rem; }
  .list-check li { list-style:none; display:flex; gap:.6rem; align-items:flex-start; font-size:1rem; font-weight:500; }
  .list-check li::before {
    content:""; width:18px; height:18px; flex-shrink:0;
    border-radius:6px; background:linear-gradient(135deg,var(--primary),var(--accent));
    box-shadow:0 10px 18px rgba(107,92,255,.28);
  }
  .chips { display:flex; flex-wrap:wrap; gap:.5rem; margin-top:1rem; }
  .chip {
    font-size:.8rem; font-weight:600; color:#4338ca;
    padding:.45rem .75rem; border-radius:999px;
    background:rgba(107,92,255,.12); border:1px solid rgba(107,92,255,.2);
  }
  .hero { position:relative; }
  .hero::before {
    content:""; position:absolute; inset:-120px -5%; z-index:-1;
    background:radial-gradient(circle at 12% 20%, rgba(15,199,216,.10), transparent 60%),
               radial-gradient(circle at 88% 8%, rgba(107,92,255,.18), transparent 55%);
  }
  .hero-grid { display:grid; gap:clamp(28px, 5vw, 60px); grid-template-columns:minmax(0,1.04fr) minmax(0,.9fr); align-items:center; }
  @media (max-width:980px){ .hero-grid { grid-template-columns:1fr; } }
  .hero-showcase {
    position:relative; border-radius:32px; padding:18px; background:linear-gradient(160deg, rgba(107,92,255,.15), rgba(15,199,216,.15));
    border:1px solid rgba(148,163,184,.25); box-shadow:0 40px 90px rgba(59,130,246,.22);
    overflow:hidden;
  }
  .hero-showcase::after {
    content:""; position:absolute; inset:22px; border-radius:26px;
    background:linear-gradient(145deg, rgba(255,255,255,.9), rgba(255,255,255,.75));
    border:1px solid rgba(203,213,225,.45);
  }
  .hero-showcase svg { position:relative; z-index:1; filter:drop-shadow(0 28px 60px rgba(79,70,229,.35)); }
  .section-title { font-size:clamp(2rem, 3vw, 2.5rem); font-weight:800; letter-spacing:-.015em; margin-bottom:clamp(18px, 2vw, 24px); }
  .section-lead { color:var(--muted); font-size:1rem; max-width:60ch; }
  .split { display:grid; gap:clamp(24px,3vw,36px); grid-template-columns:minmax(0,1fr) minmax(0,1fr); }
  @media (max-width:900px){ .split { grid-template-columns:1fr; } }
  .divider { height:1px; width:100%; background:linear-gradient(120deg, rgba(148,163,184,.15), rgba(107,92,255,.25), rgba(148,163,184,.12)); margin:clamp(24px, 4vw, 32px) 0; }
  .stat-block { display:flex; flex-direction:column; gap:.45rem; padding:1.4rem; border-radius:var(--radius-md); background:rgba(15,23,42,.03); border:1px solid rgba(148,163,184,.2); }
  .stat-block strong { font-size:1.8rem; color:var(--primary-dark); }
  .steps { display:grid; gap:clamp(18px, 2.6vw, 28px); }
  .step {
    position:relative; padding:1.6rem; border-radius:var(--radius-md);
    background:linear-gradient(145deg, rgba(255,255,255,.92), rgba(255,255,255,.8));
    border:1px solid rgba(148,163,184,.22); box-shadow:0 18px 45px rgba(15,23,42,.06);
  }
  .step::before {
    content:attr(data-step); position:absolute; top:-16px; left:16px;
    width:42px; height:42px; display:grid; place-items:center;
    border-radius:14px; background:linear-gradient(135deg,var(--primary),var(--accent));
    color:var(--white); font-weight:700; font-size:1.05rem;
    box-shadow:0 22px 48px rgba(79,70,229,.36);
  }
  .mini-grid { display:grid; gap:clamp(18px, 2.5vw, 26px); grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); }
  .mini-card {
    padding:clamp(18px, 2.2vw, 24px); border-radius:var(--radius-md);
    border:1px solid rgba(148,163,184,.18); background:linear-gradient(145deg, rgba(255,255,255,.94), rgba(255,255,255,.85));
    box-shadow:0 20px 46px rgba(15,23,42,.06);
  }
  .mini-title { font-weight:700; font-size:1.05rem; color:#111827; margin-bottom:.6rem; }
  .plan-grid { display:grid; gap:clamp(20px,3vw,28px); grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); }
  .plan-card {
    position:relative; padding:clamp(24px,3vw,30px);
    border-radius:var(--radius-lg); border:1px solid rgba(107,92,255,.22);
    background:linear-gradient(150deg, rgba(255,255,255,.94), rgba(255,255,255,.82));
    box-shadow:0 32px 80px rgba(15,23,42,.09);
  }
  .plan-card--highlight {
    border-color:rgba(107,92,255,.45); box-shadow:0 40px 120px rgba(91,76,255,.25);
  }
  .badge {
    position:absolute; top:20px; right:20px;
    padding:.35rem .75rem; font-size:.75rem; font-weight:700;
    border-radius:12px; background:#111827; color:#f8fafc; letter-spacing:.08em; text-transform:uppercase;
  }
  .faq { display:grid; gap:16px; }
  details { border-radius:var(--radius-md); border:1px solid rgba(148,163,184,.22); background:rgba(255,255,255,.92); padding:1.1rem 1.35rem; box-shadow:0 18px 44px rgba(15,23,42,.05); }
  details[open] { border-color:rgba(107,92,255,.36); }
  summary { cursor:pointer; font-weight:700; list-style:none; position:relative; padding-right:30px; }
  summary::-webkit-details-marker { display:none; }
  summary::after { content:"+"; position:absolute; right:0; top:0; font-weight:700; color:var(--primary); transition:transform .2s ease; }
  details[open] summary::after { transform:rotate(45deg); }
  .answer { margin-top:.75rem; color:var(--muted); font-size:.95rem; }
  footer { background:#0b1021; color:#cbd5f5; padding:64px 0 48px; margin-top:80px; }
  footer .footer-grid { display:grid; gap:26px; grid-template-columns:2fr 1fr 1fr; }
  @media (max-width:900px){ footer .footer-grid { grid-template-columns:1fr; } }
  footer a { color:#94a3b8; }
  .sticky-cta {
    position:fixed; inset:auto 1.2rem 1.2rem auto; display:flex; align-items:center; gap:.8rem;
    background:linear-gradient(120deg,var(--primary),var(--accent)); color:var(--white);
    padding:.85rem 1.35rem; border-radius:999px; box-shadow:0 40px 90px rgba(79,70,229,.35);
    z-index:80; transform:translateY(120%); transition:transform .4s ease;
  }
  .sticky-cta .button { background:rgba(255,255,255,.9); color:#312e81; padding:.55rem 1.1rem; }
  .overlay {
    position:fixed; inset:0; display:none; place-items:center; background:rgba(11,16,33,.68);
    z-index:90; padding:1.6rem;
  }
  .overlay.show { display:grid; }
  .modal {
    width:min(720px, 92vw); border-radius:32px;
    background:linear-gradient(145deg, rgba(23,37,84,.92), rgba(15,23,42,.94));
    border:1px solid rgba(99,102,241,.45); color:#e2e8f0;
    box-shadow:0 60px 160px rgba(15,23,42,.55); padding:clamp(24px, 4vw, 36px);
  }
  .modal h3 { font-size:clamp(1.9rem, 2.6vw, 2.2rem); letter-spacing:-.01em; margin-bottom:.4rem; }
  .modal .muted { color:rgba(226,232,240,.78); }
  .modal .row { display:flex; gap:.85rem; margin-top:1.4rem; flex-wrap:wrap; }
  .modal input {
    flex:1; min-width:220px;
    padding:1rem 1.1rem; border-radius:16px; border:1px solid rgba(148,163,184,.4);
    background:rgba(15,23,42,.6); color:#f8fafc; font-size:1rem;
  }
  .modal input::placeholder { color:rgba(148,163,184,.7); }
  .modal .button--primary { width:220px; box-shadow:0 28px 70px rgba(79,70,229,.45); }
  .modal .escape { margin-top:1.2rem; text-align:center; font-size:.85rem; color:rgba(148,163,184,.8); }
  .modal .escape button { background:none; border:none; color:inherit; text-decoration:underline; cursor:pointer; }
  @media (max-width:540px){ .modal .button--primary { width:100%; } .sticky-cta { inset:auto 1rem 1rem 1rem; justify-content:space-between; } }
`;

const htmlContent = `
  <header class="section--on-surface" style="position:sticky;top:0;z-index:60;background:rgba(255,255,255,.86);backdrop-filter:blur(16px);border-bottom:1px solid rgba(148,163,184,.22);">
    <div class="shell" style="padding:18px 0; display:flex; align-items:center; justify-content:space-between; gap:clamp(16px,4vw,32px);">
      <div style="display:flex; align-items:center; gap:14px;">
        <svg width="36" height="36" viewBox="0 0 100 100" aria-hidden="true">
          <defs><linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6b5cff"/><stop offset="1" stop-color="#0fc7d8"/></linearGradient></defs>
          <circle cx="50" cy="50" r="46" fill="url(#logoGradient)" opacity=".95"/>
          <path d="M50 20 L74 50 L50 80 L26 50 Z" fill="#fff"/>
        </svg>
        <div>
          <strong style="font-size:1.1rem;">MindQuest</strong>
          <p style="font-size:.75rem; letter-spacing:.32em; text-transform:uppercase; color:var(--muted-light); font-weight:600;">Mente clara</p>
        </div>
      </div>
      <nav style="display:flex; align-items:center; gap:clamp(16px,2.8vw,32px);">
        <div style="display:flex; gap:clamp(16px,2vw,24px); font-weight:600; font-size:.95rem;">
          <a href="#como-funciona">Como funciona</a>
          <a href="#beneficios">Benefícios</a>
          <a href="#planos">Planos</a>
          <a href="#faq">FAQ</a>
        </div>
        <a class="button button--primary" href="WHATSAPP_LINK" id="ctaHeader">Começar no WhatsApp</a>
      </nav>
    </div>
  </header>
  <main>
    <section class="section section--gradient hero" aria-labelledby="hero-title">
      <div class="shell hero-grid glass">
        <div style="padding: clamp(24px, 4vw, 40px);">
          <span class="pill" aria-label="slogan">Mente clara, resultados reais</span>
          <h1 id="hero-title" class="headline" style="margin:16px 0 12px;">
            Converse com sua IA e descubra <span style="background:linear-gradient(120deg,var(--primary),var(--accent));-webkit-background-clip:text;color:transparent;">o que sua mente quer te dizer</span>.
          </h1>
          <p class="subhead">
            O MindQuest transforma emoções em <strong>clareza</strong>, <strong>força mental</strong> e <strong>evolução pessoal</strong> —
            <em>uma conversa por dia</em>.
          </p>
          <ul class="list-check" style="margin-top:1.2rem;">
            <li><strong>clareza emocional em minutos</strong></li>
            <li>diário inteligente que conversa com você</li>
            <li>sem login, sem atrito — WhatsApp imediato</li>
          </ul>
          <div style="display:flex; flex-wrap:wrap; gap:12px; margin-top:1.6rem;">
            <a class="button button--primary" href="WHATSAPP_LINK" id="ctaHero">Começar agora no WhatsApp</a>
            <a class="button button--outline" href="#como-funciona">Ver como funciona</a>
          </div>
          <p class="muted" style="margin-top:.85rem; font-size:.9rem; color:var(--muted);">Acesso protegido por token. Sem login. Sem senha.</p>
        </div>
        <div class="hero-showcase" aria-hidden="true">
          <svg viewBox="0 0 640 360" width="100%" height="100%">
            <defs>
              <linearGradient id="gauge" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#6b5cff"/><stop offset="1" stop-color="#0fc7d8"/>
              </linearGradient>
              <linearGradient id="cardFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#eef2ff" stop-opacity=".92"/>
              </linearGradient>
            </defs>
            <path d="M80,280 A200,200 0 0 1 560,280" fill="none" stroke="rgba(226,232,240,.65)" stroke-width="24" stroke-linecap="round"/>
            <path d="M80,280 A200,200 0 0 1 360,140" fill="none" stroke="url(#gauge)" stroke-width="24" stroke-linecap="round"/>
            <circle cx="320" cy="280" r="14" fill="#0f172a"/>
            <line x1="320" y1="280" x2="360" y2="140" stroke="#0f172a" stroke-width="8" stroke-linecap="round"/>
            <rect x="380" y="54" rx="18" width="208" height="94" fill="url(#cardFill)" stroke="rgba(148,163,184,.45)"/>
            <text x="406" y="88" font-size="18" font-weight="700" fill="#0f172a">Humor</text>
            <text x="406" y="120" font-size="30" font-weight="700" fill="#6b5cff">7.8</text>
            <rect x="82" y="60" rx="18" width="240" height="94" fill="url(#cardFill)" stroke="rgba(148,163,184,.45)"/>
            <text x="108" y="94" font-size="18" font-weight="700" fill="#0f172a">Energia</text>
            <text x="108" y="126" font-size="28" font-weight="700" fill="#0fc7d8">Alta</text>
            <rect x="240" y="250" rx="12" width="168" height="34" fill="#0f172a" opacity=".94"/>
            <text x="256" y="273" font-size="16" fill="#f8fafc">Insights hoje: 3</text>
          </svg>
        </div>
      </div>
    </section>
    <section class="section section--on-surface" id="dores" aria-labelledby="sec-dores">
      <div class="shell">
        <div class="card">
          <h2 id="sec-dores" class="section-title">Você se reconhece?</h2>
          <ul class="list-check">
            <li>Pensamento demais, ação de menos?</li>
            <li>Vive no automático e sente-se desconectado de si?</li>
            <li>Conquista coisas, mas o vazio não passa?</li>
            <li>Quer evoluir, mas não sabe por onde começar?</li>
          </ul>
          <div class="divider"></div>
          <p class="section-lead"><span style="background:linear-gradient(120deg,var(--primary),var(--accent));-webkit-background-clip:text;color:transparent;font-weight:700;">O que você sente tem valor</span> — nós traduzimos isso em <strong>clareza emocional</strong> e <strong>pequenas ações diárias</strong>.</p>
        </div>
      </div>
    </section>
    <section class="section section--gradient" id="transformacao" aria-labelledby="sec-transforma">
      <div class="shell">
        <div class="card">
          <div class="split">
            <div>
              <h2 id="sec-transforma" class="section-title">Antes → Depois</h2>
              <div class="split" style="gap:24px;">
                <div class="stat-block">
                  <span class="tagline">Antes</span>
                  <span>Confusão mental</span>
                  <span>Oscilações emocionais</span>
                  <span>Falta de direção</span>
                </div>
                <div class="stat-block">
                  <span class="tagline">Depois</span>
                  <span>Clareza do que sente (e por quê)</span>
                  <span>Estabilidade emocional crescente</span>
                  <span>Foco e força interior para agir</span>
                </div>
              </div>
              <p class="section-lead" style="margin-top:1.4rem;"><em style="background:linear-gradient(120deg,var(--primary),var(--accent));-webkit-background-clip:text;color:transparent;font-weight:700;">uma conversa por dia</em> muda a forma como você pensa e sente.</p>
            </div>
            <div class="card card--flat" style="height:100%; display:flex; align-items:center; justify-content:center;">
              <svg viewBox="0 0 520 320" width="100%" height="100%">
                <defs><linearGradient id="bars" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0fc7d8"/><stop offset="1" stop-color="#6b5cff"/></linearGradient></defs>
                <rect x="32" y="32" width="456" height="240" fill="#fff" stroke="rgba(148,163,184,.4)" rx="18"/>
                <rect x="82" y="230" width="48" height="28" fill="url(#bars)" rx="12"/>
                <rect x="162" y="196" width="48" height="62" fill="url(#bars)" rx="12"/>
                <rect x="242" y="158" width="48" height="100" fill="url(#bars)" rx="12"/>
                <rect x="322" y="116" width="48" height="142" fill="url(#bars)" rx="12"/>
                <rect x="402" y="92" width="48" height="166" fill="url(#bars)" rx="12"/>
                <text x="54" y="284" font-size="13" fill="#64748b">Dia 1</text>
                <text x="430" y="284" font-size="13" fill="#64748b">Dia 5</text>
                <text x="60" y="28" font-size="15" fill="#1e293b" font-weight="600">Clareza emocional</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--on-surface" id="como-funciona" aria-labelledby="sec-como">
      <div class="shell">
        <div class="card">
          <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:clamp(16px,3vw,24px); flex-wrap:wrap;">
            <div>
              <h2 id="sec-como" class="section-title">Como funciona</h2>
              <p class="section-lead">A jornada começa no WhatsApp e evolui com o seu painel inteligente.</p>
            </div>
            <a class="button button--primary" href="WHATSAPP_LINK" id="ctaComo">Começar grátis agora</a>
          </div>
          <div class="steps" style="margin-top:1.8rem;">
            <div class="step" data-step="01">
              <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:.4rem;">Diga o que está acontecendo</h3>
              <p class="section-lead" style="margin:0;">Envie “oi” no WhatsApp.</p>
            </div>
            <div class="step" data-step="02">
              <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:.4rem;">Converse com sua IA</h3>
              <p class="section-lead" style="margin:0;">Perguntas leves, reflexão guiada.</p>
            </div>
            <div class="step" data-step="03">
              <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:.4rem;">Valide o resumo</h3>
              <p class="section-lead" style="margin:0;">A IA traduz emoções em descobertas.</p>
            </div>
            <div class="step" data-step="04">
              <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:.4rem;">Veja o painel atualizar</h3>
              <p class="section-lead" style="margin:0;">Humor, energia e insights em tempo real.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--gradient" id="beneficios" aria-labelledby="sec-benef">
      <div class="shell">
        <div class="card">
          <h2 id="sec-benef" class="section-title">Benefícios</h2>
          <div class="mini-grid">
            <div class="mini-card">
              <div class="mini-title">Clareza emocional instantânea</div>
              <ul class="list-check" style="margin-top:.4rem;">
                <li>Veja como você está se sentindo em segundos</li>
              </ul>
            </div>
            <div class="mini-card">
              <div class="mini-title">Descoberta de padrões</div>
              <ul class="list-check" style="margin-top:.4rem;">
                <li>Identifique gatilhos e tendências mentais</li>
              </ul>
            </div>
            <div class="mini-card">
              <div class="mini-title">Evolução guiada</div>
              <ul class="list-check" style="margin-top:.4rem;">
                <li>Converta sentimentos em micro-ações no seu ritmo</li>
              </ul>
            </div>
            <div class="mini-card">
              <div class="mini-title">Sem fricção</div>
              <ul class="list-check" style="margin-top:.4rem;">
                <li>WhatsApp + dashboard. Sem login, sem senha</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--on-surface" id="autoridade" aria-labelledby="sec-auto">
      <div class="shell">
        <div class="card">
          <h2 id="sec-auto" class="section-title">Por trás do MindQuest</h2>
          <div class="mini-grid">
            <div class="mini-card">
              <div class="mini-title">Neurociência aplicada</div>
              <p class="section-lead" style="margin:0;">Conversas objetivas, sem jargão.</p>
            </div>
            <div class="mini-card">
              <div class="mini-title">Psicologia comportamental</div>
              <p class="section-lead" style="margin:0;">Big Five, PANAS, TCC.</p>
            </div>
            <div class="mini-card">
              <div class="mini-title">Filosofias práticas</div>
              <p class="section-lead" style="margin:0;">Roda da Vida, Sabotadores, estoicismo.</p>
            </div>
            <div class="mini-card">
              <div class="mini-title">Posicionamento</div>
              <p class="section-lead" style="margin:0;"><em>MindQuest não é terapia nem “app de produtividade”. É autoconhecimento ativo — um diário inteligente que aprende com você.</em></p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--gradient" id="planos" aria-labelledby="sec-planos">
      <div class="shell">
        <div class="card">
          <h2 id="sec-planos" class="section-title">Planos</h2>
          <div class="plan-grid">
            <div class="plan-card plan-card--highlight">
              <h3 style="font-size:1.6rem; font-weight:800;">Free</h3>
              <p class="section-lead" style="margin:.5rem 0 1.2rem;">Comece agora. Sem cartão, sem espera.</p>
              <ul class="list-check">
                <li>1 conversa por dia no WhatsApp</li>
                <li>Painel com humor, energia e insights</li>
                <li>Acesso imediato, sem login</li>
              </ul>
              <a class="button button--primary" href="WHATSAPP_LINK" id="ctaFree" style="margin-top:1.5rem; width:fit-content;">Começar grátis agora</a>
            </div>
            <div class="plan-card">
              <span class="badge">em breve</span>
              <h3 style="font-size:1.6rem; font-weight:800;">Premium</h3>
              <p class="section-lead" style="margin:.5rem 0 1.2rem;">Experiência completa para quem quer acelerar.</p>
              <ul class="list-check">
                <li>Mentor 24h</li>
                <li>Histórico completo</li>
                <li>Jornadas e automações inteligentes</li>
              </ul>
              <a class="button button--outline" href="PREMIUM_WAITLIST_LINK" id="ctaWaitlist" style="margin-top:1.5rem; width:fit-content;">Quero ser avisado</a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--on-surface" id="faq" aria-labelledby="sec-faq">
      <div class="shell">
        <div class="card">
          <h2 id="sec-faq" class="section-title">FAQ</h2>
          <div class="faq">
            <details>
              <summary>O que é o MindQuest?</summary>
              <div class="answer">Uma IA que conversa com você e traduz emoções em clareza, descobertas e micro-ações.</div>
            </details>
            <details>
              <summary>Preciso pagar para começar?</summary>
              <div class="answer">Não. A versão Free permite iniciar agora pelo WhatsApp.</div>
            </details>
            <details>
              <summary>É terapia?</summary>
              <div class="answer">Não. MindQuest não substitui psicoterapia. É autoconhecimento ativo e guiado por IA.</div>
            </details>
            <details>
              <summary>Meus dados estão seguros?</summary>
              <div class="answer">Sim. Acesso por token renovado a cada sessão. Sem login e sem senha.</div>
            </details>
            <details>
              <summary>Funciona no celular?</summary>
              <div class="answer">Sim. Conversa via WhatsApp e acompanha no dashboard.</div>
            </details>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--gradient" id="call-final" aria-labelledby="sec-final">
      <div class="shell">
        <div class="card" style="text-align:center;">
          <h2 id="sec-final" class="section-title">Tudo começa com uma conversa.</h2>
          <p class="section-lead" style="margin:0 auto 1.4rem;">Diga “oi” no WhatsApp e sinta a diferença na primeira semana.</p>
          <a class="button button--primary" href="WHATSAPP_LINK" id="ctaFooter">Começar agora no WhatsApp</a>
          <p class="muted" style="margin-top:12px; font-size:.9rem; color:var(--muted);">Acesso protegido por token. Sem login. Sem senha.</p>
        </div>
      </div>
    </section>
  </main>
  <footer>
    <div class="shell">
      <div class="footer-grid">
        <div>
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
            <svg width="32" height="32" viewBox="0 0 100 100" aria-hidden="true">
              <defs><linearGradient id="footerLogo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6b5cff"/><stop offset="1" stop-color="#0fc7d8"/></linearGradient></defs>
              <circle cx="50" cy="50" r="46" fill="url(#footerLogo)"/>
              <path d="M50 20 L74 50 L50 80 L26 50 Z" fill="#fff"/>
            </svg>
            <strong style="font-size:1.1rem;">MindQuest</strong>
          </div>
          <p style="color:#94a3b8;">Mente clara, resultados reais.</p>
        </div>
        <div>
          <p style="font-weight:700; margin-bottom:8px;">Navegação</p>
          <div style="display:flex; flex-direction:column; gap:6px; font-size:.95rem;">
            <a href="#como-funciona">Como funciona</a>
            <a href="#beneficios">Benefícios</a>
            <a href="#planos">Planos</a>
            <a href="#faq">FAQ</a>
          </div>
        </div>
        <div>
          <p style="font-weight:700; margin-bottom:8px;">Segurança</p>
          <p style="color:#94a3b8; font-size:.95rem;">Acesso por token renovado. Conversas privadas.</p>
        </div>
      </div>
      <div style="border-top:1px solid rgba(148,163,184,.28); margin-top:24px; padding-top:18px; font-size:.85rem; color:#94a3b8;">
        © <span id="year"></span> MindQuest. Todos os direitos reservados.
      </div>
    </div>
  </footer>
  <div class="sticky-cta" role="region" aria-label="Ação rápida">
    <span style="font-weight:600; font-size:.95rem;">Comece grátis agora pelo WhatsApp</span>
    <a class="button button--outline" href="WHATSAPP_LINK" id="ctaSticky">Começar</a>
  </div>
  <div class="overlay" id="exitModal" aria-hidden="true" aria-modal="true" role="dialog">
    <div class="modal" role="document">
      <h3>Antes de ir: quer receber seu primeiro insight agora?</h3>
      <p class="muted">Leva menos de 1 minuto. Enviamos o link direto no WhatsApp.</p>
      <div class="row">
        <input type="tel" placeholder="Seu WhatsApp com DDI (ex: +351 912 345 678)" id="phoneInput" aria-label="WhatsApp" />
        <button class="button button--primary" id="ctaModal">Receber no WhatsApp</button>
      </div>
      <p class="muted">Privado e seguro. Sem spam.</p>
      <div class="escape">
        <button id="forceLeave">Prefiro sair agora</button>
      </div>
    </div>
  </div>
`;

const LpStartPage: React.FC = () => {
  useEffect(() => {
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear().toString();
    }

    const track = (event: string, meta: Record<string, unknown> = {}) => {
      try {
        console.log('[track]', event, meta);
      } catch (error) {
        // noop
      }
    };

    const trackingIds = ['ctaHeader','ctaHero','ctaComo','ctaFree','ctaWaitlist','ctaFooter','ctaSticky','ctaModal'];
    const listeners: Array<{ el: HTMLElement; handler: () => void }> = [];

    trackingIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const handler = () => track(id);
      el.addEventListener('click', handler);
      listeners.push({ el, handler });
    });

    const exitModal = document.getElementById('exitModal');
    const sticky = document.querySelector('.sticky-cta') as HTMLElement | null;
    const ctaModal = document.getElementById('ctaModal');
    const phoneInput = document.getElementById('phoneInput') as HTMLInputElement | null;
    const forceLeave = document.getElementById('forceLeave');

    let modalShown = false;
    let canLeave = false;

    const showExitModal = () => {
      if (modalShown || !exitModal) return;
      modalShown = true;
      exitModal.classList.add('show');
      exitModal.setAttribute('aria-hidden', 'false');
    };

    const handleMouseOut = (event: MouseEvent) => {
      if (event.clientY < 10 && !modalShown) {
        showExitModal();
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!canLeave) {
        showExitModal();
        event.preventDefault();
        event.returnValue = '';
        return '';
      }
      return undefined;
    };

    const handleModalClick = () => {
      const value = phoneInput?.value.trim() ?? '';
      track('lead_exit_whatsapp', { phone: value });
      if (!phoneInput) return;
      if (!value) {
        window.alert('Por favor, informe seu WhatsApp (com DDI).');
        return;
      }
      const msg = encodeURIComponent(`Oi! Quero começar meu MindQuest (versão gratuita). Meu número: ${value}`);
      window.location.href = 'WHATSAPP_LINK' || `https://wa.me/351928413957?text=${msg}`;
      canLeave = true;
      exitModal?.classList.remove('show');
    };

    const handleForceLeave = () => {
      track('declined_exit_modal');
      canLeave = true;
      exitModal?.classList.remove('show');
      setTimeout(() => window.history.back(), 150);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && exitModal?.classList.contains('show')) {
        exitModal.classList.remove('show');
        setTimeout(() => exitModal.classList.add('show'), 4000);
      }
    };

    const handleScroll = () => {
      if (!sticky) return;
      if (window.scrollY > 300) {
        sticky.style.transform = 'translateY(0)';
      } else {
        sticky.style.transform = 'translateY(120%)';
      }
    };

    document.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('beforeunload', handleBeforeUnload);
    ctaModal?.addEventListener('click', handleModalClick);
    forceLeave?.addEventListener('click', handleForceLeave);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      listeners.forEach(({ el, handler }) => el.removeEventListener('click', handler));
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      ctaModal?.removeEventListener('click', handleModalClick);
      forceLeave?.removeEventListener('click', handleForceLeave);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <style>{styleContent}</style>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default LpStartPage;
