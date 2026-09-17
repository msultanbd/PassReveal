(() => {
  const DEFAULTS = {
    enabled: true,
    hideOnBlur: true,
    hideOnTabSwitch: true,
    revealOnFocus: true
  };

  let settings = { ...DEFAULTS };
  const revealed = new WeakMap();

  chrome.storage.sync.get(DEFAULTS, (stored) => {
    settings = { ...DEFAULTS, ...stored };
    init();
  });

  chrome.storage.onChanged.addListener((changes) => {
    for (const [key, change] of Object.entries(changes)) {
      if (key in settings) settings[key] = change.newValue;
    }
    if (!settings.enabled) hideAll();
  });

  function isPasswordField(el) {
    return el instanceof HTMLInputElement &&
           el.type.toLowerCase() === "password";
  }

  function show(el) {
    if (!settings.enabled || !isPasswordField(el)) return;
    // Preserve the original type so we can restore it exactly.
    if (!revealed.has(el)) revealed.set(el, true);
    try { el.type = "text"; } catch (_) {}
  }

  function hide(el) {
    if (!el) return;
    const wasRevealed = revealed.get(el);
    if (!wasRevealed) return;
    try { el.type = "password"; } catch (_) {}
    revealed.delete(el);
  }

  function hideAll() {
    document.querySelectorAll('input[type="text"]').forEach((el) => {
      if (revealed.has(el)) hide(el);
    });
  }

  function onFocusIn(e) {
    const el = e.target;
    if (settings.enabled && settings.revealOnFocus && isPasswordField(el)) show(el);
  }

  function onFocusOut(e) {
    const el = e.target;
    if (settings.hideOnBlur && revealed.has(el)) {
      // Wait one tick so focus transitions between related controls settle.
      setTimeout(() => {
        if (document.activeElement !== el) hide(el);
      }, 0);
    }
  }

  function init() {
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("focusout", onFocusOut, true);

    // Hide revealed passwords if the page loses visibility.
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && settings.hideOnTabSwitch) hideAll();
    }, true);

    window.addEventListener("pagehide", hideAll, true);

    // Handle password fields created later by React/Vue/etc.
    const observer = new MutationObserver(() => {
      if (!settings.enabled) return;
      // No password values are read or stored. We only watch the DOM.
      // Focus events handle actual reveal, so no action is needed here.
    });
    observer.observe(document.documentElement || document, {
      childList: true,
      subtree: true
    });
  }
})();