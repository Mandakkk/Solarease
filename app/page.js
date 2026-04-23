"use client";
import { useState, useEffect } from "react";

/* ── helpers ── */
const genCode = n => "SE-" + (n||"X").slice(0,3).toUpperCase() + Math.random().toString(36).slice(2,6).toUpperCase();

const LS = {
  get:     k  => { try { const s=localStorage.getItem(k); return s?JSON.parse(s):null; } catch{return null;} },
  set:     (k,v)=>{ try { if(v!==null&&v!==undefined) localStorage.setItem(k,JSON.stringify(v)); else localStorage.removeItem(k); } catch{} },
  getUsers:()  => { try { const s=localStorage.getItem("se_users"); return s?JSON.parse(s):{}; } catch{return{};} },
  setUsers:(u) => { try { localStorage.setItem("se_users",JSON.stringify(u)); } catch{} },
};

async function askClaude(messages) {
  try {
    const res = await fetch("/api/chat", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({messages}),
    });
    const d = await res.json();
    if (d.error) return "Алдаа: " + d.error;
    return d.text || "Хариу ирсэнгүй.";
  } catch(e) { return "Холболтын алдаа: " + e.message; }
}

/* ── PROJECTS ── */
const PROJECTS = [
  { id:1, title:"Сайншанд — 100 айлын нарны дээвэр", location:"Сайншанд, Дорноговь", capacity:"500 кВт", households:100,
    img:"https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&q=80",
    ret:"15%", term:"5 жил", minInvest:"1,000,000₮", raised:73, raisedAmt:"788,400,000₮",
    targetAmt:"1,080,000,000₮", investors:42, status:"open", co2:"150,391", jobs:75, lcoe:"54₮/кВт.ц", riskLevel:2,
    desc:"Сайншанд хотын 100 айл өрхийг нарны цахилгаанаар хангах эргэлтийн санхүүгийн механизм. Карбон механизмын 20% хөнгөлөлт болон Хаан Банкны ногоон зээлтэй хослуулсан бүтэц. Жилийн 15%-ийн өгөөжийг хадгалалтын дансны хүүтэй харьцуулахад 3 дахин өндөр байна.",
    updates:[{date:"2025-04",title:"Угсралт эхэллээ",body:"Rentech Engineering компани 20 айлын суурилуулалтыг эхлүүлсэн."},{date:"2025-03",title:"Карбон гэрээ",body:"JCM карбон механизмын урьдчилсан гэрээ байгуулагдлаа."},{date:"2025-02",title:"Хаан Банктай гэрээ",body:"Ногоон зээлийн санхүүжилтийн гэрээнд гарын үсэг зурлаа."}] },
  { id:2, title:"Замын-Үүд Нарны Станц", location:"Замын-Үүд, Дорноговь", capacity:"250 кВт", households:50,
    img:"https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&q=80",
    ret:"13%", term:"7 жил", minInvest:"500,000₮", raised:45, raisedAmt:"243,000,000₮",
    targetAmt:"540,000,000₮", investors:28, status:"open", co2:"75,195", jobs:38, lcoe:"54₮/кВт.ц", riskLevel:2,
    desc:"Замын-Үүд хотын худалдааны бүсэд байрлах 50 айл өрхийг нарны цахилгаанаар хангах.",
    updates:[{date:"2025-04",title:"Судалгаа дууслаа",body:"Техникийн болон эдийн засгийн үндэслэл бэлтгэгдлээ."}] },
  { id:3, title:"Дэлгэрэх Нарны Тариалан", location:"Дэлгэрэх сум, Дорноговь", capacity:"1 МВт", households:200,
    img:"https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&q=80",
    ret:"18%", term:"10 жил", minInvest:"2,000,000₮", raised:100, raisedAmt:"2,160,000,000₮",
    targetAmt:"2,160,000,000₮", investors:87, status:"full", co2:"300,782", jobs:150, lcoe:"50₮/кВт.ц", riskLevel:1,
    desc:"Дорноговь аймгийн хамгийн том нарны цахилгаан станц. Бүрэн санхүүжигдсэн.",
    updates:[{date:"2025-01",title:"Бүрэн санхүүжигдлаа",body:"87 хөрөнгө оруулагчийн дэмжлэгтэйгээр зорилтот дүнд хүрлээ."}] },
  { id:4, title:"Сайншанд Бизнес Парк", location:"Сайншанд, Дорноговь", capacity:"750 кВт", households:0,
    img:"https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&q=80",
    ret:"20%", term:"8 жил", minInvest:"5,000,000₮", raised:0, raisedAmt:"0₮",
    targetAmt:"1,620,000,000₮", investors:0, status:"soon", co2:"225,587", jobs:112, lcoe:"52₮/кВт.ц", riskLevel:3,
    desc:"ААН-үүдэд зориулсан томоохон нарны цахилгаан станц. 2025 оны 3-р улиралд нээлт хийнэ.",
    updates:[] },
];

const COST = 30;

