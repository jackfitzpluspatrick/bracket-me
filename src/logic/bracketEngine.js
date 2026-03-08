import { TEAMS } from '../data/teams.js';

const METRICS = ['pace', 'threeRate', 'defense', 'starPower', 'experience'];

/**
 * Aggregate all quiz answers into a single weight vector.
 * answers: array of weight objects from selected options
 */
export function buildUserWeights(answers) {
  const totals = { pace: 0, threeRate: 0, defense: 0, starPower: 0, experience: 0 };
  answers.forEach(w => {
    METRICS.forEach(m => { totals[m] += (w[m] || 0); });
  });
  // Normalize so weights sum to 1
  const sum = Object.values(totals).reduce((a, b) => a + b, 0);
  const normalized = {};
  METRICS.forEach(m => { normalized[m] = totals[m] / sum; });
  return normalized;
}

/**
 * Score a single team against user weights.
 */
export function scoreTeam(team, weights) {
  return METRICS.reduce((score, m) => score + team[m] * weights[m], 0);
}

/**
 * Simulate one matchup. Higher score = higher win probability,
 * but we add controlled randomness so upsets can happen.
 * Returns the winning team.
 */
function simulateMatchup(teamA, teamB, weights) {
  const scoreA = scoreTeam(teamA, weights);
  const scoreB = scoreTeam(teamB, weights);
  const total = scoreA + scoreB;
  const probA = scoreA / total;
  // Add slight upset factor — lower-seed teams get a small bonus
  const upsetBonus = teamA.seed > teamB.seed ? 0.06 : 0;
  const roll = Math.random();
  return roll < probA + upsetBonus ? teamA : teamB;
}

/**
 * Run a full single-elimination bracket.
 * Returns { rounds, champion }
 * rounds: array of round arrays, each containing matchup objects
 */
export function simulateBracket(weights) {
  // Sort teams by seed
  const seeded = [...TEAMS].sort((a, b) => a.seed - b.seed);

  // Classic bracket seeding: 1v16, 2v15, 3v14 ... 8v9
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

  const rounds = [];
  let currentTeams = initialMatchups;

  const roundNames = [
    'Round of 16',
    'Quarterfinals',
    'Semifinals',
    'Championship',
  ];

  while (currentTeams.length > 0) {
    const roundIndex = rounds.length;
    const roundResults = currentTeams.map(([a, b]) => {
      const winner = simulateMatchup(a, b, weights);
      return {
        teamA: a,
        teamB: b,
        winner,
        scoreA: +scoreTeam(a, weights).toFixed(2),
        scoreB: +scoreTeam(b, weights).toFixed(2),
      };
    });

    rounds.push({
      name: roundNames[roundIndex] || `Round ${roundIndex + 1}`,
      matchups: roundResults,
    });

    // Next round: pair up winners
    const winners = roundResults.map(r => r.winner);
    if (winners.length === 1) break;

    const nextMatchups = [];
    for (let i = 0; i < winners.length; i += 2) {
      nextMatchups.push([winners[i], winners[i + 1]]);
    }
    currentTeams = nextMatchups;
  }

  const champion = rounds[rounds.length - 1].matchups[0].winner;
  return { rounds, champion };
}

/**
 * Return a human-readable summary of why this team won for the user.
 */
export function getChampionReason(champion, weights) {
  // Find the metric the user weighted most AND the team scores highest
  let topMetric = METRICS[0];
  let topScore = -1;
  METRICS.forEach(m => {
    const s = champion[m] * weights[m];
    if (s > topScore) { topScore = s; topMetric = m; }
  });

  const descriptions = {
    pace:       `${champion.name} matches your fast-paced, high-energy style perfectly.`,
    threeRate:  `${champion.name}'s live-or-die three-point mentality mirrors your big-swing personality.`,
    defense:    `${champion.name}'s lockdown defense aligns with your disciplined, patient approach.`,
    starPower:  `${champion.name}'s elite talent and star power speak to your love of individual brilliance.`,
    experience: `${champion.name}'s veteran leadership and IQ match your trust-the-system mindset.`,
  };

  return descriptions[topMetric];
}
