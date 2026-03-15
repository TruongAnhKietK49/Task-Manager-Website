const API = "http://localhost:3000/api";
const token = localStorage.getItem("token");

async function api(url) {
  const res = await fetch(API + url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

// LOAD DASHBOARD

async function loadDashboard() {
  try {
    const projects = await api("/projects");

    let totalTasks = 0;
    let inProgress = 0;
    let done = 0;

    const recentTasks = [];

    for (const project of projects) {
      const res = await api(`/tasks?projectId=${project._id}&limit=5`);

      const tasks = res.data || [];

      totalTasks += tasks.length;

      tasks.forEach((task) => {
        if (task.status === "inprogress") inProgress++;

        if (task.status === "done") done++;

        recentTasks.push(task);
      });
    }

    document.getElementById("totalProjects").innerText = projects.length;

    document.getElementById("totalTasks").innerText = totalTasks;

    document.getElementById("inProgressTasks").innerText = inProgress;

    document.getElementById("doneTasks").innerText = done;

    renderRecentTasks(recentTasks);
  } catch (error) {
    console.error("Dashboard error:", error);
  }
}

// RENDER RECENT TASKS

function renderRecentTasks(tasks) {
  const table = document.getElementById("recentTasks");

  table.innerHTML = "";

  tasks.slice(0, 5).forEach((task) => {
    const row = document.createElement("tr");

    row.innerHTML = `

      <td>${task.title}</td>

      <td>${task.status}</td>

      <td>${task.priority}</td>

      <td>${formatDate(task.dueDate)}</td>

    `;

    table.appendChild(row);
  });
}

// FORMAT DATE

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString();
}

loadDashboard();
