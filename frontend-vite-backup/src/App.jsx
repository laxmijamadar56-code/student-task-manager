import { useEffect, useState } from "react";
import "./App.css";

const API = "http://192.0.0.4:8082";

function App() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [student, setStudent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "MEDIUM",
    status: "PENDING",
  });

  const [editingTask, setEditingTask] = useState(null);

  // Restore logged-in student
  useEffect(() => {
    const savedStudent = localStorage.getItem("student");

    if (savedStudent) {
      try {
        const saved = JSON.parse(savedStudent);
        setStudent(saved);
        loadMyTasks(saved.id);
      } catch (error) {
        console.error("Saved login error:", error);
        localStorage.removeItem("student");
      }
    }
  }, []);

  // Automatic refresh every 10 seconds
  useEffect(() => {
    if (!student) return;

    const interval = setInterval(() => {
      loadMyTasks(student.id);
    }, 10000);

    return () => clearInterval(interval);
  }, [student]);

  // LOGIN
  async function login(e) {
    e.preventDefault();

    try {
      setMessage("🔐 Logging in...");

      const response = await fetch(`${API}/students/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const text = await response.text();

      console.log("LOGIN STATUS:", response.status);
      console.log("LOGIN RESPONSE:", text);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = JSON.parse(text);

      setStudent(data);
      localStorage.setItem("student", JSON.stringify(data));

      setLoginData({
        email: "",
        password: "",
      });

      setMessage(`👋 Welcome, ${data.name}!`);

      await loadMyTasks(data.id);
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setMessage(
        "❌ Login failed. Check email, password, and backend."
      );
    }
  }

  // LOAD TASKS
  async function loadMyTasks(studentId) {
    try {
      const response = await fetch(`${API}/tasks`);

      const text = await response.text();

      console.log("TASK STATUS:", response.status);
      console.log("TASK RESPONSE:", text);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        throw new Error("Invalid task response");
      }

      // Only show tasks belonging to logged-in student
      const myTasks = data.filter(
        (t) =>
          t.student &&
          String(t.student.id) === String(studentId)
      );

      setTasks(myTasks);
      setMessage("");
    } catch (error) {
      console.error("TASK ERROR:", error);

      setTasks([]);

      setMessage(
        "❌ Failed to load tasks: " + error.message
      );
    }
  }

  // ADD TASK
  async function addTask(e) {
    e.preventDefault();

    if (!student) {
      setMessage("❌ Please login first.");
      return;
    }

    try {
      const taskData = {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        student: {
          id: student.id,
        },
      };

      console.log("ADDING TASK:", taskData);

      const response = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      const text = await response.text();

      console.log("ADD STATUS:", response.status);
      console.log("ADD RESPONSE:", text);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "MEDIUM",
        status: "PENDING",
      });

      setMessage("✅ Task added successfully!");

      await loadMyTasks(student.id);
    } catch (error) {
      console.error("ADD TASK ERROR:", error);

      setMessage(
        "❌ Failed to add task: " + error.message
      );
    }
  }

  // UPDATE TASK
  async function updateTask(e) {
    e.preventDefault();

    if (!editingTask) return;

    try {
      const taskData = {
        title: editingTask.title,
        description: editingTask.description,
        dueDate: editingTask.dueDate,
        priority: editingTask.priority,
        status: editingTask.status,
        student: {
          id: student.id,
        },
      };

      const response = await fetch(
        `${API}/tasks/${editingTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        }
      );

      const text = await response.text();

      console.log("UPDATE STATUS:", response.status);
      console.log("UPDATE RESPONSE:", text);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setEditingTask(null);

      setMessage("✅ Task updated successfully!");

      await loadMyTasks(student.id);
    } catch (error) {
      console.error("UPDATE ERROR:", error);

      setMessage(
        "❌ Failed to update task: " + error.message
      );
    }
  }

  // DELETE TASK
  async function deleteTask(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      const text = await response.text();

      console.log("DELETE STATUS:", response.status);
      console.log("DELETE RESPONSE:", text);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setMessage("✅ Task deleted successfully!");

      await loadMyTasks(student.id);
    } catch (error) {
      console.error("DELETE ERROR:", error);

      setMessage(
        "❌ Failed to delete task: " + error.message
      );
    }
  }

  // LOGOUT
  function logout() {
    localStorage.removeItem("student");

    setStudent(null);
    setTasks([]);
    setEditingTask(null);

    setSearch("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");

    setMessage("");

    setLoginData({
      email: "",
      password: "",
    });
  }

  // SEARCH + FILTER
  const filteredTasks = tasks.filter((t) => {
    const title = t.title || "";

    const matchesSearch = title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      t.status === statusFilter;

    const matchesPriority =
      priorityFilter === "ALL" ||
      t.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  // LOGIN PAGE
  if (!student) {
    return (
      <div className="container">
        <h1>🎓 Student Task Manager</h1>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        <div className="card">
          <h2>🔐 Student Login</h2>

          <form onSubmit={login}>
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  email: e.target.value,
                })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  password: e.target.value,
                })
              }
              required
            />

            <button type="submit">
              🔐 Login
            </button>
          </form>
        </div>

        <div className="card">
          <h2>📝 Register Student</h2>

          <RegisterForm
            onSuccess={() =>
              setMessage(
                "✅ Student registered successfully!"
              )
            }
          />
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="container">
      <h1>🎓 Student Task Manager</h1>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {/* STUDENT INFORMATION */}
      <div className="card">
        <h2>👋 Welcome, {student.name}!</h2>

        <p>
          📧 {student.email}
        </p>

        <button onClick={logout}>
          🚪 Logout
        </button>

        <button
          onClick={() =>
            loadMyTasks(student.id)
          }
        >
          🔄 Refresh My Tasks
        </button>

        <p>
          🔄 Tasks automatically refresh every 10 seconds
        </p>
      </div>

      {/* ADD TASK */}
      <div className="card">
        <h2>➕ Add Task</h2>

        <form onSubmit={addTask}>
          <input
            type="text"
            placeholder="Task title"
            value={task.title}
            onChange={(e) =>
              setTask({
                ...task,
                title: e.target.value,
              })
            }
            required
          />

          <textarea
            placeholder="Description"
            value={task.description}
            onChange={(e) =>
              setTask({
                ...task,
                description: e.target.value,
              })
            }
            required
          />

          <input
            type="date"
            value={task.dueDate}
            onChange={(e) =>
              setTask({
                ...task,
                dueDate: e.target.value,
              })
            }
            required
          />

          <select
            value={task.priority}
            onChange={(e) =>
              setTask({
                ...task,
                priority: e.target.value,
              })
            }
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <select
            value={task.status}
            onChange={(e) =>
              setTask({
                ...task,
                status: e.target.value,
              })
            }
          >
            <option value="PENDING">
              Pending
            </option>

            <option value="COMPLETED">
              Completed
            </option>
          </select>

          <button type="submit">
            ➕ Add Task
          </button>
        </form>
      </div>

      {/* EDIT TASK */}
      {editingTask && (
        <div className="card">
          <h2>✏️ Edit Task</h2>

          <form onSubmit={updateTask}>
            <input
              type="text"
              value={editingTask.title || ""}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  title: e.target.value,
                })
              }
              required
            />

            <textarea
              value={
                editingTask.description || ""
              }
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  description: e.target.value,
                })
              }
              required
            />

            <input
              type="date"
              value={
                editingTask.dueDate || ""
              }
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  dueDate: e.target.value,
                })
              }
              required
            />

            <select
              value={
                editingTask.priority || "MEDIUM"
              }
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  priority: e.target.value,
                })
              }
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            <select
              value={
                editingTask.status || "PENDING"
              }
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  status: e.target.value,
                })
              }
            >
              <option value="PENDING">
                Pending
              </option>

              <option value="COMPLETED">
                Completed
              </option>
            </select>

            <button type="submit">
              💾 Save Changes
            </button>

            <button
              type="button"
              onClick={() =>
                setEditingTask(null)
              }
            >
              ❌ Cancel
            </button>
          </form>
        </div>
      )}

      {/* SEARCH AND FILTER */}
      <div className="card">
        <h2>🔎 Search & Filter</h2>

        <input
          type="text"
          placeholder="Search task by title..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="ALL">
            All Status
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="COMPLETED">
            Completed
          </option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value)
          }
        >
          <option value="ALL">
            All Priority
          </option>

          <option value="LOW">
            Low
          </option>

          <option value="MEDIUM">
            Medium
          </option>

          <option value="HIGH">
            High
          </option>
        </select>
      </div>

      {/* TASK LIST */}
      <div className="card">
        <h2>
          📋 My Tasks ({filteredTasks.length})
        </h2>

        {filteredTasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          filteredTasks.map((t) => (
            <div
              className="task"
              key={t.id}
            >
              <h3>
                {t.title}
              </h3>

              <p>
                {t.description}
              </p>

              <p>
                📅 Due: {t.dueDate}
              </p>

              <p>
                ⭐ Priority: {t.priority}
              </p>

              <p>
                📌 Status: {t.status}
              </p>

              <button
                onClick={() =>
                  setEditingTask({
                    ...t,
                  })
                }
              >
                ✏️ Edit
              </button>

              <button
                onClick={() =>
                  deleteTask(t.id)
                }
              >
                🗑️ Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// REGISTER COMPONENT
function RegisterForm({ onSuccess }) {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  async function register(e) {
    e.preventDefault();

    try {
      setError("");

      const response = await fetch(
        `${API}/students`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const text = await response.text();

      console.log(
        "REGISTER STATUS:",
        response.status
      );

      console.log(
        "REGISTER RESPONSE:",
        text
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      setData({
        name: "",
        email: "",
        password: "",
      });

      onSuccess();
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      setError(
        "❌ Registration failed: " +
          error.message
      );
    }
  }

  return (
    <form onSubmit={register}>
      {error && (
        <p className="error">
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Student name"
        value={data.name}
        onChange={(e) =>
          setData({
            ...data,
            name: e.target.value,
          })
        }
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={data.email}
        onChange={(e) =>
          setData({
            ...data,
            email: e.target.value,
          })
        }
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) =>
          setData({
            ...data,
            password: e.target.value,
          })
        }
        required
      />

      <button type="submit">
        📝 Register Student
      </button>
    </form>
  );
}

export default App;
