export function calculate({pepe = 1, rabbit = 1, silver = 1, m3 = 1} = {}) {
  if (![1, 2].includes(pepe) || ![rabbit, silver, m3].every(v => [0, 1, 2].includes(v))) throw new RangeError('无效的角色状态');
  return scorePepe(pepe, rabbit, silver * 75 + m3 * 30);
}

function scorePepe(pepe, rabbit, bonus) {
  const base = pepe * 9;
  // 使用整数百分数，避免浮点误差影响向下取整。
  const limit = Math.floor(base * (100 + bonus) / 100);
  const triggers = Math.ceil(limit / pepe);
  const extra = rabbit * triggers;
  const last = limit - (triggers - 1) * pepe;
  return {base, bonus, limit, triggers, extra, last, total: limit + extra, normal: pepe + rabbit, final: last + rabbit, efficiency: (limit + extra) / 9};
}

// 每名奶兔、银灰只能选择一个目标。枚举目标后对每个佩佩独立取整。
export function bestTargets(pepes, rabbits, silvers, globalBonus) {
  const supports = [
    ...rabbits.map(rank => ({rabbit: rank, bonus: 0})),
    ...silvers.map(rank => ({rabbit: 0, bonus: rank * 75}))
  ];
  const rabbitStacks = pepes.map(() => 0);
  const bonuses = pepes.map(() => globalBonus);
  let best = {total: -1};
  function assign(targets) {
    if (targets.length === supports.length) {
      const layers = pepes.map((rank, i) => scorePepe(rank, rabbitStacks[i], bonuses[i]).total);
      const total = layers.reduce((sum, value) => sum + value, 0);
      if (total > best.total) best = {total, layers, targets: [...targets]};
      return;
    }
    const support = supports[targets.length];
    for (let i = 0; i < pepes.length; i++) {
      rabbitStacks[i] += support.rabbit;
      bonuses[i] += support.bonus;
      assign([...targets, i]);
      bonuses[i] -= support.bonus;
      rabbitStacks[i] -= support.rabbit;
    }
  }
  assign([]);
  return best;
}

export function combinations() {
  const rows = [];
  for (let rabbit = 0; rabbit < 3; rabbit++) for (let silver = 0; silver < 3; silver++) for (let m3 = 0; m3 < 3; m3++) {
    const team = {rabbit, silver, m3};
    rows.push({...team, ordinary: calculate({...team, pepe: 1}).total, elite: calculate({...team, pepe: 2}).total});
  }
  return rows;
}

// 抓到第三张即合成精锐，不抓第四张。
export function optimalLineups(slots = 8) {
  const ranks = [[], [1], [1, 1], [2]];
  const results = Array.from({length: 13}, () => ({total: -1, winners: []}));
  for (let p = 1; p <= 3; p++) {
    for (let r = 0; r <= 3; r++) {
      for (let s = 0; s <= 3; s++) {
        for (let m = 0; m <= 3; m++) {
          const copies = [p, r, s, m];
          const used = copies.reduce((sum, n) => sum + ranks[n].length, 0);
          if (used > slots) continue;
          const m3Bonus = ranks[m].reduce((sum, rank) => sum + rank * 30, 0);
          const assignment = bestTargets(ranks[p], ranks[r], ranks[s], m3Bonus);
          const group = results[p + r + s + m];
          if (assignment.total > group.total) {
            group.total = assignment.total;
            group.winners = [];
          }
          if (assignment.total === group.total) group.winners.push({copies, ...assignment});
        }
      }
    }
  }
  return results.slice(1);
}
