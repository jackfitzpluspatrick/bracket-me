import { TEAMS } from '../data/teams.js';

export const ABS_METRICS = ['3pt', 'ft', 'reb', 'to', 'pass'];
export const DYN_METRICS = ['mom', 'star', 'leg', 'aca', 'tempo', 'con', 'bal', 'exp'];

export function buildUserProfile(answers) {
  const n = answers.length;
  if (n === 0) return null;
  const profile = {
    od:   { off: 0, def: 0 },
    abs:  { '3pt': 0, ft: 0, reb: 0, to: 0, pass: 0 },
    dyn:  { mom: 0, star: 0, leg: 0, aca: 0, tempo: 0, con: 0, bal: 0, exp: 0 },
    clr:  { red: 0, blue: 0, other: 0 },
    mas:  { cats: 0, people: 0, birds: 0, other: 0 },
    set:  { city: 0, suburban: 0, rural: 0 },
    area:  { south: 0, midwest: 0, east: 0, west: 0 },
    priv: { private: 0, public: 0 },
    size: { small: 0, medium: 0, large: 0 },
  };
  answers.forEach(w => {
    profile.od.off += (w.od?.off || 0);
    profile.od.def += (w.od?.def || 0);
    ABS_METRICS.forEach(m => { profile.abs[m] += (w.abs?.[m] || 0); });
    DYN_METRICS.forEach(m => { profile.dyn[m] += (w.dyn?.[m] || 0); });
    Object.keys(profile.clr).forEach(k  => { profile.clr[k]  += (w.clr?.[k]  || 0); });
    Object.keys(profile.mas).forEach(k  => { profile.mas[k]  += (w.mas?.[k]  || 0); });
    Object.keys(profile.set).forEach(k  => { profile.set[k]  += (w.set?.[k]  || 0); });
    Object.keys(profile.area).forEach(k  => { profile.area[k]  += ( w.area?.[k]  || 0); });
    Object.keys(profile.priv).forEach(k => { profile.priv[k] += (w.priv?.[k] || 0); });
    Object.keys(profile.size).forEach(k => { profile.size[k] += (w.size?.[k] || 0); });
  });
  const avg = obj => Object.fromEntries(Object.entries(obj).map(([k,v]) => [k, v/n]));
  return {
    od: avg(profile.od), abs: avg(profile.abs), dyn: avg(profile.dyn),
    clr: avg(profile.clr), mas: avg(profile.mas), set: avg(profile.set),
    area: avg(profile.area), priv: avg(profile.priv), size: avg(profile.size)
  };
}

export function scoreTeam(team, profile) {
  let score = 0;
  // OD has double weight — elite teams score much higher
  score += ((team.off - 50) / 50) * profile.od.off * 2;
  score += ((team.def - 50) / 50) * profile.od.def * 2;
  ABS_METRICS.forEach(m => {
    score += ((team[m] || 0) / 100) * (profile.abs[m] || 0);
  });
  const dynWeight = 1 / DYN_METRICS.length;
  DYN_METRICS.forEach(m => {
    const userDyn = profile.dyn[m] || 0;
    const teamVal = (team[m] || 0) / 100;
    const direction = userDyn >= 0 ? teamVal : (1 - teamVal);
    score += direction * Math.abs(userDyn) * dynWeight * 10;
  });
  ['clr','mas','set','area','priv','size'].forEach(key => {
    const userPref = profile[key]?.[team[key]] || 0;
    score += userPref * 0.15;
  });
  return score;
}

function matchup(a, b, scores, opts = {}) {
  const { madness = 0, favoriteTeam = null } = opts;

  // Power-law seed multiplier — steep at top, flat in middle
  // 1v16: ~98%  2v15: ~94%  5v12: ~65%  8v9: ~51%
  const baseMult = team => 1 + 19 * Math.pow(team.seed_val / 100, 7);

  // Madness: blend seed multiplier toward 1.0 (pure coin flip at 100%)
  // madness 0 = full historical seeding, madness 100 = seedMult = 1 for both teams
  const madnessFactor = madness / 100;
  const seedMult = team => {
    const base = baseMult(team);
    return base + (1 - base) * madnessFactor;
  };

  let sA = scores[a.id] * seedMult(a);
  let sB = scores[b.id] * seedMult(b);

  // Favorite team boost — adds 15% to their score in every matchup
  if (favoriteTeam) {
    if (a.name === favoriteTeam) sA *= 1.15;
    if (b.name === favoriteTeam) sB *= 1.15;
  }

  const prob = sA / (sA + sB);
  return Math.random() < prob ? a : b;
}

