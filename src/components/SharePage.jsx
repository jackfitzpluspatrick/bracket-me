import { useState } from 'react';

const CAPTION_TEMPLATES = [
  (w, m) => `I used Bracket Me to build my 2026 NCAA brackets. ${w} wins the women's tournament, ${m} cuts down the nets in the men's. Turns out my taste in cereal says a lot about basketball.`,
  (w, m) => `My 2026 picks: ${w} (women's) and ${m} (men's). Bracket Me matched my personality to every team in the field — apparently I'm a ${m} kind of person.`,
  (w, m) => `Bracket Me told me ${w} wins the women's and ${m} wins the men's based on nothing but how I answered 11 random questions. Hard to argue with the logic.`,
  (w, m) => `${w} and ${m} — that's my 2026 NCAA bracket. Built by answering questions about Taylor Swift, Waffle House, and end-of-game strategy. Try it and see who yours picks.`,
];

function buildCaption(womensName, mensName) {
  const template = CAPTION_TEMPLATES[Math.floor(Math.random() * CAPTION_TEMPLATES.length)];
  return template(womensName, mensName);
}

export default function SharePage({ mensChampion, womensChampion, onClose }) {
  const mensName   = mensChampion?.name   || 'TBD';
  const womensName = womensChampion?.name || 'TBD';

  const [caption]  = useState(() => buildCaption(womensName, mensName));
  const [copied, setCopied] = useState(false);

  const url = window.location.href;
  const fullText = `${caption}\n\n${url}`;

  function handleCopy() {
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: 'Bracket Me', text: caption, url });
    } else {
      handleCopy();
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 animate-fadeIn">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="rounded-2xl overflow-hidden mb-6"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,201,176,0.15)' }}>

          <div className="px-6 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(212,201,176,0.08)' }}>
            <h1 className="text-3xl" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.06em' }}>
              BRACKET <span style={{ color: 'var(--accent)' }}>ME</span>
            </h1>
            <p className="text-xs opacity-30 mt-0.5" style={{ color: 'var(--net)' }}>2026 NCAA Tournament</p>
          </div>

          <div className="px-6 py-5 flex flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-40 mb-1"
                style={{ color: 'var(--net)', fontFamily: 'Bebas Neue', fontSize: '10px', letterSpacing: '0.12em' }}>
                Women's Champion
              </p>
              <p style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(1.6rem, 6vw, 2.5rem)', color: 'var(--accent)', lineHeight: 1 }}>
                {womensName}
              </p>
              <p className="text-xs mt-0.5 opacity-40" style={{ color: 'var(--net)' }}>
                #{womensChampion?.seed} Seed · {womensChampion?.region}
              </p>
            </div>
            <div style={{ borderTop: '1px solid rgba(212,201,176,0.08)', paddingTop: '1rem' }}>
              <p className="text-xs uppercase tracking-widest opacity-40 mb-1"
                style={{ color: 'var(--net)', fontFamily: 'Bebas Neue', fontSize: '10px', letterSpacing: '0.12em' }}>
                Men's Champion
              </p>
              <p style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(1.6rem, 6vw, 2.5rem)', color: 'var(--accent2)', lineHeight: 1 }}>
                {mensName}
              </p>
              <p className="text-xs mt-0.5 opacity-40" style={{ color: 'var(--net)' }}>
                #{mensChampion?.seed} Seed · {mensChampion?.region}
              </p>
            </div>
          </div>

          <div className="px-6 pb-6">
            <p className="text-xs leading-relaxed opacity-50" style={{ color: 'var(--net)', fontStyle: 'italic' }}>
              "{caption}"
            </p>
          </div>
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