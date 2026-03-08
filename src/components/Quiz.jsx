import { useState } from 'react';
import { QUESTIONS } from '../data/questions.js';

export default function Quiz({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);

  const question = QUESTIONS[current];
  const progress = ((current) / QUESTIONS.length) * 100;

  function handleSelect(option) {
    setSelected(option);
  }

  function handleNext() {
    if (!selected) return;
    const newAnswers = [...answers, selected.weights];
    if (current + 1 >= QUESTIONS.length) {
      onComplete(newAnswers);
    } else {
      setAnswers(newAnswers);
      setSelected(null);
      setCurrent(c => c + 1);
    }
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

      {/* Progress bar */}
      <div className="w-full max-w-xl mb-8">
        <div className="flex justify-between text-xs mb-2 opacity-50" style={{ color: 'var(--net)' }}>
          <span>Question {current + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(212,201,176,0.15)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'var(--accent2)' }}
          />
        </div>
      </div>

      {/* Question card */}
      <div
        key={current}
        className="w-full max-w-xl animate-slideIn"
      >
        <div
          className="rounded-2xl p-8"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,201,176,0.1)' }}
        >
          <div className="text-4xl mb-3">{question.emoji}</div>
          <h2
            className="text-2xl md:text-3xl mb-6"
            style={{ fontFamily: 'Bebas Neue', color: 'var(--chalk)', letterSpacing: '0.04em' }}
          >
            {question.text}
          </h2>

          <div className="flex flex-col gap-3">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleSelect(option)}
                className="option-btn text-left px-5 py-4 rounded-xl"
                style={{
                  background: selected === option
                    ? 'rgba(245,166,35,0.12)'
                    : 'rgba(255,255,255,0.03)',
                  borderColor: selected === option
                    ? 'var(--accent2)'
                    : 'rgba(212,201,176,0.15)',
                  color: 'var(--chalk)',
                  animationDelay: `${i * 0.07}s`,
                }}
              >
                <span className="text-sm md:text-base">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={!selected}
          className="mt-5 w-full py-4 rounded-xl font-semibold tracking-widest uppercase text-sm transition-all duration-200"
          style={{
            background: selected ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
            color: selected ? 'var(--chalk)' : 'rgba(212,201,176,0.3)',
            cursor: selected ? 'pointer' : 'not-allowed',
            letterSpacing: '0.1em',
          }}
        >
          {current + 1 === QUESTIONS.length ? '🏀 Build My Bracket' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
