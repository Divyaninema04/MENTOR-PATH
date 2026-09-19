# PlacementPilot — Connected Intelligence First Release

## Goal
Add a usable connected layer that turns existing company, opportunity, academic, career, and application data into one student-facing intelligence loop. Keep the current Cloud White design and avoid isolated dashboards or speculative data.

## User-facing result
- New **Intelligence** page in the authenticated workspace.
- Market signals show the most requested skills, interview topics, and roles from saved company data and live opportunity listings.
- Curriculum alignment compares those signals with the student’s tracked subjects, study progress, and mapped interview topics.
- Skill gaps become clear next actions that link into the existing Academics, Career, Opportunities, and Applications workflows.
- Industry validation reuses company eligibility, process, and source metadata.
- Employability feedback summarizes application outcomes and highlights which skills or preparation areas need attention.
- Empty states clearly explain when the student has not yet fetched companies/opportunities or mapped subjects; nothing is invented.

## Implementation
1. Add a browser-safe intelligence model that aggregates existing Supabase rows into demand, curriculum alignment, skill gaps, recommendations, and outcome feedback.
2. Add `/intelligence` under the authenticated route with tabs or sections for Market, Curriculum, Industry, and Employability.
3. Reuse the existing `WidgetCard`, `StatCard`, `ProgressRing`, badges, buttons, source links, and route links so every insight leads to an existing action.
4. Add the Intelligence item to the sidebar without changing the existing student pages’ navigation.
5. Add route metadata for the new page and keep public route metadata compliant.
6. Validate the preview, build output, and responsive layout; fix any errors introduced by the change.

## Technical notes
- No new tables or seed/demo rows in this first release; calculations use current `companies`, `opportunities`, `profiles`, `subjects`, `roadmap_progress`, and `applications` data.
- Demand is counted only from stored company/opportunity fields; missing fields remain unavailable.
- Skill gaps are explicit: demand present + no matching profile skill or mapped subject topic. Recommendations point to existing pages rather than pretending to provide courses.
- Do not modify generated Supabase client/type files.
