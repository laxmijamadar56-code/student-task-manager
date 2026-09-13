import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = () => {
    setLoading(true);

    fetch("http://localhost:8080/tasks")
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

  const student = JSON.parse(
    localStorage.getItem("student") || "{}"
  );

  const studentName = student.name || "Student";

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

  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;

    return Math.round(
      (completedTasks.length / tasks.length) * 100
    );
  }, [tasks, completedTasks.length]);

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/tasks/${id}`,
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
    } else if (currentStatus === "IN_PROGRESS") {
      newStatus = "COMPLETED";
    } else {
      newStatus = "PENDING";
    }

    try {
      const response = await fetch(
        `http://localhost:8080/tasks/${task.id}`,
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
          <div className="brand-logo">✓</div>

          <div>
            <h2>TaskFlow</h2>
            <span>STUDENT</span>
          </div>
        </div>

        <nav className="student-nav">

          <button className="nav-item active">
            <span>▦</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/tasks")}
          >
            <span>☷</span>
            My Tasks
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/add-task")}
          >
            <span>＋</span>
            Add Task
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-tip">
            <div>💡</div>
            <strong>Stay productive</strong>
            <p>
              Keep your tasks organized and complete them on time.
            </p>
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

      {/* MAIN */}
      <main className="student-main">

        <header className="student-header">

          <div>
            <p className="eyebrow">STUDENT DASHBOARD</p>

            <h1>
              Good day, {studentName} 👋
            </h1>

            <p className="header-subtitle">
              Here's what's happening with your tasks today.
            </p>
          </div>

          <div className="profile-card">
            <div className="profile-avatar">
              {studentName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{studentName}</strong>
              <span>{student.email || "Student"}</span>
            </div>
          </div>

        </header>

        {/* STATS */}
        <section className="student-stats">

          <div className="student-stat-card">
            <div className="stat-symbol blue">☷</div>
            <div>
              <span>Total Tasks</span>
              <strong>{tasks.length}</strong>
            </div>
          </div>

          <div className="student-stat-card">
            <div className="stat-symbol orange">○</div>
            <div>
              <span>Pending</span>
              <strong>{pendingTasks.length}</strong>
            </div>
          </div>

          <div className="student-stat-card">
            <div className="stat-symbol purple">◐</div>
            <div>
              <span>In Progress</span>
              <strong>{inProgressTasks.length}</strong>
            </div>
          </div>

          <div className="student-stat-card">
            <div className="stat-symbol green">✓</div>
            <div>
              <span>Completed</span>
              <strong>{completedTasks.length}</strong>
            </div>
          </div>

        </section>

        {/* PROGRESS */}
        <section className="progress-card">

          <div className="progress-info">
            <div>
              <p className="section-label">YOUR PROGRESS</p>
              <h2>Task completion</h2>
            </div>

            <strong>{progress}%</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="progress-text">
            {completedTasks.length} of {tasks.length} tasks completed
          </p>

        </section>

        {/* TASKS */}
        <section className="tasks-card">

          <div className="tasks-card-header">

            <div>
              <p className="section-label">TASK OVERVIEW</p>
              <h2>My Tasks</h2>
            </div>

            <div className="header-actions">
              <button
                className="secondary-btn"
                onClick={() => navigate("/tasks")}
              >
                View all
              </button>

              <button
                className="primary-btn"
                onClick={() => navigate("/add-task")}
              >
                + Add Task
              </button>
            </div>

          </div>

          {loading ? (
            <div className="empty-state">
              <div className="empty-icon">⏳</div>
              <h3>Loading tasks...</h3>
              <p>Please wait a moment.</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h3>No tasks yet</h3>
              <p>Create your first task to get started.</p>

              <button
                className="primary-btn"
                onClick={() => navigate("/add-task")}
              >
                + Create Task
              </button>
            </div>
          ) : (
            <div className="task-table-wrapper">

              <table className="modern-task-table">

                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
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
                            <strong>{task.title}</strong>
                            <span>
                              {task.description || "No description"}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className="date-text">
                            {task.dueDate || "No date"}
                          </span>
                        </td>

                        <td>
                          <span className={`badge ${priority.className}`}>
                            {priority.text}
                          </span>
                        </td>

                        <td>
                          <button
                            className={`badge status-button ${status.className}`}
                            onClick={() => changeStatus(task)}
                          >
                            {status.icon} {status.text}
                          </button>
                        </td>

                        <td>
                          <div className="table-actions">

                            <button
                              className="icon-action edit"
                              title="Edit"
                              onClick={() =>
                                navigate(`/edit-task/${task.id}`)
                              }
                            >
                              ✎
                            </button>

                            <button
                              className="icon-action delete"
                              title="Delete"
                              onClick={() => deleteTask(task.id)}
                            >
                              ×
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

        <footer className="student-footer">
          Student Task Manager • Stay focused, stay productive.
        </footer>

      </main>
    </div>
  );
}

export default Dashboard;
