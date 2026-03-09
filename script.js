function getDefaultHelpers() {
  return [
    { name: "Bence", subject: "Matek", rating: 4.8 },
    { name: "Anna", subject: "Angol", rating: 4.9 },
    { name: "Levi", subject: "Informatika", rating: 4.7 }
  ];
}

function initApp() {
  if (localStorage.getItem("credit") === null) {
    localStorage.setItem("credit", "10");
  }

  if (localStorage.getItem("requests") === null) {
    localStorage.setItem("requests", JSON.stringify([]));
  }

  if (localStorage.getItem("helpers") === null) {
    localStorage.setItem("helpers", JSON.stringify(getDefaultHelpers()));
  }

  if (localStorage.getItem("requestsCount") === null) {
    localStorage.setItem("requestsCount", "0");
  }

  if (localStorage.getItem("helpsCount") === null) {
    localStorage.setItem("helpsCount", "0");
  }

  applyStoredTheme();
  renderCredit();
  renderStats();
  renderHelpers();
  renderRequests();
  checkName();
}

function checkName() {
  const name = localStorage.getItem("userName");
  const modal = document.getElementById("nameModal");

  if (!name) {
    modal.classList.remove("hidden");
    return;
  }

  updateNameUI(name);
}

function saveName() {
  const input = document.getElementById("nameInput");
  const name = input.value.trim();

  if (!name) {
    showToast("Írd be a neved");
    return;
  }

  localStorage.setItem("userName", name);
  document.getElementById("nameModal").classList.add("hidden");
  updateNameUI(name);
  showToast("Szia " + name + "!");
}

function updateNameUI(name) {
  document.getElementById("welcomeText").textContent = "Szia " + name + "!";
  document.getElementById("profileName").textContent = name;
}

function renderCredit() {
  const credit = localStorage.getItem("credit");
  document.getElementById("credit").textContent = credit;
  document.getElementById("homeCredit").textContent = credit;
  document.getElementById("profileCredit").textContent = credit;
}

function renderStats() {
  const requestsCount = localStorage.getItem("requestsCount");
  const helpsCount = localStorage.getItem("helpsCount");

  document.getElementById("homeRequestsCount").textContent = requestsCount;
  document.getElementById("homeHelpsCount").textContent = helpsCount;
  document.getElementById("requestsCount").textContent = requestsCount;
  document.getElementById("helpsCount").textContent = helpsCount;
}

function updateCredit(amount) {
  let credit = parseInt(localStorage.getItem("credit"), 10);
  credit += amount;
  localStorage.setItem("credit", String(credit));
  renderCredit();
}

function renderHelpers() {
  const list = document.getElementById("helperList");
  const helpers = JSON.parse(localStorage.getItem("helpers")) || [];

  list.innerHTML = "";

  if (helpers.length === 0) {
    list.innerHTML = `
      <div class="helper-item">
        <h3>Nincs több segítő</h3>
        <p>Minden segítség teljesítve lett.</p>
      </div>
    `;
    return;
  }

  helpers.forEach((helper, index) => {
    const div = document.createElement("div");
    div.className = "helper-item";
    div.innerHTML = `
      <h3>${helper.name}</h3>
      <p>Tantárgy: ${helper.subject}</p>
      <p>Értékelés: ${helper.rating} / 5</p>
      <button class="primary-btn" onclick="completeHelp(${index})">Segítettem neki</button>
    `;
    list.appendChild(div);
  });
}

function completeHelp(index) {
  updateCredit(2);

  let helpers = JSON.parse(localStorage.getItem("helpers")) || [];
  helpers.splice(index, 1);
  localStorage.setItem("helpers", JSON.stringify(helpers));

  let helpsCount = parseInt(localStorage.getItem("helpsCount"), 10);
  helpsCount += 1;
  localStorage.setItem("helpsCount", String(helpsCount));

  renderHelpers();
  renderStats();
  showToast("+2 kredit");
}

function renderRequests() {
  const list = document.getElementById("requestList");
  const badge = document.getElementById("requestBadge");
  const requests = JSON.parse(localStorage.getItem("requests")) || [];

  badge.textContent = requests.length;
  list.innerHTML = "";

  if (requests.length === 0) {
    list.innerHTML = `
      <div class="request-item">
        <h4>Nincs aktív segítségkérés</h4>
        <p>Még nem lett létrehozva kérés.</p>
      </div>
    `;
    return;
  }

  requests.forEach((request) => {
    const div = document.createElement("div");
    div.className = "request-item";
    div.innerHTML = `
      <h4>${request.subject}</h4>
      <p>${request.description}</p>
    `;
    list.appendChild(div);
  });
}

document.getElementById("requestForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const credit = parseInt(localStorage.getItem("credit"), 10);

  if (credit < 2) {
    showToast("Nincs elég kredit");
    return;
  }

  const subject = document.getElementById("subject").value;
  const description = document.getElementById("description").value.trim();

  const requests = JSON.parse(localStorage.getItem("requests")) || [];
  requests.unshift({ subject, description });
  localStorage.setItem("requests", JSON.stringify(requests));

  let requestsCount = parseInt(localStorage.getItem("requestsCount"), 10);
  requestsCount += 1;
  localStorage.setItem("requestsCount", String(requestsCount));

  updateCredit(-2);
  renderRequests();
  renderStats();

  this.reset();
  showSection("home");
  showToast("Kérés elküldve");
});

function showSection(id, btn = null) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.classList.remove("active");
  });

  if (btn) {
    btn.classList.add("active");
  } else {
    const navButtons = document.querySelectorAll(".nav-btn");
    if (id === "home") navButtons[0].classList.add("active");
    if (id === "request") navButtons[1].classList.add("active");
    if (id === "helpers") navButtons[2].classList.add("active");
    if (id === "profile") navButtons[3].classList.add("active");
  }

  refreshReveal();
}

function refreshReveal() {
  const items = document.querySelectorAll(".section.active .reveal");
  items.forEach((item) => {
    item.style.animation = "none";
    void item.offsetWidth;
    item.style.animation = "";
  });
}

function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function toggleTheme() {
  document.body.classList.toggle("light-mode");

  const theme = document.body.classList.contains("light-mode") ? "light" : "dark";
  localStorage.setItem("theme", theme);
  updateThemeIcon();
}

function applyStoredTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "light") {
    document.body.classList.add("light-mode");
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.getElementById("themeIcon");
  if (!icon) return;
  icon.textContent = document.body.classList.contains("light-mode") ? "☀" : "☾";
}

function resetApp() {
  localStorage.clear();
  location.reload();
}

initApp();
