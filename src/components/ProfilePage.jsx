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
  mom:   { neg: 'Stumbling In',          pos: 'On a Hot Streak'       },
  star:  { neg: 'Cohesive Unit',         pos: 'Individual Talent'     },
  leg:   { neg: 'New Blood',             pos: 'Blue Blood'            },
  aca:   { neg: 'Where\'s the Library?',  pos: 'GPA > PPG'              },
  tempo: { neg: 'Methodical',            pos: 'Fast'                  },
  con:   { neg: 'Volatile',              pos: 'Consistent'            },
  bal:   { neg: 'Specialized',           pos: 'Versatile'             },
  exp:   { neg: 'Whippersnappers',       pos: 'Old-timers'            },
};

const CAT_CONFIG = {
  clr:  { label: 'Color',          options: { red: 'Red', blue: 'Blue', other: 'Other' } },
  mas:  { label: 'Mascot',         options: { cats: 'Cats', people: 'People', birds: 'Birds', other: 'Other' } },
  set:  { label: 'Campus Setting', options: { city: 'City', suburban: 'Suburban', rural: 'Rural' } },
  area: { label: 'School Region',  options: { south: 'South', midwest: 'Midwest', east: 'East', west: 'West' } },
  priv: { label: 'School Type',    options: { private: 'Private', public: 'Public' } },
};

// Map top color preference to an accent color for mascot section
function getColorAccent(profile) {
  const clr = profile.clr || {};
  const sorted = Object.entries(clr).sort((a, b) => b[1] - a[1]);
  const top = sorted[0]?.[0];
  if (top === 'red')  return { bg: 'rgba(220,50,50,0.12)',  border: 'rgba(220,50,50,0.3)',  text: '#e05555' };
  if (top === 'blue') return { bg: 'rgba(60,120,220,0.12)', border: 'rgba(60,120,220,0.3)', text: '#5599ee' };
  return                      { bg: 'rgba(212,201,176,0.08)', border: 'rgba(212,201,176,0.2)', text: 'var(--net)' };
}

