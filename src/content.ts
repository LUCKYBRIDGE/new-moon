export type ItemId =
  | 'matches'
  | 'rope'
  | 'water'
  | 'flares'
  | 'parachute'
  | 'oxygen'
  | 'milk'
  | 'radio'
  | 'heater'
  | 'starMap'
  | 'pistols'
  | 'firstAid'
  | 'food'
  | 'compass'
  | 'raft';

export type SurvivalItem = {
  id: ItemId;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  expertRank: number;
  expertReason: string;
};

export const ITEMS: SurvivalItem[] = [
  {
    id: 'matches',
    name: '성냥 한 상자',
    shortName: '성냥',
    icon: '🔥',
    description: '불을 붙일 때 사용하는 일반 성냥입니다.',
    expertRank: 15,
    expertReason: '달에는 불꽃을 지속시킬 대기가 사실상 없기 때문에 활용 가치가 매우 낮다고 보았습니다.'
  },
  {
    id: 'rope',
    name: '나일론 로프 약 15m',
    shortName: '나일론 로프',
    icon: '🪢',
    description: '사람이나 물건을 묶고 끌거나 험한 지형을 통과할 때 활용할 수 있는 로프입니다.',
    expertRank: 6,
    expertReason: '험한 지형을 통과하거나 부상자를 함께 이동시키는 등 여러 상황에 활용할 수 있다고 보았습니다.'
  },
  {
    id: 'water',
    name: '물 약 20L',
    shortName: '물',
    icon: '💧',
    description: '마실 수 있는 물입니다.',
    expertRank: 2,
    expertReason: '생존에 필수이며, 달의 햇빛을 받는 환경에서 발생할 수 있는 큰 수분 손실을 보충해야 한다고 보았습니다.'
  },
  {
    id: 'flares',
    name: '신호탄',
    shortName: '신호탄',
    icon: '🚨',
    description: '멀리 있는 사람에게 위치나 긴급 상황을 알릴 때 사용하는 신호 장비입니다.',
    expertRank: 10,
    expertReason: '구조대가 시야에 들어왔을 때 위치를 알리는 조난 신호로 사용할 수 있다고 보았습니다.'
  },
  {
    id: 'parachute',
    name: '낙하산 천',
    shortName: '낙하산 천',
    icon: '🪂',
    description: '넓고 튼튼한 천 재질의 낙하산 일부입니다.',
    expertRank: 8,
    expertReason: '강한 햇빛으로부터 몸을 가리는 데 활용할 수 있다고 보았습니다.'
  },
  {
    id: 'oxygen',
    name: '산소 탱크 2개',
    shortName: '산소 탱크',
    icon: '🫁',
    description: '우주복 생명 유지에 사용할 수 있는 압축 산소 탱크입니다.',
    expertRank: 1,
    expertReason: '호흡 가능한 대기가 없는 달에서 가장 긴급한 생존 요구라고 보았습니다.'
  },
  {
    id: 'milk',
    name: '분유 한 상자',
    shortName: '분유',
    icon: '🥛',
    description: '물에 타서 먹는 분말 형태의 우유입니다.',
    expertRank: 12,
    expertReason: '식량이 될 수 있지만 물을 필요로 하고, 농축 식량과 기능이 겹치면서 더 부피가 크다고 보았습니다.'
  },
  {
    id: 'radio',
    name: '태양광 FM 송수신기',
    shortName: 'FM 송수신기',
    icon: '📻',
    description: '태양광으로 작동하며 음성 신호를 송수신할 수 있는 장비입니다.',
    expertRank: 5,
    expertReason: '구조대와 통신할 수 있지만 FM 통신은 가시선과 거리에 제약이 있다고 보았습니다.'
  },
  {
    id: 'heater',
    name: '휴대용 난방기',
    shortName: '난방기',
    icon: '♨️',
    description: '몸이나 주변을 따뜻하게 하는 휴대용 장비입니다.',
    expertRank: 13,
    expertReason: '햇빛을 받는 쪽에서는 우선 필요성이 낮고, 어두운 쪽에 있을 때 더 유용하다고 보았습니다.'
  },
  {
    id: 'starMap',
    name: '별자리 지도',
    shortName: '별자리 지도',
    icon: '🗺️',
    description: '별의 위치와 배열을 확인할 수 있는 지도입니다.',
    expertRank: 3,
    expertReason: '달에서 이동 방향을 판단하기 위한 중요한 항법 수단으로 보았습니다.'
  },
  {
    id: 'pistols',
    name: '.45구경 권총 2정',
    shortName: '권총 2정',
    icon: '◼️',
    description: '탄약이 장전된 권총 두 정입니다.',
    expertRank: 11,
    expertReason: '생존용 우선순위는 낮지만 반작용을 이용한 제한적인 추진 가능성을 고려했습니다.'
  },
  {
    id: 'firstAid',
    name: '주사침이 포함된 구급상자',
    shortName: '구급상자',
    icon: '🩹',
    description: '의약품과 우주복의 전용 투입구에 사용할 수 있는 주사침 등이 포함된 응급 처치 도구입니다.',
    expertRank: 7,
    expertReason: '부상이나 건강 문제에 대응하고 의약품을 사용할 수 있어 생존 유지에 도움이 된다고 보았습니다.'
  },
  {
    id: 'food',
    name: '농축 식량',
    shortName: '농축 식량',
    icon: '🥫',
    description: '작은 부피로 에너지를 공급할 수 있는 농축된 식량입니다.',
    expertRank: 4,
    expertReason: '에너지 요구를 효율적으로 충족하는 식량이라고 보았습니다.'
  },
  {
    id: 'compass',
    name: '자기 나침반',
    shortName: '자기 나침반',
    icon: '🧭',
    description: '자기장을 이용해 방향을 확인하는 나침반입니다.',
    expertRank: 14,
    expertReason: '달에는 지구처럼 전 지구적이고 정렬된 자기장이 없어 항법 도구로 거의 쓸 수 없다고 보았습니다.'
  },
  {
    id: 'raft',
    name: '자동 팽창식 구명보트',
    shortName: '구명보트',
    icon: '🛟',
    description: '가스 용기로 자동 팽창되는 휴대용 구명보트입니다.',
    expertRank: 9,
    expertReason: '보트 자체의 용도는 제한적이지만 가스 용기나 운반 수단 등 다른 방식의 활용 가능성을 고려했습니다.'
  }
];

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((item) => [item.id, item])) as Record<ItemId, SurvivalItem>;

