import { useState } from 'react';

const REGION_NAME = {
  south: 'South', east: 'East', midwest: 'Midwest', west: 'West',
  fortworth1: 'Fort Worth 1', fortworth3: 'Fort Worth 3',
  sacramento2: 'Sacramento 2', sacramento4: 'Sacramento 4',
};

// roundIdx = last round they WON → display the round they advanced TO
const MADE_IT_TO = {
  0: 'Round of 32', 1: 'Sweet 16', 2: 'Elite Eight',
  3: 'Final Four',  4: 'Championship', 5: 'National Champion',
};

export function findDarkHorse(bracketData) {
  if (!bracketData) return null;
  const candidates = [];

  Object.values(bracketData.regionResults).forEach(region => {
    region.rounds.forEach((round, roundIdx) => {
      round.matchups.forEach(m => {
        if (m.winner && m.winner.seed >= 11)
          candidates.push({ team: m.winner, roundIdx, roundName: MADE_IT_TO[roundIdx] });
      });
    });
  });

  bracketData.finalFourRound?.matchups.forEach(m => {
    if (m.winner && m.winner.seed >= 11)
      candidates.push({ team: m.winner, roundIdx: 4, roundName: MADE_IT_TO[4] });
  });

  const champ = bracketData.championshipRound?.matchups[0]?.winner;
  if (champ && champ.seed >= 11)
    candidates.push({ team: champ, roundIdx: 5, roundName: MADE_IT_TO[5] });

  if (!candidates.length) return null;
  candidates.sort((a, b) => b.roundIdx - a.roundIdx || a.team.seed - b.team.seed);
  // Return the single furthest-advancing dark horse (deduplicated by team)
  const seen = new Set();
  for (const c of candidates) {
    if (!seen.has(c.team.name)) { seen.add(c.team.name); return c; }
  }
  return null;
}

const ROUND_LABELS = ['Round of 64', 'Round of 32', 'Sweet 16', 'Elite Eight', 'Final Four', 'National Champion'];

const CAPTIONS = [
  (w, m) => `My 2026 NCAA brackets: ${w} (women's) and ${m} (men's). Built by answering questions about cereal mascots and end-of-game strategy. Try it — bracketme.app`,
  (w, m) => `Bracket Me matched my personality to the entire 2026 NCAA field. ${w} wins the women's, ${m} wins the men's. Hard to argue with the logic. bracketme.app`,
  (w, m) => `${w} and ${m} — my 2026 picks according to a quiz involving Taylor Swift and The Catalina Wine Mixer. The science checks out. bracketme.app`,
  (w, m) => `Just filled out my 2026 brackets without looking at a single stat. ${w} and ${m}. Bracket Me did the work. bracketme.app`,
];

