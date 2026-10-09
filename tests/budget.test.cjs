const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../dist/budget-core.js');
test('instalments belong to contract; only completed instalments count as paid',()=>{
 const r=C.normalize({estimate:'1200000',contract:'1,000,000',deposit:'200000',interim:'300000',depositPaid:true});
 assert.deepEqual(C.totals(r),{forecast:1000000,contract:1000000,balance:500000,paid:200000,remaining:800000,known:true});
 const done=C.totals(C.normalize({...r,interimPaid:true,balancePaid:true}));assert.equal(done.paid,1000000);assert.equal(done.remaining,0);
});
test('package included and unused extra costs never double count',()=>{
 const records=[C.normalize({contract:1000000,deposit:100000,depositPaid:true}),C.normalize({estimate:100000,mode:'included'}),C.normalize({contract:50000,mode:'unused'}),C.normalize({estimate:200000})];
 assert.deepEqual(C.aggregate(records),{forecast:1200000,contract:1000000,paid:100000,remaining:900000,known:2,uncontracted:1});
});
test('blank is unknown, zero is known, estimated costs are not outstanding contracts',()=>{
 assert.equal(C.totals(C.normalize()).known,false);assert.equal(C.totals(C.normalize({contract:0})).known,true);
 assert.equal(C.totals(C.normalize({estimate:30000})).remaining,0);
 assert.equal(C.totals(C.normalize({contract:0,estimate:10000})).forecast,0);
});
test('rejects negative, unsafe, fractional and overpaid plans; supports full prepayment',()=>{
 for(const v of ['-1','1.5','1e9','NaN','9999999999999999'])assert.throws(()=>C.amount(v));
 assert.throws(()=>C.normalize({deposit:100}));assert.throws(()=>C.normalize({contract:100,deposit:60,interim:60}));
 assert.equal(C.totals(C.normalize({contract:100,deposit:100,depositPaid:true})).remaining,0);
});
test('JSON roundtrip preserves payment dates, flags and notes',()=>{
 const r=C.normalize({contract:10000,deposit:5000,depositPaid:true,depositDate:'2026-10-01',note:'추가금 포함',vendor:'업체 A'});
 assert.deepEqual(C.normalize(JSON.parse(JSON.stringify(r))),r);
});
const vm=require('node:vm'),fs=require('node:fs');
function host(storage=new Map()){
 const events={},scrolls=[];
 const ctx={BudgetCore:C,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{addEventListener:(k,fn)=>(events[k]??=[]).push(fn),querySelectorAll:()=>[],querySelector:()=>null,getElementById:()=>null},icon:()=>'',heading:()=>'',toast:()=>{},crypto:require('node:crypto'),scrollY:430,scrollX:0,scrollTo:o=>scrolls.push(o),render(){ctx.html=ctx.WeddingBudget.render()},FormData:class{constructor(f){this.data=f.values}get(k){return this.data[k]??null}}};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/budget.js','utf8'),ctx);return{ctx,events,storage,scrolls};
}
function form(values,selector,dataset){const els={};return{values,dataset,matches:s=>s===selector,querySelector:s=>els[s]??=(s==='button[type=submit]'?{focus(){}}:{textContent:''})}}
function submit(h,f){for(const fn of h.events.submit)fn({target:f,preventDefault(){}})}
test('editing a payment updates whole-page and home totals, persists draft, and retains page position',()=>{
 const h=host();submit(h,form({contract:'1000000',deposit:'200000',interim:'300000',depositPaid:'on',note:'<script>no</script>'},'[data-b-record]',{bRecord:'venue-0'}));
 assert.match(h.ctx.html,/남은 결제/);assert.match(h.ctx.html,/800,000원/);assert.match(h.ctx.html,/&lt;script&gt;no&lt;\/script&gt;/);assert.deepEqual({...h.scrolls.at(-1)},{top:430,left:0,behavior:'instant'});
 const reloaded=host(h.storage);assert.match(reloaded.ctx.WeddingBudget.homeCard(),/800,000원/);assert.match(reloaded.ctx.WeddingBudget.render(),/1,000,000원/);
});
test('invalid payment cannot overwrite a previous valid draft',()=>{
 const h=host();submit(h,form({contract:'1000'},'[data-b-record]',{bRecord:'venue-0'}));const before=[...h.storage.values()][0];
 submit(h,form({contract:'1000',deposit:'2000'},'[data-b-record]',{bRecord:'venue-0'}));assert.equal([...h.storage.values()][0],before);
});
test('additional fee actions deduplicate and store a new cost item without a made-up price',()=>{
 const h=host();const e={target:{closest:()=>({dataset:{bExtra:'venue:0'}})}};for(let i=0;i<2;i++)for(const fn of h.events.click)fn(e);
 const state=JSON.parse([...h.storage.values()][0]);assert.equal(state.added.length,1);assert.equal(state.added[0].extra,true);assert.equal(Object.keys(state.records).length,0);
});
test('storage failure is visible and does not claim a saved record',()=>{
 const h=host();h.ctx.localStorage.setItem=()=>{throw Error('quota')};submit(h,form({target:'1000'},'[data-b-target]',{}));assert.match(h.ctx.html,/임시 저장에 실패/);
});
