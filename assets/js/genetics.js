(() => {
  "use strict";

  const escapeHTML = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  document.addEventListener("DOMContentLoaded", () => {
    const data = window.TMZ_DATA;
    if (!data) return;
    const characters = data.characters;

    const selA = document.getElementById("parentA");
    const selB = document.getElementById("parentB");
    const optionsHTML = characters.map((c) => `<option value="${c.id}">${escapeHTML(c.nameKo)} (${escapeHTML(c.nameJa)})</option>`).join("");
    selA.innerHTML = optionsHTML;
    selB.innerHTML = optionsHTML;
    if (characters[1]) selB.value = characters[1].id;

    document.getElementById("calcBtn").addEventListener("click", () => {
      const a = characters.find((c) => c.id === selA.value);
      const b = characters.find((c) => c.id === selB.value);
      if (!a || !b) return;

      // 아주 단순한 예시 로직: 부모와 같은 계열(family) 캐릭터를 우선 후보로,
      // 그 외 캐릭터는 낮은 확률로 등장하는 것으로 가정한 "예시 시뮬레이션"입니다.
      const sameFamily = characters.filter((c) => c.family === a.family || c.family === b.family);
      const pool = sameFamily.length ? sameFamily : characters;
      const others = characters.filter((c) => !pool.includes(c));

      const results = [];
      const mainShare = 80 / pool.length;
      pool.forEach((c) => results.push({ c, prob: mainShare }));

      const hiddenPickCount = Math.min(2, others.length);
      const hiddenShare = hiddenPickCount ? 20 / hiddenPickCount : 0;
      others.slice(0, hiddenPickCount).forEach((c) => results.push({ c, prob: hiddenShare }));

      results.sort((x, y) => y.prob - x.prob);

      const list = document.getElementById("geneResultList");
      list.innerHTML = results.map((r) => `
        <div class="gene-result__item">
          <span style="font-size:22px;">${r.c.img || "🐣"}</span>
          <span>${escapeHTML(r.c.nameKo)} <small style="color:var(--ink-soft);">(${escapeHTML(r.c.nameJa)})</small></span>
          <span class="gene-result__prob">약 ${r.prob.toFixed(0)}%</span>
        </div>`).join("");

      document.getElementById("geneResult").hidden = false;
      window.TMZ_TOAST("자녀 캐릭터를 예측했어요! (예시 시뮬레이션)");
    });
  });
})();