export default function SharePage({ mensChampion, womensChampion, mensReason, womensReason, mensBracketData, womensBracketData, onClose }) {
  const mensName   = mensChampion?.name   || 'TBD';
  const womensName = womensChampion?.name || 'TBD';

  const mensDarkHorse   = findDarkHorse(mensBracketData);
  const womensDarkHorse = findDarkHorse(womensBracketData);

  const [caption]  = useState(() => {
    const t = CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)];
    return t(womensName, mensName);
  });
  const [copied, setCopied] = useState(false);

  const url = 'bracketme.app';
  const fullText = `${caption}\n\n${url}`;

  function handleCopy() {
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: 'Bracket Me', text: caption, url: `https://${url}` });
    } else {
      handleCopy();
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 animate-fadeIn">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="rounded-2xl overflow-hidden mb-5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,201,176,0.12)' }}>

          {/* Header */}
          <div className="px-6 pt-5 pb-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(212,201,176,0.08)' }}>
            <div>
              <h1 className="text-3xl" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.06em' }}>
                BRACKET <span style={{ color: 'var(--accent)' }}>ME</span>
              </h1>
              <p className="text-xs opacity-30" style={{ color: 'var(--net)' }}>2026 NCAA Tournament</p>
            </div>
            <span className="text-xs opacity-30" style={{ color: 'var(--net)' }}>bracketme.app</span>
          </div>

          {/* Women's champion */}
          <div className="px-6 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(212,201,176,0.06)' }}>
            <p className="text-xs uppercase tracking-widest mb-1"
              style={{ color: 'var(--accent)', fontFamily: 'Bebas Neue', fontSize: '10px', letterSpacing: '0.14em', opacity: 0.8 }}>
              Women's Champion
            </p>
            <p style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(1.5rem, 6vw, 2.2rem)', color: 'var(--accent)', lineHeight: 1 }}>
              {womensName}
            </p>
            <p className="text-xs mt-0.5 opacity-40" style={{ color: 'var(--net)' }}>
              #{womensChampion?.seed} Seed · {REGION_NAME[womensChampion?.region] || womensChampion?.region}
            </p>
            {womensReason && (
              <p className="text-xs mt-2 leading-relaxed opacity-55 italic" style={{ color: 'var(--net)' }}>
                "{womensReason}"
              </p>
            )}
            {womensDarkHorse && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(232,52,28,0.1)', color: 'var(--accent)', border: '1px solid rgba(232,52,28,0.2)', fontSize: '10px' }}>
                  🐴 Dark Horse
                </span>
                <span className="text-xs opacity-50" style={{ color: 'var(--net)' }}>
                  #{womensDarkHorse.team.seed} {womensDarkHorse.team.name} — {womensDarkHorse.roundName}
                </span>
              </div>
            )}
          </div>

          {/* Men's champion */}
          <div className="px-6 pt-4 pb-5">
            <p className="text-xs uppercase tracking-widest mb-1"
              style={{ color: 'var(--accent2)', fontFamily: 'Bebas Neue', fontSize: '10px', letterSpacing: '0.14em', opacity: 0.8 }}>
              Men's Champion
            </p>
            <p style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(1.5rem, 6vw, 2.2rem)', color: 'var(--accent2)', lineHeight: 1 }}>
              {mensName}
            </p>
            <p className="text-xs mt-0.5 opacity-40" style={{ color: 'var(--net)' }}>
              #{mensChampion?.seed} Seed · {REGION_NAME[mensChampion?.region] || mensChampion?.region}
            </p>
            {mensReason && (
              <p className="text-xs mt-2 leading-relaxed opacity-55 italic" style={{ color: 'var(--net)' }}>
                "{mensReason}"
              </p>
            )}
            {mensDarkHorse && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(245,166,35,0.1)', color: 'var(--accent2)', border: '1px solid rgba(245,166,35,0.2)', fontSize: '10px' }}>
                  🐴 Dark Horse
                </span>
                <span className="text-xs opacity-50" style={{ color: 'var(--net)' }}>
                  #{mensDarkHorse.team.seed} {mensDarkHorse.team.name} — {mensDarkHorse.roundName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Caption preview */}
        <div className="rounded-xl px-4 py-3 mb-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,201,176,0.08)' }}>
          <p className="text-xs leading-relaxed opacity-50" style={{ color: 'var(--net)', fontStyle: 'italic' }}>
            "{caption}"
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button onClick={handleShare}
            className="w-full py-4 rounded-xl font-semibold uppercase tracking-widest text-sm transition-all hover:opacity-90"
            style={{ background: 'var(--accent)', color: 'var(--chalk)', letterSpacing: '0.1em' }}>
            📤 Share
          </button>
          <button onClick={handleCopy}
            className="w-full py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all hover:opacity-80"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: copied ? 'var(--accent2)' : 'rgba(212,201,176,0.6)',
              border: `1px solid ${copied ? 'var(--accent2)' : 'rgba(212,201,176,0.15)'}`,
              letterSpacing: '0.08em',
            }}>
            {copied ? '✓ Copied!' : '📋 Copy Text'}
          </button>
          <button onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all hover:opacity-80"
            style={{ background: 'transparent', color: 'rgba(212,201,176,0.4)', letterSpacing: '0.08em' }}>
            ← Back to Champions
          </button>
        </div>
      </div>
    </div>
  );
}