export function simulateBracket(profile, opts = {}) {
  console.log('TEAMS count:', TEAMS.length);
  // Pre-score all teams once
  const scores = {};
  TEAMS.forEach((t, i) => {
    try {
      scores[t.id] = scoreTeam(t, profile);
    } catch(e) {
      console.error('Error scoring team', i, t, e);
    }
  });

  // Simulate each region independently
  const REGIONS = ['south', 'east', 'midwest', 'west'];
  const regionResults = {};
  const finalFour = [];

  REGIONS.forEach(region => {
    const teams = TEAMS.filter(t => t.region === region)
                       .sort((a, b) => a.seed - b.seed);

    // Round of 64: 1v16, 8v9, 5v12, 4v13, 6v11, 3v14, 7v10, 2v15
    const order = [[0,15],[7,8],[4,11],[3,12],[5,10],[2,13],[6,9],[1,14]];
    const rounds = [];
    let bracket = order.map(([i,j]) => [teams[i], teams[j]]);

    const roundNames = ['Round of 64','Round of 32','Sweet 16','Elite Eight'];
    let round = 0;

    while (bracket.length > 0) {
      const results = bracket.map(([a, b]) => ({
        teamA: a, teamB: b,
        winner: matchup(a, b, scores, opts),
        scoreA: +scores[a.id].toFixed(2),
        scoreB: +scores[b.id].toFixed(2),
      }));
      rounds.push({ name: roundNames[round] || 'Round', matchups: results });
      const winners = results.map(r => r.winner);
      if (winners.length === 1) break;
      bracket = [];
      for (let i = 0; i < winners.length; i += 2) {
        bracket.push([winners[i], winners[i+1]]);
      }
      round++;
    }

    const winner = rounds[rounds.length - 1].matchups[0].winner;
    regionResults[region] = { rounds, winner };
    finalFour.push(winner);
  });

  // Final Four: South vs West, East vs Midwest
  const sf1 = matchup(finalFour[0], finalFour[3], scores, opts);
  const sf2 = matchup(finalFour[1], finalFour[2], scores, opts);
  const champion = matchup(sf1, sf2, scores, opts);

  return {
    regionResults,
    finalFourRound: {
      name: 'Final Four',
      matchups: [
        { teamA: finalFour[0], teamB: finalFour[3], winner: sf1,
          scoreA: +scores[finalFour[0].id].toFixed(2), scoreB: +scores[finalFour[3].id].toFixed(2) },
        { teamA: finalFour[1], teamB: finalFour[2], winner: sf2,
          scoreA: +scores[finalFour[1].id].toFixed(2), scoreB: +scores[finalFour[2].id].toFixed(2) },
      ]
    },
    championshipRound: {
      name: 'Championship',
      matchups: [
        { teamA: sf1, teamB: sf2, winner: champion,
          scoreA: +scores[sf1.id].toFixed(2), scoreB: +scores[sf2.id].toFixed(2) },
      ]
    },
    champion,
  };
}

export function getChampionReason(champion, profile) {
  // Score every metric, tracking direction
  const scores = [];

  ABS_METRICS.forEach(m => {
    const s = ((champion[m] || 0) / 100) * (profile.abs[m] || 0);
    scores.push({ key: 'abs', metric: m, score: s, dir: 1 });
  });
  DYN_METRICS.forEach(m => {
    const userDyn = profile.dyn[m] || 0;
    const teamVal = champion[m] || 0;  // already on -0.25 to +0.25 scale
    // Only scores positively when user and team point the same direction
    const aligned = userDyn * teamVal;
    const s = Math.max(0, aligned);
    // dir reflects the shared direction — positive if both lean positive
    const dir = teamVal >= 0 ? 1 : -1;
    scores.push({ key: 'dyn', metric: m, score: s, dir });
  });

  scores.sort((a, b) => b.score - a.score);

  const first  = scores[0];
  const second = scores.find(s => s.key !== first.key) || scores[1];

  const desc = {
    abs: {
      '3pt': `${champion.name}'s long-range shooting matches your shoot-first mentality.`,
      ft:    `${champion.name}'s composure at the line mirrors your precise approach.`,
      reb:   `${champion.name}'s rebounding dominance aligns with your grind mindset.`,
      to:    `${champion.name}'s ball security reflects your low-risk style.`,
      pass:  `${champion.name}'s ball movement matches your team-first nature.`,
    },
    dyn: {
      // positive direction (team leans toward positive pole)
      pos: {
        mom:   `${champion.name} is riding a hot streak that matches your energy perfectly.`,
        star:  `${champion.name}'s star power speaks to your love of individual brilliance.`,
        leg:   `${champion.name}'s storied history aligns with your respect for tradition.`,
        aca:   `${champion.name}'s academic reputation matches your value for intelligence.`,
        tempo: `${champion.name}'s up-tempo style perfectly matches your energy and pace.`,
        con:   `${champion.name}'s consistency mirrors your steady, reliable approach.`,
        bal:   `${champion.name}'s balance reflects your well-rounded personality.`,
        exp:   `${champion.name}'s veteran roster aligns with your trust in experience.`,
      },
      // negative direction (team leans toward negative pole — you wanted that)
      neg: {
        mom:   `${champion.name}'s underdog energy matches your love of a team still finding their stride.`,
        star:  `${champion.name}'s cohesive unit mirrors your belief in the collective over the individual.`,
        leg:   `${champion.name}'s fresh program speaks to your appetite for a new story.`,
        aca:   `${champion.name}'s we-came-to-play mentality matches your all-business approach.`,
        tempo: `${champion.name}'s methodical pace suits your preference for a slower, grind-it-out game.`,
        con:   `${champion.name}'s unpredictability matches your taste for chaos and surprise.`,
        bal:   `${champion.name}'s specialized identity mirrors your appreciation for a team that owns its style.`,
        exp:   `${champion.name}'s young roster matches your belief in hungry, unproven talent.`,
      },
    },
  };

  const getDesc = ({ key, metric, dir }) => {
    if (key === 'abs') return desc.abs[metric];
    return desc.dyn[dir >= 0 ? 'pos' : 'neg'][metric];
  };

  const reason1 = getDesc(first)  || `${champion.name} is your perfect bracket match.`;
  const reason2 = second ? (getDesc(second) || null) : null;

  return { reason: reason1, reason2 };
}

