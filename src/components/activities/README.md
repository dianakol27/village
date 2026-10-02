# Activities UI

`activity-browser.tsx` contains the mobile-first experience switcher, GET filter form, discovery card, and activity detail/session presentation. The App Router pages load typed view data through `src/lib/activities/queries.ts`; keep database and filter logic out of these presentation components.
