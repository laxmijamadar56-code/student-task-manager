import { API_URL } from "./api";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const student = JSON.parse(
    localStorage.getItem("student") || "{}"
  );

  const studentName = student.name || "Student";
  const firstName = studentName.split(" ")[0];

  const loadTasks = () => {
    setLoading(true);

    fetch(`${API_URL}/tasks`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        return response.json();
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error(error);
        alert("Cannot connect to Spring Boot backend");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const pendingTasks = tasks.filter(
    (task) => task.status?.toUpperCase() === "PENDING"
  );

  const inProgressTasks = tasks.filter(
    (task) =>
      task.status?.toUpperCase() === "IN_PROGRESS" ||
      task.status?.toUpperCase() === "IN PROGRESS"
  );

  const completedTasks = tasks.filter(
    (task) => task.status?.toUpperCase() === "COMPLETED"
  );

  const highPriorityTasks = tasks.filter(
    (task) => task.priority?.toUpperCase() === "HIGH"
  );

  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;

    return Math.round(
      (completedTasks.length / tasks.length) * 100
    );
  }, [tasks, completedTasks.length]);

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      loadTasks();
    } catch (error) {
      console.error(error);
      alert("Failed to delete task");
    }
  };

  const changeStatus = async (task) => {
    const currentStatus =
      task.status?.toUpperCase() || "PENDING";

    let newStatus;

    if (currentStatus === "PENDING") {
      newStatus = "IN_PROGRESS";
    } else if (
      currentStatus === "IN_PROGRESS" ||
      currentStatus === "IN PROGRESS"
    ) {
      newStatus = "COMPLETED";
    } else {
      newStatus = "PENDING";
    }

    try {
      const response = await fetch(
        `${API_URL}/tasks/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      loadTasks();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  const getStatus = (status) => {
    const value = status?.toUpperCase();

    if (value === "COMPLETED") {
      return {
        text: "Completed",
        className: "status-completed",
        icon: "✓",
      };
    }

    if (
      value === "IN_PROGRESS" ||
      value === "IN PROGRESS"
    ) {
      return {
        text: "In Progress",
        className: "status-progress",
        icon: "◐",
      };
    }

    return {
      text: "Pending",
      className: "status-pending",
      icon: "○",
    };
  };

  const getPriority = (priority) => {
    const value = priority?.toUpperCase();

    if (value === "HIGH") {
      return {
        text: "High",
        className: "priority-high",
      };
    }

    if (value === "LOW") {
      return {
        text: "Low",
        className: "priority-low",
      };
    }

    return {
      text: "Medium",
      className: "priority-medium",
    };
  };

  const formatDate = (date) => {
    if (!date) return "No date";

    const parts = date.split("-");

    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    return date;
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("student");
    navigate("/");
  };

  return (
    <div className="student-app">

      {/* SIDEBAR */}
      <aside className="student-sidebar">

        <div className="student-brand">
          <div className="brand-logo">
            ✓
          </div>

          <div>
            <h2>TaskFlow</h2>
            <span>STUDENT PORTAL</span>
          </div>
        </div>

        <nav className="student-nav">

          <button className="nav-item active">
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/tasks")}
          >
            <span className="nav-icon">☷</span>
            <span>My Tasks</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/add-task")}
          >
            <span className="nav-icon">＋</span>
            <span>Add Task</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-tip">
            <div className="tip-icon">💡</div>

            <div>
              <strong>Study smart</strong>
              <p>
                Organize your work and stay on top of your academic goals.
              </p>
            </div>
          </div>

          <button
            className="logout-nav"
            onClick={logout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="student-main">

        {/* HEADER */}
        <header className="student-header">

          <div className="welcome-section">

            <div className="eyebrow">
              STUDENT DASHBOARD
            </div>

            <h1>
              Good day, {firstName} <span>👋</span>
            </h1>

            <p>
              Manage your academic tasks and keep your progress on track.
            </p>

          </div>

          <div className="profile-card">

            <div className="profile-avatar">
              {studentName.charAt(0).toUpperCase()}
            </div>

            <div className="profile-details">
              <strong>{studentName}</strong>
              <span>{student.email || "Student Account"}</span>
            </div>

          </div>

        </header>

        {/* STATISTICS */}
        <section className="student-stats">

          <div className="student-stat-card total-card">

            <div className="stat-icon">
              ☷
            </div>

            <div className="stat-content">
              <span>Total Tasks</span>
              <strong>{tasks.length}</strong>
              <small>All your tasks</small>
            </div>

          </div>

          <div className="student-stat-card pending-card">

            <div className="stat-icon">
              ○
            </div>

            <div className="stat-content">
              <span>Pending</span>
              <strong>{pendingTasks.length}</strong>
              <small>Need attention</small>
            </div>

          </div>

          <div className="student-stat-card progress-card-stat">

            <div className="stat-icon">
              ◐
            </div>

            <div className="stat-content">
              <span>In Progress</span>
              <strong>{inProgressTasks.length}</strong>
              <small>Currently working</small>
            </div>

          </div>

          <div className="student-stat-card completed-card">

            <div className="stat-icon">
              ✓
            </div>

            <div className="stat-content">
              <span>Completed</span>
              <strong>{completedTasks.length}</strong>
              <small>Successfully done</small>
            </div>

          </div>

        </section>

        {/* PROGRESS + QUICK ACTIONS */}
        <section className="dashboard-grid">

          {/* PROGRESS */}
          <div className="progress-card">

            <div className="progress-top">

              <div>
                <p className="section-label">
                  YOUR PROGRESS
                </p>

                <h2>
                  Task completion
                </h2>

                <p className="progress-description">
                  Keep going! Every completed task gets you closer to your goals.
                </p>
              </div>

              <div className="progress-circle">
                <strong>{progress}%</strong>
                <span>Done</span>
              </div>

            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="progress-bottom">
              <span>
                {completedTasks.length} of {tasks.length} tasks completed
              </span>

              <span>
                {pendingTasks.length} pending
              </span>
            </div>

          </div>

          {/* QUICK ACTIONS */}
          <div className="quick-actions-card">

            <div>
              <p className="section-label">
                QUICK ACTIONS
              </p>

              <h2>
                What would you like to do?
              </h2>
            </div>

            <div className="quick-buttons">

              <button
                className="quick-add"
                onClick={() => navigate("/add-task")}
              >
                <span>＋</span>

                <div>
                  <strong>Add New Task</strong>
                  <small>Create an academic task</small>
                </div>
              </button>

              <button
                className="quick-view"
                onClick={() => navigate("/tasks")}
              >
                <span>☷</span>

                <div>
                  <strong>View All Tasks</strong>
                  <small>Manage your tasks</small>
                </div>
              </button>

            </div>

          </div>

        </section>

        {/* TASK OVERVIEW */}
        <section className="tasks-card">

          <div className="tasks-card-header">

            <div>
              <p className="section-label">
                TASK OVERVIEW
              </p>

              <h2>
                My Recent Tasks
              </h2>

              <p>
                Stay updated with your latest academic work.
              </p>
            </div>

            <div className="header-actions">

              <div className="task-count">
                {tasks.length} {tasks.length === 1 ? "Task" : "Tasks"}
              </div>

              <button
                className="secondary-btn"
                onClick={() => navigate("/tasks")}
              >
                View All →
              </button>

              <button
                className="primary-btn"
                onClick={() => navigate("/add-task")}
              >
                ＋ Add Task
              </button>

            </div>

          </div>

          {/* LOADING */}
          {loading ? (

            <div className="empty-state">

              <div className="loading-spinner"></div>

              <h3>
                Loading your tasks...
              </h3>

              <p>
                Please wait a moment.
              </p>

            </div>

          ) : tasks.length === 0 ? (

            /* NO TASKS */
            <div className="empty-state">

              <div className="empty-icon">
                ✓
              </div>

              <h3>
                No tasks yet
              </h3>

              <p>
                Create your first academic task and start organizing your work.
              </p>

              <button
                className="primary-btn"
                onClick={() => navigate("/add-task")}
              >
                ＋ Create Your First Task
              </button>

            </div>

          ) : (

            /* TASK TABLE */
            <div className="task-table-wrapper">

              <table className="modern-task-table">

                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {tasks.map((task) => {

                    const status = getStatus(task.status);
                    const priority = getPriority(task.priority);

                    return (
                      <tr key={task.id}>

                        <td>

                          <div className="task-title-cell">

                            <div className="task-mini-icon">
                              ✓
                            </div>

                            <div>
                              <strong>
                                {task.title}
                              </strong>

                              <span>
                                {task.description || "No description added"}
                              </span>
                            </div>

                          </div>

                        </td>

                        <td>

                          <span className="date-text">
                            📅 {formatDate(task.dueDate)}
                          </span>

                        </td>

                        <td>

                          <span
                            className={`badge ${priority.className}`}
                          >
                            {priority.text}
                          </span>

                        </td>

                        <td>

                          <button
                            className={`badge status-button ${status.className}`}
                            onClick={() => changeStatus(task)}
                            title="Click to change status"
                          >
                            {status.icon} {status.text}
                          </button>

                        </td>

                        <td>

                          <div className="table-actions">

                            <button
                              className="icon-action edit"
                              title="Edit Task"
                              onClick={() =>
                                navigate(`/edit-task/${task.id}`)
                              }
                            >
                              ✎
                            </button>

                            <button
                              className="icon-action delete"
                              title="Delete Task"
                              onClick={() => deleteTask(task.id)}
                            >
                              🗑
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* PRODUCTIVITY SUMMARY */}
        <section className="productivity-card">

          <div className="productivity-icon">
            🎯
          </div>

          <div className="productivity-text">
            <strong>
              {progress >= 75
                ? "Excellent work! Keep it up."
                : progress >= 50
                ? "You're making good progress!"
                : progress > 0
                ? "Keep working towards your goals!"
                : "Ready to start your first task?"}
            </strong>

            <span>
              {highPriorityTasks.length} high-priority{" "}
              {highPriorityTasks.length === 1 ? "task" : "tasks"} need your attention.
            </span>
          </div>

          <button
            onClick={() => navigate("/tasks")}
          >
            Manage Tasks →
          </button>

        </section>

        <footer className="student-footer">
          <span>Student Task Manager</span>
          <span>•</span>
          <span>Stay focused, stay productive.</span>
        </footer>

      </main>

    </div>
  );
}

export default Dashboard;
