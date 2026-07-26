(() => {
  "use strict";

  const escapeHTML = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const normalize = (value) => String(value ?? "").normalize("NFKC").toLocaleLowerCase("ko-KR").trim();

  const CATEGORY_META = {
    all: { label: "전체", icon: "🎁" },
    food: { label: "음식", icon: "🍙" },
    toy: { label: "장난감", icon: "🧸" },
    accessory: { label: "액세서리", icon: "🎀" },
    background: { label: "배경", icon: "🖼️" }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const data = window.TMZ_DATA;
    if (!data) return;

    const params = new URLSearchParams(location.search);
    const initialFilter = params.get("filter");

    const state = {
      category: ["food", "toy", "accessory", "background"].includes(initialFilter) ? initialFilter : "all",
      query: "",
      activeId: null
    };

    const els = {
      tabs: document.getElementById("itemTabs"),
      searchInput: document.getElementById("searchInput"),
      clearSearch: document.getElementById("clearSearch"),
      resultLabel: document.getElementById("resultLabel"),
      grid: document.getElementById("itemGrid"),
      modalOverlay: document.getElementById("modalOverlay"),
      modalClose: document.getElementById("modalClose"),
      modalImage: document.getElementById("modalImage"),
      modalCategory: document.getElementById("modalCategory"),
      modalTitle: document.getElementById("modalTitle"),
      modalNames: document.getElementById("modalNames"),
      modalSpecs: document.getElementById("modalSpecs"),
      modalFavBtn: document.getElementById("modalFavBtn")
    };

    const cats = Object.keys(CATEGORY_META);
    els.tabs.innerHTML = cats.map((key) => {
      const meta = CATEGORY_META[key];
      return `<button class="tab${key === state.category ? " is-active" : ""}" data-cat="${key}" type="button">${meta.icon} ${meta.label}</button>`;
    }).join("");

    els.tabs.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-cat]");
      if (!btn) return;
      state.category = btn.dataset.cat;
      [...els.tabs.children].forEach((b) => b.classList.toggle("is-active", b === btn));
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

    function itemIcon(item) {
      return { food: "🍙", toy: "🧸", accessory: "🎀", background: "🖼️" }[item.category] || "🎁";
    }

    function filtered() {
      let list = data.items.slice();
      if (state.category !== "all") list = list.filter((i) => i.category === state.category);
      if (state.query) {
        const q = normalize(state.query);
        list = list.filter((i) => normalize(i.nameKo).includes(q) || normalize(i.nameJa).includes(q));
      }
      return list;
    }

    function cardHTML(item) {
      const favs = window.TMZ_FAV.getFavorites();
      const isFav = favs.items.includes(item.id);
      return `
        <article class="db-card">
          <div class="db-card__thumb" style="background:var(--sky)">${itemIcon(item)}</div>
          <div class="db-card__body">
            <span class="db-card__badge">${escapeHTML(CATEGORY_META[item.category]?.label || "아이템")}</span>
            <div class="chara-card__name">${escapeHTML(item.nameKo)}<small>${escapeHTML(item.nameJa)}</small></div>
            <div class="db-card__meta">${escapeHTML(item.price)} · ${escapeHTML(item.shop)}</div>
            <div class="db-card__footer">
              <button class="fav-star${isFav ? " is-active" : ""}" data-fav="${item.id}" type="button" aria-label="즐겨찾기">${isFav ? "★" : "☆"}</button>
              <button class="detail-open-btn" data-open="${item.id}" type="button">상세보기 →</button>
            </div>
          </div>
        </article>`;
    }

    function render() {
      const list = filtered();
      const label = CATEGORY_META[state.category]?.label || "전체";
      els.resultLabel.textContent = `${label} · ${list.length}`;
      els.grid.innerHTML = list.length ? list.map(cardHTML).join("") : `<p class="empty-state">검색 결과가 없어요.</p>`;
    }

    els.grid.addEventListener("click", (event) => {
      const favBtn = event.target.closest("button[data-fav]");
      if (favBtn) {
        const id = favBtn.dataset.fav;
        const active = window.TMZ_FAV.toggleFavorite("items", id);
        favBtn.textContent = active ? "★" : "☆";
        favBtn.classList.toggle("is-active", active);
        window.TMZ_TOAST(active ? "즐겨찾기에 추가했어요!" : "즐겨찾기에서 제거했어요.");
        return;
      }
      const openBtn = event.target.closest("button[data-open]");
      if (openBtn) openModal(openBtn.dataset.open);
    });

    function openModal(id) {
      const item = data.items.find((i) => i.id === id);
      if (!item) return;
      state.activeId = id;
      els.modalImage.textContent = itemIcon(item);
      els.modalCategory.textContent = CATEGORY_META[item.category]?.label || "";
      els.modalTitle.textContent = item.nameKo;
      els.modalNames.textContent = item.nameJa;

      const loveNames = (item.loveBy || [])
        .map((id2) => data.characters.find((c) => c.id === id2)?.nameKo)
        .filter(Boolean);

      els.modalSpecs.innerHTML = `
        <tr><th>가격</th><td>${escapeHTML(item.price)}</td></tr>
        <tr><th>구매처</th><td>${escapeHTML(item.shop)}</td></tr>
        <tr><th>효과</th><td>${escapeHTML(item.effect)}</td></tr>
        <tr><th>좋아하는 캐릭터</th><td>${loveNames.length ? escapeHTML(loveNames.join(", ")) : "정보 없음"}</td></tr>`;

      const favs = window.TMZ_FAV.getFavorites();
      els.modalFavBtn.textContent = favs.items.includes(id) ? "★ 즐겨찾기 해제" : "★ 즐겨찾기에 추가";

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

    els.modalFavBtn.addEventListener("click", () => {
      const active = window.TMZ_FAV.toggleFavorite("items", state.activeId);
      els.modalFavBtn.textContent = active ? "★ 즐겨찾기 해제" : "★ 즐겨찾기에 추가";
      render();
    });

    render();
  });
})();
