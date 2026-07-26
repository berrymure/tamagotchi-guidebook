(() => {
  "use strict";

  const NAV_LINKS = [
    { href: "characters.html", label: "캐릭터", icon: "🐣" },
    { href: "growth.html", label: "진화", icon: "🌱" },
    { href: "marriage.html", label: "결혼", icon: "💍" },
    { href: "items.html", label: "아이템", icon: "🎁" },
    { href: "items.html?filter=food", label: "음식", icon: "🍙" },
    { href: "items.html?filter=toy", label: "장난감", icon: "🧸" },
    { href: "towns.html", label: "마을", icon: "🏘️" },
    { href: "translate.html", label: "번역", icon: "🈂️" },
    { href: "faq.html", label: "FAQ", icon: "❓" }
  ];

  const currentFile = (location.pathname.split("/").pop() || "index.html").split("?")[0] || "index.html";

  const escapeHTML = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  // ---------------------------------------------------------------------
  // 글로벌 내비게이션 렌더링
  // ---------------------------------------------------------------------
  function renderNav() {
    const mount = document.getElementById("gnav");
    if (!mount) return;

    const linkFile = (href) => href.split("?")[0];

    const linksHTML = NAV_LINKS.map((link) => {
      const isActive = linkFile(link.href) === currentFile;
      return `<a class="gnav__link${isActive ? " is-active" : ""}" href="${link.href}"><span aria-hidden="true">${link.icon}</span>${escapeHTML(link.label)}</a>`;
    }).join("");

    mount.innerHTML = `
      <div class="gnav__inner">
        <a class="gnav__logo" href="index.html">🐣 <span>Tamagotchi Meets</span> 한국어 가이드</a>
        <button class="gnav__toggle" id="gnavToggle" type="button" aria-expanded="false" aria-controls="gnavLinks">☰ 메뉴</button>
        <div class="gnav__links" id="gnavLinks">${linksHTML}</div>
        <div class="gnav__actions">
          <button class="gnav__icon-btn" id="favToggleBtn" type="button" title="즐겨찾기 보기">★ 즐겨찾기</button>
          <button class="gnav__icon-btn" id="darkToggleBtn" type="button" title="다크모드 전환">🌙</button>
        </div>
      </div>`;

    const toggle = document.getElementById("gnavToggle");
    const links = document.getElementById("gnavLinks");
    toggle?.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // ---------------------------------------------------------------------
  // 다크모드
  // ---------------------------------------------------------------------
  const THEME_KEY = "tmz_theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const btn = document.getElementById("darkToggleBtn");
    if (btn) btn.textContent = theme === "dark" ? "☀️ 라이트모드" : "🌙 다크모드";
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) ||
      (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(saved);

    document.getElementById("darkToggleBtn")?.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  // ---------------------------------------------------------------------
  // 즐겨찾기 (localStorage)
  // ---------------------------------------------------------------------
  const FAV_KEY = "tmz_favorites_v1";

  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(FAV_KEY) || '{"characters":[],"items":[]}');
    } catch {
      return { characters: [], items: [] };
    }
  }

  function saveFavorites(favs) {
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  }

  function isFavorite(type, id) {
    const favs = getFavorites();
    return (favs[type] || []).includes(id);
  }

  function toggleFavorite(type, id) {
    const favs = getFavorites();
    if (!favs[type]) favs[type] = [];
    const idx = favs[type].indexOf(id);
    if (idx >= 0) {
      favs[type].splice(idx, 1);
    } else {
      favs[type].push(id);
    }
    saveFavorites(favs);
    return favs[type].includes(id);
  }

  function buildFavModal() {
    if (document.getElementById("favModalOverlay")) return;
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "favModalOverlay";
    overlay.hidden = true;
    overlay.innerHTML = `
      <section class="window fav-modal" role="dialog" aria-modal="true" aria-labelledby="favModalTitle">
        <div class="titlebar titlebar--pink">
          <span class="traffic-lights" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="titlebar__name">MY_FAVORITES.HTML</span>
          <span class="window-controls"><button class="modal-close" id="favModalClose" type="button" aria-label="닫기">×</button></span>
        </div>
        <div class="fav-modal__body">
          <h2 id="favModalTitle">★ 내 즐겨찾기</h2>
          <div id="favModalContent"></div>
        </div>
      </section>`;
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeFavModal();
    });
    document.getElementById("favModalClose").addEventListener("click", closeFavModal);
  }

  function closeFavModal() {
    const overlay = document.getElementById("favModalOverlay");
    if (overlay) overlay.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function openFavModal() {
    buildFavModal();
    const data = window.TMZ_DATA || { characters: [], items: [] };
    const favs = getFavorites();
    const chars = data.characters.filter((c) => favs.characters.includes(c.id));
    const items = data.items.filter((i) => favs.items.includes(i.id));

    const content = document.getElementById("favModalContent");
    if (!chars.length && !items.length) {
      content.innerHTML = `<p class="fav-modal__empty">아직 즐겨찾기한 캐릭터나 아이템이 없어요. 캐릭터/아이템 카드의 ★ 버튼을 눌러보세요!</p>`;
    } else {
      let html = "";
      if (chars.length) {
        html += `<h3>캐릭터</h3><ul class="fav-list">${chars.map((c) => `<li>${c.img || "🐣"} ${escapeHTML(c.nameKo)} <span class="fav-list__sub">(${escapeHTML(c.nameJa)})</span></li>`).join("")}</ul>`;
      }
      if (items.length) {
        html += `<h3>아이템</h3><ul class="fav-list">${items.map((i) => `<li>🎁 ${escapeHTML(i.nameKo)} <span class="fav-list__sub">(${escapeHTML(i.nameJa)})</span></li>`).join("")}</ul>`;
      }
      content.innerHTML = html;
    }

    document.getElementById("favModalOverlay").hidden = false;
    document.body.classList.add("modal-open");
  }

  function initFavorites() {
    document.getElementById("favToggleBtn")?.addEventListener("click", openFavModal);
  }

  window.TMZ_FAV = { getFavorites, toggleFavorite, isFavorite };

  // ---------------------------------------------------------------------
  // 토스트 알림 (간단 공용)
  // ---------------------------------------------------------------------
  function ensureToast() {
    if (document.getElementById("gToast")) return;
    const toast = document.createElement("div");
    toast.className = "toast window";
    toast.id = "gToast";
    toast.hidden = true;
    toast.setAttribute("role", "status");
    toast.innerHTML = `
      <div class="titlebar titlebar--butter">
        <span class="traffic-lights" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="titlebar__name">NEW_MESSAGE.TXT</span>
      </div>
      <p id="gToastMessage">완료되었습니다.</p>`;
    document.body.appendChild(toast);
  }

  let toastTimer = null;
  function showToast(message) {
    ensureToast();
    const toast = document.getElementById("gToast");
    const msg = document.getElementById("gToastMessage");
    msg.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
  }
  window.TMZ_TOAST = showToast;

  // ---------------------------------------------------------------------
  // 시계
  // ---------------------------------------------------------------------
  function tickClock() {
    const el = document.getElementById("clock");
    if (!el) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    el.textContent = `${hh}:${mm}`;
  }

  // ---------------------------------------------------------------------
  // PWA 등록
  // ---------------------------------------------------------------------
  function registerSW() {
    if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderNav();
    initTheme();
    initFavorites();
    tickClock();
    setInterval(tickClock, 1000 * 30);
    registerSW();
  });
})();
