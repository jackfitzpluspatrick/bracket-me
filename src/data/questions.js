// 11 questions — 10 pop culture + 1 painting color picker
// All answers produce CUMULATIVE weight deltas across 11 scored metrics:
//   offRating, defRating, threePt, freeThrow, rebounding,
//   passing, turnovers, momentum, starPower, experience, legacy
//
// Positive values BOOST a metric, negative values REDUCE it.
// All deltas accumulate across every answer before the sim runs.
//
// 'color' is handled separately via the painting question —
// it maps to COLOR_PROFILES in teams.js and applies a team-level boost.

export const QUESTIONS = [
  {
    id: 'q1',
    text: 'Pick your favorite Taylor Swift song:',
    emoji: '🎤',
    options: [
      {
        label: 'Love Story — classic, timeless, storytelling',
        weights: { experience: 1.5, legacy: 1.2, defRating: 0.5, offRating: -0.3 },
      },
      {
        label: 'Shake It Off — upbeat, fun, unstoppable energy',
        weights: { offRating: 1.5, momentum: 1.0, passing: 0.8, defRating: -0.3 },
      },
      {
        label: 'Bad Blood — aggressive, intense, zero chill',
        weights: { offRating: 1.2, starPower: 1.5, momentum: 0.8, turnovers: -0.5 },
      },
      {
        label: 'Anti-Hero — self-aware, calculated, cerebral',
        weights: { defRating: 1.5, turnovers: 1.2, experience: 0.8, threePt: -0.3 },
      },
    ],
  },
  {
    id: 'q2',
    text: 'Which Netflix show are you finishing in one sitting?',
    emoji: '📺',
    options: [
      {
        label: 'Stranger Things — ensemble cast, everyone matters',
        weights: { passing: 1.5, rebounding: 1.0, experience: 0.8, starPower: -0.3 },
      },
      {
        label: 'Squid Game — ruthless, high stakes, one winner',
        weights: { defRating: 1.8, turnovers: 1.2, momentum: 0.5, passing: -0.5 },
      },
      {
        label: 'Emily in Paris — flashy, fun, style over substance',
        weights: { starPower: 1.5, threePt: 1.5, offRating: 0.8, defRating: -0.8 },
      },
      {
        label: 'The Last Dance — dynasty, greatness, legacy',
        weights: { legacy: 1.8, starPower: 1.2, momentum: 1.0, turnovers: 0.5 },
      },
    ],
  },
  {
    id: 'q3',
    text: "What's your go-to fast food order?",
    emoji: '🍔',
    options: [
      {
        label: "Chick-fil-A — consistent, reliable, never misses",
        weights: { freeThrow: 1.8, turnovers: 1.2, legacy: 0.8, threePt: -0.3 },
      },
      {
        label: "Chipotle — customizable, bold, always a line for a reason",
        weights: { starPower: 1.2, offRating: 1.0, passing: 1.0, defRating: -0.3 },
      },
      {
        label: "Raising Cane's — simple, focused, does one thing perfectly",
        weights: { defRating: 1.5, rebounding: 1.2, turnovers: 1.0, threePt: -0.5 },
      },
      {
        label: 'Taco Bell — chaotic, creative, unpredictable',
        weights: { threePt: 2.0, offRating: 1.0, momentum: 0.5, turnovers: -1.0 },
      },
    ],
  },
  {
    id: 'q4',
    text: 'Pick a rapper to headline your ideal concert:',
    emoji: '🎧',
    options: [
      {
        label: 'Drake — calculated, polished, always on top',
        weights: { legacy: 1.5, starPower: 1.5, freeThrow: 0.8, rebounding: -0.3 },
      },
      {
        label: 'Kendrick Lamar — cerebral, technical, built different',
        weights: { defRating: 1.5, experience: 1.5, turnovers: 1.0, offRating: -0.3 },
      },
      {
        label: 'Travis Scott — chaotic energy, pure spectacle',
        weights: { offRating: 1.8, momentum: 1.5, threePt: 0.8, turnovers: -0.8 },
      },
      {
        label: 'J. Cole — underrated, consistent, no features needed',
        weights: { experience: 1.5, passing: 1.2, freeThrow: 1.0, starPower: -0.3 },
      },
    ],
  },
  {
    id: 'q5',
    text: "What's your move on a Saturday morning?",
    emoji: '☀️',
    options: [
      {
        label: 'Up at 6am, gym before anyone else wakes up',
        weights: { defRating: 1.2, rebounding: 1.2, momentum: 1.0, passing: -0.3 },
      },
      {
        label: 'Slow morning, coffee, no plans till noon',
        weights: { experience: 1.8, freeThrow: 1.2, legacy: 0.5, momentum: -0.5 },
      },
      {
        label: 'Brunch with the crew, loud table, good vibes',
        weights: { passing: 1.5, offRating: 1.0, starPower: 0.8, defRating: -0.3 },
      },
      {
        label: 'Spontaneous — see where the day takes you',
        weights: { threePt: 1.8, momentum: 1.2, offRating: 0.5, turnovers: -0.8 },
      },
    ],
  },
  {
    id: 'q6',
    text: "Which athlete's mentality do you most relate to?",
    emoji: '🏆',
    options: [
      {
        label: 'Kobe Bryant — obsessive, relentless, Mamba mentality',
        weights: { defRating: 1.2, starPower: 1.8, momentum: 0.8, passing: -0.5 },
      },
      {
        label: 'LeBron James — all-around, team-first, chess not checkers',
        weights: { passing: 1.5, legacy: 1.2, rebounding: 1.0, threePt: -0.3 },
      },
      {
        label: 'Steph Curry — unconventional, limitless range, fun to watch',
        weights: { threePt: 2.0, freeThrow: 1.2, offRating: 0.8, defRating: -0.5 },
      },
      {
        label: 'Draymond Green — defensive anchor, vocal leader, IQ over ego',
        weights: { defRating: 2.0, passing: 1.2, turnovers: 1.0, starPower: -0.5 },
      },
    ],
  },
  {
    id: 'q7',
    text: 'Pick a movie to watch on a Friday night:',
    emoji: '🎬',
    options: [
      {
        label: 'Top Gun: Maverick — elite talent, high speed, pure spectacle',
        weights: { offRating: 1.8, starPower: 1.5, momentum: 1.0, defRating: -0.5 },
      },
      {
        label: 'Moneyball — analytics, underdogs, outsmarting the system',
        weights: { turnovers: 1.5, experience: 1.2, freeThrow: 1.0, starPower: -0.5 },
      },
      {
        label: 'The Dark Knight — methodical, intense, defense wins',
        weights: { defRating: 2.0, turnovers: 1.2, experience: 0.8, offRating: -0.5 },
      },
      {
        label: 'Everything Everywhere All at Once — chaotic, creative, unhinged in the best way',
        weights: { threePt: 1.8, offRating: 1.2, momentum: 0.8, turnovers: -1.0 },
      },
    ],
  },
  {
    id: 'q8',
    text: "What's your social media personality?",
    emoji: '📱',
    options: [
      {
        label: 'Poster — always in the mix, main character energy',
        weights: { starPower: 1.8, offRating: 1.2, momentum: 0.8, defRating: -0.3 },
      },
      {
        label: 'Lurker — watching everything, giving nothing away',
        weights: { defRating: 1.8, turnovers: 1.2, experience: 0.8, offRating: -0.3 },
      },
      {
        label: 'Chronically online — first to know every trend',
        weights: { threePt: 1.5, momentum: 1.5, passing: 0.5, experience: -0.5 },
      },
      {
        label: 'Selective — curated, intentional, quality over quantity',
        weights: { freeThrow: 1.5, legacy: 1.2, turnovers: 1.0, momentum: -0.3 },
      },
    ],
  },
  {
    id: 'q9',
    text: 'A stranger offers you one of these — you take:',
    emoji: '🎲',
    options: [
      {
        label: 'A guaranteed $500',
        weights: { freeThrow: 1.5, turnovers: 1.5, defRating: 0.8, threePt: -0.5 },
      },
      {
        label: 'A 1-in-3 shot at $2,000',
        weights: { threePt: 1.5, momentum: 1.2, offRating: 0.8, turnovers: -0.5 },
      },
      {
        label: 'A 1-in-10 shot at $10,000',
        weights: { threePt: 2.0, offRating: 1.2, starPower: 0.5, defRating: -0.8 },
      },
      {
        label: 'You walk away — something feels off',
        weights: { defRating: 2.0, experience: 1.2, turnovers: 1.0, offRating: -0.5 },
      },
    ],
  },
  {
    id: 'q10',
    text: 'Last one — pick a vibe for your ideal team:',
    emoji: '🏀',
    options: [
      {
        label: 'The Dynasty — been here before, knows how to win',
        weights: { legacy: 2.0, experience: 1.5, freeThrow: 0.8, momentum: 0.5 },
      },
      {
        label: 'The Cinderella — nobody believed in them, nobody saw it coming',
        weights: { threePt: 1.8, momentum: 1.5, turnovers: 0.5, legacy: -0.8 },
      },
      {
        label: 'The Grinder — outworks everyone, ugly but effective',
        weights: { defRating: 1.8, rebounding: 1.8, turnovers: 1.0, offRating: -0.3 },
      },
      {
        label: 'The Showtime Squad — here to entertain, run and gun',
        weights: { offRating: 2.0, passing: 1.5, threePt: 1.0, defRating: -0.8 },
      },
    ],
  },
  // --- Painting / Color Question ---
  {
    id: 'q_color',
    text: 'Which painting speaks to you most?',
    emoji: '🎨',
    isPaintingQuestion: true, // flag used by App.jsx to extract color profile
    options: [
      {
        label: 'Starry Night — deep blues, swirling, calm intensity',
        colorProfile: 1,
        weights: { defRating: 0.8, turnovers: 0.5 },
      },
      {
        label: 'The Scream — bold reds, raw emotion, high energy',
        colorProfile: 2,
        weights: { offRating: 0.8, starPower: 0.5 },
      },
      {
        label: 'Sunflowers — warm golds, optimistic, shooting for the sun',
        colorProfile: 3,
        weights: { threePt: 0.8, freeThrow: 0.5 },
      },
      {
        label: 'Water Lilies — soft greens, balanced, flowing',
        colorProfile: 4,
        weights: { rebounding: 0.8, passing: 0.5 },
      },
    ],
  },
];