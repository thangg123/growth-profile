import { useState, useEffect, useCallback } from "react";

/* ── Components ── */

function RadarChart({ skills, size = 320 }) {
  const c = size / 2, r = size * 0.36, n = skills.length;
  const a = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const ticks = [20, 40, 60, 80, 100];
  const pts = skills.map((s, i) => {
    const d = (s.score / 100) * r;
    return { x: c + d * Math.cos(a(i)), y: c + d * Math.sin(a(i)), lx: c + (r + 38) * Math.cos(a(i)), ly: c + (r + 38) * Math.sin(a(i)), s };
  });
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: size }}>
      {ticks.map((t, lv) => {
        const lr = (t / 100) * r;
        return <g key={lv}>
          <polygon points={skills.map((_, i) => `${c + lr * Math.cos(a(i))},${c + lr * Math.sin(a(i))}`).join(" ")} fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth={t === 100 ? 1.5 : 0.5} />
          <text x={c + lr + 2} y={c - 3} fontSize={7} fill="rgba(148,163,184,0.25)" fontFamily="'JetBrains Mono',monospace">{t}</text>
        </g>;
      })}
      {skills.map((_, i) => <line key={i} x1={c} y1={c} x2={c + r * Math.cos(a(i))} y2={c + r * Math.sin(a(i))} stroke="rgba(148,163,184,0.06)" strokeWidth={0.6} />)}
      <polygon points={pts.map(p => `${p.x},${p.y}`).join(" ")} fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth={2.2} style={{ filter: "drop-shadow(0 0 8px rgba(56,189,248,0.25))" }} />
      {pts.map((p, i) => (<g key={i}><circle cx={p.x} cy={p.y} r={5} fill="#0ea5e9" stroke="#0c4a6e" strokeWidth={1.5} /><text x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fill="#94a3b8" fontFamily="'JetBrains Mono',monospace">{p.s.icon}{p.s.score}</text></g>))}
    </svg>
  );
}

function ScoreBar({ score, max = 100, color, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW((score / max) * 100), 80 + delay); return () => clearTimeout(t); }, [score, max, delay]);
  return (
    <div style={{ flex: 1, height: 7, background: "rgba(30,41,59,.7)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${w}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${color}, ${color}99)`, transition: "width .9s cubic-bezier(.34,1.56,.64,1)" }} />
    </div>
  );
}

function TrendBadge({ trend }) {
  const m = { up: { i: "↑", c: "#22c55e", l: "Đang tăng" }, stable: { i: "→", c: "#eab308", l: "Ổn định" }, down: { i: "↓", c: "#ef4444", l: "Giảm" } };
  const t = m[trend] || m.stable;
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 99, background: t.c + "14", color: t.c, fontSize: 11, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>{t.i} {t.l}</span>;
}

function ScoreRing({ score, color, size = 56 }) {
  const stroke = 4, r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  useEffect(() => { const t = setTimeout(() => setOffset(circ - (score / 100) * circ), 200); return () => clearTimeout(t); }, [score, circ]);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(30,41,59,.8)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s cubic-bezier(.34,1.56,.64,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="mono" style={{ fontSize: 14, fontWeight: 700, color }}>{score}</span>
      </div>
    </div>
  );
}

const scoreColor = (s) => s >= 80 ? "#22c55e" : s >= 60 ? "#0ea5e9" : s >= 40 ? "#f59e0b" : "#ef4444";
const catCol = { core: "#0ea5e9", growth: "#f59e0b", emerging: "#a78bfa" };
const prioCol = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };

