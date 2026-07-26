(() => {
  "use strict";

  const FAQ_ITEMS = [
    {
      q: "일본어를 전혀 몰라도 다마고치 미츠를 플레이할 수 있나요?",
      a: "네! 이 사이트의 번역 사전(translate.html)에서 게임 속 자주 나오는 일본어 단어를 한국어로 바로 확인할 수 있어요. 처음에는 화면 버튼 위치와 아이콘을 함께 외워두면 더 편해요."
    },
    {
      q: "케어미스(お世話ミス)가 뭔가요?",
      a: "배고픔, 화장실, 기분 등 알림 신호가 왔을 때 제때 돌봐주지 못하면 케어미스로 기록돼요. 케어미스가 많을수록 진화 결과가 원하는 방향과 달라질 수 있어요. 자세한 조건은 성장조건 페이지를 확인하세요."
    },
    {
      q: "원하는 캐릭터로 진화시키려면 어떻게 해야 하나요?",
      a: "캐릭터 도감에서 원하는 캐릭터를 검색한 뒤 '필요 행복도'와 '필요 케어미스' 항목을 확인하고, 그 조건에 맞춰 돌보기를 진행해보세요. '이 캐릭터 얻기' 체크리스트에 추가해두면 진행 상황을 기억하기 쉬워요."
    },
    {
      q: "결혼은 아무 때나 할 수 있나요?",
      a: "성체(성인기)로 자란 캐릭터만 결혼이 가능해요. 또한 친밀도가 일정 수준 이상이어야 결혼 상담소 이용이 가능하니, 결혼 가이드 페이지에서 조건을 확인해보세요."
    },
    {
      q: "이 사이트의 수치 정보는 정확한가요?",
      a: "캐릭터 이름처럼 널리 알려진 정보는 그대로 담았지만, 필요 행복도·케어미스·확률처럼 세부 수치는 예시 데이터예요. 정확한 최신 수치는 공식 정보나 공략 위키를 참고해 관리자 페이지에서 채워 넣을 수 있어요."
    },
    {
      q: "다크모드는 어떻게 켜나요?",
      a: "화면 상단 내비게이션 오른쪽의 🌙 버튼을 누르면 다크모드로 전환돼요. 설정은 브라우저에 저장되어 다음 방문 때도 유지돼요."
    }
  ];

  document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("faqList");
    if (!list) return;

    const escapeHTML = (value) => String(value ?? "")
      .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

    list.innerHTML = FAQ_ITEMS.map((item, idx) => `
      <div class="faq-item" id="faqItem${idx}">
        <button class="faq-question" type="button" aria-expanded="false">
          <span>Q. ${escapeHTML(item.q)}</span>
          <span aria-hidden="true">＋</span>
        </button>
        <div class="faq-answer">A. ${escapeHTML(item.a)}</div>
      </div>`).join("");

    list.addEventListener("click", (event) => {
      const btn = event.target.closest(".faq-question");
      if (!btn) return;
      const item = btn.closest(".faq-item");
      const open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
      btn.querySelector("span[aria-hidden]").textContent = open ? "－" : "＋";
    });
  });
})();
