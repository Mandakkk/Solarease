"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// Static import нь fine — зөвхөн createClient() дуудлагыг lazy болгоно.
// typeof window === "undefined" → SSR/prerender үед skip хийнэ → crash болохгүй.
let _sb = null;
function getSB() {
  if (_sb) return _sb;
  if (typeof window === "undefined") return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("SolarEase: NEXT_PUBLIC_SUPABASE_URL эсвэл NEXT_PUBLIC_SUPABASE_ANON_KEY Vercel-д тохируулагдаагүй байна.");
    return null;
  }
  try {
    _sb = createClient(url, key);
  } catch(e) {
    console.error("Supabase createClient алдаа:", e);
    _sb = null;
  }
  return _sb;
}

const _noop = {
  select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null }), order: () => ({ limit: () => Promise.resolve({ data: [] }) }) }) }),
  insert: () => Promise.resolve({ error: null }),
  update: () => ({ eq: () => Promise.resolve({ error: null }) }),
};

const db = {
  auth: {
    getSession: () => getSB() ? getSB().auth.getSession() : Promise.resolve({ data: { session: null } }),
    signUp: (o) => getSB() ? getSB().auth.signUp(o) : Promise.resolve({ data: null, error: { message: "Supabase тохируулагдаагүй байна" } }),
    signInWithPassword: (o) => getSB() ? getSB().auth.signInWithPassword(o) : Promise.resolve({ data: null, error: { message: "Supabase тохируулагдаагүй байна" } }),
    signOut: () => getSB() ? getSB().auth.signOut() : Promise.resolve(),
    resetPasswordForEmail: (e) => getSB() ? getSB().auth.resetPasswordForEmail(e) : Promise.resolve({ error: null }),
    onAuthStateChange: (cb) => getSB() ? getSB().auth.onAuthStateChange(cb) : { data: { subscription: { unsubscribe: () => {} } } },
  },
  from: (table) => getSB() ? getSB().from(table) : _noop,
};


/* ─── STYLES ─────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --green:#1a5c3a;--green2:#2d8653;--green3:#4ade80;--green-light:rgba(74,222,128,.1);
  --gold:#f59e0b;--blue:#3b82f6;
  --bg:#0a0f0d;--surface:rgba(255,255,255,.05);--surface2:rgba(255,255,255,.09);
  --border:rgba(255,255,255,.12);--border2:rgba(255,255,255,.2);
  --text:#fff;--muted:rgba(255,255,255,.6);--hint:rgba(255,255,255,.35);
  --radius:10px;--radius-lg:18px;
  --fhead:'Bebas Neue',sans-serif;--fbody:'DM Sans',sans-serif;
}
body{font-family:var(--fbody);background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden}
.app{min-height:100vh;display:flex;flex-direction:column}

/* BG */
.bg-wrap{position:fixed;inset:0;z-index:0;pointer-events:none}
.bg-img{width:100%;height:100%;object-fit:cover;opacity:.35}
.bg-ov{position:absolute;inset:0;background:linear-gradient(150deg,rgba(0,20,10,.85) 0%,rgba(0,0,0,.5) 60%,rgba(5,15,8,.9) 100%)}

