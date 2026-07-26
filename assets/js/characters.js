(() => {
  "use strict";

  const escapeHTML = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  const normalize = (value) => String(value ?? "").normalize("NFKC").toLocaleLowerCase("ko-KR").trim();

  const CHECKLIST_KEY = "tmz_checklist_v1";
  const getChecklist = () => {
    try { return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || "[]"); } catch { return []; }
  };
  const setChecklist = (list) => localStorage.setItem(CHECKLIST_KEY, JSON.stringify(list));

  document.addEventListener("DOMContentLoaded", () => {
    const data = window.TMZ_DATA;
    if (!data) return;

    const characters = data.characters;
    const state = { gen: "all", query: "", sort: "default", activeId: null };

    const els = {
      genTabs: document.getElementById("genTabs"),
      searchInput: document.getElementById("searchInput"),
      clearSearch: document.getElementById("clearSearch"),
      sortSelect: document.getElementById("sortSelect"),
      resultLabel: document.getElementById("resultLabel"),
      grid: document.getElementById("charaGrid"),
      modalOverlay: document.getElementById("modalOverlay"),
      modalClose: document.getElementById("modalClose"),
      modalImage: document.getElementById("modalImage"),
      modalGen: document.getElementById("modalGen"),
      modalBadge: document.getElementById("modalBadge"),
      modalTitle: document.getElementById("modalTitle"),
      modalNames: document.getElementById("modalNames"),
      modalSpecs: document.getElementById("modalSpecs"),
      modalChecklist: document.getElementById("modalChecklist"),
      modalFavBtn: document.getElementById("modalFavBtn")
    };

    // 세대 탭 구성
    const gens = ["all", ...new Set(characters.map((c) => c.gen))];
    els.genTabs.innerHTML = gens.map((g) => {
      const label = g === "all" ? "전체" : g;
      return `<button class="tab${g === "all" ? " is-active" : ""}" data-gen="${escapeHTML(g)}" type="button">${escapeHTML(label)}</button>`;
    }).join("");

    els.genTabs.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-gen]");
      if (!btn) return;
      state.gen = btn.dataset.gen;
      [...els.genTabs.children].forEach((b) => b.classList.toggle("is-active", b === btn));
      render();
    });

    els.searchInput.addEventListener("input", () => {
      state.query = els.searchInput.value;
      els.clearSearch.hidden = !state.query;
      render();
    });
    els.clearSearch.addEventListener("click", () => {
      els.searchInput.value = "";
      state.query = "";
      els.clearSearch.hidden = true;
      render();
    });
    els.sortSelect.addEventListener("change", () => {
      state.sort = els.sortSelect.value;
      render();
    });

    function filtered() {
      let list = characters.slice();
      if (state.gen !== "all") list = list.filter((c) => c.gen === state.gen);
      if (state.query) {
        const q = normalize(state.query);
        list = list.filter((c) =>
          normalize(c.nameKo).includes(q) ||
          normalize(c.nameJa).includes(q) ||
          normalize(c.nameEn).includes(q)
        );
      }
      if (state.sort === "name") {
        list.sort((a, b) => a.nameKo.localeCompare(b.nameKo, "ko"));
      } else if (state.sort === "closeness") {
        list.sort((a, b) => (b.closeness || 0) - (a.closeness || 0));
      }
      return list;
    }

    function cardHTML(c) {
      const favs = window.TMZ_FAV.getFavorites();
      const isFav = favs.characters.includes(c.id);
      return `
        <article class="chara-card" style="border-top:6px solid ${c.accent || "var(--pink)"}">
          <div class="chara-card__thumb" style="background:${c.accent || "var(--pink-soft)"}">${c.img || "🐣"}</div>
          <div class="chara-card__body">
            ${c.badge ? `<span class="chara-card__badge">${escapeHTML(c.badge)}</span>` : ""}
            <div class="chara-card__name">${escapeHTML(c.nameKo)}<small>${escapeHTML(c.nameJa)} · ${escapeHTML(c.nameEn)}</small></div>
            <div class="chara-card__meta">${escapeHTML(c.gen)} · ${escapeHTML(c.family || "")}</div>
            <div class="chara-card__footer">
              <button class="fav-star${isFav ? " is-active" : ""}" data-fav="${c.id}" type="button" aria-label="즐겨찾기">${isFav ? "★" : "☆"}</button>
              <button class="detail-open-btn" data-open="${c.id}" type="button">상세보기 →</button>
            </div>
          </div>
        </article>`;
    }

    function render() {
      const list = filtered();
      els.resultLabel.textContent = `${state.gen === "all" ? "전체 캐릭터" : state.gen} · ${list.length}`;
      els.grid.innerHTML = list.length
        ? list.map(cardHTML).join("")
        : `<p class="empty-state">검색 결과가 없어요. 다른 이름으로 찾아보세요!</p>`;
    }

    els.grid.addEventListener("click", (event) => {
      const favBtn = event.target.closest("button[data-fav]");
      if (favBtn) {
        const id = favBtn.dataset.fav;
        const active = window.TMZ_FAV.toggleFavorite("characters", id);
        favBtn.textContent = active ? "★" : "☆";
        favBtn.classList.toggle("is-active", active);
        window.TMZ_TOAST(active ? "즐겨찾기에 추가했어요!" : "즐겨찾기에서 제거했어요.");
        return;
      }
      const openBtn = event.target.closest("button[data-open]");
      if (openBtn) openModal(openBtn.dataset.open);
    });

    function openModal(id) {
      const c = characters.find((item) => item.id === id);
      if (!c) return;
      state.activeId = id;
      els.modalImage.textContent = c.img || "🐣";
      els.modalGen.textContent = c.gen;
      els.modalBadge.textContent = c.badge || "";
      els.modalTitle.textContent = c.nameKo;
      els.modalNames.textContent = `${c.nameJa} · ${c.nameEn} · ${c.family || ""}`;
      els.modalSpecs.innerHTML = `
        <tr><th>필요 행복도</th><td>${escapeHTML(c.happinessReq || "-")}</td></tr>
        <tr><th>필요 케어미스</th><td>${escapeHTML(c.careMissReq || "-")}</td></tr>
        <tr><th>좋아하는 음식</th><td>${(c.likeFood || []).map(escapeHTML).join(", ") || "-"}</td></tr>
        <tr><th>싫어하는 음식</th><td>${(c.dislikeFood || []).map(escapeHTML).join(", ") || "-"}</td></tr>
        <tr><th>좋아하는 장난감</th><td>${(c.likeToy || []).map(escapeHTML).join(", ") || "-"}</td></tr>
        <tr><th>비고</th><td>${escapeHTML(c.note || "-")}</td></tr>`;

      const checklist = getChecklist();
      els.modalChecklist.checked = checklist.includes(id);

      const favs = window.TMZ_FAV.getFavorites();
      els.modalFavBtn.textContent = favs.characters.includes(id) ? "★ 즐겨찾기 해제" : "★ 즐겨찾기에 추가";

      els.modalOverlay.hidden = false;
      document.body.classList.add("modal-open");
    }

    function closeModal() {
      els.modalOverlay.hidden = true;
      document.body.classList.remove("modal-open");
    }

    els.modalClose.addEventListener("click", closeModal);
    els.modalOverlay.addEventListener("click", (event) => {
      if (event.target === els.modalOverlay) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !els.modalOverlay.hidden) closeModal();
    });

    els.modalChecklist.addEventListener("change", () => {
      const list = getChecklist();
      const id = state.activeId;
      const idx = list.indexOf(id);
      if (els.modalChecklist.checked && idx === -1) list.push(id);
      if (!els.modalChecklist.checked && idx >= 0) list.splice(idx, 1);
      setChecklist(list);
      window.TMZ_TOAST(els.modalChecklist.checked ? "체크리스트에 추가했어요!" : "체크리스트에서 제거했어요.");
    });

    els.modalFavBtn.addEventListener("click", () => {
      const active = window.TMZ_FAV.toggleFavorite("characters", state.activeId);
      els.modalFavBtn.textContent = active ? "★ 즐겨찾기 해제" : "★ 즐겨찾기에 추가";
      render();
    });

    render();
  });
})();
