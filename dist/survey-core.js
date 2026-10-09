/* Viewdding's nine-question standard survey, adapted to the album UI. */
(function(root){
 const schema=root.SurveySchema||(typeof require==='function'?require('./survey-schema.js'):null);
 const H=root.HallModel||(typeof require==='function'?require('./halls-core.js'):null);
 const steps=schema.parts.flatMap(part=>part.questions.map(question=>({part,question})));
 const questions=steps.flatMap(({question:q})=>q.groupQuestions||[q]);
 const byId=id=>questions.find(q=>q.id===id);
 const first=(a,k)=>a[k]?.[0]||'';
 const label=(id,v)=>byId(id)?.options?.find(o=>o.value===v)?.label||v;
 const money=n=>(n/10000).toLocaleString('ko-KR',{maximumFractionDigits:1})+'만 원';
 function toggle(q,current,value){
  const option=q.options.find(o=>o.value===value);if(!option)return current;
  if(!['multi','photo-card','pick-n'].includes(q.type))return [value];
  if(current.includes(value))return current.filter(v=>v!==value);
  if(option.exclusive)return [value];
  const next=current.filter(v=>!q.options.find(o=>o.value===v)?.exclusive);
  return next.length<(q.max||q.exactCount||Infinity)?[...next,value]:current;
 }
 const finite=(v,min,max=Infinity)=>v!==''&&Number.isFinite(Number(v))&&Number(v)>=min&&Number(v)<=max;
 function valid(q,a){
  if(q.type==='region-picker')return !!a.A1?.length&&a.A1.every(v=>H.bundles.some(b=>b.id===v));
  if(q.type==='schedule'){
   const p=first(a,'A2-precision');if(!q.precisionOptions.some(o=>o.value===p))return false;
   if(p==='open')return true;
   if(!q.flexibilityOptionsByPrecision[p]?.some(o=>o.value===first(a,'A2-flexibility')))return false;
   if(p==='exact_date'){const date=first(a,'A2-date');return /^\d{4}-\d{2}-\d{2}$/.test(date)&&!Number.isNaN(Date.parse(date))&&new Date(date).toISOString().slice(0,10)===date}
   if(p==='year_month')return /^\d{4}-(0[1-9]|1[0-2])$/.test(first(a,'A2-month'));
   return q.seasonOptions.some(o=>o.value===first(a,'A2-season'));
  }
  if(q.type==='budget-builder')return q.strategyOptions.some(o=>o.value===first(a,'A4'))&&(first(a,'A4')!=='custom'||finite(first(a,'A4-max'),1000000,100000000000));
  if(q.type==='group')return q.groupQuestions.every(sub=>valid(sub,a));
  const values=a[q.id]||[];
  if(!values.length||new Set(values).size!==values.length||!values.every(v=>q.options.some(o=>o.value===v)))return false;
  if(values.some(v=>q.options.find(o=>o.value===v).exclusive)&&values.length>1)return false;
  if(q.type==='pick-n')return values.length===q.exactCount;
  if(q.type==='photo-card')return values.length<=q.max;
  if(q.type==='multi')return true;
  if(values.length!==1)return false;
  return q.type!=='guest-estimate'||!first(a,'A3-exact')||first(a,'A3')==='unknown'||finite(first(a,'A3-exact'),1,2000)&&Number.isInteger(Number(first(a,'A3-exact')));
 }
 const benchmarks={national:['전국',59000,200,3500000],seoul:['서울',80000,200,6000000],gyeongin:['경기·인천',63000,200,3000000],metro:['5대 광역시',54000,180,2500000],other:['기타 지역',50000,200,2900000]};
 function budget(a){
  const ids=a.A1||[],sidos=[...new Set(ids.flatMap(id=>H.bundles.find(b=>b.id===id)?.sidos||[]))];
  const metro=['부산광역시','대구광역시','대전광역시','광주광역시','울산광역시'],gyeongin=['경기도','인천광역시'];
  const key=!sidos.length||ids.includes('all_nation')?'national':sidos.every(s=>s==='서울특별시')?'seoul':sidos.every(s=>gyeongin.includes(s))?'gyeongin':sidos.every(s=>metro.includes(s))?'metro':sidos.some(s=>s==='서울특별시'||gyeongin.includes(s)||metro.includes(s))?'national':'other';
  const [name,meal,minimum,rental]=benchmarks[key];
  const exact=Number(first(a,'A3-exact'));
  const guests=first(a,'A3')==='unknown'?null:exact>0?exact:({under_80:60,'80_120':100,'121_180':150,'181_250':220,'251_350':300,over_350:400}[first(a,'A3')]??null);
  const billable=Math.max(guests??minimum,minimum),subtotal=meal*billable,total=subtotal+rental,strategy=first(a,'A4');
  const maximum=strategy==='reference_limit'?total:strategy==='plus_5m'?total+5000000:strategy==='custom'?Number(first(a,'A4-max'))||null:null;
  return {key,name,meal,minimum,rental,guests,billable,subtotal,total,strategy,maximum,checkedAt:'2026-08-24',source:'https://price.go.kr/tprice/portal/wedding/areaStatistic.do'};
 }
 function budgetLabel(b){return ({reference_limit:'참고 금액 '+money(b.total)+' 이내',plus_5m:'참고 금액보다 500만 원까지 여유',conditions_first:'비용보다 필수 조건 우선',custom:'최대 '+money(b.maximum||0),unknown:'아직 정하지 않음'})[b.strategy]||'아직 정하지 않음'}
 function schedule(a){return first(a,'A2-precision')==='exact_date'?first(a,'A2-date'):first(a,'A2-precision')==='year_month'?first(a,'A2-month'):first(a,'A2-precision')==='season'?({spring:'봄',summer:'여름',autumn:'가을',winter:'겨울'})[first(a,'A2-season')]+' 예식':'좋은 홀에 맞춰 조율'}
 function summary(a){const q=steps[1].question;return [['지역',(a.A1||[]).map(id=>H.bundles.find(b=>b.id===id)?.label).filter(Boolean).join(', ')],['희망 시기',schedule(a)],['요일 · 시간',[...(a['A2-weekdays']||[]).map(v=>q.weekdayOptions.find(o=>o.value===v)?.label),...(a['A2-times']||[]).map(v=>q.timeOptions.find(o=>o.value===v)?.label)].filter(Boolean).join(' · ')||'조율 가능'],['예상 하객',first(a,'A3-exact')&&first(a,'A3')!=='unknown'?first(a,'A3-exact')+'명':label('A3',first(a,'A3'))],['예산 기준',budgetLabel(budget(a))],['주 이동수단',label('A5-mode',first(a,'A5-mode'))]]}
 const commentary={venue_total_budget:'식대·대관료·필수 옵션을 합친 최종 견적을 비교해요.',region_access:'양가 하객의 출발지와 이동 시간을 함께 살펴봐요.',schedule:'원하는 날짜·요일·시간을 지킬 수 있는지 확인해요.',hall_mood:'두 사람이 기억하고 싶은 공간의 분위기를 확인해요.',meal:'하객에게 대접할 식사의 품질과 가격을 함께 살펴봐요.',privacy_pace:'다른 예식과의 동선과 촬영할 여유 시간을 확인해요.',parking:'주차 가능 대수와 무료 이용 시간을 확인해요.',guest_facilities:'어르신 이동과 로비·엘리베이터 등 편의시설을 살펴봐요.'};
 const prompts={venue_total_budget:'두 사람이 감당할 수 있는 식장 총비용의 상한은 얼마인가요?',region_access:'양가 하객의 출발지와 이동수단을 고려하면 어느 지역이 좋을까요?',schedule:'원하는 날짜를 지키는 것과 일정을 바꿔 비용을 줄이는 것 중 무엇이 더 중요한가요?',hall_mood:'마음에 드는 분위기를 위해 다른 조건을 얼마나 조정할 수 있나요?',meal:'식사 품질과 합리적인 식대 중 어느 쪽을 더 우선할까요?',privacy_pace:'단독 사용과 여유로운 예식 간격을 위해 예산이나 선택 폭을 조정할 수 있나요?',parking:'자차 하객의 비율과 필요한 무료 주차 시간은 어느 정도인가요?',guest_facilities:'어르신의 이동과 로비 혼잡을 얼마나 중요하게 볼까요?'};
 function comparison(pair){
  const a=pair.primary.answers,b=pair.partner?.answers;if(!b)return null;
  const pa=a.B4||[],pb=b.B4||[],ma=(a.B1||[]).filter(v=>v!=='unknown'),mb=(b.B1||[]).filter(v=>v!=='unknown');
  const talking=byId('B4').options.filter(o=>{const i=pa.indexOf(o.value),j=pb.indexOf(o.value);return i!==j&&(i<0||j<0||Math.abs(i-j)>=2)}).map(o=>({title:o.label,question:prompts[o.value],self:pa.includes(o.value)?(pa.indexOf(o.value)+1)+'순위':'TOP 3 밖',partner:pb.includes(o.value)?(pb.indexOf(o.value)+1)+'순위':'TOP 3 밖'}));
  const fa=first(a,'B2-format'),fb=first(b,'B2-format');
  if(fa!==fb&&['separate','simultaneous'].includes(fa)&&['separate','simultaneous'].includes(fb))talking.push({title:'예식과 식사 방식',question:'예식에 집중하는 분리예식과 식사를 함께하는 동시예식 중 어떤 경험을 원하나요?',self:label('B2-format',fa),partner:label('B2-format',fb)});
  return {priorities:pa.filter(v=>pb.includes(v)),moods:ma.filter(v=>mb.includes(v)),selfMoods:ma.filter(v=>!mb.includes(v)),partnerMoods:mb.filter(v=>!ma.includes(v)),talking};
 }
 function filters(pair){
  const a=pair.primary.answers,c=comparison(pair),f=H.initial(),b=pair.partner?.answers;
  f.regionBundles=[...(a.A1||[])];
  const guests=Number(first(a,'A3-exact'))||({under_80:80,'80_120':120,'121_180':180,'181_250':250,'251_350':350,over_350:400}[first(a,'A3')]);
  f.guests=first(a,'A3')==='unknown'?'':guests?String(guests):'';
  const moods=c?c.moods:a.B1||[],map={bright_natural:'밝은 홀',dark_dramatic:'어두운 홀',classic_chapel:'채플',garden_outdoor:'야외 웨딩',private_house:'하우스 웨딩',formal_hotel:'호텔 웨딩'};
  f.type=moods.map(v=>map[v]).filter(Boolean);f.natural=moods.includes('bright_natural');
  const format=first(a,'B2-format');f.ceremonies=['separate','simultaneous'].includes(format)&&(!b||format===first(b,'B2-format'))?[format]:[];
  return f;
 }
 const common=[['계약 조건','대관료와 필수 옵션 포함 내역','장식·음향·원판 등 별도 비용을 견적서에 확인'],['계약 조건','계약금·취소·위약금 조건','환불 가능 시점과 계약서 조항 확인'],['본식 연출','음향·조명·영상 시연','축가와 식전 영상의 소리·화면 확인']];
 const checks={venue_total_budget:[['식대·예산','식대 정가·할인과 최종 총액','음료·주류·부가세·봉사료 포함 여부']],region_access:[['교통·위치','역에서의 실제 도보 동선과 셔틀','셔틀 운행 간격과 안내 표지 확인']],schedule:[['일정','희망 날짜·시간 잔여 타임','시간대·요일별 견적 차이 확인']],hall_mood:[['홀 분위기','버진로드·단상·생화 장식','계절별 연출 변경과 추가 비용 확인']],meal:[['식사·연회','메뉴 구성과 무료 시식','양가 부모님 동반 시식 일정 확인']],privacy_pace:[['홀 환경','단독홀·로비·접수대 사용','다른 팀과 하객 동선이 겹치는지 확인'],['예식 진행','예식 간격과 촬영 시간','본식 후 가족·친구 촬영 시간 확인']],parking:[['주차','주차 대수와 무료 이용 시간','만차 시 외부 주차장과 혼주 전용 구역 확인']],guest_facilities:[['동선·편의','엘리베이터·로비 대기 공간','어르신·휠체어 이동 동선 확인']]};
 function checklist(pair){const a=pair.primary.answers,b=pair.partner?.answers;const chosen=x=>new Set([...(x?.B4||[]),...((x?.['A5-extra']||[]).includes('parking_ease')?['parking']:[])]);const ca=chosen(a),cb=chosen(b),rows=common.map(r=>[...r,'공통']);for(const key of new Set([...ca,...cb]))for(const row of checks[key]||[]){let r=[...row];if(key==='meal'&&first(ca.has(key)?a:b,'B3')!=='quality')r=[...checks.venue_total_budget[0]];rows.push([...r,b?(ca.has(key)&&cb.has(key)?'두 사람':ca.has(key)?'나':'파트너'):'나'])}return rows.filter((r,i,all)=>all.findIndex(x=>x[1]===r[1])===i)}
 function csv(pair){return '\uFEFF'+[['구분','확인 항목','체크 포인트','선택'],...checklist(pair)].map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n')}
 function template(pair){const a=pair.primary.answers;return '안녕하세요. [웨딩홀 이름] 예식 견적 및 방문 상담 문의드립니다.\n\n'+summary(a).map(([k,v])=>k+': '+v).join('\n')+'\n추가 접근 조건: '+(a['A5-extra']||[]).map(v=>label('A5-extra',v)).join(', ')+'\n\n희망 시기의 예약 가능 시간과 최소보증인원, 식대·대관료·필수 옵션을 포함한 총견적을 안내 부탁드립니다.\n음료·주류·부가세·봉사료 포함 여부와 방문 상담 가능한 일정도 함께 알려주세요. 감사합니다.'}
 function cleanAnswers(input){if(!input||typeof input!=='object'||Array.isArray(input))return null;const out={};for(const [k,v] of Object.entries(input)){if(!/^[AB][1-5](?:-[a-z]+)?$/.test(k)||!Array.isArray(v)||v.length>50||v.some(x=>typeof x!=='string'||x.length>100))return null;out[k]=v}return out}
 function cleanPair(input){if(!input||input.version!==schema.version)return null;const a=cleanAnswers(input.primary?.answers);if(!a||!steps.every(s=>valid(s.question,a)))return null;const primary={answers:a,completedAt:typeof input.primary.completedAt==='string'?input.primary.completedAt.slice(0,40):''};let partner; if(input.partner){const b=cleanAnswers(input.partner.answers);if(!b||!steps.filter(s=>s.part.mode==='individual').every(s=>valid(s.question,b)))return null;partner={answers:Object.fromEntries(Object.entries(b).filter(([k])=>k.startsWith('B'))),completedAt:typeof input.partner.completedAt==='string'?input.partner.completedAt.slice(0,40):''}}return {version:schema.version,primary,...(partner?{partner}:{})}}
 function encode(pair){return btoa(unescape(encodeURIComponent(JSON.stringify(pair)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
 function decode(code){try{if(typeof code!=='string'||code.length>20000||!/^[\w-]+$/.test(code))return null;return cleanPair(JSON.parse(decodeURIComponent(escape(atob(code.replace(/-/g,'+').replace(/_/g,'/'))))))}catch{return null}}
 const api={schema,steps,questions,byId,first,label,money,toggle,valid,budget,budgetLabel,schedule,summary,commentary,comparison,filters,checklist,csv,template,cleanAnswers,cleanPair,encode,decode};
 root.SurveyModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
