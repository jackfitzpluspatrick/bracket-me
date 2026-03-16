const BBALL_METRICS = ['3pt', 'ft', 'reb', 'to', 'pass'];
const DYN_ONLY      = ['mom', 'star', 'leg', 'aca', 'tempo', 'con', 'bal', 'exp'];

const BBALL_LABELS = {
  '3pt': '3PT Shooting', ft: 'Free Throws', reb: 'Rebounding',
  to: 'Turnovers', pass: 'Passing',
};

const PROG_LABELS = {
  mom: 'Momentum', star: 'Star Power', leg: 'Program Legacy',
  aca: 'Academic Prowess', tempo: 'Pace of Play',
  con: 'Consistency', bal: 'Balance', exp: 'Experience',
};

const DYN_POLES = {
  mom:   { neg: 'Building',   pos: 'Hot Streak'  },
  star:  { neg: 'System',     pos: 'Star Power'  },
  leg:   { neg: 'New Blood',  pos: 'Tradition'   },
  aca:   { neg: 'Athletes',   pos: 'Academics'   },
  tempo: { neg: 'Methodical', pos: 'Up-Tempo'    },
  con:   { neg: 'Volatile',   pos: 'Consistent'  },
  bal:   { neg: 'Specialist', pos: 'Balanced'    },
  exp:   { neg: 'Youth',      pos: 'Veterans'    },
};

const CAT_CONFIG = {
  clr:  { label: 'Color',          options: { red: 'Red', blue: 'Blue', other: 'Other' } },
  mas:  { label: 'Mascot',         options: { cats: 'Cats', people: 'People', birds: 'Birds', other: 'Other' } },
  set:  { label: 'Campus Setting', options: { city: 'City', suburban: 'Suburban', rural: 'Rural' } },
  area: { label: 'School Region',  options: { south: 'South', midwest: 'Midwest', east: 'East', west: 'West' } },
  priv: { label: 'School Type',    options: { private: 'Private', public: 'Public' } },
};