export default function ProfilePage({ profile, onContinue }) {
  const odTotal = (profile.od?.off || 0) + (profile.od?.def || 0);
  const offPct  = odTotal > 0 ? Math.round((profile.od?.off || 0) / odTotal * 100) : 50;
  const defPct  = 100 - offPct;

  const absTotal = BBALL_METRICS.reduce((s, m) => s + (profile.abs?.[m] || 0), 0);
  const absPcts  = BBALL_METRICS.map(m => ({
    key: m, label: BBALL_LABELS[m],
    pct: absTotal > 0 ? Math.round((profile.abs?.[m] || 0) / absTotal * 100) : Math.round(100 / BBALL_METRICS.length),
  })).sort((a, b) => b.pct - a.pct);

  // Normalize cat values to sum to 100%
  const topCat = (group) => {
    const entries = Object.entries(profile[group] || {});
    const total = entries.reduce((s, [, v]) => s + v, 0);
    return entries
      .map(([k, v]) => [k, total > 0 ? Math.round(v / total * 100) : Math.round(100 / entries.length)])
      .sort((a, b) => b[1] - a[1]);
  };

  const colorAccent = getColorAccent(profile);

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
        <h3 className="text-lg mb-1" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.08em' }}>Basketball Metrics</h3>
        <p className="text-xs mb-4 opacity-40" style={{ color: 'var(--net)' }}>How you weight on-court performance</p>

        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--net)' }}>
            <span>Offensive <span style={{ color: 'var(--accent)' }}>{offPct}%</span></span>
            <span>Defensive <span style={{ color: 'rgba(100,160,255,0.8)' }}>{defPct}%</span></span>
          </div>
          <div className="h-3 rounded-full overflow-hidden flex" style={{ background: 'rgba(212,201,176,0.1)' }}>
            <div style={{ width: `${offPct}%`, background: 'var(--accent)' }} />
            <div style={{ width: `${defPct}%`, background: 'rgba(100,160,255,0.5)' }} />
          </div>
        </div>

        <p className="text-xs mb-3 opacity-40" style={{ color: 'var(--net)' }}>Stat allocation</p>
        <div className="flex flex-col gap-2.5">
          {absPcts.map(({ key, label, pct }) => (
            <div key={key}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: 'var(--net)' }}>{label}</span>
                <span style={{ color: 'var(--accent2)' }}>{pct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(212,201,176,0.1)' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Metrics */}
      <div className="rounded-2xl p-5 mb-4 animate-fadeIn" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,201,176,0.1)' }}>
        <h3 className="text-lg mb-1" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.08em' }}>Program Metrics</h3>
        <p className="text-xs mb-4 opacity-40" style={{ color: 'var(--net)' }}>Your program preferences and tendencies</p>
        <div className="flex flex-col gap-4">
          {DYN_ONLY.map(m => {
            const val  = profile.dyn?.[m] || 0;
            const pct  = Math.min(Math.abs(val) * 400, 100);
            const isPos = val >= 0;
            const poles = DYN_POLES[m];
            const dotPos = Math.max(2, Math.min(98, 50 + val * 200));
            return (
              <div key={m}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: isPos ? 'rgba(212,201,176,0.35)' : 'var(--net)', fontSize: '11px' }}>{poles.neg}</span>
                  <span style={{ fontFamily: 'Bebas Neue', letterSpacing: '0.06em', color: 'rgba(212,201,176,0.45)', fontSize: '10px' }}>{PROG_LABELS[m]}</span>
                  <span style={{ color: isPos ? 'var(--net)' : 'rgba(212,201,176,0.35)', fontSize: '11px' }}>{poles.pos}</span>
                </div>
                <div className="h-2 rounded-full relative" style={{ background: 'rgba(212,201,176,0.1)' }}>
                  {isPos
                    ? <div className="absolute top-0 bottom-0 rounded-full" style={{ left: '50%', width: `${pct/2}%`, background: 'var(--accent2)' }} />
                    : <div className="absolute top-0 bottom-0 rounded-full" style={{ right: '50%', width: `${pct/2}%`, background: 'var(--accent)' }} />
                  }
                  <div className="absolute top-0 bottom-0 w-px" style={{ left: '50%', background: 'rgba(212,201,176,0.3)' }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full -translate-x-1/2" style={{
                    left: `${dotPos}%`,
                    background: isPos ? 'var(--accent2)' : 'var(--accent)',
                    border: '2px solid rgba(0,0,0,0.4)',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* School Preferences */}
      <div className="rounded-2xl p-5 mb-6 animate-fadeIn" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,201,176,0.1)' }}>
        <h3 className="text-lg mb-1" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.08em' }}>School Preferences</h3>
        <p className="text-xs mb-4 opacity-40" style={{ color: 'var(--net)' }}>Which programs feel most like you</p>
        <div className="flex flex-col gap-5">
          {Object.entries(CAT_CONFIG).map(([key, config]) => {
            const sorted = topCat(key);
            const topPct = sorted[0]?.[1] || 1;
            return (
              <div key={key}>
                <p className="text-xs mb-2 uppercase tracking-widest"
                  style={{ color: colorAccent.text, fontFamily: 'Bebas Neue', fontSize: '10px', letterSpacing: '0.14em' }}>
                  {config.label}
                </p>
                <div className="flex gap-2">
                  {sorted.map(([opt, pct]) => {
                    const isTop = pct === topPct;
                    const barH = Math.max(Math.round((pct / topPct) * 40), 6);
                    return (
                      <div key={opt} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex items-end justify-center rounded-lg overflow-hidden" style={{ height: '44px', background: 'rgba(212,201,176,0.06)' }}>
                          <div className="w-full rounded-t-sm" style={{
                            height: `${barH}px`,
                            background: isTop ? colorAccent.text : 'rgba(212,201,176,0.2)',
                          }} />
                        </div>
                        <span className="text-center" style={{ color: isTop ? 'var(--chalk)' : 'rgba(212,201,176,0.4)', fontSize: '10px', fontWeight: isTop ? '600' : '400' }}>
                          {config.options[opt] || opt}
                        </span>
                        <span style={{ color: isTop ? colorAccent.text : 'rgba(212,201,176,0.3)', fontSize: '10px' }}>
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* School Size */}
          {(() => {
            const sizeProfile = profile.size || { small: 0.333, medium: 0.333, large: 0.334 };
            const total = Object.values(sizeProfile).reduce((s, v) => s + v, 0);
            const sorted = Object.entries(sizeProfile)
              .map(([k, v]) => [k, total > 0 ? Math.round(v / total * 100) : 33])
              .sort((a, b) => b[1] - a[1]);
            const topPct = sorted[0]?.[1] || 1;
            const labels = { small: 'Small', medium: 'Medium', large: 'Large' };
            return (
              <div>
                <p className="text-xs mb-2 uppercase tracking-widest"
                  style={{ color: colorAccent.text, fontFamily: 'Bebas Neue', fontSize: '10px', letterSpacing: '0.14em' }}>
                  School Size
                </p>
                <div className="flex gap-2">
                  {sorted.map(([opt, pct]) => {
                    const isTop = pct === topPct;
                    const barH = Math.max(Math.round((pct / topPct) * 40), 6);
                    return (
                      <div key={opt} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex items-end justify-center rounded-lg overflow-hidden" style={{ height: '44px', background: 'rgba(212,201,176,0.06)' }}>
                          <div className="w-full rounded-t-sm" style={{
                            height: `${barH}px`,
                            background: isTop ? colorAccent.text : 'rgba(212,201,176,0.2)',
                          }} />
                        </div>
                        <span className="text-center" style={{ color: isTop ? 'var(--chalk)' : 'rgba(212,201,176,0.4)', fontSize: '10px', fontWeight: isTop ? '600' : '400' }}>
                          {labels[opt] || opt}
                        </span>
                        <span style={{ color: isTop ? colorAccent.text : 'rgba(212,201,176,0.3)', fontSize: '10px' }}>
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      <button onClick={onContinue}
        className="w-full py-4 rounded-xl font-semibold tracking-widest uppercase text-sm transition-all duration-200 hover:opacity-90"
        style={{ background: 'var(--accent)', color: 'var(--chalk)', letterSpacing: '0.1em' }}>
        🏀 Reveal My Champions →
      </button>
    </div>
  );
}
