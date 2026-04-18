"use client";
import { useState, useEffect, useRef } from "react";

const G = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#f7f5f0;--surface:#ffffff;--surface2:#f0ede6;
  --border:#e2ddd5;--border2:#ccc8be;
  --green:#2d6a4f;--green2:#40916c;--green3:#74c69d;--green-light:#d8f3dc;
  --text:#1a1a16;--muted:#6b6b5e;--hint:#9e9e8e;
  --gold:#b5850a;--gold-light:#fef3c7;
  --danger:#b91c1c;--danger-light:#fee2e2;
  --radius:10px;--radius-lg:16px;
  --fhead:'Instrument Serif',serif;
  --fbody:'DM Sans',sans-serif;
}
body{font-family:var(--fbody);background:var(--bg);color:var(--text);min-height:100vh;line-height:1.6}
.app{min-height:100vh;display:flex;flex-direction:column}
.nav{display:flex;align-items:center;justify-content:space-between;padding:.875rem 2rem;background:rgba(247,245,240,.92);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;backdrop-filter:blur(10px)}
.logo{font-family:var(--fhead);font-size:1.35rem;color:var(--green);display:flex;align-items:center;gap:6px;cursor:pointer;font-style:italic}
.logo span{color:var(--text);font-style:normal}
.nav-right{display:flex;align-items:center;gap:8px}
.pts-pill{background:var(--gold-light);border:1px solid #fde68a;border-radius:999px;padding:4px 12px;font-size:.8rem;color:var(--gold);font-weight:500}
.btn{font-family:var(--fbody);font-size:.875rem;font-weight:500;padding:9px 20px;border-radius:var(--radius);border:none;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:6px}
.btn-primary{background:var(--green);color:#fff}
.btn-primary:hover{background:var(--green2);transform:translateY(-1px)}
.btn-outline{background:transparent;color:var(--green);border:1.5px solid var(--green)}
.btn-outline:hover{background:var(--green-light)}
.btn-ghost{background:transparent;color:var(--muted);border:1px solid var(--border)}
.btn-ghost:hover{background:var(--surface2);border-color:var(--border2)}
.btn-sm{padding:6px 14px;font-size:.8rem}
.btn:disabled{opacity:.45;cursor:not-allowed;transform:none!important}
.btn-white{background:#fff;color:var(--green);font-weight:600}
.btn-white:hover{background:var(--green-light)}

/* LANDING */
.landing{flex:1}
.hero{max-width:1100px;margin:0 auto;padding:5rem 2rem 4rem;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
@media(max-width:720px){.hero{grid-template-columns:1fr;padding:3rem 1.25rem 2rem;gap:2rem}}
.hero-eyebrow{display:inline-flex;align-items:center;gap:6px;background:var(--green-light);border:1px solid #b7e4c7;border-radius:999px;padding:4px 12px;font-size:.75rem;color:var(--green2);font-weight:500;margin-bottom:1.25rem}
.hero-h1{font-family:var(--fhead);font-size:clamp(2.4rem,4.5vw,3.6rem);line-height:1.1;letter-spacing:-.02em;margin-bottom:1rem}
.hero-h1 em{color:var(--green);font-style:italic}
.hero-sub{font-size:1.05rem;color:var(--muted);line-height:1.7;margin-bottom:2rem;font-weight:300;max-width:440px}
.hero-cta{display:flex;gap:10px;flex-wrap:wrap}
.hero-stats{display:flex;gap:2rem;margin-top:2.5rem;flex-wrap:wrap}
.hv{font-family:var(--fhead);font-size:1.75rem;color:var(--green);font-style:italic}
.hl{font-size:.75rem;color:var(--muted);margin-top:1px}
.hero-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5rem;box-shadow:0 4px 32px rgba(0,0,0,.07)}
.hero-card-tag{font-size:.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:.75rem}
.hero-card h3{font-family:var(--fhead);font-size:1.15rem;margin-bottom:1.25rem;font-style:italic}
.result-row{display:flex;justify-content:space-between;align-items:baseline;padding:7px 0;border-bottom:1px solid var(--border)}
.result-row:last-child{border-bottom:none}
.rl{font-size:.8rem;color:var(--muted)}.rv{font-size:.92rem;font-weight:500}
.rv.g{color:var(--green2)}.rv.go{color:var(--gold)}
.feats-sec{background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:3.5rem 2rem}
.feats-inner{max-width:1100px;margin:0 auto}
.sec-lbl{font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--green2);font-weight:500;margin-bottom:.5rem}
.sec-title{font-family:var(--fhead);font-size:clamp(1.6rem,3vw,2.2rem);font-style:italic;margin-bottom:2.5rem}
.feats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.25rem}
.feat{border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5rem;background:var(--bg);transition:border-color .2s,transform .2s}
.feat:hover{border-color:var(--green3);transform:translateY(-2px)}
.feat-num{font-family:var(--fhead);font-size:2rem;color:var(--green3);font-style:italic;line-height:1;margin-bottom:.75rem}
.feat h3{font-size:.95rem;font-weight:500;margin-bottom:.4rem}
.feat p{font-size:.82rem;color:var(--muted);line-height:1.55}
.pts-tag{display:inline-block;background:var(--gold-light);color:var(--gold);font-size:.72rem;font-weight:500;border-radius:999px;padding:2px 10px;margin-top:.75rem;border:1px solid #fde68a}
.steps-sec{padding:3.5rem 2rem;max-width:1100px;margin:0 auto}
.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0}
.step{padding:1.5rem 1.25rem;text-align:center}
.step-num{width:36px;height:36px;border-radius:50%;background:var(--green-light);color:var(--green2);font-family:var(--fhead);font-size:1.1rem;font-style:italic;display:flex;align-items:center;justify-content:center;margin:0 auto .75rem}
.step h4{font-size:.9rem;font-weight:500;margin-bottom:.35rem}
.step p{font-size:.78rem;color:var(--muted);line-height:1.5}
.cta-sec{background:var(--green);color:#fff;padding:4rem 2rem;text-align:center}
.cta-sec h2{font-family:var(--fhead);font-size:clamp(1.8rem,3.5vw,2.8rem);font-style:italic;margin-bottom:.75rem}
.cta-sec p{font-size:1rem;opacity:.85;margin-bottom:2rem;font-weight:300}

/* PAGES */
.page{flex:1;max-width:1000px;margin:0 auto;width:100%;padding:2rem}
.auth-wrap{max-width:400px;margin:3rem auto}
.auth-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:2rem}
.auth-card h2{font-family:var(--fhead);font-size:1.5rem;font-style:italic;margin-bottom:.3rem}
.auth-sub{color:var(--muted);font-size:.85rem;margin-bottom:1.75rem}
.field{margin-bottom:1rem}
.field label{display:block;font-size:.75rem;font-weight:500;color:var(--muted);margin-bottom:5px;text-transform:uppercase;letter-spacing:.06em}
.field input,.field select{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:9px 13px;color:var(--text);font-family:var(--fbody);font-size:.875rem;transition:border-color .15s}
.field input:focus,.field select:focus{outline:none;border-color:var(--green2);box-shadow:0 0 0 3px rgba(64,145,108,.12)}
.bonus-note{background:var(--green-light);border:1px solid #b7e4c7;border-radius:8px;padding:9px 13px;font-size:.8rem;color:var(--green2);margin-bottom:1.25rem}
.auth-switch{text-align:center;margin-top:1.25rem;font-size:.82rem;color:var(--muted)}
.auth-switch button{background:none;border:none;color:var(--green2);cursor:pointer;font-size:inherit;font-family:inherit;font-weight:500;text-decoration:underline}

/* DASH */
.dash-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2rem;flex-wrap:wrap;gap:1rem}
.dash-hello{font-family:var(--fhead);font-size:1.8rem;font-style:italic}
.dash-hello em{color:var(--green)}
.pts-display{background:var(--gold-light);border:1px solid #fde68a;border-radius:var(--radius-lg);padding:1rem 1.5rem;text-align:center;min-width:130px}
.pts-big{font-family:var(--fhead);font-size:2.2rem;color:var(--gold);font-style:italic;line-height:1}
.pts-lbl{font-size:.7rem;color:var(--gold);text-transform:uppercase;letter-spacing:.08em;margin-top:3px}
.tasks{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;margin-bottom:2rem}
.task-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem;display:flex;flex-direction:column;gap:.75rem;transition:border-color .2s}
.task-card:hover:not(.done){border-color:var(--green3)}
.task-card.done{opacity:.5;pointer-events:none}
.task-top{display:flex;align-items:center;gap:10px}
.task-ico{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;background:var(--green-light)}
.task-name{font-size:.9rem;font-weight:500}
.task-desc{font-size:.78rem;color:var(--muted);line-height:1.5}
.task-foot{display:flex;align-items:center;justify-content:space-between}
.task-pts{font-size:.78rem;font-weight:500;color:var(--gold)}
.done-badge{background:var(--green-light);color:var(--green2);border-radius:999px;padding:3px 10px;font-size:.75rem;font-weight:500}
.ref-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem;margin-bottom:1rem}
.ref-box h3{font-family:var(--fhead);font-size:1rem;font-style:italic;margin-bottom:.25rem}
.ref-box p{font-size:.8rem;color:var(--muted);margin-bottom:.875rem}
.ref-row{display:flex;gap:8px}
.ref-code{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:9px 13px;font-family:monospace;font-size:.875rem;color:var(--green2);letter-spacing:.08em}
.copy-btn{background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:9px 14px;color:var(--muted);cursor:pointer;font-size:.78rem;transition:all .15s;white-space:nowrap;font-family:var(--fbody)}
.copy-btn:hover{border-color:var(--green2);color:var(--green2)}
.history{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden}
.hist-row{display:flex;justify-content:space-between;align-items:center;padding:9px 14px;border-bottom:1px solid var(--border);font-size:.82rem}
.hist-row:last-child{border-bottom:none}
.h-pts{font-weight:500;color:var(--gold)}.h-pts.neg{color:var(--danger)}
.divider{border:none;border-top:1px solid var(--border);margin:1.5rem 0}
.stitle{font-family:var(--fhead);font-size:1.1rem;font-style:italic;margin-bottom:.875rem}

/* CALC */
.calc-layout{display:grid;grid-template-columns:1fr 1.5fr;gap:1.5rem;align-items:start}
@media(max-width:640px){.calc-layout{grid-template-columns:1fr}}
.calc-form{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5rem}
.calc-form h2{font-family:var(--fhead);font-size:1.2rem;font-style:italic;margin-bottom:1.25rem}
.cost-note{display:flex;align-items:center;gap:6px;background:var(--gold-light);border:1px solid #fde68a;border-radius:8px;padding:8px 12px;font-size:.78rem;color:var(--gold);margin-bottom:1.25rem}
.chat-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);display:flex;flex-direction:column;height:500px}
.chat-hdr{padding:.875rem 1.25rem;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
.ai-pulse{width:8px;height:8px;border-radius:50%;background:var(--green2);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
.chat-hdr-name{font-size:.875rem;font-weight:500}
.chat-hdr-pts{margin-left:auto;font-size:.75rem;color:var(--muted)}
.chat-msgs{flex:1;overflow-y:auto;padding:1.25rem;display:flex;flex-direction:column;gap:.875rem}
.msg{max-width:86%;padding:9px 13px;border-radius:12px;font-size:.85rem;line-height:1.6}
.msg.ai{background:var(--surface2);border:1px solid var(--border);align-self:flex-start;border-bottom-left-radius:3px}
.msg.user{background:var(--green-light);border:1px solid #b7e4c7;color:var(--green2);align-self:flex-end;border-bottom-right-radius:3px}
.msg.loading{display:flex;gap:5px;align-items:center}
.dot{width:6px;height:6px;border-radius:50%;background:var(--hint);animation:bou 1.2s infinite}
.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
@keyframes bou{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
.chat-inp{padding:.75rem 1rem;border-top:1px solid var(--border);display:flex;gap:8px}
.chat-inp input{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--text);font-family:var(--fbody);font-size:.85rem}
.chat-inp input:focus{outline:none;border-color:var(--green2)}
.lock-veil{position:absolute;inset:0;background:rgba(247,245,240,.9);border-radius:var(--radius-lg);backdrop-filter:blur(3px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.75rem;text-align:center;padding:1.5rem;z-index:10}
.lock-veil h3{font-family:var(--fhead);font-size:1.1rem;font-style:italic}
.lock-veil p{font-size:.8rem;color:var(--muted)}
.qq{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:7px 11px;font-size:.77rem;color:var(--muted);cursor:pointer;text-align:left;font-family:var(--fbody);transition:border-color .15s;line-height:1.4;width:100%}
.qq:hover:not(:disabled){border-color:var(--green2);color:var(--green2)}
.qq:disabled{opacity:.4;cursor:not-allowed}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(4px)}
.modal{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:2rem;max-width:400px;width:90%}
.modal h3{font-family:var(--fhead);font-size:1.2rem;font-style:italic;margin-bottom:.4rem}
.modal p{color:var(--muted);font-size:.85rem;margin-bottom:1.25rem}
.ad-box{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem;margin-bottom:1rem}
.ad-lbl{font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--hint)}
.prog{width:100%;height:4px;background:var(--border);border-radius:999px;overflow:hidden;margin-bottom:.5rem}
.prog-fill{height:100%;background:var(--green2);border-radius:999px;transition:width .2s}
.timer{font-size:.78rem;color:var(--muted);text-align:center}
.verify-input{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--text);font-family:var(--fbody);font-size:.875rem;margin-top:6px}
.verify-input:focus{outline:none;border-color:var(--green2)}
.toast{position:fixed;bottom:2rem;right:2rem;background:var(--green);color:#fff;border-radius:var(--radius);padding:11px 18px;font-size:.85rem;z-index:999;animation:toastIn .3s ease;box-shadow:0 4px 20px rgba(45,106,79,.3)}
@keyframes toastIn{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
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
  const [msgs, setMsgs] = useState([{ role: "assistant", content: "Сайн байна уу! Би таны нарны системийн тооцоог хийхэд тусална.\n\nГэрийнхээ мэдээллийг оруулаад «Тооцоолох» дарна уу, эсвэл шууд асуулт бичнэ үү." }]);
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

        {/* NAV */}
        <nav className="nav">
          <div className="logo" onClick={() => setPage("landing")}>☀ Solar<span>Ease</span></div>
          <div className="nav-right">
            {user ? (
              <>
                <div className="pts-pill">{user.points} оноо</div>
                <button className="btn btn-ghost btn-sm" onClick={() => setPage("dash")}>Хяналт</button>
                <button className="btn btn-primary btn-sm" onClick={() => setPage("calc")}>Тооцоолол</button>
              </>
            ) : (
              <>
                <button className="btn btn-ghost btn-sm" onClick={() => { setAuthMode("login"); setPage("auth"); }}>Нэвтрэх</button>
                <button className="btn btn-primary btn-sm" onClick={() => { setAuthMode("register"); setPage("auth"); }}>Бүртгүүлэх</button>
              </>
            )}
          </div>
        </nav>

        {/* LANDING */}
        {page === "landing" && (
          <div className="landing">
            <div className="hero">
              <div>
                <div className="hero-eyebrow">☀ Дорноговь аймаг · 2025</div>
                <h1 className="hero-h1">Нарны цахилгааныг <em>хялбар</em> болгоё</h1>
                <p className="hero-sub">Карбон механизм, ногоон зээл ашиглан нарны системийн тооцоогоо AI туслахаар хий. Урьдчилгаа мөнгөгүй, сарын төлбөрөөр.</p>
                <div className="hero-cta">
                  <button className="btn btn-primary" onClick={() => { setAuthMode("register"); setPage("auth"); }}>Үнэгүй эхлэх →</button>
                  <button className="btn btn-outline" onClick={() => { setAuthMode("register"); setPage("auth"); }}>Тооцоо үзэх</button>
                </div>
                <div className="hero-stats">
                  {[["~22 сар","буцаан төлөх"],["343₮/kWh","экспортын тариф"],["20%","карбон хөнгөлөлт"]].map(([v,l]) => (
                    <div key={l}><div className="hv">{v}</div><div className="hl">{l}</div></div>
                  ))}
                </div>
              </div>
              <div>
                <div className="hero-card">
                  <div className="hero-card-tag">Жишээ тооцоо · 5kW систем</div>
                  <h3>Дорноговь, Сайншанд</h3>
                  {[
                    ["Суурилуулалтын зардал","13,500,000₮",""],
                    ["Карбон хөнгөлөлт (20%)","−2,700,000₮","g"],
                    ["Цэвэр хөрөнгө оруулалт","10,800,000₮",""],
                    ["Сарын зээлийн төлбөр","~194,000₮",""],
                    ["Сарын нийт орлого","~333,000₮","g"],
                    ["Буцаан төлөх хугацаа","~22 сар","go"],
                  ].map(([l,v,c]) => (
                    <div className="result-row" key={l}>
                      <span className="rl">{l}</span>
                      <span className={`rv ${c}`}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="feats-sec">
              <div className="feats-inner">
                <div className="sec-lbl">Хэрхэн ажилладаг вэ</div>
                <div className="sec-title">Оноо цуглуулж, AI-аар тооцоолно</div>
                <div className="feats">
                  {[
                    ["01","Бүртгүүлэх","Бүртгэлийн урамшуулал 50 оноо автоматаар нэмэгдэнэ","+50 оноо"],
                    ["02","Сурталчилгаа үзэх","30 секундын видео үзэж оноо нэм — өдөрт 5 удаа","+10 оноо"],
                    ["03","Найз урих","Таны кодоор бүртгүүлсэн найз тутамд","+25 оноо"],
                    ["04","AI тооцоолол","Оноогоороо нарны системийн дэлгэрэнгүй тооцоог хий","30 оноо/асуулт"],
                  ].map(([n,t,d,p]) => (
                    <div className="feat" key={n}>
                      <div className="feat-num">{n}</div>
                      <h3>{t}</h3><p>{d}</p>
                      <div className="pts-tag">{p}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="steps-sec">
              <div className="sec-lbl">Алхамууд</div>
              <div className="sec-title">3 алхамаар нарны цахилгаантай болно</div>
              <div className="steps">
                {[
                  ["1","Тооцоолол хий","Гэрийнхээ мэдээллийг оруулаад AI-аар тооцоо гарга"],
                  ["2","Зээл хүс","SolarEase-ээр дамжуулан Хаан Банкны ногоон зээл хүс"],
                  ["3","Суурилуулалт","Rentech, G Power-тай холбогдож угсралтаа хий"],
                ].map(([n,t,d]) => (
                  <div className="step" key={n}>
                    <div className="step-num">{n}</div>
                    <h4>{t}</h4><p>{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="cta-sec">
              <h2>Өнөөдөр эхэл</h2>
              <p>Бүртгүүлж 50 оноо аваад анхны тооцоогоо хий</p>
              <button className="btn btn-white" onClick={() => { setAuthMode("register"); setPage("auth"); }}>Үнэгүй бүртгүүлэх →</button>
            </div>
          </div>
        )}

        {/* AUTH */}
        {page === "auth" && (
          <div className="page">
            <div className="auth-wrap">
              <div className="auth-card">
                <h2>{authMode === "register" ? "Бүртгэл үүсгэх" : "Нэвтрэх"}</h2>
                <p className="auth-sub">{authMode === "register" ? "Бүртгүүлж тооцоо хийж эхэл" : "Тавтай морил"}</p>
                {authMode === "register" && <div className="bonus-note">🎁 Бүртгүүлснийхээ шагнал 50 оноо автоматаар нэмэгдэнэ</div>}
                <form onSubmit={handleAuth}>
                  <div className="field"><label>Нэр</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Таны нэр" required/></div>
                  <div className="field"><label>Имэйл</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="example@gmail.com" required/></div>
                  <div className="field"><label>Нууц үг</label><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" required/></div>
                  {authMode === "register" && <div className="field"><label>Урилгын код (заавал биш)</label><input value={refIn} onChange={e=>setRefIn(e.target.value)} placeholder="SE-XXX..."/></div>}
                  <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",marginTop:".25rem"}} type="submit">
                    {authMode === "register" ? "Бүртгүүлэх" : "Нэвтрэх"}
                  </button>
                </form>
                <div className="auth-switch">
                  {authMode === "register" ? <>Бүртгэлтэй юу? <button onClick={()=>setAuthMode("login")}>Нэвтрэх</button></> : <>Бүртгэлгүй юу? <button onClick={()=>setAuthMode("register")}>Бүртгүүлэх</button></>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {page === "dash" && user && (
          <div className="page">
            <div className="dash-header">
              <div>
                <div style={{fontSize:".75rem",color:"var(--muted)",marginBottom:"3px",textTransform:"uppercase",letterSpacing:".06em"}}>Тавтай морил</div>
                <div className="dash-hello">Сайн байна уу, <em>{user.name}</em></div>
              </div>
              <div className="pts-display"><div className="pts-big">{user.points}</div><div className="pts-lbl">Нийт оноо</div></div>
            </div>
            <div className="stitle">Оноо цуглуулах</div>
            <div className="tasks">
              <div className={`task-card ${(user.tc.ad||0)>=5?"done":""}`}>
                <div className="task-top"><div className="task-ico">📺</div><div className="task-name">Сурталчилгаа үзэх</div></div>
                <div className="task-desc">30 секунд үзэж оноо ав · {user.tc.ad||0}/5 удаа</div>
                <div className="task-foot"><span className="task-pts">+10 оноо</span>
                  {(user.tc.ad||0)>=5?<span className="done-badge">✓ Дууссан</span>:<button className="btn btn-primary btn-sm" onClick={startAd}>Үзэх</button>}
                </div>
              </div>
              <div className={`task-card ${user.verified?"done":""}`}>
                <div className="task-top"><div className="task-ico">✅</div><div className="task-name">Бүртгэл баталгаажуулах</div></div>
                <div className="task-desc">Утасны дугаар оруулж нэмэлт оноо ав</div>
                {!user.verified && vStep < 2 && <input className="verify-input" value={vStep===0?vPhone:vCode} onChange={e=>vStep===0?setVPhone(e.target.value):setVCode(e.target.value)} placeholder={vStep===0?"Утасны дугаар":"4 оронтой код"}/>}
                <div className="task-foot"><span className="task-pts">+50 оноо</span>
                  {user.verified?<span className="done-badge">✓ Баталгаажсан</span>:<button className="btn btn-outline btn-sm" onClick={handleVerify}>{vStep===0?"Код авах":"Баталгаажуулах"}</button>}
                </div>
              </div>
              <div className="task-card">
                <div className="task-top"><div className="task-ico">👥</div><div className="task-name">Найз урих</div></div>
                <div className="task-desc">Таны кодоор нэгдсэн найз тутамд · {user.tc.invite||0} найз нэгдсэн</div>
                <div className="task-foot"><span className="task-pts">+25 оноо/найз</span><button className="btn btn-ghost btn-sm" onClick={copyRef}>{copied?"✓ Хуулагдлаа":"Урих"}</button></div>
              </div>
              <div className="task-card" style={{borderColor:"var(--green3)",cursor:"pointer"}} onClick={()=>setPage("calc")}>
                <div className="task-top"><div className="task-ico">🤖</div><div className="task-name">AI Тооцоолол</div></div>
                <div className="task-desc">Нарны системийн тооцоогоо хий · {Math.floor(user.points/COST)}+ асуулт боломжтой</div>
                <div className="task-foot"><span className="task-pts">30 оноо/асуулт</span><button className="btn btn-primary btn-sm">Нээх →</button></div>
              </div>
            </div>
            <hr className="divider"/>
            <div className="ref-box">
              <h3>Найз урих холбоос</h3>
              <p>Найз тань таны кодоор бүртгүүлэхэд хоёулдаа +25 оноо авна</p>
              <div className="ref-row"><div className="ref-code">{user.refCode}</div><button className="copy-btn" onClick={copyRef}>{copied?"✓ Хуулагдлаа":"📋 Хуулах"}</button></div>
            </div>
            {history.length > 0 && (<>
              <hr className="divider"/>
              <div className="stitle">Оноoны түүх</div>
              <div className="history">
                {history.slice(0,8).map((h,i)=>(
                  <div className="hist-row" key={i}>
                    <span style={{color:"var(--muted)"}}>{h.desc}</span>
                    <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                      <span style={{fontSize:".72rem",color:"var(--hint)"}}>{h.t}</span>
                      <span className={`h-pts ${h.pts<0?"neg":""}`}>{h.pts>0?"+":""}{h.pts}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>)}
          </div>
        )}

        {/* CALCULATOR */}
        {page === "calc" && user && (
          <div className="page">
            <div style={{marginBottom:"1.5rem"}}>
              <div className="stitle">☀ AI Нарны Тооцоолол</div>
              <p style={{fontSize:".85rem",color:"var(--muted)"}}>
                Асуулт бүрт 30 оноо · Үлдэгдэл: <strong style={{color:"var(--gold)"}}>{user.points} оноо</strong>
                {" · "}<button className="btn btn-ghost btn-sm" onClick={()=>setPage("dash")}>Оноо нэмэх</button>
              </p>
            </div>
            <div className="calc-layout">
              {/* Form */}
              <div className="calc-form">
                <h2>Гэрийн мэдээлэл</h2>
                {!canCalc && <div style={{background:"var(--danger-light)",border:"1px solid #fecaca",borderRadius:"8px",padding:"9px 12px",fontSize:".78rem",color:"var(--danger)",marginBottom:"1rem"}}>Оноо хүрэлцэхгүй — дашбоард руу очиж нэм.</div>}
                <div className="field"><label>Талбай (м²)</label><input value={area} onChange={e=>setArea(e.target.value)} placeholder="87"/></div>
                <div className="field"><label>Халаалт</label>
                  <select value={heat} onChange={e=>setHeat(e.target.value)}>
                    <option value="electric">Цахилгаан халаалт</option>
                    <option value="coal">Нүүрс халаалт</option>
                    <option value="central">Төвийн халаалт</option>
                  </select>
                </div>
                <div className="field"><label>Сарын цахилгааны зардал (₮)</label><input value={monthly} onChange={e=>setMonthly(e.target.value)} placeholder="150000"/></div>
                <div className="cost-note">🟡 Тооцооллын өртөг: 30 оноо</div>
                <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={autoCalc} disabled={!canCalc||loading}>
                  {loading?"Тооцоолж байна...":"AI-аар тооцоо гарга →"}
                </button>
                <div style={{marginTop:"1.25rem",display:"flex",flexDirection:"column",gap:"6px"}}>
                  <div style={{fontSize:".75rem",color:"var(--muted)",marginBottom:"2px",textTransform:"uppercase",letterSpacing:".06em"}}>Хурдан асуулт</div>
                  {[
                    "10kW системийн хөрөнгө нөхөх хугацааг тооцоол",
                    "Карбон механизмгүй бол тооцоо хэрхэн өөрчлөгдөх вэ?",
                    "100 айлын нарны системд хэдий хөрөнгө шаардлагатай вэ?",
                  ].map(q=>(
                    <button key={q} className="qq" onClick={()=>sendMsg(null,q)} disabled={!canCalc||loading}>{q}</button>
                  ))}
                </div>
              </div>

              {/* Chat */}
              <div style={{position:"relative"}}>
                <div className="chat-box">
                  <div className="chat-hdr">
                    <div className="ai-pulse"/>
                    <span className="chat-hdr-name">SolarEase AI</span>
                    <span className="chat-hdr-pts">{user.points} оноо үлдсэн</span>
                  </div>
                  <div className="chat-msgs">
                    {msgs.map((m,i)=>(
                      <div key={i} className={`msg ${m.role==="assistant"?"ai":"user"}`} style={{whiteSpace:"pre-wrap"}}>{m.content}</div>
                    ))}
                    {loading && <div className="msg ai loading"><div className="dot"/><div className="dot"/><div className="dot"/></div>}
                    <div ref={msgEnd}/>
                  </div>
                  <form className="chat-inp" onSubmit={sendMsg}>
                    <input value={input} onChange={e=>setInput(e.target.value)} placeholder={canCalc?"Асуулт бичнэ үү...":"Оноо хүрэлцэхгүй"} disabled={!canCalc||loading}/>
                    <button className="btn btn-primary btn-sm" type="submit" disabled={!canCalc||!input.trim()||loading}>→</button>
                  </form>
                </div>
                {!canCalc && (
                  <div className="lock-veil">
                    <h3>Оноо хүрэлцэхгүй</h3>
                    <p>{COST} оноо шаардлагатай</p>
                    <button className="btn btn-primary btn-sm" onClick={()=>setPage("dash")}>Оноо цуглуулах →</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AD MODAL */}
        {adModal && (
          <div className="modal-bg">
            <div className="modal">
              <h3>Сурталчилгаа үзэх</h3>
              <p>30 секунд үзсэний дараа +10 оноо нэмэгдэнэ</p>
              <div className="ad-box">
                <div className="ad-lbl">Сурталчилгаа · {Math.round(30-adProg*.3)}с үлдлээ</div>
                <div style={{fontSize:"2rem"}}>☀</div>
                <div style={{fontSize:".78rem",color:"var(--muted)"}}>Дорноговь Нарны Парк · 2025</div>
              </div>
              <div className="prog"><div className="prog-fill" style={{width:`${adProg}%`}}/></div>
              <div className="timer">{adRunning?"Үзэж байна...":"Дууслаа!"}</div>
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
