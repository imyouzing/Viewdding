const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const M=require('../dist/halls-core.js');
const data=JSON.parse(fs.readFileSync('dist/halls.json','utf8'));
const list=data.halls;
test('published export is unique, excludes private/internal rows, and joins halls separately',()=>{
 assert.equal(list.length,1196);assert.equal(new Set(list.map(h=>h.id)).size,list.length);
 assert.equal(new Set(list.map(h=>h.venueId)).size,697);
 assert.ok(list.every(h=>['확정','추정공개'].includes(h.review)));
 assert.ok(!JSON.stringify(data).includes('내부 의견'));
 assert.equal(list.find(h=>h.id==='H-GG-SUW-20260808-016').confidence,'B-강');
 assert.equal(list.find(h=>h.id==='H-GG-SUW-20260808-016').source,'https://www.iwedding.co.kr/enterprise/info/1698044950');
 assert.equal(list.filter(h=>h.photo).length,872);
 assert.ok(list.filter(h=>h.photo).every(h=>h.photo.url.startsWith('http')&&h.photo.credit&&h.photo.source));
});
test('search combines independent terms and preserves Korean spaces',()=>{
 const r=M.filter(list,{...M.initial(),query:'CN 계산'});assert.ok(r.length>=3);assert.ok(r.every(h=>h.name.includes('CN웨딩홀 계산')));
 assert.equal(M.filter(list,{...M.initial(),query:'zzzz존재하지않음'}).length,0);
});
test('region, district and type are intersected; reset restores complete data',()=>{
 const r=M.filter(list,{...M.initial(),region:'서울',district:'강남구',type:'밝은 홀'});
 assert.ok(r.length>0);assert.ok(r.every(h=>h.region==='서울'&&h.district==='강남구'&&h.types.includes('밝은 홀')));
 assert.equal(M.filter(list,M.initial()).length,1196);
});
test('unknown numbers are not treated as cheap or sufficiently large',()=>{
 const base={id:'a',name:'A',hall:'a',types:[],minimum:null,capacity:null,mealPrice:null};
 const fixtures=[base,{...base,id:'b',minimum:300,capacity:500,mealPrice:50000},{...base,id:'c',minimum:100,capacity:250,mealPrice:70000},{...base,id:'d',minimum:null,capacity:220,mealPrice:120000}];
 assert.deepEqual(M.filter(fixtures,{...M.initial(),guests:'200',meal:'100000'}).map(h=>h.id),['c']);
 assert.deepEqual(M.filter(fixtures,{...M.initial(),guests:'200'}).map(h=>h.id),['c','d']);
});
test('price sort places unknowns last; saved list only returns chosen IDs',()=>{
 const r=M.filter(list,{...M.initial(),sort:'meal'});let unknown=false,last=-Infinity;
 for(const h of r){if(h.mealPrice===null){unknown=true;continue}assert.equal(unknown,false);assert.ok(h.mealPrice>=last);last=h.mealPrice;}
 assert.equal(M.filter(list,{...M.initial(),saved:true},new Set([list[0].id])).length,1);
 assert.equal(M.filter(list,{...M.initial(),saved:true},new Set()).length,0);
});
// Exercise integration with a minimal non-browser host, including the actual event handlers.
async function host(storage=new Map(),fail=false){
 const events={};const elements={};
 const element=()=>({dataset:{},innerHTML:'',textContent:'',classList:{add(){},remove(){},toggle(){}},setAttribute(){},removeAttribute(){},focus(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return []},getBoundingClientRect(){return{}},showModal(){this.open=true},close(){this.open=false}});
 for(const id of ['#app','#breadcrumb','#page-number','#dialog','#dialog-content','.dialog-close','#notification','.mobile-menu','#sidebar','#toast','#hall-explorer'])elements[id]=element();
 const doc={querySelector:s=>elements[s]||null,querySelectorAll:()=>[],getElementById:id=>elements['#'+id]||null,addEventListener:(k,f)=>(events[k]??=[]).push(f),activeElement:null};
 const ctx={document:doc,location:{hash:'#halls'},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},CSS:{escape:s=>s},FormData:class{constructor(form){this.form=form}get(k){return this.form[k]}},console,fetch:async url=>({ok:!fail,json:async()=>url.startsWith('data/')?JSON.parse(fs.readFileSync('dist/'+url.split('?')[0],'utf8')):data}),setTimeout:()=>0,clearTimeout(){},AbortController,Set,Map,Date,Intl,crypto:require('node:crypto')};
 ctx.window=ctx;ctx.addEventListener=()=>{};ctx.matchMedia=()=>({matches:true});ctx.scrollTo=()=>{};
 vm.createContext(ctx);for(const f of ['hall-regions.js','halls-core.js','halls.js','survey-schema.js','survey-core.js','survey.js','catalog-model.js','journal.js','planner-data.js','planner-core.js','planner.js','budget-core.js','budget.js','app.js'])vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),ctx,{filename:f});
 await new Promise(resolve=>setImmediate(resolve));
 const click=el=>{for(const f of events.click||[])f({target:{closest:s=>s==='button,a'?el:null}})};
 const change=el=>{for(const f of events.change||[])f({target:{...el,matches:s=>s===('[data-'+(el.dataset.hallCompare?'hall-compare':'hall-filter')+']')}})};
 return{ctx,elements,events,click,change,storage};
}
test('venue route loads real cards, opens details, saves locally and restores after refresh',async()=>{
 const h=await host();const venue=list.find(x=>x.photo&&x.mealPrice);
 assert.match(h.elements['#hall-explorer'].innerHTML,/조건에 맞는 홀/);
 h.click({dataset:{hallDetail:venue.id},hasAttribute:()=>false});
 assert.equal(h.elements['#dialog'].open,true);assert.match(h.elements['#dialog-content'].innerHTML,/투어 전에 확인하세요/);
 h.click({dataset:{hallSave:venue.id},hasAttribute:()=>false});
 assert.ok(h.storage.get('viewdding.halls.saved.v1').includes(venue.id));
 const next=await host(h.storage);next.click({dataset:{hallMode:'saved'},hasAttribute:()=>false});
 assert.match(next.elements['#hall-explorer'].innerHTML,new RegExp(venue.id));
 assert.equal((next.elements['#hall-explorer'].innerHTML.match(/class="hall-card"/g)||[]).length,1);
});
test('comparison enforces three-candidate limit and renders the selected costs',async()=>{
 const h=await host();for(const v of list.slice(0,4))h.change({type:'checkbox',checked:true,dataset:{hallCompare:v.id}});
 h.click({id:'hall-compare-open',dataset:{},hasAttribute:()=>false});
 const html=h.elements['#dialog-content'].innerHTML;
 assert.match(html,/웨딩홀 나란히 비교/);assert.equal((html.match(/data-hall-save=/g)||[]).length,3);
 assert.match(html,/가격 확인일/);
});
test('failed import shows retry state instead of empty data',async()=>{
 const h=await host(new Map(),true);assert.match(h.elements['#hall-explorer'].innerHTML,/다시 불러오기/);
});
test('compact filters open one panel, retain choices, clear chips, and keep credits in details only',async()=>{
 const h=await host();const markup=()=>h.elements['#hall-explorer'].innerHTML;
 assert.doesNotMatch(markup(),/class="hall-filter-popover"/);
 assert.doesNotMatch(markup(),/class="photo-credit"/);
 h.click({dataset:{hallPanel:'region'},hasAttribute:()=>false});
 assert.match(markup(),/잠실\/송파\/강동/g);
 h.click({dataset:{regionBundle:'songpa_gangdong'},hasAttribute:()=>false});
 h.click({dataset:{},hasAttribute:k=>k==='data-hall-apply'});
 assert.match(markup(),/data-hall-clear="regionBundles"/);
 h.click({dataset:{hallPanel:'detail'},hasAttribute:()=>false});
 assert.match(markup(),/예식 운영/);
 assert.doesNotMatch(markup(),/class="hall-region-picker"/);
 h.click({dataset:{hallClear:'regionBundles',value:'songpa_gangdong'},hasAttribute:()=>false});
 assert.doesNotMatch(markup(),/data-hall-clear="regionBundles"/);
 const venue=list.find(v=>v.photo);h.click({dataset:{hallDetail:venue.id},hasAttribute:()=>false});
 assert.match(h.elements['#dialog-content'].innerHTML,/class="photo-credit"/);
});
test('load more appends without replacing existing cards or scrolling to the moved button',async()=>{
 const h=await host();let appended='',focused=null,position=null;
 const before=h.elements['#hall-explorer'].innerHTML;
 h.ctx.scrollY=1820;h.ctx.scrollX=0;h.ctx.scrollTo=options=>{position=options};
 h.elements['.hall-grid']={insertAdjacentHTML:(where,html)=>{assert.equal(where,'beforeend');appended+=html},querySelector:()=>({focus:opts=>{focused=opts}})};
 h.elements['#hall-more']={innerHTML:'',closest:()=>({remove(){}})};
 h.click({id:'hall-more',dataset:{},hasAttribute:()=>false});
 assert.equal(h.elements['#hall-explorer'].innerHTML,before);
 assert.equal((appended.match(/class="hall-card"/g)||[]).length,12);
 assert.equal(position.top,1820);assert.equal(position.behavior,'instant');
 assert.equal(focused.preventScroll,true);
 assert.match(h.elements['#hall-more'].innerHTML,/24 \/ 1,196/);
 assert.match(appended,/class="hall-heart /);
 assert.doesNotMatch(appended,/class="hall-card-actions"/);
 assert.equal(M.initial().sort,'name');
});
test('reference bundles preserve exact district membership and support multiple regions',()=>{
 const fixtures=[{id:'s',region:'서울',district:'송파구'},{id:'g',region:'서울',district:'강동구'},{id:'n',region:'서울',district:'강남구'},{id:'y',region:'경기',district:'성남시 분당구'},{id:'h',region:'경기',district:'하남시'}].map(h=>({...h,name:h.id,hall:'홀',types:[]}));
 assert.deepEqual(M.filter(fixtures,{...M.initial(),regionBundles:['songpa_gangdong']}).map(h=>h.id).sort(),['g','s']);
 assert.equal(M.filter(fixtures,{...M.initial(),regionBundles:['songpa_gangdong','seongnam_hanam']}).length,4);
 assert.deepEqual(M.toggleBundle(['songpa_gangdong','seongnam_hanam'],'seoul_all'),['seongnam_hanam','seoul_all']);
 assert.deepEqual(M.toggleBundle(['seoul_all'],'songpa_gangdong'),['songpa_gangdong']);
 assert.deepEqual(M.toggleBundle(['songpa_gangdong'],'all_nation'),['all_nation']);
});
test('reference detailed conditions combine with OR inside a group and AND across groups',()=>{
 const base={name:'홀',hall:'홀',types:[],region:'서울',district:'송파구',capacity:400,minimum:200,naturalLight:true,ceremony:'분리예식',interval:90,meal:'뷔페'};
 const fixtures=[{...base,id:'a'},{...base,id:'b',ceremony:'선택 가능',meal:'양식 Course A'},{...base,id:'c',interval:null},{...base,id:'d',meal:'',ceremony:'동시예식'},{...base,id:'e',naturalLight:false}];
 assert.deepEqual(M.filter(fixtures,{...M.initial(),guests:'250',ceremonies:['separate'],interval:'90',natural:true,meals:['buffet','course']}).map(h=>h.id),['a','b']);
 assert.equal(M.filter(fixtures,{...M.initial(),ceremonies:['separate','simultaneous']}).length,5);
 assert.equal(M.filter(fixtures,{...M.initial(),interval:'120'}).length,0);
});
test('filter changes are applied explicitly and dismissing a draft leaves results unchanged',async()=>{
 const h=await host();const initial=h.elements['#hall-explorer'].innerHTML;
 h.click({dataset:{hallPanel:'region'},hasAttribute:()=>false});
 h.click({dataset:{regionBundle:'songpa_gangdong'},hasAttribute:()=>false});
 assert.doesNotMatch(h.elements['#hall-explorer'].innerHTML,/data-hall-clear="regionBundles"/);
 h.click({dataset:{},hasAttribute:k=>k==='data-hall-close'});
 h.click({dataset:{hallPanel:'region'},hasAttribute:()=>false});
 assert.doesNotMatch(h.elements['#hall-explorer'].innerHTML,/class="hall-region-selection"/);
 assert.ok(initial.includes('1,196'));
});

test('multiple hall types apply together and can be removed or reset independently',async()=>{
 const fixtures=[{id:'a',types:['밝은 홀'],name:'A',hall:'A'},{id:'b',types:['어두운 홀'],name:'B',hall:'B'},{id:'c',types:['채플'],name:'C',hall:'C'}];
 assert.deepEqual(M.filter(fixtures,{...M.initial(),type:['밝은 홀','어두운 홀']}).map(h=>h.id),['a','b']);
 const h=await host();const click=(key,value)=>h.click({dataset:{hallOption:key,value},hasAttribute:()=>false});
 h.click({dataset:{hallPanel:'type'},hasAttribute:()=>false});
 click('type','밝은 홀');click('type','어두운 홀');
 h.click({dataset:{},hasAttribute:k=>k==='data-hall-apply'});
 let html=h.elements['#hall-explorer'].innerHTML;
 assert.equal((html.match(/data-hall-clear="type"/g)||[]).length,2);
 h.click({dataset:{hallClear:'type',value:'밝은 홀'},hasAttribute:()=>false});
 html=h.elements['#hall-explorer'].innerHTML;
 assert.equal((html.match(/data-hall-clear="type"/g)||[]).length,1);
 h.click({dataset:{hallPanel:'type'},hasAttribute:()=>false});click('type','');
 h.click({dataset:{},hasAttribute:k=>k==='data-hall-apply'});
 assert.doesNotMatch(h.elements['#hall-explorer'].innerHTML,/data-hall-clear="type"/);
 h.click({dataset:{hallPanel:'detail'},hasAttribute:()=>false});
 assert.doesNotMatch(h.elements['#hall-explorer'].innerHTML,/data-value="selectable"/);
});

// Simulate DOM replacement discarding nested scroll positions and browser focus scrolling.
function scrollHost(h){
 const container=h.elements['#hall-explorer'];let html=container.innerHTML,nodes=[];
 const rebuild=value=>{html=value;nodes=[...value.matchAll(/data-scroll-key="([^"]+)"/g)].map(([,key])=>({dataset:{scrollKey:key},scrollTop:0,scrollLeft:0}));h.ctx.scrollY=0};
 Object.defineProperty(container,'innerHTML',{get:()=>html,set:rebuild});
 container.querySelectorAll=()=>nodes;
 h.ctx.scrollX=0;h.ctx.scrollY=760;
 h.ctx.scrollTo=({top,left})=>{h.ctx.scrollY=top;h.ctx.scrollX=left};
 return key=>nodes.find(el=>el.dataset.scrollKey===key);
}
test('detail choices and reset retain panel scroll, page position and non-scrolling focus',async()=>{
 const h=await host(),node=scrollHost(h);
 h.click({dataset:{hallPanel:'detail'},hasAttribute:()=>false});
 node('filter-detail').scrollTop=280;
 const id='hall-option-meals-buffet';h.ctx.document.activeElement={id};let focused=false;
 h.elements['#'+id]={focus:options=>{assert.equal(options.preventScroll,true);focused=true}};
 h.click({dataset:{hallOption:'meals',value:'buffet'},hasAttribute:()=>false});
 assert.equal(node('filter-detail').scrollTop,280);assert.equal(h.ctx.scrollY,760);assert.equal(focused,true);
 h.click({dataset:{hallResetGroup:'detail'},hasAttribute:()=>false});
 assert.equal(node('filter-detail').scrollTop,280);assert.equal(h.ctx.scrollY,760);
 h.click({dataset:{hallPanel:'type'},hasAttribute:()=>false});
 assert.equal(node('filter-type').scrollTop,0);assert.equal(h.ctx.scrollY,760);
});
test('region options preserve both lists; changing regions starts only the new bundle list at top',async()=>{
 const h=await host(),node=scrollHost(h);
 h.click({dataset:{hallPanel:'region'},hasAttribute:()=>false});
 node('filter-region').scrollTop=45;node('region-groups').scrollTop=180;node('region-bundles-seoul').scrollTop=95;
 h.click({dataset:{regionBundle:'songpa_gangdong'},hasAttribute:()=>false});
 assert.equal(node('filter-region').scrollTop,45);assert.equal(node('region-groups').scrollTop,180);assert.equal(node('region-bundles-seoul').scrollTop,95);
 h.click({dataset:{regionGroup:'gyeonggi'},hasAttribute:()=>false});
 assert.equal(node('region-groups').scrollTop,180);assert.equal(node('region-bundles-gyeonggi').scrollTop,0);assert.equal(h.ctx.scrollY,760);
});
test('saving, comparison and same-page main rendering retain document position',async()=>{
 const h=await host();scrollHost(h);h.ctx.scrollY=1920;
 h.click({dataset:{hallSave:list[0].id},hasAttribute:()=>false});assert.equal(h.ctx.scrollY,1920);
 h.change({type:'checkbox',checked:true,dataset:{hallCompare:list[0].id}});assert.equal(h.ctx.scrollY,1920);
 const app=h.elements['#app'];let html=app.innerHTML;
 Object.defineProperty(app,'innerHTML',{get:()=>html,set:value=>{html=value;h.ctx.scrollY=0}});
 h.ctx.render();assert.equal(h.ctx.scrollY,1920);
});
test('service catalog dialogs invoke native dialog with the requested controls',async()=>{
 const h=await host();h.ctx.location.hash='#family';vm.runInContext('render()',h.ctx);
 h.click({dataset:{jFilter:'detail'},hasAttribute:()=>false});
 assert.equal(h.elements['#dialog'].open,true);assert.match(h.elements['#dialog-content'].innerHTML,/partySize/);
});
test('all public service pages render actual imported records with organized navigation',async()=>{
 const h=await host();
 for(const [route,content] of [['roadmap','결혼 시기 정하기'],['family','경복궁'],['invitation','청첩장 모임'],['essentials','준비 완료로 표시'],['snap','셀프 웨딩 스냅'],['color','진단 비용'],['collections','서울 밝은 홀'],['excel','저장한 웨딩홀'],['scrap','보관함']]){
  h.ctx.location.hash='#'+route;vm.runInContext('render()',h.ctx);assert.ok(h.elements['#app'].innerHTML.includes(content),route);
 }
});
test('Excel CSV includes every result, preserves unknowns and quotes safe spreadsheet cells',async()=>{
 const h=await host(),csv=h.ctx.Journal.csv(list);
 assert.equal(csv.charCodeAt(0),0xFEFF);assert.equal(csv.split('\r\n').length,list.length+1);
 assert.match(csv,/식대최저\(원\)/);assert.match(csv,/최小|최소보증인원/);assert.match(csv,/확인 필요/);
 const malicious={...list[0],name:'=SUM(1,2)',hall:'"큰 홀"'};
 assert.match(h.ctx.Journal.csv([malicious]),/"'=SUM\(1,2\)"/);assert.match(h.ctx.Journal.csv([malicious]),/""큰 홀""/);
});
test('restaurant room limits and personal color service combinations preserve source rules',async()=>{
 const h=await host(),M=h.ctx.CatalogModel,restaurants=JSON.parse(fs.readFileSync('dist/data/restaurants.json')),colors=JSON.parse(fs.readFileSync('dist/data/colors.json'));
 const r=M.filterRestaurants(restaurants,{...M.EMPTY_RESTAURANT_FILTERS,purpose:'family_meeting',partySize:8,privateRoomOnly:true});
 assert.ok(r.matched.length>0);assert.ok(r.unknown.length>0);assert.ok(r.matched.every(x=>x.restaurant.roomCapacity.min<=8&&x.restaurant.roomCapacity.max>=8));
 const c=M.filterPersonalColors(colors,{...M.EMPTY_PERSONAL_COLOR_FILTERS,serviceTags:['dress','couple'],priceBudgetMax:150000});assert.ok(c.matched.every(x=>x.vendor.serviceTags.includes('dress')&&x.vendor.serviceTags.includes('couple')&&x.vendor.priceEstimatedMin<=150000));assert.ok(c.unknown.every(x=>x.vendor.priceEstimatedMin===null));
});

test('bulk export is removed and only saved or temporary comparison selections can download',async()=>{
 const h=await host();assert.doesNotMatch(h.elements['#hall-explorer'].innerHTML,/data-j-export="results"|검색 결과 엑셀 받기/);
 h.ctx.location.hash='#excel';vm.runInContext('render()',h.ctx);const html=h.elements['#app'].innerHTML;
 assert.match(html,/data-j-excel-scope="saved" aria-pressed="true"/);assert.match(html,/지금 비교 중인 홀/);assert.doesNotMatch(html,/현재 검색 결과|data-j-excel-scope="results"/);
 h.ctx.Journal.download('results');assert.match(h.elements['#toast'].textContent,/내려받을 웨딩홀이 없어요/);
 h.ctx.Journal.download('theme');assert.match(h.elements['#toast'].textContent,/내려받을 웨딩홀이 없어요/);
 h.ctx.location.hash='#collections';vm.runInContext('render()',h.ctx);assert.doesNotMatch(h.elements['#app'].innerHTML,/data-j-export/);
});

test('planner progress, dates and custom records persist and appear in both views without scrolling',async()=>{
 const h=await host(new Map([['viewdding.album.roadmap.v1',JSON.stringify({focusStageId:'start',items:{budget_range:{status:'done'}}})]]));
 h.ctx.location.hash='#roadmap';h.ctx.render();h.ctx.scrollY=800;h.ctx.scrollX=0;
 h.ctx.scrollTo=({top})=>{h.ctx.scrollY=top};
 h.change({id:'p-check-parents_visit',type:'checkbox',checked:true,dataset:{pCheck:'parents_visit'}});
 assert.equal(h.ctx.scrollY,800);assert.equal(JSON.parse(h.storage.get('viewdding.album.roadmap.v1')).items.parents_visit.status,'done');
 const submit=form=>{for(const f of h.events.submit||[])f({target:form,preventDefault(){}})};
 submit({id:'planner-date-form',weddingDate:'2027-04-17'});
 submit({id:'planner-task-form',dataset:{taskId:'venue_contract'},title:'웨딩홀 계약하기',stage:'booking',category:'웨딩홀',status:'doing',owner:'함께',due:'2026-11-05',note:'계약 조건 확인'});
 submit({id:'planner-task-form',dataset:{},title:'우리의 추가 일정',stage:'start',category:'기본 계획',status:'todo',owner:'함께',due:'',note:'메모'});
 const next=await host(h.storage);next.ctx.location.hash='#checklist';next.ctx.render();
 assert.match(next.elements['#app'].innerHTML,/우리의 추가 일정/);assert.match(next.elements['#app'].innerHTML,/2026. 11. 05/);
 const stored=next.ctx.Planner.all();assert.equal(stored.find(t=>t.id==='parents_visit').status,'done');assert.equal(stored.find(t=>t.id==='budget_range').status,'done');
 assert.equal(stored.find(t=>t.id==='venue_contract').note,'계약 조건 확인');
 next.ctx.location.hash='#home';next.ctx.render();assert.match(next.elements['#app'].innerHTML,/2027. 04. 17/);assert.doesNotMatch(next.elements['#app'].innerHTML,/210일 남음/);
});