/* ══════════════════════════════════════════════════════════ */
/*  STYLES                                                    */
/* ══════════════════════════════════════════════════════════ */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --green:#1a5c3a;--green2:#2d8653;--green3:#4ade80;--green-light:rgba(74,222,128,.1);
  --gold:#f59e0b;--bg:#0a0f0d;--surface:rgba(255,255,255,.05);
  --border:rgba(255,255,255,.12);--text:#fff;--muted:rgba(255,255,255,.6);--hint:rgba(255,255,255,.35);
  --radius:10px;--radius-lg:18px;
  --fhead:'Bebas Neue',sans-serif;--fbody:'DM Sans',sans-serif;
}
body{font-family:var(--fbody);background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden}
.app{min-height:100vh;display:flex;flex-direction:column}
.bg-wrap{position:fixed;inset:0;z-index:0;pointer-events:none}
.bg-img{width:100%;height:100%;object-fit:cover;opacity:.35}
.bg-ov{position:absolute;inset:0;background:linear-gradient(150deg,rgba(0,20,10,.85) 0%,rgba(0,0,0,.5) 60%,rgba(5,15,8,.9) 100%)}
/* NAV */
.nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:1rem 2rem;background:rgba(5,12,8,.85);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
.logo{font-family:var(--fhead);font-size:1.7rem;letter-spacing:.04em;cursor:pointer;line-height:1}
.logo .e{color:var(--green3)}
.logo-sub{font-size:.55rem;color:var(--hint);letter-spacing:.15em;text-transform:uppercase}
.nav-tabs{display:flex;gap:4px;background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:999px;padding:4px}
.nav-tab{padding:6px 16px;border-radius:999px;font-size:.8rem;font-weight:600;cursor:pointer;border:none;background:transparent;color:var(--muted);font-family:var(--fbody);transition:all .2s}
.nav-tab.active{background:var(--green2);color:#fff}
.nav-tab:hover:not(.active){color:#fff;background:rgba(255,255,255,.08)}
.pts-pill{background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.3);border-radius:999px;padding:5px 14px;font-size:.78rem;color:var(--gold);font-weight:600}
/* BUTTONS */
.btn{font-family:var(--fbody);font-size:.875rem;font-weight:600;padding:10px 22px;border-radius:999px;border:none;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.btn-p{background:var(--green2);color:#fff;border:2px solid var(--green3)}
.btn-p:hover{background:var(--green3);color:#050e08;transform:translateY(-1px)}
.btn-o{background:rgba(255,255,255,.07);color:#fff;border:2px solid rgba(255,255,255,.3)}
.btn-o:hover{background:rgba(255,255,255,.15);border-color:#fff}
.btn-g{background:transparent;color:var(--muted);border:1px solid var(--border)}
.btn-g:hover{color:#fff;background:rgba(255,255,255,.07)}
.btn-sm{padding:7px 16px;font-size:.78rem}
.btn-gold{background:var(--gold);color:#1a0e00;border:2px solid #fcd34d;font-weight:700}
.btn-gold:hover{background:#fcd34d;transform:translateY(-1px)}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important}
.btn-red{background:rgba(248,113,113,.12);color:#f87171;border:1px solid rgba(248,113,113,.3)}
/* LANDING */
.hero{min-height:calc(100vh - 64px);display:flex;align-items:center;padding:3rem 2rem;max-width:1200px;margin:0 auto;position:relative;z-index:10;width:100%}
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
/* CTA CARDS */
.cta-cards{display:flex;flex-direction:column;gap:1rem}
.cta-card{border-radius:var(--radius-lg);padding:1.75rem;cursor:pointer;border:1.5px solid var(--border);transition:all .25s}
.cta-card:hover{transform:translateY(-3px)}
.cta-card.calc{background:rgba(74,222,128,.06)}
.cta-card.calc:hover{border-color:rgba(74,222,128,.5)}
.cta-card.invest{background:rgba(245,158,11,.06)}
.cta-card.invest:hover{border-color:rgba(245,158,11,.5)}
.cta-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:.875rem}
.cta-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem}
.cta-icon.c{background:rgba(74,222,128,.15);border:1px solid rgba(74,222,128,.3)}
.cta-icon.i{background:rgba(245,158,11,.15);border:1px solid rgba(245,158,11,.3)}
.cta-badge{font-size:.68rem;font-weight:700;border-radius:999px;padding:3px 10px;letter-spacing:.05em;text-transform:uppercase}
.cta-badge.free{background:rgba(74,222,128,.15);color:var(--green3);border:1px solid rgba(74,222,128,.3)}
.cta-badge.login{background:rgba(255,255,255,.08);color:var(--muted);border:1px solid var(--border)}
.cta-card h3{font-family:var(--fhead);font-size:1.5rem;letter-spacing:.04em;margin-bottom:.35rem}
.cta-card p{font-size:.82rem;color:var(--muted);line-height:1.55;margin-bottom:1.25rem}
.cta-arrow{display:flex;align-items:center;gap:6px;font-size:.82rem;font-weight:600}
.cta-card.calc .cta-arrow{color:var(--green3)}
.cta-card.invest .cta-arrow{color:var(--gold)}
/* INVEST PAGE */
.page{position:relative;z-index:10;max-width:1200px;margin:0 auto;padding:2rem;width:100%}
.invest-hero{display:grid;grid-template-columns:1fr 360px;gap:2rem;margin-bottom:2.5rem;align-items:start}
@media(max-width:900px){.invest-hero{grid-template-columns:1fr}}
.project-img{width:100%;height:280px;object-fit:cover;border-radius:var(--radius-lg);border:1px solid var(--border)}
.project-title{font-family:var(--fhead);font-size:clamp(2rem,4vw,3rem);letter-spacing:.04em;margin-bottom:.5rem;line-height:1}
.project-loc{font-size:.82rem;color:var(--muted);margin-bottom:1.25rem}
.project-desc{font-size:.9rem;color:rgba(255,255,255,.75);line-height:1.7;margin-bottom:1.5rem}
.ptag{padding:4px 12px;border-radius:999px;font-size:.72rem;font-weight:600;border:1px solid var(--border);color:var(--muted);display:inline-block;margin-right:6px;margin-bottom:6px}
.ptag.green{background:rgba(74,222,128,.1);color:var(--green3);border-color:rgba(74,222,128,.3)}
.ptag.gold{background:rgba(245,158,11,.1);color:var(--gold);border-color:rgba(245,158,11,.3)}
.ptag.blue{background:rgba(59,130,246,.1);color:#60a5fa;border-color:rgba(59,130,246,.3)}
/* SIDEBAR */
.sidebar{background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5rem;position:sticky;top:80px}
.sb-title{font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:1rem;font-weight:600}
.metric-grid{display:grid;grid-template-columns:1fr 1fr;gap:.875rem;margin-bottom:1.25rem}
.metric{background:rgba(255,255,255,.04);border-radius:var(--radius);padding:.875rem}
.mv{font-family:var(--fhead);font-size:1.6rem;letter-spacing:.04em;line-height:1;color:#fff}
.mv.green{color:var(--green3)}.mv.gold{color:var(--gold)}
.ml{font-size:.68rem;color:var(--muted);margin-top:4px;text-transform:uppercase;letter-spacing:.06em}
.prog-wrap{margin-bottom:1.25rem}
.prog-label{display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:.5rem}
.prog-label span:first-child{font-weight:600;color:var(--green3)}
.prog-label span:last-child{color:var(--muted)}
.prog-bar{width:100%;height:8px;background:rgba(255,255,255,.1);border-radius:999px;overflow:hidden}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--green2),var(--green3));border-radius:999px}
.prog-stats{display:flex;justify-content:space-between;margin-top:.5rem;font-size:.72rem;color:var(--muted)}
.inv-input-lbl{font-size:.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:.4rem;font-weight:600}
.inv-input{width:100%;background:rgba(255,255,255,.07);border:1px solid var(--border);border-radius:var(--radius);padding:10px 14px;color:#fff;font-family:var(--fbody);font-size:1rem;font-weight:600;margin-bottom:1rem}
.inv-input:focus{outline:none;border-color:var(--green3)}
.inv-calc{background:rgba(74,222,128,.06);border:1px solid rgba(74,222,128,.2);border-radius:var(--radius);padding:.875rem;margin-bottom:1.25rem;font-size:.82rem}
.inv-calc-row{display:flex;justify-content:space-between;padding:3px 0}
.inv-calc-row span:last-child{font-weight:600;color:var(--green3)}
.inv-note{font-size:.72rem;color:var(--hint);text-align:center;margin-top:.75rem;line-height:1.5}
/* TABS */
.tabs{display:flex;border-bottom:1px solid var(--border);margin-bottom:2rem}
.tab-btn{padding:10px 20px;font-size:.85rem;font-weight:500;cursor:pointer;border:none;background:transparent;color:var(--muted);font-family:var(--fbody);border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .15s}
.tab-btn.active{color:var(--green3);border-bottom-color:var(--green3)}
/* PROJECT LIST */
.project-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.25rem;margin-top:1.5rem}
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
.pstatus{display:inline-block;padding:2px 10px;border-radius:999px;font-size:.68rem;font-weight:600;margin-bottom:.875rem}
.status-open{background:rgba(74,222,128,.12);color:var(--green3);border:1px solid rgba(74,222,128,.3)}
.status-full{background:rgba(255,255,255,.06);color:var(--muted);border:1px solid var(--border)}
.status-soon{background:rgba(245,158,11,.1);color:var(--gold);border:1px solid rgba(245,158,11,.3)}
/* AUTH */
.auth-page{position:relative;z-index:10;flex:1;display:flex;align-items:center;justify-content:center;padding:2rem;min-height:calc(100vh - 64px)}
.auth-card{background:rgba(5,15,8,.92);border:1px solid var(--border);border-radius:var(--radius-lg);padding:2rem;width:100%;max-width:400px;backdrop-filter:blur(20px)}
.auth-card h2{font-family:var(--fhead);font-size:2rem;letter-spacing:.04em;margin-bottom:.3rem}
.auth-sub{color:var(--muted);font-size:.85rem;margin-bottom:1.75rem}
.field{margin-bottom:1rem}
.field label{display:block;font-size:.7rem;font-weight:600;color:var(--muted);margin-bottom:5px;text-transform:uppercase;letter-spacing:.08em}
.field input{width:100%;background:rgba(255,255,255,.07);border:1px solid var(--border);border-radius:var(--radius);padding:10px 14px;color:#fff;font-family:var(--fbody);font-size:.875rem;transition:border-color .15s}
.field input::placeholder{color:var(--hint)}
.field input:focus{outline:none;border-color:var(--green3);box-shadow:0 0 0 3px rgba(74,222,128,.08)}
.bonus-note{background:rgba(74,222,128,.07);border:1px solid rgba(74,222,128,.22);border-radius:var(--radius);padding:9px 13px;font-size:.8rem;color:var(--green3);margin-bottom:1.25rem}
.auth-switch{text-align:center;margin-top:1.25rem;font-size:.82rem;color:var(--muted)}
.auth-switch button{background:none;border:none;color:var(--green3);cursor:pointer;font-size:inherit;font-family:inherit;font-weight:600;text-decoration:underline}
/* DASHBOARD */
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
/* CALC */
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
/* MODAL */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(6px)}
.modal{background:rgba(5,15,8,.95);border:1px solid var(--border);border-radius:var(--radius-lg);padding:2rem;max-width:400px;width:90%}
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
.detail-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:2rem}
.detail-card{background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem}
.detail-card .dv{font-family:var(--fhead);font-size:1.4rem;letter-spacing:.04em;color:#fff;margin-bottom:3px}
.detail-card .dl{font-size:.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:.07em}
.update-item{display:flex;gap:1rem;padding:1rem 0;border-bottom:1px solid var(--border)}
.update-item:last-child{border-bottom:none}
.update-date{font-size:.72rem;color:var(--muted);min-width:80px;padding-top:3px}
.update-content h4{font-size:.9rem;font-weight:600;margin-bottom:.25rem}
.update-content p{font-size:.8rem;color:var(--muted);line-height:1.5}
`;

export default function SolarEase() {
  const [page, setPage]                   = useState("landing");
  const [authMode, setAuthMode]           = useState("register");
  const [authReturn, setAuthReturn]       = useState("calc");
  const [user, setUser]                   = useState(null);
  const [toast, setToast]                 = useState(null);
  const [history, setHistory]             = useState([]);
  const [adModal, setAdModal]             = useState(false);
  const [adProg, setAdProg]               = useState(0);
  const [adRunning, setAdRunning]         = useState(false);
  const [copied, setCopied]               = useState(false);
  const [vStep, setVStep]                 = useState(0);
  const [vPhone, setVPhone]               = useState("");
  const [vCode, setVCode]                 = useState("");
  const [name, setName]                   = useState("");
  const [email, setEmail]                 = useState("");
  const [pass, setPass]                   = useState("");
  const [authLoading, setAuthLoading]     = useState(false);
  // wizard state
  const [step, setStep]           = useState(1); // 1=type,2=space,3=details,4=report
  const [propType, setPropType]   = useState(""); // ger|apartment|house
  const [hasSpace, setHasSpace]   = useState(""); // yes|no|unknown
  const [area, setArea]           = useState("");
  const [heat, setHeat]           = useState("");
  const [monthly, setMonthly]     = useState("");
  const [report, setReport]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [chatQ, setChatQ]         = useState("");
  const [chatMsgs, setChatMsgs]   = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab]         = useState("overview");
  const [investAmt, setInvestAmt]         = useState("1000000");


  // Load from localStorage on mount
  useEffect(() => {
    const saved = LS.get("se_user");
    if (saved) { setUser(saved); setHistory(LS.get("se_hist") || []); setPage("invest"); }
  }, []);

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); } }, [toast]);


  const showToast = msg => setToast(msg);

  const saveUser = u => { LS.set("se_user", u); setUser(u); };
  const saveHistory = h => { LS.set("se_hist", h); setHistory(h); };

  const addPts = (n, desc) => {
    setUser(u => { const nu = { ...u, points: (u?.points||0)+n }; LS.set("se_user", nu); return nu; });
    setHistory(h => { const nh = [{ desc, pts:n, t:new Date().toLocaleTimeString() }, ...h]; LS.set("se_hist", nh); return nh; });
    showToast(`+${n} оноо нэмэгдлээ!`);
  };
  const usePts = (n, desc) => {
    setUser(u => { const nu = { ...u, points:(u?.points||0)-n }; LS.set("se_user", nu); return nu; });
    setHistory(h => { const nh = [{ desc, pts:-n, t:new Date().toLocaleTimeString() }, ...h]; LS.set("se_hist", nh); return nh; });
  };

  // ── AUTH ──────────────────────────────────────────────────
  const handleAuth = (e) => {
    e?.preventDefault();
    if (authLoading) return;
    setAuthLoading(true);
    try {
      const users   = LS.getUsers();
      const eKey    = email.trim().toLowerCase();
      if (authMode === "register") {
        if (!name.trim()) { showToast("Нэрээ оруулна уу."); return; }
        if (!eKey)         { showToast("Имэйл оруулна уу."); return; }
        if (pass.length < 6) { showToast("Нууц үг хамгийн багадаа 6 тэмдэгт байна."); return; }
        if (users[eKey]) { showToast("Энэ имэйл бүртгэлтэй байна. Нэвтэрнэ үү."); setAuthMode("login"); return; }
        const refCode = genCode(name);
        const newUser = { id:"u_"+Date.now(), name:name.trim(), email:eKey, password:pass, points:50, ref_code:refCode, verified:false, ad_count:0, invite_count:0 };
        users[eKey] = newUser;
        LS.setUsers(users);
        const { password:_, ...safe } = newUser;
        saveUser(safe);
        const h = [{ desc:"Бүртгэлийн урамшуулал", pts:50, t:new Date().toLocaleTimeString() }];
        saveHistory(h);
        showToast("Тавтай морил! +50 оноо!");
        setPage(authReturn);
      } else {
        if (!eKey) { showToast("Имэйл оруулна уу."); return; }
        if (!pass)  { showToast("Нууц үг оруулна уу."); return; }
        const found = users[eKey];
        if (!found)                { showToast("Бүртгэлгүй имэйл. Эхлээд бүртгүүлнэ үү."); return; }
        if (found.password !== pass) { showToast("Нууц үг буруу байна."); return; }
        const { password:_, ...safe } = found;
        saveUser(safe);
        saveHistory(LS.get("se_hist_" + found.id) || []);
        showToast("Нэвтэрлээ! Таны оноо: " + (safe.points || 0));
        setPage(authReturn);
      }
    } catch(err) {
      showToast("Алдаа: " + (err?.message || "Дахин оролдоно уу"));
    } finally {
      setAuthLoading(false);
    }
  };

  // ── AD ────────────────────────────────────────────────────
  function startAd() {
    if ((user?.ad_count||0) >= 5) return;
    setAdProg(0); setAdRunning(true); setAdModal(true);
    let p = 0;
    const iv = setInterval(() => {
      p += 100/30; setAdProg(Math.min(p,100));
      if (p >= 100) {
        clearInterval(iv); setAdRunning(false); setAdModal(false);
        setUser(u => { const nu={...u, ad_count:(u?.ad_count||0)+1}; LS.set("se_user",nu); return nu; });
        addPts(10, "Сурталчилгаа үзсэн");
      }
    }, 1000);
  }

  // ── VERIFY ────────────────────────────────────────────────
  const handleVerify = () => {
    if (vStep === 0) { setVStep(1); showToast("Код илгээлээ (demo)"); }
    else if (vStep === 1 && vCode.length >= 4) {
      setUser(u => { const nu={...u, verified:true}; LS.set("se_user",nu); return nu; });
      addPts(50, "Бүртгэл баталгаажуулсан"); setVStep(2);
    }
  };

  // ── REFERRAL ──────────────────────────────────────────────
  const copyRef = () => {
    navigator.clipboard?.writeText(user?.ref_code||"").catch(()=>{});
    setCopied(true); showToast("Код хуулагдлаа!");
    setTimeout(() => setCopied(false), 2000);
    if ((user?.invite_count||0) < 10) {
      setTimeout(() => {
        setUser(u => { const nu={...u, invite_count:(u?.invite_count||0)+1}; LS.set("se_user",nu); return nu; });
        addPts(25, "Найз нэгдсэн (demo)");
      }, 3000);
    }
  };

  // ── AI CALC ───────────────────────────────────────────────
  const canCalc = user && (parseInt(user?.points)||0) >= COST;

  const typeLabel = { ger:"Гэр", apartment:"Орон сууц", house:"Хашаа байшин" };

  async function generateReport() {
    if (!canCalc) { showToast(`${COST} оноо хэрэгтэй.`); return; }
    usePts(COST, "AI нарны тооцоолол");
    setLoading(true); setStep(4); setReport(null);
    const spaceLabel = propType==="ger" ? (hasSpace==="yes"?"газарт суурилуулах зай байна":"газарт суурилуулах зай хязгаарлагдмал") : (hasSpace==="yes"?"дээвэрт суурилуулах зай байна":"дээвэрт зай хязгаарлагдмал");
    const heatLabel = heat==="electric"?"цахилгаан":heat==="coal"?"нүүрс":"төвийн";
    const prompt = `SolarEase нарны тооцоолол. JSON форматаар хариул, өөр текст бүү нэм.

Өгөгдөл:
- Байрны төрөл: ${typeLabel[propType]||propType}
- Талбай: ${area}м²
- ${spaceLabel}
- Халаалт: ${heatLabel}
- Сарын цахилгааны зардал: ${parseInt(monthly).toLocaleString()}₮
- Байршил: Дорноговь аймаг (нарны цацраг 1980 kWh/kW/жил)
- 1kW суурилуулалт: 2,700,000₮
- Карбон механизм: 20% хямдрал
- Ногоон зээл: 3% хүү, 60 сар
- Экспортын тариф: 343₮/kWh

Дараах JSON бүтцээр хариул:
{
  "recommended_kw": number,
  "panel_count": number,
  "space_needed_m2": number,
  "installation_cost": number,
  "after_carbon": number,
  "monthly_loan": number,
  "annual_export_income": number,
  "annual_saving": number,
  "annual_total_income": number,
  "payback_years": number,
  "co2_reduction_tons": number,
  "coal_saving_tons": number,
  "summary": "2-3 өгүүлбэрт хэрэглэгчэд зориулсан тайлбар",
  "tips": ["зөвлөмж 1", "зөвлөмж 2", "зөвлөмж 3"]
}`;
    try {
      const raw = await askClaude([{ role:"user", content:prompt }]);
      const clean = raw.replace(/\`\`\`json|\`\`\`/g,"").trim();
      const data = JSON.parse(clean);
      setReport(data);
    } catch(e) {
      setReport({ error: "Тооцоолол амжилтгүй болов. Дахин оролдоно уу." });
    }
    setLoading(false);
  }

  async function sendChat(e) {
    e?.preventDefault();
    const txt = chatQ.trim();
    if (!txt||chatLoading) return;
    if (!canCalc) { showToast(`${COST} оноо хэрэгтэй.`); return; }
    usePts(COST, "AI асуулт");
    const um = { role:"user", content:txt };
    setChatMsgs(m=>[...m, um]); setChatQ(""); setChatLoading(true);
    try {
      const ctx = report ? `Контекст: ${typeLabel[propType]} ${area}м², ${parseInt(monthly).toLocaleString()}₮/сар. Тооцооны үр дүн: ${report.recommended_kw}kW систем, ${report.after_carbon?.toLocaleString()}₮ зардал, ${report.payback_years} жилд нөхөгдөнө.` : "";
      const reply = await askClaude([{ role:"user", content:ctx }, ...chatMsgs.slice(-4), um].filter(m=>m.content).map(m=>({role:m.role,content:m.content})));
      setChatMsgs(m=>[...m, { role:"assistant", content:reply }]);
    } catch { setChatMsgs(m=>[...m, { role:"assistant", content:"Холболт шалгана уу." }]); }
    setChatLoading(false);
  }

  function downloadReport() {
    if (!report||report.error) return;
    const t = typeLabel[propType]||propType;
    const html = `<!DOCTYPE html><html><head><meta charset='utf-8'><title>SolarEase Тайлан</title>
<style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;color:#1a1a1a;padding:20px}
h1{color:#2d8653;font-size:28px;margin-bottom:4px}
.sub{color:#666;margin-bottom:32px}
.grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin:24px 0}
.card{background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:16px;text-align:center}
.card .val{font-size:24px;font-weight:700;color:#16a34a;margin:4px 0}
.card .lbl{font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.05em}
.section{margin:32px 0}
.section h2{color:#2d8653;font-size:18px;border-bottom:2px solid #86efac;padding-bottom:8px;margin-bottom:16px}
.tip{background:#fefce8;border-left:4px solid #eab308;padding:10px 14px;margin:8px 0;border-radius:4px;font-size:14px}
.footer{margin-top:48px;padding-top:16px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:12px;text-align:center}
</style></head><body>
<h1>☀ SolarEase Нарны Тооцооны Тайлан</h1>
<div class='sub'>Байрны төрөл: ${t} · Талбай: ${area}м² · Халаалт: ${heat==="electric"?"Цахилгаан":heat==="coal"?"Нүүрс":"Төвийн"} · Сарын зардал: ${parseInt(monthly).toLocaleString()}₮</div>
<div class='section'><h2>Санал болгох систем</h2>
<div class='grid'>
<div class='card'><div class='lbl'>Системийн хэмжээ</div><div class='val'>${report.recommended_kw} kW</div></div>
<div class='card'><div class='lbl'>Панелийн тоо</div><div class='val'>${report.panel_count} ш</div></div>
<div class='card'><div class='lbl'>Шаардлагатай талбай</div><div class='val'>${report.space_needed_m2} м²</div></div>
</div></div>
<div class='section'><h2>Санхүүгийн тооцоо</h2>
<div class='grid'>
<div class='card'><div class='lbl'>Суурилуулалтын зардал</div><div class='val'>${(report.installation_cost/1000000).toFixed(1)}M₮</div></div>
<div class='card'><div class='lbl'>Карбон хөнгөлөлтийн дараа</div><div class='val'>${(report.after_carbon/1000000).toFixed(1)}M₮</div></div>
<div class='card'><div class='lbl'>Сарын зээлийн төлбөр</div><div class='val'>${Math.round(report.monthly_loan/1000)}K₮</div></div>
<div class='card'><div class='lbl'>Жилийн экспортын орлого</div><div class='val'>${(report.annual_export_income/1000000).toFixed(1)}M₮</div></div>
<div class='card'><div class='lbl'>Жилийн хэмнэлт</div><div class='val'>${(report.annual_saving/1000000).toFixed(1)}M₮</div></div>
<div class='card'><div class='lbl'>Хөрөнгө нөхөх хугацаа</div><div class='val'>${report.payback_years} жил</div></div>
</div></div>
<div class='section'><h2>Байгаль орчны ашиг</h2>
<div class='grid'>
<div class='card'><div class='lbl'>CO₂ бууралт/жил</div><div class='val'>${report.co2_reduction_tons} тн</div></div>
<div class='card'><div class='lbl'>Нүүрсний хэмнэлт/жил</div><div class='val'>${report.coal_saving_tons} тн</div></div>
</div></div>
<div class='section'><h2>Дүгнэлт</h2><p>${report.summary}</p>
<div style='margin-top:16px'>${(report.tips||[]).map(t=>`<div class='tip'>${t}</div>`).join("")}</div></div>
<div class='footer'>SolarEase Fintech Platform · solarease.mn · Дорноговь аймаг 2025</div>
</body></html>`;
    const blob = new Blob([html], {type:"text/html"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "solarease-report.html";
    a.click();
  }

  // ── INVEST calc ───────────────────────────────────────────
  const calcRet = () => {
    const amt = parseInt(investAmt)||0;
    const p   = selectedProject;
    if (!p||!amt) return { annual:0, total:0, yrs:0 };
    const r   = parseInt(p.ret)/100;
    const yrs = parseInt(p.term);
    return { annual: Math.round(amt*r), total: Math.round(amt+amt*r*yrs), yrs };
  };

  // ── NAV helpers ───────────────────────────────────────────
  const goCalc    = () => { if (!user) { setAuthReturn("calc"); setAuthMode("register"); setPage("auth"); } else setPage("calc"); };
  const goInvest  = () => { setPage("invest"); setSelectedProject(null); };
  const doLogout  = () => { LS.set("se_user",null); setUser(null); setHistory([]); setPage("landing"); showToast("Амжилттай гарлаа."); };

  /* ══════════════════════════════════════════════════════════ */
  /*  RENDER                                                    */
  /* ══════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{G}</style>
      <div className="app">
        {/* BG */}
        <div className="bg-wrap">
          <img className="bg-img" src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=1800&q=80" alt=""/>
          <div className="bg-ov"/>
        </div>

        {/* NAV */}
        <nav className="nav">
          <div onClick={()=>setPage("landing")} style={{cursor:"pointer"}}>
            <div className="logo">Solar<span className="e">Ease</span></div>
            <div className="logo-sub">fintech platform</div>
          </div>
          <div className="nav-tabs">
            <button className={`nav-tab ${page==="invest"?"active":""}`} onClick={goInvest}>Хөрөнгө оруулах</button>
            <button className={`nav-tab ${page==="calc"?"active":""}`} onClick={goCalc}>AI Тооцоолол</button>
          </div>
          <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
            {user ? (
              <>
                <div className="pts-pill">⚡ {user?.points||0} оноо</div>
                <div style={{fontSize:".78rem",color:"var(--muted)",maxWidth:"90px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name}</div>
                <button className="btn btn-g btn-sm" onClick={()=>setPage("dash")}>Хяналт</button>
                <button className="btn btn-sm btn-red" onClick={doLogout}>↩ Гарах</button>
              </>
            ) : (
              <>
                <button className="btn btn-g btn-sm" onClick={()=>{ setAuthReturn("invest"); setAuthMode("login"); setPage("auth"); }}>Нэвтрэх</button>
                <button className="btn btn-p btn-sm" onClick={()=>{ setAuthReturn("invest"); setAuthMode("register"); setPage("auth"); }}>Бүртгүүлэх</button>
              </>
            )}
          </div>
        </nav>

        {/* ── LANDING ── */}
        {page==="landing" && (
          <div className="hero">
            <div className="hero-in">
              <div>
                <div className="hero-tag">☀ Дорноговь аймаг · 2025</div>
                <h1 className="h1">INVEST IN<br/><span className="g">SOLAR.</span><br/><span className="go">EARN IT.</span></h1>
                <p className="hero-sub">Дорноговь аймгийн нарны цахилгааны хөрөнгө оруулалтын платформ. AI туслахаар тооцоол, хөрөнгө оруул, орлого ол.</p>
                <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
                  <div className="cta-card calc" style={{flex:"1",minWidth:"220px"}} onClick={goCalc}>
                    <div className="cta-card-top"><div className="cta-icon c">🤖</div><span className="cta-badge login">Бүртгэл шаардлагатай</span></div>
                    <h3>AI Тооцоолол</h3>
                    <p>Гэрийнхээ мэдээллийг оруулаад нарны системийн санхүүгийн тооцоог AI туслахаар хий.</p>
                    <div className="cta-arrow">Тооцоолох →</div>
                  </div>
                  <div className="cta-card invest" style={{flex:"1",minWidth:"220px"}} onClick={goInvest}>
                    <div className="cta-card-top"><div className="cta-icon i">💰</div><span className="cta-badge free">Үнэгүй үзэх</span></div>
                    <h3>Хөрөнгө Оруулах</h3>
                    <p>Дорноговийн нарны энергийн төслүүдэд хөрөнгө оруулж жилд 13–20% өгөөж ол.</p>
                    <div className="cta-arrow" style={{color:"var(--gold)"}}>Төслүүд үзэх →</div>
                  </div>
                </div>
                <div className="hero-stats">
                  {[["15%+","жилийн өгөөж"],["343₮","kWh тариф"],["20%","карбон хөнгөлөлт"],["75+","ажлын байр"]].map(([v,l])=>(
                    <div key={l}><div className="hv">{v}</div><div className="hl">{l}</div></div>
                  ))}
                </div>
              </div>
              {/* Featured card */}
              <div style={{background:"rgba(0,0,0,.5)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",overflow:"hidden",backdropFilter:"blur(12px)"}}>
                <img src={PROJECTS[0].img} style={{width:"100%",height:"200px",objectFit:"cover",opacity:.8}} alt="solar"/>
                <div style={{padding:"1.5rem"}}>
                  <div style={{fontSize:".68rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".4rem"}}>Онцлох төсөл</div>
                  <div style={{fontFamily:"var(--fhead)",fontSize:"1.1rem",letterSpacing:".04em",marginBottom:"1rem"}}>Smart Sainshand</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:".5rem",marginBottom:"1rem"}}>
                    {[["15%","Жилийн өгөөж"],["5 жил","Хугацаа"],["1M₮","Мин."]].map(([v,l])=>(
                      <div key={l} style={{background:"rgba(255,255,255,.05)",borderRadius:"8px",padding:".625rem",textAlign:"center"}}>
                        <div style={{fontFamily:"var(--fhead)",fontSize:"1.1rem",color:"var(--green3)"}}>{v}</div>
                        <div style={{fontSize:".65rem",color:"var(--muted)",marginTop:"2px"}}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:".5rem"}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:".75rem",marginBottom:".4rem"}}>
                      <span style={{color:"var(--green3)",fontWeight:"600"}}>73% санхүүжигдсэн</span>
                      <span style={{color:"var(--muted)"}}>42 хөрөнгө оруулагч</span>
                    </div>
                    <div className="prog-bar"><div className="prog-fill" style={{width:"73%"}}/></div>
                  </div>
                  <button className="btn btn-gold" style={{width:"100%",justifyContent:"center",marginTop:".875rem"}} onClick={goInvest}>Хөрөнгө оруулах →</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── INVEST LIST ── */}
        {page==="invest" && !selectedProject && (
          <div className="page">
            <div style={{marginBottom:"2rem"}}>
              <div style={{fontSize:".7rem",color:"var(--green3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".4rem",fontWeight:"600"}}>Нарны энергийн хөрөнгө оруулалт</div>
              <h1 style={{fontFamily:"var(--fhead)",fontSize:"clamp(2rem,4vw,3rem)",letterSpacing:".04em",marginBottom:".5rem"}}>ДОРНОГОВИЙН НАРНЫ ТӨСЛҮҮД</h1>
              <p style={{fontSize:".9rem",color:"var(--muted)",maxWidth:"560px"}}>Баталгаажсан нарны цахилгааны төслүүдэд хөрөнгө оруулж, жилийн 13–20% өгөөж ол.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:".875rem",marginBottom:"2rem",background:"rgba(255,255,255,.03)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"1.25rem"}}>
              {[["4","Нийт төсөл"],["157","Хөрөнгө оруулагч"],["13–20%","Жилийн өгөөж"],["1M₮","Хамгийн бага"]].map(([v,l])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontFamily:"var(--fhead)",fontSize:"1.6rem",color:"var(--green3)",letterSpacing:".04em"}}>{v}</div>
                  <div style={{fontSize:".68rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",marginTop:"2px"}}>{l}</div>
                </div>
              ))}
            </div>
            <div className="project-list">
              {PROJECTS.map(p=>(
                <div className="pcard" key={p.id} onClick={()=>{ setSelectedProject(p); setActiveTab("overview"); }}>
                  <div>
                    <img className="pcard-img" src={p.img} alt={p.title}/>
                    <div style={{position:"absolute",top:"12px",left:"12px"}}>
                      <span className={`pstatus ${p.status==="open"?"status-open":p.status==="full"?"status-full":"status-soon"}`}>
                        {p.status==="open"?"● Нээлттэй":p.status==="full"?"Дүүрсэн":"Удахгүй"}
                      </span>
                    </div>
                  </div>
                  <div className="pcard-body">
                    <div className="pcard-loc">📍 {p.location}</div>
                    <div className="pcard-title">{p.title}</div>
                    <div className="pcard-metrics">
                      <div className="pm"><div className="pv">{p.ret}</div><div className="pl">Өгөөж/жил</div></div>
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
        {page==="invest" && selectedProject && (()=>{
          const p=selectedProject; const ret=calcRet();
          return (
            <div className="page">
              <button className="btn btn-g btn-sm" style={{marginBottom:"1.5rem"}} onClick={()=>setSelectedProject(null)}>← Буцах</button>
              <div className="invest-hero">
                <div>
                  <div style={{marginBottom:"1rem"}}>
                    <span className={`pstatus ${p.status==="open"?"status-open":p.status==="full"?"status-full":"status-soon"}`}>
                      {p.status==="open"?"● Нээлттэй":p.status==="full"?"Дүүрсэн":"Удахгүй"}
                    </span>
                    <span className="ptag green">Нарны цахилгаан</span>
                    <span className="ptag blue">{p.capacity}</span>
                  </div>
                  <h1 className="project-title">{p.title}</h1>
                  <div className="project-loc">📍 {p.location}</div>
                  <img className="project-img" src={p.img} alt={p.title}/>
                </div>
                <div className="sidebar">
                  <div className="sb-title">Хөрөнгө оруулалтын нөхцөл</div>
                  <div className="metric-grid">
                    <div className="metric"><div className="mv green">{p.ret}</div><div className="ml">Жилийн өгөөж</div></div>
                    <div className="metric"><div className="mv">{p.term}</div><div className="ml">Хугацаа</div></div>
                    <div className="metric"><div className="mv gold">{p.minInvest}</div><div className="ml">Хамгийн бага</div></div>
                    <div className="metric"><div className="mv">{p.investors}</div><div className="ml">Хөрөнгө оруулагч</div></div>
                  </div>
                  <div className="prog-wrap">
                    <div className="prog-label"><span>{p.raised}% санхүүжигдсэн</span><span>{p.raisedAmt}</span></div>
                    <div className="prog-bar"><div className="prog-fill" style={{width:`${p.raised}%`}}/></div>
                    <div className="prog-stats"><span>Зорилт: {p.targetAmt}</span><span>{p.investors} хөрөнгө оруулагч</span></div>
                  </div>
                  {p.status!=="full" && (<>
                    <div className="inv-input-lbl">Хөрөнгө оруулах дүн (₮)</div>
                    <input className="inv-input" value={investAmt} onChange={e=>setInvestAmt(e.target.value.replace(/[^0-9]/g,""))} placeholder="1000000"/>
                    <div className="inv-calc">
                      <div style={{fontSize:".72rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:".5rem",fontWeight:"600"}}>Тооцоолол</div>
                      <div className="inv-calc-row"><span>Жилийн өгөөж</span><span>{ret.annual.toLocaleString()}₮</span></div>
                      <div className="inv-calc-row"><span>Нийт хүлээн авна ({ret.yrs}жил)</span><span>{ret.total.toLocaleString()}₮</span></div>
                    </div>
                    <button className="btn btn-gold" style={{width:"100%",justifyContent:"center"}}
                      onClick={()=>{ if(!user){setAuthReturn("invest");setAuthMode("register");setPage("auth");}else showToast("Хүсэлт илгээгдлээ! (Demo)"); }}>
                      {user?"Хөрөнгө оруулах →":"Бүртгүүлж хөрөнгө оруулах →"}
                    </button>
                    <div className="inv-note">Хөрөнгө оруулахад бүртгэл шаардлагатай. Харах нь үнэгүй.</div>
                  </>)}
                  {p.status==="full" && <div style={{background:"rgba(255,255,255,.05)",borderRadius:"var(--radius)",padding:"1rem",textAlign:"center",fontSize:".85rem",color:"var(--muted)"}}>Энэ төсөл бүрэн санхүүжигдсэн.</div>}
                </div>
              </div>
              <div className="tabs">
                {[["overview","Тойм"],["details","Дэлгэрэнгүй"],["updates","Мэдээлэл"]].map(([k,v])=>(
                  <button key={k} className={`tab-btn ${activeTab===k?"active":""}`} onClick={()=>setActiveTab(k)}>{v}</button>
                ))}
              </div>
              {activeTab==="overview" && (<>
                <p className="project-desc">{p.desc}</p>
                <div className="detail-grid">
                  {[{v:p.capacity,l:"Хүчин чадал"},{v:p.co2+" тонн",l:"CO₂ бууралт/жил"},{v:p.jobs+"+",l:"Ажлын байр"},{v:p.lcoe,l:"Нэгж өртөг"}].map(d=>(
                    <div className="detail-card" key={d.l}><div className="dv">{d.v}</div><div className="dl">{d.l}</div></div>
                  ))}
                </div>
              </>)}
              {activeTab==="details" && (
                <div className="detail-grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))"}}>
                  {[{v:p.capacity,l:"Нийт хүчин чадал"},{v:p.households>0?p.households+" айл":"ААН",l:"Хамрах хүрээ"},{v:p.ret,l:"Жилийн өгөөж"},{v:p.term,l:"Хугацаа"},{v:p.minInvest,l:"Хамгийн бага хөрөнгө"},{v:p.targetAmt,l:"Зорилтот дүн"},{v:p.raisedAmt,l:"Одоогийн санхүүжилт"},{v:p.co2+" тонн",l:"CO₂ бууралт/жил"},{v:p.jobs+"+",l:"Ажлын байр"},{v:p.lcoe,l:"LCOE нэгж өртөг"}].map(d=>(
                    <div className="detail-card" key={d.l}><div className="dv" style={{fontSize:"1.1rem"}}>{d.v}</div><div className="dl">{d.l}</div></div>
                  ))}
                </div>
              )}
              {activeTab==="updates" && (
                <div>
                  {p.updates.length===0 && <p style={{color:"var(--muted)",fontSize:".9rem"}}>Одоогоор мэдээлэл байхгүй.</p>}
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
        {page==="auth" && (
          <div className="auth-page">
            <div className="auth-card">
              <h2>{authMode==="register"?"БҮРТГЭЛ ҮҮСГЭХ":"НЭВТРЭХ"}</h2>
              <p className="auth-sub">{authMode==="register"?"Бүртгүүлж тооцоолол болон хөрөнгө оруулалтад нэвтэр":"Имэйл болон нууц үгээрээ нэвтэрнэ үү"}</p>
              {authMode==="register" && <div className="bonus-note">🎁 Бүртгүүлснийхээ шагнал 50 оноо автоматаар нэмэгдэнэ</div>}
              <form onSubmit={handleAuth}>
                {authMode==="register" && (
                  <div className="field"><label>Нэр</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Таны нэр"/></div>
                )}
                <div className="field"><label>Имэйл</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="example@gmail.com"/></div>
                <div className="field"><label>Нууц үг</label><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"/></div>
                <button className="btn btn-p" style={{width:"100%",justifyContent:"center",marginTop:".25rem",opacity:authLoading?.6:1}} type="submit" disabled={authLoading}
                  onClick={(e)=>{e.preventDefault();handleAuth(e);}}>
                  {authLoading?"Түр хүлээнэ үү...":authMode==="register"?"БҮРТГҮҮЛЭХ":"НЭВТРЭХ"}
                </button>
              </form>
              <div className="auth-switch">
                {authMode==="register"?<>Бүртгэлтэй юу? <button onClick={()=>setAuthMode("login")}>Нэвтрэх</button></>:<>Бүртгэлгүй юу? <button onClick={()=>setAuthMode("register")}>Бүртгүүлэх</button></>}
              </div>
            </div>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {page==="dash" && user && (
          <div className="dash-page">
            <div className="dh">
              <div>
                <div style={{fontSize:".7rem",color:"var(--muted)",marginBottom:"3px",textTransform:"uppercase",letterSpacing:".08em"}}>Тавтай морил</div>
                <div className="dhello">САЙН БАЙНА УУ, <em>{(user?.name||"").toUpperCase()}</em></div>
              </div>
              <div className="pd"><div className="pb2">{user?.points||0}</div><div className="pl">Нийт оноо</div></div>
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
                {!user?.verified && vStep<2 && <input className="vi" value={vStep===0?vPhone:vCode} onChange={e=>vStep===0?setVPhone(e.target.value):setVCode(e.target.value)} placeholder={vStep===0?"Утасны дугаар":"4 оронтой код"}/>}
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
                <div className="td">Нарны системийн тооцоогоо хий · {Math.floor((user?.points||0)/COST)}+ асуулт</div>
                <div className="tf"><span className="tpts">30 оноо/асуулт</span><button className="btn btn-p btn-sm">Нээх →</button></div>
              </div>
            </div>
            <hr className="divider"/>
            <div className="ref-box">
              <h3>НАЙЗ УРИХ</h3>
              <p>Найз тань таны кодоор бүртгүүлэхэд хоёулдаа +25 оноо авна</p>
              <div className="rrow"><div className="rcode">{user?.ref_code}</div><button className="cbtn" onClick={copyRef}>{copied?"✓ Хуулагдлаа":"📋 Хуулах"}</button></div>
            </div>
            {history.length>0 && (<>
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
            <hr className="divider"/>
            <div style={{background:"rgba(255,255,255,.03)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"1.25rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
              <div>
                <div style={{fontSize:".7rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:"4px"}}>Бүртгэлтэй хэрэглэгч</div>
                <div style={{fontWeight:"600",fontSize:".95rem"}}>{user?.name}</div>
                <div style={{fontSize:".8rem",color:"var(--muted)",marginTop:"2px"}}>{user?.email}</div>
              </div>
              <button className="btn btn-sm btn-red" onClick={doLogout}>↩ Системээс гарах</button>
            </div>
          </div>
        )}

        {/* ── CALC ── */}
        {page==="calc" && user && (
          <div className="calc-page">
            <div style={{marginBottom:"1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
              <div>
                <div className="stitle">☀ AI НАРНЫ ТООЦООЛОЛ</div>
                <p style={{fontSize:".85rem",color:"var(--muted)"}}>
                  Тооцооны үнэ: <strong style={{color:"var(--gold)"}}>{COST} оноо</strong> · Үлдэгдэл: <strong style={{color:"var(--gold)"}}>{user?.points||0} оноо</strong>
                  {" · "}<button className="btn btn-g btn-sm" onClick={()=>setPage("dash")}>Оноо нэмэх</button>
                </p>
              </div>
              {step>1 && <button className="btn btn-g btn-sm" onClick={()=>{ setStep(1); setPropType(""); setHasSpace(""); setArea(""); setHeat(""); setMonthly(""); setReport(null); setChatMsgs([]); }}>↩ Шинэ тооцоо</button>}
            </div>

            {/* STEP INDICATOR */}
            <div style={{display:"flex",gap:"8px",marginBottom:"2rem",alignItems:"center"}}>
              {[["1","Байрны төрөл"],["2","Суурилуулалтын зай"],["3","Дэлгэрэнгүй"],["4","Тайлан"]].map(([n,l],i)=>(
                <div key={n} style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px"}}>
                    <div style={{width:"28px",height:"28px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".75rem",fontWeight:"700",background:step>=parseInt(n)?"var(--green2)":"rgba(255,255,255,.08)",color:step>=parseInt(n)?"#fff":"var(--muted)",border:step===parseInt(n)?"2px solid var(--green3)":"2px solid transparent",transition:"all .2s"}}>{parseInt(n)<step?"✓":n}</div>
                    <span style={{fontSize:".65rem",color:step>=parseInt(n)?"var(--green3)":"var(--hint)",whiteSpace:"nowrap"}}>{l}</span>
                  </div>
                  {i<3 && <div style={{flex:1,height:"2px",background:step>parseInt(n)?"var(--green2)":"rgba(255,255,255,.1)",minWidth:"20px",marginBottom:"14px",transition:"all .2s"}}/>}
                </div>
              ))}
            </div>

            {/* STEP 1: Property Type */}
            {step===1 && (
              <div style={{maxWidth:"600px",margin:"0 auto"}}>
                <h2 style={{fontFamily:"var(--fhead)",fontSize:"1.8rem",letterSpacing:".04em",marginBottom:".5rem"}}>БАЙРНЫ ТӨРЛӨӨ СОНГОНО УУ</h2>
                <p style={{color:"var(--muted)",fontSize:".9rem",marginBottom:"2rem"}}>Байрны төрлөөс хамааран суурилуулалтын арга, системийн хэмжээ тодорхойлогдоно.</p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1rem"}}>
                  {[
                    {k:"ger",icon:"🏠",title:"Гэр",desc:"Монгол гэр буюу хашааны гэр"},
                    {k:"apartment",icon:"🏢",title:"Орон сууц",desc:"Олон давхар байрны нэг тохой"},
                    {k:"house",icon:"🏡",title:"Хашаа байшин",desc:"Хувийн хашаатай байшин"},
                  ].map(t=>(
                    <div key={t.k} onClick={()=>{ setPropType(t.k); setStep(2); }} style={{background:propType===t.k?"rgba(74,222,128,.12)":"rgba(255,255,255,.04)",border:propType===t.k?"2px solid var(--green3)":"2px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"1.5rem",cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
                      <div style={{fontSize:"2.5rem",marginBottom:".75rem"}}>{t.icon}</div>
                      <div style={{fontFamily:"var(--fhead)",fontSize:"1.2rem",letterSpacing:".04em",marginBottom:".35rem"}}>{t.title}</div>
                      <div style={{fontSize:".78rem",color:"var(--muted)"}}>{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Space */}
            {step===2 && (
              <div style={{maxWidth:"600px",margin:"0 auto"}}>
                <h2 style={{fontFamily:"var(--fhead)",fontSize:"1.8rem",letterSpacing:".04em",marginBottom:".5rem"}}>
                  {propType==="ger" ? "ГАЗАРТ СУУРИЛУУЛАХ ЗАЙ" : "ДЭЭВЭРТ СУУРИЛУУЛАХ ЗАЙ"}
                </h2>
                <p style={{color:"var(--muted)",fontSize:".9rem",marginBottom:"2rem"}}>
                  {propType==="ger"
                    ? "Гэрийн эргэн тойронд нарны панел суурилуулах газрын зай байна уу? (10kW системд ойролцоогоор 55м² шаардлагатай)"
                    : propType==="apartment"
                    ? "Байрны дээвэрт хамтарч нарны панел суурилуулах боломж байна уу? (Нэг тохойд 3-5kW буюу 16-28м² дээвэрт хэрэгтэй)"
                    : "Хашааны байшингийн дээвэрт нарны панел суурилуулах зай байна уу? (10kW системд 55м² дээвэр хэрэгтэй)"}
                </p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1.5rem"}}>
                  {[
                    {k:"yes",icon:"✅",title:"Тийм, зай хангалттай",color:"var(--green3)"},
                    {k:"limited",icon:"⚠️",title:"Хязгаарлагдмал зайтай",color:"var(--gold)"},
                  ].map(o=>(
                    <div key={o.k} onClick={()=>setHasSpace(o.k)} style={{background:hasSpace===o.k?"rgba(74,222,128,.1)":"rgba(255,255,255,.04)",border:hasSpace===o.k?"2px solid var(--green3)":"2px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"1.25rem",cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
                      <div style={{fontSize:"1.75rem",marginBottom:".5rem"}}>{o.icon}</div>
                      <div style={{fontSize:".9rem",fontWeight:"600",color:o.color}}>{o.title}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}>
                  <button className="btn btn-g" onClick={()=>setStep(1)}>← Буцах</button>
                  <button className="btn btn-p" onClick={()=>hasSpace&&setStep(3)} disabled={!hasSpace}>Үргэлжлүүлэх →</button>
                </div>
              </div>
            )}

            {/* STEP 3: Details */}
            {step===3 && (
              <div style={{maxWidth:"600px",margin:"0 auto"}}>
                <h2 style={{fontFamily:"var(--fhead)",fontSize:"1.8rem",letterSpacing:".04em",marginBottom:".5rem"}}>ДЭЛГЭРЭНГҮЙ МЭДЭЭЛЭЛ</h2>
                <p style={{color:"var(--muted)",fontSize:".9rem",marginBottom:"1.75rem"}}>Доорх мэдээлэл тооцооны нарийвчлалыг нэмэгдүүлнэ.</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1rem"}}>
                  <div className="field">
                    <label>Нийт талбай (м²)</label>
                    <input value={area} onChange={e=>setArea(e.target.value)} placeholder={propType==="ger"?"50":propType==="apartment"?"70":"120"}/>
                  </div>
                  <div className="field">
                    <label>Сарын цахилгааны зардал (₮)</label>
                    <input value={monthly} onChange={e=>setMonthly(e.target.value.replace(/[^0-9]/g,""))} placeholder="150000"/>
                  </div>
                </div>
                <div className="field" style={{marginBottom:"1.5rem"}}>
                  <label>Халаалтын төрөл</label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px",marginTop:"6px"}}>
                    {[{k:"electric",l:"⚡ Цахилгаан"},{k:"coal",l:"🪨 Нүүрс"},{k:"central",l:"🔥 Төвийн"}].map(h=>(
                      <div key={h.k} onClick={()=>setHeat(h.k)} style={{background:heat===h.k?"rgba(74,222,128,.12)":"rgba(255,255,255,.04)",border:heat===h.k?"2px solid var(--green3)":"1px solid var(--border)",borderRadius:"var(--radius)",padding:"10px",cursor:"pointer",textAlign:"center",fontSize:".82rem",fontWeight:"600",transition:"all .2s",color:heat===h.k?"var(--green3)":"var(--muted)"}}>
                        {h.l}
                      </div>
                    ))}
                  </div>
                </div>
                {!canCalc && <div style={{background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.25)",borderRadius:"var(--radius)",padding:"9px 12px",fontSize:".78rem",color:"#f87171",marginBottom:"1rem"}}>Оноо хүрэлцэхгүй — дашбоард руу очиж нэм.</div>}
                <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}>
                  <button className="btn btn-g" onClick={()=>setStep(2)}>← Буцах</button>
                  <button className="btn btn-p" onClick={generateReport} disabled={!area||!monthly||!heat||!canCalc||loading}>
                    {loading?"Тооцоолж байна...":"☀ Тооцоолол гаргах →"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: REPORT */}
            {step===4 && (
              <div>
                {loading && (
                  <div style={{textAlign:"center",padding:"4rem 2rem"}}>
                    <div style={{fontSize:"3rem",marginBottom:"1rem",animation:"spin 2s linear infinite"}}>☀</div>
                    <div style={{fontFamily:"var(--fhead)",fontSize:"1.5rem",letterSpacing:".04em",marginBottom:".5rem"}}>ТООЦООЛЖ БАЙНА...</div>
                    <div style={{color:"var(--muted)",fontSize:".9rem"}}>AI таны гэрт хамгийн тохиромжтой нарны системийг тооцоолж байна</div>
                    <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
                  </div>
                )}
                {!loading && report && !report.error && (
                  <div>
                    {/* HEADER */}
                    <div style={{background:"linear-gradient(135deg,rgba(45,134,83,.3),rgba(74,222,128,.1))",border:"1px solid rgba(74,222,128,.3)",borderRadius:"var(--radius-lg)",padding:"1.5rem 2rem",marginBottom:"1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
                      <div>
                        <div style={{fontFamily:"var(--fhead)",fontSize:"2rem",letterSpacing:".04em",color:"var(--green3)"}}>ТООЦООНЫ ТАЙЛАН</div>
                        <div style={{fontSize:".82rem",color:"var(--muted)",marginTop:"3px"}}>{typeLabel[propType]} · {area}м² · {heat==="electric"?"Цахилгаан":heat==="coal"?"Нүүрс":"Төвийн"} халаалт · {parseInt(monthly).toLocaleString()}₮/сар</div>
                      </div>
                      <button className="btn btn-gold" onClick={downloadReport}>⬇ Тайлан татах</button>
                    </div>

                    {/* SYSTEM SPECS */}
                    <div style={{marginBottom:"1.25rem"}}>
                      <div style={{fontSize:".7rem",color:"var(--green3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".75rem",fontWeight:"600"}}>Санал болгох систем</div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1rem"}}>
                        {[
                          {icon:"⚡",val:`${report.recommended_kw} kW`,lbl:"Хүчин чадал",c:"var(--green3)"},
                          {icon:"🔲",val:`${report.panel_count} ш`,lbl:"Панелийн тоо",c:"#60a5fa"},
                          {icon:"📐",val:`${report.space_needed_m2} м²`,lbl:"Шаардлагатай талбай",c:"var(--gold)"},
                        ].map(m=>(
                          <div key={m.lbl} style={{background:"rgba(255,255,255,.04)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"1.25rem",textAlign:"center"}}>
                            <div style={{fontSize:"1.5rem",marginBottom:".5rem"}}>{m.icon}</div>
                            <div style={{fontFamily:"var(--fhead)",fontSize:"1.75rem",letterSpacing:".04em",color:m.c,lineHeight:1}}>{m.val}</div>
                            <div style={{fontSize:".68rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",marginTop:"4px"}}>{m.lbl}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FINANCIAL */}
                    <div style={{marginBottom:"1.25rem"}}>
                      <div style={{fontSize:".7rem",color:"var(--green3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".75rem",fontWeight:"600"}}>Санхүүгийн тооцоо</div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"1rem"}}>
                        <div style={{background:"rgba(255,255,255,.04)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"1.25rem"}}>
                          <div style={{fontSize:".72rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:"1rem",fontWeight:"600"}}>Зардал</div>
                          {[
                            ["Суурилуулалтын зардал",`${(report.installation_cost/1000000).toFixed(1)}M₮`,"#f87171"],
                            ["Карбон 20% хөнгөлөлтийн дараа",`${(report.after_carbon/1000000).toFixed(1)}M₮`,"var(--green3)"],
                            ["Сарын зээлийн төлбөр",`${Math.round(report.monthly_loan/1000)}K₮`,"var(--gold)"],
                          ].map(([l,v,c])=>(
                            <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
                              <span style={{fontSize:".8rem",color:"var(--muted)"}}>{l}</span>
                              <span style={{fontWeight:"700",color:c,fontSize:".9rem"}}>{v}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{background:"rgba(255,255,255,.04)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"1.25rem"}}>
                          <div style={{fontSize:".72rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:"1rem",fontWeight:"600"}}>Орлого</div>
                          {[
                            ["Жилийн экспортын орлого",`${(report.annual_export_income/1000000).toFixed(1)}M₮`,"var(--green3)"],
                            ["Жилийн цахилгааны хэмнэлт",`${(report.annual_saving/1000000).toFixed(1)}M₮`,"var(--green3)"],
                            ["Хөрөнгө нөхөх хугацаа",`${report.payback_years} жил`,"var(--gold)"],
                          ].map(([l,v,c])=>(
                            <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
                              <span style={{fontSize:".8rem",color:"var(--muted)"}}>{l}</span>
                              <span style={{fontWeight:"700",color:c,fontSize:".9rem"}}>{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ECO + SUMMARY */}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1.25rem"}}>
                      <div style={{background:"rgba(74,222,128,.06)",border:"1px solid rgba(74,222,128,.2)",borderRadius:"var(--radius-lg)",padding:"1.25rem"}}>
                        <div style={{fontSize:".7rem",color:"var(--green3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".875rem",fontWeight:"600"}}>🌿 Байгаль орчны ашиг</div>
                        <div style={{display:"flex",gap:"1rem"}}>
                          <div style={{textAlign:"center",flex:1}}>
                            <div style={{fontFamily:"var(--fhead)",fontSize:"1.5rem",color:"var(--green3)",letterSpacing:".04em"}}>{report.co2_reduction_tons}</div>
                            <div style={{fontSize:".68rem",color:"var(--muted)"}}>тн CO₂/жил</div>
                          </div>
                          <div style={{textAlign:"center",flex:1}}>
                            <div style={{fontFamily:"var(--fhead)",fontSize:"1.5rem",color:"#74c69d",letterSpacing:".04em"}}>{report.coal_saving_tons}</div>
                            <div style={{fontSize:".68rem",color:"var(--muted)"}}>тн нүүрс/жил</div>
                          </div>
                        </div>
                      </div>
                      <div style={{background:"rgba(255,255,255,.04)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"1.25rem"}}>
                        <div style={{fontSize:".7rem",color:"var(--gold)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".875rem",fontWeight:"600"}}>💡 Зөвлөмжүүд</div>
                        <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
                          {(report.tips||[]).map((t,i)=>(
                            <div key={i} style={{fontSize:".78rem",color:"var(--muted)",padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>· {t}</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* SUMMARY */}
                    <div style={{background:"rgba(255,255,255,.03)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"1.25rem",marginBottom:"1.5rem"}}>
                      <div style={{fontSize:".7rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:".5rem",fontWeight:"600"}}>Дүгнэлт</div>
                      <p style={{fontSize:".9rem",lineHeight:"1.7",color:"rgba(255,255,255,.85)"}}>{report.summary}</p>
                    </div>

                    {/* FOLLOW-UP CHAT */}
                    <div style={{background:"rgba(255,255,255,.04)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",overflow:"hidden"}}>
                      <div style={{padding:".875rem 1.25rem",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:"8px"}}>
                        <div className="aip"/>
                        <span style={{fontSize:".875rem",fontWeight:"600"}}>Нэмэлт асуулт асуух</span>
                        <span style={{marginLeft:"auto",fontSize:".75rem",color:"var(--muted)"}}>{COST} оноо/асуулт</span>
                      </div>
                      <div style={{maxHeight:"200px",overflowY:"auto",padding:"1rem",display:"flex",flexDirection:"column",gap:".75rem"}}>
                        {chatMsgs.length===0 && <div style={{fontSize:".82rem",color:"var(--muted)"}}>Тооцооны тайланд холбоотой асуулт асуух боломжтой.</div>}
                        {chatMsgs.map((m,i)=>(
                          <div key={i} className={`msg ${m.role==="assistant"?"ai":"user"}`} style={{whiteSpace:"pre-wrap"}}>{m.content}</div>
                        ))}
                        {chatLoading && <div className="msg ai loading"><div className="dot"/><div className="dot"/><div className="dot"/></div>}
                      </div>
                      {canCalc ? (
                        <form style={{padding:".75rem 1rem",borderTop:"1px solid var(--border)",display:"flex",gap:"8px"}} onSubmit={sendChat}>
                          <input value={chatQ} onChange={e=>setChatQ(e.target.value)} placeholder="Жишээ нь: Хэдэн жилд зардал нөхөгдөх вэ?" disabled={chatLoading}
                            style={{flex:1,background:"rgba(255,255,255,.07)",border:"1px solid var(--border)",borderRadius:"999px",padding:"9px 16px",color:"#fff",fontFamily:"var(--fbody)",fontSize:".85rem"}}/>
                          <button className="btn btn-p btn-sm" type="submit" disabled={!chatQ.trim()||chatLoading}>→</button>
                        </form>
                      ) : (
                        <div style={{padding:".75rem 1rem",borderTop:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                          <span style={{fontSize:".78rem",color:"var(--muted)"}}>⚡ {COST} оноо шаардлагатай</span>
                          <button className="btn btn-p btn-sm" onClick={()=>setPage("dash")}>Оноо нэмэх →</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {!loading && report?.error && (
                  <div style={{textAlign:"center",padding:"3rem",background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.25)",borderRadius:"var(--radius-lg)"}}>
                    <div style={{fontSize:"2rem",marginBottom:"1rem"}}>⚠️</div>
                    <div style={{color:"#f87171",marginBottom:"1rem"}}>{report.error}</div>
                    <button className="btn btn-p" onClick={()=>setStep(3)}>← Дахин оролдох</button>
                  </div>
                )}
              </div>
            )}
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
