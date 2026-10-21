// sample data (in the project this comes from Module 1 /profiles)
const profiles = [
  { id: 1, name: "Aarav Sharma", role: "creator", niche: "fitness", verified: true },
  { id: 2, name: "GlowUp Cosmetics", role: "brand", niche: "beauty", verified: true },
  { id: 3, name: "Riya Verma", role: "creator", niche: "travel", verified: false },
  { id: 4, name: "TechNest Pvt Ltd", role: "business", niche: "gadgets", verified: true }
];

let requests = JSON.parse(localStorage.getItem("requests") || "[]");

// Operation 1: search + filter profiles
function render() {
  const q = document.getElementById("search").value.toLowerCase();
  const role = document.getElementById("role").value;
  const vOnly = document.getElementById("verifiedOnly").checked;

  const list = profiles.filter(p =>
    (p.name.toLowerCase().includes(q) || p.niche.toLowerCase().includes(q)) &&
    (!role || p.role === role) &&
    (!vOnly || p.verified)
  );

  document.getElementById("results").innerHTML = list.map(p => `
    <div class="card">
      <b>${p.name}</b> (${p.role}) - ${p.niche}
      ${p.verified ? '<span class="badge">✔ Verified</span>' : ''}
      <br><br>
      <button onclick="sendRequest(${p.id})">Send Collaboration Request</button>
    </div>`).join("") || "<p>No profiles found.</p>";
}

// Operation 2: send collaboration request
function sendRequest(id) {
  const p = profiles.find(x => x.id === id);
  if (requests.some(r => r.id === id)) { alert("Request already sent!"); return; }
  requests.push({ id: p.id, name: p.name, status: "Pending" });
  localStorage.setItem("requests", JSON.stringify(requests));
  showRequests();
}

function showRequests() {
  document.getElementById("requests").innerHTML =
    requests.map(r => `<li>${r.name} - ${r.status}</li>`).join("");
}

render();
showRequests();
