/* =========================================================================
   TAMAGOTCHI MEETS 한국어 육성가이드 — 데이터 파일
   -------------------------------------------------------------------------
   이 파일은 사이트의 "DB" 역할을 하는 샘플 데이터입니다.
   ⚠️ 캐릭터 이름·세대 구성은 실제 프랜차이즈에 알려진 명칭을 참고했지만,
      필요 행복도 / 케어미스 / 확률 등 세부 수치는 예시(placeholder) 값입니다.
      실제 게임 수치는 攻略위키·공식 자료를 확인해 관리자 페이지(admin.html)
      또는 이 파일을 직접 수정해 채워 넣어 주세요.
   - localStorage에 관리자 페이지에서 저장한 데이터가 있으면 그것으로 덮어씁니다.
   ========================================================================= */

(() => {
  "use strict";

  const DEFAULT_DATA = {

    // ------------------------------------------------------------------
    // 성장 단계 (공통 진화 트리 뼈대)
    // ------------------------------------------------------------------
    growthStages: [
      {
        id: "baby",
        ko: "아기",
        ja: "赤ちゃん",
        days: "탄생 직후",
        desc: "알에서 태어난 직후 단계예요. 이 시기엔 진화 조건 영향 없이 일정 시간이 지나면 자동으로 유아기로 넘어가요.",
        requirement: { careMiss: "영향 없음", happiness: "영향 없음", closeness: "영향 없음" }
      },
      {
        id: "toddler",
        ko: "유아",
        ja: "幼年期",
        days: "약 1일차",
        desc: "기본적인 돌보기(밥, 화장실, 청소)에 익숙해지는 시기예요. 케어미스를 적게 할수록 다음 단계에서 좋은 방향으로 진화할 확률이 올라가요.",
        requirement: { careMiss: "0~2회", happiness: "3칸 이상", closeness: "-" }
      },
      {
        id: "child",
        ko: "소년기",
        ja: "少年期",
        days: "약 2~3일차",
        desc: "성격의 방향(활발형/얌전형/장난꾸러기형 등)이 정해지기 시작해요. 좋아하는 음식·장난감 위주로 챙겨주면 친밀도가 잘 올라가요.",
        requirement: { careMiss: "0~3회", happiness: "4칸 이상", closeness: "보통 이상" }
      },
      {
        id: "teen",
        ko: "청소년기",
        ja: "思春期",
        days: "약 4~5일차",
        desc: "성체 직전 단계로, 특정 캐릭터를 노리고 있다면 이 시기의 케어미스 관리가 가장 중요해요.",
        requirement: { careMiss: "0~2회", happiness: "5칸 이상", closeness: "높음" }
      },
      {
        id: "adult",
        ko: "성체",
        ja: "成人期",
        days: "약 6~7일차",
        desc: "완전히 성장한 단계예요. 이후 결혼(けっこん)을 통해 다음 세대로 이어갈 수 있어요.",
        requirement: { careMiss: "-", happiness: "-", closeness: "결혼 가능" }
      }
    ],

    // ------------------------------------------------------------------
    // 캐릭터 DB (예시 샘플 — 필요에 따라 계속 추가해주세요)
    // ------------------------------------------------------------------
    characters: [
      {
        id: "mametchi",
        nameKo: "마메치",
        nameJa: "まめっち",
        nameEn: "Mametchi",
        gen: "1세대",
        stage: "adult",
        family: "천재 계열",
        img: "🌟",
        accent: "#c7e7f2",
        badge: "대표 캐릭터",
        closeness: 4,
        happinessReq: "5칸 이상 유지",
        careMissReq: "청소년기까지 케어미스 0~1회",
        likeFood: ["카레라이스", "함박스테이크"],
        dislikeFood: ["피망 요리"],
        likeToy: ["로봇 장난감"],
        note: "돌보기를 성실히 하면 만날 수 있는 대표적인 성공(우량) 루트 캐릭터예요."
      },
      {
        id: "kuchipatchi",
        nameKo: "쿠치파치",
        nameJa: "くちぱっち",
        nameEn: "Kuchipatchi",
        gen: "1세대",
        stage: "adult",
        family: "먹보 계열",
        img: "🍙",
        accent: "#ffdaca",
        badge: "인기 캐릭터",
        closeness: 3,
        happinessReq: "보통 이상",
        careMissReq: "제한 없음(균형 육아)",
        likeFood: ["초밥", "라멘"],
        dislikeFood: ["샐러드"],
        likeToy: ["인형"],
        note: "밥을 잘 챙겨주는 균형 잡힌 육아를 하면 자주 만나는 친근한 캐릭터예요."
      },
      {
        id: "memetchi",
        nameKo: "메메치",
        nameJa: "めめっち",
        nameEn: "Memetchi",
        gen: "1세대",
        stage: "adult",
        family: "우등생 계열",
        img: "🎀",
        accent: "#f7bfd8",
        badge: "여자아이 대표",
        closeness: 4,
        happinessReq: "5칸 이상 유지",
        careMissReq: "0회에 가깝게",
        likeFood: ["케이크", "파르페"],
        dislikeFood: ["매운 음식"],
        likeToy: ["리본 액세서리"],
        note: "꼼꼼하게 돌보고 자주 놀아주면 성장하는 여자아이 계열 대표 캐릭터예요."
      },
      {
        id: "violetchi",
        nameKo: "바이올렛치",
        nameJa: "ばいおれっち",
        nameEn: "Violetchi",
        gen: "2세대",
        stage: "adult",
        family: "우아한 계열",
        img: "💜",
        accent: "#dfcff2",
        badge: "숨겨진 캐릭터",
        closeness: 5,
        happinessReq: "항상 만칸",
        careMissReq: "전체 기간 0회",
        likeFood: ["홍차", "마카롱"],
        dislikeFood: ["패스트푸드"],
        likeToy: ["피아노"],
        note: "완벽에 가까운 육아를 했을 때 등장 확률이 높아지는 하이엔드 루트예요."
      },
      {
        id: "mimitchi",
        nameKo: "미미치",
        nameJa: "みみっち",
        nameEn: "Mimitchi",
        gen: "1세대",
        stage: "child",
        family: "얌전 계열",
        img: "🐰",
        accent: "#cdebdc",
        badge: "유아기 단골",
        closeness: 2,
        happinessReq: "보통",
        careMissReq: "제한 없음",
        likeFood: ["당근 케이크"],
        dislikeFood: ["탄산음료"],
        likeToy: ["그림책"],
        note: "유아기~소년기 구간에서 자주 마주치는 얌전한 성격의 캐릭터예요."
      },
      {
        id: "ginjirotchi",
        nameKo: "긴지로치",
        nameJa: "ぎんじろっち",
        nameEn: "Ginjirotchi",
        gen: "2세대",
        stage: "adult",
        family: "예술가 계열",
        img: "🎨",
        accent: "#fff0ba",
        badge: "결혼 인기 상대",
        closeness: 4,
        happinessReq: "5칸 이상",
        careMissReq: "0~2회",
        likeFood: ["화과자"],
        dislikeFood: ["인스턴트 음식"],
        likeToy: ["붓·팔레트"],
        note: "결혼 후보로도 인기가 많은 예술가 타입 캐릭터예요."
      }
    ],

    // ------------------------------------------------------------------
    // 결혼 정보 (예시)
    // ------------------------------------------------------------------
    marriage: {
      intro: "성체가 된 캐릭터는 마을의 '결혼 상담소(けっこん相談所)'에서 상대를 만나 결혼할 수 있어요. 결혼 후에는 알을 통해 다음 세대 캐릭터를 얻을 수 있어요.",
      requirements: [
        "캐릭터가 성체(성인기) 단계에 도달해야 해요.",
        "친밀도(なかよし度)가 일정 수준 이상이어야 상담소 이용이 가능해요.",
        "결혼 후보 목록은 마을 시설 해금 상태에 따라 달라질 수 있어요."
      ],
      candidates: [
        { id: "kuchipatchi", note: "다정한 성격으로 결혼 후보로도 자주 추천돼요." },
        { id: "ginjirotchi", note: "예술가 타입 결혼 후보로 인기가 많아요." },
        { id: "memetchi", note: "우등생 계열 결혼 후보, 자녀 외모에 영향을 줄 수 있어요." }
      ]
    },

    // ------------------------------------------------------------------
    // 아이템 DB (음식 / 장난감 / 액세서리 / 배경)
    // ------------------------------------------------------------------
    items: [
      { id: "curry", nameKo: "카레라이스", nameJa: "カレーライス", category: "food", price: "200G", shop: "레스토랑", effect: "포만감 ★★★ · 기분 +2", loveBy: ["mametchi"] },
      { id: "sushi", nameKo: "초밥 세트", nameJa: "おすし", category: "food", price: "350G", shop: "초밥집", effect: "포만감 ★★★★ · 기분 +2", loveBy: ["kuchipatchi"] },
      { id: "cake", nameKo: "딸기 케이크", nameJa: "ショートケーキ", category: "food", price: "180G", shop: "카페", effect: "포만감 ★★ · 기분 +3(간식)", loveBy: ["memetchi"] },
      { id: "wagashi", nameKo: "화과자", nameJa: "わがし", category: "food", price: "220G", shop: "전통 다과점", effect: "포만감 ★★ · 기분 +3", loveBy: ["ginjirotchi"] },
      { id: "robot-toy", nameKo: "로봇 장난감", nameJa: "ロボットのおもちゃ", category: "toy", price: "500G", shop: "장난감 가게", effect: "친밀도 +2 · 놀이 만족도 ↑", loveBy: ["mametchi"] },
      { id: "doll", nameKo: "곰 인형", nameJa: "くまのぬいぐるみ", category: "toy", price: "300G", shop: "장난감 가게", effect: "친밀도 +2", loveBy: ["kuchipatchi"] },
      { id: "piano", nameKo: "미니 피아노", nameJa: "ミニピアノ", category: "toy", price: "650G", shop: "악기점", effect: "친밀도 +3 · 특기 발동 확률 ↑", loveBy: ["violetchi"] },
      { id: "ribbon", nameKo: "리본 머리핀", nameJa: "リボンのかみどめ", category: "accessory", price: "150G", shop: "액세서리 가게", effect: "패션 포인트 +2", loveBy: ["memetchi"] },
      { id: "hat", nameKo: "베레모", nameJa: "ベレー帽", category: "accessory", price: "180G", shop: "액세서리 가게", effect: "패션 포인트 +2", loveBy: ["ginjirotchi"] },
      { id: "bg-park", nameKo: "공원 배경", nameJa: "こうえんの背景", category: "background", price: "무료(해금)", shop: "마을 이벤트 보상", effect: "사진 모드 배경", loveBy: [] },
      { id: "bg-cafe", nameKo: "카페 배경", nameJa: "カフェの背景", category: "background", price: "400G", shop: "인테리어 가게", effect: "사진 모드 배경", loveBy: [] }
    ],

    // ------------------------------------------------------------------
    // 마을 가이드 (예시)
    // ------------------------------------------------------------------
    towns: [
      {
        id: "town-main",
        name: "메인 마을",
        unlock: "게임 시작과 동시에 이용 가능",
        shops: ["종합 상점", "레스토랑", "장난감 가게"],
        npc: ["이장 캐릭터", "상점 주인"],
        items: ["기본 식재료", "기본 장난감"],
        note: "튜토리얼과 기본 육아 시설이 모여 있는 첫 마을이에요."
      },
      {
        id: "town-sea",
        name: "바다 마을",
        unlock: "메인 마을 친밀도 이벤트 클리어 후 해금",
        shops: ["해산물 식당", "다이빙샵"],
        npc: ["어부 캐릭터"],
        items: ["해산물 요리", "여름 액세서리"],
        note: "여름 한정 이벤트나 해산물 계열 음식을 얻기 좋은 마을이에요."
      },
      {
        id: "town-art",
        name: "예술의 마을",
        unlock: "특정 성격(예술가 계열) 캐릭터 육성 시 자연 해금",
        shops: ["화방", "음악당"],
        npc: ["화가 캐릭터", "음악가 캐릭터"],
        items: ["악기", "그림 도구"],
        note: "긴지로치 계열처럼 예술가 성향 캐릭터를 노릴 때 자주 방문하게 돼요."
      }
    ],

    // ------------------------------------------------------------------
    // 일본어 ↔ 한국어 번역 사전
    // ------------------------------------------------------------------
    dictionary: [
      { ja: "ごはん", ko: "밥(식사)", category: "돌보기" },
      { ja: "おやつ", ko: "간식", category: "돌보기" },
      { ja: "トイレ", ko: "화장실", category: "돌보기" },
      { ja: "おそうじ", ko: "청소", category: "돌보기" },
      { ja: "おふろ", ko: "목욕", category: "돌보기" },
      { ja: "ねんね／ねる", ko: "재우기", category: "돌보기" },
      { ja: "あそぶ", ko: "놀아주기", category: "돌보기" },
      { ja: "おでかけ", ko: "외출", category: "이동" },
      { ja: "おかいもの", ko: "쇼핑", category: "이동" },
      { ja: "おみせ", ko: "상점", category: "이동" },
      { ja: "けっこん", ko: "결혼", category: "이벤트" },
      { ja: "けっこんそうだんじょ", ko: "결혼 상담소", category: "이벤트" },
      { ja: "プレゼント", ko: "선물", category: "이벤트" },
      { ja: "おしごと", ko: "일하기(직업 체험)", category: "이벤트" },
      { ja: "ミニゲーム", ko: "미니게임", category: "이벤트" },
      { ja: "せいちょう", ko: "성장", category: "상태" },
      { ja: "たいじゅう", ko: "체중", category: "상태" },
      { ja: "きぶん", ko: "기분/컨디션", category: "상태" },
      { ja: "げんき", ko: "기력/건강", category: "상태" },
      { ja: "なかよし度", ko: "친밀도", category: "상태" },
      { ja: "おなか", ko: "포만감(배고픔)", category: "상태" },
      { ja: "しつけ", ko: "훈육", category: "상태" },
      { ja: "せわ", ko: "돌보기 전반", category: "상태" },
      { ja: "びょういん", ko: "병원", category: "시설" },
      { ja: "がっこう", ko: "학교", category: "시설" },
      { ja: "こうえん", ko: "공원", category: "시설" }
    ]
  };

  // 관리자 페이지(admin.html)에서 저장한 커스텀 데이터가 있으면 병합
  const STORAGE_KEY = "tmz_custom_data_v1";
  let finalData = DEFAULT_DATA;

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && typeof saved === "object") {
      finalData = {
        growthStages: saved.growthStages && saved.growthStages.length ? saved.growthStages : DEFAULT_DATA.growthStages,
        characters: saved.characters && saved.characters.length ? saved.characters : DEFAULT_DATA.characters,
        marriage: saved.marriage || DEFAULT_DATA.marriage,
        items: saved.items && saved.items.length ? saved.items : DEFAULT_DATA.items,
        towns: saved.towns && saved.towns.length ? saved.towns : DEFAULT_DATA.towns,
        dictionary: saved.dictionary && saved.dictionary.length ? saved.dictionary : DEFAULT_DATA.dictionary
      };
    }
  } catch (err) {
    console.warn("저장된 커스텀 데이터를 불러오지 못했어요. 기본 데이터로 표시합니다.", err);
  }

  window.TMZ_DATA = finalData;
  window.TMZ_DEFAULT_DATA = DEFAULT_DATA;
  window.TMZ_STORAGE_KEY = STORAGE_KEY;
})();
