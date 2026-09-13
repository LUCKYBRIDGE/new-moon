import { useEffect, useMemo, useState } from 'react';
import {
  ITEM_BY_ID,
  ITEMS,
  ROLES,
  SOURCE_LINKS,
  type ItemId,
  type RoleId
} from './content';
import {
  EMPTY_SESSION,
  closeToExpertCount,
  getChangeCandidates,
  getMaintainedCandidates,
  isCompleteRanking,
  moveItem,
  rankOf,
  rankingDistanceFromExpert,
  shouldUseMaintainedReflection,
  type PreExpertReflection,
  type Ranking,
  type ReflectionCause,
  type SessionState
} from './domain';

const STORAGE_KEY = 'new-moon-session-v1';

const CAUSE_LABELS: Record<ReflectionCause, string> = {
  peer: '친구의 설명을 듣고',
  science: '새로운 달 과학 지식을 알고',
  comparison: '다른 물품과 비교하면서',
  discussion: '모둠 토의 과정에서',
  other: '기타'
};

const EXPERT_ORDER = [...ITEMS].sort((a, b) => a.expertRank - b.expertRank);

function loadInitialSession(): SessionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_SESSION;
    const parsed = JSON.parse(raw) as SessionState;
    if (parsed?.version !== 1) return EMPTY_SESSION;
    return parsed;
  } catch {
    return EMPTY_SESSION;
  }
}

function App() {
  const [session, setSession] = useState<SessionState>(loadInitialSession);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const patch = (next: Partial<SessionState>) => {
    setSession((current) => ({ ...current, ...next }));
  };

  const reset = () => {
    if (!window.confirm('현재 기기의 활동 기록을 지우고 처음부터 시작할까요?')) return;
    localStorage.removeItem(STORAGE_KEY);
    setSession(EMPTY_SESSION);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" aria-label="New Moon 달에서 살아남기">
          <span className="brand-mark" aria-hidden="true">◐</span>
          <span>NEW MOON</span>
        </div>
        {session.screen !== 'welcome' && (
          <button className="ghost-button compact" type="button" onClick={reset}>처음부터</button>
        )}
      </header>

      <main className="app-main">
        {session.screen === 'welcome' && <Welcome onStart={() => patch({ screen: 'setup' })} />}
        {session.screen === 'setup' && <Setup session={session} onChange={setSession} />}
        {session.screen === 'crash' && <Crash onNext={() => patch({ screen: 'guide' })} />}
        {session.screen === 'guide' && <Guide onNext={() => patch({ screen: 'individual' })} />}
        {session.screen === 'individual' && (
          <IndividualRanking
            ranking={session.personalRanking}
            onRankingChange={(personalRanking) => patch({ personalRanking })}
            onNext={() => {
              patch({
                teamRanking: [...session.personalRanking],
                screen: session.useRoleExtension ? 'role' : 'discussion'
              });
            }}
          />
        )}
        {session.screen === 'role' && (
          <RoleSelection
            selected={session.roleId as RoleId | null}
            onSelect={(roleId) => patch({ roleId, screen: 'knowledge' })}
            onSkip={() => patch({ roleId: null, screen: 'discussion' })}
          />
        )}
        {session.screen === 'knowledge' && (
          <Knowledge
            roleId={session.roleId as RoleId | null}
            onNext={() => patch({ screen: 'discussion' })}
          />
        )}
        {session.screen === 'discussion' && (
          <DiscussionGuide onNext={() => patch({ screen: 'team' })} />
        )}
        {session.screen === 'team' && (
          <TeamRanking
            personal={session.personalRanking}
            ranking={session.teamRanking}
            onRankingChange={(teamRanking) => patch({ teamRanking })}
            onNext={() => patch({ screen: 'reflection' })}
          />
        )}
        {session.screen === 'reflection' && (
          <PreExpertReflectionScreen
            personal={session.personalRanking}
            team={session.teamRanking}
            existing={session.reflection}
            onSave={(reflection) => patch({ reflection, expertStep: 0, screen: 'expert' })}
          />
        )}
        {session.screen === 'expert' && session.reflection && (
          <ExpertDebrief
            personal={session.personalRanking}
            team={session.teamRanking}
            reflection={session.reflection}
            step={session.expertStep}
            onStep={(expertStep) => patch({ expertStep })}
            onFinish={() => patch({ screen: 'summary' })}
          />
        )}
        {session.screen === 'summary' && session.reflection && (
          <Summary
            session={session}
            onRestart={reset}
          />
        )}
      </main>
    </div>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <section className="screen hero-screen">
      <div className="eyebrow">NASA MOON SURVIVAL · CLASSROOM ADAPTATION</div>
      <h1>달에서 살아남기</h1>
      <p className="hero-copy">
        15개의 물품을 두고 먼저 스스로 판단하고, 모둠과 토의해 하나의 결론을 만든 뒤,
        마지막에 전문가의 판단과 이유를 비교합니다.
      </p>

      <div className="principle-card">
        <strong>이 활동의 중심은 점수가 아닙니다.</strong>
        <p>왜 그렇게 판단했는지, 그리고 다른 근거를 만난 뒤 생각이 어떻게 달라졌는지를 살펴봅니다.</p>
      </div>

      <div className="flow-strip" aria-label="활동 순서">
        <span>개인 판단</span><b>→</b><span>모둠 합의</span><b>→</b><span>판단 변화 기록</span><b>→</b><span>전문가 비교</span>
      </div>

      <button className="primary-button large" type="button" onClick={onStart}>미션 시작</button>
    </section>
  );
}

