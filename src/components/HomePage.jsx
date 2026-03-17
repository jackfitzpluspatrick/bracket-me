export default function HomePage({ onStart }) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 animate-fadeIn">
        <div className="text-center mb-12">
          <h1 className="text-8xl md:text-9xl" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.06em', lineHeight: 0.9 }}>
            BRACKET<br /><span style={{ color: 'var(--accent)' }}>ME</span>
          </h1>
          <p className="mt-5 text-base tracking-widest uppercase opacity-60" style={{ color: 'var(--net)' }}>
            Your personality. Your bracket.
          </p>
          <p className="mt-3 max-w-sm mx-auto text-sm leading-relaxed opacity-50" style={{ color: 'var(--net)' }}>
            Answer 11 questions. We'll simulate the entire 2025 NCAA Tournament — men's and women's — based on how you think.
          </p>
        </div>
  
        <button
          onClick={onStart}
          className="px-10 py-4 rounded-xl font-semibold uppercase tracking-widest text-base transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
          style={{ background: 'var(--accent)', color: 'var(--chalk)', letterSpacing: '0.12em' }}
        >
          Build My Bracket →
        </button>
  
        <p className="mt-6 text-xs opacity-30 uppercase tracking-widest" style={{ color: 'var(--net)' }}>
          Takes about 2 minutes
        </p>
      </div>
    );
  }
  