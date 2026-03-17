import { useState, useEffect } from 'react';
import { TEAMS } from '../data/teams.js';
import { WTEAMS } from '../data/wteams.js';

const ALL_TEAMS = [
  ...TEAMS.map(t => ({ ...t, gender: 'mens' })),
  ...WTEAMS.map(t => ({ ...t, gender: 'womens' })),
].sort((a, b) => a.name.localeCompare(b.name));

const MADNESS_LABELS = [
  { at: 0,   label: 'By the Book',    sub: 'Historical seed performance' },
  { at: 25,  label: 'Slight Chaos',   sub: 'A few surprises' },
  { at: 50,  label: 'March Madness',  sub: 'Upsets happen' },
  { at: 75,  label: 'Bracket Buster', sub: 'Chaos is likely' },
  { at: 100, label: 'Pure Mayhem',    sub: 'Anything can happen' },
];

function getMadnessLabel(val) {
  return [...MADNESS_LABELS].sort((a, b) => Math.abs(a.at - val) - Math.abs(b.at - val))[0];
}

export default function BracketSettings({ onContinue }) {
  const [favoriteTeam, setFavoriteTeam] = useState('');
  const [madness, setMadness]           = useState(0);
  const [search, setSearch]             = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = search.trim().length > 0
    ? ALL_TEAMS.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : [];

  const current = getMadnessLabel(madness);

  function handleSelect(team) {
    setFavoriteTeam(team.name);
    setSearch('');
    setShowDropdown(false);
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-lg mx-auto">

      {/* Header */}
      <div className="text-center mb-10 animate-fadeIn">
        <h1 className="text-5xl md:text-6xl" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.06em' }}>
          FINAL <span style={{ color: 'var(--accent)' }}>SETTINGS</span>
        </h1>
        <p className="mt-2 text-sm tracking-widest uppercase opacity-50" style={{ color: 'var(--net)' }}>
          Optional adjustments before we run your bracket
        </p>
      </div>

      {/* Madness Index */}
      <div className="rounded-2xl p-5 mb-4 animate-fadeIn" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,201,176,0.1)' }}>
        <h3 className="text-lg mb-1" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.08em' }}>
          Madness Index
        </h3>
        <p className="text-xs mb-5 opacity-40" style={{ color: 'var(--net)' }}>
          Optional. Your bracket is calibrated to reflect how seeds actually perform in tournament history. Drag right to let chaos in.
        </p>

        <div className="flex justify-between items-end mb-3">
          <div>
            <p style={{ color: madness === 0 ? 'var(--net)' : 'var(--accent)', fontFamily: 'Bebas Neue', letterSpacing: '0.05em', fontSize: '1.1rem' }}>
              {current.label}
            </p>
            <p className="text-xs opacity-50" style={{ color: 'var(--net)' }}>{current.sub}</p>
          </div>
          <p className="text-xs font-semibold" style={{ color: madness === 0 ? 'rgba(212,201,176,0.3)' : 'var(--accent)' }}>
            {madness === 0 ? 'Default' : `${madness}%`}
          </p>
        </div>

        <div className="relative mb-2">
          <div className="h-2 rounded-full" style={{ background: 'rgba(212,201,176,0.1)' }}>
            <div className="h-full rounded-full" style={{
              width: `${madness}%`,
              background: madness === 0 ? 'rgba(212,201,176,0.2)' : 'var(--accent)',
            }} />
          </div>
          <input
            type="range" min="0" max="100" step="1" value={madness}
            onChange={e => setMadness(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            style={{ height: '2rem', top: '-0.5rem' }}
          />
          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full pointer-events-none"
            style={{
              left: `calc(${madness}% - 8px)`,
              background: madness === 0 ? 'rgba(212,201,176,0.4)' : 'var(--accent)',
              border: '2px solid rgba(0,0,0,0.4)',
            }} />
        </div>

        <div className="flex justify-between mt-1">
          {MADNESS_LABELS.map(l => (
            <div key={l.at} className="flex flex-col items-center gap-0.5">
              <div className="w-px h-1.5" style={{ background: 'rgba(212,201,176,0.2)' }} />
              <span style={{ color: 'var(--net)', fontSize: '9px', opacity: 0.3 }}>
                {l.at === 0 ? 'Off' : l.at}
              </span>
            </div>
          ))}
        </div>

        {madness > 0 && (
          <div className="mt-4 px-3 py-2.5 rounded-xl flex gap-2.5 items-start"
            style={{ background: 'rgba(232,52,28,0.06)', border: '1px solid rgba(232,52,28,0.15)' }}>
            <span style={{ color: 'var(--accent)', fontSize: '13px', marginTop: '1px' }}>⚠</span>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(212,201,176,0.6)' }}>
              Increasing the Madness Index introduces randomness beyond historical norms. Your bracket may produce upsets that defy seed expectations — that's the point.
            </p>
          </div>
        )}
      </div>

      {/* Ride or Die — below madness so dropdown has room */}
      <div className="rounded-2xl p-5 mb-6 animate-fadeIn" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,201,176,0.1)' }}>
        <h3 className="text-lg mb-1" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.08em' }}>
          Ride or Die
        </h3>
        <p className="text-xs mb-4 opacity-40" style={{ color: 'var(--net)' }}>
          Pick a team to give a boost in your bracket. Optional.
        </p>

        {favoriteTeam ? (
          <div className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.3)' }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--accent2)' }}>{favoriteTeam}</p>
              <p className="text-xs opacity-50" style={{ color: 'var(--net)' }}>
                {ALL_TEAMS.find(t => t.name === favoriteTeam)?.gender === 'womens' ? "Women's" : "Men's"} · #{ALL_TEAMS.find(t => t.name === favoriteTeam)?.seed} Seed
              </p>
            </div>
            <button onClick={() => { setFavoriteTeam(''); setSearch(''); }}
              className="text-xs px-3 py-1 rounded-full"
              style={{ color: 'var(--net)', border: '1px solid rgba(212,201,176,0.2)' }}>
              Clear
            </button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search teams..."
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(212,201,176,0.15)',
                color: 'var(--chalk)',
              }}
            />
            {showDropdown && filtered.length > 0 && (
              <div className="mt-1 rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(212,201,176,0.15)', background: '#1c1510' }}>
                {filtered.map(t => (
                  <button
                    key={`${t.gender}-${t.name}`}
                    onMouseDown={() => handleSelect(t)}
                    className="w-full text-left px-4 py-3 text-sm flex justify-between items-center"
                    style={{
                      color: 'var(--chalk)',
                      borderBottom: '1px solid rgba(212,201,176,0.06)',
                      background: 'transparent',
                    }}>
                    <span>{t.name}</span>
                    <span className="text-xs opacity-40" style={{ color: 'var(--net)' }}>
                      #{t.seed} · {t.gender === 'womens' ? 'W' : 'M'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Spacer so build button has breathing room */}
      <div style={{ height: '2rem' }} />

      <button
        onClick={() => onContinue({ favoriteTeam: favoriteTeam || null, madness })}
        className="w-full py-4 rounded-xl font-semibold tracking-widest uppercase text-sm transition-all duration-200 hover:opacity-90"
        style={{ background: 'var(--accent)', color: 'var(--chalk)', letterSpacing: '0.1em' }}>
        🏀 Build My Bracket →
      </button>

      {/* Extra space below button so dropdown never gets clipped at bottom */}
      <div style={{ height: '8rem' }} />
    </div>
  );
}
