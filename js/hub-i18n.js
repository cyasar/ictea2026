/** Language switcher for hub page (index.html). */
(function () {
  const STORAGE_KEY = "ictea2026-hub-lang";
  let currentLang = localStorage.getItem(STORAGE_KEY) || "en";
  let colabUrlResolved = "";

  function t(key) {
    const pack = window.HUB_I18N?.[currentLang] || window.HUB_I18N.en;
    return pack[key] ?? window.HUB_I18N.en[key] ?? key;
  }

  function applyLanguage(lang) {
    if (!window.HUB_I18N[lang]) lang = "en";
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const text = t(key);
      el.textContent = text;
      if (el.classList.contains("subtitle")) {
        el.style.display = text ? "" : "none";
      }
    });

    updateUrlLabels();

    document.title = t("pageTitle");

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const active = btn.dataset.lang === currentLang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function updateUrlLabels() {
    const webDisplay = document.getElementById("web-url-display");
    const colabDisplay = document.getElementById("colab-url-display");
    if (colabUrlResolved) {
      colabDisplay.textContent = colabUrlResolved;
    } else {
      colabDisplay.textContent = t("colabMissing");
    }
    if (!webDisplay.dataset.resolved) {
      webDisplay.textContent = t("loading");
    }
  }

  function setupLinks() {
    const cfg = window.DEMO_LINKS || {};
    const localWeb = "frontend/index.html";
    const isLocal =
      window.location.protocol === "file:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    let webUrl = cfg.webApp || localWeb;
    if (isLocal || !webUrl.startsWith("http")) {
      webUrl = localWeb;
    }
    colabUrlResolved = cfg.colabTeaching && cfg.colabTeaching !== "YOUR_COLAB_NOTEBOOK_URL"
      ? cfg.colabTeaching
      : "";

    const webLink = document.getElementById("web-link");
    const webDisplay = document.getElementById("web-url-display");
    webLink.href = webUrl;
    webDisplay.textContent = new URL(webUrl, window.location.href).href;
    webDisplay.dataset.resolved = "1";

    const localBanner = document.getElementById("hub-local-banner");
    if (localBanner) {
      localBanner.hidden = window.location.protocol !== "file:";
    }

    const colabLink = document.getElementById("colab-link");
    if (colabUrlResolved) {
      colabLink.href = colabUrlResolved;
      colabLink.onclick = null;
    } else {
      colabLink.href = "#";
      colabLink.onclick = function (e) {
        e.preventDefault();
        alert(t("alertColab"));
      };
    }
    updateUrlLabels();
  }

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
  });

  setupLinks();
  applyLanguage(currentLang);
})();
