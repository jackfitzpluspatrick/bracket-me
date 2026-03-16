import { useState } from 'react';
import Quiz from './components/Quiz.jsx';
import Bracket from './components/Bracket.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import { buildUserProfile, simulateBracket, simulateWBracket, getChampionReason } from './logic/bracketEngine.js';

const PHASES = { QUIZ: 'quiz', LOADING: 'loading', PROFILE: 'profile', CHAMPIONS: 'champions', BRACKET: 'bracket' };

export default function App() {
  const [phase, setPhase] = useState(PHASES.QUIZ);
  const [results, setResults] = useState(null);
  const [viewing, setViewing] = useState(null);

  function handleQuizComplete(answers) {
    setPhase(PHASES.LOADING);
    setTimeout(() => {
      const profile     = buildUserProfile(answers);
      const mensData    = simulateBracket(profile);
      const womensData  = simulateWBracket(profile);
      const mensReason  = getChampionReason(mensData.champion, profile);
      const womensReason = getChampionReason(womensData.champion, profile);
      setResults({ profile, mensData, womensData, mensReason, womensReason });
      setPhase(PHASES.PROFILE);
    }, 100);
  }

  function handleRetake() {
    setResults(null);
    setViewing(null);
    setPhase(PHASES.QUIZ);
  }

  function handleViewBracket(gender) {
    setViewing(gender);
    setPhase(PHASES.BRACKET);
  }

  function handleBackToChampions() {
    setPhase(PHASES.CHAMPIONS);
  }

  // ── Loading ───────────────────────────────────────────────────────
  if (phase === PHASES.LOADING) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="text-6xl animate-bounce" style={{ animationDuration: '0.8s' }}>🏀</div>
        <p className="text-2xl" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.12em' }}>
          Simulating Your Brackets...
        </p>
        <p className="text-xs tracking-widest uppercase opacity-40" style={{ color: 'var(--net)' }}>
          Running all 8 regions
        </p>
      </div>
    );
  }

  // ── Profile page ──────────────────────────────────────────────────
  if (phase === PHASES.PROFILE && results) {
    return (
      <ProfilePage
        profile={results.profile}
        onContinue={() => setPhase(PHASES.CHAMPIONS)}
      />
    );
  }

  // ── Champions flash screen ────────────────────────────────────────
  if (phase === PHASES.CHAMPIONS && results) {
    const { mensData, womensData, mensReason, womensReason } = results;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center mb-10 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.06em' }}>
            YOUR <span style={{ color: 'var(--accent)' }}>CHAMPIONS</span>
          </h1>
          <p className="mt-2 text-sm tracking-widest uppercase opacity-50" style={{ color: 'var(--net)' }}>
            Tap a bracket to explore
          </p>
        </div>

        <div className="w-full max-w-xl flex flex-col gap-5 animate-slideIn">
          {/* Women's champion card — on top */}
          <button
            onClick={() => handleViewBracket('womens')}
            className="w-full text-left rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02]"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,201,176,0.15)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest opacity-50" style={{ color: 'var(--net)', fontFamily: 'Bebas Neue' }}>
                🏀 Women's Champion
              </span>
              <span className="text-xs opacity-40" style={{ color: 'var(--net)' }}>View bracket →</span>
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2rem, 8vw, 4rem)', color: 'var(--accent)', lineHeight: 1 }}>
              {womensData.champion.name}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(232,52,28,0.15)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
                #{womensData.champion.seed} Seed
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--net)', border: '1px solid rgba(212,201,176,0.2)' }}>
                {womensData.champion.region} Region
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed opacity-60" style={{ color: 'var(--net)' }}>
              {womensReason}
            </p>
          </button>

          {/* Men's champion card */}
          <button
            onClick={() => handleViewBracket('mens')}
            className="w-full text-left rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02]"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,201,176,0.15)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest opacity-50" style={{ color: 'var(--net)', fontFamily: 'Bebas Neue' }}>
                🏀 Men's Champion
              </span>
              <span className="text-xs opacity-40" style={{ color: 'var(--net)' }}>View bracket →</span>
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2rem, 8vw, 4rem)', color: 'var(--accent2)', lineHeight: 1 }}>
              {mensData.champion.name}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,166,35,0.15)', color: 'var(--accent2)', border: '1px solid var(--accent2)' }}>
                #{mensData.champion.seed} Seed
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--net)', border: '1px solid rgba(212,201,176,0.2)' }}>
                {mensData.champion.region} Region
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed opacity-60" style={{ color: 'var(--net)' }}>
              {mensReason}
            </p>
          </button>

          {/* Bottom actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setPhase(PHASES.PROFILE)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all duration-200 hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(212,201,176,0.6)', border: '1px solid rgba(212,201,176,0.15)', letterSpacing: '0.08em' }}
            >
              📊 My Profile
            </button>
            <button
              onClick={handleRetake}
              className="flex-1 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all duration-200 hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(212,201,176,0.5)', border: '1px solid rgba(212,201,176,0.1)', letterSpacing: '0.08em' }}
            >
              ↩ Retake
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Full bracket view ─────────────────────────────────────────────
  if (phase === PHASES.BRACKET && results && viewing) {
    const bracketData = viewing === 'mens' ? results.mensData : results.womensData;
    const reason      = viewing === 'mens' ? results.mensReason : results.womensReason;
    const label       = viewing === 'mens' ? "Men's Bracket" : "Women's Bracket";
    return (
      <Bracket
        bracketData={bracketData}
        champion={bracketData.champion}
        reason={reason}
        profile={results.profile}
        label={label}
        onBack={handleBackToChampions}
        onRetake={handleRetake}
      />
    );
  }

  return <Quiz onComplete={handleQuizComplete} />;
}
