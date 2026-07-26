(() => {
  "use strict";

  const escapeHTML = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const normalize = (value) => String(value ?? "").normalize("NFKC").toLocaleLowerCase("ko-KR").trim();

  document.addEventListener("DOMContentLoaded", () => {
    const data = window.TMZ_DATA;
    if (!data) return;

    const state = { dir: "ja-ko", category: "all", query: "" };

    const els = {
      switchGroup: document.querySelector(".dict-switch"),
      tabs: document.getElementById("dictTabs"),
      search: document.getElementById("dictSearch"),
      clear: document.getElementById("dictClear"),
      head: document.getElementById("dictHead"),
      body: document.getElementById("dictBody")
    };

    const categories = ["all", ...new Set(data.dictionary.map((d) => d.category))];
    els.tabs.innerHTML = categories.map((cat) =>
      `<button class="tab${cat === "all" ? " is-active" : ""}" data-cat="${escapeHTML(cat)}" type="button">${cat === "all" ? "전체" : escapeHTML(cat)}</button>`
    ).join("");

    els.switchGroup.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-dir]");
      if (!btn) return;
      state.dir = btn.dataset.dir;
      [...els.switchGroup.children].forEach((b) => b.classList.toggle("is-active", b === btn));
      render();
    });

    els.tabs.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-cat]");
      if (!btn) return;
      state.category = btn.dataset.cat;
      [...els.tabs.children].forEach((b) => b.classList.toggle("is-active", b === btn));
      render();
    });

    els.search.addEventListener("input", () => {
      state.query = els.search.value;
      els.clear.hidden = !state.query;
      render();
    });
    els.clear.addEventListener("click", () => {
      els.search.value = "";
      state.query = "";
      els.clear.hidden = true;
      render();
    });

    function filtered() {
      let list = data.dictionary.slice();
      if (state.category !== "all") list = list.filter((d) => d.category === state.category);
      if (state.query) {
        const q = normalize(state.query);
        list = list.filter((d) => normalize(d.ja).includes(q) || normalize(d.ko).includes(q));
      }
      return list;
    }

    function render() {
      const list = filtered();
      const isJaKo = state.dir === "ja-ko";
      els.head.innerHTML = isJaKo
        ? `<th>일본어</th><th>한국어 뜻</th><th>분류</th>`
        : `<th>한국어</th><th>일본어</th><th>분류</th>`;

      els.body.innerHTML = list.length
        ? list.map((d) => isJaKo
            ? `<tr><td><strong>${escapeHTML(d.ja)}</strong></td><td>${escapeHTML(d.ko)}</td><td>${escapeHTML(d.category)}</td></tr>`
            : `<tr><td><strong>${escapeHTML(d.ko)}</strong></td><td>${escapeHTML(d.ja)}</td><td>${escapeHTML(d.category)}</td></tr>`
          ).join("")
        : `<tr><td colspan="3" class="empty-state">검색 결과가 없어요.</td></tr>`;
    }

    render();
  });
})();
