# Wedding hall archive

Imported on 2026-09-19 from the user's [Viewdding national wedding hall master](https://docs.google.com/spreadsheets/d/1msR_rcR7sGB_i84_amSwVv0lr7xlTLzMYWU5_Lx2TTE/edit#gid=256495514). The source workbook was read only and was not modified. Search functionality references [Viewdding search](https://viewdding.com/search/); existing site typography, layout and neutral palette are retained.

## Published snapshot

- 1,196 distinct halls at 697 venues from 1,274 source hall rows.
- Excluded 1 nonpublic row and 77 rows requiring re-verification.
- 716 halls have a published meal-price entry; unknown numeric fields remain null.
- 872 halls have an eligible direct-hall representative photo in the `27_웹게시사진` tab.
- Sources: `01_업체`, `02_개별홀`, `03_아이웨딩견적`, `05_교통주차`, `17_최종검수요약`, and representative (`P0 대표`) rows of `27_웹게시사진`.
- The export whitelists user-facing fields. Internal notes, review instructions and the raw workbook export are not published.
- 169 hall rows were missing the classification-evidence column. The importer realigns only rows whose confidence, ISO date, source ID and publication flag collectively establish the displacement. It does not infer missing venue facts.
- This is a dated static snapshot, not a live Sheets connection. To refresh, read bounded ranges via the Google Sheets connector and run `scripts/import-halls.py` with the raw JSON path. Raw exports should remain outside this repository and `dist`.

## Photos

Only rows marked `홀 직접`, `공식 원본 URL`, representative `Y`, and `노출 가능` or `조건부 노출` with unexpired review dates are eligible. The most recently reviewed eligible representative is chosen per hall. Common-space, SNS-embed-only, review-pending, stopped and superseded representatives are not used as hall imagery.

Images use their original remote URLs, with source attribution and links in the detail view. They are not downloaded, cached by the application or recolored. At the user’s request, list thumbnails fill a consistent 4:3 frame using CSS `object-fit: cover`; the detail view shows the full original image with `object-fit: contain`. The source's conditional publishing classification is preserved as an operational selection criterion, not a claim of independently verified legal permission. Expired photos are hidden and failed images display a source-link fallback. Actual venue galleries remain available through their source links.

## Interaction

Text search combines name, hall, region, address and nearest station. Filters intersect. Guest filtering requires known sufficient maximum capacity and rejects known minimum guarantees above the guest count; unknown minimum guarantees are displayed as unknown. Price filtering uses published minimum meal price and excludes unknown prices. The interface describes these rules and shows quote source dates/conditions in details.

Users can compare up to three halls. Saves use explicitly labeled device-local browser storage, separate from the original sample curation saves. Comparison state is temporary. No booking request is sent and no real-time price or availability is claimed.

Validation: `node --test tests/halls.test.cjs` covers export integrity, shifted-row alignment, search/filter combinations, unknown values, numeric sort, details, saving/reload, comparison limits and data-load failure. The filter controls are collapsed under Region / Hall type / Detailed conditions. Selected conditions appear as removable chips; each panel can be dismissed via its close/result button, Escape or an outside pointer press.

## Compact browsing update

Load more appends cards to the existing grid and restores the exact scroll coordinates without scrolling the focused control into view. List cards combine known minimum/maximum guest counts and omit unknown capacity fields. Saving uses a photo-overlay heart; titles/photos open the details. Default order is alphabetical, with ascending meal price available. The user explicitly chose to show popularity sorting as pending until aggregate save counts are available; no popularity statistics are fabricated from local saves.

## Reference filter update

Region taxonomy is stored in `dist/hall-regions.js`, copied as structured data from the public Viewdding search bundle on 2026-09-19: 12 groups and 47 bundles, preserving labels and district memberships (including the reference's broad group labels). Province labels are mapped to the normalized snapshot names; city prefixes match ward-level rows such as 성남시 분당구. Multiple bundles use OR; nationwide, group-wide and child selections are mutually normalized as in the reference.

Detailed filter controls match the reference: guest count 1–2,000; separate/simultaneous/selectable ceremonies; 70/90/120/180-minute minimum intervals; natural light; buffet/course/Korean/catering meals. Multiple choices within ceremony or meal groups use OR; independent groups use AND. Known selectable ceremony data matches either ceremony mode. Raw meal labels are mapped without changing the source snapshot; unknown meals and intervals do not satisfy their filters. Panels edit a draft, apply explicitly, and discard unapplied changes on dismissal. Saved photo hearts retain their light background and use a red filled icon.

## Multiple hall types

Hall types now support multiple selections (OR within types, AND with other filter groups), individual chip removal and clear-all via the type panel's All/reset controls. The separate 'selectable' ceremony control was removed at the user's request. Halls whose source supports both ceremony formats still match either separate or simultaneous; selecting both formats includes either mode.
