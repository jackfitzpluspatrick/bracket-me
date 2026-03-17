import { useState } from 'react';
import { QUESTIONS } from '../data/questions.js';

function formatLabel(option) {
  if (!option.title) return option.label;
  const rest = option.label.slice(option.title.length);
  return <><em>{option.title}</em>{rest}</>;
}

export default function Quiz({ onComplete, startIndex = 0, endIndex = null }) {
  const questions = endIndex !== null
    ? QUESTIONS.slice(startIndex, endIndex)
    : QUESTIONS.slice(startIndex);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);

  const question = questions[current];
  const total = questions.length;
  const progress = (current / total) * 100;
  const isLast = current + 1 >= total;

  function handleNext() {
    if (!selected) return;
    const newHistory = [...history, { index: current, answer: selected.weights }];
    if (isLast) {
      onComplete(newHistory.map(h => h.answer).filter(Boolean));
    } else {
      setHistory(newHistory);
      setSelected(null);
      setCurrent(c => c + 1);
    }
  }

  function handleSkip() {
    const newHistory = [...history, { index: current, answer: null }];
    if (isLast) {
      onComplete(newHistory.map(h => h.answer).filter(Boolean));
    } else {
      setHistory(newHistory);
      setSelected(null);
      setCurrent(c => c + 1);
    }
  }

  function handleBack() {
    if (current === 0) return;
    setHistory(history.slice(0, -1));
    setSelected(null);
    setCurrent(c => c - 1);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center animate-fadeIn">
        <h1 className="text-6xl md:text-8xl" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.06em' }}>
          BRACKET <span style={{ color: 'var(--accent)' }}>ME</span>
        </h1>
        <p className="mt-2 text-sm tracking-widest uppercase opacity-60" style={{ color: 'var(--net)' }}>
          Your personality. Your bracket.
        </p>
      </div>

      {/* Progress */}
      <div className="w-full max-w-xl mb-8">
        <div className="flex justify-between text-xs mb-2 opacity-50" style={{ color: 'var(--net)' }}>
          <span>Question {current + 1} of {total}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(212,201,176,0.15)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'var(--accent2)' }} />
        </div>
      </div>

      {/* Question */}
      <div key={current} className="w-full max-w-xl animate-slideIn">
        <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,201,176,0.1)' }}>
          <div className="text-4xl mb-3">{question.emoji}</div>
          <h2 className="text-2xl md:text-3xl mb-6" style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.04em' }}>
            {question.text}
          </h2>
          <div className={`grid gap-3 ${question.options[0].image ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {question.options.map((option, i) => (
              <button key={i} onClick={() => setSelected(option)}
                className="option-btn text-left rounded-xl overflow-hidden"
                style={{
                  background: selected === option ? 'rgba(245,166,35,0.12)' : 'rgba(255,255,255,0.03)',
                  borderColor: selected === option ? 'var(--accent2)' : 'rgba(212,201,176,0.15)',
                  color: 'var(--chalk)',
                  padding: option.image ? '0' : '1rem 1.25rem',
                }}>
                {option.image && (
                  <div className="relative">
                    <img src={option.image} alt={option.label}
                      className="w-full object-cover" style={{ height: '140px' }}
                      onError={e => { e.target.style.display = 'none'; }} />
                    {selected === option && (
                      <div className="absolute inset-0 flex items-center justify-center"
                        style={{ background: 'rgba(245,166,35,0.3)' }}>
                        <span className="text-2xl">✓</span>
                      </div>
                    )}
                  </div>
                )}
                <span className="text-xs md:text-sm block" style={{ padding: option.image ? '0.5rem 0.75rem' : '0' }}>
                  {formatLabel(option)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleNext} disabled={!selected}
          className="mt-5 w-full py-4 rounded-xl font-semibold tracking-widest uppercase text-sm transition-all duration-200"
          style={{
            background: selected ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
            color: selected ? 'var(--chalk)' : 'rgba(212,201,176,0.3)',
            cursor: selected ? 'pointer' : 'not-allowed',
            letterSpacing: '0.1em',
          }}>
          {isLast ? '🏀 Build My Bracket' : 'Next →'}
        </button>

        <div className="flex gap-3 mt-3">
          <button onClick={handleBack} disabled={current === 0}
            className="flex-1 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.04)',
              color: current === 0 ? 'rgba(212,201,176,0.2)' : 'rgba(212,201,176,0.5)',
              border: '1px solid rgba(212,201,176,0.1)',
              cursor: current === 0 ? 'not-allowed' : 'pointer',
              letterSpacing: '0.08em',
            }}>
            ← Back
          </button>
          <button onClick={handleSkip}
            className="flex-1 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all duration-200 hover:opacity-80"
            style={{
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(212,201,176,0.5)',
              border: '1px solid rgba(212,201,176,0.1)',
              letterSpacing: '0.08em',
            }}>
            Skip →
          </button>
        </div>
      </div>
    </div>
  );
}
