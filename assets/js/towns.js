(() => {
  "use strict";

  const escapeHTML = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  document.addEventListener("DOMContentLoaded", () => {
    const data = window.TMZ_DATA;
    const grid = document.getElementById("townGrid");
    if (!data || !grid) return;

    const colors = ["titlebar--pink", "titlebar--lavender", "titlebar--butter"];

    grid.innerHTML = data.towns.map((town, idx) => `
      <article class="window town-card">
        <div class="titlebar ${colors[idx % colors.length]}">
          <span class="traffic-lights" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="titlebar__name">${escapeHTML(town.name.toUpperCase())}</span>
        </div>
        <dl class="town-card__body">
          <dt>🔓 해금 조건</dt><dd>${escapeHTML(town.unlock)}</dd>
          <dt>🏪 상점</dt><dd>${town.shops.map(escapeHTML).join(", ")}</dd>
          <dt>🙋 NPC</dt><dd>${town.npc.map(escapeHTML).join(", ")}</dd>
          <dt>🎁 주요 아이템</dt><dd>${town.items.map(escapeHTML).join(", ")}</dd>
          <dt>📝 비고</dt><dd>${escapeHTML(town.note)}</dd>
        </dl>
      </article>`).join("");
  });
})();
