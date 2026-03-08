const helpers = [
  { name: "Bence", subject: "Matek", rating: 4.8 },
  { name: "Anna", subject: "Angol", rating: 4.9 },
  { name: "Levi", subject: "Informatika", rating: 4.7 },
  { name: "Nóri", subject: "Történelem", rating: 4.6 }
];

let currentHelperForRating = "";
let selectedRating = 0;

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

  renderCredit();
  renderProfile();
  renderRequests();
  renderHelpers();
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

function getRequests() {
  return JSON.parse(localStorage.getItem("requests")) || [];
}

function saveRequests(requests) {
  localStorage.setItem("requests", JSON.stringify(requests));
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

function refreshRevealAnimations() {
  const items = document.querySelectorAll(".section.active .reveal");
  items.forEach((item) => {
    item.style.animation = "none";
    void item.offsetWidth;
    item.style.animation = "";
  });
}

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
      <button class="danger-btn" onclick="deleteRequest(${request.id})">Törlés</button>
    `;
    requestList.appendChild(item);
  });
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
      <button class="primary-btn" onclick="completeHelp('${helper.name}')">Segítettem neki</button>
    `;
    helperList.appendChild(item);
  });
}

document.getElementById("requestForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const credit = parseInt(localStorage.getItem("credit"), 10);

  if (credit < 2) {
    showToast("Nincs elég kredited a segítségkéréshez.");
    return;
  }

  const subject = document.getElementById("subject").value;
  const topic = document.getElementById("topic").value;
  const description = document.getElementById("description").value;
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

function deleteRequest(id) {
  const requests = getRequests().filter((request) => request.id !== id);
  saveRequests(requests);
  renderRequests();
  showToast("A kérés törölve lett.");
}

function completeHelp(helperName) {
  updateCredit(2);

  let helpsCount = parseInt(localStorage.getItem("helpsCount"), 10);
  helpsCount += 1;
  localStorage.setItem("helpsCount", helpsCount.toString());

  renderProfile();

  currentHelperForRating = helperName;
  selectedRating = 0;
  updateStars();
  document.getElementById("ratingHelperName").textContent = helperName;
  document.getElementById("ratingModal").classList.remove("hidden");

  showToast(`Segítség rögzítve: ${helperName}. +2 kredit`);
}

function setRating(value) {
  selectedRating = value;
  updateStars();
}

function updateStars() {
  const stars = document.querySelectorAll("#stars span");
  stars.forEach((star, index) => {
    if (index < selectedRating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

function saveRating() {
  if (selectedRating === 0) {
    showToast("Válassz csillagot.");
    return;
  }

  closeRatingModal();
  showToast(`${currentHelperForRating} értékelése elmentve: ${selectedRating}/5`);
}

function closeRatingModal() {
  document.getElementById("ratingModal").classList.add("hidden");
}

function resetApp() {
  localStorage.setItem("credit", "10");
  localStorage.setItem("requestsCount", "0");
  localStorage.setItem("helpsCount", "0");
  localStorage.setItem("requests", JSON.stringify([]));

  renderCredit();
  renderProfile();
  renderRequests();
  closeRatingModal();
  showToast("Az app alaphelyzetbe állítva.");
}

initApp();
