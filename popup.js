const ids = ["enabled","hideOnBlur","hideOnTabSwitch","revealOnFocus"];
const defaults = {enabled:true, hideOnBlur:true, hideOnTabSwitch:true, revealOnFocus:true};

function render(s) {
  ids.forEach(id => document.getElementById(id).checked = !!s[id]);
  document.body.classList.toggle("off", !s.enabled);
  document.getElementById("statusText").textContent =
    s.enabled ? "PassReveal is active" : "PassReveal is paused";
}

chrome.storage.sync.get(defaults, render);

ids.forEach(id => {
  document.getElementById(id).addEventListener("change", (e) => {
    chrome.storage.sync.set({ [id]: e.target.checked }, () => {
      chrome.storage.sync.get(defaults, render);
    });
  });
});
