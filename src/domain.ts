import { ITEM_BY_ID, ITEMS, type ItemId } from './content';

export type Ranking = ItemId[];

export type ReflectionKind = 'changed' | 'maintained';
export type ReflectionCause = 'peer' | 'science' | 'comparison' | 'discussion' | 'other';

export type PreExpertReflection = {
  kind: ReflectionKind;
  itemId: ItemId;
  cause: ReflectionCause;
  text: string;
  personalRank: number;
  teamRank: number;
  savedAt: string;
};

export type SessionState = {
  version: 1;
  screen:
    | 'welcome'
    | 'setup'
    | 'crash'
    | 'guide'
    | 'individual'
    | 'role'
    | 'knowledge'
    | 'discussion'
    | 'team'
    | 'reflection'
    | 'expert'
    | 'summary';
  student: {
    groupName: string;
    number: string;
    name: string;
  };
  useRoleExtension: boolean;
  roleId: string | null;
  personalRanking: Ranking;
  teamRanking: Ranking;
  reflection: PreExpertReflection | null;
  expertStep: number;
};

export const EMPTY_SESSION: SessionState = {
  version: 1,
  screen: 'welcome',
  student: {
    groupName: '',
    number: '',
    name: ''
  },
  useRoleExtension: false,
  roleId: null,
  personalRanking: [],
  teamRanking: [],
  reflection: null,
  expertStep: 0
};

export function isCompleteRanking(ranking: Ranking): boolean {
  return ranking.length === ITEMS.length && new Set(ranking).size === ITEMS.length;
}

export function rankOf(ranking: Ranking, itemId: ItemId): number {
  const index = ranking.indexOf(itemId);
  return index < 0 ? 0 : index + 1;
}

export function moveItem(ranking: Ranking, fromIndex: number, toIndex: number): Ranking {
  if (fromIndex < 0 || fromIndex >= ranking.length || toIndex < 0 || toIndex >= ranking.length) {
    return ranking;
  }
  const next = [...ranking];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

export function putItemAtRank(ranking: Ranking, itemId: ItemId, targetRank: number): Ranking {
  const targetIndex = Math.max(0, Math.min(ITEMS.length - 1, targetRank - 1));
  const withoutItem = ranking.filter((id) => id !== itemId);
  withoutItem.splice(targetIndex, 0, itemId);
  return withoutItem;
}

export function rankingDistanceFromExpert(ranking: Ranking): number {
  if (!isCompleteRanking(ranking)) return 0;
  return ranking.reduce((total, itemId, index) => {
    return total + Math.abs(index + 1 - ITEM_BY_ID[itemId].expertRank);
  }, 0);
}

export function closeToExpertCount(ranking: Ranking, tolerance = 2): number {
  if (!isCompleteRanking(ranking)) return 0;
  return ranking.filter((itemId, index) => Math.abs(index + 1 - ITEM_BY_ID[itemId].expertRank) <= tolerance).length;
}

export type ChangeCandidate = {
  itemId: ItemId;
  personalRank: number;
  teamRank: number;
  delta: number;
};

export function getChangeCandidates(personal: Ranking, team: Ranking, limit = 3): ChangeCandidate[] {
  if (!isCompleteRanking(personal) || !isCompleteRanking(team)) return [];

  return ITEMS.map((item) => {
    const personalRank = rankOf(personal, item.id);
    const teamRank = rankOf(team, item.id);
    return {
      itemId: item.id,
      personalRank,
      teamRank,
      delta: Math.abs(personalRank - teamRank)
    };
  })
    .sort((a, b) => b.delta - a.delta || a.teamRank - b.teamRank)
    .slice(0, limit);
}

export function getMaintainedCandidates(personal: Ranking, team: Ranking, limit = 3): ChangeCandidate[] {
  if (!isCompleteRanking(personal) || !isCompleteRanking(team)) return [];

  return ITEMS.map((item) => {
    const personalRank = rankOf(personal, item.id);
    const teamRank = rankOf(team, item.id);
    return {
      itemId: item.id,
      personalRank,
      teamRank,
      delta: Math.abs(personalRank - teamRank)
    };
  })
    .sort((a, b) => a.delta - b.delta || a.teamRank - b.teamRank)
    .slice(0, limit);
}

export function shouldUseMaintainedReflection(personal: Ranking, team: Ranking): boolean {
  const changes = getChangeCandidates(personal, team, 1);
  return changes.length === 0 || changes[0].delta < 2;
}

export function seedRanking(): Ranking {
  // Fixed neutral presentation order: this is NOT an implied survival ranking.
  // Learners explicitly fill rank slots in the UI before this order is ever treated as a ranking.
  return ITEMS.map((item) => item.id);
}
