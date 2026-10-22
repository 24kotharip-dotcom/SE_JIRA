function showToast(message, type = "info") {
  let toast = document.getElementById("toastNotification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastNotification";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = `toast ${type === "warning" ? "toast-warning" : ""} toast-visible`;

  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }

  window.toastTimeout = setTimeout(() => {
    toast.classList.remove("toast-visible");
  }, 3200);
}

if (typeof window !== "undefined") {
  window.showToast = showToast;
}
