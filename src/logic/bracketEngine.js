import { TEAMS } from '../data/teams.js';

// All 12 metrics
export const METRICS = [
  'offRating', 'defRating', 'threePt', 'freeThrow',
  'rebounding', 'passing', 'turnovers', 'momentum',
  'color', 'starPower', 'experience', 'legacy',
];

// Metrics where the color value is an index, not a score — skip in dot product
const SKIP_METRICS = ['color'];

const SCORE_METRICS = METRICS.filter(m => !SKIP_METRICS.includes(m));

/**
 * Aggregate all quiz answers into cumulative weight adjustments.
 * answers: array of weight objects { metric: delta, ... }
 * Each answer's weights are summed — positive boosts, negative reductions.
 * Final weights are normalized so they sum to 1.
 */
export function buildUserWeights(answers) {
  // Start every metric at a small baseline so unasked metrics still matter
  const totals = {};
  SCORE_METRICS.forEach(m => { totals[m] = 0.1; });

  // Accumulate every answer's weight deltas
  answers.forEach(w => {
    SCORE_METRICS.forEach(m => {
      if (w[m] !== undefined) {
        totals[m] = Math.max(0, totals[m] + w[m]); // floor at 0
      }
    });
  });

  // Normalize so weights sum to 1
  const sum = Object.values(totals).reduce((a, b) => a + b, 0);
  const normalized = {};
  SCORE_METRICS.forEach(m => { normalized[m] = totals[m] / sum; });
  return normalized;
}

/**
 * Score a single team against user weights.
 * Higher = better match for this user's preferences.
 */
export function scoreTeam(team, weights) {
  return SCORE_METRICS.reduce((score, m) => {
    return score + (team[m] || 0) * (weights[m] || 0);
  }, 0);
}

/**
 * Apply color boost — if user's painting pick matched a color profile,
 * teams whose color index matches get a bonus to their score.
 */
export function applyColorBoost(baseScore, team, colorProfileWeights) {
  if (!colorProfileWeights) return baseScore;
  // colorProfileWeights is a metric-weight object from COLOR_PROFILES
  const boost = SCORE_METRICS.reduce((s, m) => {
    return s + (team[m] || 0) * (colorProfileWeights[m] || 0);
  }, 0);
  return baseScore + boost * 0.25; // color is a flavor, not dominant
}

/**
 * Simulate one matchup with weighted randomness.
 * Momentum adds a small hot-streak multiplier.
 * Upset factor gives lower seeds a fighting chance.
 */
function simulateMatchup(teamA, teamB, weights, colorProfileWeights) {
  let scoreA = scoreTeam(teamA, weights);
  let scoreB = scoreTeam(teamB, weights);

  // Apply color boost
  scoreA = applyColorBoost(scoreA, teamA, colorProfileWeights);
  scoreB = applyColorBoost(scoreB, teamB, colorProfileWeights);

  // Momentum multiplier — hot streak teams get up to 8% bonus
  scoreA *= 1 + (teamA.momentum / 100) * 0.8;
  scoreB *= 1 + (teamB.momentum / 100) * 0.8;

  const total = scoreA + scoreB;
  const probA = scoreA / total;

  // Upset factor — lower seeds (higher number) get a small boost
  const upsetBonus = teamA.seed > teamB.seed ? 0.05 : 0;
  const roll = Math.random();

  return roll < probA + upsetBonus ? teamA : teamB;
}

/**
 * Run full single-elimination bracket.
 * Returns { rounds, champion }
 */
export function simulateBracket(weights, colorProfileWeights = null) {
  const seeded = [...TEAMS].sort((a, b) => a.seed - b.seed);

  // Classic bracket seeding: 1v16, 8v9, 4v13, 5v12, 3v14, 6v11, 2v15, 7v10
  const initialMatchups = [
    [seeded[0], seeded[15]],
    [seeded[7], seeded[8]],
    [seeded[3], seeded[12]],
    [seeded[4], seeded[11]],
    [seeded[2], seeded[13]],
    [seeded[5], seeded[10]],
    [seeded[1], seeded[14]],
    [seeded[6], seeded[9]],
  ];

  const roundNames = ['Round of 16', 'Quarterfinals', 'Semifinals', 'Championship'];
  const rounds = [];
  let currentMatchups = initialMatchups;

  while (currentMatchups.length > 0) {
    const roundResults = currentMatchups.map(([a, b]) => {
      const winner = simulateMatchup(a, b, weights, colorProfileWeights);
      return {
        teamA: a,
        teamB: b,
        winner,
        scoreA: +scoreTeam(a, weights).toFixed(2),
        scoreB: +scoreTeam(b, weights).toFixed(2),
      };
    });

    rounds.push({
      name: roundNames[rounds.length] || `Round ${rounds.length + 1}`,
      matchups: roundResults,
    });

    const winners = roundResults.map(r => r.winner);
    if (winners.length === 1) break;

    const next = [];
    for (let i = 0; i < winners.length; i += 2) {
      next.push([winners[i], winners[i + 1]]);
    }
    currentMatchups = next;
  }

  const champion = rounds[rounds.length - 1].matchups[0].winner;
  return { rounds, champion };
}

/**
 * Human-readable explanation of why this team won for this user.
 */
export function getChampionReason(champion, weights) {
  // Find the metric with highest combined user weight × team score
  let topMetric = SCORE_METRICS[0];
  let topScore = -1;
  SCORE_METRICS.forEach(m => {
    const s = (champion[m] || 0) * (weights[m] || 0);
    if (s > topScore) { topScore = s; topMetric = m; }
  });

  const descriptions = {
    offRating:   `${champion.name}'s explosive offense matches your high-energy, attack-first mentality.`,
    defRating:   `${champion.name}'s suffocating defense mirrors your disciplined, lock-it-down approach.`,
    threePt:     `${champion.name}'s three-point barrage fits your shoot-your-shot, high-risk personality.`,
    freeThrow:   `${champion.name}'s composure at the line reflects your cool-headed precision under pressure.`,
    rebounding:  `${champion.name}'s relentless rebounding matches your grind-for-every-possession mindset.`,
    passing:     `${champion.name}'s beautiful ball movement aligns with your team-first, unselfish style.`,
    turnovers:   `${champion.name}'s ball security reflects your calculated, low-mistake approach to competition.`,
    momentum:    `${champion.name} is on a hot streak — just like you, they show up when it matters most.`,
    starPower:   `${champion.name}'s star power speaks to your love of individual greatness and big moments.`,
    experience:  `${champion.name}'s veteran IQ and poise match your trust-the-process, been-here-before mindset.`,
    legacy:      `${champion.name}'s storied program history aligns with your respect for tradition and winning culture.`,
  };

  return descriptions[topMetric] || `${champion.name} is your perfect bracket match.`;
}