export default function ProfilePage({ profile, onContinue }) {
  const odTotal = (profile.od?.off || 0) + (profile.od?.def || 0);
  const offPct  = odTotal > 0 ? Math.round((profile.od?.off || 0) / odTotal * 100) : 50;
  const defPct  = 100 - offPct;

  const absTotal = BBALL_METRICS.reduce((s, m) => s + (profile.abs?.[m] || 0), 0);
  const absPcts  = BBALL_METRICS.map(m => ({
    key: m, label: BBALL_LABELS[m],
    pct: absTotal > 0 ? Math.round((profile.abs?.[m] || 0) / absTotal * 100) : Math.round(100 / BBALL_METRICS.length),
  }));

  const topCat = (group) => Object.entries(profile[group] || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen px-4 py-10 max-w-lg mx-auto">

      {/* Header */}
      <div className="text-center mb-8 animate-fadeIn">
        <h1 className="text-5xl md:text-6xl" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.06em' }}>
          YOUR <span style={{ color: 'var(--accent)' }}>PROFILE</span>
        </h1>
        <p className="mt-2 text-sm tracking-widest uppercase opacity-50" style={{ color: 'var(--net)' }}>
          What your answers say about you
        </p>
      </div>

      {/* Basketball Metrics */}
      <div className="rounded-2xl p-5 mb-4 animate-fadeIn" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,201,176,0.1)' }}>
        <h3 className="text-lg mb-1" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.08em' }}>
          Basketball Metrics
        </h3>
        <p className="text-xs mb-4 opacity-40" style={{ color: 'var(--net)' }}>How you weight on-court performance</p>

        {/* OFF/DEF split */}
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--net)' }}>
            <span>Offensive Efficiency <span style={{ color: 'var(--accent)' }}>{offPct}%</span></span>
            <span>Defensive Efficiency <span style={{ color: 'rgba(100,160,255,0.8)' }}>{defPct}%</span></span>
          </div>
          <div className="h-3 rounded-full overflow-hidden flex" style={{ background: 'rgba(212,201,176,0.1)' }}>
            <div style={{ width: `${offPct}%`, background: 'var(--accent)', transition: 'width 0.5s' }} />
            <div style={{ width: `${defPct}%`, background: 'rgba(100,160,255,0.5)', transition: 'width 0.5s' }} />
          </div>
        </div>

        {/* Stat allocation */}
        <p className="text-xs mb-3 opacity-40" style={{ color: 'var(--net)' }}>Stat allocation</p>
        <div className="flex flex-col gap-2.5">
          {absPcts.map(({ key, label, pct }) => (
            <div key={key}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: 'var(--net)' }}>{label}</span>
                <span style={{ color: 'var(--accent2)' }}>{pct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(212,201,176,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Metrics */}
      <div className="rounded-2xl p-5 mb-4 animate-fadeIn" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,201,176,0.1)' }}>
        <h3 className="text-lg mb-1" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.08em' }}>
          Program Metrics
        </h3>
        <p className="text-xs mb-4 opacity-40" style={{ color: 'var(--net)' }}>Your program preferences and tendencies</p>

        {/* DYN sliders */}
        <p className="text-xs mb-3 opacity-40" style={{ color: 'var(--net)' }}>Directional preferences</p>
        <div className="flex flex-col gap-4">
          {DYN_ONLY.map(m => {
            const val  = profile.dyn?.[m] || 0;
            const pct  = Math.min(Math.abs(val) * 400, 100);
            const isPos = val >= 0;
            const poles = DYN_POLES[m];
            // Position of dot: 50% center, moves left (negative) or right (positive)
            const dotPos = 50 + (val * 200);
            const clampedDot = Math.max(2, Math.min(98, dotPos));
            return (
              <div key={m}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: isPos ? 'rgba(212,201,176,0.35)' : 'var(--net)', fontSize: '11px' }}>{poles.neg}</span>
                  <span style={{ fontFamily: 'Bebas Neue', letterSpacing: '0.06em', color: 'rgba(212,201,176,0.45)', fontSize: '10px' }}>{PROG_LABELS[m]}</span>
                  <span style={{ color: isPos ? 'var(--net)' : 'rgba(212,201,176,0.35)', fontSize: '11px' }}>{poles.pos}</span>
                </div>
                <div className="h-2 rounded-full relative" style={{ background: 'rgba(212,201,176,0.1)' }}>
                  {/* Track fill */}
                  {isPos
                    ? <div className="absolute top-0 bottom-0 rounded-full" style={{ left: '50%', width: `${pct / 2}%`, background: 'var(--accent2)' }} />
                    : <div className="absolute top-0 bottom-0 rounded-full" style={{ right: '50%', width: `${pct / 2}%`, background: 'var(--accent)' }} />
                  }
                  {/* Center tick */}
                  <div className="absolute top-0 bottom-0 w-px" style={{ left: '50%', background: 'rgba(212,201,176,0.3)' }} />
                  {/* Dot */}
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full -translate-x-1/2" style={{
                    left: `${clampedDot}%`,
                    background: isPos ? 'var(--accent2)' : 'var(--accent)',
                    border: '2px solid rgba(0,0,0,0.4)',
                    boxShadow: '0 0 4px rgba(0,0,0,0.4)',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* School Preferences */}
      <div className="rounded-2xl p-5 mb-6 animate-fadeIn" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,201,176,0.1)' }}>
        <h3 className="text-lg mb-1" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.08em' }}>
          School Preferences
        </h3>
        <p className="text-xs mb-4 opacity-40" style={{ color: 'var(--net)' }}>Which programs feel most like you</p>
        <div className="flex flex-col gap-5">
          {Object.entries(CAT_CONFIG).map(([key, config]) => {
            const sorted = topCat(key);
            const topVal = sorted[0]?.[1] || 1;
            return (
              <div key={key}>
                <p className="text-xs mb-2 uppercase tracking-widest" style={{ color: 'var(--accent2)', fontFamily: 'Bebas Neue', fontSize: '10px', letterSpacing: '0.14em' }}>
                  {config.label}
                </p>
                <div className="flex gap-2">
                  {sorted.map(([opt, val]) => {
                    const pct = Math.round(val * 100);
                    const isTop = val === topVal;
                    const barH = Math.max(Math.round((val / topVal) * 40), 6);
                    return (
                      <div key={opt} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex items-end justify-center rounded-lg overflow-hidden" style={{ height: '44px', background: 'rgba(212,201,176,0.06)' }}>
                          <div className="w-full rounded-t-sm transition-all duration-700" style={{
                            height: `${barH}px`,
                            background: isTop ? 'var(--accent2)' : 'rgba(212,201,176,0.2)',
                          }} />
                        </div>
                        <span className="text-center" style={{ color: isTop ? 'var(--chalk)' : 'rgba(212,201,176,0.4)', fontSize: '10px', fontWeight: isTop ? '600' : '400' }}>
                          {config.options[opt] || opt}
                        </span>
                        <span style={{ color: isTop ? 'var(--accent2)' : 'rgba(212,201,176,0.3)', fontSize: '10px' }}>
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue button */}
      <button
        onClick={onContinue}
        className="w-full py-4 rounded-xl font-semibold tracking-widest uppercase text-sm transition-all duration-200 hover:opacity-90"
        style={{ background: 'var(--accent)', color: 'var(--chalk)', letterSpacing: '0.1em' }}
      >
        🏀 Reveal My Champions →
      </button>
    </div>
  );
}
