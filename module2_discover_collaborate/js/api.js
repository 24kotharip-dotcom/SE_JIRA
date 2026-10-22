const API_ENDPOINT = "http://127.0.0.1:5000/profiles";

async function fetchProfilesWithFallback() {
  const statusIndicator = document.getElementById("connectionStatus");
  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const response = await fetch(API_ENDPOINT, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        if (statusDot && statusText) {
          statusDot.classList.add("status-connected");
          statusText.textContent = "Connected to Module 1 API";
        }
        return data;
      }
    }
  } catch (_) {
  }

  if (statusDot && statusText) {
    statusDot.classList.remove("status-connected");
    statusText.textContent = "Standalone Data Mode";
  }

  return window.DEFAULT_PROFILES || [];
}

if (typeof window !== "undefined") {
  window.fetchProfilesWithFallback = fetchProfilesWithFallback;
}
