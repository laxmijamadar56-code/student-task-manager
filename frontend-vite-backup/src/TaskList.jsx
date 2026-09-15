import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TaskList.css";

function TaskList() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD TASKS
  // =========================
  const loadTasks = () => {
    setLoading(true);

    fetch("http://127.0.0.1:8080/tasks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Tasks from backend:", data);
        setTasks(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("❌ Cannot connect to Spring Boot backend");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // =========================
  // DELETE TASK
  // =========================
  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8080/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      alert("✅ Task deleted successfully!");

      loadTasks();
    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ Failed to delete task");
    }
  };

  // =========================
  // FILTER TASKS
  // =========================
  const filteredTasks = tasks.filter((task) => {
    const title = task.title || "";

    const matchesSearch = title
      .toLowerCase()
      .includes(search.toLowerCase());

    const taskStatus = (task.status || "")
      .toUpperCase()
      .trim();

    const matchesStatus =
      statusFilter === "ALL" ||
      taskStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================
  // STATUS
  // =========================
  const getStatusClass = (status) => {
    const currentStatus = (status || "")
      .toUpperCase()
      .trim();

    if (currentStatus === "COMPLETED") {
      return "status-completed";
    }

    if (
      currentStatus === "IN_PROGRESS" ||
      currentStatus === "IN PROGRESS"
    ) {
      return "status-progress";
    }

    return "status-pending";
  };

  const getStatusText = (status) => {
    const currentStatus = (status || "")
      .toUpperCase()
      .trim();

    if (currentStatus === "COMPLETED") {
      return "Completed";
    }

    if (
      currentStatus === "IN_PROGRESS" ||
      currentStatus === "IN PROGRESS"
    ) {
      return "In Progress";
    }

    return "Pending";
  };

  // =========================
  // PRIORITY
  // =========================
  const getPriorityClass = (priority) => {
    const currentPriority = (priority || "")
      .toUpperCase()
      .trim();

    if (currentPriority === "HIGH") {
      return "priority-high";
    }

    if (currentPriority === "LOW") {
      return "priority-low";
    }

    return "priority-medium";
  };

  // =========================
  // DATE FORMAT
  // =========================
  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="task-list-page">

      {/* =========================
          HEADER
          ========================= */}
      <header className="task-list-header">

        <div className="task-list-brand">

          <div className="task-list-brand-icon">
            ✓
          </div>

          <div>
            <h1>Student Task Manager</h1>
            <p>Stay organized. Stay on track.</p>
          </div>

        </div>

        <button
          className="task-list-dashboard-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

      </header>

      {/* =========================
          MAIN
          ========================= */}
      <main className="task-list-main">

        {/* PAGE TITLE */}
        <div className="task-list-title">

          <div className="task-list-page-icon">
            ☷
          </div>

          <div>
            <p className="task-list-label">
              TASK MANAGEMENT
            </p>

            <h2>My Tasks</h2>

            <p>
              View, search and manage all your academic tasks.
            </p>
          </div>

        </div>

        {/* TOP ACTION */}
        <div className="task-list-actions-top">

          <button
            className="add-task-button"
            onClick={() => navigate("/add-task")}
          >
            <span>＋</span>
            Add New Task
          </button>

        </div>

        {/* SUMMARY */}
        <div className="task-summary-grid">

          <div className="task-summary-card">
            <div className="summary-icon total">
              ☷
            </div>

            <div>
              <span>Total Tasks</span>
              <strong>{tasks.length}</strong>
            </div>
          </div>

          <div className="task-summary-card">
            <div className="summary-icon pending">
              ◷
            </div>

            <div>
              <span>Pending</span>
              <strong>
                {
                  tasks.filter(
                    (task) =>
                      (task.status || "")
                        .toUpperCase()
                        .trim() === "PENDING"
                  ).length
                }
              </strong>
            </div>
          </div>

          <div className="task-summary-card">
            <div className="summary-icon completed">
              ✓
            </div>

            <div>
              <span>Completed</span>
              <strong>
                {
                  tasks.filter(
                    (task) =>
                      (task.status || "")
                        .toUpperCase()
                        .trim() === "COMPLETED"
                  ).length
                }
              </strong>
            </div>
          </div>

        </div>

        {/* SEARCH / FILTER */}
        <div className="task-filter-card">

          <div className="search-box">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search tasks by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
                type="button"
              >
                ×
              </button>
            )}

          </div>

          <div className="filter-box">

            <label htmlFor="statusFilter">
              Status
            </label>

            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="ALL">All Tasks</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">
                In Progress
              </option>
              <option value="COMPLETED">
                Completed
              </option>
            </select>

          </div>

        </div>

        {/* TASK CARD */}
        <section className="task-table-card">

          <div className="task-table-header">

            <div>
              <h3>All Tasks</h3>
              <p>
                Showing {filteredTasks.length} of {tasks.length} tasks
              </p>
            </div>

            <button
              className="refresh-button"
              onClick={loadTasks}
              type="button"
            >
              ↻ Refresh
            </button>

          </div>

          {/* LOADING */}
          {loading ? (
            <div className="task-empty-state">

              <div className="empty-icon">
                ⏳
              </div>

              <h3>Loading tasks...</h3>

              <p>
                Please wait while we fetch your tasks.
              </p>

            </div>
          ) : filteredTasks.length === 0 ? (

            /* NO TASKS */
            <div className="task-empty-state">

              <div className="empty-icon">
                📋
              </div>

              <h3>No tasks found</h3>

              <p>
                {search || statusFilter !== "ALL"
                  ? "Try changing your search or filter."
                  : "You don't have any tasks yet."}
              </p>

              {!search && statusFilter === "ALL" && (
                <button
                  className="empty-add-button"
                  onClick={() => navigate("/add-task")}
                >
                  ＋ Create Your First Task
                </button>
              )}

            </div>

          ) : (

            /* TABLE */
            <div className="task-table-wrapper">

              <table className="task-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Task</th>
                    <th>Description</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredTasks.map((task) => (

                    <tr key={task.id}>

                      <td>
                        <span className="task-id">
                          #{task.id}
                        </span>
                      </td>

                      <td>
                        <div className="task-title-cell">
                          <strong>
                            {task.title || "Untitled Task"}
                          </strong>
                        </div>
                      </td>

                      <td>
                        <div className="task-description">
                          {task.description
                            ? task.description
                            : "No description"}
                        </div>
                      </td>

                      <td>
                        <div className="due-date">
                          <span>📅</span>
                          {formatDate(task.dueDate)}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`priority-badge ${getPriorityClass(
                            task.priority
                          )}`}
                        >
                          {task.priority || "MEDIUM"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            task.status
                          )}`}
                        >
                          <span className="status-dot"></span>
                          {getStatusText(task.status)}
                        </span>
                      </td>

                      <td>

                        <div className="task-action-buttons">

                          <button
                            className="edit-task-button"
                            onClick={() =>
                              navigate(
                                `/edit-task/${task.id}`
                              )
                            }
                            type="button"
                          >
                            ✎
                            <span>Edit</span>
                          </button>

                          <button
                            className="delete-task-button"
                            onClick={() =>
                              deleteTask(task.id)
                            }
                            type="button"
                          >
                            🗑
                            <span>Delete</span>
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

      {/* FOOTER */}
      <footer className="task-list-footer">
        <span>Student Task Manager</span>
        <span>•</span>
        <span>College Mini Project</span>
      </footer>

    </div>
  );
}

export default TaskList;
