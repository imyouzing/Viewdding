# Wedding venue survey

Reference: https://viewdding.com/survey/ and https://viewdding.com/survey/result/, inspected 2026-09-20. Public questionnaire version: `2026-08-24.2`.

The nine original steps and option values are retained in `dist/survey-schema.js`. The album UI lives under `#survey`, nested within the wedding hall navigation, with the hall-list tab under `#halls`.

Functions retained: shared conditions (regional bundles, schedule precision and flexibility, optional days/times, guest range/exact count, reference cost strategy/custom ceiling, transport/access), individual preferences (six photo moods with a two-choice maximum and exclusive unknown, ceremony/privacy, meal preference, ordered top three), previous/next/edit, single/couple reports, partner invitation and result links, tailored CSV checklist, inquiry template, and mapping answers into hall search.

Budget benchmarks reproduce the reference site's 2026-08-24 snapshot attributed there to Korea Consumer Agency; they are labeled as a reference snapshot, not newly fetched statistics or available quotes. The billable count respects each regional benchmark's minimum guarantee. Search deliberately transfers only the original reference's supported region/guest/mood/natural-light/ceremony conditions. For couples it uses common moods and agreed ceremony preference; dates and the total budget remain consultation criteria.

Drafts/results are local to the browser under `viewdding.album.survey.v1*`. Share links encode validated answers in the fragment, not the server query. They do not create a backend sync or grant access to this owner-private Site. UI copy explains that links include responses and recipients need Site access; partners can also answer on the same device. Returning a couple report requires sharing the resulting report link, as in the reference's encoded-link flow.

Source logic is separated from presentation in `survey-core.js`. Validation covers required groups, limits/exclusive choices, ranked order, dates, guest counts, budget input, and malformed shared payloads. Option repaint preserves window and nested regional scroll; step transitions focus the new question deliberately.