export type RoleId = 'scientist' | 'explorer' | 'communicator' | 'medic';

export type SpecialistRole = {
  id: RoleId;
  name: string;
  icon: string;
  focus: string;
  facts: string[];
};

export const ROLES: SpecialistRole[] = [
  {
    id: 'scientist',
    name: '우주과학자',
    icon: '🔬',
    focus: '달의 환경과 물리 조건',
    facts: [
      '달에는 지구처럼 호흡할 수 있는 대기가 사실상 없습니다.',
      '달에는 지구와 같은 전 지구적 자기장이 없습니다.',
      '소리는 전달될 물질이 거의 없는 진공에서는 공기 중처럼 퍼지지 않습니다.',
      '햇빛을 받는 곳과 그늘진 곳의 환경 차이가 매우 큽니다.'
    ]
  },
  {
    id: 'explorer',
    name: '탐험가',
    icon: '🥾',
    focus: '이동과 지형, 방향 판단',
    facts: [
      '장거리 이동에서는 방향을 잃지 않는 것이 생존 자원만큼 중요할 수 있습니다.',
      '달 표면에는 거친 지형과 분화구가 있어 이동과 운반이 쉽지 않을 수 있습니다.',
      '별의 위치는 방향 판단에 사용할 수 있는 정보가 될 수 있습니다.',
      '장비는 본래 용도뿐 아니라 운반·보호·결속 등 다른 용도로도 활용할 수 있습니다.'
    ]
  },
  {
    id: 'communicator',
    name: '통신전문가',
    icon: '📡',
    focus: '구조 신호와 통신',
    facts: [
      '전파는 진공에서도 전달될 수 있습니다.',
      'FM 통신은 지형과 가시선, 거리에 영향을 받을 수 있습니다.',
      '구조대가 가까이 왔을 때 시각 신호도 위치를 알리는 수단이 될 수 있습니다.',
      '통신 장비의 전원과 실제 사용 가능한 거리를 함께 고려해야 합니다.'
    ]
  },
  {
    id: 'medic',
    name: '의료진',
    icon: '🩺',
    focus: '생명 유지와 건강',
    facts: [
      '호흡과 수분 공급은 즉각적인 생존에 직접 연결됩니다.',
      '장거리 이동에서는 탈수와 피로가 판단력과 활동 능력을 떨어뜨릴 수 있습니다.',
      '부상에 대비할 수 있는 작은 의료 장비는 이동 중 위험을 낮출 수 있습니다.',
      '식량의 가치는 에너지 공급뿐 아니라 무게와 필요한 물의 양도 함께 고려해야 합니다.'
    ]
  }
];

export const SOURCE_LINKS = [
  {
    label: 'NASA/GSFC StarChild — Problems in Space',
    href: 'https://starchild.gsfc.nasa.gov/docs/StarChild/space_level2/problems_space.html'
  },
  {
    label: "NASA/GSFC StarChild — Experts' Solution",
    href: 'https://starchild.gsfc.nasa.gov/docs/StarChild/space_level2/problems_space_solution.html'
  },
  {
    label: 'NASA — Survival! Exploration: Then and Now',
    href: 'https://www.nasa.gov/wp-content/uploads/2009/07/166504main_survival.pdf'
  }
] as const;
