import { useState, useEffect, useCallback } from "react";
import { INITIAL_DATA } from "./data";
import "./app.css";

const STORAGE_KEY = "thang-dev-profile";

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_DATA;
  } catch { return INITIAL_DATA; }
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

/* ── Radar Chart ── */
function RadarChart({ skills, size = 300 }) {
  const center = size / 2;
  const radius = size * 0.38;
  const levels = 5;
  const n = skills.length;
  const angleOf = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const gridLevels = [...Array(levels)].map((_, lv) => {
    const r = (radius / levels) * (lv + 1);
    return skills.map((_, i) => `${center + r * Math.cos(angleOf(i))},${center + r * Math.sin(angleOf(i))}`).join(" ");
  });

  const points = skills.map((s, i) => {
    const r = (s.score / s.maxScore) * radius;
    return {
      x: center + r * Math.cos(angleOf(i)),
      y: center + r * Math.sin(angleOf(i)),
      lx: center + (radius + 30) * Math.cos(angleOf(i)),
      ly: center + (radius + 30) * Math.sin(angleOf(i)),
      s
    };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="radar-svg">
      {gridLevels.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth={i === levels - 1 ? 1.5 : 0.8} />
      ))}
      {skills.map((_, i) => (
        <line key={i} x1={center} y1={center} x2={center + radius * Math.cos(angleOf(i))} y2={center + radius * Math.sin(angleOf(i))} stroke="rgba(148,163,184,0.1)" strokeWidth={0.8} />
      ))}
      <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeWidth={2} className="radar-polygon" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4.5} fill="#0ea5e9" stroke="#0c4a6e" strokeWidth={1.5} />
          <text x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#94a3b8" className="mono">{p.s.icon} {p.s.score}</text>
        </g>
      ))}
    </svg>
  );
}