function Setup({ session, onChange }: { session: SessionState; onChange: (next: SessionState) => void }) {
  const student = session.student;
  const valid = student.groupName.trim() && student.name.trim() && student.number.trim();

  const updateStudent = (key: keyof SessionState['student'], value: string) => {
    onChange({ ...session, student: { ...student, [key]: value } });
  };

  return (
    <section className="screen narrow-screen">
      <StepLabel current="준비" />
      <h1>탐사대 정보</h1>
      <p className="subtle">이 정보는 현재 기기의 활동 기록에만 저장됩니다.</p>

      <div className="form-card">
        <label>
          <span>모둠 이름</span>
          <input value={student.groupName} onChange={(e) => updateStudent('groupName', e.target.value)} placeholder="예: 1모둠" />
        </label>
        <label>
          <span>번호</span>
          <input value={student.number} onChange={(e) => updateStudent('number', e.target.value)} inputMode="numeric" placeholder="예: 12" />
        </label>
        <label>
          <span>이름</span>
          <input value={student.name} onChange={(e) => updateStudent('name', e.target.value)} placeholder="예: 홍길동" />
        </label>
      </div>

      <label className="extension-toggle">
        <input
          type="checkbox"
          checked={session.useRoleExtension}
          onChange={(e) => onChange({ ...session, useRoleExtension: e.target.checked })}
        />
        <span>
          <strong>전문 역할 확장 사용</strong>
          <small>개인 판단을 끝낸 뒤 우주과학자·탐험가·통신전문가·의료진 정보를 받아 모둠 토의에 활용합니다.</small>
        </span>
      </label>

      <button className="primary-button" type="button" disabled={!valid} onClick={() => onChange({ ...session, screen: 'crash' })}>
        조난 상황 확인
      </button>
    </section>
  );
}

