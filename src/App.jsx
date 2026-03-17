import { useState, useRef } from 'react';
import HomePage from './components/HomePage.jsx';
import Quiz from './components/Quiz.jsx';
import BasketballIntro from './components/BasketballIntro.jsx';
import Bracket from './components/Bracket.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import SharePage from './components/SharePage.jsx';
import BracketSettings from './components/BracketSettings.jsx';
import { buildUserProfile, simulateBracket, simulateWBracket, getChampionReason } from './logic/bracketEngine.js';

const PHASES = {
  HOME:        'home',
  QUIZ_POP:    'quiz_pop',
  BBALL_INTRO: 'bball_intro',
  QUIZ_BB:     'quiz_bb',
  SETTINGS:    'settings',
  LOADING:     'loading',
  PROFILE:     'profile',
  CHAMPIONS:   'champions',
  BRACKET:     'bracket',
  SHARE:       'share',
  TOOFEW:      'toofew',
};

const REGION_NAME = {
  south: 'South Region', east: 'East Region',
  midwest: 'Midwest Region', west: 'West Region',
  fortworth1: 'Region 1 · Fort Worth', fortworth3: 'Region 3 · Fort Worth',
  sacramento2: 'Region 2 · Sacramento', sacramento4: 'Region 4 · Sacramento',
};

const BASKETBALL_START = 6;

