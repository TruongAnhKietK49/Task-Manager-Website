document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      const message = document.getElementById("message");

      if (res.ok) {
        message.innerHTML = `
        <div class="alert alert-success text-center">
            🎉 <strong>Registration successful!</strong><br>
            Redirecting to login page...
        </div>
    `;

        setTimeout(() => {
          window.location.href = "/pages/login.html";
        }, 2000);
      } else {
        message.innerHTML = `
        <div class="alert alert-danger text-center">
            ❌ <strong>Registration failed!</strong><br>
            ${data.message}
        </div>`;
      }
    } catch (error) {
      console.error(error);
    }
  });
