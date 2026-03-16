import { TEAMS } from '../data/teams.js';

export const ABS_METRICS = ['3pt', 'ft', 'reb', 'to', 'pass', 'sos'];
export const DYN_METRICS = ['mom', 'star', 'leg', 'aca', 'size', 'tempo', 'con', 'bal', 'exp'];

export function buildUserProfile(answers) {
  const n = answers.length;
  if (n === 0) return null;
  const profile = {
    od:   { off: 0, def: 0 },
    abs:  { '3pt': 0, ft: 0, reb: 0, to: 0, pass: 0, sos: 0, seed: 0 },
    dyn:  { mom: 0, star: 0, leg: 0, aca: 0, size: 0, tempo: 0, con: 0, bal: 0, exp: 0 },
    clr:  { red: 0, blue: 0, other: 0 },
    mas:  { cats: 0, people: 0, birds: 0, other: 0 },
    set:  { city: 0, suburban: 0, rural: 0 },
    area:  { south: 0, midwest: 0, east: 0, west: 0 },
    priv: { private: 0, public: 0 },
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
  });
  const avg = obj => Object.fromEntries(Object.entries(obj).map(([k,v]) => [k, v/n]));
  return {
    od: avg(profile.od), abs: avg(profile.abs), dyn: avg(profile.dyn),
    clr: avg(profile.clr), mas: avg(profile.mas), set: avg(profile.set),
    area: avg(profile.area), priv: avg(profile.priv)
  };
}

export function scoreTeam(team, profile) {
  let score = 0;
  score += ((team.off - 70) / 70) * profile.od.off;
  score += ((team.def - 70) / 70) * profile.od.def;
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
  ['clr','mas','set','area','priv'].forEach(key => {
    const userPref = profile[key]?.[team[key]] || 0;
    score += userPref * 0.15;
  });
  return score;
}

function matchup(a, b, scores) {
  // Apply seed as a fixed multiplier so seeding always matters
  // seed_val ranges 8-98, normalize to 0.5-1.0 range so it modulates not dominates
  const seedMult = team => 0.3 + (team.seed_val / 100) * 0.7;
  const sA = scores[a.id] * seedMult(a);
  const sB = scores[b.id] * seedMult(b);
  const prob = sA / (sA + sB);
  return Math.random() < prob ? a : b;
}

export function simulateBracket(profile) {
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
    console.log(region, 'teams count:', teams.length, teams.map(t => t.seed));
    let bracket = order.map(([i,j]) => [teams[i], teams[j]]);

    const roundNames = ['Round of 64','Round of 32','Sweet 16','Elite Eight'];
    let round = 0;

    while (bracket.length > 0) {
      const results = bracket.map(([a, b]) => ({
        teamA: a, teamB: b,
        winner: matchup(a, b, scores),
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
  const sf1 = matchup(finalFour[0], finalFour[3], scores);
  const sf2 = matchup(finalFour[1], finalFour[2], scores);
  const champion = matchup(sf1, sf2, scores);

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
  let topKey = 'abs', topMetric = 'reb', topScore = -1;
  ABS_METRICS.forEach(m => {
    const s = ((champion[m === 'seed' ? 'seed_val' : m] || 0) / 100) * (profile.abs[m] || 0);
    if (s > topScore) { topScore = s; topMetric = m; topKey = 'abs'; }
  });
  DYN_METRICS.forEach(m => {
    const s = Math.abs(profile.dyn[m] || 0) * ((champion[m] || 0) / 100);
    if (s > topScore) { topScore = s; topMetric = m; topKey = 'dyn'; }
  });
  const desc = {
    abs: {
      '3pt': `${champion.name}'s long-range shooting matches your shoot-first mentality.`,
      ft:    `${champion.name}'s composure at the line mirrors your precise approach.`,
      reb:   `${champion.name}'s rebounding dominance aligns with your grind mindset.`,
      to:    `${champion.name}'s ball security reflects your low-risk style.`,
      pass:  `${champion.name}'s ball movement matches your team-first nature.`,
      sos:   `${champion.name} has been battle-tested — just like you, they rise when it matters.`,
      seed:  `${champion.name}'s seeding reflects the proven program you gravitate toward.`,
    },
    dyn: {
      mom:   `${champion.name} is riding a hot streak that matches your energy perfectly.`,
      star:  `${champion.name}'s star power speaks to your love of individual brilliance.`,
      leg:   `${champion.name}'s storied history aligns with your respect for tradition.`,
      aca:   `${champion.name}'s academic reputation matches your value for intelligence.`,
      size:  `${champion.name}'s school size fits the environment you thrive in.`,
      tempo: `${champion.name}'s pace of play perfectly matches your energy and style.`,
      con:   `${champion.name}'s consistency mirrors your steady, reliable approach.`,
      bal:   `${champion.name}'s balance reflects your well-rounded personality.`,
      exp:   `${champion.name}'s experience aligns with your trust in proven veterans.`,
    },
  };
  return desc[topKey]?.[topMetric] || `${champion.name} is your perfect bracket match.`;
}

// ─── Women's tournament simulation ────────────────────────────────────
import { WTEAMS } from '../data/wteams.js';

// Women's seed multiplier — stronger advantage for top seeds
// Seeds 14-16 are 1-372 all time in women's tournament
function wSeedMult(team) {
  return 0.05 + (team.seed_val / 100) * 0.95;
}

function wMatchup(a, b, scores) {
  const sA = scores[a.id] * wSeedMult(a);
  const sB = scores[b.id] * wSeedMult(b);
  const prob = sA / (sA + sB);
  return Math.random() < prob ? a : b;
}

export function simulateWBracket(profile) {
  // Pre-score all women's teams
  const scores = {};
  WTEAMS.forEach(t => { scores[t.id] = scoreTeam(t, profile); });

  const REGIONS = ['spokane1', 'birmingham2', 'birmingham3', 'spokane4'];
  const regionResults = {};
  const finalFour = [];

  REGIONS.forEach(region => {
    const teams = WTEAMS.filter(t => t.region === region)
                        .sort((a, b) => a.seed - b.seed);

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
          winner: wMatchup(a, b, scores),
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

  // Final Four: Spokane1 vs Spokane4, Birmingham2 vs Birmingham3
  const sf1 = wMatchup(finalFour[0], finalFour[3], scores);
  const sf2 = wMatchup(finalFour[1], finalFour[2], scores);
  const champion = wMatchup(sf1, sf2, scores);

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