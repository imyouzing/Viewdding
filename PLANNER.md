# Wedding planner

Updated 2026-09-20 from the two user-supplied workbooks.

- 샤이봉봉 결혼준비 체크리스트.xlsx, 결혼준비체크리스트!A3:D66: recommended timing and preparation actions.
- 사본_ 결혼 준비 스케줄러(예산, 체크리스트 등).xlsx, 일정표!B9:H83 and 체크리스트!B3:G73: preparation categories, scheduling, consultation/booking/contract progress and post-wedding follow-up.

The 77 concise actions combine all 45 prior roadmap records with 32 supplemental actions. Repeated bouquet, MC and similar entries were consolidated. Original task IDs and existing local progress are retained. Promotional text, example dates, checked cells, prices and named suppliers are not imported. Workbooks are read-only references and are not published with the site.

Roadmap and personal tasks use one record store (`viewdding.album.roadmap.v1`). New fields extend the existing shape: weddingDate, custom, and per-item title, stage, category, owner, due and note. Old completion state is preserved. Survey completion remains a suggested completion unless the person explicitly overrides it.

The ten stages are an adapted reference schedule. Suggested dates use calendar-month offsets with end-of-month clamping; a directly entered date overrides the suggestion and survives wedding-date changes. No example wedding date is assumed. Home progress and upcoming tasks read the same records. Data remains local to the browser; there is no account or cross-device synchronization.

Validation covers source ID preservation, filtering, progress denominators, invalid dates, leap-year/month-end calculation, explicit date precedence, local persistence, shared views, custom tasks and document scroll preservation.
