const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      message.innerHTML = `
<div class="alert alert-success">
Login successful! Redirecting...
</div>
`;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

        
      setTimeout(() => {
        window.location.href = "/pages/project.html";
      }, 1500);
    } else {
      message.innerHTML = `
<div class="alert alert-danger">
${data.message}
</div>
`;
    }
  } catch (err) {
    console.log(err);
  }
});

function googleLogin() {
  window.location.href = "/api/auth/google";
}

function facebookLogin() {
  window.location.href = "/api/auth/facebook";
}
