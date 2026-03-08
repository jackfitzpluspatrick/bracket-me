import { useState } from 'react';
import Quiz from './components/Quiz.jsx';
import Bracket from './components/Bracket.jsx';
import { buildUserWeights, simulateBracket, getChampionReason } from './logic/bracketEngine.js';
import { COLOR_PROFILES } from './data/colorProfiles.js';

const PHASES = { QUIZ: 'quiz', LOADING: 'loading', RESULTS: 'results' };

export default function App() {
  const [phase, setPhase] = useState(PHASES.QUIZ);
  const [results, setResults] = useState(null);

  function handleQuizComplete({ answers, colorProfile }) {
    setPhase(PHASES.LOADING);
    setTimeout(() => {
      const weights = buildUserWeights(answers);
      const colorProfileWeights = colorProfile
        ? COLOR_PROFILES[colorProfile]?.metrics || null
        : null;
      const bracketData = simulateBracket(weights, colorProfileWeights);
      const reason = getChampionReason(bracketData.champion, weights);
      setResults({ weights, bracketData, champion: bracketData.champion, reason });
      setPhase(PHASES.RESULTS);
    }, 1800);
  }

  function handleRetake() {
    setResults(null);
    setPhase(PHASES.QUIZ);
  }

  if (phase === PHASES.LOADING) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="text-6xl animate-bounce" style={{ animationDuration: '0.8s' }}>🏀</div>
        <p className="text-2xl" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.12em' }}>
          Simulating Your Bracket...
        </p>
        <p className="text-xs tracking-widest uppercase opacity-40" style={{ color: 'var(--net)' }}>
          Crunching 12 metrics
        </p>
      </div>
    );
  }

  if (phase === PHASES.RESULTS && results) {
    return (
      <Bracket
        bracketData={results.bracketData}
        champion={results.champion}
        reason={results.reason}
        weights={results.weights}
        onRetake={handleRetake}
      />
    );
  }

  return <Quiz onComplete={handleQuizComplete} />;
}