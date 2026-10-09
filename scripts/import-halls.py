"""Normalize a read-only Sheets export. Raw source stays outside the public site."""
import json, re, sys
from collections import Counter
from pathlib import Path
raw=json.loads(Path(sys.argv[1]).read_text())
as_of='2026-09-19'
def txt(v): return str(v).strip() if v is not None else ''
def num(v):
    s=txt(v).replace(',','')
    return float(s) if re.fullmatch(r'\d+(\.\d+)?',s) else None
def url(v): return txt(v) if re.match(r'^https?://[^\s]+$',txt(v)) else ''
def region(s):
    for a,b in [('서울','서울'),('경기','경기'),('인천','인천'),('부산','부산'),('대구','대구'),('대전','대전'),('광주','광주'),('울산','울산'),('세종','세종'),('강원','강원'),('충청북','충북'),('충청남','충남'),('전라북','전북'),('전북','전북'),('전라남','전남'),('경상북','경북'),('경상남','경남'),('제주','제주')]:
        if s.startswith(a): return b
    return s
venues={r[0]:r for r in raw['venues'][1:] if r and r[0]}
quality={r[0]:r for r in raw['quality'][1:] if r and r[0]}
quotes={r[2]:r for r in raw['quotes'][1:] if len(r)>2 and r[2]}
transport={r[1]:r for r in raw['transport'][1:] if len(r)>1 and r[1]}
photos={}
for p in raw['photos']:
    if p[7]!='홀 직접' or p[10]!='공식 원본 URL' or p[26]!='Y' or p[28] not in ['노출 가능','조건부 노출'] or not url(p[11]) or (p[30] and p[30]<as_of): continue
    if p[1] not in photos or p[29]>photos[p[1]][29]: photos[p[1]]=p
out=[]; shifted=0; excluded=Counter()
for original in raw['halls'][1:]:
    r=list(original)
    # 169 imported rows lack the classification-evidence cell. Restore alignment
    # only when confidence/date/source/publish positions jointly prove the shift.
    if len(r)>26 and r[23] in ['A','B-강','B-추정','C','C-보조'] and re.fullmatch(r'\d{4}-\d{2}-\d{2}',txt(r[24])) and txt(r[25]).startswith('S-') and r[26] in ['공개','비공개']:
        r.insert(23,None);shifted+=1
    r += [None]*(43-len(r))
    ql=quality.get(r[0],[])
    if r[27]!='공개': excluded['not_public']+=1;continue
    if len(ql)<14 or ql[13] not in ['확정','추정공개']: excluded['recheck']+=1;continue
    v=venues.get(r[1],[None]*23); v=v+[None]*(23-len(v))
    q=quotes.get(r[0],[None]*22);q=q+[None]*(22-len(q))
    t=transport.get(r[1],[None]*18);t=t+[None]*(18-len(t))
    types=[]
    if r[7]=='밝음': types.append('밝은 홀')
    if r[7]=='어두움' or '어두운' in txt(r[6]): types.append('어두운 홀')
    if '야외' in txt(r[11]) or '야외' in txt(r[6]): types.append('야외 웨딩')
    if r[9]=='Y' or '채플' in txt(r[6]): types.append('채플')
    if r[10]=='Y' or '하우스' in txt(r[6]): types.append('하우스 웨딩')
    if '호텔' in txt(v[6]) or '호텔' in txt(r[6]):types.append('호텔 웨딩')
    if '전통' in txt(r[6]) or '한옥' in txt(r[6]):types.append('전통 · 한옥')
    p=photos.get(r[0])
    out.append(dict(id=r[0],venueId=r[1],name=txt(r[4]),hall=txt(r[5]),region=region(txt(r[2])),district=txt(r[3]),types=types,type=txt(r[6]),light=txt(r[7]),naturalLight=r[8]=='Y',private=r[12]=='Y',indoor=txt(r[11]),ceremony=txt(r[13]),seats=num(r[14]),capacity=num(r[15]),minimum=num(r[16]),interval=num(r[17]),meal=txt(r[19]),address=txt(v[9]),phone=txt(v[14]),website=url(v[15]),map=url(v[18]),operation=txt(v[7]),confidence=txt(r[24]),review=ql[13],verified=txt(r[36] or r[25]),source=url(r[35]),station=txt(t[8]),line=txt(t[9]),walk=num(t[11]),parking=num(t[13]),freeParking=txt(t[14]),mealPrice=num(q[9]),mealPriceMax=num(q[10]),rental=num(q[11]),rentalMax=num(q[12]),quoteDate=txt(q[20]),quoteSource=url(q[21]),quoteConditions=txt(q[18]),quoteOptions=txt(q[17]),photo=({'url':url(p[11]),'source':url(p[15]),'credit':p[18],'label':p[9],'date':p[29],'expires':p[30],'crop':p[22]=='Y'} if p else None)))
assert len({h['id'] for h in out})==len(out), 'duplicate hall id'
data={'asOf':as_of,'source':'https://docs.google.com/spreadsheets/d/1msR_rcR7sGB_i84_amSwVv0lr7xlTLzMYWU5_Lx2TTE/edit#gid=256495514','totalSourceRows':len(raw['halls'])-1,'halls':out}
Path('dist/halls.json').write_text(json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n')
print(json.dumps({'halls':len(out),'venues':len(set(x['venueId'] for x in out)),'photos':sum(bool(x['photo']) for x in out),'quotes':sum(x['mealPrice'] is not None for x in out),'aligned':shifted,'excluded':dict(excluded)},ensure_ascii=False))
