/* Pure, shared venue queries. Unknown values never satisfy numeric filters. */
(function(root){
 const regions=root.HallRegions||(typeof require==='function'?require('./hall-regions.js'):null);
 const bundles=regions.groups.flatMap(g=>g.bundles);
 const norm=s=>String(s||'').normalize('NFKC').toLocaleLowerCase('ko').replace(/\s+/g,'');
 const initial=()=>({query:'',region:'',district:'',type:[],guests:'',meal:'',parking:false,natural:false,private:false,saved:false,sort:'name',regionBundles:[],ceremonies:[],interval:'',meals:[]});
 function toggleBundle(ids,id){
  if(id==='all_nation')return ids.includes(id)?[]:['all_nation'];
  const group=regions.groups.find(g=>g.bundles.some(b=>b.id===id)),bundle=bundles.find(b=>b.id===id);
  if(!group||!bundle)return ids;
  let next=ids.filter(x=>x!=='all_nation');
  if(!bundle.sigungus.length)return next.includes(id)?next.filter(x=>x!==id):[...next.filter(x=>!group.bundles.some(b=>b.id===x)),id];
  next=next.filter(x=>!group.bundles.some(b=>b.id===x&&!b.sigungus.length));
  return next.includes(id)?next.filter(x=>x!==id):[...next,id];
 }
 function matchesBundle(h,id){
  if(id==='all_nation')return true;
  const b=bundles.find(b=>b.id===id);if(!b)return false;
  return b.sidos.some(s=>(regions.sidoLabels[s]||s)===h.region)&&(!b.sigungus.length||b.sigungus.some(d=>h.district===d||h.district.startsWith(d+' ')));
 }
 function ceremonyTypes(h){if(/선택|혼합/.test(h.ceremony)||h.ceremony.includes('분리')&&h.ceremony.includes('동시'))return ['separate','simultaneous'];return h.ceremony.includes('분리')?['separate']:h.ceremony.includes('동시')?['simultaneous']:[]}
 function mealTypes(h){const m=h.meal||'';return [['buffet',/뷔페/],['course',/코스|course|양식/i],['korean',/한식|한정식|한상차림/],['catering',/케이터링/]].filter(([,pattern])=>pattern.test(m)).map(([id])=>id)}
 function filter(halls,f,saved=new Set()){
  const words=String(f.query||'').trim().split(/\s+/).filter(Boolean).map(norm);
  const list=halls.filter(h=>{
   if(f.saved&&!saved.has(h.id))return false;
   const chosenTypes=Array.isArray(f.type)?f.type:f.type?[f.type]:[];
   if(chosenTypes.length&&!chosenTypes.some(type=>h.types.includes(type)))return false;
   if(f.regionBundles?.length&&!f.regionBundles.some(id=>matchesBundle(h,id)))return false;
   if(f.ceremonies?.length&&!f.ceremonies.some(v=>ceremonyTypes(h).includes(v)))return false;
   if(f.interval&&(h.interval===null||h.interval<Number(f.interval)))return false;
   if(f.meals?.length&&!f.meals.some(v=>mealTypes(h).includes(v)))return false;
   if(f.region&&h.region!==f.region||f.district&&h.district!==f.district)return false;
   if(words.length&&!words.every(w=>norm([h.name,h.hall,h.region,h.district,h.address,h.station].join(' ')).includes(w)))return false;
   const guests=Number(f.guests);
   if(guests>0&&(h.capacity===null||h.capacity<guests||h.minimum!==null&&h.minimum>guests))return false;
   if(f.meal&&(h.mealPrice===null||h.mealPrice>Number(f.meal)))return false;
   if(f.parking&&!(h.parking>0)||f.natural&&!h.naturalLight||f.private&&!h.private)return false;
   return true;
  });
  return list.sort((a,b)=>{
   if(f.sort==='meal'){const diff=(a.mealPrice??Infinity)-(b.mealPrice??Infinity);if(diff)return diff;}
   return (a.name+' '+a.hall).localeCompare(b.name+' '+b.hall,'ko');
  });
 }
 root.HallModel={initial,filter,norm,toggleBundle,matchesBundle,bundles};
 if(typeof module!=='undefined')module.exports=root.HallModel;
})(typeof window!=='undefined'?window:globalThis);
