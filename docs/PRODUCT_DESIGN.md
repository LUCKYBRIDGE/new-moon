# New Moon Product Design

## 1. Product Goal

`new-moon` preserves the recognizable structure of the classic Moon Survival activity while using the web to make the learner's decision process visible.

The core outcome is not a low rank-difference score. The core outcome is that a learner can explain one meaningful example of:

- why they originally made a judgment,
- what evidence or peer reasoning changed that judgment,
- or why they intentionally maintained a judgment after discussion.

## 2. Canonical Learning Flow

1. **Crash / scenario**
   - Learner understands the survival problem and the 15 remaining items.
   - No expert ranking is visible.

2. **Individual ranking**
   - Learner ranks all 15 items.
   - No requirement to write 15 separate reasons.
   - No aggregate score is shown.

3. **Optional specialist-role extension**
   - Used only after the independent judgment is complete.
   - Scientist / Explorer / Communicator / Medic information can support group discussion.
   - It never reveals expert ranks.

4. **Group discussion and consensus**
   - Learners compare reasoning and produce one group ranking.
   - The goal is consensus, not automatic averaging.

5. **Pre-expert reflection**
   - System compares individual and group rankings.
   - It proposes up to three large-change candidates.
   - Learner chooses one meaningful item and explains how/why their thinking changed.
   - If there was little rank movement, the learner instead explains one judgment they intentionally maintained.
   - This record is saved before any expert ranking is revealed.

6. **Expert debrief**
   - Expert items are revealed one by one with reasoning.
   - Individual rank, group rank and expert comparison rank are shown together.
   - When the learner's reflection item appears, the original pre-expert reflection is shown unchanged.

7. **Summary**
   - Emphasizes similarities, differences, and the learner's decision trace.
   - Classic aggregate rank-difference totals are available only in a collapsed secondary section.

## 3. Why Reasons Are Not Collected for All 15 Items

The original paper worksheet format often asks for reasons beside every item. In a classroom web experience for younger learners, doing this for all 15 can shift the activity from discussion and judgment into repetitive writing.

New Moon therefore treats writing as a high-value reflection task rather than a repeated data-entry task:

- ranking all 15 items is still required,
- discussion remains central,
- one meaningful decision change is explained deeply,
- optional future teacher settings may ask for more evidence on selected items if needed.

## 4. Scoring Policy

The traditional absolute rank-difference total is retained only as a reference metric.

Student-facing hierarchy:

1. reasoning,
2. change or maintenance of judgment,
3. comparison with expert reasoning,
4. aggregate rank-difference metric.

Do not label the expert ranking as an infallible `정답` in the UI. Prefer:

- `전문가 비교 순위`
- `전문가 판단`
- `전문가 설명`

## 5. Source / Variant Policy

Moon Survival exists in several related versions. They should not be silently mixed.

### Classic Hall & Watson Survival Task

A NASA Technical Reports Server document reproduces the Hall & Watson (1970) Survival Task with:

- a landing about 200 miles from the rendezvous point,
- 15 intact items,
- 50 feet of nylon rope,
- 5 gallons of water,
- two 100-pound oxygen tanks.

This is the scenario lineage used for New Moon's classic presentation.

### NASA/GSFC StarChild variant

The NASA/GSFC StarChild `Problems in Space` activity uses a Moon base about 120 km away and slightly different quantities such as 18 m of rope and 15 L of water. Its published expert-solution page contains the familiar 1–15 expert ordering and explanations.

New Moon currently uses the classic 200-mile scenario / classic quantities and uses the NASA/GSFC expert ordering and explanations as the main expert-comparison reference. The UI and documentation must keep this provenance explicit.

### Later NASA education variants

NASA education materials also contain later variants with updated items and/or multiple expert perspectives. These are useful for later debrief extensions, but must not silently replace the canonical classic activity data.

## 6. Specialist Roles

The role system inherited from the earlier Pinky version is valuable but is not part of the classic task.

Therefore:

- it is optional,
- it occurs after individual ranking,
- it is framed as distributed information for discussion,
- it cannot expose expert ranks,
- future versions should balance facts across roles with a documented knowledge matrix.

## 7. UX Requirements

- Core flow must work at 360px width.
- No `user-scalable=no`.
- Ranking must be usable without drag-and-drop.
- All ranking controls require keyboard-accessible buttons.
- Autosave is local-first.
- Expert reveal must remain locked until the pre-expert reflection is saved.
- The saved pre-expert reflection is immutable during the expert debrief.
- Advanced import/export tools should not clutter the core student flow.

## 8. Next Product Iterations

High-value follow-ups, in order:

1. **Team disagreement view**
   - Import or enter multiple individual rankings.
   - Automatically surface items with the largest disagreement.
   - Use disagreement to drive discussion instead of making learners inspect 15 rows manually.

2. **Teacher configuration**
   - Classic mode vs specialist-role extension.
   - Optional cinematic intro.
   - Optional reflection prompts.
   - Optional display of classic rank-difference metric.

3. **Classroom handoff**
   - File / QR / short-code transfer of individual rankings to a group device without requiring a backend where possible.

4. **Legacy migration**
   - Import useful progress data from the Pinky Moon Survival v1.9 format when feasible.

5. **Pinky deployment integration**
   - `new-moon` remains the canonical source.
   - Pinky should consume a built artifact rather than maintain a second hand-edited copy.
