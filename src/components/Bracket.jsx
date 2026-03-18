const BBALL_METRICS = ['3pt', 'ft', 'reb', 'to', 'pass'];
const OD_METRICS    = ['off', 'def'];
const PROG_METRICS  = ['mom', 'star', 'leg', 'aca', 'tempo', 'con', 'bal', 'exp'];
const DYN_ONLY      = ['mom', 'star', 'leg', 'aca', 'tempo', 'con', 'bal', 'exp'];

const BBALL_LABELS = {
  off: 'Offensive Efficiency', def: 'Defensive Efficiency',
  '3pt': '3PT Shooting', ft: 'Free Throws', reb: 'Rebounding',
  to: 'Turnovers', pass: 'Passing',
};

const PROG_LABELS = {
  mom: 'Momentum', star: 'Star Power', leg: 'Program Legacy',
  aca: 'Academic Prowess',
  tempo: 'Pace of Play', con: 'Consistency', bal: 'Balance', exp: 'Experience',
};

const REGION_EMOJI = {
  south: '🚀', east: '🏛️', midwest: '🌭', west: '💻',
  fortworth1: '🤠', fortworth3: '🤠', sacramento2: '⛏️', sacramento4: '⛏️',
};
const REGION_NAME = {
  south: 'South Region', east: 'East Region',
  midwest: 'Midwest Region', west: 'West Region',
  fortworth1: 'Region 1 · Fort Worth', fortworth3: 'Region 3 · Fort Worth',
  sacramento2: 'Region 2 · Sacramento', sacramento4: 'Region 4 · Sacramento',
};

const CAT_CONFIG = {
  clr:  { label: 'Color',          options: { red: 'Red', blue: 'Blue', other: 'Other' } },
  mas:  { label: 'Mascot',         options: { cats: 'Cats', people: 'People', birds: 'Birds', other: 'Other' } },
  set:  { label: 'Campus Setting', options: { city: 'City', suburban: 'Suburban', rural: 'Rural' } },
  area: { label: 'School Region',  options: { south: 'South', midwest: 'Midwest', east: 'East', west: 'West' } },
  priv: { label: 'School Type',    options: { private: 'Private', public: 'Public' } },
};

// ── Matchup Card ────────────────────────────────────────────────────
function MatchupCard({ matchup, highlight }) {
  const { teamA, teamB, winner } = matchup;
  return (
    <div className="rounded-lg overflow-hidden text-xs" style={{
      background: 'rgba(255,255,255,0.04)',
      border: highlight ? '1px solid var(--accent2)' : '1px solid rgba(212,201,176,0.1)',
      minWidth: '130px',
    }}>
      {[teamA, teamB].map((team, i) => (
        <div key={team.id} className="flex items-center gap-1.5 px-2 py-1.5" style={{
          background: winner.id === team.id ? 'rgba(245,166,35,0.14)' : 'transparent',
          borderBottom: i === 0 ? '1px solid rgba(212,201,176,0.08)' : 'none',
        }}>
          <span className="font-bold shrink-0 w-4 text-center" style={{ color: 'var(--accent2)', fontFamily: 'Bebas Neue', fontSize: '11px' }}>
            {team.seed}
          </span>
          <span className="truncate" style={{
            color: winner.id === team.id ? 'var(--chalk)' : 'rgba(212,201,176,0.4)',
            fontWeight: winner.id === team.id ? '600' : '400',
            fontSize: '11px',
          }}>
            {team.name}
          </span>
          {winner.id === team.id && <span className="ml-auto shrink-0" style={{ color: 'var(--accent2)', fontSize: '10px' }}>✓</span>}
        </div>
      ))}
    </div>
  );
}

// ── Round Column ────────────────────────────────────────────────────
function RoundColumn({ round, isLast }) {
  return (
    <div className="flex flex-col shrink-0" style={{ gap: '6px', minWidth: '135px' }}>
      <div className="text-center text-xs mb-2 uppercase" style={{ color: 'rgba(212,201,176,0.4)', fontFamily: 'Bebas Neue', letterSpacing: '0.1em', fontSize: '10px' }}>
        {round.name}
      </div>
      <div className="flex flex-col justify-around h-full" style={{ gap: '8px' }}>
        {round.matchups.map((matchup, i) => (
          <MatchupCard key={i} matchup={matchup} highlight={isLast && round.matchups.length === 1} />
        ))}
      </div>
    </div>
  );
}

