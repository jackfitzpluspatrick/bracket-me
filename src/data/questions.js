// Each answer boosts specific team metrics via weights.
// The engine scores every team by dot-producting user weights × team metrics.

export const QUESTIONS = [
  {
    id: 'q1',
    text: "It's Friday night. What's the move?",
    emoji: '🌃',
    options: [
      {
        label: 'Packed concert, front row, dancing all night',
        weights: { pace: 1.5, starPower: 1.2, threeRate: 0.5 },
      },
      {
        label: 'House party with close friends',
        weights: { pace: 1.0, experience: 1.2, starPower: 0.6 },
      },
      {
        label: 'Low-key dinner, good food, good talk',
        weights: { defense: 1.0, experience: 1.2, pace: 0.3 },
      },
      {
        label: 'Home, couch, streaming something',
        weights: { defense: 1.5, experience: 1.0, threeRate: 0.3 },
      },
    ],
  },
  {
    id: 'q2',
    text: "Pick your road trip playlist:",
    emoji: '🎵',
    options: [
      {
        label: '🔥 Hip-hop & rap — high energy, hits only',
        weights: { pace: 1.5, starPower: 1.3, threeRate: 0.8 },
      },
      {
        label: '🎸 Rock classics — reliable, tried and true',
        weights: { experience: 1.5, defense: 1.0, pace: 0.5 },
      },
      {
        label: '🌊 Chill lo-fi / indie — vibes over hype',
        weights: { defense: 1.2, threeRate: 0.8, pace: 0.6 },
      },
      {
        label: '🎭 Shuffle everything — chaos is fun',
        weights: { threeRate: 1.5, pace: 1.0, starPower: 0.8 },
      },
    ],
  },
  {
    id: 'q3',
    text: "Your approach when things get competitive:",
    emoji: '⚔️',
    options: [
      {
        label: 'Lock in and shut it down — defense wins',
        weights: { defense: 2.0, experience: 1.0, pace: 0.3 },
      },
      {
        label: 'Go on the attack — score faster than them',
        weights: { pace: 1.8, threeRate: 1.2, defense: 0.3 },
      },
      {
        label: 'Trust the system, stick to the game plan',
        weights: { experience: 1.8, defense: 1.0, starPower: 0.5 },
      },
      {
        label: 'Find the star and let them take over',
        weights: { starPower: 2.0, pace: 0.8, threeRate: 0.8 },
      },
    ],
  },
  {
    id: 'q4',
    text: "Choose a TV show to binge right now:",
    emoji: '📺',
    options: [
      {
        label: '🦸 Superhero / action — spectacle and power',
        weights: { starPower: 1.5, pace: 1.2, threeRate: 0.8 },
      },
      {
        label: '🧠 Crime / thriller — strategy and patience',
        weights: { defense: 1.5, experience: 1.2, pace: 0.4 },
      },
      {
        label: '😂 Comedy — fun, unpredictable, loose',
        weights: { threeRate: 1.5, pace: 1.0, starPower: 0.7 },
      },
      {
        label: '🏆 Sports doc — grind, legacy, team chemistry',
        weights: { experience: 1.5, defense: 1.0, starPower: 1.0 },
      },
    ],
  },
  {
    id: 'q5',
    text: "What kind of winner are you?",
    emoji: '🏆',
    options: [
      {
        label: 'The underdog who shocks everyone',
        weights: { threeRate: 1.8, pace: 1.2, starPower: 0.3 },
      },
      {
        label: 'The dynasty — expected to win, delivers',
        weights: { starPower: 1.5, experience: 1.0, defense: 0.8 },
      },
      {
        label: 'The grinder — outworks everyone',
        weights: { defense: 1.8, experience: 1.5, pace: 0.4 },
      },
      {
        label: "The entertainer — win or lose, it's a show",
        weights: { pace: 1.5, threeRate: 1.5, defense: 0.3 },
      },
    ],
  },
];