function Crash({ onNext }: { onNext: () => void }) {
  return (
    <section className="screen crash-screen">
      <div className="alarm">⚠ MISSION ALERT</div>
      <h1>달 착륙선이 예정 지점에서 크게 벗어나 불시착했습니다.</h1>
      <div className="mission-facts">
        <div><span>목표</span><strong>모선과 합류</strong></div>
        <div><span>거리</span><strong>약 200 miles · 320 km</strong></div>
        <div><span>상태</span><strong>대부분의 장비 파손</strong></div>
      </div>
      <p>
        사용할 수 있는 물품은 15개뿐입니다. 모든 물품을 생존과 이동에 얼마나 중요한지 판단하여
        1위부터 15위까지 순위를 정해야 합니다.
      </p>
      <button className="primary-button" type="button" onClick={onNext}>살아남은 물품 확인</button>
    </section>
  );
}

function Guide({ onNext }: { onNext: () => void }) {
  return (
    <section className="screen narrow-screen">
      <StepLabel current="개인 판단 전" />
      <h1>먼저, 내 생각으로 판단합니다</h1>
      <div className="guide-grid">
        <article>
          <span className="guide-number">1</span>
          <h2>15개 이유를 쓰지 않습니다</h2>
          <p>지금은 각 물품의 우선순위에 집중하세요. 모든 물품에 긴 설명을 적을 필요가 없습니다.</p>
        </article>
        <article>
          <span className="guide-number">2</span>
          <h2>전문가 순위는 아직 공개하지 않습니다</h2>
          <p>먼저 자신의 지식과 판단으로 순위를 만든 뒤 모둠 토의를 진행합니다.</p>
        </article>
        <article>
          <span className="guide-number">3</span>
          <h2>가장 중요한 이유는 나중에 하나만</h2>
          <p>모둠 합의 후, 내 생각이 의미 있게 바뀐 물품 하나를 골라 그 이유를 기록합니다.</p>
        </article>
      </div>
      <button className="primary-button" type="button" onClick={onNext}>개인 순위 정하기</button>
    </section>
  );
}

function IndividualRanking({ ranking, onRankingChange, onNext }: {
  ranking: Ranking;
  onRankingChange: (ranking: Ranking) => void;
  onNext: () => void;
}) {
  return (
    <section className="screen ranking-screen">
      <StepLabel current="1 · 개인 판단" />
      <h1>나의 생존 우선순위</h1>
      <p className="subtle">가장 중요하다고 생각하는 물품부터 하나씩 선택하세요. 이유는 지금 모두 적지 않아도 됩니다.</p>
      <RankingBoard ranking={ranking} onChange={onRankingChange} allowRemove />
      <div className="sticky-action">
        <div>
          <strong>{ranking.length} / 15</strong>
          <span>순위 결정</span>
        </div>
        <button className="primary-button" type="button" disabled={!isCompleteRanking(ranking)} onClick={onNext}>
          개인 판단 확정
        </button>
      </div>
    </section>
  );
}