// ── Region Bracket (full rounds) ────────────────────────────────────
function RegionBracket({ regionName, regionData }) {
  const { rounds, winner } = regionData;
  return (
    <div className="rounded-2xl p-4 mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,201,176,0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <h4 style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.1em', fontSize: '18px' }}>
          {REGION_EMOJI[regionName]} {REGION_NAME[regionName] || regionName}
        </h4>
        <div className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(245,166,35,0.15)', color: 'var(--accent2)', border: '1px solid var(--accent2)' }}>
          #{winner.seed} {winner.name} 🏆
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-4 items-start" style={{ minWidth: `${rounds.length * 150}px` }}>
          {rounds.map((round, i) => (
            <RoundColumn key={i} round={round} isLast={i === rounds.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Bracket Component ──────────────────────────────────────────
export default function Bracket({ bracketData, champion, reason, reason2, profile, label, onBack, onRetake }) {
  const { regionResults, finalFourRound, championshipRound } = bracketData;
  const isWomens = label === "Women's Bracket";
  const finalFourLabel = isWomens
    ? '🌵 Final Four & Championship · Phoenix, AZ'
    : '🏁 Final Four & Championship · Indianapolis, IN';

  return (
    <div className="min-h-screen px-4 py-10 max-w-2xl mx-auto">

      {/* Top nav buttons */}
      <div className="flex gap-3 justify-center mb-8">
        {onBack && (
          <button onClick={onBack}
            className="px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-80"
            style={{ background: 'rgba(245,166,35,0.1)', color: 'var(--accent2)', border: '1px solid var(--accent2)', letterSpacing: '0.1em' }}>
            ← Both Champions
          </button>
        )}
        <button onClick={onRetake}
          className="px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-80"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--net)', border: '1px solid rgba(212,201,176,0.2)', letterSpacing: '0.1em' }}>
          ↩ Retake Quiz
        </button>
      </div>

      {/* Champion */}
      <div className="text-center mb-10 animate-popIn">
        <p className="text-sm uppercase tracking-widest mb-2 opacity-50" style={{ color: 'var(--net)' }}>
          {label || 'Your 2026 Champion'}
        </p>
        <h1 className="champion-text" style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: 1 }}>
          {champion.name}
        </h1>
        <div className="inline-flex items-center gap-2 mt-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(245,166,35,0.15)', color: 'var(--accent2)', border: '1px solid var(--accent2)' }}>
            #{champion.seed} Seed · {REGION_NAME[champion.region] || champion.region}
          </span>
        </div>
        <p className="mt-4 max-w-md mx-auto text-sm leading-relaxed opacity-75" style={{ color: 'var(--net)' }}>
          {reason}{reason2 ? ` ${reason2}` : ''}
        </p>
      </div>

      {/* Final Four */}
      <div className="rounded-2xl p-5 mb-6 animate-fadeIn"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,201,176,0.08)' }}>
        <h3 className="text-lg mb-5" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.08em' }}>
          {finalFourLabel}
        </h3>
        <div className="flex gap-4 items-start overflow-x-auto">
          <RoundColumn round={finalFourRound} isLast={false} />
          <RoundColumn round={championshipRound} isLast={true} />
        </div>
      </div>

      {/* All Regional Brackets */}
      <h3 className="text-lg mb-4" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.08em' }}>
        Regional Brackets
      </h3>
      {Object.keys(regionResults).map(region => (
        <RegionBracket key={region} regionName={region} regionData={regionResults[region]} />
      ))}

      {/* Actions */}
      <div className="text-center flex gap-3 justify-center mt-8">
        {onBack && (
          <button onClick={onBack}
            className="px-8 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all duration-200 hover:opacity-80"
            style={{ background: 'rgba(245,166,35,0.1)', color: 'var(--accent2)', border: '1px solid var(--accent2)', letterSpacing: '0.1em' }}>
            ← Both Champions
          </button>
        )}
        <button onClick={onRetake}
          className="px-8 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all duration-200 hover:opacity-80"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--net)', border: '1px solid rgba(212,201,176,0.2)', letterSpacing: '0.1em' }}>
          ↩ Retake Quiz
        </button>
      </div>
    </div>
  );
}