/* ── Main App ── */

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("overview");
  const [expSkill, setExpSkill] = useState(null);
  const [selPath, setSelPath] = useState(null);

  // Fetch data from /data.json (public folder)
  useEffect(() => {
    fetch("/data.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((json) => { setData(json); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#060a14", color: "#e2e8f0" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12, animation: "pulse 1.5s infinite" }}>⚡</div>
        <div className="mono" style={{ fontSize: 13, opacity: .5 }}>Đang tải hồ sơ...</div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );

  if (error || !data) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#060a14", color: "#ef4444", fontFamily: "'JetBrains Mono',monospace", fontSize: 14 }}>
      ❌ Không tải được data.json — {error}
    </div>
  );

  const overall = Math.round(data.skills.reduce((s, k) => s + k.score, 0) / data.skills.length);
  const core = data.skills.filter(s => s.category === "core");
  const growth = data.skills.filter(s => s.category === "growth");
  const emerging = data.skills.filter(s => s.category === "emerging");
  const doneCount = data.weeklyActions.filter(a => a.done).length;
  const bestPath = data.careerPaths.reduce((a, b) => a.fit > b.fit ? a : b);
  const tabItems = [{ id: "overview", l: "Tổng quan", i: "◉" }, { id: "skills", l: "Chi tiết năng lực", i: "◈" }, { id: "career", l: "Career Path", i: "◇" }, { id: "actions", l: "Hành động", i: "◆" }];

  return (
    <div style={{ minHeight: "100vh", background: "#060a14", color: "#e2e8f0", fontFamily: "'Outfit','Be Vietnam Pro',sans-serif" }}>
      <style>{CSS}</style>

      {/* ═══ HEADER ═══ */}
      <header className="header">
        <div className="header-glow1" /><div className="header-glow2" />
        <div className="container header-inner">
          <div className="header-top">
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div className="avatar">T</div>
              <div>
                <h1 className="title">Thang's Dev Profile</h1>
                <p className="mono subtitle">PM / PO / Builder · Arena Billiard</p>
              </div>
            </div>
            <div className="ai-badge">
              <div className="ai-dot" />
              <span className="mono" style={{ fontSize: 11, color: "#0ea5e9", fontWeight: 500 }}>Phân tích bởi {data.analyst}</span>
            </div>
          </div>
          <div className="stats-grid">
            {[
              { label: "ĐIỂM TRUNG BÌNH", value: `${overall}`, unit: "/100", color: scoreColor(overall), sub: `${data.skills.length} năng lực` },
              { label: "CẬP NHẬT GẦN NHẤT", value: data.lastUpdated, unit: "", color: "#a78bfa", sub: data.analyst },
              { label: "HÀNH ĐỘNG TUẦN", value: `${doneCount}/${data.weeklyActions.length}`, unit: "", color: "#22c55e", sub: doneCount === 0 ? "Chưa bắt đầu" : doneCount === data.weeklyActions.length ? "Hoàn thành!" : "Đang tiến hành" },
              { label: "CAREER FIT CAO NHẤT", value: `${bestPath.fit}`, unit: "%", color: "#f59e0b", sub: bestPath.name.split("→")[0].trim() }
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="mono stat-label">{s.label}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                  <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
                  {s.unit && <span className="mono" style={{ fontSize: 12, color: "#475569" }}>{s.unit}</span>}
                </div>
                <div className="mono stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ═══ TABS ═══ */}
      <nav className="tab-bar">
        <div className="container tab-inner">
          {tabItems.map(t => <button key={t.id} onClick={() => setTab(t.id)} className={`tab-btn ${tab === t.id ? "active" : ""}`}><span style={{ fontSize: 15 }}>{t.i}</span>{t.l}</button>)}
        </div>
      </nav>

      {/* ═══ CONTENT ═══ */}
      <main className="container main-content">

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="overview-grid">
            <div className="radar-panel">
              <div className="mono" style={{ fontSize: 11, color: "#475569", letterSpacing: ".06em", marginBottom: 4 }}>NĂNG LỰC RADAR</div>
              <div className="mono" style={{ fontSize: 10, color: "#334155", marginBottom: 16 }}>Claude AI · Thang điểm 100 · {data.lastUpdated}</div>
              <RadarChart skills={data.skills} size={300} />
              <div style={{ marginTop: 18, display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap" }}>
                {[{ l: "Core", c: "#0ea5e9" }, { l: "Growth", c: "#f59e0b" }, { l: "Emerging", c: "#a78bfa" }].map(x => (
                  <div key={x.l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: x.c }} /><span style={{ fontSize: 11, color: "#64748b" }}>{x.l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {[{ title: "Core Skills", skills: core, color: "#0ea5e9", emoji: "🔵" },
                { title: "Growth Areas", skills: growth, color: "#f59e0b", emoji: "🟡" },
                { title: "Emerging", skills: emerging, color: "#a78bfa", emoji: "🟣" }
              ].map((g, gi) => (
                <div key={gi} style={{ marginBottom: 28 }}>
                  <div className="mono group-label" style={{ color: g.color }}>{g.emoji} {g.title.toUpperCase()}</div>
                  {g.skills.map((sk, si) => (
                    <div key={sk.id} className="fade-up skill-card" style={{ animationDelay: `${si * 50}ms` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <ScoreRing score={sk.score} color={scoreColor(sk.score)} size={50} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 16 }}>{sk.icon}</span>
                              <span style={{ fontSize: 14, fontWeight: 600 }}>{sk.name}</span>
                            </div>
                            <TrendBadge trend={sk.trend} />
                          </div>
                          <ScoreBar score={sk.score} color={scoreColor(sk.score)} delay={si * 60} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS DETAIL */}
        {tab === "skills" && (
          <div className="skills-grid">
            {data.skills.map((sk, i) => {
              const isExp = expSkill === sk.id;
              const color = scoreColor(sk.score);
              return (
                <div key={sk.id} className="fade-up detail-card" style={{ borderColor: isExp ? color + "30" : undefined, background: isExp ? "rgba(15,23,42,.6)" : undefined, animationDelay: `${i * 40}ms` }}>
                  <button onClick={() => setExpSkill(isExp ? null : sk.id)} className="detail-btn">
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <ScoreRing score={sk.score} color={color} size={52} />
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><span>{sk.icon}</span>{sk.name}</div>
                        <div className="mono" style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{sk.details}</div>
                      </div>
                    </div>
                    <span className={`chevron ${isExp ? "open" : ""}`}>▾</span>
                  </button>
                  {isExp && (
                    <div className="fade-up" style={{ padding: "0 20px 20px" }}>
                      {sk.summary && (
                        <div style={{ background: "rgba(15,23,42,.4)", borderRadius: 8, padding: 12, marginBottom: 16, borderLeft: `3px solid ${color}` }}>
                          <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{sk.summary}</div>
                        </div>
                      )}
                      <div className="evidence-grid">
                        <div>
                          <div className="mono evidence-label">✓ EVIDENCE</div>
                          {sk.evidence.map((e, j) => <div key={j} className="evidence-item">{e}</div>)}
                        </div>
                        <div>
                          <div className="mono next-label">→ NEXT STEPS</div>
                          {sk.nextSteps.map((n, j) => <div key={j} className="next-item">{n}</div>)}
                        </div>
                      </div>
                      <div className="mono" style={{ fontSize: 10, color: "#334155", marginTop: 14, textAlign: "right" }}>Đánh giá bởi {data.analyst} · {data.lastUpdated}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CAREER PATH */}
        {tab === "career" && (
          <div>
            <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 22, lineHeight: 1.7, maxWidth: 720 }}>Dựa trên phân tích năng lực bởi <strong style={{ color: "#0ea5e9" }}>{data.analyst}</strong>, đây là {data.careerPaths.length} career path phù hợp nhất:</p>
            <div className="career-grid">
              {data.careerPaths.map((p, i) => {
                const isSel = selPath === p.id;
                const fc = p.fit >= 80 ? "#22c55e" : p.fit >= 60 ? "#f59e0b" : "#ef4444";
                return (
                  <div key={p.id} onClick={() => setSelPath(isSel ? null : p.id)} className="fade-up path-card" style={{ borderColor: isSel ? fc + "30" : undefined, background: isSel ? "rgba(15,23,42,.65)" : undefined, animationDelay: `${i * 80}ms` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontSize: 28 }}>{p.icon}</span><div style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</div></div>
                      <ScoreRing score={p.fit} color={fc} size={50} />
                    </div>
                    <div style={{ height: 6, background: "rgba(30,41,59,.7)", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${p.fit}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${fc}, ${fc}88)`, transition: "width .8s cubic-bezier(.34,1.56,.64,1)" }} /></div>
                    {isSel && (
                      <div className="fade-up" style={{ marginTop: 16 }}>
                        <div style={{ marginBottom: 14 }}>
                          <div className="mono" style={{ fontSize: 11, fontWeight: 600, color: "#22c55e", marginBottom: 8 }}>✓ ĐÃ CÓ</div>
                          <div className="tags">{p.requirements.map((r, j) => <span key={j} className="tag-green">{r}</span>)}</div>
                        </div>
                        <div>
                          <div className="mono" style={{ fontSize: 11, fontWeight: 600, color: "#ef4444", marginBottom: 8 }}>✗ CẦN BỔ SUNG</div>
                          <div className="tags">{p.gaps.map((g, j) => <span key={j} className="tag-red">{g}</span>)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ACTIONS */}
        {tab === "actions" && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <div className="mono" style={{ fontSize: 12, color: "#64748b" }}>Weekly Action Items · {doneCount}/{data.weeklyActions.length}</div>
              <div className="mono" style={{ fontSize: 11, color: "#334155" }}>Gợi ý bởi {data.analyst}</div>
            </div>
            <div style={{ height: 5, background: "rgba(30,41,59,.7)", borderRadius: 3, marginBottom: 18, overflow: "hidden" }}><div style={{ width: `${data.weeklyActions.length > 0 ? (doneCount / data.weeklyActions.length) * 100 : 0}%`, height: "100%", background: "linear-gradient(90deg, #22c55e, #16a34a)", borderRadius: 3, transition: "width .5s ease" }} /></div>
            {data.weeklyActions.map((a, i) => {
              const sk = data.skills.find(s => s.id === a.skill);
              return (
                <div key={a.id} className="fade-up action-item" style={{ opacity: a.done ? .6 : 1, background: a.done ? "rgba(34,197,94,.04)" : undefined, borderColor: a.done ? "rgba(34,197,94,.12)" : undefined, animationDelay: `${i * 40}ms` }}>
                  <div className={`checkbox ${a.done ? "checked" : ""}`}>{a.done && "✓"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 5, textDecoration: a.done ? "line-through" : "none", color: a.done ? "#64748b" : "#e2e8f0" }}>{a.text}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span className="mono prio-badge" style={{ background: (prioCol[a.priority] || "#888") + "14", color: prioCol[a.priority] || "#888" }}>{(a.priority || "").toUpperCase()}</span>
                      {sk && <span style={{ fontSize: 11, color: "#64748b" }}>{sk.icon} {sk.name}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* History */}
        <div className="history-box">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div className="mono" style={{ fontSize: 11, fontWeight: 600, color: "#475569", letterSpacing: ".05em" }}>📝 LỊCH SỬ CẬP NHẬT</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0ea5e9" }} /><span className="mono" style={{ fontSize: 10, color: "#334155" }}>Claude AI Analysis</span></div>
          </div>
          {data.updateHistory.slice(0, 10).map((h, i) => <div key={i} style={{ fontSize: 12, color: "#64748b", padding: "4px 0", display: "flex", gap: 10 }}><span className="mono" style={{ color: "#0ea5e9", flexShrink: 0 }}>{h.date}</span><span>{h.note}</span></div>)}
        </div>

        <div className="footer">
          <div className="mono" style={{ fontSize: 11, color: "#1e293b" }}>Powered by {data.analyst} · Thang điểm /100 · Dữ liệu từ lịch sử hội thoại</div>
        </div>
      </main>
    </div>
  );
}

/* ── CSS ── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Be+Vietnam+Pro:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#060a14;margin:0}
.mono{font-family:'JetBrains Mono',monospace}
.container{max-width:1100px;margin:0 auto}

@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(14,165,233,.12)}50%{box-shadow:0 0 50px rgba(14,165,233,.22)}}
.fade-up{animation:fadeUp .35s ease both}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}

/* Header */
.header{background:linear-gradient(160deg,#080d1a,#0c1425 40%,#0a1020);border-bottom:1px solid rgba(148,163,184,.06);position:relative;overflow:hidden}
.header-glow1{position:absolute;top:-100px;right:10%;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(14,165,233,.04),transparent 70%)}
.header-glow2{position:absolute;bottom:-80px;left:20%;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,.03),transparent 70%)}
.header-inner{padding:32px 28px 24px;position:relative}
.header-top{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:22px}
.avatar{width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#0ea5e9,#6366f1);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#fff;animation:glow 3s infinite;flex-shrink:0}
.title{font-size:22px;font-weight:800;letter-spacing:-.02em}
.subtitle{font-size:12px;color:#64748b;margin-top:2px}
.ai-badge{display:flex;align-items:center;gap:8px;background:rgba(14,165,233,.06);border:1px solid rgba(14,165,233,.12);border-radius:99px;padding:6px 14px}
.ai-dot{width:7px;height:7px;border-radius:50%;background:#0ea5e9;box-shadow:0 0 8px #0ea5e9}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.stat-card{background:rgba(15,23,42,.5);border:1px solid rgba(148,163,184,.06);border-radius:12px;padding:14px 16px}
.stat-label{font-size:10px;color:#475569;letter-spacing:.06em;margin-bottom:6px}
.stat-value{font-size:22px;font-weight:700;font-family:'Outfit',sans-serif}
.stat-sub{font-size:10px;color:#475569;margin-top:2px}

/* Tabs */
.tab-bar{border-bottom:1px solid rgba(148,163,184,.06);background:#060a14;position:sticky;top:0;z-index:20}
.tab-inner{display:flex;padding:0 28px;overflow-x:auto}
.tab-btn{padding:14px 20px;border:none;cursor:pointer;background:transparent;border-bottom:2px solid transparent;color:#475569;font-size:13px;font-weight:600;font-family:'Outfit',sans-serif;transition:all .2s;display:flex;align-items:center;gap:6px;white-space:nowrap}
.tab-btn:hover{color:#94a3b8}
.tab-btn.active{background:rgba(14,165,233,.06);border-bottom-color:#0ea5e9;color:#e2e8f0}

/* Content */
.main-content{padding:24px 28px 60px}

/* Overview */
.overview-grid{display:grid;grid-template-columns:340px 1fr;gap:28px;align-items:start}
.radar-panel{background:rgba(15,23,42,.4);border:1px solid rgba(148,163,184,.06);border-radius:16px;padding:24px;text-align:center;position:sticky;top:80px}
.group-label{font-size:11px;font-weight:600;margin-bottom:12px;letter-spacing:.06em}
.skill-card{background:rgba(15,23,42,.35);border:1px solid rgba(148,163,184,.05);border-radius:12px;padding:16px 18px;margin-bottom:8px;transition:border-color .2s}
.skill-card:hover{border-color:rgba(148,163,184,.12)}

/* Skills detail */
.skills-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.detail-card{background:rgba(15,23,42,.35);border:1px solid rgba(148,163,184,.05);border-radius:14px;overflow:hidden;transition:all .3s}
.detail-btn{width:100%;padding:18px 20px;border:none;cursor:pointer;background:transparent;color:#e2e8f0;text-align:left;display:flex;align-items:center;justify-content:space-between}
.chevron{font-size:16px;color:#475569;transition:transform .2s;flex-shrink:0;margin-left:8px}
.chevron.open{transform:rotate(180deg)}
.evidence-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:16px}
.evidence-label{font-size:11px;font-weight:600;color:#22c55e;margin-bottom:8px;letter-spacing:.05em}
.evidence-item{font-size:12px;color:#94a3b8;padding:5px 0 5px 12px;border-left:2px solid rgba(34,197,94,.15);margin-bottom:3px}
.next-label{font-size:11px;font-weight:600;color:#f59e0b;margin-bottom:8px;letter-spacing:.05em}
.next-item{font-size:12px;color:#94a3b8;padding:5px 0 5px 12px;border-left:2px solid rgba(245,158,11,.15);margin-bottom:3px}

/* Career */
.career-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.path-card{background:rgba(15,23,42,.35);border:1px solid rgba(148,163,184,.05);border-radius:16px;padding:20px;cursor:pointer;transition:all .3s}
.path-card:hover{border-color:rgba(148,163,184,.12)}
.tags{display:flex;flex-wrap:wrap;gap:6px}
.tag-green{padding:4px 12px;border-radius:99px;font-size:12px;background:rgba(34,197,94,.08);color:#22c55e;border:1px solid rgba(34,197,94,.12)}
.tag-red{padding:4px 12px;border-radius:99px;font-size:12px;background:rgba(239,68,68,.08);color:#ef4444;border:1px solid rgba(239,68,68,.12)}

/* Actions */
.action-item{background:rgba(15,23,42,.35);border:1px solid rgba(148,163,184,.05);border-radius:10px;padding:14px 16px;margin-bottom:8px;display:flex;align-items:flex-start;gap:12px;transition:all .2s}
.checkbox{width:24px;height:24px;border-radius:7px;flex-shrink:0;border:2px solid #475569;background:transparent;display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff;margin-top:1px}
.checkbox.checked{border-color:#22c55e;background:#22c55e}
.prio-badge{padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600}

/* History & Footer */
.history-box{background:rgba(15,23,42,.25);border-radius:12px;padding:18px;margin-top:36px;border:1px solid rgba(148,163,184,.04)}
.footer{text-align:center;margin-top:36px;padding:18px 0;border-top:1px solid rgba(148,163,184,.04)}

/* ─── RESPONSIVE ─── */
@media(max-width:900px){
  .skills-grid{grid-template-columns:1fr}
  .career-grid{grid-template-columns:1fr}
}
@media(max-width:768px){
  .stats-grid{grid-template-columns:repeat(2,1fr)}
  .overview-grid{grid-template-columns:1fr}
  .evidence-grid{grid-template-columns:1fr}
  .radar-panel{position:static}
  .tab-btn{padding:10px 12px;font-size:12px}
  .header-inner{padding:24px 16px 20px}
  .tab-inner{padding:0 16px}
  .main-content{padding:16px 16px 40px}
}
@media(max-width:480px){
  .stats-grid{grid-template-columns:1fr 1fr}
  .title{font-size:18px}
}
`;
