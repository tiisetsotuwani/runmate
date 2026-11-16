import test from 'node:test';
import assert from 'node:assert/strict';
import {findRunners,formatPace,updateInvitation} from '../src/domain.mjs';
const runner={id:'a',name:'Example',area:'Pretoria East',pace:360,distance:5,slot:'Early morning',bio:''};
const filters={area:'Pretoria East',pace:360,distance:5,slot:'Any time'};
test('inclusive pace and distance boundaries',()=>{
  assert.equal(findRunners([{...runner,pace:420,distance:7}],filters).length,1);
  assert.equal(findRunners([{...runner,pace:421}],filters).length,0);
  assert.equal(findRunners([{...runner,distance:7.1}],filters).length,0);
});
test('matches area and available time',()=>{
  assert.deepEqual(findRunners([runner],{...filters,area:'Centurion'}),[]);
  assert.deepEqual(findRunners([runner],{...filters,slot:'Evening'}),[]);
});
test('self and blocked runners are excluded',()=>{
  assert.deepEqual(findRunners([runner],{...filters,selfId:'a'}),[]);
  assert.deepEqual(findRunners([runner],{...filters,blockedIds:['a']}),[]);
});
test('unknown pace supports beginners',()=>{
  assert.equal(findRunners([{...runner,pace:600}],{...filters,pace:null}).length,1);
});
test('invalid filters rejected; malformed runner ignored',()=>{
  for(const value of [0,-1,NaN,Infinity]) {
    assert.throws(()=>findRunners([runner],{...filters,pace:value}));
    assert.throws(()=>findRunners([runner],{...filters,distance:value}));
  }
  assert.deepEqual(findRunners([{...runner,pace:NaN}],filters),[]);
});
test('ranking does not mutate input',()=>{
  const input=[{...runner,id:'b',pace:400},runner];
  assert.deepEqual(findRunners(input,filters).map(r=>r.id),['a','b']);
  assert.equal(input[0].id,'b');
});
test('invitation duplicate prevention, cancellation and re-invitation',()=>{
  const first=updateInvitation([],'a','invite');
  assert.strictEqual(updateInvitation(first,'a','invite'),first);
  const cancelled=updateInvitation(first,'a','cancel');
  assert.equal(cancelled[0].status,'cancelled');
  assert.equal(first[0].status,'pending');
  assert.deepEqual(updateInvitation(cancelled,'a','invite'),first);
  assert.deepEqual(updateInvitation([],'a','cancel'),[]);
  assert.throws(()=>updateInvitation([],' ','invite'));
});
test('pace formatting rounds across minute boundary',()=>{
  assert.equal(formatPace(360),'6:00');
  assert.equal(formatPace(359.8),'6:00');
  assert.throws(()=>formatPace(0));
});
