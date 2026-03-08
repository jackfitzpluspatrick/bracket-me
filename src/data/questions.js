// 10 questions — pop culture mapped to basketball metrics
// Metrics: pace, threeRate, defense, starPower, experience

export const QUESTIONS = [
  {
    id: 'q1',
    text: 'Pick your favorite Taylor Swift song:',
    emoji: '🎤',
    options: [
      {
        label: 'Love Story — classic, timeless, storytelling',
        weights: { experience: 1.8, defense: 1.0, pace: 0.3 },
      },
      {
        label: 'Shake It Off — upbeat, fun, unstoppable energy',
        weights: { pace: 1.8, threeRate: 1.0, starPower: 0.5 },
      },
      {
        label: 'Bad Blood — aggressive, intense, zero chill',
        weights: { pace: 1.5, starPower: 1.5, defense: 0.3 },
      },
      {
        label: 'Anti-Hero — self-aware, calculated, cerebral',
        weights: { defense: 1.5, experience: 1.2, threeRate: 0.6 },
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
        weights: { experience: 1.5, defense: 1.2, starPower: 0.5 },
      },
      {
        label: 'Squid Game — ruthless, high stakes, one winner',
        weights: { defense: 1.8, pace: 0.8, threeRate: 0.5 },
      },
      {
        label: 'Emily in Paris — flashy, fun, style over substance',
        weights: { starPower: 1.5, threeRate: 1.5, defense: 0.2 },
      },
      {
        label: 'The Last Dance — dynasty, greatness, legacy',
        weights: { starPower: 1.8, experience: 1.2, pace: 0.5 },
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
        weights: { experience: 1.8, defense: 1.2, pace: 0.3 },
      },
      {
        label: "Chipotle — customizable, bold, always a line for a reason",
        weights: { starPower: 1.5, pace: 1.0, threeRate: 0.8 },
      },
      {
        label: "Raising Cane's — simple, focused, does one thing perfectly",
        weights: { defense: 1.8, experience: 1.0, threeRate: 0.4 },
      },
      {
        label: 'Taco Bell — chaotic, creative, unpredictable',
        weights: { threeRate: 2.0, pace: 1.2, defense: 0.2 },
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
        weights: { starPower: 1.8, experience: 1.0, pace: 0.5 },
      },
      {
        label: 'Kendrick Lamar — cerebral, technical, built different',
        weights: { defense: 1.5, experience: 1.5, threeRate: 0.5 },
      },
      {
        label: 'Travis Scott — chaotic energy, pure spectacle',
        weights: { pace: 1.8, threeRate: 1.2, defense: 0.3 },
      },
      {
        label: 'J. Cole — underrated, consistent, no features needed',
        weights: { experience: 1.5, defense: 1.2, starPower: 0.8 },
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
        weights: { defense: 1.5, pace: 1.2, experience: 0.8 },
      },
      {
        label: 'Slow morning, coffee, no plans till noon',
        weights: { experience: 1.8, defense: 1.0, pace: 0.2 },
      },
      {
        label: 'Brunch with the crew, loud table, good vibes',
        weights: { pace: 1.5, starPower: 1.0, threeRate: 0.8 },
      },
      {
        label: 'Spontaneous — see where the day takes you',
        weights: { threeRate: 1.8, pace: 1.2, defense: 0.3 },
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
        weights: { defense: 1.5, starPower: 1.5, pace: 0.5 },
      },
      {
        label: 'LeBron James — all-around, team-first, chess not checkers',
        weights: { experience: 1.5, starPower: 1.2, defense: 0.8 },
      },
      {
        label: 'Steph Curry — unconventional, limitless range, fun to watch',
        weights: { threeRate: 2.0, pace: 1.2, defense: 0.3 },
      },
      {
        label: 'Draymond Green — defensive anchor, vocal leader, IQ over ego',
        weights: { defense: 2.0, experience: 1.2, threeRate: 0.2 },
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
        weights: { pace: 1.8, starPower: 1.5, defense: 0.2 },
      },
      {
        label: 'Moneyball — analytics, underdogs, outsmarting the system',
        weights: { threeRate: 1.5, experience: 1.2, defense: 0.8 },
      },
      {
        label: 'The Dark Knight — methodical, intense, defense wins',
        weights: { defense: 2.0, experience: 1.0, pace: 0.3 },
      },
      {
        label: 'Everything Everywhere All at Once — chaotic, creative, unhinged in the best way',
        weights: { threeRate: 1.8, pace: 1.2, starPower: 0.5 },
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
        weights: { starPower: 1.8, pace: 1.2, defense: 0.3 },
      },
      {
        label: 'Lurker — watching everything, giving nothing away',
        weights: { defense: 1.8, experience: 1.2, threeRate: 0.3 },
      },
      {
        label: 'Chronically online — first to know every trend',
        weights: { threeRate: 1.5, pace: 1.5, experience: 0.3 },
      },
      {
        label: 'Selective — curated, intentional, quality over quantity',
        weights: { experience: 1.5, defense: 1.2, starPower: 0.8 },
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
        weights: { defense: 1.5, experience: 1.5, threeRate: 0.3 },
      },
      {
        label: 'A 1-in-3 shot at $2,000',
        weights: { threeRate: 1.8, starPower: 1.0, defense: 0.4 },
      },
      {
        label: 'A 1-in-10 shot at $10,000',
        weights: { threeRate: 2.0, pace: 1.2, defense: 0.2 },
      },
      {
        label: 'You walk away — something feels off',
        weights: { defense: 2.0, experience: 1.2, pace: 0.2 },
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
        weights: { starPower: 1.5, experience: 1.5, defense: 0.5 },
      },
      {
        label: 'The Cinderella — nobody believed in them, nobody saw it coming',
        weights: { threeRate: 1.8, pace: 1.2, starPower: 0.3 },
      },
      {
        label: 'The Grinder — outworks everyone, ugly but effective',
        weights: { defense: 1.8, experience: 1.5, pace: 0.3 },
      },
      {
        label: 'The Showtime Squad — here to entertain, run and gun',
        weights: { pace: 2.0, threeRate: 1.2, defense: 0.2 },
      },
    ],
  },
];