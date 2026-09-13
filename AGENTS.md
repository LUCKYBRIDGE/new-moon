# New Moon Agent Rules

## Product Identity
`new-moon` is the canonical source for a classroom-first digital adaptation of the classic Moon Survival decision-making activity.

The product is not primarily a score game. Its core learning loop is:

1. make an individual judgment,
2. discuss and reach a team consensus,
3. record one meaningful change of mind before seeing expert guidance,
4. compare the team's reasoning with NASA expert reasoning,
5. reflect on evidence, disagreement, and revision of judgment.

## Product Principles
- Preserve the recognizable Moon Survival activity structure before adding game mechanics.
- Treat expert rankings as comparison material, not as an answer key that students should chase.
- Do not foreground aggregate rank-difference scores in the student experience.
- Never require a written reason for all 15 items by default.
- Before expert rankings are revealed, ask the learner to select and explain one meaningful item whose ranking changed between individual and team decisions.
- If rankings barely changed, allow the learner to explain one judgment they intentionally maintained after discussion.
- Preserve the pre-expert reflection once submitted so later expert information cannot rewrite the learner's earlier thinking.
- Prefer evidence and reasoning language: `전문가 비교`, `전문가 판단`, `전문가 설명`. Avoid presenting the expert list as an infallible `정답`.
- Roles / specialist knowledge are optional enrichment. They must not reveal expert rankings before the learner has formed an independent judgment.
- Keep the core app static and classroom-friendly. Do not add backend, auth, analytics, tracking, or AI grading without explicit approval.
- Accessibility is a requirement: keyboard-operable controls, visible focus, semantic controls, no disabled browser zoom.

## Source Integrity
- Keep canonical item data, expert rankings, expert explanations, and citations separate from UI components.
- Document which Moon Survival variant each scenario or ranking is based on.
- Do not silently change the canonical 15-item ranking.

## Development
- Use TypeScript and React with Vite.
- `npm run build` must produce a static `dist/` suitable for Cloudflare Pages, GitHub Pages, or later bundling into `pinky-ne-site`.
- Student-facing core flow must work without runtime CDN dependencies.
- Keep persistence local-first and versioned.

## Verification
Before merging substantial UX changes, verify at minimum:
- individual ranking can be completed without writing 15 reasons,
- team ranking can differ from individual ranking,
- reflection occurs before expert reveal,
- expert reveal is inaccessible until reflection is saved,
- saved reflection remains unchanged during expert review,
- all 15 items remain unique in each completed ranking,
- keyboard-only ranking controls work,
- mobile layout remains usable at 360px width.
