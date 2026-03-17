console.log('BasketballIntro loaded');
export default function BasketballIntro({ onContinue, onSkip }) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 animate-fadeIn">
        <div className="w-full max-w-lg text-center mb-10">
          <div className="text-5xl mb-4">🏀</div>
          <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.06em' }}>
            Now for the <span style={{ color: 'var(--accent)' }}>Basketball</span> side
          </h2>
          <p className="text-sm leading-relaxed opacity-60 max-w-sm mx-auto" style={{ color: 'var(--net)' }}>
            5 quick strategy questions — how you think about the game shapes which teams your bracket favors. Skip if you'd rather let the pop culture answers do the work.
          </p>
        </div>
  
        <div className="w-full max-w-sm flex flex-col gap-3">
          <button
            onClick={onContinue}
            className="w-full py-4 rounded-xl font-semibold uppercase tracking-widest text-sm transition-all duration-200 hover:opacity-90"
            style={{ background: 'var(--accent)', color: 'var(--chalk)', letterSpacing: '0.1em' }}
          >
            Let's do it →
          </button>
          <button
            onClick={onSkip}
            className="w-full py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all duration-200 hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(212,201,176,0.5)', border: '1px solid rgba(212,201,176,0.1)', letterSpacing: '0.08em' }}
          >
            Skip — just use my pop culture answers
          </button>
        </div>
      </div>
    );
  }