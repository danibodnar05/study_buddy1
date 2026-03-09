const helpers = [
  { name: "Bence", subject: "Matek", rating: 4.8 },
  { name: "Anna", subject: "Angol", rating: 4.9 },
  { name: "Levi", subject: "Informatika", rating: 4.7 },
  { name: "Nóri", subject: "Történelem", rating: 4.6 }
];

function initApp() {
  if (localStorage.getItem("credit") === null) {
    localStorage.setItem("credit", "10");
  }

  if (localStorage.getItem("requestsCount") === null) {
    localStorage.setItem("requestsCount", "0");
  }

  if (localStorage.getItem("helpsCount") === null) {
    localStorage.setItem("helpsCount", "0");
  }

  if (localStorage.getItem("requests") === null) {
    localStorage.setItem("requests", JSON.stringify([]));
  }

  applyStoredTheme();
  renderCredit();
  renderProfile();
  renderRequests();
  renderHelpers();
  checkName();
}

function checkName() {
  const savedName = localStorage.getItem("userName");

  if (!savedName) {
    document.getElementById("nameModal").classList.remove("hidden");
    return;
  }

  updateNameUI(savedName);
}

function saveName() {
  const input = document.getElementById("nameInput");
  const name = input.value.trim();

  if (!name) {
    showToast("Írd be a neved.");
    return;
  }

  localStorage.setItem("userName", name);
  document.getElementById("nameModal").classList.add("hidden");
  updateNameUI(name);
  showToast(`Szia ${name}!`);
}

function updateNameUI(name) {
  document.getElementById("welcomeText").textContent = `Szia ${name}!`;
  document.getElementById("profileName").textContent = name;
  document.getElementById("avatarLetter").textContent = name.charAt(0).toUpperCase();
}

function renderCredit() {
  const credit = localStorage.getItem("credit");
  document.getElementById("credit").textContent = credit;
  document.getElementById("profileCredit").textContent = credit;
  document.getElementById("homeCredit").textContent = credit;
}

function renderProfile() {
  const requestsCount = localStorage.getItem("requestsCount");
  const helpsCount = localStorage.getItem("helpsCount");

  document.getElementById("requestsCount").textContent = requestsCount;
  document.getElementById("helpsCount").textContent = helpsCount;
  document.getElementById("homeRequestsCount").textContent = requestsCount;
  document.getElementById("homeHelpsCount").textContent = helpsCount;
}

function updateCredit(amount) {
  let credit = parseInt(localStorage.getItem("credit"), 10);
  credit += amount;
  localStorage.setItem("credit", credit.toString());
  renderCredit();
}

function getRequests() {
  return JSON.parse(localStorage.getItem("requests")) || [];
}

function saveRequests(requests) {
  localStorage.setItem("requests", JSON.stringify(requests));
}

function renderRequests() {
  const requestList = document.getElementById("requestList");
  const requestBadge = document.getElementById("requestBadge");
  const requests = getRequests();

  requestBadge.textContent = requests.length;
  requestList.innerHTML = "";

  if (requests.length === 0) {
    requestList.innerHTML = `
      <div class="empty-box">
        Még nincs aktív segítségkérés.
      </div>
    `;
    return;
  }

  requests.forEach((request) => {
    const item = document.createElement("div");
    item.className = "request-item";
    item.innerHTML = `
      <h4>${request.subject} - ${request.topic}</h4>
      <p class="request-meta"><strong>Sürgősség:</strong> ${request.urgency}</p>
      <p>${request.description}</p>
      <button class="danger-btn full-width" onclick="deleteRequest(${request.id})">Törlés</button>
    `;
    requestList.appendChild(item);
  });
}

function deleteRequest(id) {
  const filtered = getRequests().filter((request) => request.id !== id);
  saveRequests(filtered);
  renderRequests();
  showToast("A kérés törölve lett.");
}

function renderHelpers() {
  const helperList = document.getElementById("helperList");
  helperList.innerHTML = "";

  helpers.forEach((helper) => {
    const item = document.createElement("div");
    item.className = "helper-item";
    item.innerHTML = `
      <h3>${helper.name}</h3>
      <p class="helper-meta"><strong>Tantárgy:</strong> ${helper.subject}</p>
      <p class="helper-meta"><strong>Értékelés:</strong> ${helper.rating} / 5</p>
      <button class="primary-btn full-width" onclick="completeHelp('${helper.name}')">
        Segítettem neki
      </button>
    `;
    helperList.appendChild(item);
  });
}

function completeHelp(helperName) {
  updateCredit(2);

  let helpsCount = parseInt(localStorage.getItem("helpsCount"), 10);
  helpsCount += 1;
  localStorage.setItem("helpsCount", helpsCount.toString());

  renderProfile();
  showToast(`${helperName} után +2 kreditet kaptál.`);
}

document.getElementById("requestForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const credit = parseInt(localStorage.getItem("credit"), 10);

  if (credit < 2) {
    showToast("Nincs elég kredited.");
    return;
  }

  const subject = document.getElementById("subject").value;
  const topic = document.getElementById("topic").value.trim();
  const description = document.getElementById("description").value.trim();
  const urgency = document.getElementById("urgency").value;

  const newRequest = {
    id: Date.now(),
    subject,
    topic,
    description,
    urgency
  };

  const requests = getRequests();
  requests.unshift(newRequest);
  saveRequests(requests);

  updateCredit(-2);

  let requestsCount = parseInt(localStorage.getItem("requestsCount"), 10);
  requestsCount += 1;
  localStorage.setItem("requestsCount", requestsCount.toString());

  renderProfile();
  renderRequests();
  this.reset();

  showSection("home");
  showToast("A segítségkérés elmentve. -2 kredit");
});

function showSection(sectionId, clickedButton = null) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  document.getElementById(sectionId).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  if (clickedButton) {
    clickedButton.classList.add("active");
  } else {
    const navButtons = document.querySelectorAll(".nav-btn");
    if (sectionId === "home") navButtons[0].classList.add("active");
    if (sectionId === "request") navButtons[1].classList.add("active");
    if (sectionId === "helpers") navButtons[2].classList.add("active");
    if (sectionId === "profile") navButtons[3].classList.add("active");
  }

  refreshRevealAnimations();
}

function refreshRevealAnimations() {
  const items = document.querySelectorAll(".section.active .reveal");
  items.forEach((item) => {
    item.style.animation = "none";
    void item.offsetWidth;
    item.style.animation = "";
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function toggleTheme() {
  const isLight = document.body.classList.toggle("light-mode");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  updateThemeIcon();
}

function applyStoredTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  const themeIcon = document.getElementById("themeIcon");
  if (!themeIcon) return;

  themeIcon.textContent = document.body.classList.contains("light-mode") ? "☀" : "☾";
}

function resetApp() {
  localStorage.removeItem("credit");
  localStorage.removeItem("requestsCount");
  localStorage.removeItem("helpsCount");
  localStorage.removeItem("requests");
  localStorage.removeItem("userName");
  localStorage.removeItem("theme");
  location.reload();
}

initApp();
