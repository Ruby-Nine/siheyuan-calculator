export function calculate({pepe = 1, rabbit = 1, silver = 1, m3 = 1} = {}) {
  if (![1, 2].includes(pepe) || ![rabbit, silver, m3].every(v => [0, 1, 2].includes(v))) throw new RangeError('无效的角色状态');
  const base = pepe * 9;
  const bonus = silver * 75 + m3 * 30;
  // 使用整数百分数，避免浮点误差影响向下取整。
  const limit = Math.floor(base * (100 + bonus) / 100);
  const triggers = Math.ceil(limit / pepe);
  const extra = rabbit * triggers;
  const last = limit - (triggers - 1) * pepe;
  return {base, bonus, limit, triggers, extra, last, total: limit + extra, normal: pepe + rabbit, final: last + rabbit, efficiency: (limit + extra) / 9};
}

export function combinations() {
  const rows = [];
  for (let rabbit = 0; rabbit < 3; rabbit++) for (let silver = 0; silver < 3; silver++) for (let m3 = 0; m3 < 3; m3++) {
    const team = {rabbit, silver, m3};
    rows.push({...team, ordinary: calculate({...team, pepe: 1}).total, elite: calculate({...team, pepe: 2}).total});
  }
  return rows;
}
