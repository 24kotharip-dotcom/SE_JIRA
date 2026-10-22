document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const refreshBtn = document.getElementById("refreshBtn");
  const profilesList = document.getElementById("profilesList");
  const formAlert = document.getElementById("formAlert");
  const toast = document.getElementById("toast");

  function showToast(message) {
    toast.textContent = message;
    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 3000);
  }

  function showAlert(message, type) {
    formAlert.textContent = message;
    formAlert.className = `alert alert-${type}`;
    formAlert.classList.remove("hidden");
    setTimeout(() => {
      formAlert.classList.add("hidden");
    }, 4000);
  }

  function getInitials(name) {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }

  function formatFollowers(count) {
    const num = Number(count) || 0;
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toLocaleString();
  }

  function getTrustColor(score) {
    if (score >= 60) return "trust-high";
    if (score >= 30) return "trust-medium";
    return "trust-low";
  }

  async function loadProfiles() {
    try {
      const response = await fetch("/profiles");
      if (!response.ok) throw new Error("Failed to load profiles");
      const profiles = await response.json();
      renderProfiles(profiles);
    } catch (err) {
      profilesList.innerHTML = `<p class="error-msg">Failed to connect to API: ${err.message}</p>`;
    }
  }

  function renderProfiles(profiles) {
    if (!profiles || profiles.length === 0) {
      profilesList.innerHTML = "<p>No profiles found.</p>";
      return;
    }

    profilesList.innerHTML = profiles.map(p => `
      <div class="profile-card" id="card-${p.id}">
        <div class="profile-header">
          <div class="avatar">${getInitials(p.name)}</div>
          <div class="profile-title-area">
            <h3 class="profile-name">
              ${p.name}
              ${p.verified ? '<span class="verified-icon" title="Verified Credibility">&#10004;</span>' : ''}
            </h3>
            <span class="role-badge role-${p.role}">${p.role}</span>
          </div>
        </div>

        <div class="profile-body">
          <div class="profile-meta-row">
            <span class="profile-meta-label">Niche</span>
            <span>${p.niche || 'General'}</span>
          </div>
          <div class="profile-meta-row">
            <span class="profile-meta-label">Email</span>
            <span>${p.email}</span>
          </div>
          <div class="profile-meta-row">
            <span class="profile-meta-label">Audience</span>
            <span>${formatFollowers(p.followers)}</span>
          </div>
          <div class="profile-meta-row">
            <span class="profile-meta-label">Website</span>
            <span>${p.website ? `<a href="${p.website}" target="_blank" rel="noopener">${p.website.replace(/^https?:\/\//, '')}</a>` : 'None'}</span>
          </div>
        </div>

        <div class="trust-section">
          <div class="trust-header">
            <span>Trust Score</span>
            <span>${p.trust_score}/100</span>
          </div>
          <div class="trust-bar-bg">
            <div class="trust-bar-fill ${getTrustColor(p.trust_score)}" style="width: ${p.trust_score}%"></div>
          </div>
        </div>

        <button
          class="btn btn-verify ${p.verified ? 'verified-state' : ''}"
          data-id="${p.id}"
          ${p.verified ? 'disabled' : ''}
        >
          ${p.verified ? 'Verified & Approved' : 'Evaluate & Verify'}
        </button>
      </div>
    `).join("");

    attachVerifyHandlers();
  }

  function attachVerifyHandlers() {
    document.querySelectorAll(".btn-verify:not(.verified-state)").forEach(button => {
      button.addEventListener("click", async () => {
        const id = button.getAttribute("data-id");
        button.textContent = "Verifying...";
        try {
          const res = await fetch(`/verify/${id}`, { method: "POST" });
          if (!res.ok) throw new Error("Verification failed");
          const updated = await res.json();
          showToast(`Verified ${updated.name}! Trust Score: ${updated.trust_score}`);
          await loadProfiles();
        } catch (err) {
          showToast(`Error: ${err.message}`);
          button.textContent = "Evaluate & Verify";
        }
      });
    });
  }

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      role: document.getElementById("role").value,
      niche: document.getElementById("niche").value.trim(),
      followers: parseInt(document.getElementById("followers").value, 10) || 0,
      website: document.getElementById("website").value.trim(),
    };

    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register profile");
      }

      showAlert(`Profile registered for ${data.name}!`, "success");
      registerForm.reset();
      await loadProfiles();
    } catch (err) {
      showAlert(err.message, "danger");
    }
  });

  refreshBtn.addEventListener("click", loadProfiles);

  loadProfiles();
});
