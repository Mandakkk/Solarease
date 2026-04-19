"use client";
import { useState, useEffect, useRef } from "react";

const G = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --green:#1a5c3a;--green2:#2d8653;--green3:#4ade80;
  --gold:#f59e0b;--text:#fff;--muted:rgba(255,255,255,.7);
  --border:rgba(255,255,255,.15);--radius:12px;--radius-lg:20px;
  --fhead:'Bebas Neue',sans-serif;--fbody:'DM Sans',sans-serif;
}
body{font-family:var(--fbody);background:#0a1a0f;color:var(--text);min-height:100vh;overflow-x:hidden}
.app{min-height:100vh;display:flex;flex-direction:column}
.bg-wrap{position:fixed;inset:0;z-index:0}
.bg-img{width:100%;height:100%;object-fit:cover;opacity:.5}
.bg-ov{position:absolute;inset:0;background:linear-gradient(150deg,rgba(0,20,10,.8) 0%,rgba(0,0,0,.25) 50%,rgba(10,26,15,.85) 100%)}
.nav{position:relative;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:1.25rem 2rem;border-bottom:1px solid var(--border);background:rgba(0,0,0,.3);backdrop-filter:blur(12px)}
.logo{font-family:var(--fhead);font-size:1.8rem;letter-spacing:.04em;cursor:pointer}
.logo .e{color:var(--green3)}
.logo-sub{font-size:.6rem;color:rgba(255,255,255,.5);letter-spacing:.15em;text-transform:uppercase;margin-top:-4px}
.nav-r{display:flex;align-items:center;gap:10px}
.pts-pill{background:rgba(245,158,11,.15);border:1px solid rgba(245,158,11,.4);border-radius:999px;padding:5px 14px;font-size:.8rem;color:var(--gold);font-weight:600}
.btn{font-family:var(--fbody);font-size:.875rem;font-weight:600;padding:10px 22px;border-radius:999px;border:none;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:6px}
.btn-p{background:var(--green2);color:#fff;border:2px solid var(--green3)}
.btn-p:hover{background:var(--green3);color:#0a1a0f;transform:translateY(-2px)}
.btn-o{background:rgba(255,255,255,.08);color:#fff;border:2px solid rgba(255,255,255,.4);backdrop-filter:blur(8px)}
.btn-o:hover{background:rgba(255,255,255,.18);border-color:#fff;transform:translateY(-2px)}
.btn-g{background:transparent;color:rgba(255,255,255,.7);border:1px solid var(--border)}
.btn-g:hover{background:rgba(255,255,255,.08);color:#fff}
.btn-sm{padding:7px 16px;font-size:.8rem}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important}
.hero{position:relative;z-index:10;min-height:calc(100vh - 80px);display:flex;align-items:center;padding:2rem}
.hero-in{max-width:1200px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 380px;gap:3rem;align-items:center}
@media(max-width:860px){.hero-in{grid-template-columns:1fr}.phone-wrap{display:none}}
.hero-tag{display:inline-flex;align-items:center;gap:6px;background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.3);border-radius:999px;padding:5px 14px;font-size:.72rem;color:var(--green3);font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.5rem}
.hero-tag::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--green3);animation:blink 2s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.h1{font-family:var(--fhead);font-size:clamp(4rem,8vw,7rem);line-height:.92;letter-spacing:.03em;margin-bottom:1.5rem;text-shadow:0 2px 30px rgba(0,0,0,.6)}
.h1 .g{color:var(--green3)}.h1 .go{color:var(--gold)}
.hero-sub{font-size:1.05rem;color:var(--muted);max-width:460px;margin-bottom:2.5rem;font-weight:300;line-height:1.7}
.hero-btns{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:3rem}
.hero-stats{display:flex;gap:2rem;flex-wrap:wrap}
.hv{font-family:var(--fhead);font-size:2rem;color:var(--green3);letter-spacing:.04em}
.hl{font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-top:2px}
.phone-wrap{display:flex;justify-content:center}
.phone{background:rgba(0,0,0,.65);border:2px solid rgba(255,255,255,.15);border-radius:40px;padding:2rem 1.5rem;backdrop-filter:blur(20px);width:260px;box-shadow:0 24px 60px rgba(0,0,0,.6)}
.phone-notch{width:70px;height:7px;background:rgba(255,255,255,.1);border-radius:999px;margin:0 auto 1.25rem}
.phone-logo{text-align:center;font-family:var(--fhead);font-size:1.3rem;letter-spacing:.04em;margin-bottom:1.25rem}
.phone-logo .e{color:var(--green3)}
.phone-logo-sub{font-size:.55rem;color:rgba(255,255,255,.4);letter-spacing:.12em;text-transform:uppercase;margin-top:-4px;text-align:center}
.robot-area{display:flex;flex-direction:column;align-items:center;gap:.875rem;padding:.5rem 0}
.bubble{background:#fff;color:#1a1a16;border-radius:16px;border-bottom-right-radius:4px;padding:9px 16px;font-size:.82rem;font-weight:700;margin-right:1.5rem;box-shadow:0 4px 12px rgba(0,0,0,.2)}
.bot{font-size:3.5rem;animation:float 3s ease-in-out infinite;filter:drop-shadow(0 4px 12px rgba(74,222,128,.3))}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.phone-btns{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:1.25rem}
.pb{padding:11px 8px;border-radius:999px;font-size:.8rem;font-weight:700;border:none;cursor:pointer;text-align:center;font-family:var(--fbody);letter-spacing:.04em;transition:all .15s}
.pb.c{background:rgba(255,255,255,.1);color:#fff;border:2px solid rgba(255,255,255,.3)}
.pb.i{background:var(--green2);color:#fff;border:2px solid var(--green3)}
.pb:hover{transform:scale(1.04)}
.strip{position:relative;z-index:10;background:rgba(0,0,0,.55);border-top:1px solid var(--border);border-bottom:1px solid var(--border);backdrop-filter:blur(12px);padding:1.75rem 2rem}
.strip-in{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1.5rem;text-align:center}
.sn{font-family:var(--fhead);font-size:2rem;color:var(--green3);letter-spacing:.04em}
.sl{font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-top:2px}
.how{position:relative;z-index:10;padding:5rem 2rem;background:rgba(0,10,5,.65);backdrop-filter:blur(8px)}
.how-in{max-width:1200px;margin:0 auto}
.stag{font-size:.7rem;text-transform:uppercase;letter-spacing:.12em;color:var(--green3);font-weight:600;margin-bottom:.5rem}
.stitle-h{font-family:var(--fhead);font-size:clamp(2.5rem,5vw,4rem);letter-spacing:.04em;margin-bottom:3rem;line-height:.95}
.how-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1.25rem}
.hc{background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.75rem;transition:border-color .2s,background .2s}
.hc:hover{border-color:rgba(74,222,128,.35);background:rgba(74,222,128,.05)}
.hc-n{font-family:var(--fhead);font-size:3rem;color:rgba(74,222,128,.25);letter-spacing:.04em;line-height:1;margin-bottom:.75rem}
.hc h3{font-size:.95rem;font-weight:600;margin-bottom:.4rem}
.hc p{font-size:.8rem;color:var(--muted);line-height:1.6}
.pts-tag{display:inline-block;background:rgba(245,158,11,.1);color:var(--gold);font-size:.7rem;font-weight:600;border-radius:999px;padding:3px 12px;margin-top:.875rem;border:1px solid rgba(245,158,11,.3)}
.cta{position:relative;z-index:10;padding:5rem 2rem;text-align:center;background:rgba(26,92,58,.2);border-top:1px solid rgba(74,222,128,.15)}
.cta h2{font-family:var(--fhead);font-size:clamp(3rem,6vw,5.5rem);letter-spacing:.04em;margin-bottom:.75rem;line-height:.95}
.cta p{font-size:1rem;color:var(--muted);margin-bottom:2.5rem;font-weight:300}
.page{position:relative;z-index:10;flex:1;max-width:1000px;margin:0 auto;width:100%;padding:2rem}
.aw{max-width:400px;margin:3rem auto}
.ac{background:rgba(0,0,0,.55);border:1px solid var(--border);border-radius:var(--radius-lg);padding:2rem;backdrop-filter:blur(20px)}
.ac h2{font-family:var(--fhead);font-size:2rem;letter-spacing:.04em;margin-bottom:.3rem}
.ac-sub{color:var(--muted);font-size:.85rem;margin-bottom:1.75rem}
.field{margin-bottom:1rem}
.field label{display:block;font-size:.7rem;font-weight:600;color:var(--muted);margin-bottom:5px;text-transform:uppercase;letter-spacing:.08em}
.field input,.field select{width:100%;background:rgba(255,255,255,.07);border:1px solid var(--border);border-radius:8px;padding:10px 14px;color:#fff;font-family:var(--fbody);font-size:.875rem;transition:border-color .15s}
.field input::placeholder{color:rgba(255,255,255,.25)}
.field input:focus,.field select:focus{outline:none;border-color:var(--green3);box-shadow:0 0 0 3px rgba(74,222,128,.1)}
.field select option{background:#0a1a0f}
.bonus{background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.25);border-radius:8px;padding:9px 13px;font-size:.8rem;color:var(--green3);margin-bottom:1.25rem}
.asw{text-align:center;margin-top:1.25rem;font-size:.82rem;color:var(--muted)}
.asw button{background:none;border:none;color:var(--green3);cursor:pointer;font-size:inherit;font-family:inherit;font-weight:600;text-decoration:underline}
.dh{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2rem;flex-wrap:wrap;gap:1rem}
.dhello{font-family:var(--fhead);font-size:2rem;letter-spacing:.04em;line-height:1.1}
.dhello em{color:var(--green3);font-style:normal}
.pd{background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.3);border-radius:var(--radius-lg);padding:1rem 1.5rem;text-align:center;min-width:130px;backdrop-filter:blur(12px)}
.pb2{font-family:var(--fhead);font-size:2.5rem;color:var(--gold);letter-spacing:.04em;line-height:1}
.pl{font-size:.68rem;color:var(--gold);text-transform:uppercase;letter-spacing:.1em;margin-top:3px;opacity:.8}
.tasks{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;margin-bottom:2rem}
.tc{background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem;display:flex;flex-direction:column;gap:.75rem;transition:border-color .2s,background .2s;backdrop-filter:blur(8px)}
.tc:hover:not(.done){border-color:rgba(74,222,128,.4);background:rgba(74,222,128,.05)}
.tc.done{opacity:.4;pointer-events:none}
.tt{display:flex;align-items:center;gap:10px}
.ti{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.2)}
.tn{font-size:.9rem;font-weight:600}
.td{font-size:.78rem;color:var(--muted);line-height:1.5}
.tf{display:flex;align-items:center;justify-content:space-between}
.tpts{font-size:.78rem;font-weight:600;color:var(--gold)}
.db{background:rgba(74,222,128,.12);color:var(--green3);border-radius:999px;padding:3px 12px;font-size:.75rem;font-weight:600;border:1px solid rgba(74,222,128,.3)}
.rb{background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem;margin-bottom:1rem;backdrop-filter:blur(8px)}
.rb h3{font-family:var(--fhead);font-size:1.3rem;letter-spacing:.04em;margin-bottom:.25rem}
.rb p{font-size:.8rem;color:var(--muted);margin-bottom:.875rem}
.rrow{display:flex;gap:8px}
.rcode{flex:1;background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:8px;padding:9px 13px;font-family:monospace;font-size:.875rem;color:var(--green3);letter-spacing:.08em}
.cbtn{background:rgba(255,255,255,.07);border:1px solid var(--border);border-radius:8px;padding:9px 14px;color:var(--muted);cursor:pointer;font-size:.78rem;transition:all .15s;white-space:nowrap;font-family:var(--fbody)}
.cbtn:hover{border-color:var(--green3);color:var(--green3)}
.hist{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden}
.hr2{display:flex;justify-content:space-between;align-items:center;padding:9px 14px;border-bottom:1px solid var(--border);font-size:.82rem}
.hr2:last-child{border-bottom:none}
.hp{font-weight:600;color:var(--gold)}.hp.neg{color:#f87171}
.div2{border:none;border-top:1px solid var(--border);margin:1.5rem 0}
.stitle{font-family:var(--fhead);font-size:1.5rem;letter-spacing:.04em;margin-bottom:.875rem}
.cl{display:grid;grid-template-columns:1fr 1.5fr;gap:1.5rem;align-items:start}
@media(max-width:640px){.cl{grid-template-columns:1fr}}
.cf{background:rgba(0,0,0,.5);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5rem;backdrop-filter:blur(16px)}
.cf h2{font-family:var(--fhead);font-size:1.5rem;letter-spacing:.04em;margin-bottom:1.25rem}
.cn{display:flex;align-items:center;gap:6px;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.3);border-radius:8px;padding:8px 12px;font-size:.78rem;color:var(--gold);margin-bottom:1.25rem}
.chatbox{background:rgba(0,0,0,.5);border:1px solid var(--border);border-radius:var(--radius-lg);display:flex;flex-direction:column;height:500px;backdrop-filter:blur(16px)}
.ch{padding:.875rem 1.25rem;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
.aip{width:8px;height:8px;border-radius:50%;background:var(--green3);animation:pulse 2s infinite;box-shadow:0 0 6px var(--green3)}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.chn{font-size:.875rem;font-weight:600}
.chp{margin-left:auto;font-size:.75rem;color:var(--muted)}
.cm{flex:1;overflow-y:auto;padding:1.25rem;display:flex;flex-direction:column;gap:.875rem}
.cm::-webkit-scrollbar{width:4px}
.cm::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:999px}
.msg{max-width:86%;padding:10px 14px;border-radius:14px;font-size:.85rem;line-height:1.6}
.msg.ai{background:rgba(255,255,255,.07);border:1px solid var(--border);align-self:flex-start;border-bottom-left-radius:3px}
.msg.user{background:rgba(74,222,128,.12);border:1px solid rgba(74,222,128,.3);color:var(--green3);align-self:flex-end;border-bottom-right-radius:3px}
.msg.loading{display:flex;gap:5px;align-items:center}
.dot{width:6px;height:6px;border-radius:50%;background:var(--muted);animation:bou 1.2s infinite}
.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
@keyframes bou{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
.ci{padding:.75rem 1rem;border-top:1px solid var(--border);display:flex;gap:8px}
.ci input{flex:1;background:rgba(255,255,255,.07);border:1px solid var(--border);border-radius:999px;padding:9px 16px;color:#fff;font-family:var(--fbody);font-size:.85rem}
.ci input::placeholder{color:rgba(255,255,255,.25)}
.ci input:focus{outline:none;border-color:var(--green3)}
.lv{position:absolute;inset:0;background:rgba(0,0,0,.75);border-radius:var(--radius-lg);backdrop-filter:blur(6px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.75rem;text-align:center;padding:1.5rem;z-index:10}
.lv h3{font-family:var(--fhead);font-size:1.5rem;letter-spacing:.04em}
.lv p{font-size:.8rem;color:var(--muted)}
.qq{background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-size:.77rem;color:var(--muted);cursor:pointer;text-align:left;font-family:var(--fbody);transition:all .15s;line-height:1.4;width:100%}
.qq:hover:not(:disabled){border-color:var(--green3);color:var(--green3)}
.qq:disabled{opacity:.3;cursor:not-allowed}
.mb{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(6px)}
.mc2{background:rgba(10,26,15,.95);border:1px solid var(--border);border-radius:var(--radius-lg);padding:2rem;max-width:400px;width:90%}
.mc2 h3{font-family:var(--fhead);font-size:1.5rem;letter-spacing:.04em;margin-bottom:.4rem}
.mc2 p{color:var(--muted);font-size:.85rem;margin-bottom:1.25rem}
.ab{background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--radius);height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem;margin-bottom:1rem}
.prog{width:100%;height:4px;background:rgba(255,255,255,.1);border-radius:999px;overflow:hidden;margin-bottom:.5rem}
.pf{height:100%;background:var(--green3);border-radius:999px;transition:width .2s}
.tmr{font-size:.78rem;color:var(--muted);text-align:center}
.vi{width:100%;background:rgba(255,255,255,.07);border:1px solid var(--border);border-radius:8px;padding:9px 13px;color:#fff;font-family:var(--fbody);font-size:.875rem;margin-top:6px}
.vi::placeholder{color:rgba(255,255,255,.25)}
.vi:focus{outline:none;border-color:var(--green3)}
.toast{position:fixed;bottom:2rem;right:2rem;background:var(--green2);color:#fff;border-radius:999px;padding:11px 22px;font-size:.85rem;z-index:999;animation:ti .3s ease;box-shadow:0 4px 24px rgba(74,222,128,.3);font-weight:600}
@keyframes ti{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
.dn{background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.3);border-radius:8px;padding:9px 12px;font-size:.78rem;color:#f87171;margin-bottom:1rem}
`;

const COST = 30;
const genCode = n => "SE-" + (n||"X").slice(0,3).toUpperCase() + Math.random().toString(36).slice(2,6).toUpperCase();

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

export default function SolarEase() {
  const [page, setPage] = useState("landing");
  const [authMode, setAuthMode] = useState("register");
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
  const msgEnd = useRef(null);

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); } }, [toast]);
  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const addPts = (n, desc) => {
    setUser(u => ({ ...u, points: u.points + n }));
    setHistory(h => [{ desc, pts: n, t: new Date().toLocaleTimeString() }, ...h]);
    setToast(`+${n} оноо нэмэгдлээ!`);
  };
  const usePts = (n, desc) => {
    setUser(u => ({ ...u, points: u.points - n }));
    setHistory(h => [{ desc, pts: -n, t: new Date().toLocaleTimeString() }, ...h]);
  };

  function handleAuth(e) {
    e.preventDefault();
    const u = { name, email, points: authMode === "register" ? 50 : 120, refCode: genCode(name), tc: { ad: 0, verify: 0, invite: 0 }, verified: authMode !== "register" };
    setUser(u);
    if (authMode === "register") setHistory([{ desc: "Бүртгэлийн урамшуулал", pts: 50, t: new Date().toLocaleTimeString() }]);
    setToast(authMode === "register" ? "Тавтай морил! +50 оноо!" : "Нэвтэрлээ!");
    setPage("calc");
  }

  function startAd() {
    if ((user.tc.ad || 0) >= 5) return;
    setAdProg(0); setAdRunning(true); setAdModal(true);
    let p = 0;
    const iv = setInterval(() => {
      p += 100 / 30; setAdProg(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(iv); setAdRunning(false); setAdModal(false);
        setUser(u => ({ ...u, tc: { ...u.tc, ad: (u.tc.ad || 0) + 1 } }));
        addPts(10, "Сурталчилгаа үзсэн");
      }
    }, 1000);
  }

  function handleVerify() {
    if (vStep === 0) { setVStep(1); setToast("Код илгээлээ (demo)"); }
    else if (vStep === 1 && vCode.length >= 4) {
      setUser(u => ({ ...u, verified: true, tc: { ...u.tc, verify: 1 } }));
      addPts(50, "Бүртгэл баталгаажуулсан"); setVStep(2);
    }
  }

  function copyRef() {
    navigator.clipboard?.writeText(user.refCode).catch(() => {});
    setCopied(true); setToast("Код хуулагдлаа!");
    setTimeout(() => setCopied(false), 2000);
    if ((user.tc.invite || 0) < 10) {
      setTimeout(() => {
        setUser(u => ({ ...u, tc: { ...u.tc, invite: (u.tc.invite || 0) + 1 } }));
        addPts(25, "Найз нэгдсэн (demo)");
      }, 3000);
    }
  }

  async function sendMsg(e, override) {
    e?.preventDefault();
    const txt = (override || input).trim();
    if (!txt || loading) return;
    if (!user || user.points < COST) { setToast(`${COST} оноо хэрэгтэй.`); return; }
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

  const canCalc = user && user.points >= COST;

  return (
    <>
      <style>{G}</style>
      <div className="app">
        <div className="bg-wrap">
          <img className="bg-img" src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&q=80" alt="solar panels" />
          <div className="bg-ov"/>
        </div>

        <nav className="nav">
          <div onClick={() => setPage("landing")} style={{cursor:"pointer"}}>
            <div className="logo">Solar<span className="e">Ease</span></div>
            <div className="logo-sub">fintech platform</div>
          </div>
          <div className="nav-r">
            {user ? (
              <>
                <div className="pts-pill">⚡ {user.points} оноо</div>
                <button className="btn btn-g btn-sm" onClick={() => setPage("dash")}>Хяналт</button>
                <button className="btn btn-p btn-sm" onClick={() => setPage("calc")}>Тооцоолол</button>
              </>
            ) : (
              <>
                <button className="btn btn-g btn-sm" onClick={() => { setAuthMode("login"); setPage("auth"); }}>Нэвтрэх</button>
                <button className="btn btn-p btn-sm" onClick={() => { setAuthMode("register"); setPage("auth"); }}>Бүртгүүлэх</button>
              </>
            )}
          </div>
        </nav>

        {page === "landing" && (
          <>
            <div className="hero">
              <div className="hero-in">
                <div>
                  <div className="hero-tag">☀ Дорноговь аймаг · 2025</div>
                  <h1 className="h1">
                    INVEST IN<br/>
                    <span className="g">SOLAR</span><br/>
                    <span className="go">EARN IT</span>
                  </h1>
                  <p className="hero-sub">Карбон механизм, ногоон зээл ашиглан нарны системийн тооцоогоо AI туслахаар хий. Урьдчилгаа мөнгөгүй.</p>
                  <div className="hero-btns">
                    <button className="btn btn-o" style={{fontSize:"1rem",padding:"13px 32px"}} onClick={() => { setAuthMode("register"); setPage("auth"); }}>CALCULATE</button>
                    <button className="btn btn-p" style={{fontSize:"1rem",padding:"13px 32px"}} onClick={() => { setAuthMode("register"); setPage("auth"); }}>INVEST</button>
                  </div>
                  <div className="hero-stats">
                    {[["22 САР","буцаан төлөх"],["343₮","kWh тариф"],["20%","карбон хөнгөлөлт"],["75+","ажлын байр"]].map(([v,l]) => (
                      <div key={l}><div className="hv">{v}</div><div className="hl">{l}</div></div>
                    ))}
                  </div>
                </div>
                <div className="phone-wrap">
                  <div className="phone">
                    <div className="phone-notch"/>
                    <div className="phone-logo">Solar<span className="e">Ease</span></div>
                    <div className="phone-logo-sub">fintech platform</div>
                    <div className="robot-area">
                      <div className="bubble">CALCULATE?</div>
                      <div className="bot">🤖</div>
                    </div>
                    <div className="phone-btns">
                      <button className="pb c" onClick={() => { setAuthMode("register"); setPage("auth"); }}>CALCULATE</button>
                      <button className="pb i" onClick={() => { setAuthMode("register"); setPage("auth"); }}>INVEST</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="strip">
              <div className="strip-in">
                {[["10.8M₮","5kW хөрөнгө оруулалт"],["4M₮","жилийн орлого"],["150K","тонн CO₂ бууралт"],["75+","ажлын байр"]].map(([v,l]) => (
                  <div key={l} style={{textAlign:"center"}}><div className="sn">{v}</div><div className="sl">{l}</div></div>
                ))}
              </div>
            </div>

            <div className="how">
              <div className="how-in">
                <div className="stag">ХЭРХЭН АЖИЛЛАДАГ ВЭ</div>
                <div className="stitle-h">ОНОО ЦУГЛУУЛ,<br/>AI-ААР ТООЦООЛ</div>
                <div className="how-g">
                  {[
                    ["01","Бүртгүүлэх","Бүртгэлийн урамшуулал 50 оноо автоматаар нэмэгдэнэ","+50 оноо"],
                    ["02","Сурталчилгаа үзэх","30 секундын видео үзэж оноо нэм — өдөрт 5 удаа","+10 оноо"],
                    ["03","Найз урих","Таны кодоор бүртгүүлсэн найз тутамд","+25 оноо"],
                    ["04","AI тооцоолол","Нарны системийн дэлгэрэнгүй тооцоог AI туслахаар хий","30 оноо/асуулт"],
                  ].map(([n,t,d,p]) => (
                    <div className="hc" key={n}>
                      <div className="hc-n">{n}</div>
                      <h3>{t}</h3><p>{d}</p>
                      <div className="pts-tag">{p}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="cta">
              <h2>ӨНӨӨДӨР ЭХЭЛ</h2>
              <p>Бүртгүүлж 50 оноо аваад анхны тооцоогоо хий</p>
              <button className="btn btn-p" style={{fontSize:"1rem",padding:"13px 36px"}} onClick={() => { setAuthMode("register"); setPage("auth"); }}>ҮНЭГҮЙ БҮРТГҮҮЛЭХ →</button>
            </div>
          </>
        )}

        {page === "auth" && (
          <div className="page">
            <div className="aw">
              <div className="ac">
                <h2>{authMode === "register" ? "БҮРТГЭЛ ҮҮСГЭХ" : "НЭВТРЭХ"}</h2>
                <p className="ac-sub">{authMode === "register" ? "Бүртгүүлж тооцоо хийж эхэл" : "Тавтай морил"}</p>
                {authMode === "register" && <div className="bonus">🎁 Бүртгүүлснийхээ шагнал 50 оноо автоматаар нэмэгдэнэ</div>}
                <form onSubmit={handleAuth}>
                  <div className="field"><label>Нэр</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Таны нэр" required/></div>
                  <div className="field"><label>Имэйл</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="example@gmail.com" required/></div>
                  <div className="field"><label>Нууц үг</label><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" required/></div>
                  {authMode === "register" && <div className="field"><label>Урилгын код (заавал биш)</label><input value={refIn} onChange={e=>setRefIn(e.target.value)} placeholder="SE-XXX..."/></div>}
                  <button className="btn btn-p" style={{width:"100%",justifyContent:"center",marginTop:".25rem"}} type="submit">
                    {authMode === "register" ? "БҮРТГҮҮЛЭХ" : "НЭВТРЭХ"}
                  </button>
                </form>
                <div className="asw">
                  {authMode === "register" ? <>Бүртгэлтэй юу? <button onClick={()=>setAuthMode("login")}>Нэвтрэх</button></> : <>Бүртгэлгүй юу? <button onClick={()=>setAuthMode("register")}>Бүртгүүлэх</button></>}
                </div>
              </div>
            </div>
          </div>
        )}

        {page === "dash" && user && (
          <div className="page">
            <div className="dh">
              <div>
                <div style={{fontSize:".7rem",color:"var(--muted)",marginBottom:"3px",textTransform:"uppercase",letterSpacing:".08em"}}>Тавтай морил</div>
                <div className="dhello">САЙН БАЙНА УУ, <em>{user.name.toUpperCase()}</em></div>
              </div>
              <div className="pd"><div className="pb2">{user.points}</div><div className="pl">Нийт оноо</div></div>
            </div>
            <div className="stitle">ОНОО ЦУГЛУУЛАХ</div>
            <div className="tasks">
              <div className={`tc ${(user.tc.ad||0)>=5?"done":""}`}>
                <div className="tt"><div className="ti">📺</div><div className="tn">Сурталчилгаа үзэх</div></div>
                <div className="td">30 секунд үзэж оноо ав · {user.tc.ad||0}/5 удаа</div>
                <div className="tf"><span className="tpts">+10 оноо</span>
                  {(user.tc.ad||0)>=5?<span className="db">✓ Дууссан</span>:<button className="btn btn-p btn-sm" onClick={startAd}>Үзэх</button>}
                </div>
              </div>
              <div className={`tc ${user.verified?"done":""}`}>
                <div className="tt"><div className="ti">✅</div><div className="tn">Бүртгэл баталгаажуулах</div></div>
                <div className="td">Утасны дугаар оруулж нэмэлт оноо ав</div>
                {!user.verified && vStep < 2 && <input className="vi" value={vStep===0?vPhone:vCode} onChange={e=>vStep===0?setVPhone(e.target.value):setVCode(e.target.value)} placeholder={vStep===0?"Утасны дугаар":"4 оронтой код"}/>}
                <div className="tf"><span className="tpts">+50 оноо</span>
                  {user.verified?<span className="db">✓ Баталгаажсан</span>:<button className="btn btn-o btn-sm" onClick={handleVerify}>{vStep===0?"Код авах":"Баталгаажуулах"}</button>}
                </div>
              </div>
              <div className="tc">
                <div className="tt"><div className="ti">👥</div><div className="tn">Найз урих</div></div>
                <div className="td">Таны кодоор нэгдсэн найз тутамд · {user.tc.invite||0} найз</div>
                <div className="tf"><span className="tpts">+25 оноо/найз</span><button className="btn btn-g btn-sm" onClick={copyRef}>{copied?"✓ Хуулагдлаа":"Урих"}</button></div>
              </div>
              <div className="tc" style={{borderColor:"rgba(74,222,128,.3)",cursor:"pointer"}} onClick={()=>setPage("calc")}>
                <div className="tt"><div className="ti">🤖</div><div className="tn">AI Тооцоолол</div></div>
                <div className="td">Нарны системийн тооцоогоо хий · {Math.floor(user.points/COST)}+ асуулт</div>
                <div className="tf"><span className="tpts">30 оноо/асуулт</span><button className="btn btn-p btn-sm">Нээх →</button></div>
              </div>
            </div>
            <hr className="div2"/>
            <div className="rb">
              <h3>НАЙЗ УРИХ</h3>
              <p>Найз тань таны кодоор бүртгүүлэхэд хоёулдаа +25 оноо авна</p>
              <div className="rrow"><div className="rcode">{user.refCode}</div><button className="cbtn" onClick={copyRef}>{copied?"✓ Хуулагдлаа":"📋 Хуулах"}</button></div>
            </div>
            {history.length > 0 && (<>
              <hr className="div2"/>
              <div className="stitle">ОНОOНЫ ТҮҮХ</div>
              <div className="hist">
                {history.slice(0,8).map((h,i)=>(
                  <div className="hr2" key={i}>
                    <span style={{color:"var(--muted)"}}>{h.desc}</span>
                    <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                      <span style={{fontSize:".72rem",color:"rgba(255,255,255,.25)"}}>{h.t}</span>
                      <span className={`hp ${h.pts<0?"neg":""}`}>{h.pts>0?"+":""}{h.pts}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>)}
          </div>
        )}

        {page === "calc" && user && (
          <div className="page">
            <div style={{marginBottom:"1.5rem"}}>
              <div className="stitle">☀ AI НАРНЫ ТООЦООЛОЛ</div>
              <p style={{fontSize:".85rem",color:"var(--muted)"}}>
                Асуулт бүрт 30 оноо · Үлдэгдэл: <strong style={{color:"var(--gold)"}}>{user.points} оноо</strong>
                {" · "}<button className="btn btn-g btn-sm" onClick={()=>setPage("dash")}>Оноо нэмэх</button>
              </p>
            </div>
            <div className="cl">
              <div className="cf">
                <h2>ГЭРИЙН МЭДЭЭЛЭЛ</h2>
                {!canCalc && <div className="dn">Оноо хүрэлцэхгүй — дашбоард руу очиж нэм.</div>}
                <div className="field"><label>Талбай (м²)</label><input value={area} onChange={e=>setArea(e.target.value)} placeholder="87"/></div>
                <div className="field"><label>Халаалт</label>
                  <select value={heat} onChange={e=>setHeat(e.target.value)}>
                    <option value="electric">Цахилгаан халаалт</option>
                    <option value="coal">Нүүрс халаалт</option>
                    <option value="central">Төвийн халаалт</option>
                  </select>
                </div>
                <div className="field"><label>Сарын цахилгааны зардал (₮)</label><input value={monthly} onChange={e=>setMonthly(e.target.value)} placeholder="150000"/></div>
                <div className="cn">⚡ Тооцооллын өртөг: 30 оноо</div>
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
                  <div className="ch"><div className="aip"/><span className="chn">🤖 SolarEase AI</span><span className="chp">{user.points} оноо</span></div>
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

        {adModal && (
          <div className="mb">
            <div className="mc2">
              <h3>СУРТАЛЧИЛГАА ҮЗЭХ</h3>
              <p>30 секунд үзсэний дараа +10 оноо нэмэгдэнэ</p>
              <div className="ab">
                <div style={{fontSize:".7rem",textTransform:"uppercase",letterSpacing:".08em",color:"rgba(255,255,255,.4)"}}>· {Math.round(30-adProg*.3)}с үлдлээ ·</div>
                <div style={{fontSize:"3rem"}}>☀</div>
                <div style={{fontSize:".78rem",color:"rgba(255,255,255,.4)"}}>Дорноговь Нарны Парк · 2025</div>
              </div>
              <div className="prog"><div className="pf" style={{width:`${adProg}%`}}/></div>
              <div className="tmr">{adRunning?"Үзэж байна...":"Дууслаа!"}</div>
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
