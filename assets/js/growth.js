(() => {
  "use strict";

  const escapeHTML = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  document.addEventListener("DOMContentLoaded", () => {
    const data = window.TMZ_DATA;
    const mount = document.getElementById("evoTree");
    if (!data || !mount) return;

    const stages = data.growthStages;
    let html = "";
    stages.forEach((stage, idx) => {
      html += `
        <div class="evo-stage">
          <div class="evo-stage__badge">${escapeHTML(stage.ko)}<small>${escapeHTML(stage.ja)}</small></div>
          <div>
            <h3>${escapeHTML(stage.ko)} <small style="font-weight:400;color:var(--ink-soft);">· ${escapeHTML(stage.days)}</small></h3>
            <p>${escapeHTML(stage.desc)}</p>
            <div class="evo-stage__reqs">
              <span>케어미스: ${escapeHTML(stage.requirement.careMiss)}</span>
              <span>행복도: ${escapeHTML(stage.requirement.happiness)}</span>
              <span>친밀도: ${escapeHTML(stage.requirement.closeness)}</span>
            </div>
          </div>
        </div>`;
      if (idx < stages.length - 1) html += `<div class="evo-arrow">↓</div>`;
    });

    mount.innerHTML = html;
  });
})();