// ─── Women's tournament simulation ────────────────────────────────────
import { WTEAMS } from '../data/wteams.js';

function wMatchup(a, b, scores, opts = {}) {
  const { madness = 0, favoriteTeam = null } = opts;
  const baseMult = team => 1 + 19 * Math.pow(team.seed_val / 100, 7);
  const madnessFactor = madness / 100;
  const seedMult = team => {
    const base = baseMult(team);
    return base + (1 - base) * madnessFactor;
  };
  let sA = scores[a.id] * seedMult(a);
  let sB = scores[b.id] * seedMult(b);
  if (favoriteTeam) {
    if (a.name === favoriteTeam) sA *= 1.15;
    if (b.name === favoriteTeam) sB *= 1.15;
  }
  const prob = sA / (sA + sB);
  return Math.random() < prob ? a : b;
}

export function simulateWBracket(profile, opts = {}) {
  // Pre-score all women's teams
  const scores = {};
  WTEAMS.forEach(t => { scores[t.id] = scoreTeam(t, profile); });

  const REGIONS = ['fortworth1', 'sacramento4', 'sacramento2', 'fortworth3'];
  const regionResults = {};
  const finalFour = [];

  REGIONS.forEach(region => {
    const teams = WTEAMS.filter(t => t.region === region)
                        .sort((a, b) => a.seed - b.seed);

    console.log(`W region ${region}: ${teams.length} teams`, teams.map(t => t.seed));

    if (teams.length !== 16) {
      console.error(`Expected 16 teams in ${region}, got ${teams.length}`);
      return;
    }

    const order = [[0,15],[7,8],[4,11],[3,12],[5,10],[2,13],[6,9],[1,14]];
    const roundNames = ['Round of 64','Round of 32','Sweet 16','Elite Eight'];
    const rounds = [];
    let bracket = order.map(([i,j]) => [teams[i], teams[j]]);
    let round = 0;

    while (bracket.length > 0) {
      const results = bracket.map(([a, b]) => {
        const sA = scores[a.id]; const sB = scores[b.id];
        return {
          teamA: a, teamB: b,
          winner: wMatchup(a, b, scores, opts),
          scoreA: +sA.toFixed(2), scoreB: +sB.toFixed(2),
        };
      });
      rounds.push({ name: roundNames[round] || 'Round', matchups: results });
      const winners = results.map(r => r.winner);
      if (winners.length === 1) break;
      bracket = [];
      for (let i = 0; i < winners.length; i += 2) bracket.push([winners[i], winners[i+1]]);
      round++;
    }

    const winner = rounds[rounds.length - 1].matchups[0].winner;
    regionResults[region] = { rounds, winner };
    finalFour.push(winner);
  });

  // Final Four: Fort Worth 1 vs Sacramento 4, Sacramento 2 vs Fort Worth 3
  const sf1 = wMatchup(finalFour[0], finalFour[3], scores, opts);
  const sf2 = wMatchup(finalFour[1], finalFour[2], scores, opts);
  const champion = wMatchup(sf1, sf2, scores, opts);

  return {
    regionResults,
    finalFourRound: {
      name: 'Final Four',
      matchups: [
        { teamA: finalFour[0], teamB: finalFour[3], winner: sf1,
          scoreA: +scores[finalFour[0].id].toFixed(2), scoreB: +scores[finalFour[3].id].toFixed(2) },
        { teamA: finalFour[1], teamB: finalFour[2], winner: sf2,
          scoreA: +scores[finalFour[1].id].toFixed(2), scoreB: +scores[finalFour[2].id].toFixed(2) },
      ]
    },
    championshipRound: {
      name: 'Championship',
      matchups: [
        { teamA: sf1, teamB: sf2, winner: champion,
          scoreA: +scores[sf1.id].toFixed(2), scoreB: +scores[sf2.id].toFixed(2) },
      ]
    },
    champion,
  };
}