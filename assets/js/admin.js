(() => {
  "use strict";

  const escapeHTML = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  const listField = (value) => Array.isArray(value) ? value.join(", ") : (value || "");
  const parseList = (value) => String(value || "").split(",").map((s) => s.trim()).filter(Boolean);

  // 각 데이터 종류별 입력 스키마
  const SCHEMAS = {
    characters: {
      label: "캐릭터",
      key: "characters",
      idField: "id",
      fields: [
        { name: "id", label: "고유 ID (영문)", placeholder: "예: mametchi" },
        { name: "nameKo", label: "한국어 이름" },
        { name: "nameJa", label: "일본어 이름" },
        { name: "nameEn", label: "영문 이름" },
        { name: "gen", label: "세대", placeholder: "예: 1세대" },
        { name: "family", label: "계열", placeholder: "예: 천재 계열" },
        { name: "img", label: "이모지", placeholder: "🌟" },
        { name: "badge", label: "뱃지" },
        { name: "happinessReq", label: "필요 행복도" },
        { name: "careMissReq", label: "필요 케어미스" },
        { name: "likeFood", label: "좋아하는 음식(쉼표구분)", isList: true },
        { name: "dislikeFood", label: "싫어하는 음식(쉼표구분)", isList: true },
        { name: "likeToy", label: "좋아하는 장난감(쉼표구분)", isList: true },
        { name: "note", label: "비고", isTextarea: true }
      ],
      columns: ["id", "nameKo", "nameJa", "gen", "family"]
    },
    items: {
      label: "아이템",
      key: "items",
      idField: "id",
      fields: [
        { name: "id", label: "고유 ID (영문)" },
        { name: "nameKo", label: "한국어 이름" },
        { name: "nameJa", label: "일본어 이름" },
        { name: "category", label: "카테고리", isSelect: ["food", "toy", "accessory", "background"] },
        { name: "price", label: "가격" },
        { name: "shop", label: "구매처" },
        { name: "effect", label: "효과" },
        { name: "loveBy", label: "좋아하는 캐릭터 ID(쉼표구분)", isList: true }
      ],
      columns: ["id", "nameKo", "nameJa", "category", "price"]
    },
    towns: {
      label: "마을",
      key: "towns",
      idField: "id",
      fields: [
        { name: "id", label: "고유 ID (영문)" },
        { name: "name", label: "마을 이름" },
        { name: "unlock", label: "해금 조건" },
        { name: "shops", label: "상점(쉼표구분)", isList: true },
        { name: "npc", label: "NPC(쉼표구분)", isList: true },
        { name: "items", label: "아이템(쉼표구분)", isList: true },
        { name: "note", label: "비고", isTextarea: true }
      ],
      columns: ["id", "name", "unlock"]
    },
    dictionary: {
      label: "번역 사전",
      key: "dictionary",
      idField: null,
      fields: [
        { name: "ja", label: "일본어" },
        { name: "ko", label: "한국어 뜻" },
        { name: "category", label: "분류", placeholder: "예: 돌보기" }
      ],
      columns: ["ja", "ko", "category"]
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (!window.TMZ_DATA) return;

    let working = JSON.parse(JSON.stringify(window.TMZ_DATA));
    let activeTab = "characters";

    const tabsEl = document.getElementById("adminTabs");
    const panelsEl = document.getElementById("adminPanels");

    tabsEl.innerHTML = Object.keys(SCHEMAS).map((key) =>
      `<button class="tab${key === activeTab ? " is-active" : ""}" data-tab="${key}" type="button">${SCHEMAS[key].label}</button>`
    ).join("");

    tabsEl.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-tab]");
      if (!btn) return;
      activeTab = btn.dataset.tab;
      [...tabsEl.children].forEach((b) => b.classList.toggle("is-active", b === btn));
      renderPanel();
    });

    function saveWorking() {
      localStorage.setItem(window.TMZ_STORAGE_KEY, JSON.stringify(working));
    }

    function fieldInput(field) {
      if (field.isSelect) {
        return `<select name="${field.name}">${field.isSelect.map((v) => `<option value="${v}">${v}</option>`).join("")}</select>`;
      }
      if (field.isTextarea) {
        return `<textarea name="${field.name}" rows="2" placeholder="${escapeHTML(field.placeholder || "")}"></textarea>`;
      }
      return `<input type="text" name="${field.name}" placeholder="${escapeHTML(field.placeholder || "")}">`;
    }

    function renderPanel() {
      const schema = SCHEMAS[activeTab];
      const rows = working[schema.key] || [];

      panelsEl.innerHTML = `
        <div class="admin-panel">
          <h2>${schema.label} 추가하기</h2>
          <form class="admin-form" id="addForm">
            ${schema.fields.map((f) => `<label>${escapeHTML(f.label)}${fieldInput(f)}</label>`).join("")}
          </form>
          <button class="primary-button" id="addBtn" type="button">＋ 추가하기</button>
        </div>
        <div class="admin-panel">
          <h2>${schema.label} 목록 (${rows.length}개)</h2>
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead><tr>${schema.columns.map((c) => `<th>${escapeHTML(c)}</th>`).join("")}<th>삭제</th></tr></thead>
              <tbody id="adminTableBody"></tbody>
            </table>
          </div>
        </div>`;

      renderTableBody();

      document.getElementById("addBtn").addEventListener("click", () => {
        const form = document.getElementById("addForm");
        const entry = {};
        schema.fields.forEach((f) => {
          const el = form.elements[f.name];
          entry[f.name] = f.isList ? parseList(el.value) : el.value.trim();
        });

        if (schema.idField && !entry[schema.idField]) {
          window.TMZ_TOAST("고유 ID를 입력해주세요.");
          return;
        }
        if (schema.idField && rows.some((r) => r[schema.idField] === entry[schema.idField])) {
          window.TMZ_TOAST("이미 존재하는 ID예요. 다른 ID를 사용해주세요.");
          return;
        }

        rows.push(entry);
        saveWorking();
        renderTableBody();
        form.reset();
        window.TMZ_TOAST(`${schema.label}을(를) 추가했어요!`);
      });
    }

    function renderTableBody() {
      const schema = SCHEMAS[activeTab];
      const rows = working[schema.key] || [];
      const tbody = document.getElementById("adminTableBody");
      tbody.innerHTML = rows.length
        ? rows.map((row, idx) => `
            <tr>
              ${schema.columns.map((c) => `<td>${escapeHTML(listField(row[c]))}</td>`).join("")}
              <td><button class="danger-button" data-del="${idx}" type="button" style="padding:4px 8px;">삭제</button></td>
            </tr>`).join("")
        : `<tr><td colspan="${schema.columns.length + 1}" class="empty-state">등록된 데이터가 없어요.</td></tr>`;

      tbody.querySelectorAll("button[data-del]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.dataset.del);
          rows.splice(idx, 1);
          saveWorking();
          renderTableBody();
          window.TMZ_TOAST("삭제했어요.");
        });
      });
    }

    // 내보내기 / 불러오기 / 초기화
    document.getElementById("exportBtn").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(working, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tamagotchi-meets-guide-data.json";
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById("importInput").addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        working = parsed;
        saveWorking();
        renderPanel();
        window.TMZ_TOAST("JSON 데이터를 불러왔어요!");
      } catch (err) {
        window.TMZ_TOAST("JSON 파일을 읽는 데 실패했어요.");
      }
    });

    document.getElementById("resetBtn").addEventListener("click", () => {
      if (!confirm("정말 기본 데이터로 초기화할까요? 저장된 커스텀 데이터가 모두 사라져요.")) return;
      localStorage.removeItem(window.TMZ_STORAGE_KEY);
      working = JSON.parse(JSON.stringify(window.TMZ_DEFAULT_DATA));
      renderPanel();
      window.TMZ_TOAST("기본 데이터로 초기화했어요.");
    });

    renderPanel();
  });
})();
