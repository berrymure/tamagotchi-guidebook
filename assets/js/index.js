(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const data = window.TMZ_DATA;
    if (!data) return;

    const statChar = document.getElementById("statChar");
    const statItem = document.getElementById("statItem");
    const statDict = document.getElementById("statDict");
    if (statChar) statChar.textContent = data.characters.length;
    if (statItem) statItem.textContent = data.items.length;
    if (statDict) statDict.textContent = data.dictionary.length;

    const spotlight = data.characters.find((c) => c.badge === "대표 캐릭터") || data.characters[0];
    const spotlightName = document.getElementById("spotlightName");
    if (spotlight && spotlightName) {
      spotlightName.textContent = `${spotlight.nameKo} (${spotlight.nameJa})`;
    }
  });
})();
