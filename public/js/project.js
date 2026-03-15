const API = "https://task-manager-website-v2h5.onrender.com/";

const token = localStorage.getItem("token");

// LOAD PROJECTS

async function loadProjects() {
  const res = await fetch(`${API}api/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const projects = await res.json();

  console.log(projects);

  const container = document.getElementById("projectList");

  container.innerHTML = "";

  projects.forEach((project) => {
    const card = document.createElement("div");

    card.className = "col-md-4 mb-3";

    card.innerHTML = `
    <div class="card project-card p-3 h-100">
      
      <button class="delete-btn" data-id="${project._id}">
        🗑
      </button>

      <h5>${project.name}</h5>
      <p class="text-muted">${project.description || ""}</p>

    </div>
  `;

    // click card → mở task
    card.querySelector(".project-card").addEventListener("click", () => {
      window.location.href = `task.html?projectId=${project._id}`;
    });

    // click delete
    card.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();

      deleteProject(project._id);
    });

    container.appendChild(card);
  });
}

// CREATE PROJECT

async function createProject() {
  const name = document.getElementById("projectName").value;
  const description = document.getElementById("projectDesc").value;

  if (!name) {
    alert("Project name required");
    return;
  }

  const res = await fetch(API + "api/projects", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      name,
      description,
    }),
  });

  const data = await res.json();

  console.log(data);

  document.getElementById("projectName").value = "";
  document.getElementById("projectDesc").value = "";

  loadProjects();
}

async function deleteProject(projectId) {
  const confirmDelete = confirm("Delete this project?");

  if (!confirmDelete) return;

  await fetch(`${API}api/projects/${projectId}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  loadProjects();
}

// LOAD WHEN PAGE OPEN

loadProjects();
