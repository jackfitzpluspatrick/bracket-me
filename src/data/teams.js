// 16 teams — enough for a clean single-region bracket sim
// Metrics scale 0–10 unless noted
// pace: possessions/game proxy (higher = faster)
// threeRate: reliance on 3-point shooting (higher = more)
// defense: defensive intensity (higher = lockdown)
// starPower: individual talent / NBA prospects
// experience: roster veteran-ness (higher = older team)

export const TEAMS = [
  { id: 1,  name: "Duke",            seed: 1,  pace: 8, threeRate: 6, defense: 7, starPower: 10, experience: 4 },
  { id: 2,  name: "Kentucky",        seed: 2,  pace: 7, threeRate: 5, defense: 8, starPower: 9,  experience: 5 },
  { id: 3,  name: "Kansas",          seed: 3,  pace: 6, threeRate: 7, defense: 8, starPower: 7,  experience: 8 },
  { id: 4,  name: "Houston",         seed: 4,  pace: 5, threeRate: 4, defense: 10, starPower: 6, experience: 7 },
  { id: 5,  name: "Gonzaga",         seed: 5,  pace: 9, threeRate: 7, defense: 6, starPower: 8,  experience: 7 },
  { id: 6,  name: "UConn",           seed: 6,  pace: 6, threeRate: 6, defense: 9, starPower: 7,  experience: 8 },
  { id: 7,  name: "Arizona",         seed: 7,  pace: 8, threeRate: 8, defense: 6, starPower: 8,  experience: 5 },
  { id: 8,  name: "Tennessee",       seed: 8,  pace: 5, threeRate: 4, defense: 9, starPower: 6,  experience: 8 },
  { id: 9,  name: "Purdue",          seed: 9,  pace: 5, threeRate: 6, defense: 7, starPower: 7,  experience: 9 },
  { id: 10, name: "Baylor",          seed: 10, pace: 7, threeRate: 8, defense: 7, starPower: 6,  experience: 6 },
  { id: 11, name: "UCLA",            seed: 11, pace: 7, threeRate: 7, defense: 6, starPower: 7,  experience: 6 },
  { id: 12, name: "Creighton",       seed: 12, pace: 8, threeRate: 9, defense: 5, starPower: 5,  experience: 8 },
  { id: 13, name: "Michigan St.",    seed: 13, pace: 6, threeRate: 5, defense: 7, starPower: 5,  experience: 9 },
  { id: 14, name: "Florida Atlantic", seed: 14, pace: 8, threeRate: 8, defense: 6, starPower: 4, experience: 7 },
  { id: 15, name: "VCU",             seed: 15, pace: 9, threeRate: 5, defense: 8, starPower: 3,  experience: 7 },
  { id: 16, name: "Furman",          seed: 16, pace: 7, threeRate: 9, defense: 4, starPower: 2,  experience: 8 },
];
