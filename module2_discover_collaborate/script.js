const profiles = [
  {
    id: 1,
    name: "Palak Kothari",
    role: "creator",
    niche: "Full Stack & AI Development",
    followers: 145000,
    website: "https://palakkothari.dev",
    verified: true,
    trust_score: 100
  },
  {
    id: 2,
    name: "Prarthna Aggrawal",
    role: "creator",
    niche: "UI/UX & Brand Design",
    followers: 92000,
    website: "https://prarthna.design",
    verified: true,
    trust_score: 100
  },
  {
    id: 3,
    name: "Virat Kohli",
    role: "creator",
    niche: "Fitness, Athletics & Wellness",
    followers: 271000000,
    website: "https://one8.com",
    verified: true,
    trust_score: 100
  },
  {
    id: 4,
    name: "Rohit Sharma",
    role: "creator",
    niche: "Sports & Cricket",
    followers: 43000000,
    website: "https://rohitsharma.cricket",
    verified: true,
    trust_score: 100
  },
  {
    id: 5,
    name: "Aman Gupta",
    role: "brand",
    niche: "Consumer Electronics & Audio",
    followers: 3800000,
    website: "https://boat-lifestyle.com",
    verified: true,
    trust_score: 100
  },
  {
    id: 6,
    name: "Zomato India",
    role: "brand",
    niche: "Food & Beverage Culture",
    followers: 2500000,
    website: "https://zomato.com",
    verified: true,
    trust_score: 100
  },
  {
    id: 7,
    name: "Sundar Pichai",
    role: "business",
    niche: "Cloud & Enterprise Tech",
    followers: 5400000,
    website: "https://about.google",
    verified: true,
    trust_score: 100
  },
  {
    id: 8,
    name: "Riya Verma",
    role: "creator",
    niche: "Backpacking & Travel",
    followers: 85,
    website: "",
    verified: false,
    trust_score: 0
  }
];

let requests = JSON.parse(localStorage.getItem("requests") || "[]");

function render() {
  const searchInput = document.getElementById("search");
  const roleSelect = document.getElementById("role");
  const verifiedCheckbox = document.getElementById("verifiedOnly");
  const resultsContainer = document.getElementById("results");

  if (!searchInput || !roleSelect || !verifiedCheckbox || !resultsContainer) return;

  const q = searchInput.value.toLowerCase().trim();
  const role = roleSelect.value;
  const vOnly = verifiedCheckbox.checked;

  const list = profiles.filter(p =>
    (p.name.toLowerCase().includes(q) || p.niche.toLowerCase().includes(q)) &&
    (!role || p.role === role) &&
    (!vOnly || p.verified)
  );

  resultsContainer.innerHTML = list.map(p => `
    <div class="card">
      <b>${p.name}</b> (${p.role}) - ${p.niche}
      ${p.verified ? '<span class="badge">&#10004; Verified</span>' : ''}
      <br><br>
      <button onclick="sendRequest(${p.id})">Send Collaboration Request</button>
    </div>`).join("") || "<p>No profiles found.</p>";
}

function sendRequest(id) {
  const p = profiles.find(x => x.id === id);
  if (!p) return;
  if (requests.some(r => r.id === id)) {
    alert("Request already sent!");
    return;
  }
  requests.push({ id: p.id, name: p.name, status: "Pending" });
  localStorage.setItem("requests", JSON.stringify(requests));
  showRequests();
}

function showRequests() {
  const requestsEl = document.getElementById("requests");
  if (!requestsEl) return;
  requestsEl.innerHTML = requests.map(r => `<li>${r.name} - ${r.status}</li>`).join("");
}