/* ── Score Bar ── */
function ScoreBar({ score, max, color, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth((score / max) * 100), 100 + delay);
    return () => clearTimeout(t);
  }, [score, max, delay]);
  return (
    <div className="bar-track">
      <div className="bar-fill" style={{ width: `${width}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
    </div>
  );
}

/* ── Trend Badge ── */
function TrendBadge({ trend }) {
  const m = { up: { i: "↑", c: "#22c55e", l: "Đang tăng" }, stable: { i: "→", c: "#f59e0b", l: "Ổn định" }, down: { i: "↓", c: "#ef4444", l: "Cần cải thiện" } };
  const t = m[trend];
  return <span className="trend-badge" style={{ background: t.c + "18", color: t.c }}>{t.i} {t.l}</span>;
}

/* ── Main App ── */
export default function App() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("overview");
  const [expandedSkill, setExpandedSkill] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editSkill, setEditSkill] = useState(null);
  const [editScore, setEditScore] = useState(0);

  useEffect(() => { setData(loadData()); }, []);

  const persist = useCallback((d) => { setData(d); saveData(d); }, []);

  const toggleAction = useCallback((id) => {
    persist({ ...data, weeklyActions: data.weeklyActions.map(a => a.id === id ? { ...a, done: !a.done } : a) });
  }, [data, persist]);

  const updateSkillScore = useCallback((skillId, newScore) => {
    const today = new Date().toISOString().slice(0, 10);
    const updated = {
      ...data,
      lastUpdated: today,
      skills: data.skills.map(s => s.id === skillId ? { ...s, score: newScore } : s),
      updateHistory: [{ date: today, note: `Cập nhật ${skillId}: ${newScore}/5` }, ...data.updateHistory].slice(0, 20)
    };
    persist(updated);
    setEditSkill(null);
  }, [data, persist]);

  const resetData = useCallback(() => {
    if (confirm("Reset toàn bộ data về mặc định?")) {
      persist(INITIAL_DATA);
    }
  }, [persist]);

  if (!data) return (
    <div className="loading"><div className="loading-icon">⚡</div><div className="loading-text">Loading profile...</div></div>
  );

  const overallScore = (data.skills.reduce((s, sk) => s + sk.score, 0) / data.skills.reduce((s, sk) => s + sk.maxScore, 0) * 100).toFixed(0);
  const coreSkills = data.skills.filter(s => s.category === "core");
  const growthSkills = data.skills.filter(s => s.category === "growth");
  const emergingSkills = data.skills.filter(s => s.category === "emerging");
  const completedActions = data.weeklyActions.filter(a => a.done).length;

  const tabs = [
    { id: "overview", label: "Tổng quan", icon: "◉" },
    { id: "skills", label: "Chi tiết", icon: "◈" },
    { id: "career", label: "Career Path", icon: "◇" },
    { id: "actions", label: "Hành động", icon: "◆" }
  ];

  const catColors = { core: "#0ea5e9", growth: "#f59e0b", emerging: "#a78bfa" };
  const prioColors = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-glow" />
        <div className="header-top">
          <div className="avatar">T</div>
          <div>
            <h1 className="title">Thang's Dev Profile</h1>
            <p className="subtitle mono">PM / PO / Builder · Arena Billiard</p>
          </div>
        </div>
        <div className="stats-grid">
          {[
            { label: "Overall Score", value: `${overallScore}%`, color: "#0ea5e9" },
            { label: "Cập nhật", value: data.lastUpdated, color: "#a78bfa" },
            { label: "Actions Done", value: `${completedActions}/${data.weeklyActions.length}`, color: "#22c55e" }
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-label mono">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Tabs */}
      <nav className="tab-bar">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`tab-btn ${tab === t.id ? "active" : ""}`}>
            <span className="tab-icon">{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="content slide-in">

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <div className="card radar-card">
              <div className="section-label">NĂNG LỰC RADAR</div>
              <RadarChart skills={data.skills} size={280} />
            </div>
            {[
              { title: "🔵 Core Skills", skills: coreSkills, color: "#0ea5e9" },
              { title: "🟡 Growth Areas", skills: growthSkills, color: "#f59e0b" },
              { title: "🟣 Emerging", skills: emergingSkills, color: "#a78bfa" }
            ].map((g, gi) => (
              <div key={gi} className="skill-group">
                <div className="group-label mono" style={{ color: g.color }}>{g.title}</div>
                {g.skills.map((sk, si) => (
                  <div key={sk.id} className="skill-row slide-in" style={{ animationDelay: `${si * 50}ms` }}>
                    <div className="skill-row-top">
                      <div className="skill-name"><span className="skill-icon">{sk.icon}</span>{sk.name}</div>
                      <div className="skill-meta"><TrendBadge trend={sk.trend} /><span className="score mono" style={{ color: g.color }}>{sk.score}/{sk.maxScore}</span></div>
                    </div>
                    <ScoreBar score={sk.score} max={sk.maxScore} color={g.color} delay={si * 60} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* SKILLS DETAIL */}
        {tab === "skills" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
              <button className="edit-toggle" onClick={() => setEditMode(!editMode)}>
                {editMode ? "✓ Xong" : "✏️ Chỉnh sửa điểm"}
              </button>
            </div>
            {data.skills.map((sk, i) => {
              const isExp = expandedSkill === sk.id;
              const color = catColors[sk.category];
              return (
                <div key={sk.id} className={`detail-card ${isExp ? "expanded" : ""}`} style={{ borderColor: isExp ? color + "40" : undefined, animationDelay: `${i * 40}ms` }}>
                  <button className="detail-header" onClick={() => setExpandedSkill(isExp ? null : sk.id)}>
                    <div className="detail-left"><span className="detail-icon">{sk.icon}</span><div><div className="detail-name">{sk.name}</div><div className="detail-desc mono">{sk.details}</div></div></div>
                    <div className="detail-right">
                      {editMode ? (
                        <input type="range" min="0" max="5" step="0.5" value={sk.score}
                          onClick={e => e.stopPropagation()}
                          onChange={e => { e.stopPropagation(); updateSkillScore(sk.id, parseFloat(e.target.value)); }}
                          className="score-slider" />
                      ) : null}
                      <span className="score mono" style={{ color, fontSize: 18 }}>{sk.score}</span>
                      <span className={`chevron ${isExp ? "open" : ""}`}>▾</span>
                    </div>
                  </button>
                  {isExp && (
                    <div className="detail-body slide-in">
                      <ScoreBar score={sk.score} max={sk.maxScore} color={color} />
                      <div className="evidence-section">
                        <div className="evidence-label mono">✓ EVIDENCE</div>
                        {sk.evidence.map((e, j) => <div key={j} className="evidence-item">{e}</div>)}
                      </div>
                      <div className="next-section">
                        <div className="next-label mono">→ NEXT STEPS</div>
                        {sk.nextSteps.map((n, j) => <div key={j} className="next-item">{n}</div>)}
                      </div>
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
            <p className="career-intro">Dựa trên năng lực hiện tại, đây là 3 career path phù hợp nhất:</p>
            {data.careerPaths.map((path, i) => {
              const isSel = selectedPath === path.id;
              const fc = path.fit >= 80 ? "#22c55e" : path.fit >= 60 ? "#f59e0b" : "#ef4444";
              return (
                <div key={path.id} onClick={() => setSelectedPath(isSel ? null : path.id)} className={`path-card ${isSel ? "selected" : ""}`} style={{ borderColor: isSel ? fc + "40" : undefined, animationDelay: `${i * 80}ms` }}>
                  <div className="path-header">
                    <div className="path-name"><span className="path-icon">{path.icon}</span>{path.name}</div>
                    <div className="path-fit mono" style={{ background: fc + "18", color: fc }}>{path.fit}%</div>
                  </div>
                  <div className="bar-track thin"><div className="bar-fill" style={{ width: `${path.fit}%`, background: `linear-gradient(90deg, ${fc}, ${fc}88)` }} /></div>
                  {isSel && (
                    <div className="path-details slide-in">
                      <div className="tag-section">
                        <div className="tag-label mono" style={{ color: "#22c55e" }}>✓ ĐÃ CÓ</div>
                        <div className="tags">{path.requirements.map((r, j) => <span key={j} className="tag green">{r}</span>)}</div>
                      </div>
                      <div className="tag-section">
                        <div className="tag-label mono" style={{ color: "#ef4444" }}>✗ CẦN BỔ SUNG</div>
                        <div className="tags">{path.gaps.map((g, j) => <span key={j} className="tag red">{g}</span>)}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="insight-box">
              <div className="insight-title">💡 Nhận xét</div>
              <p className="insight-text">
                Profile của Thang nghiêng mạnh về <strong style={{ color: "#a78bfa" }}>Indie Developer / Technical Founder</strong> — kết hợp coding + product sense + tooling mindset. 
                Để unlock hướng này, focus vào: <strong style={{ color: "#f59e0b" }}>Distribution</strong> (viết blog, build audience) và <strong style={{ color: "#f59e0b" }}>Ship public product</strong>.
              </p>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        {tab === "actions" && (
          <div>
            <div className="action-summary mono">Weekly Action Items · {completedActions}/{data.weeklyActions.length} hoàn thành</div>
            <div className="bar-track thin" style={{ marginBottom: 16 }}>
              <div className="bar-fill" style={{ width: `${(completedActions / data.weeklyActions.length) * 100}%`, background: "linear-gradient(90deg, #22c55e, #16a34a)" }} />
            </div>
            {data.weeklyActions.map((a, i) => {
              const sk = data.skills.find(s => s.id === a.skill);
              return (
                <div key={a.id} onClick={() => toggleAction(a.id)} className={`action-item ${a.done ? "done" : ""}`} style={{ animationDelay: `${i * 40}ms` }}>
                  <div className={`checkbox ${a.done ? "checked" : ""}`}>{a.done && "✓"}</div>
                  <div className="action-content">
                    <div className={`action-text ${a.done ? "completed" : ""}`}>{a.text}</div>
                    <div className="action-meta">
                      <span className="prio-badge" style={{ background: prioColors[a.priority] + "18", color: prioColors[a.priority] }}>{a.priority.toUpperCase()}</span>
                      {sk && <span className="action-skill">{sk.icon} {sk.name}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
            <button onClick={resetData} className="reset-btn">🔄 Reset về mặc định</button>
          </div>
        )}

        {/* Update History */}
        <div className="history-box">
          <div className="history-label mono">📝 LỊCH SỬ CẬP NHẬT</div>
          {data.updateHistory.slice(0, 10).map((h, i) => (
            <div key={i} className="history-row"><span className="history-date mono">{h.date}</span><span>{h.note}</span></div>
          ))}
        </div>
      </main>
    </div>
  );
}