/* NAV */
.nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:1rem 2rem;background:rgba(5,12,8,.85);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
.logo{font-family:var(--fhead);font-size:1.7rem;letter-spacing:.04em;cursor:pointer;display:flex;flex-direction:column;line-height:1}
.logo .e{color:var(--green3)}
.logo-sub{font-size:.55rem;color:var(--hint);letter-spacing:.15em;text-transform:uppercase}
.nav-r{display:flex;align-items:center;gap:8px}
.nav-tabs{display:flex;gap:4px;background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:999px;padding:4px}
.nav-tab{padding:6px 16px;border-radius:999px;font-size:.8rem;font-weight:600;cursor:pointer;border:none;background:transparent;color:var(--muted);font-family:var(--fbody);transition:all .2s;letter-spacing:.03em}
.nav-tab.active{background:var(--green2);color:#fff}
.nav-tab:hover:not(.active){color:#fff;background:rgba(255,255,255,.08)}
.pts-pill{background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.3);border-radius:999px;padding:5px 14px;font-size:.78rem;color:var(--gold);font-weight:600}
.btn{font-family:var(--fbody);font-size:.875rem;font-weight:600;padding:10px 22px;border-radius:999px;border:none;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:6px;letter-spacing:.02em;white-space:nowrap}
.btn-p{background:var(--green2);color:#fff;border:2px solid var(--green3)}
.btn-p:hover{background:var(--green3);color:#050e08;transform:translateY(-1px)}
.btn-o{background:rgba(255,255,255,.07);color:#fff;border:2px solid rgba(255,255,255,.3);backdrop-filter:blur(8px)}
.btn-o:hover{background:rgba(255,255,255,.15);border-color:#fff}
.btn-g{background:transparent;color:var(--muted);border:1px solid var(--border)}
.btn-g:hover{color:#fff;background:rgba(255,255,255,.07)}
.btn-sm{padding:7px 16px;font-size:.78rem}
.btn-lg{padding:14px 36px;font-size:1rem}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important}
.btn-gold{background:var(--gold);color:#1a0e00;border:2px solid #fcd34d;font-weight:700}
.btn-gold:hover{background:#fcd34d;transform:translateY(-1px)}

/* ── LANDING ── */
.land{position:relative;z-index:10}
.hero{min-height:calc(100vh - 64px);display:flex;align-items:center;padding:3rem 2rem;max-width:1200px;margin:0 auto}
.hero-in{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
@media(max-width:860px){.hero-in{grid-template-columns:1fr;gap:2.5rem}}
.hero-tag{display:inline-flex;align-items:center;gap:6px;background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.25);border-radius:999px;padding:5px 14px;font-size:.7rem;color:var(--green3);font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.5rem}
.hero-tag::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--green3);animation:blink 2s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.h1{font-family:var(--fhead);font-size:clamp(4rem,7vw,6.5rem);line-height:.92;letter-spacing:.03em;margin-bottom:1.25rem}
.h1 .g{color:var(--green3)}.h1 .go{color:var(--gold)}
.hero-sub{font-size:1rem;color:var(--muted);max-width:440px;margin-bottom:2.5rem;font-weight:300;line-height:1.75}
.hero-stats{display:flex;gap:2rem;flex-wrap:wrap;margin-top:2.5rem;padding-top:2rem;border-top:1px solid var(--border)}
.hv{font-family:var(--fhead);font-size:1.8rem;color:var(--green3);letter-spacing:.04em}
.hl{font-size:.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-top:2px}

/* 2 CARD CTAs */
.cta-cards{display:flex;flex-direction:column;gap:1rem}
.cta-card{border-radius:var(--radius-lg);padding:1.75rem;cursor:pointer;border:1.5px solid var(--border);transition:all .25s;position:relative;overflow:hidden}
.cta-card::before{content:'';position:absolute;inset:0;opacity:0;transition:opacity .25s}
.cta-card:hover{transform:translateY(-3px);border-color:var(--border2)}
.cta-card:hover::before{opacity:1}
.cta-card.calc{background:rgba(74,222,128,.06)}
.cta-card.calc::before{background:rgba(74,222,128,.04)}
.cta-card.calc:hover{border-color:rgba(74,222,128,.5)}
.cta-card.invest{background:rgba(245,158,11,.06)}
.cta-card.invest::before{background:rgba(245,158,11,.04)}
.cta-card.invest:hover{border-color:rgba(245,158,11,.5)}
.cta-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:.875rem}
.cta-card-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem}
.cta-card-icon.c{background:rgba(74,222,128,.15);border:1px solid rgba(74,222,128,.3)}
.cta-card-icon.i{background:rgba(245,158,11,.15);border:1px solid rgba(245,158,11,.3)}
.cta-card-badge{font-size:.68rem;font-weight:700;border-radius:999px;padding:3px 10px;letter-spacing:.05em;text-transform:uppercase}
.cta-card-badge.free{background:rgba(74,222,128,.15);color:var(--green3);border:1px solid rgba(74,222,128,.3)}
.cta-card-badge.login{background:rgba(255,255,255,.08);color:var(--muted);border:1px solid var(--border)}
.cta-card h3{font-family:var(--fhead);font-size:1.5rem;letter-spacing:.04em;margin-bottom:.35rem}
.cta-card p{font-size:.82rem;color:var(--muted);line-height:1.55;margin-bottom:1.25rem}
.cta-card-arrow{display:flex;align-items:center;gap:6px;font-size:.82rem;font-weight:600}
.cta-card.calc .cta-card-arrow{color:var(--green3)}
.cta-card.invest .cta-card-arrow{color:var(--gold)}

/* ── INVESTMENT PAGE ── */
.invest-page{position:relative;z-index:10;max-width:1200px;margin:0 auto;padding:2rem;width:100%}
.invest-hero{display:grid;grid-template-columns:1fr 360px;gap:2rem;margin-bottom:2.5rem;align-items:start}
@media(max-width:900px){.invest-hero{grid-template-columns:1fr}}
.project-img{width:100%;height:300px;object-fit:cover;border-radius:var(--radius-lg);border:1px solid var(--border)}
.project-title{font-family:var(--fhead);font-size:clamp(2rem,4vw,3rem);letter-spacing:.04em;margin-bottom:.5rem;line-height:1}
.project-loc{display:flex;align-items:center;gap:6px;font-size:.82rem;color:var(--muted);margin-bottom:1.25rem}
.project-desc{font-size:.9rem;color:rgba(255,255,255,.75);line-height:1.7;margin-bottom:1.5rem}
.project-tags{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1.5rem}
.tag{padding:4px 12px;border-radius:999px;font-size:.72rem;font-weight:600;border:1px solid var(--border);color:var(--muted)}
.tag.green{background:rgba(74,222,128,.1);color:var(--green3);border-color:rgba(74,222,128,.3)}
.tag.gold{background:rgba(245,158,11,.1);color:var(--gold);border-color:rgba(245,158,11,.3)}
.tag.blue{background:rgba(59,130,246,.1);color:#60a5fa;border-color:rgba(59,130,246,.3)}

/* INVEST SIDEBAR */
.invest-sidebar{background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5rem;position:sticky;top:80px}
.sidebar-title{font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:1rem;font-weight:600}
.metric-grid{display:grid;grid-template-columns:1fr 1fr;gap:.875rem;margin-bottom:1.25rem}
.metric{background:rgba(255,255,255,.04);border-radius:var(--radius);padding:.875rem}
.metric .mv{font-family:var(--fhead);font-size:1.6rem;letter-spacing:.04em;line-height:1;color:#fff}
.metric .mv.green{color:var(--green3)}
.metric .mv.gold{color:var(--gold)}
.metric .ml{font-size:.68rem;color:var(--muted);margin-top:4px;text-transform:uppercase;letter-spacing:.06em}

/* PROGRESS */
.prog-wrap{margin-bottom:1.25rem}
.prog-label{display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:.5rem}
.prog-label span:first-child{font-weight:600;color:var(--green3)}
.prog-label span:last-child{color:var(--muted)}
.prog-bar{width:100%;height:8px;background:rgba(255,255,255,.1);border-radius:999px;overflow:hidden}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--green2),var(--green3));border-radius:999px;transition:width 1s ease}
.prog-stats{display:flex;justify-content:space-between;margin-top:.5rem;font-size:.72rem;color:var(--muted)}

/* INVEST FORM */
.invest-input-wrap{margin-bottom:1rem}
.invest-input-label{font-size:.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:.4rem;font-weight:600}
.invest-input{width:100%;background:rgba(255,255,255,.07);border:1px solid var(--border);border-radius:var(--radius);padding:10px 14px;color:#fff;font-family:var(--fbody);font-size:1rem;font-weight:600}
.invest-input:focus{outline:none;border-color:var(--green3)}
.invest-calc{background:rgba(74,222,128,.06);border:1px solid rgba(74,222,128,.2);border-radius:var(--radius);padding:.875rem;margin-bottom:1.25rem;font-size:.82rem}
.invest-calc-row{display:flex;justify-content:space-between;padding:3px 0}
.invest-calc-row span:last-child{font-weight:600;color:var(--green3)}
.invest-note{font-size:.72rem;color:var(--hint);text-align:center;margin-top:.75rem;line-height:1.5}

/* TABS */
.tabs{display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:2rem}
.tab-btn{padding:10px 20px;font-size:.85rem;font-weight:500;cursor:pointer;border:none;background:transparent;color:var(--muted);font-family:var(--fbody);border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .15s}
.tab-btn.active{color:var(--green3);border-bottom-color:var(--green3)}
.tab-btn:hover:not(.active){color:#fff}

/* PROJECT DETAILS */
.detail-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:2rem}
.detail-card{background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem}
.detail-card .dv{font-family:var(--fhead);font-size:1.4rem;letter-spacing:.04em;color:#fff;margin-bottom:3px}
.detail-card .dl{font-size:.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:.07em}
.risk-bar{display:flex;gap:4px;margin-top:.5rem}
.risk-dot{width:20px;height:6px;border-radius:999px;background:rgba(255,255,255,.15)}
.risk-dot.on{background:var(--green3)}
.update-item{display:flex;gap:1rem;padding:1rem 0;border-bottom:1px solid var(--border)}
.update-item:last-child{border-bottom:none}
.update-date{font-size:.72rem;color:var(--muted);min-width:80px;padding-top:3px}
.update-content h4{font-size:.9rem;font-weight:600;margin-bottom:.25rem}
.update-content p{font-size:.8rem;color:var(--muted);line-height:1.5}

/* PROJECT LIST */
.project-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.25rem;margin-top:1.5rem}
.pcard{background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;cursor:pointer;transition:all .2s}
.pcard:hover{border-color:rgba(74,222,128,.35);transform:translateY(-3px)}
.pcard-img{width:100%;height:160px;object-fit:cover}
.pcard-body{padding:1.25rem}
.pcard-loc{font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:.4rem}
.pcard-title{font-family:var(--fhead);font-size:1.2rem;letter-spacing:.04em;margin-bottom:.75rem}
.pcard-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:1rem}
.pm{text-align:center;background:rgba(255,255,255,.04);border-radius:8px;padding:.5rem}
.pm .pv{font-size:.95rem;font-weight:600;color:var(--green3)}
.pm .pl{font-size:.65rem;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-top:2px}
.pcard-prog{width:100%;height:4px;background:rgba(255,255,255,.1);border-radius:999px;overflow:hidden}
.pcard-prog-fill{height:100%;background:var(--green3);border-radius:999px}
.pcard-prog-label{display:flex;justify-content:space-between;font-size:.7rem;color:var(--muted);margin-top:.4rem}
.pcard-status{display:inline-block;padding:2px 10px;border-radius:999px;font-size:.68rem;font-weight:600;margin-bottom:.875rem}
.status-open{background:rgba(74,222,128,.12);color:var(--green3);border:1px solid rgba(74,222,128,.3)}
.status-full{background:rgba(255,255,255,.06);color:var(--muted);border:1px solid var(--border)}
.status-soon{background:rgba(245,158,11,.1);color:var(--gold);border:1px solid rgba(245,158,11,.3)}

/* AUTH */
.auth-page{position:relative;z-index:10;flex:1;display:flex;align-items:center;justify-content:center;padding:2rem;min-height:calc(100vh - 64px)}
.auth-card{background:rgba(5,15,8,.9);border:1px solid var(--border);border-radius:var(--radius-lg);padding:2rem;width:100%;max-width:400px;backdrop-filter:blur(20px)}
.auth-card h2{font-family:var(--fhead);font-size:2rem;letter-spacing:.04em;margin-bottom:.3rem}
.auth-sub{color:var(--muted);font-size:.85rem;margin-bottom:1.75rem}
.field{margin-bottom:1rem}
.field label{display:block;font-size:.7rem;font-weight:600;color:var(--muted);margin-bottom:5px;text-transform:uppercase;letter-spacing:.08em}
.field input,.field select{width:100%;background:rgba(255,255,255,.07);border:1px solid var(--border);border-radius:var(--radius);padding:10px 14px;color:#fff;font-family:var(--fbody);font-size:.875rem;transition:border-color .15s}
.field input::placeholder{color:var(--hint)}
.field input:focus,.field select:focus{outline:none;border-color:var(--green3);box-shadow:0 0 0 3px rgba(74,222,128,.08)}
.field select option{background:#050e08}
.bonus-note{background:rgba(74,222,128,.07);border:1px solid rgba(74,222,128,.22);border-radius:var(--radius);padding:9px 13px;font-size:.8rem;color:var(--green3);margin-bottom:1.25rem}
.auth-switch{text-align:center;margin-top:1.25rem;font-size:.82rem;color:var(--muted)}
.auth-switch button{background:none;border:none;color:var(--green3);cursor:pointer;font-size:inherit;font-family:inherit;font-weight:600;text-decoration:underline}

/* CALC PAGE */
.calc-page{position:relative;z-index:10;max-width:1000px;margin:0 auto;width:100%;padding:2rem}
.calc-layout{display:grid;grid-template-columns:1fr 1.5fr;gap:1.5rem;align-items:start}
@media(max-width:640px){.calc-layout{grid-template-columns:1fr}}
.cf{background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5rem}
.cf h2{font-family:var(--fhead);font-size:1.5rem;letter-spacing:.04em;margin-bottom:1.25rem}
.cost-note{display:flex;align-items:center;gap:6px;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.25);border-radius:var(--radius);padding:8px 12px;font-size:.78rem;color:var(--gold);margin-bottom:1.25rem}
.chatbox{background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--radius-lg);display:flex;flex-direction:column;height:520px}
.ch{padding:.875rem 1.25rem;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
.aip{width:8px;height:8px;border-radius:50%;background:var(--green3);animation:pulse 2s infinite;box-shadow:0 0 6px var(--green3)}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.chn{font-size:.875rem;font-weight:600}
.chp{margin-left:auto;font-size:.75rem;color:var(--muted)}
.cm{flex:1;overflow-y:auto;padding:1.25rem;display:flex;flex-direction:column;gap:.875rem}
.cm::-webkit-scrollbar{width:4px}
.cm::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:999px}
.msg{max-width:86%;padding:10px 14px;border-radius:14px;font-size:.85rem;line-height:1.6}
.msg.ai{background:rgba(255,255,255,.06);border:1px solid var(--border);align-self:flex-start;border-bottom-left-radius:3px}
.msg.user{background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.25);color:var(--green3);align-self:flex-end;border-bottom-right-radius:3px}
.msg.loading{display:flex;gap:5px;align-items:center}
.dot{width:6px;height:6px;border-radius:50%;background:var(--muted);animation:bou 1.2s infinite}
.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
@keyframes bou{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
.ci{padding:.75rem 1rem;border-top:1px solid var(--border);display:flex;gap:8px}
.ci input{flex:1;background:rgba(255,255,255,.07);border:1px solid var(--border);border-radius:999px;padding:9px 16px;color:#fff;font-family:var(--fbody);font-size:.85rem}
.ci input::placeholder{color:var(--hint)}
.ci input:focus{outline:none;border-color:var(--green3)}
.lv{position:absolute;inset:0;background:rgba(5,12,8,.88);border-radius:var(--radius-lg);backdrop-filter:blur(6px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.75rem;text-align:center;padding:1.5rem;z-index:10}
.lv h3{font-family:var(--fhead);font-size:1.5rem;letter-spacing:.04em}
.lv p{font-size:.82rem;color:var(--muted)}
.qq{background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:var(--radius);padding:8px 12px;font-size:.77rem;color:var(--muted);cursor:pointer;text-align:left;font-family:var(--fbody);transition:all .15s;line-height:1.4;width:100%}
.qq:hover:not(:disabled){border-color:var(--green3);color:var(--green3)}
.qq:disabled{opacity:.3;cursor:not-allowed}

/* DASH */
.dash-page{position:relative;z-index:10;max-width:1000px;margin:0 auto;width:100%;padding:2rem}
.dh{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2rem;flex-wrap:wrap;gap:1rem}
.dhello{font-family:var(--fhead);font-size:2rem;letter-spacing:.04em;line-height:1.1}
.dhello em{color:var(--green3);font-style:normal}
.pd{background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.25);border-radius:var(--radius-lg);padding:1rem 1.5rem;text-align:center;min-width:120px}
.pb2{font-family:var(--fhead);font-size:2.2rem;color:var(--gold);letter-spacing:.04em;line-height:1}
.pl{font-size:.65rem;color:var(--gold);text-transform:uppercase;letter-spacing:.1em;margin-top:3px;opacity:.8}
.tasks{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-bottom:2rem}
.tc{background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem;display:flex;flex-direction:column;gap:.75rem;transition:all .2s}
.tc:hover:not(.done){border-color:rgba(74,222,128,.35);background:rgba(74,222,128,.04)}
.tc.done{opacity:.4;pointer-events:none}
.tt{display:flex;align-items:center;gap:10px}
.ti{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.2)}
.tn{font-size:.88rem;font-weight:600}
.td{font-size:.77rem;color:var(--muted);line-height:1.5}
.tf{display:flex;align-items:center;justify-content:space-between}
.tpts{font-size:.77rem;font-weight:600;color:var(--gold)}
.db{background:rgba(74,222,128,.1);color:var(--green3);border-radius:999px;padding:3px 12px;font-size:.72rem;font-weight:600;border:1px solid rgba(74,222,128,.25)}
.ref-box{background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem;margin-bottom:1rem}
.ref-box h3{font-family:var(--fhead);font-size:1.2rem;letter-spacing:.04em;margin-bottom:.25rem}
.ref-box p{font-size:.8rem;color:var(--muted);margin-bottom:.875rem}
.rrow{display:flex;gap:8px}
.rcode{flex:1;background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:var(--radius);padding:9px 13px;font-family:monospace;font-size:.875rem;color:var(--green3);letter-spacing:.08em}
.cbtn{background:rgba(255,255,255,.07);border:1px solid var(--border);border-radius:var(--radius);padding:9px 14px;color:var(--muted);cursor:pointer;font-size:.78rem;transition:all .15s;white-space:nowrap;font-family:var(--fbody)}
.cbtn:hover{border-color:var(--green3);color:var(--green3)}
.hist{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden}
.hr2{display:flex;justify-content:space-between;align-items:center;padding:9px 14px;border-bottom:1px solid var(--border);font-size:.82rem}
.hr2:last-child{border-bottom:none}
.hp{font-weight:600;color:var(--gold)}.hp.neg{color:#f87171}
.divider{border:none;border-top:1px solid var(--border);margin:1.5rem 0}
.stitle{font-family:var(--fhead);font-size:1.4rem;letter-spacing:.04em;margin-bottom:.875rem}

/* MODAL */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(6px)}
.modal{background:rgba(5,15,8,.95);border:1px solid var(--border);border-radius:var(--radius-lg);padding:2rem;max-width:420px;width:90%}
.modal h3{font-family:var(--fhead);font-size:1.5rem;letter-spacing:.04em;margin-bottom:.4rem}
.modal p{color:var(--muted);font-size:.85rem;margin-bottom:1.25rem}
.ad-box{background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--radius);height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem;margin-bottom:1rem}
.progb{width:100%;height:4px;background:rgba(255,255,255,.1);border-radius:999px;overflow:hidden;margin-bottom:.5rem}
.pf{height:100%;background:var(--green3);border-radius:999px;transition:width .2s}
.toast{position:fixed;bottom:2rem;right:2rem;background:var(--green2);color:#fff;border-radius:999px;padding:11px 22px;font-size:.85rem;z-index:999;animation:ti .3s ease;box-shadow:0 4px 24px rgba(74,222,128,.3);font-weight:600}
@keyframes ti{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
.vi{width:100%;background:rgba(255,255,255,.07);border:1px solid var(--border);border-radius:var(--radius);padding:9px 13px;color:#fff;font-family:var(--fbody);font-size:.875rem;margin-top:6px}
.vi::placeholder{color:var(--hint)}
.vi:focus{outline:none;border-color:var(--green3)}
`;

/* ─── PROJECTS DATA ───────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1,
    title: "Сайншанд — 100 айлын нарны дээвэр",
    location: "Сайншанд, Дорноговь",
    capacity: "500 кВт",
    households: 100,
    img: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&q=80",
    return: "15%",
    term: "5 жил",
    minInvest: "1,000,000₮",
    raised: 73,
    raisedAmt: "788,400,000₮",
    targetAmt: "1,080,000,000₮",
    investors: 42,
    status: "open",
    co2: "150,391",
    jobs: 75,
    lcoe: "54₮/кВт.ц",
    riskLevel: 2,
    desc: "Сайншанд хотын 100 айл өрхийг нарны цахилгаанаар хангах эргэлтийн санхүүгийн механизм. Карбон механизмын 20% хөнгөлөлт болон Хаан Банкны ногоон зээлтэй хослуулсан бүтэц. Жилийн 15%-ийн өгөөжийг хадгалалтын дансны хүүтэй харьцуулахад 3 дахин өндөр байна.",
    updates: [
      { date: "2025-04", title: "Угсралт эхэллээ", body: "Rentech Engineering компани 20 айлын суурилуулалтыг эхлүүлсэн." },
      { date: "2025-03", title: "Карбон гэрээ", body: "JCM карбон механизмын урьдчилсан гэрээ байгуулагдлаа." },
      { date: "2025-02", title: "Хаан Банктай гэрээ", body: "Ногоон зээлийн санхүүжилтийн гэрээнд гарын үсэг зурлаа." },
    ],
  },
  {
    id: 2,
    title: "Замын-Үүд Нарны Станц",
    location: "Замын-Үүд, Дорноговь",
    capacity: "250 кВт",
    households: 50,
    img: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&q=80",
    return: "13%",
    term: "7 жил",
    minInvest: "500,000₮",
    raised: 45,
    raisedAmt: "243,000,000₮",
    targetAmt: "540,000,000₮",
    investors: 28,
    status: "open",
    co2: "75,195",
    jobs: 38,
    lcoe: "54₮/кВт.ц",
    riskLevel: 2,
    desc: "Замын-Үүд хотын худалдааны бүсэд байрлах 50 айл өрхийг нарны цахилгаанаар хангах. Хилийн боомтын ойролцоо байрлах тул экспортын боломж өндөр.",
    updates: [
      { date: "2025-04", title: "Судалгаа дууслаа", body: "Техникийн болон эдийн засгийн үндэслэл бэлтгэгдлээ." },
    ],
  },
  {
    id: 3,
    title: "Дэлгэрэх Нарны Тариалан",
    location: "Дэлгэрэх сум, Дорноговь",
    capacity: "1 МВт",
    households: 200,
    img: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&q=80",
    return: "18%",
    term: "10 жил",
    minInvest: "2,000,000₮",
    raised: 100,
    raisedAmt: "2,160,000,000₮",
    targetAmt: "2,160,000,000₮",
    investors: 87,
    status: "full",
    co2: "300,782",
    jobs: 150,
    lcoe: "50₮/кВт.ц",
    riskLevel: 1,
    desc: "Дорноговь аймгийн хамгийн том нарны цахилгаан станц. 200 айл өрх болон орон нутгийн сургууль, эмнэлгийг хангана. Бүрэн санхүүжигдсэн.",
    updates: [
      { date: "2025-01", title: "Бүрэн санхүүжигдлаа", body: "87 хөрөнгө оруулагчийн дэмжлэгтэйгээр зорилтот дүнд хүрлээ." },
    ],
  },
  {
    id: 4,
    title: "Сайншанд Бизнес Парк",
    location: "Сайншанд, Дорноговь",
    capacity: "750 кВт",
    households: 0,
    img: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&q=80",
    return: "20%",
    term: "8 жил",
    minInvest: "5,000,000₮",
    raised: 0,
    raisedAmt: "0₮",
    targetAmt: "1,620,000,000₮",
    investors: 0,
    status: "soon",
    co2: "225,587",
    jobs: 112,
    lcoe: "52₮/кВт.ц",
    riskLevel: 3,
    desc: "ААН-үүдэд зориулсан томоохон нарны цахилгаан станц. Дорноговийн аж үйлдвэрийн бүсэд байрлана. 2025 оны 3-р улиралд нээлт хийнэ.",
    updates: [],
  },
];

const COST = 30;

async function askClaude(messages) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    const d = await res.json();
    if (d.error) return "Алдаа: " + d.error;
    return d.text || "Хариу ирсэнгүй.";
  } catch (err) {
    return "Холболтын алдаа: " + err.message;
  }
}

/* ─── MAIN ────────────────────────────────────────────────── */
export default function SolarEase() {
  const [page, setPage] = useState("landing");
  const [authMode, setAuthMode] = useState("register");
  const [authReturn, setAuthReturn] = useState("calc");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [adModal, setAdModal] = useState(false);
  const [adProg, setAdProg] = useState(0);
  const [adRunning, setAdRunning] = useState(false);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [vStep, setVStep] = useState(0);
  const [vPhone, setVPhone] = useState("");
  const [vCode, setVCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [refIn, setRefIn] = useState("");
  const [area, setArea] = useState("87");
  const [heat, setHeat] = useState("electric");
  const [monthly, setMonthly] = useState("150000");
  const [msgs, setMsgs] = useState([{ role: "assistant", content: "Сайн байна уу! Нарны системийн тооцоог хийхэд тусална.\n\nГэрийнхээ мэдээллийг оруулаад «Тооцоолох» дарна уу, эсвэл шууд асуулт бичнэ үү." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [investAmt, setInvestAmt] = useState("1000000");
  const msgEnd = useRef(null);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  // Check existing Supabase session on load
  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await db.auth.getSession();
      if (session) {
        await fetchProfile(session.user.id);
      }
    };
    loadSession();

    const { data: listener } = db.auth.onAuthStateChange(async (_event, session) => {
      if (session) await fetchProfile(session.user.id);
      else { setUser(null); setHistory([]); }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data: profile } = await db.from("profiles")
        .select("*").eq("id", userId).single();
      if (profile) {
        setUser(profile);
        setPage(p => p === "landing" ? "invest" : p);
        const sb = getSB();
        if (sb) {
          const { data: hist } = await sb.from("point_history")
            .select("*").eq("user_id", userId)
            .order("created_at", { ascending: false }).limit(20);
          if (hist) setHistory(hist.map(h => ({
            desc: h.description, pts: h.points,
            t: new Date(h.created_at).toLocaleTimeString()
          })));
        }
      }
    } catch(e) {
      console.error("fetchProfile error:", e);
    }
  };
  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const showToast = msg => setToast(msg);
  const addPts = async (n, desc) => {
    setUser(u => ({ ...u, points: (u?.points || 0) + n }));
    setHistory(h => [{ desc, pts: n, t: new Date().toLocaleTimeString() }, ...h]);
    showToast(`+${n} оноо нэмэгдлээ!`);
    if (user?.id) {
      await db.from("profiles").update({ points: (user?.points || 0) + n }).eq("id", user.id);
      await db.from("point_history").insert({ user_id: user.id, description: desc, points: n });
    }
  };

  const usePts = async (n, desc) => {
    setUser(u => ({ ...u, points: (u?.points || 0) - n }));
    setHistory(h => [{ desc, pts: -n, t: new Date().toLocaleTimeString() }, ...h]);
    if (user?.id) {
      await db.from("profiles").update({ points: (user?.points || 0) - n }).eq("id", user.id);
      await db.from("point_history").insert({ user_id: user.id, description: desc, points: -n });
    }
  };

  function goCalc() {
    if (!user) { setAuthReturn("calc"); setAuthMode("register"); setPage("auth"); }
    else setPage("calc");
  }
  function goInvest() { setPage("invest"); setSelectedProject(null); }

  const handleAuth = async (e) => {
    e?.preventDefault();
    if (authLoading) return;
    setAuthLoading(true);
    try {
    if (authMode === "register") {
      // 1. Supabase Auth-д бүртгэх
      const { data, error } = await db.auth.signUp({ email: email.trim().toLowerCase(), password: pass });
      if (error) { showToast("Алдаа: " + error.message); return; }

      // 2. profiles хүснэгтэд хэрэглэгч үүсгэх
      const refCode = genCode(name);
      await db.from("profiles").insert({
        id: data.user.id,
        name, email, points: 50,
        ref_code: refCode,
        verified: false,
        ad_count: 0,
        invite_count: 0,
      });

      // 3. Оноoны түүхэнд нэмэх
      await db.from("point_history").insert({
        user_id: data.user.id,
        description: "Бүртгэлийн урамшуулал",
        points: 50,
      });

      // 4. Локал state шинэчлэх
      const userId = data?.user?.id;
      if (!userId) {
        showToast("Бүртгэл үүсгэгдлээ. Имэйлийг баталгаажуулаад нэвтэрнэ үү.");
        setAuthMode("login");
        return;
      }
      setUser({ id: userId, name, email, points: 50, ref_code: refCode, verified: false, ad_count: 0, invite_count: 0 });
      setHistory([{ desc: "Бүртгэлийн урамшуулал", pts: 50, t: new Date().toLocaleTimeString() }]);
      showToast("Тавтай морил! +50 оноо!");

    } else {
      // Нэвтрэх — зөвхөн Supabase-д бүртгэлтэй хэрэглэгч л нэвтэрнэ
      const { data, error } = await db.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: pass
      });
      if (error) {
        const msg = error.message || "";
        if (msg.includes("Invalid login") || msg.includes("invalid_credentials") || msg.includes("Invalid credentials")) {
          showToast("Имэйл эсвэл нууц үг буруу байна");
        } else if (msg.includes("Email not confirmed")) {
          showToast("⚠ Имэйлээ баталгаажуулна уу. Supabase → Authentication → Email → Confirm email OFF болгоно уу.");
        } else if (msg.includes("Supabase тохируулагдаагүй")) {
          showToast("⚠ Vercel дээр SUPABASE env var тохируулаагүй байна");
        } else {
          showToast("Нэвтрэх алдаа: " + msg);
        }
        return;
      }
      if (!data?.user?.id) { showToast("Нэвтрэх амжилтгүй. Дахин оролдоно уу."); return; }
      await fetchProfile(data.user.id);
      showToast("Нэвтэрлээ! Таны оноо хадгалагдсан байна ✓");
    }
    setPage(authReturn);
    } catch(err) {
      showToast("Алдаа гарлаа: " + (err?.message || "Дахин оролдоно уу"));
      console.error("handleAuth error:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  function startAd() {
    if ((user?.ad_count || 0) >= 5) return;
    setAdProg(0); setAdRunning(true); setAdModal(true);
    let p = 0;
    const iv = setInterval(async () => {
      p += 100 / 30; setAdProg(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(iv); setAdRunning(false); setAdModal(false);
        const newCount = (user?.ad_count || 0) + 1;
        setUser(u => ({ ...u, ad_count: newCount }));
        if (user?.id) await db.from("profiles").update({ ad_count: newCount }).eq("id", user.id);
        addPts(10, "Сурталчилгаа үзсэн");
      }
    }, 1000);
  }

  const handleVerify = async () => {
    if (vStep === 0) { setVStep(1); showToast("Код илгээлээ (demo)"); }
    else if (vStep === 1 && vCode.length >= 4) {
      setUser(u => ({ ...u, verified: true }));
      if (user?.id) await db.from("profiles").update({ verified: true }).eq("id", user.id);
      addPts(50, "Бүртгэл баталгаажуулсан");
      setVStep(2);
    }
  };

  const copyRef = async () => {
    navigator.clipboard?.writeText(user?.ref_code || "").catch(() => {});
    setCopied(true); showToast("Код хуулагдлаа!");
    setTimeout(() => setCopied(false), 2000);
    if ((user?.invite_count || 0) < 10) {
      setTimeout(async () => {
        const newCount = (user?.invite_count || 0) + 1;
        setUser(u => ({ ...u, invite_count: newCount }));
        if (user?.id) await db.from("profiles").update({ invite_count: newCount }).eq("id", user.id);
        addPts(25, "Найз нэгдсэн (demo)");
      }, 3000);
    }
  };

  async function sendMsg(e, override) {
    e?.preventDefault();
    const txt = (override || input).trim();
    if (!txt || loading) return;
    if (!user || user?.points || 0 < COST) { showToast(`${COST} оноо хэрэгтэй.`); return; }
    usePts(COST, "AI тооцоолол");
    const um = { role: "user", content: txt };
    setMsgs(m => [...m, um]);
    setInput(""); setLoading(true);
    try {
      const hist = [...msgs, um].map(m => ({ role: m.role, content: m.content }));
      const reply = await askClaude(hist);
      setMsgs(m => [...m, { role: "assistant", content: reply }]);
    } catch { setMsgs(m => [...m, { role: "assistant", content: "Холболт шалгана уу." }]); }
    setLoading(false);
  }

  async function autoCalc() {
    const q = `Миний гэр: ${area}м², халаалт: ${heat === "electric" ? "цахилгаан" : heat === "coal" ? "нүүрс" : "төвийн"}, сарын цахилгааны зардал: ${parseInt(monthly).toLocaleString()}₮. Нарны системийн дэлгэрэнгүй тооцоо гарга.`;
    await sendMsg(null, q);
  }

  const canCalc = user && (user?.points || 0) >= COST;

  /* Return calc */
  const calcReturn = () => {
    const amt = parseInt(investAmt.replace(/,/g, "")) || 0;
    const p = selectedProject;
    if (!p) return { annual: 0, total: 0, years: 0 };
    const r = parseInt(p.return) / 100;
    const yrs = parseInt(p.term);
    const annual = Math.round(amt * r);
    const total = Math.round(amt + annual * yrs);
    return { annual, total, yrs };
  };

  /* ── RENDER ──────────────────────────────────────────────── */
  return (
    <>
      <style>{G}</style>
      <div className="app">

        {/* BG */}
        <div className="bg-wrap">
          <img className="bg-img" src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=1800&q=80" alt="" />
          <div className="bg-ov"/>
        </div>

        {/* NAV */}
        <nav className="nav">
          <div onClick={() => setPage("landing")} style={{cursor:"pointer"}}>
            <div className="logo">Solar<span className="e">Ease</span></div>
            <div className="logo-sub">fintech platform</div>
          </div>
          <div className="nav-tabs">
            <button className={`nav-tab ${page==="invest"||page==="landing"?"":""}${page==="invest"?"active":""}`} onClick={goInvest}>Хөрөнгө оруулах</button>
            <button className={`nav-tab ${page==="calc"?"active":""}`} onClick={goCalc}>AI Тооцоолол</button>
          </div>
          <div className="nav-r" style={{display:"flex",gap:"8px",alignItems:"center"}}>
            {user ? (
              <>
                <div className="pts-pill">⚡ {user?.points || 0} оноо</div>
                <div style={{fontSize:".78rem",color:"var(--muted)",maxWidth:"100px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name}</div>
                <button className="btn btn-g btn-sm" onClick={() => setPage("dash")}>Хяналт</button>
                <button className="btn btn-sm" style={{background:"rgba(248,113,113,.12)",color:"#f87171",border:"1px solid rgba(248,113,113,.3)"}} onClick={async () => { await db.auth.signOut(); setUser(null); setHistory([]); setPage("landing"); showToast("Амжилттай гарлаа."); }}>↩ Гарах</button>
              </>
            ) : (
              <>
                <button className="btn btn-g btn-sm" onClick={() => { setAuthReturn("invest"); setAuthMode("login"); setPage("auth"); }}>Нэвтрэх</button>
                <button className="btn btn-p btn-sm" onClick={() => { setAuthReturn("invest"); setAuthMode("register"); setPage("auth"); }}>Бүртгүүлэх</button>
              </>
            )}
          </div>
        </nav>

        {/* ── LANDING ── */}
        {page === "landing" && (
          <div className="land">
            <div className="hero">
              <div className="hero-in">
                <div>
                  <div className="hero-tag">☀ Дорноговь аймаг · 2025</div>
                  <h1 className="h1">
                    INVEST IN<br/>
                    <span className="g">SOLAR.</span><br/>
                    <span className="go">EARN IT.</span>
                  </h1>
                  <p style={{fontSize:"1rem",color:"var(--muted)",maxWidth:"440px",marginBottom:"2.5rem",fontWeight:"300",lineHeight:"1.75"}}>
                    Дорноговь аймгийн нарны цахилгааны хөрөнгө оруулалтын платформ. AI туслахаар тооцоол, хөрөнгө оруул, орлого ол.
                  </p>
                  <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
                    <div className="cta-card calc" style={{flex:"1",minWidth:"220px"}} onClick={goCalc}>
                      <div className="cta-card-top">
                        <div className="cta-card-icon c">🤖</div>
                        <span className="cta-card-badge login">Бүртгэл шаардлагатай</span>
                      </div>
                      <h3>AI Тооцоолол</h3>
                      <p>Гэрийнхээ мэдээллийг оруулаад нарны системийн санхүүгийн тооцоог AI туслахаар хий.</p>
                      <div className="cta-card-arrow">Тооцоолох → </div>
                    </div>
                    <div className="cta-card invest" style={{flex:"1",minWidth:"220px"}} onClick={goInvest}>
                      <div className="cta-card-top">
                        <div className="cta-card-icon i">💰</div>
                        <span className="cta-card-badge free">Үнэгүй үзэх</span>
                      </div>
                      <h3>Хөрөнгө Оруулах</h3>
                      <p>Дорноговийн нарны энергийн төслүүдэд хөрөнгө оруулж жилд 13–20% өгөөж ол.</p>
                      <div className="cta-card-arrow" style={{color:"var(--gold)"}}>Төслүүд үзэх → </div>
                    </div>
                  </div>
                  <div className="hero-stats">
                    {[["15%+","жилийн өгөөж"],["4,000₮","сарын орлого/кВт"],["20%","карбон хөнгөлөлт"],["75+","ажлын байр"]].map(([v,l]) => (
                      <div key={l}><div className="hv">{v}</div><div className="hl">{l}</div></div>
                    ))}
                  </div>
                </div>
                <div style={{position:"relative"}}>
                  <div style={{background:"rgba(0,0,0,.5)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",overflow:"hidden",backdropFilter:"blur(12px)"}}>
                    <img src={PROJECTS[0].img} style={{width:"100%",height:"220px",objectFit:"cover",opacity:.8}} alt="solar"/>
                    <div style={{padding:"1.5rem"}}>
                      <div style={{fontSize:".68rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".4rem"}}>Онцлох төсөл</div>
                      <div style={{fontFamily:"var(--fhead)",fontSize:"1.4rem",letterSpacing:".04em",marginBottom:"1rem"}}>Smart Sainshand</div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:".5rem",marginBottom:"1rem"}}>
                        {[["15%","Жилийн өгөөж"],["5 жил","Хугацаа"],["1M₮","Мин. хөрөнгө"]].map(([v,l])=>(
                          <div key={l} style={{background:"rgba(255,255,255,.05)",borderRadius:"8px",padding:".625rem",textAlign:"center"}}>
                            <div style={{fontFamily:"var(--fhead)",fontSize:"1.1rem",color:"var(--green3)"}}>{v}</div>
                            <div style={{fontSize:".65rem",color:"var(--muted)",marginTop:"2px"}}>{l}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{marginBottom:".5rem"}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:".75rem",marginBottom:".4rem"}}>
                          <span style={{color:"var(--green3)",fontWeight:"600"}}>{PROJECTS[0].raised}% санхүүжигдсэн</span>
                          <span style={{color:"var(--muted)"}}>{PROJECTS[0].investors} хөрөнгө оруулагч</span>
                        </div>
                        <div className="prog-bar"><div className="prog-fill" style={{width:`${PROJECTS[0].raised}%`}}/></div>
                      </div>
                      <button className="btn btn-gold" style={{width:"100%",justifyContent:"center",marginTop:".875rem"}} onClick={goInvest}>Хөрөнгө оруулах →</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── INVESTMENT PORTFOLIO ── */}
        {page === "invest" && !selectedProject && (
          <div className="invest-page">
            <div style={{marginBottom:"2rem"}}>
              <div style={{fontSize:".7rem",color:"var(--green3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".4rem",fontWeight:"600"}}>Нарны энергийн хөрөнгө оруулалт</div>
              <h1 style={{fontFamily:"var(--fhead)",fontSize:"clamp(2rem,4vw,3rem)",letterSpacing:".04em",marginBottom:".5rem"}}>ДОРНОГОВИЙН НАРНЫ ТӨСЛҮҮД</h1>
              <p style={{fontSize:".9rem",color:"var(--muted)",maxWidth:"560px"}}>Баталгаажсан нарны цахилгааны төслүүдэд хөрөнгө оруулж, жилийн 13–20% өгөөж ол. Бүртгэлгүйгээр үзэх боломжтой.</p>
            </div>

            {/* Stats strip */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:".875rem",marginBottom:"2rem",background:"rgba(255,255,255,.03)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"1.25rem"}}>
              {[["4","Нийт төсөл"],["157","Хөрөнгө оруулагч"],["13–20%","Жилийн өгөөж"],["1M₮","Хамгийн бага"]].map(([v,l])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontFamily:"var(--fhead)",fontSize:"1.6rem",color:"var(--green3)",letterSpacing:".04em"}}>{v}</div>
                  <div style={{fontSize:".68rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",marginTop:"2px"}}>{l}</div>
                </div>
              ))}
            </div>

            <div className="project-list">
              {PROJECTS.map(p => (
                <div className="pcard" key={p.id} onClick={() => { setSelectedProject(p); setActiveTab("overview"); }}>
                  <div style={{position:"relative"}}>
                    <img className="pcard-img" src={p.img} alt={p.title}/>
                    <div style={{position:"absolute",top:"12px",left:"12px"}}>
                      <span className={`pcard-status ${p.status === "open" ? "status-open" : p.status === "full" ? "status-full" : "status-soon"}`}>
                        {p.status === "open" ? "● Нээлттэй" : p.status === "full" ? "Дүүрсэн" : "Удахгүй"}
                      </span>
                    </div>
                  </div>
                  <div className="pcard-body">
                    <div className="pcard-loc">📍 {p.location}</div>
                    <div className="pcard-title">{p.title}</div>
                    <div className="pcard-metrics">
                      <div className="pm"><div className="pv">{p.return}</div><div className="pl">Өгөөж/жил</div></div>
                      <div className="pm"><div className="pv">{p.term}</div><div className="pl">Хугацаа</div></div>
                      <div className="pm"><div className="pv">{p.minInvest}</div><div className="pl">Хамгийн бага</div></div>
                    </div>
                    <div className="pcard-prog"><div className="pcard-prog-fill" style={{width:`${p.raised}%`}}/></div>
                    <div className="pcard-prog-label"><span style={{color:"var(--green3)",fontWeight:"600"}}>{p.raised}% санхүүжигдсэн</span><span>{p.investors} хөрөнгө оруулагч</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PROJECT DETAIL ── */}
        {page === "invest" && selectedProject && (() => {
          const p = selectedProject;
          const ret = calcReturn();
          return (
            <div className="invest-page">
              <button className="btn btn-g btn-sm" style={{marginBottom:"1.5rem"}} onClick={() => setSelectedProject(null)}>← Буцах</button>
              <div className="invest-hero">
                <div>
                  <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"1rem"}}>
                    <span className={`pcard-status ${p.status === "open" ? "status-open" : p.status === "full" ? "status-full" : "status-soon"}`}>
                      {p.status === "open" ? "● Нээлттэй" : p.status === "full" ? "Дүүрсэн" : "Удахгүй"}
                    </span>
                    <span className="tag green">Нарны цахилгаан</span>
                    <span className="tag blue">{p.capacity}</span>
                    <span className="tag">{p.households > 0 ? `${p.households} айл өрх` : "ААН"}</span>
                  </div>
                  <h1 className="project-title">{p.title}</h1>
                  <div className="project-loc">📍 {p.location}</div>
                  <img className="project-img" src={p.img} alt={p.title}/>
                </div>

                {/* SIDEBAR */}
                <div className="invest-sidebar">
                  <div className="sidebar-title">Хөрөнгө оруулалтын нөхцөл</div>
                  <div className="metric-grid">
                    <div className="metric"><div className="mv green">{p.return}</div><div className="ml">Жилийн өгөөж</div></div>
                    <div className="metric"><div className="mv">{p.term}</div><div className="ml">Хугацаа</div></div>
                    <div className="metric"><div className="mv gold">{p.minInvest}</div><div className="ml">Хамгийн бага</div></div>
                    <div className="metric"><div className="mv">{p.investors}</div><div className="ml">Хөрөнгө оруулагч</div></div>
                  </div>

                  <div className="prog-wrap">
                    <div className="prog-label">
                      <span>{p.raised}% санхүүжигдсэн</span>
                      <span>{p.raisedAmt}</span>
                    </div>
                    <div className="prog-bar"><div className="prog-fill" style={{width:`${p.raised}%`}}/></div>
                    <div className="prog-stats"><span>Зорилт: {p.targetAmt}</span><span>{p.investors} хөрөнгө оруулагч</span></div>
                  </div>

                  {p.status !== "full" && (
                    <>
                      <div className="invest-input-wrap">
                        <div className="invest-input-label">Хөрөнгө оруулах дүн (₮)</div>
                        <input className="invest-input" value={investAmt} onChange={e => setInvestAmt(e.target.value.replace(/[^0-9]/g,""))} placeholder="1000000"/>
                      </div>
                      <div className="invest-calc">
                        <div style={{fontSize:".72rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:".5rem",fontWeight:"600"}}>Тооцоолол</div>
                        <div className="invest-calc-row"><span>Жилийн өгөөж</span><span>{ret.annual.toLocaleString()}₮</span></div>
                        <div className="invest-calc-row"><span>Нийт хүлээн авна ({ret.yrs}жил)</span><span>{ret.total.toLocaleString()}₮</span></div>
                        <div className="invest-calc-row"><span>Хөрөнгийн өсөлт</span><span>{((ret.total/(parseInt(investAmt)||1)-1)*100).toFixed(0)}%</span></div>
                      </div>
                      <button className="btn btn-gold" style={{width:"100%",justifyContent:"center"}}
                        onClick={() => { if (!user) { setAuthReturn("invest"); setAuthMode("register"); setPage("auth"); } else showToast("Амжилттай хүсэлт илгээгдлээ! (Demo)"); }}>
                        {user ? "Хөрөнгө оруулах →" : "Бүртгүүлж хөрөнгө оруулах →"}
                      </button>
                      <div className="invest-note">Хөрөнгө оруулахад бүртгэл шаардлагатай. Харах нь үнэгүй.</div>
                    </>
                  )}
                  {p.status === "full" && (
                    <div style={{background:"rgba(255,255,255,.05)",borderRadius:"var(--radius)",padding:"1rem",textAlign:"center",fontSize:".85rem",color:"var(--muted)"}}>
                      Энэ төсөл бүрэн санхүүжигдсэн.<br/>Дараагийн төслүүдийг үзнэ үү.
                    </div>
                  )}
                </div>
              </div>

              {/* TABS */}
              <div className="tabs">
                {[["overview","Тойм"],["details","Дэлгэрэнгүй"],["updates","Мэдээлэл"]].map(([k,v])=>(
                  <button key={k} className={`tab-btn ${activeTab===k?"active":""}`} onClick={()=>setActiveTab(k)}>{v}</button>
                ))}
              </div>

              {activeTab === "overview" && (
                <>
                  <p className="project-desc">{p.desc}</p>
                  <div className="detail-grid">
                    {[
                      {v:p.capacity,l:"Хүчин чадал"},
                      {v:p.co2+" тонн",l:"CO₂ бууралт/жил"},
                      {v:p.jobs+"+",l:"Ажлын байр"},
                      {v:p.lcoe,l:"Нэгж өртөг"},
                    ].map(d=>(
                      <div className="detail-card" key={d.l}><div className="dv">{d.v}</div><div className="dl">{d.l}</div></div>
                    ))}
                  </div>
                  <div style={{background:"rgba(255,255,255,.04)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"1.25rem"}}>
                    <div style={{fontSize:".72rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:".75rem",fontWeight:"600"}}>Эрсдэлийн түвшин</div>
                    <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
                      <div className="risk-bar">
                        {[1,2,3,4,5].map(i=><div key={i} className={`risk-dot ${i<=p.riskLevel?"on":""}`}/>)}
                      </div>
                      <span style={{fontSize:".82rem",color:"var(--muted)"}}>
                        {p.riskLevel<=2?"Бага эрсдэл — баталгаажсан хэрэгжүүлэгчтэй":p.riskLevel<=3?"Дунд эрсдэл":"Харьцангуй өндөр эрсдэл"}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "details" && (
                <div className="detail-grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))"}}>
                  {[
                    {v:p.capacity,l:"Нийт хүчин чадал"},
                    {v:p.households>0?p.households+" айл":"ААН",l:"Хамрах хүрээ"},
                    {v:p.return,l:"Жилийн өгөөж"},
                    {v:p.term,l:"Хөрөнгө оруулалтын хугацаа"},
                    {v:p.minInvest,l:"Хамгийн бага хөрөнгө"},
                    {v:p.targetAmt,l:"Зорилтот дүн"},
                    {v:p.raisedAmt,l:"Одоогийн санхүүжилт"},
                    {v:p.investors+" хүн",l:"Хөрөнгө оруулагч"},
                    {v:p.co2+" тонн",l:"CO₂ бууралт/жил"},
                    {v:p.jobs+"+",l:"Бий болох ажлын байр"},
                    {v:p.lcoe,l:"LCOE нэгж өртөг"},
                    {v:"Rentech, G Power",l:"Угсралтын компани"},
                  ].map(d=>(
                    <div className="detail-card" key={d.l}><div className="dv" style={{fontSize:"1.1rem"}}>{d.v}</div><div className="dl">{d.l}</div></div>
                  ))}
                </div>
              )}

              {activeTab === "updates" && (
                <div>
                  {p.updates.length === 0 && <p style={{color:"var(--muted)",fontSize:".9rem"}}>Одоогоор мэдээлэл байхгүй байна.</p>}
                  {p.updates.map((u,i)=>(
                    <div className="update-item" key={i}>
                      <div className="update-date">{u.date}</div>
                      <div className="update-content"><h4>{u.title}</h4><p>{u.body}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* ── AUTH ── */}
        {page === "auth" && (
          <div className="auth-page">
            <div className="auth-card">
              <h2>{authMode === "register" ? "БҮРТГЭЛ ҮҮСГЭХ" : "НЭВТРЭХ"}</h2>
              <p className="auth-sub">{authMode === "register" ? "Бүртгүүлж AI тооцоолол болон хөрөнгө оруулалтад нэвтэр" : "Имэйл болон нууц үгээрээ нэвтэрнэ үү"}</p>
              {authMode === "register" && <div className="bonus-note">🎁 Бүртгүүлснийхээ шагнал 50 оноо автоматаар нэмэгдэнэ</div>}
              <form onSubmit={handleAuth}>
                {authMode === "register" && (
                  <div className="field"><label>Нэр</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Таны нэр" required/></div>
                )}
                <div className="field"><label>Имэйл</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="example@gmail.com" required/></div>
                <div className="field"><label>Нууц үг</label><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" required/></div>
                {authMode === "register" && (
                  <div className="field"><label>Урилгын код (заавал биш)</label><input value={refIn} onChange={e=>setRefIn(e.target.value)} placeholder="SE-XXX..."/></div>
                )}
                {authMode === "login" && (
                  <div style={{textAlign:"right",marginBottom:".75rem"}}>
                    <button type="button" style={{background:"none",border:"none",color:"var(--green3)",fontSize:".78rem",cursor:"pointer",fontFamily:"var(--fbody)"}}
                      onClick={async () => {
                        if (!email) { showToast("Имэйл хаягаа оруулна уу"); return; }
                        const { error } = await db.auth.resetPasswordForEmail(email);
                        if (error) showToast("Алдаа: " + error.message);
                        else showToast("Нууц үг сэргээх линк имэйлд илгээлээ ✓");
                      }}>Нууц үгээ мартсан уу?</button>
                  </div>
                )}
                <button
                  className="btn btn-p"
                  style={{width:"100%",justifyContent:"center",marginTop:".25rem",opacity:authLoading?0.6:1}}
                  type="submit"
                  disabled={authLoading}
                  onClick={(e) => { e.preventDefault(); handleAuth(e); }}
                >
                  {authLoading ? "Түр хүлээнэ үү..." : authMode === "register" ? "БҮРТГҮҮЛЭХ" : "НЭВТРЭХ"}
                </button>
              </form>
              <div className="auth-switch">
                {authMode === "register" ? <>Бүртгэлтэй юу? <button onClick={()=>setAuthMode("login")}>Нэвтрэх</button></> : <>Бүртгэлгүй юу? <button onClick={()=>setAuthMode("register")}>Бүртгүүлэх</button></>}
              </div>
            </div>
          </div>
        )}

        {/* ── AI CALC ── */}
        {page === "calc" && user && (
          <div className="calc-page">
            <div style={{marginBottom:"1.5rem"}}>
              <div className="stitle">☀ AI НАРНЫ ТООЦООЛОЛ</div>
              <p style={{fontSize:".85rem",color:"var(--muted)"}}>
                Асуулт бүрт 30 оноо · Үлдэгдэл: <strong style={{color:"var(--gold)"}}>{user?.points || 0} оноо</strong>
                {" · "}<button className="btn btn-g btn-sm" onClick={()=>setPage("dash")}>Оноо нэмэх</button>
              </p>
            </div>
            <div className="calc-layout">
              <div className="cf">
                <h2>ГЭРИЙН МЭДЭЭЛЭЛ</h2>
                {!canCalc && <div style={{background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.25)",borderRadius:"var(--radius)",padding:"9px 12px",fontSize:".78rem",color:"#f87171",marginBottom:"1rem"}}>Оноо хүрэлцэхгүй — дашбоард руу очиж нэм.</div>}
                <div className="field"><label>Талбай (м²)</label><input value={area} onChange={e=>setArea(e.target.value)} placeholder="87"/></div>
                <div className="field"><label>Халаалт</label>
                  <select value={heat} onChange={e=>setHeat(e.target.value)}>
                    <option value="electric">Цахилгаан халаалт</option>
                    <option value="coal">Нүүрс халаалт</option>
                    <option value="central">Төвийн халаалт</option>
                  </select>
                </div>
                <div className="field"><label>Сарын цахилгааны зардал (₮)</label><input value={monthly} onChange={e=>setMonthly(e.target.value)} placeholder="150000"/></div>
                <div className="cost-note">⚡ Тооцооллын өртөг: 30 оноо</div>
                <button className="btn btn-p" style={{width:"100%",justifyContent:"center"}} onClick={autoCalc} disabled={!canCalc||loading}>
                  {loading?"Тооцоолж байна...":"AI-АЭР ТООЦОО ГАРГА →"}
                </button>
                <div style={{marginTop:"1.25rem",display:"flex",flexDirection:"column",gap:"6px"}}>
                  <div style={{fontSize:".7rem",color:"var(--muted)",marginBottom:"2px",textTransform:"uppercase",letterSpacing:".08em"}}>Хурдан асуулт</div>
                  {["10kW системийн хөрөнгө нөхөх хугацааг тооцоол","Карбон механизмгүй бол тооцоо хэрхэн өөрчлөгдөх вэ?","100 айлын нарны системд хэдий хөрөнгө шаардлагатай вэ?"].map(q=>(
                    <button key={q} className="qq" onClick={()=>sendMsg(null,q)} disabled={!canCalc||loading}>{q}</button>
                  ))}
                </div>
              </div>
              <div style={{position:"relative"}}>
                <div className="chatbox">
                  <div className="ch"><div className="aip"/><span className="chn">🤖 SolarEase AI</span><span className="chp">{user?.points || 0} оноо</span></div>
                  <div className="cm">
                    {msgs.map((m,i)=>(
                      <div key={i} className={`msg ${m.role==="assistant"?"ai":"user"}`} style={{whiteSpace:"pre-wrap"}}>{m.content}</div>
                    ))}
                    {loading && <div className="msg ai loading"><div className="dot"/><div className="dot"/><div className="dot"/></div>}
                    <div ref={msgEnd}/>
                  </div>
                  <form className="ci" onSubmit={sendMsg}>
                    <input value={input} onChange={e=>setInput(e.target.value)} placeholder={canCalc?"Асуулт бичнэ үү...":"Оноо хүрэлцэхгүй"} disabled={!canCalc||loading}/>
                    <button className="btn btn-p btn-sm" type="submit" disabled={!canCalc||!input.trim()||loading}>→</button>
                  </form>
                </div>
                {!canCalc && (
                  <div className="lv">
                    <div style={{fontSize:"2.5rem"}}>🔒</div>
                    <h3>ОНОО ХҮРЭЛЦЭХГҮЙ</h3>
                    <p>{COST} оноо шаардлагатай</p>
                    <button className="btn btn-p btn-sm" onClick={()=>setPage("dash")}>Оноо цуглуулах →</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {page === "dash" && user && (
          <div className="dash-page">
            <div className="dh">
              <div>
                <div style={{fontSize:".7rem",color:"var(--muted)",marginBottom:"3px",textTransform:"uppercase",letterSpacing:".08em"}}>Тавтай морил</div>
                <div className="dhello">САЙН БАЙНА УУ, <em>{(user?.name||"").toUpperCase()}</em></div>
              </div>
              <div className="pd"><div className="pb2">{user?.points || 0}</div><div className="pl">Нийт оноо</div></div>
            </div>
            <div className="stitle">ОНОО ЦУГЛУУЛАХ</div>
            <div className="tasks">
              <div className={`tc ${(user?.ad_count||0)>=5?"done":""}`}>
                <div className="tt"><div className="ti">📺</div><div className="tn">Сурталчилгаа үзэх</div></div>
                <div className="td">30 секунд үзэж оноо ав · {user?.ad_count||0}/5 удаа</div>
                <div className="tf"><span className="tpts">+10 оноо</span>
                  {(user?.ad_count||0)>=5?<span className="db">✓ Дууссан</span>:<button className="btn btn-p btn-sm" onClick={startAd}>Үзэх</button>}
                </div>
              </div>
              <div className={`tc ${user?.verified?"done":""}`}>
                <div className="tt"><div className="ti">✅</div><div className="tn">Бүртгэл баталгаажуулах</div></div>
                <div className="td">Утасны дугаар оруулж нэмэлт оноо ав</div>
                {!user?.verified && vStep < 2 && <input className="vi" value={vStep===0?vPhone:vCode} onChange={e=>vStep===0?setVPhone(e.target.value):setVCode(e.target.value)} placeholder={vStep===0?"Утасны дугаар":"4 оронтой код"}/>}
                <div className="tf"><span className="tpts">+50 оноо</span>
                  {user?.verified?<span className="db">✓ Баталгаажсан</span>:<button className="btn btn-o btn-sm" onClick={handleVerify}>{vStep===0?"Код авах":"Баталгаажуулах"}</button>}
                </div>
              </div>
              <div className="tc">
                <div className="tt"><div className="ti">👥</div><div className="tn">Найз урих</div></div>
                <div className="td">Таны кодоор нэгдсэн найз тутамд · {user?.invite_count||0} найз</div>
                <div className="tf"><span className="tpts">+25 оноо/найз</span><button className="btn btn-g btn-sm" onClick={copyRef}>{copied?"✓ Хуулагдлаа":"Урих"}</button></div>
              </div>
              <div className="tc" style={{borderColor:"rgba(74,222,128,.3)",cursor:"pointer"}} onClick={()=>setPage("calc")}>
                <div className="tt"><div className="ti">🤖</div><div className="tn">AI Тооцоолол</div></div>
                <div className="td">Нарны системийн тооцоогоо хий · {Math.floor(user?.points || 0/COST)}+ асуулт</div>
                <div className="tf"><span className="tpts">30 оноо/асуулт</span><button className="btn btn-p btn-sm">Нээх →</button></div>
              </div>
            </div>
            <hr className="divider"/>
            <div className="ref-box">
              <h3>НАЙЗ УРИХ</h3>
              <p>Найз тань таны кодоор бүртгүүлэхэд хоёулдаа +25 оноо авна</p>
              <div className="rrow"><div className="rcode">{user?.ref_code}</div><button className="cbtn" onClick={copyRef}>{copied?"✓ Хуулагдлаа":"📋 Хуулах"}</button></div>
            </div>
            {history.length > 0 && (<>
              <hr className="divider"/>
              <div className="stitle">ОНОOНЫ ТҮҮХ</div>
              <div className="hist">
                {history.slice(0,8).map((h,i)=>(
                  <div className="hr2" key={i}>
                    <span style={{color:"var(--muted)"}}>{h.desc}</span>
                    <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                      <span style={{fontSize:".72rem",color:"var(--hint)"}}>{h.t}</span>
                      <span className={`hp ${h.pts<0?"neg":""}`}>{h.pts>0?"+":""}{h.pts}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>)}

            {/* ACCOUNT SECTION */}
            <hr className="divider"/>
            <div style={{background:"rgba(255,255,255,.03)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"1.25rem"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
                <div>
                  <div style={{fontSize:".7rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:"4px"}}>Бүртгэлтэй хэрэглэгч</div>
                  <div style={{fontWeight:"600",fontSize:".95rem"}}>{user?.name}</div>
                  <div style={{fontSize:".8rem",color:"var(--muted)",marginTop:"2px"}}>{user?.email}</div>
                </div>
                <div style={{display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap"}}>
                  <div style={{background:"rgba(74,222,128,.08)",border:"1px solid rgba(74,222,128,.2)",borderRadius:"var(--radius)",padding:"8px 14px",textAlign:"center"}}>
                    <div style={{fontFamily:"var(--fhead)",fontSize:"1.4rem",color:"var(--green3)",letterSpacing:".04em",lineHeight:"1"}}>{user?.points || 0}</div>
                    <div style={{fontSize:".65rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",marginTop:"2px"}}>Нийт оноо</div>
                  </div>
                  <button
                    className="btn btn-sm"
                    style={{background:"rgba(248,113,113,.1)",color:"#f87171",border:"1px solid rgba(248,113,113,.3)",borderRadius:"var(--radius)"}}
                    onClick={async () => {
                      await db.auth.signOut();
                      setUser(null);
                      setHistory([]);
                      setPage("landing");
                      showToast("Амжилттай гарлаа.");
                    }}
                  >
                    ↩ Системээс гарах
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AD MODAL */}
        {adModal && (
          <div className="modal-bg">
            <div className="modal">
              <h3>СУРТАЛЧИЛГАА ҮЗЭХ</h3>
              <p>30 секунд үзсэний дараа +10 оноо нэмэгдэнэ</p>
              <div className="ad-box">
                <div style={{fontSize:".68rem",textTransform:"uppercase",letterSpacing:".08em",color:"var(--hint)"}}>· {Math.round(30-adProg*.3)}с үлдлээ ·</div>
                <div style={{fontSize:"3rem"}}>☀</div>
                <div style={{fontSize:".75rem",color:"var(--muted)"}}>Дорноговь Нарны Парк · 2025</div>
              </div>
              <div className="progb"><div className="pf" style={{width:`${adProg}%`}}/></div>
              <div style={{fontSize:".78rem",color:"var(--muted)",textAlign:"center",marginTop:".5rem"}}>{adRunning?"Үзэж байна...":"Дууслаа!"}</div>
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
