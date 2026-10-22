const STORAGE_KEY = "requests";

function getStoredRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveStoredRequests(requests) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch (_) {}
}

function isRequestSent(profileId) {
  const current = getStoredRequests();
  return current.some(r => Number(r.id) === Number(profileId));
}

function addCollaborationRequest(profile) {
  const current = getStoredRequests();
  if (isRequestSent(profile.id)) {
    return { success: false, reason: "duplicate" };
  }

  const newRequest = {
    id: profile.id,
    name: profile.name,
    role: profile.role,
    niche: profile.niche,
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  current.push(newRequest);
  saveStoredRequests(current);
  return { success: true, request: newRequest };
}

function removeCollaborationRequest(profileId) {
  const current = getStoredRequests();
  const filtered = current.filter(r => Number(r.id) !== Number(profileId));
  saveStoredRequests(filtered);
  return filtered;
}

function clearAllRequests() {
  localStorage.removeItem(STORAGE_KEY);
}

if (typeof window !== "undefined") {
  window.RequestsManager = {
    getAll: getStoredRequests,
    has: isRequestSent,
    add: addCollaborationRequest,
    remove: removeCollaborationRequest,
    clearAll: clearAllRequests
  };
}
