(function () {
  let loadedProfiles = [];

  const searchInput = document.getElementById("search");
  const roleSelect = document.getElementById("role");
  const verifiedCheckbox = document.getElementById("verifiedOnly");
  const resultsContainer = document.getElementById("results");
  const requestsContainer = document.getElementById("requests");
  const requestsCountBadge = document.getElementById("requestsCount");
  const filterStats = document.getElementById("filterStats");
  const clearRequestsBtn = document.getElementById("clearRequestsBtn");

  function getInitials(name) {
    if (!name) return "CC";
    return name
      .trim()
      .split(/\s+/)
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

  function getFilteredProfiles() {
    const query = (searchInput.value || "").trim().toLowerCase();
    const role = roleSelect.value;
    const verifiedOnly = verifiedCheckbox.checked;

    return loadedProfiles.filter(p => {
      const nameMatch = (p.name || "").toLowerCase().includes(query);
      const nicheMatch = (p.niche || "").toLowerCase().includes(query);
      const roleMatch = !role || p.role === role;
      const verifiedMatch = !verifiedOnly || Boolean(p.verified);

      return (nameMatch || nicheMatch) && roleMatch && verifiedMatch;
    });
  }

  function renderProfiles() {
    const list = getFilteredProfiles();

    if (filterStats) {
      filterStats.textContent = `Showing ${list.length} of ${loadedProfiles.length} profiles`;
    }

    if (!list.length) {
      resultsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">&#128269;</div>
          <p>No profiles match your search criteria.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = list.map(p => {
      const alreadyRequested = window.RequestsManager.has(p.id);
      const initials = getInitials(p.name);
      const websiteDisplay = p.website ? p.website.replace(/^https?:\/\//, "") : "";

      return `
        <article class="profile-card" data-id="${p.id}">
          <div>
            <div class="card-top">
              <div class="card-avatar">${initials}</div>
              <div class="card-title-group">
                <div class="card-name-row">
                  <h3 class="card-name" title="${p.name}">${p.name}</h3>
                </div>
                <div class="card-badges-row">
                  <span class="badge badge-role-${p.role}">${p.role}</span>
                  ${p.verified
                    ? '<span class="badge badge-verified">&#10004; Verified</span>'
                    : '<span class="badge badge-unverified">Unverified</span>'
                  }
                </div>
              </div>
            </div>

            <div class="card-meta-list">
              <div class="card-meta-row">
                <span class="card-meta-label">Domain</span>
                <span class="card-meta-value">${p.niche || "General"}</span>
              </div>
              <div class="card-meta-row">
                <span class="card-meta-label">Audience</span>
                <span class="card-meta-value">${formatFollowers(p.followers)}</span>
              </div>
              ${p.website ? `
                <div class="card-meta-row">
                  <span class="card-meta-label">Website</span>
                  <span class="card-meta-value">
                    <a href="${p.website}" target="_blank" rel="noopener noreferrer">${websiteDisplay}</a>
                  </span>
                </div>
              ` : ""}
            </div>
          </div>

          <div class="card-action">
            <button
              type="button"
              class="btn-primary ${alreadyRequested ? "btn-disabled" : ""}"
              data-action="send-request"
              data-id="${p.id}"
              ${alreadyRequested ? "disabled" : ""}
            >
              ${alreadyRequested ? "&#10003; Request Sent" : "Send Collaboration Request"}
            </button>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderRequests() {
    const requests = window.RequestsManager.getAll();

    if (requestsCountBadge) {
      requestsCountBadge.textContent = requests.length;
    }

    if (!requests.length) {
      requestsContainer.innerHTML = `
        <div class="empty-state">
          <p>No collaboration requests sent yet.</p>
        </div>
      `;
      return;
    }

    requestsContainer.innerHTML = requests.map(r => `
      <li class="request-item">
        <div class="request-info">
          <span class="request-name">${r.name}</span>
          <div>
            <span class="badge badge-pending">${r.status || "Pending"}</span>
          </div>
        </div>
        <button
          type="button"
          class="btn-ghost-danger"
          data-action="withdraw-request"
          data-id="${r.id}"
          title="Withdraw collaboration request"
        >
          Withdraw
        </button>
      </li>
    `).join("");
  }

  function handleSendRequest(id) {
    const profile = loadedProfiles.find(p => Number(p.id) === Number(id));
    if (!profile) return;

    const result = window.RequestsManager.add(profile);
    if (!result.success) {
      window.showToast("Collaboration request already sent to this profile!", "warning");
      return;
    }

    window.showToast(`Collaboration request sent to ${profile.name}!`);
    renderProfiles();
    renderRequests();
  }

  function handleWithdrawRequest(id) {
    window.RequestsManager.remove(id);
    window.showToast("Collaboration request withdrawn.");
    renderProfiles();
    renderRequests();
  }

  function bindEvents() {
    searchInput.addEventListener("input", renderProfiles);
    roleSelect.addEventListener("change", renderProfiles);
    verifiedCheckbox.addEventListener("change", renderProfiles);

    if (clearRequestsBtn) {
      clearRequestsBtn.addEventListener("click", () => {
        if (!window.RequestsManager.getAll().length) return;
        window.RequestsManager.clearAll();
        window.showToast("All collaboration requests cleared.");
        renderProfiles();
        renderRequests();
      });
    }

    resultsContainer.addEventListener("click", (e) => {
      const button = e.target.closest('button[data-action="send-request"]');
      if (button && !button.disabled) {
        const id = button.getAttribute("data-id");
        handleSendRequest(id);
      }
    });

    requestsContainer.addEventListener("click", (e) => {
      const button = e.target.closest('button[data-action="withdraw-request"]');
      if (button) {
        const id = button.getAttribute("data-id");
        handleWithdrawRequest(id);
      }
    });
  }

  async function init() {
    bindEvents();
    renderRequests();

    loadedProfiles = await window.fetchProfilesWithFallback();
    renderProfiles();
  }

  document.addEventListener("DOMContentLoaded", init);

  window.render = renderProfiles;
  window.sendRequest = handleSendRequest;
  window.showRequests = renderRequests;
})();
