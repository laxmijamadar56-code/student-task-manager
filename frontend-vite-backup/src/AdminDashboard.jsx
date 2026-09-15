import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [searchStudent, setSearchStudent] = useState("");
  const [searchTask, setSearchTask] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API = "http://127.0.0.1:8080";

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");

    if (adminLoggedIn !== "true") {
      navigate("/admin-login");
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setRefreshing(true);

      const [studentsResponse, tasksResponse] = await Promise.all([
        fetch(`${API}/students`),
        fetch(`${API}/tasks`),
      ]);

      if (!studentsResponse.ok) {
        throw new Error("Failed to load students");
      }

      if (!tasksResponse.ok) {
        throw new Error("Failed to load tasks");
      }

      const studentsData = await studentsResponse.json();
      const tasksData = await tasksResponse.json();

      setStudents(studentsData);
      setTasks(tasksData);
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API}/students/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setStudents((current) =>
          current.filter((student) => student.id !== id)
        );

        alert("Student deleted successfully.");
      } else {
        alert("Unable to delete student.");
      }
    } catch (error) {
      console.error("Delete student error:", error);
      alert("Backend connection failed.");
    }
  };

  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API}/tasks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((current) =>
          current.filter((task) => task.id !== id)
        );

        alert("Task deleted successfully.");
      } else {
        alert("Unable to delete task.");
      }
    } catch (error) {
      console.error("Delete task error:", error);
      alert("Backend connection failed.");
    }
  };

  const logout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin-login");
  };

  const filteredStudents = students.filter((student) =>
    `${student.name || ""} ${student.email || ""}`
      .toLowerCase()
      .includes(searchStudent.toLowerCase())
  );

  const filteredTasks = tasks.filter((task) =>
    `${task.title || ""} ${task.description || ""} ${
      task.student?.name || ""
    }`
      .toLowerCase()
      .includes(searchTask.toLowerCase())
  );

  const pendingTasks = tasks.filter(
    (task) => task.status?.toUpperCase() === "PENDING"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status?.toUpperCase() === "COMPLETED"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority?.toUpperCase() === "HIGH"
  ).length;

  const mediumPriorityTasks = tasks.filter(
    (task) => task.priority?.toUpperCase() === "MEDIUM"
  ).length;

  const lowPriorityTasks = tasks.filter(
    (task) => task.priority?.toUpperCase() === "LOW"
  ).length;

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
      .slice(0, 5);
  }, [tasks]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="admin-container">

      {/* ================= SIDEBAR ================= */}

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="brand-icon">🎓</div>

          <div className="brand-text">
            <h2>Task Manager</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className="admin-nav">

          <button
            className="active"
            onClick={() => window.scrollTo({
              top: 0,
              behavior: "smooth",
            })}
          >
            📊 <span>Dashboard</span>
          </button>

          <button
            onClick={() => scrollToSection("students-section")}
          >
            👥 <span>Students</span>
          </button>

          <button
            onClick={() => scrollToSection("tasks-section")}
          >
            📋 <span>Tasks</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-info">
            <span>✓</span>
            <div>
              <strong>System Online</strong>
              <small>Backend connected</small>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            🚪 <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div>
            <div className="welcome-label">
              ADMINISTRATION
            </div>

            <h1>Admin Dashboard</h1>

            <p>
              Monitor students, tasks and academic activity.
            </p>
          </div>

          <div className="admin-header-actions">

            <button
              className="refresh-button"
              onClick={loadData}
              disabled={refreshing}
            >
              {refreshing ? "⟳ Updating..." : "↻ Refresh"}
            </button>

            <div className="admin-profile">
              <div className="profile-avatar">
                👨‍💼
              </div>

              <div>
                <strong>Administrator</strong>
                <small>Admin Account</small>
              </div>
            </div>

          </div>

        </header>

        {/* ================= QUICK OVERVIEW ================= */}

        <section className="overview-heading">
          <div>
            <h2>📊 Quick Overview</h2>
            <p>Current student task statistics</p>
          </div>
        </section>

        <section className="stats-grid">

          <div className="stat-card students-stat">
            <div className="stat-icon">👥</div>

            <div className="stat-content">
              <span>Total Students</span>
              <strong>{students.length}</strong>
              <small>Registered students</small>
            </div>
          </div>

          <div className="stat-card tasks-stat">
            <div className="stat-icon">📋</div>

            <div className="stat-content">
              <span>Total Tasks</span>
              <strong>{tasks.length}</strong>
              <small>All academic tasks</small>
            </div>
          </div>

          <div className="stat-card pending-stat">
            <div className="stat-icon">⏳</div>

            <div className="stat-content">
              <span>Pending Tasks</span>
              <strong>{pendingTasks}</strong>
              <small>Need attention</small>
            </div>
          </div>

          <div className="stat-card completed-stat">
            <div className="stat-icon">✅</div>

            <div className="stat-content">
              <span>Completed</span>
              <strong>{completedTasks}</strong>
              <small>Successfully finished</small>
            </div>
          </div>

        </section>

        {/* ================= PROGRESS + PRIORITY ================= */}

        <section className="analytics-grid">

          {/* PROGRESS */}

          <div className="analytics-card">

            <div className="analytics-header">
              <div>
                <h2>📈 Task Progress</h2>
                <p>Overall completion rate</p>
              </div>

              <div className="percentage-circle">
                {completionPercentage}%
              </div>
            </div>

            <div className="progress-area">

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                ></div>
              </div>

              <div className="progress-labels">
                <span>
                  {completedTasks} completed
                </span>

                <span>
                  {pendingTasks} pending
                </span>
              </div>

            </div>

            <div className="progress-message">
              {tasks.length === 0
                ? "No tasks available yet."
                : completionPercentage >= 75
                ? "🎉 Great progress! Most tasks are completed."
                : completionPercentage >= 50
                ? "👍 Good progress! Keep going."
                : "💡 There are several tasks that need attention."}
            </div>

          </div>

          {/* PRIORITY */}

          <div className="analytics-card">

            <div className="analytics-header">
              <div>
                <h2>🎯 Priority Overview</h2>
                <p>Tasks by priority level</p>
              </div>
            </div>

            <div className="priority-list">

              <div className="priority-row">
                <div className="priority-name">
                  <span className="priority-dot high"></span>
                  <span>High Priority</span>
                </div>

                <strong>{highPriorityTasks}</strong>
              </div>

              <div className="priority-bar">
                <div
                  className="priority-high-fill"
                  style={{
                    width: `${
                      tasks.length
                        ? (highPriorityTasks / tasks.length) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

              <div className="priority-row">
                <div className="priority-name">
                  <span className="priority-dot medium"></span>
                  <span>Medium Priority</span>
                </div>

                <strong>{mediumPriorityTasks}</strong>
              </div>

              <div className="priority-bar">
                <div
                  className="priority-medium-fill"
                  style={{
                    width: `${
                      tasks.length
                        ? (mediumPriorityTasks / tasks.length) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

              <div className="priority-row">
                <div className="priority-name">
                  <span className="priority-dot low"></span>
                  <span>Low Priority</span>
                </div>

                <strong>{lowPriorityTasks}</strong>
              </div>

              <div className="priority-bar">
                <div
                  className="priority-low-fill"
                  style={{
                    width: `${
                      tasks.length
                        ? (lowPriorityTasks / tasks.length) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

            </div>

          </div>

        </section>

        {/* ================= QUICK ACTIONS ================= */}

        <section className="quick-actions-section">

          <div className="section-heading">
            <div>
              <h2>⚡ Quick Actions</h2>
              <p>Quickly navigate to important areas</p>
            </div>
          </div>

          <div className="quick-actions">

            <button
              className="quick-action-card"
              onClick={() => scrollToSection("students-section")}
            >
              <div className="quick-action-icon student-action">
                👥
              </div>

              <div>
                <strong>Manage Students</strong>
                <span>View registered students</span>
              </div>

              <b>→</b>
            </button>

            <button
              className="quick-action-card"
              onClick={() => scrollToSection("tasks-section")}
            >
              <div className="quick-action-icon task-action">
                📋
              </div>

              <div>
                <strong>Manage Tasks</strong>
                <span>View and manage tasks</span>
              </div>

              <b>→</b>
            </button>

          </div>

        </section>

        {/* ================= RECENT ACTIVITY ================= */}

        <section className="recent-section">

          <div className="section-heading">
            <div>
              <h2>🕐 Recent Task Activity</h2>
              <p>Latest tasks added to the system</p>
            </div>

            <button
              className="view-all-button"
              onClick={() => scrollToSection("tasks-section")}
            >
              View All →
            </button>
          </div>

          {recentTasks.length === 0 ? (
            <div className="no-activity">
              <div>📭</div>
              <h3>No recent activity</h3>
              <p>No tasks have been added yet.</p>
            </div>
          ) : (
            <div className="activity-list">

              {recentTasks.map((task) => {

                const completed =
                  task.status?.toUpperCase() === "COMPLETED";

                return (
                  <div
                    className="activity-item"
                    key={task.id}
                  >

                    <div
                      className={
                        completed
                          ? "activity-icon completed"
                          : "activity-icon pending"
                      }
                    >
                      {completed ? "✓" : "⏳"}
                    </div>

                    <div className="activity-content">

                      <strong>
                        {task.title || "Untitled Task"}
                      </strong>

                      <span>
                        {task.student?.name
                          ? `Assigned to ${task.student.name}`
                          : "Student task"}
                      </span>

                    </div>

                    <div className="activity-meta">

                      <span
                        className={
                          completed
                            ? "mini-status completed"
                            : "mini-status pending"
                        }
                      >
                        {task.status || "Pending"}
                      </span>

                      <small>
                        #{task.id}
                      </small>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>

        {/* ================= STUDENTS ================= */}

        <section
          className="admin-section"
          id="students-section"
        >

          <div className="section-header">

            <div>
              <div className="section-kicker">
                STUDENT DATABASE
              </div>

              <h2>👥 Student Management</h2>

              <p>
                View and manage registered students
              </p>
            </div>

            <div className="search-wrapper">
              <span>🔍</span>

              <input
                type="text"
                placeholder="Search students..."
                value={searchStudent}
                onChange={(e) =>
                  setSearchStudent(e.target.value)
                }
              />
            </div>

          </div>

          <div className="table-summary">
            <span>
              Showing{" "}
              <strong>{filteredStudents.length}</strong>{" "}
              of{" "}
              <strong>{students.length}</strong>{" "}
              students
            </span>
          </div>

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredStudents.map((student) => (

                  <tr key={student.id}>

                    <td>
                      <span className="id-badge">
                        #{student.id}
                      </span>
                    </td>

                    <td>
                      <div className="student-cell">
                        <div className="student-avatar">
                          {(student.name || "S")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>
                          {student.name}
                        </strong>
                      </div>
                    </td>

                    <td>
                      <span className="email-text">
                        {student.email}
                      </span>
                    </td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteStudent(student.id)
                        }
                      >
                        🗑 Delete
                      </button>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {filteredStudents.length === 0 && (
              <div className="empty-message">
                <div>🔎</div>
                <strong>No students found</strong>
                <span>Try another search.</span>
              </div>
            )}

          </div>

        </section>

        {/* ================= TASKS ================= */}

        <section
          className="admin-section"
          id="tasks-section"
        >

          <div className="section-header">

            <div>
              <div className="section-kicker">
                TASK DATABASE
              </div>

              <h2>📋 Task Management</h2>

              <p>
                Monitor and manage all student tasks
              </p>
            </div>

            <div className="search-wrapper">
              <span>🔍</span>

              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTask}
                onChange={(e) =>
                  setSearchTask(e.target.value)
                }
              />
            </div>

          </div>

          <div className="table-summary">

            <span>
              Showing{" "}
              <strong>{filteredTasks.length}</strong>{" "}
              of{" "}
              <strong>{tasks.length}</strong>{" "}
              tasks
            </span>

          </div>

          <div className="table-container">

            <table className="tasks-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredTasks.map((task) => {

                  const priority =
                    task.priority?.toUpperCase();

                  const status =
                    task.status?.toUpperCase();

                  return (
                    <tr key={task.id}>

                      <td>
                        <span className="id-badge">
                          #{task.id}
                        </span>
                      </td>

                      <td>
                        <strong className="task-title-cell">
                          {task.title}
                        </strong>
                      </td>

                      <td>
                        <span className="description-cell">
                          {task.description || "—"}
                        </span>
                      </td>

                      <td>
                        <span className="date-cell">
                          📅 {task.dueDate || "—"}
                        </span>
                      </td>

                      <td>

                        <span
                          className={`priority-badge ${
                            priority === "HIGH"
                              ? "high"
                              : priority === "LOW"
                              ? "low"
                              : "medium"
                          }`}
                        >
                          {task.priority || "Medium"}
                        </span>

                      </td>

                      <td>

                        <span
                          className={
                            status === "COMPLETED"
                              ? "status completed"
                              : "status pending"
                          }
                        >
                          {task.status || "Pending"}
                        </span>

                      </td>

                      <td>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteTask(task.id)
                          }
                        >
                          🗑 Delete
                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

            {filteredTasks.length === 0 && (
              <div className="empty-message">
                <div>🔎</div>
                <strong>No tasks found</strong>
                <span>Try another search.</span>
              </div>
            )}

          </div>

        </section>

        {/* FOOTER */}

        <footer className="admin-footer">
          <span>🎓 Student Task Manager</span>
          <span>•</span>
          <span>Admin Panel</span>
          <span>•</span>
          <span>College Mini Project</span>
        </footer>

      </main>

      {loading && (
        <div className="dashboard-loading">
          <div className="loading-box">
            <div className="loading-spinner">⟳</div>
            <strong>Loading Dashboard...</strong>
            <span>Fetching students and tasks</span>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
