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

  renderCredit();
  renderProfile();
  renderHelpers();
}

function renderCredit() {
  const credit = localStorage.getItem("credit");
  document.getElementById("credit").textContent = credit;
  document.getElementById("profileCredit").textContent = credit;
}

function renderProfile() {
  document.getElementById("requestsCount").textContent = localStorage.getItem("requestsCount");
  document.getElementById("helpsCount").textContent = localStorage.getItem("helpsCount");
}

function updateCredit(amount) {
  let credit = parseInt(localStorage.getItem("credit"), 10);
  credit += amount;
  localStorage.setItem("credit", credit);
  renderCredit();
}

function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  document.getElementById(sectionId).classList.add("active");

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  const buttons = document.querySelectorAll(".tab-btn");
  if (sectionId === "home") buttons[0].classList.add("active");
  if (sectionId === "request") buttons[1].classList.add("active");
  if (sectionId === "help") buttons[2].classList.add("active");
  if (sectionId === "profile") buttons[3].classList.add("active");
}

function renderHelpers() {
  const helperList = document.getElementById("helperList");
  helperList.innerHTML = "";

  helpers.forEach((helper) => {
    const item = document.createElement("div");
    item.className = "helper-item";
    item.innerHTML = `
      <h3>${helper.name}</h3>
      <p><strong>Tantárgy:</strong> ${helper.subject}</p>
      <p><strong>Értékelés:</strong> ${helper.rating} / 5</p>
      <button onclick="completeHelp()">Segítettem neki (+2 kredit)</button>
    `;
    helperList.appendChild(item);
  });
}

function completeHelp() {
  updateCredit(2);

  let helpsCount = parseInt(localStorage.getItem("helpsCount"), 10);
  helpsCount += 1;
  localStorage.setItem("helpsCount", helpsCount);
  renderProfile();

  alert("Szuper! Kaptál 2 kreditet a segítségért.");
}

document.getElementById("requestForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let credit = parseInt(localStorage.getItem("credit"), 10);

  if (credit < 2) {
    alert("Nincs elég kredited a segítségkéréshez.");
    return;
  }

  updateCredit(-2);

  let requestsCount = parseInt(localStorage.getItem("requestsCount"), 10);
  requestsCount += 1;
  localStorage.setItem("requestsCount", requestsCount);
  renderProfile();

  alert("A segítségkérés sikeresen rögzítve lett.");
  this.reset();
  showSection("home");
});

function resetApp() {
  localStorage.setItem("credit", "10");
  localStorage.setItem("requestsCount", "0");
  localStorage.setItem("helpsCount", "0");
  renderCredit();
  renderProfile();
  alert("Az alkalmazás alaphelyzetbe lett állítva.");
}

initApp();