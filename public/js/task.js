const params = new URLSearchParams(window.location.search);
const projectId = params.get("projectId");

if (!projectId) {
  document.body.innerHTML = `
    <div class="container mt-5 text-center">
      <h3>No project selected</h3>
      <p>Please choose a project first</p>
      <a href="project.html" class="btn btn-primary">
        Go to Projects
      </a>
    </div>
  `;
  throw new Error("No projectId");
}

const CONFIG = {
  API: window.location.origin + "/api",
};

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login.html";
}

async function api(path, options = {}) {
  const res = await fetch(`${CONFIG.API}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    ...options,
  });

  return res.json();
}

const columns = {
  todo: "todoColumn",
  "in-progress": "progressColumn",
  review: "reviewColumn",
  completed: "doneColumn",
};

async function loadTasks() {
  const res = await api(`/tasks?projectId=${projectId}`);

  console.log("Loaded Tasks:", res);

  renderTasks(res.data);
  enableDrag();
}

async function loadMembers() {
  const members = await api(`/projects/${projectId}/members`);

  const select = document.getElementById("taskAssignee");

  select.innerHTML = `<option value="">Unassigned</option>`;

  members.forEach((user) => {
    select.innerHTML += `<option value="${user._id}">${user.username}</option>`;
  });
}

function renderTasks(tasks) {
  document.getElementById("todoColumn").innerHTML = "<h6>📋 To Do</h6>";
  document.getElementById("progressColumn").innerHTML =
    "<h6>⏳ In Progress</h6>";
  document.getElementById("reviewColumn").innerHTML = "<h6>👀 Review</h6>";
  document.getElementById("doneColumn").innerHTML = "<h6>✅ Done</h6>";

  tasks.forEach((task) => {
    const card = document.createElement("div");

    card.className = "task-card";

    Object.assign(card.dataset, {
      id: task._id,
      title: task.title,
      description: task.description || "",
      priority: task.priority || "",
      status: task.status || "",
      assignee: task.userId?._id || "",
      startDate: task.startDate || "",
      dueDate: task.dueDate || "",
    });

    const assigneeName = task.userId?.username || "Unassigned";

    card.innerHTML = `
      <strong>${task.title}</strong>
      <p class="small text-muted">${task.description || ""}</p>
      ${getPriorityBadge(task.priority)}
      <div class="small text-primary">
        👤 ${assigneeName}
      </div>
      <div class="small text-secondary">
        📅 ${formatDate(task.dueDate)}
      </div>
    `;

    card.onclick = () => openTaskModal(card);

    document.getElementById(columns[task.status]).appendChild(card);
  });
}

function openTaskModal(card) {
  taskTitle.innerText = card.dataset.title;
  taskDescription.value = card.dataset.description;

  taskAssignee.value = card.dataset.assignee;
  taskPriority.value = card.dataset.priority;
  taskStatus.value = card.dataset.status;

  taskStartDate.value = card.dataset.startDate
    ? card.dataset.startDate.substring(0, 10)
    : "";

  taskDueDate.value = card.dataset.dueDate
    ? card.dataset.dueDate.substring(0, 10)
    : "";

  taskModal.dataset.id = card.dataset.id;

  new bootstrap.Modal(taskModal).show();
}

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
}

function getPriorityBadge(priority) {
  if (priority === "high") return `<span class="badge bg-danger">High</span>`;
  if (priority === "medium")
    return `<span class="badge bg-warning">Medium</span>`;
  if (priority === "low") return `<span class="badge bg-success">Low</span>`;
  return "";
}

function enableDrag() {
  Object.values(columns).forEach((id) => {
    new Sortable(document.getElementById(id), {
      group: "tasks",
      animation: 150,

      onEnd: function (evt) {
        const taskId = evt.item.dataset.id;
        const newStatus = getStatusFromColumn(evt.to.id);

        evt.item.dataset.status = newStatus;

        updateTaskStatus(taskId, newStatus);
      },
    });
  });
}

function getStatusFromColumn(columnId) {
  return Object.keys(columns).find((key) => columns[key] === columnId);
}

async function updateTaskStatus(taskId, status) {
  await api(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

document.getElementById("newTaskBtn").addEventListener("click", () => {
  new bootstrap.Modal(createTaskModal).show();
});

async function createTask() {
  const data = {
    title: newTaskTitle.value,
    description: newTaskDesc.value,
    projectId,
  };

  const res = await api("/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res) {
    loadTasks();
    bootstrap.Modal.getInstance(createTaskModal).hide();
  }
}

function editTitle() {
  taskTitle.contentEditable = true;
  taskTitle.focus();
}

function editDescription() {
  taskDescription.disabled = false;
  taskDescription.focus();
}

async function saveTask() {
  const taskId = taskModal.dataset.id;

  const data = {
    title: taskTitle.innerText,
    description: taskDescription.value,
    userId: taskAssignee.value || null,
    priority: taskPriority.value,
    status: taskStatus.value,
    startDate: taskStartDate.value,
    dueDate: taskDueDate.value,
    projectId,
  };

  await api(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  updateCardUI(taskId, data);

  bootstrap.Modal.getInstance(taskModal).hide();
}

function updateCardUI(taskId, data) {
  const card = document.querySelector(`[data-id="${taskId}"]`);

  if (!card) return;

  const assigneeName =
    taskAssignee.options[taskAssignee.selectedIndex]?.text || "Unassigned";

  Object.assign(card.dataset, {
    title: data.title,
    description: data.description,
    priority: data.priority,
    status: data.status,
    assignee: data.userId || "",
    startDate: data.startDate || "",
    dueDate: data.dueDate || "",
  });

  card.innerHTML = `
      <strong>${data.title}</strong>
      <p class="small text-muted">${data.description || ""}</p>
      ${getPriorityBadge(data.priority)}
      <div class="small text-primary">
        👤 ${assigneeName}
      </div>
      <div class="small text-secondary">
        📅 ${formatDate(data.dueDate)}
      </div>
    `;

  moveCardToColumn(card, data.status);
}

function moveCardToColumn(card, status) {
  document.getElementById(columns[status]).appendChild(card);
}

async function deleteTask() {
  const taskId = taskModal.dataset.id;

  await api(`/tasks/${taskId}`, {
    method: "DELETE",
  });

  document.querySelector(`[data-id="${taskId}"]`)?.remove();

  bootstrap.Modal.getInstance(taskModal).hide();
}

loadMembers();
loadTasks();
enableDrag();
