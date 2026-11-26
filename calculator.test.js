import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calculate,combinations} from './calculator.js';
// 来自用户提供的完整表，按奶兔 / 银灰 / M3 的状态 0、1、2 排序。
const expected = [
  [9,18],[11,23],[14,28],[15,31],[18,36],[21,42],[22,45],[25,50],[27,55],
  [18,27],[22,35],[28,42],[30,47],[36,54],[42,63],[44,68],[50,75],[54,83],
  [27,36],[33,47],[42,56],[45,63],[54,72],[63,84],[66,91],[75,100],[81,111]
];
test('全部54种情况与给定表格一致',()=>{
  const rows = combinations(); assert.equal(rows.length,27);
  rows.forEach((row,i)=>assert.deepEqual([row.ordinary,row.elite],expected[i],JSON.stringify(row)));
});
test('全精锐最后一次佩佩1层、奶兔完整2层',()=>{
  const r=calculate({pepe:2,rabbit:2,silver:2,m3:2});
  assert.equal(r.limit,55);assert.equal(r.triggers,28);assert.equal(r.last,1);assert.equal(r.final,3);assert.equal(r.total,111);
});
test('百分比先相加再取整',()=>{assert.equal(calculate({pepe:1,rabbit:0,silver:1,m3:1}).limit,18);});
test('非法状态不被接受',()=>{assert.throws(()=>calculate({pepe:0}),RangeError);});
