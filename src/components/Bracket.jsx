import { scoreTeam } from '../logic/bracketEngine.js';

const METRIC_LABELS = {
  offRating:  'Offensive Rating',
  defRating:  'Defensive Rating',
  threePt:    '3-Point Shooting',
  freeThrow:  'Free Throw',
  rebounding: 'Rebounding',
  passing:    'Passing / Assists',
  turnovers:  'Ball Security',
  momentum:   'Momentum',
  starPower:  'Star Power',
  experience: 'Experience',
  legacy:     'Program Legacy',
};

function MatchupCard({ matchup, isChampion }) {
  const { teamA, teamB, winner } = matchup;
  return (
    <div
      className="rounded-lg overflow-hidden text-xs"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: isChampion ? '1px solid var(--accent2)' : '1px solid rgba(212,201,176,0.1)',
        minWidth: '130px',
      }}
    >
      {[teamA, teamB].map((team, i) => (
        <div
          key={team.id}
          className="flex items-center gap-2 px-2 py-1.5"
          style={{
            background: winner.id === team.id ? 'rgba(245,166,35,0.14)' : 'transparent',
            borderBottom: i === 0 ? '1px solid rgba(212,201,176,0.08)' : 'none',
          }}
        >
          <span className="text-xs font-bold w-4 text-center shrink-0" style={{ color: 'var(--accent2)', fontFamily: 'Bebas Neue' }}>
            {team.seed}
          </span>
          <span
            className="truncate"
            style={{
              color: winner.id === team.id ? 'var(--chalk)' : 'rgba(212,201,176,0.45)',
              fontWeight: winner.id === team.id ? '600' : '400',
            }}
          >
            {team.name}
          </span>
          {winner.id === team.id && (
            <span className="ml-auto text-xs" style={{ color: 'var(--accent2)' }}>✓</span>
          )}
        </div>
      ))}
    </div>
  );
}

function RoundColumn({ round, isLast }) {
  return (
    <div className="flex flex-col" style={{ gap: '8px' }}>
      <div
        className="text-center text-xs mb-3 uppercase tracking-widest"
        style={{ color: 'rgba(212,201,176,0.4)', fontFamily: 'Bebas Neue', letterSpacing: '0.12em' }}
      >
        {round.name}
      </div>
      <div className="flex flex-col justify-around h-full" style={{ gap: '12px' }}>
        {round.matchups.map((matchup, i) => (
          <MatchupCard
            key={i}
            matchup={matchup}
            isChampion={isLast && round.matchups.length === 1}
          />
        ))}
      </div>
    </div>
  );
}

export default function Bracket({ bracketData, champion, reason, weights, onRetake }) {
  const { rounds } = bracketData;

  // Sort metrics by user weight for DNA display
  const sortedMetrics = Object.entries(weights).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen px-4 py-10">
      {/* Champion reveal */}
      <div className="text-center mb-10 animate-popIn">
        <p className="text-sm uppercase tracking-widest mb-2 opacity-50" style={{ color: 'var(--net)' }}>
          Your Champion
        </p>
        <h1
          className="champion-text"
          style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: 1 }}
        >
          {champion.name}
        </h1>
        <div
          className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(245,166,35,0.15)', color: 'var(--accent2)', border: '1px solid var(--accent2)' }}
        >
          #{champion.seed} Seed
        </div>
        <p className="mt-4 max-w-md mx-auto text-sm leading-relaxed opacity-75" style={{ color: 'var(--net)' }}>
          {reason}
        </p>
      </div>

      {/* Basketball DNA */}
      <div
        className="max-w-lg mx-auto rounded-2xl p-5 mb-10 animate-fadeIn"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,201,176,0.1)' }}
      >
        <h3 className="text-lg mb-4" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.08em' }}>
          Your Basketball DNA
        </h3>
        <div className="flex flex-col gap-3">
          {sortedMetrics.map(([metric, val]) => (
            <div key={metric}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: 'var(--net)' }}>{METRIC_LABELS[metric] || metric}</span>
                <span style={{ color: 'var(--accent2)' }}>{Math.round(val * 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(212,201,176,0.1)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(val * 100 * 3, 100)}%`, background: 'var(--accent)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bracket */}
      <div
        className="rounded-2xl p-6 mb-8 overflow-x-auto animate-fadeIn"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,201,176,0.08)' }}
      >
        <h3
          className="text-xl mb-6 text-center"
          style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.1em' }}
        >
          Full Bracket Results
        </h3>
        <div className="flex gap-6 items-start" style={{ minWidth: `${rounds.length * 160}px` }}>
          {rounds.map((round, i) => (
            <RoundColumn key={i} round={round} isLast={i === rounds.length - 1} />
          ))}
        </div>
      </div>

      {/* Retake */}
      <div className="text-center">
        <button
          onClick={onRetake}
          className="px-8 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all duration-200 hover:opacity-80"
          style={{
            background: 'rgba(255,255,255,0.06)',
            color: 'var(--net)',
            border: '1px solid rgba(212,201,176,0.2)',
            letterSpacing: '0.1em',
          }}
        >
          ↩ Retake Quiz
        </button>
      </div>
    </div>
  );
}