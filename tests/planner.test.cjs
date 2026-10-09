const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const M=require('../dist/planner-core.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('dist/planner-data.js','utf8'),ctx);const D=ctx.window.PlannerData;
test('both spreadsheet templates supplement the plan without copying sample personal records',()=>{
 const old=JSON.parse(fs.readFileSync('dist/data/roadmap.json','utf8')).flatMap(s=>s.items);
 assert.equal(new Set(D.items.map(t=>t.id)).size,D.items.length);
 for(const t of old)assert.ok(D.items.some(n=>n.id===t.id),'preserve legacy record '+t.id);
 assert.ok(D.items.some(t=>t.id==='rental_return'));assert.ok(D.items.some(t=>t.id==='studio_select'));
 assert.ok(D.items.every(t=>D.stages.some(s=>s.id===t.stage)));
 const fresh=M.tasks(D,M.clean(null));assert.ok(fresh.every(t=>t.status==='todo'&&t.due===''));
 assert.doesNotMatch(JSON.stringify(D),/샤이봉봉|2028-01-01|아이웨딩|신라호텔|추천인/);
});
test('relative calendar dates clamp month ends and respect user-set dates',()=>{
 assert.equal(M.suggested('2028-03-31',{months:-1}),'2028-02-29');
 assert.equal(M.suggested('2027-01-01',{days:-1}),'2026-12-31');
 assert.equal(M.suggested('2027-04-17',{days:-14}),'2027-04-03');
 assert.equal(M.suggested('',{months:-1}),'');assert.equal(M.validDate('2027-02-30'),false);
 const state=M.clean({weddingDate:'2027-04-17',items:{venue_contract:{due:'2026-11-05',status:'doing'}}});
 const a=M.tasks(D,state).find(t=>t.id==='venue_contract');state.weddingDate='2028-06-01';
 const b=M.tasks(D,state).find(t=>t.id==='venue_contract');assert.equal(a.due,b.due);assert.equal(b.status,'doing');
});
test('legacy progress and custom tasks share filters and correct completion totals',()=>{
 const state=M.clean({focusStageId:'booking',items:{wedding_timing:{status:'done'},budget_range:{status:'skipped'},custom_a:{status:'doing',note:'상담 시간 확인'}},custom:[{id:'custom_a',title:'우리의 준비',stage:'start',category:'기본 계획'}]});
 const list=M.tasks(D,state),s=M.stats(list);assert.equal(s.done,1);assert.equal(s.skipped,1);assert.equal(s.active,D.items.length);assert.equal(s.doing,1);
 assert.equal(M.filter(list,{status:'doing',stage:'start'})[0].note,'상담 시간 확인');
 assert.ok(M.filter(list,{status:'open'}).every(t=>!['done','skipped'].includes(t.status)));
 assert.equal(M.tasks(D,M.clean({items:{venue_criteria:{status:'todo'}}}),true).find(t=>t.id==='venue_criteria').status,'todo');
});
