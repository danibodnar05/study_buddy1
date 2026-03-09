function getDefaultHelpers() {
  return [
    { name: "Bence", subject: "Matek", rating: 4.8 },
    { name: "Anna", subject: "Angol", rating: 4.9 },
    { name: "Levi", subject: "Informatika", rating: 4.7 }
  ];
}

function initApp() {
  if (localStorage.getItem("credit") == null) {
    localStorage.setItem("credit", "10");
  }

  if (localStorage.getItem("requests") == null) {
    localStorage.setItem("requests", JSON.stringify([]));
  }

  if (localStorage.getItem("helpers") == null) {
    localStorage.setItem("helpers", JSON.stringify(getDefaultHelpers()));
  }

  applyStoredTheme();
  renderCredit();
  renderHelpers();
  renderRequests();
  checkName();
}

function checkName() {
  const name = localStorage.getItem("userName");

  if (!name) {
    const modal = document.getElementById("nameModal");
    if (modal) {
      modal.classList.remove("hidden");
    }
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

  const modal = document.getElementById("nameModal");
  if (modal) {
    modal.classList.add("hidden");
  }

  updateNameUI(name);
  showToast("Szia " + name + "!");
}

function updateNameUI(name) {
  const welcomeText = document.getElementById("welcomeText");
  const profileName = document.getElementById("profileName");
  const avatarLetter = document.getElementById("avatarLetter");

  if (welcomeText) {
    welcomeText.textContent = "Szia " + name + "!";
  }

  if (profileName) {
    profileName.textContent = name;
  }

  if (avatarLetter) {
    avatarLetter.textContent = name.charAt(0).toUpperCase();
  }
}

function renderCredit() {
  const credit = localStorage.getItem("credit");

  const creditEl = document.getElementById("credit");
  const homeCreditEl = document.getElementById("homeCredit");
  const profileCreditEl = document.getElementById("profileCredit");

  if (creditEl) creditEl.textContent = credit;
  if (homeCreditEl) homeCreditEl.textContent = credit;
  if (profileCreditEl) profileCreditEl.textContent = credit;
}

function updateCredit(amount) {
  let credit = parseInt(localStorage.getItem("credit"), 10);
  credit += amount;
  localStorage.setItem("credit", String(credit));
  renderCredit();
}

function renderHelpers() {
  const list = document.getElementById("helperList");
  if (!list) return;

  let helpers = JSON.parse(localStorage.getItem("helpers")) || [];

  if (helpers.length === 0) {
    list.innerHTML = `
      <div class="helper-item">
        <h3>Nincs több aktív segítő</h3>
        <p>Minden segítség teljesítve lett.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = "";

  helpers.forEach((helper, index) => {
    const div = document.createElement("div");
    div.className = "helper-item";

    div.innerHTML = `
      <h3>${helper.name}</h3>
      <p>Tantárgy: ${helper.subject}</p>
      <p>Értékelés: ${helper.rating} / 5</p>
      <button class="primary-btn" onclick="completeHelp(${index})">
        Segítettem neki
      </button>
    `;

    list.appendChild(div);
  });
}

function completeHelp(index) {
  updateCredit(2);

  let helpers = JSON.parse(localStorage.getItem("helpers")) || [];

  helpers.splice(index, 1);

  localStorage.setItem("helpers", JSON.stringify(helpers));

  renderHelpers();
  showToast("+2 kredit, segítség teljesítve");
}

function renderRequests() {
  const list = document.getElementById("requestList");
  if (!list) return;

  const requests = JSON.parse(localStorage.getItem("requests")) || [];

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

const requestForm = document.getElementById("requestForm");

if (requestForm) {
  requestForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const credit = parseInt(localStorage.getItem("credit"), 10);

    if (credit < 2) {
      showToast("Nincs elég kredit");
      return;
    }

    const subject = document.getElementById("subject").value;
    const description = document.getElementById("description").value;

    const requests = JSON.parse(localStorage.getItem("requests")) || [];

    requests.push({
      subject: subject,
      description: description
    });

    localStorage.setItem("requests", JSON.stringify(requests));

    updateCredit(-2);
    renderRequests();

    this.reset();
    showToast("Kérés elküldve");
  });
}

function showSection(id, btn) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  const activeSection = document.getElementById(id);
  if (activeSection) {
    activeSection.classList.add("active");
  }

  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.classList.remove("active");
  });

  if (btn) {
    btn.classList.add("active");
  }
}

function showToast(text) {
  const toast = document.getElementById("toast");
  if (!toast) return;

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

  if (document.body.classList.contains("light-mode")) {
    icon.textContent = "☀";
  } else {
    icon.textContent = "☾";
  }
}

function resetApp() {
  localStorage.removeItem("credit");
  localStorage.removeItem("requests");
  localStorage.removeItem("helpers");
  localStorage.removeItem("userName");
  localStorage.removeItem("theme");
  location.reload();
}

initApp();
