# VIEWDDING public feature migration

Snapshot taken from the public viewdding.com pages on 2026-09-20. The album design and its existing hall spreadsheet snapshot are retained.

## Navigation and coverage

- Preparation: overview and a category-only budget preview with 13 source-derived categories, grouped navigation and expandable detail rows; spreadsheet-informed ten-stage/77-task roadmap and shared personal task list with todo/doing/done/skipped, stage/category filters, custom tasks, date/owner/note editing, wedding-relative suggested dates, linked tools and browser persistence; original stage/category essentials, checklist mode, completion progress, product details and merchant links.
- Wedding halls: existing 1,196 Sheet-backed halls, original grouped regions, multiple types and detailed filters, alphabetical/meal-price sorting, three-hall comparison, saved hearts and accessible details. Added survey-criteria application, list/map mode, four original theme collections and regional shortcuts. Maps join 773 hall records to original venue coordinates; unknown positions are not invented.
- Excel: UTF-8 BOM CSV, matching the original site's Excel export format. Only saved halls or the temporary comparison selection can be exported, independent of pagination. Bulk search/theme export was removed at the user’s request. 23 useful columns, safe quoting, formula protection, no zero substitution for unknown prices/capacity. A dedicated preview defaults to saved halls and distinguishes persistent hearts from temporary comparison selections.
- Gathering places: all 795 public records supplied to the live page, separated into invitation/family meeting; original pure matching logic for cuisines, weekdays, room party size, per-person budget, course, room, parking; shared geographic bundles; confirmed/unknown result lists, map, details, sources, outbound map/booking links, saved records.
- Style: all 135 public color-diagnosis records, original active/status, service combination and budget rules; list/map, grouped regions, details, sources, booking links and favorites. Original 7 snap items and 5 locations, with clothing/props, indoor and outdoor subtabs, category/region filters and details.
- Unified saved area separates halls, gatherings, color, essentials, snap and existing inspiration. Non-hall categories can be cleared after in-page confirmation. All new saved/completion state uses localStorage with a storage failure message.
- Information methodology page and exact-source links inside details.

## Data and behavior boundaries

No original account data, cross-domain browser storage, admin tools, analytics, private APIs or credentials were copied. Public data is a snapshot, not a live backend sync. Original product affiliate links are preserved and identified in details. Original Unsplash references are explicitly labeled as inspiration rather than actual product/location photography. Planner records are browser-persistent; the budget explicitly remains a category preview without amount entry or settlement. Original hidden/unpublished dress-tour functionality is outside the public menu snapshot.

Restaurant/color matching functions are retained under src/imported and bundled into dist/catalog-model.js using esbuild. Runtime output is plain static JS; no backend is needed. Leaflet 1.9.4 uses OpenStreetMap tiles and explicit attribution; the original site's Kakao domain-restricted key is not copied. Thin Phosphor icons are pre-rendered to static SVG, with filled red heart states. Licenses reside in dist/vendor.

## Validation

Run `node --test tests/*.test.cjs`. Covers data integrity, numerical unknowns, geographic bundles, multiselect, dialog/app flow, scroll preservation, survey validation/sharing, all added service routes, exported CSV coverage/escaping and catalog matching. Browser QA checks real filters, dialogs, maps, red hearts, export action, persistence and responsive layout.


### Budget workspace (September 2026)
- Preserves the 13 reference categories and item-only source handling; imports no personal financial values.
- Budget management and optional additional-fee checklist tabs with group filters and custom items.
- Per-item estimate, contract total, vendor, reservation/deposit, interim payment, automatically calculated balance, scheduled dates, paid flags, and notes.
- Full-budget totals use contract value when known and otherwise estimates; instalments never get added to the contract a second time. Package-included and unused items are excluded.
- Input validation rejects negative/fractional/unsafe values and instalment sums greater than the contract. Paid totals count only checked instalments.
- Prototype input records are browser-local temporary drafts (viewdding.album.budget.draft.v1), explicitly disclosed in the UI; no account sync or server financial records. The previous version stored no budget input to migrate.
- Category and item expansion, focus, and window position survive edits.
