document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  // chưa login → về login
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  await loadSidebar();
  setActiveMenu();
  loadUser();
});

async function loadSidebar() {
  const sidebar = document.getElementById("sidebar");

  if (!sidebar) return;

  const res = await fetch("/pages/sidebar.html");
  const html = await res.text();

  sidebar.innerHTML = html;
}

function setActiveMenu() {
  const links = document.querySelectorAll(".sidebar a");

  const currentPath = window.location.pathname;

  links.forEach((link) => {
    const linkPath = new URL(link.href).pathname;

    if (currentPath === linkPath) {
      link.classList.add("active");
    }
  });
}

function loadUser() {
  const username = localStorage.getItem("user");

  if (username) {
    document.getElementById("username").innerText =
      JSON.parse(username).username;
  }
}

function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload;
  } catch (err) {
    return null;
  }
}

function checkTokenExpiration() {
  const token = localStorage.getItem("token");

  if (!token) {
    logout();
    return;
  }

  const payload = parseJwt(token);

  if (!payload) {
    logout();
    return;
  }

  const exp = payload.exp * 1000; // JWT exp là seconds
  const now = Date.now();

  if (now >= exp) {
    logout();
  } else {
    const timeout = exp - now;

    setTimeout(() => {
      logout();
    }, timeout);
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/pages/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  checkTokenExpiration();
});