export default function App() {
  const [phase, setPhase]           = useState(PHASES.HOME);
  const [results, setResults]       = useState(null);
  const [popAnswers, setPopAnswers] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const viewingRef                  = useRef(null);

  function runSim(answers) {
    const answered = answers.filter(Boolean);
    if (answered.length < 4) {
      setPhase(PHASES.TOOFEW);
      return;
    }
    setAllAnswers(answers);
    console.log('Setting phase to SETTINGS');
    setPhase(PHASES.SETTINGS);
  }

  function handleSettingsContinue({ favoriteTeam, madness }) {
    setPhase(PHASES.LOADING);
    setTimeout(() => {
      const profile      = buildUserProfile(allAnswers.filter(Boolean));
      const mensData     = simulateBracket(profile, { favoriteTeam, madness });
      const womensData   = simulateWBracket(profile, { favoriteTeam, madness });
      const mensReason   = getChampionReason(mensData.champion, profile);
      const womensReason = getChampionReason(womensData.champion, profile);
      setResults({ profile, mensData, womensData, mensReason, womensReason });
      setPhase(PHASES.PROFILE);
    }, 100);
  }

  function handlePopComplete(answers) {
    setPopAnswers(answers);
    setPhase(PHASES.BBALL_INTRO);
  }

  function handleBballContinue() { setPhase(PHASES.QUIZ_BB); }
  function handleBballSkip()     { runSim(popAnswers); }
  function handleBballComplete(bbAnswers) { runSim([...popAnswers, ...bbAnswers]); }

  function handleRetake() {
    setResults(null);
    setPopAnswers([]);
    setAllAnswers([]);
    viewingRef.current = null;
    setPhase(PHASES.HOME);
  }

  function handleViewBracket(gender) {
    viewingRef.current = gender;
    setPhase(PHASES.BRACKET);
  }

  // ── HOME ──────────────────────────────────────────────────────────
  if (phase === PHASES.HOME) {
    return <HomePage onStart={() => setPhase(PHASES.QUIZ_POP)} />;
  }

  // ── POP CULTURE QUIZ ──────────────────────────────────────────────
  if (phase === PHASES.QUIZ_POP) {
    return <Quiz onComplete={handlePopComplete} startIndex={0} endIndex={BASKETBALL_START} />;
  }

  // ── BASKETBALL INTRO ──────────────────────────────────────────────
  if (phase === PHASES.BBALL_INTRO) {
    return <BasketballIntro onContinue={handleBballContinue} onSkip={handleBballSkip} />;
  }

  // ── BASKETBALL QUIZ ───────────────────────────────────────────────
  if (phase === PHASES.QUIZ_BB) {
    return <Quiz onComplete={handleBballComplete} startIndex={BASKETBALL_START} />;
  }

  // ── SETTINGS ──────────────────────────────────────────────────────
  if (phase === PHASES.SETTINGS) {
    console.log('SETTINGS phase reached');
    return <BracketSettings onContinue={handleSettingsContinue} />;
  }

  // ── LOADING ───────────────────────────────────────────────────────
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

  // ── TOO FEW ───────────────────────────────────────────────────────
  if (phase === PHASES.TOOFEW) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-6 text-center">
        <div className="text-6xl">🤔</div>
        <h2 className="text-4xl" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.08em' }}>
          Not Enough Data
        </h2>
        <p className="max-w-sm text-sm leading-relaxed opacity-70" style={{ color: 'var(--net)' }}>
          You need to answer at least <strong style={{ color: 'var(--accent2)' }}>4 questions</strong> for your bracket to mean something.
        </p>
        <button onClick={handleRetake}
          className="px-8 py-4 rounded-xl font-semibold uppercase tracking-widest text-sm"
          style={{ background: 'var(--accent)', color: 'var(--chalk)', letterSpacing: '0.1em' }}>
          ↩ Retake Quiz
        </button>
      </div>
    );
  }

  // ── BRACKET ───────────────────────────────────────────────────────
  // Check BRACKET before PROFILE so clicking champion goes directly here
  if (phase === PHASES.BRACKET && results) {
    const gender      = viewingRef.current;
    const bracketData = gender === 'mens' ? results.mensData : results.womensData;
    const reasonObj   = gender === 'mens' ? results.mensReason : results.womensReason;
    const label       = gender === 'mens' ? "Men's Bracket" : "Women's Bracket";
    return (
      <Bracket
        bracketData={bracketData}
        champion={bracketData.champion}
        reason={reasonObj.reason}
        reason2={reasonObj.reason2}
        profile={results.profile}
        label={label}
        onBack={() => setPhase(PHASES.CHAMPIONS)}
        onRetake={handleRetake}
      />
    );
  }

  // ── PROFILE ───────────────────────────────────────────────────────
  if (phase === PHASES.PROFILE && results) {
    return <ProfilePage profile={results.profile} onContinue={() => setPhase(PHASES.CHAMPIONS)} />;
  }

  // ── CHAMPIONS ─────────────────────────────────────────────────────
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
          {/* Women's first */}
          <button onClick={() => handleViewBracket('womens')}
            className="w-full text-left rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02]"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,201,176,0.15)' }}>
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
                {REGION_NAME[womensData.champion.region] || womensData.champion.region}
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed opacity-60" style={{ color: 'var(--net)' }}>{womensReason.reason}</p>
          </button>

          {/* Men's */}
          <button onClick={() => handleViewBracket('mens')}
            className="w-full text-left rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02]"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,201,176,0.15)' }}>
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
                {REGION_NAME[mensData.champion.region] || mensData.champion.region}
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed opacity-60" style={{ color: 'var(--net)' }}>{mensReason.reason}</p>
          </button>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={() => setPhase(PHASES.SHARE)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all hover:opacity-80"
              style={{ background: 'rgba(245,166,35,0.1)', color: 'var(--accent2)', border: '1px solid var(--accent2)', letterSpacing: '0.08em' }}>
              📤 Share
            </button>
            <button onClick={() => setPhase(PHASES.PROFILE)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(212,201,176,0.6)', border: '1px solid rgba(212,201,176,0.15)', letterSpacing: '0.08em' }}>
              📊 My Profile
            </button>
            <button onClick={handleRetake}
              className="flex-1 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(212,201,176,0.5)', border: '1px solid rgba(212,201,176,0.1)', letterSpacing: '0.08em' }}>
              ↩ Retake
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── SHARE ─────────────────────────────────────────────────────────
  if (phase === PHASES.SHARE && results) {
    return (
      <SharePage
        mensChampion={results.mensData.champion}
        womensChampion={results.womensData.champion}
        answers={allAnswers}
        onClose={() => setPhase(PHASES.CHAMPIONS)}
      />
    );
  }

  return <HomePage onStart={() => setPhase(PHASES.QUIZ_POP)} />;
}