function RankingBoard({ ranking, onChange, allowRemove = false }: {
  ranking: Ranking;
  onChange: (ranking: Ranking) => void;
  allowRemove?: boolean;
}) {
  const unranked = ITEMS.filter((item) => !ranking.includes(item.id));

  return (
    <div className="ranking-workspace">
      <div className="rank-list" aria-label="현재 순위">
        {ranking.length === 0 && (
          <div className="empty-state">아래 물품을 눌러 1위부터 순서대로 채워보세요.</div>
        )}
        {ranking.map((itemId, index) => {
          const item = ITEM_BY_ID[itemId];
          return (
            <article className="rank-card" key={itemId}>
              <div className="rank-badge">{index + 1}</div>
              <div className="item-icon" aria-hidden="true">{item.icon}</div>
              <div className="rank-copy">
                <strong>{item.name}</strong>
                <small>{item.description}</small>
              </div>
              <div className="rank-controls" aria-label={`${item.name} 순위 조절`}>
                <button
                  className="icon-button"
                  type="button"
                  aria-label={`${item.name} 한 단계 위로`}
                  disabled={index === 0}
                  onClick={() => onChange(moveItem(ranking, index, index - 1))}
                >↑</button>
                <button
                  className="icon-button"
                  type="button"
                  aria-label={`${item.name} 한 단계 아래로`}
                  disabled={index === ranking.length - 1}
                  onClick={() => onChange(moveItem(ranking, index, index + 1))}
                >↓</button>
                {allowRemove && (
                  <button
                    className="icon-button danger"
                    type="button"
                    aria-label={`${item.name} 순위에서 빼기`}
                    onClick={() => onChange(ranking.filter((id) => id !== itemId))}
                  >×</button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {unranked.length > 0 && (
        <aside className="item-bank">
          <div className="item-bank-header">
            <strong>남은 물품</strong>
            <span>{unranked.length}개</span>
          </div>
          <div className="item-bank-grid">
            {unranked.map((item) => (
              <button className="bank-item" type="button" key={item.id} onClick={() => onChange([...ranking, item.id])}>
                <span aria-hidden="true">{item.icon}</span>
                <strong>{item.shortName}</strong>
              </button>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}

function RoleSelection({ selected, onSelect, onSkip }: {
  selected: RoleId | null;
  onSelect: (id: RoleId) => void;
  onSkip: () => void;
}) {
  return (
    <section className="screen">
      <StepLabel current="확장 · 전문 역할" />
      <h1>개인 판단을 끝냈습니다. 이제 전문 정보를 나눠 가집니다.</h1>
      <p className="subtle">
        이 정보에는 전문가 순위가 없습니다. 모둠원끼리 서로 다른 관점의 정보를 공유하며 토의에 활용하세요.
      </p>
      <div className="role-grid">
        {ROLES.map((role) => (
          <button
            className={`role-card ${selected === role.id ? 'selected' : ''}`}
            type="button"
            key={role.id}
            onClick={() => onSelect(role.id)}
          >
            <span className="role-icon" aria-hidden="true">{role.icon}</span>
            <strong>{role.name}</strong>
            <small>{role.focus}</small>
          </button>
        ))}
      </div>
      <button className="text-button" type="button" onClick={onSkip}>전문 역할 없이 원작 흐름으로 계속하기</button>
    </section>
  );
}

function Knowledge({ roleId, onNext }: { roleId: RoleId | null; onNext: () => void }) {
  const role = ROLES.find((candidate) => candidate.id === roleId);
  if (!role) return <DiscussionGuide onNext={onNext} />;

  return (
    <section className="screen narrow-screen">
      <StepLabel current="전문 정보" />
      <div className="role-heading"><span aria-hidden="true">{role.icon}</span><div><h1>{role.name}</h1><p>{role.focus}</p></div></div>
      <div className="knowledge-list">
        {role.facts.map((fact, index) => (
          <article key={fact}><span>{index + 1}</span><p>{fact}</p></article>
        ))}
      </div>
      <div className="notice-card">이 정보는 토의를 돕는 자료입니다. 특정 물품의 최종 순위를 직접 알려주지는 않습니다.</div>
      <button className="primary-button" type="button" onClick={onNext}>모둠 토의로</button>
    </section>
  );
}

function DiscussionGuide({ onNext }: { onNext: () => void }) {
  return (
    <section className="screen narrow-screen">
      <StepLabel current="2 · 모둠 토의" />
      <h1>평균을 내지 말고, 하나의 판단에 합의하세요</h1>
      <div className="discussion-rules">
        <article><strong>먼저 묻기</strong><p>순위가 다른 물품부터 “왜 그렇게 생각했어?”라고 물어봅니다.</p></article>
        <article><strong>근거 말하기</strong><p>달의 환경, 이동, 생존, 통신 같은 근거를 사용해 설명합니다.</p></article>
        <article><strong>바꿔도 괜찮기</strong><p>더 좋은 근거를 들으면 자신의 판단을 바꾸는 것도 좋은 의사결정입니다.</p></article>
        <article><strong>유지해도 괜찮기</strong><p>다른 의견을 검토한 뒤에도 근거가 있다면 판단을 유지할 수 있습니다.</p></article>
      </div>
      <button className="primary-button" type="button" onClick={onNext}>모둠 최종 순위 만들기</button>
    </section>
  );
}

function TeamRanking({ personal, ranking, onRankingChange, onNext }: {
  personal: Ranking;
  ranking: Ranking;
  onRankingChange: (ranking: Ranking) => void;
  onNext: () => void;
}) {
  const changed = ranking.filter((itemId) => rankOf(ranking, itemId) !== rankOf(personal, itemId)).length;

  return (
    <section className="screen ranking-screen">
      <StepLabel current="3 · 모둠 합의" />
      <h1>우리 모둠의 최종 순위</h1>
      <p className="subtle">개인 순위를 출발점으로 복사했습니다. 모둠의 합의에 맞게 순서를 조정하세요.</p>
      <div className="change-meter"><strong>{changed}개</strong><span>물품의 위치가 내 개인 판단과 달라졌습니다.</span></div>
      <RankingBoard ranking={ranking} onChange={onRankingChange} />
      <div className="sticky-action">
        <div><strong>합의 확인</strong><span>NASA 판단은 아직 공개되지 않습니다.</span></div>
        <button className="primary-button" type="button" disabled={!isCompleteRanking(ranking)} onClick={onNext}>
          모둠 순위 확정
        </button>
      </div>
    </section>
  );
}

function PreExpertReflectionScreen({ personal, team, existing, onSave }: {
  personal: Ranking;
  team: Ranking;
  existing: PreExpertReflection | null;
  onSave: (reflection: PreExpertReflection) => void;
}) {
  const maintainedMode = shouldUseMaintainedReflection(personal, team);
  const candidates = maintainedMode
    ? getMaintainedCandidates(personal, team, 3)
    : getChangeCandidates(personal, team, 3);
  const [itemId, setItemId] = useState<ItemId | null>(existing?.itemId ?? candidates[0]?.itemId ?? null);
  const [cause, setCause] = useState<ReflectionCause>(existing?.cause ?? 'peer');
  const [text, setText] = useState(existing?.text ?? '');

  const chosen = candidates.find((candidate) => candidate.itemId === itemId);
  const valid = Boolean(chosen && text.trim().length >= 5);

  const save = () => {
    if (!chosen || !itemId || !valid) return;
    onSave({
      kind: maintainedMode ? 'maintained' : 'changed',
      itemId,
      cause,
      text: text.trim(),
      personalRank: chosen.personalRank,
      teamRank: chosen.teamRank,
      savedAt: new Date().toISOString()
    });
  };

  return (
    <section className="screen narrow-screen reflection-screen">
      <StepLabel current="4 · 전문가 공개 전" />
      <div className="locked-banner">🔒 NASA 전문가 판단은 아직 보이지 않습니다.</div>
      <h1>{maintainedMode ? '끝까지 유지한 판단 하나를 돌아봅니다' : '내 생각이 크게 바뀐 물품 하나를 돌아봅니다'}</h1>
      <p className="subtle">
        {maintainedMode
          ? '토의를 충분히 했는데도 순위 변화가 크지 않았습니다. 다른 의견을 들은 뒤에도 유지한 판단 하나를 골라 이유를 남겨보세요.'
          : '개인 순위와 모둠 순위의 차이가 큰 물품을 골랐습니다. 숫자가 가장 많이 바뀐 물품을 꼭 고를 필요는 없습니다.'}
      </p>

      <div className="candidate-grid">
        {candidates.map((candidate) => {
          const item = ITEM_BY_ID[candidate.itemId];
          return (
            <button
              type="button"
              key={candidate.itemId}
              className={`candidate-card ${itemId === candidate.itemId ? 'selected' : ''}`}
              onClick={() => setItemId(candidate.itemId)}
            >
              <span className="candidate-icon" aria-hidden="true">{item.icon}</span>
              <strong>{item.shortName}</strong>
              <span className="rank-change">개인 {candidate.personalRank}위 <b>→</b> 모둠 {candidate.teamRank}위</span>
              {!maintainedMode && <small>{candidate.delta}단계 변화</small>}
            </button>
          );
        })}
      </div>

      <fieldset className="cause-fieldset">
        <legend>{maintainedMode ? '이 판단을 유지하는 데 가장 중요했던 것은?' : '무엇이 생각을 바꾸는 데 가장 영향을 주었나요?'}</legend>
        <div className="chip-grid">
          {(Object.entries(CAUSE_LABELS) as [ReflectionCause, string][]).map(([value, label]) => (
            <label className="choice-chip" key={value}>
              <input type="radio" name="cause" value={value} checked={cause === value} onChange={() => setCause(value)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="reflection-input">
        <span>{maintainedMode ? '다른 의견을 들은 뒤에도 왜 이 판단을 유지했나요?' : '처음 생각과 지금 생각이 어떻게 달라졌나요?'}</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder={maintainedMode
            ? '예) 다른 의견도 들었지만, 달에서 이동하려면 ... 때문에 여전히 중요하다고 생각했다.'
            : '예) 처음에는 ...라고 생각했다. 그런데 ...라는 의견을 듣고, 지금은 ...라고 생각한다.'}
        />
        <small>길게 쓰기보다, 생각이 바뀌거나 유지된 이유가 드러나게 적어보세요.</small>
      </label>

      <button className="primary-button" type="button" disabled={!valid} onClick={save}>
        내 생각 기록하고 NASA 전문가 판단 보기
      </button>
      <p className="privacy-note">이 기록은 전문가 공개 전에 저장되며, 이후 비교 화면에서도 당시 생각 그대로 보여줍니다.</p>
    </section>
  );
}

function ExpertDebrief({ personal, team, reflection, step, onStep, onFinish }: {
  personal: Ranking;
  team: Ranking;
  reflection: PreExpertReflection;
  step: number;
  onStep: (step: number) => void;
  onFinish: () => void;
}) {
  const item = EXPERT_ORDER[step];
  const isLast = step === EXPERT_ORDER.length - 1;
  const personalRank = rankOf(personal, item.id);
  const teamRank = rankOf(team, item.id);
  const isReflected = reflection.itemId === item.id;

  return (
    <section className="screen expert-screen">
      <StepLabel current="5 · 전문가 브리핑" />
      <div className="expert-progress" aria-label={`전문가 브리핑 ${step + 1} / 15`}>
        <span style={{ width: `${((step + 1) / 15) * 100}%` }} />
      </div>
      <div className="expert-count">{step + 1} / 15</div>

      <article className="expert-card">
        <div className="expert-rank">전문가 비교 순위 {item.expertRank}위</div>
        <div className="expert-icon" aria-hidden="true">{item.icon}</div>
        <h1>{item.name}</h1>
        <p className="expert-reason">{item.expertReason}</p>

        <div className="three-way-compare">
          <div><span>나</span><strong>{personalRank}위</strong></div>
          <div><span>우리 모둠</span><strong>{teamRank}위</strong></div>
          <div><span>전문가</span><strong>{item.expertRank}위</strong></div>
        </div>
      </article>

      {isReflected && (
        <aside className="memory-card">
          <div className="memory-label">전문가 판단을 보기 전에 내가 남긴 기록</div>
          <p>“{reflection.text}”</p>
          <small>{CAUSE_LABELS[reflection.cause]}</small>
        </aside>
      )}

      <div className="expert-actions">
        <button className="ghost-button" type="button" disabled={step === 0} onClick={() => onStep(step - 1)}>이전</button>
        {isLast ? (
          <button className="primary-button" type="button" onClick={onFinish}>전체 돌아보기</button>
        ) : (
          <button className="primary-button" type="button" onClick={() => onStep(step + 1)}>다음 전문가 판단</button>
        )}
      </div>
    </section>
  );
}

function Summary({ session, onRestart }: { session: SessionState; onRestart: () => void }) {
  const reflection = session.reflection!;
  const item = ITEM_BY_ID[reflection.itemId];
  const personalClose = closeToExpertCount(session.personalRanking);
  const teamClose = closeToExpertCount(session.teamRanking);
  const personalDistance = rankingDistanceFromExpert(session.personalRanking);
  const teamDistance = rankingDistanceFromExpert(session.teamRanking);

  const largestExpertDifferences = useMemo(() => {
    return ITEMS.map((candidate) => ({
      item: candidate,
      teamRank: rankOf(session.teamRanking, candidate.id),
      delta: Math.abs(rankOf(session.teamRanking, candidate.id) - candidate.expertRank)
    }))
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 3);
  }, [session.teamRanking]);

  return (
    <section className="screen summary-screen">
      <StepLabel current="6 · 돌아보기" />
      <h1>우리의 판단 과정</h1>
      <p className="subtle">결과를 한 점수로 줄이기보다, 무엇이 비슷했고 무엇이 달랐는지 살펴봅니다.</p>

      <div className="summary-stats">
        <article><span>전문가와 ±2위 안에서 비슷했던 물품</span><strong>개인 {personalClose}개</strong><b>→</b><strong>모둠 {teamClose}개</strong></article>
        <article><span>{reflection.kind === 'changed' ? '내가 돌아본 판단 변화' : '내가 끝까지 유지한 판단'}</span><strong>{item.icon} {item.shortName}</strong><small>개인 {reflection.personalRank}위 → 모둠 {reflection.teamRank}위</small></article>
      </div>

      <article className="reflection-result">
        <div><span className="eyebrow">MY DECISION TRACE</span><h2>{item.name}</h2></div>
        <blockquote>{reflection.text}</blockquote>
        <p>{CAUSE_LABELS[reflection.cause]}</p>
      </article>

      <div className="difference-section">
        <h2>우리 모둠이 전문가와 가장 다르게 본 물품</h2>
        <p>‘틀린 물품’ 목록이 아니라, 서로의 근거를 다시 비교해볼 만한 지점입니다.</p>
        <div className="difference-list">
          {largestExpertDifferences.map(({ item: candidate, teamRank, delta }) => (
            <article key={candidate.id}>
              <span aria-hidden="true">{candidate.icon}</span>
              <div><strong>{candidate.shortName}</strong><small>모둠 {teamRank}위 · 전문가 {candidate.expertRank}위</small></div>
              <b>{delta}단계 차이</b>
            </article>
          ))}
        </div>
      </div>

      <details className="score-details">
        <summary>고전 방식의 순위 차이 지표도 확인하기</summary>
        <div>
          <p>고전 Moon Survival 활동에서 흔히 쓰는 방식으로 각 물품의 순위 차이를 합산한 참고값입니다. 낮을수록 전문가 순위와 가깝지만, 이 숫자가 활동의 목표는 아닙니다.</p>
          <div className="score-pair"><span>개인 비교값 <strong>{personalDistance}</strong></span><span>모둠 비교값 <strong>{teamDistance}</strong></span></div>
        </div>
      </details>

      <div className="source-card">
        <h2>활동 자료 출처</h2>
        <p>Moon Survival에는 여러 NASA 교육 변형이 있습니다. 이 웹은 고전적 개인→집단→전문가 비교 구조를 중심으로 하며, 전문가 비교 자료는 NASA/GSFC StarChild 자료를 주요 기준으로 삼았습니다.</p>
        <ul>
          {SOURCE_LINKS.map((source) => (
            <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a></li>
          ))}
        </ul>
      </div>

      <button className="ghost-button" type="button" onClick={onRestart}>새 활동 시작</button>
    </section>
  );
}

function StepLabel({ current }: { current: string }) {
  return <div className="step-label">{current}</div>;
}

export default App;
