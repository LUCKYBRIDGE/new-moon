import { describe, expect, it } from 'vitest';
import { ITEMS } from './content';
import {
  getChangeCandidates,
  isCompleteRanking,
  moveItem,
  rankingDistanceFromExpert,
  shouldUseMaintainedReflection,
  type Ranking
} from './domain';

const expertRanking = [...ITEMS]
  .sort((a, b) => a.expertRank - b.expertRank)
  .map((item) => item.id) as Ranking;

describe('Moon Survival ranking domain', () => {
  it('recognizes one unique 15-item ranking as complete', () => {
    expect(isCompleteRanking(expertRanking)).toBe(true);
    expect(isCompleteRanking(expertRanking.slice(0, 14))).toBe(false);
  });

  it('gives zero distance to the expert ordering', () => {
    expect(rankingDistanceFromExpert(expertRanking)).toBe(0);
  });

  it('moves an item without losing or duplicating items', () => {
    const moved = moveItem(expertRanking, 0, 5);
    expect(moved).toHaveLength(15);
    expect(new Set(moved).size).toBe(15);
    expect(moved[5]).toBe(expertRanking[0]);
  });

  it('selects the largest personal-to-team changes first', () => {
    const team = [...expertRanking].reverse() as Ranking;
    const candidates = getChangeCandidates(expertRanking, team, 3);
    expect(candidates).toHaveLength(3);
    expect(candidates[0].delta).toBeGreaterThanOrEqual(candidates[1].delta);
    expect(candidates[1].delta).toBeGreaterThanOrEqual(candidates[2].delta);
  });

  it('uses maintained-judgment reflection when rankings barely change', () => {
    expect(shouldUseMaintainedReflection(expertRanking, expertRanking)).toBe(true);
    const changed = moveItem(expertRanking, 0, 5);
    expect(shouldUseMaintainedReflection(expertRanking, changed)).toBe(false);
  });
});
