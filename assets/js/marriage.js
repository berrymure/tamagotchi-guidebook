(() => {
  "use strict";

  const escapeHTML = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  document.addEventListener("DOMContentLoaded", () => {
    const data = window.TMZ_DATA;
    if (!data) return;

    const intro = document.getElementById("marriageIntro");
    if (intro) intro.textContent = data.marriage.intro;

    const reqs = document.getElementById("marriageReqs");
    if (reqs) reqs.innerHTML = data.marriage.requirements.map((r) => `<li>${escapeHTML(r)}</li>`).join("");

    const grid = document.getElementById("candidateGrid");
    if (!grid) return;
    grid.innerHTML = data.marriage.candidates.map((cand) => {
      const c = data.characters.find((item) => item.id === cand.id);
      if (!c) return "";
      return `
        <article class="chara-card" style="border-top:6px solid ${c.accent || "var(--pink)"}">
          <div class="chara-card__thumb" style="background:${c.accent || "var(--pink-soft)"}">${c.img || "🐣"}</div>
          <div class="chara-card__body">
            <div class="chara-card__name">${escapeHTML(c.nameKo)}<small>${escapeHTML(c.nameJa)}</small></div>
            <div class="chara-card__meta">${escapeHTML(cand.note)}</div>
            <div class="chara-card__footer">
              <a class="detail-open-btn" href="characters.html">캐릭터 정보 →</a>
            </div>
          </div>
        </article>`;
    }).join("");
  });
})();
