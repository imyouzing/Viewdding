const {test}=require('node:test');const assert=require('node:assert/strict');const M=require('../dist/survey-core.js');
const a=()=>({A1:['seoul_all'],'A2-precision':['open'],'A2-flexibility':['venue_first'],A3:['181_250'],'A3-exact':['220'],A4:['reference_limit'],'A5-mode':['mixed'],'A5-extra':['none'],B1:['bright_natural','private_house'],'B2-format':['separate'],'B2-solo':['preferred'],B3:['quality'],B4:['hall_mood','venue_total_budget','meal']});
const pair=()=>({version:M.schema.version,primary:{answers:a(),completedAt:'2026-09-20T00:00:00Z'}});
test('nine questions preserve required answers, exclusive options and ranked choices',()=>{
 assert.equal(M.steps.length,9);assert.equal(M.steps.filter(s=>s.part.mode==='individual').length,4);
 assert.ok(M.steps.every(s=>M.valid(s.question,a())));
 const mood=M.byId('B1');let v=M.toggle(mood,[],'bright_natural');v=M.toggle(mood,v,'private_house');assert.equal(M.toggle(mood,v,'dark_dramatic'),v);assert.deepEqual(M.toggle(mood,v,'unknown'),['unknown']);assert.deepEqual(M.toggle(mood,['unknown'],'classic_chapel'),['classic_chapel']);
 let ranks=['meal','parking','schedule'];assert.equal(M.valid(M.byId('B4'),{B4:ranks}),true);ranks=M.toggle(M.byId('B4'),ranks,'parking');assert.deepEqual(ranks,['meal','schedule']);assert.equal(M.valid(M.byId('B4'),{B4:ranks}),false);
 assert.equal(M.valid(M.byId('A5-extra'),{'A5-extra':['none','parking_ease']}),false);
});
test('date and numerical inputs reject incomplete or invalid values',()=>{
 const schedule=M.steps[1].question;
 assert.equal(M.valid(schedule,{'A2-precision':['exact_date'],'A2-date':['2027-02-30'],'A2-flexibility':['fixed']}),false);
 assert.equal(M.valid(schedule,{'A2-precision':['year_month'],'A2-month':['2027-04'],'A2-flexibility':['nearby_period']}),true);
 assert.equal(M.valid(schedule,{'A2-precision':['year_month'],'A2-month':['2027-13'],'A2-flexibility':['nearby_period']}),false);
 assert.equal(M.valid(M.byId('A3'),{...a(),'A3-exact':['-1']}),false);assert.equal(M.valid(M.byId('A3'),{...a(),'A3-exact':['20.5']}),false);
 assert.equal(M.valid(M.steps[3].question,{A4:['custom'],'A4-max':['-500']}),false);
});
test('reference budget uses original regional medians, minimum guarantees and flexible ceilings',()=>{
 const b=M.budget(a());assert.equal(b.total,23600000);assert.equal(b.maximum,23600000);
 const small=M.budget({...a(),A3:['under_80'],'A3-exact':[]});assert.equal(small.guests,60);assert.equal(small.billable,200);assert.equal(small.total,22000000);
 assert.equal(M.budget({...a(),A1:['gyeonggi_all'],A4:['plus_5m']}).maximum,21860000);
 assert.equal(M.budget({...a(),A1:['seoul_all','busan_all']}).key,'national');
 assert.equal(M.budget({...a(),A3:['unknown'],'A3-exact':[],A4:['conditions_first']}).maximum,null);
});
test('couple results intersect moods and ceremony preferences without inventing budget availability',()=>{
 const p=pair();assert.deepEqual(M.filters(p).type,['밝은 홀','하우스 웨딩']);assert.equal(M.filters(p).guests,'220');
 p.partner={answers:{B1:['private_house','classic_chapel'],'B2-format':['simultaneous'],'B2-solo':['required'],B3:['price'],B4:['meal','parking','hall_mood']}};
 const comparison=M.comparison(p);assert.deepEqual(comparison.moods,['private_house']);assert.deepEqual(comparison.priorities,['hall_mood','meal']);assert.ok(comparison.talking.some(t=>t.title==='예식과 식사 방식'));
 const f=M.filters(p);assert.deepEqual(f.type,['하우스 웨딩']);assert.deepEqual(f.ceremonies,[]);assert.equal(f.natural,false);assert.equal(f.meal,'');assert.equal(f.guests,'220');
});
test('result links round-trip valid responses and reject malformed or incomplete payloads',()=>{
 const p=pair();assert.deepEqual(M.decode(M.encode(p)),p);assert.equal(M.decode('not-json'),null);assert.equal(M.decode(M.encode({version:p.version,primary:{answers:{}}})),null);
 const malicious=pair();malicious.primary.answers.B1=['<img src=x onerror=alert(1)>'];assert.equal(M.cleanPair(malicious),null);
});
test('checklist and inquiry include selected priorities and shared conditions',()=>{
 const p=pair();p.primary.answers['A5-extra']=['parking_ease'];const rows=M.checklist(p);assert.ok(rows.some(r=>r[0]==='주차'));assert.ok(rows.some(r=>r[0]==='홀 분위기'));assert.ok(rows.some(r=>r[0]==='식사·연회'));
 assert.ok(M.csv(p).startsWith('\uFEFF'));assert.match(M.template(p),/220명/);assert.match(M.template(p),/서울 전체/);assert.match(M.template(p),/2,360만 원/);
});
