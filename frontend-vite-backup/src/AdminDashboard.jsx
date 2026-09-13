import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [searchStudent, setSearchStudent] = useState("");
  const [searchTask, setSearchTask] = useState("");

  const API = "http://localhost:8080";

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");

    if (adminLoggedIn !== "true") {
      navigate("/admin-login");
      return;
    }

    loadStudents();
    loadTasks();
  }, [navigate]);

  // Load students
  const loadStudents = async () => {
    try {
      const response = await fetch(`${API}/students`);

      if (!response.ok) {
        throw new Error("Failed to load students");
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Student loading error:", error);
    }
  };

  // Load tasks
  const loadTasks = async () => {
    try {
      const response = await fetch(`${API}/tasks`);

      if (!response.ok) {
        throw new Error("Failed to load tasks");
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Task loading error:", error);
    }
  };

  // Delete student
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API}/students/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setStudents(
          students.filter((student) => student.id !== id)
        );

        alert("Student deleted successfully");
      } else {
        alert("Unable to delete student");
      }
    } catch (error) {
      console.error("Delete student error:", error);
      alert("Backend connection failed");
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API}/tasks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks(
          tasks.filter((task) => task.id !== id)
        );

        alert("Task deleted successfully");
      } else {
        alert("Unable to delete task");
      }
    } catch (error) {
      console.error("Delete task error:", error);
      alert("Backend connection failed");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin-login");
  };

  // Search students
  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email}`
      .toLowerCase()
      .includes(searchStudent.toLowerCase())
  );

  // Search tasks
  const filteredTasks = tasks.filter((task) =>
    `${task.title} ${task.description}`
      .toLowerCase()
      .includes(searchTask.toLowerCase())
  );

  // Task counts
  const pendingTasks = tasks.filter(
    (task) =>
      task.status?.toUpperCase() === "PENDING"
  ).length;

  const completedTasks = tasks.filter(
    (task) =>
      task.status?.toUpperCase() === "COMPLETED"
  ).length;

  return (
    <div className="admin-container">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="brand-icon">🎓</div>

          <div>
            <h2>Task Manager</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav>

          <button
            className="active"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            📊 Dashboard
          </button>

          <button
            onClick={() =>
              document
                .getElementById("students-section")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            👥 Students
          </button>

          <button
            onClick={() =>
              document
                .getElementById("tasks-section")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            📋 Tasks
          </button>

        </nav>

        <button
          className="logout-button"
          onClick={logout}
        >
          🚪 Logout
        </button>

      </aside>


      {/* MAIN CONTENT */}
      <main className="admin-main">

        {/* HEADER */}
        <header className="admin-header">

          <div>
            <h1>Admin Dashboard</h1>

            <p>
              Welcome back, Administrator 👋
            </p>
          </div>

          <div className="admin-profile">
            👨‍💼
            <span>Administrator</span>
          </div>

        </header>


        {/* DASHBOARD CARDS */}
        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              👥
            </div>

            <div>
              <span>Total Students</span>
              <h2>{students.length}</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              📋
            </div>

            <div>
              <span>Total Tasks</span>
              <h2>{tasks.length}</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ⏳
            </div>

            <div>
              <span>Pending Tasks</span>
              <h2>{pendingTasks}</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✅
            </div>

            <div>
              <span>Completed Tasks</span>
              <h2>{completedTasks}</h2>
            </div>

          </div>

        </section>


        {/* STUDENTS TABLE */}
        <section
          className="admin-section"
          id="students-section"
        >

          <div className="section-header">

            <div>
              <h2>
                👥 Student Management
              </h2>

              <p>
                View and manage registered students
              </p>
            </div>

            <input
              type="text"
              placeholder="🔍 Search students..."
              value={searchStudent}
              onChange={(e) =>
                setSearchStudent(e.target.value)
              }
            />

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
                      #{student.id}
                    </td>

                    <td>
                      <strong>
                        {student.name}
                      </strong>
                    </td>

                    <td>
                      {student.email}
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
              <p className="empty-message">
                No students found.
              </p>
            )}

          </div>

        </section>


        {/* TASKS TABLE */}
        <section
          className="admin-section"
          id="tasks-section"
        >

          <div className="section-header">

            <div>
              <h2>
                📋 Task Management
              </h2>

              <p>
                Monitor and manage all student tasks
              </p>
            </div>

            <input
              type="text"
              placeholder="🔍 Search tasks..."
              value={searchTask}
              onChange={(e) =>
                setSearchTask(e.target.value)
              }
            />

          </div>


          <div className="table-container">

            <table>

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

                {filteredTasks.map((task) => (

                  <tr key={task.id}>

                    <td>
                      #{task.id}
                    </td>

                    <td>
                      <strong>
                        {task.title}
                      </strong>
                    </td>

                    <td>
                      {task.description}
                    </td>

                    <td>
                      {task.dueDate}
                    </td>

                    <td>

                      <span className="priority-badge">
                        {task.priority}
                      </span>

                    </td>

                    <td>

                      <span
                        className={
                          task.status?.toUpperCase() ===
                          "COMPLETED"
                            ? "status completed"
                            : "status pending"
                        }
                      >
                        {task.status}
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

                ))}

              </tbody>

            </table>


            {filteredTasks.length === 0 && (
              <p className="empty-message">
                No tasks found.
              </p>
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;
