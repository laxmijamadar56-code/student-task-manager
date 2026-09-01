import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

const API =
  "http://127.0.0.1:8081";

/* =====================================================
   LOGIN
===================================================== */

function Login({ setIsLoggedIn }) {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const navigate =
    useNavigate();

  const handleLogin =
    async (e) => {

      e.preventDefault();

      setMessage("");

      try {

        const response =
          await fetch(
            `${API}/students`
          );

        if (!response.ok) {
          throw new Error(
            "Backend error"
          );
        }

        const students =
          await response.json();

        const student =
          students.find(
            (s) =>
              String(
                s.email
              )
                .trim()
                .toLowerCase() ===
                email
                  .trim()
                  .toLowerCase() &&
              String(
                s.password
              ).trim() ===
                password.trim()
          );

        if (student) {

          localStorage.setItem(
            "isLoggedIn",
            "true"
          );

          localStorage.setItem(
            "studentName",
            student.name
          );

          localStorage.setItem(
            "studentId",
            student.id
          );

          setIsLoggedIn(true);

          navigate(
            "/dashboard"
          );

        } else {

          setMessage(
            "❌ Invalid email or password"
          );
        }

      } catch (error) {

        console.error(error);

        setMessage(
          "❌ Backend connection failed"
        );
      }
    };

  return (

    <div className="page">

      <div className="auth-card">

        <div className="logo">
          🎓
        </div>

        <h1>
          Student Task Manager
        </h1>

        <h2>
          🔐 Student Login
        </h2>

        <form
          onSubmit={handleLogin}
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            required
          />

          <button
            className="main-button"
            type="submit"
          >
            🔐 Login
          </button>

        </form>

        {message && (
          <p className="error">
            {message}
          </p>
        )}

        <p className="small-text">
          New student?
        </p>

        <Link
          className="register-link"
          to="/register"
        >
          📝 Register Student
        </Link>

      </div>

    </div>
  );
}

/* =====================================================
   REGISTER
===================================================== */

function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const navigate =
    useNavigate();

  const handleRegister =
    async (e) => {

      e.preventDefault();

      setMessage("");

      if (!name.trim()) {

        setMessage(
          "❌ Student name is required"
        );

        return;
      }

      if (!email.trim()) {

        setMessage(
          "❌ Email is required"
        );

        return;
      }

      if (!password.trim()) {

        setMessage(
          "❌ Password is required"
        );

        return;
      }

      try {

        const response =
          await fetch(
            `${API}/students`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({
                  name:
                    name.trim(),

                  email:
                    email.trim(),

                  password:
                    password.trim()
                })
            }
          );

        if (!response.ok) {
          throw new Error(
            "Registration failed"
          );
        }

        setMessage(
          "✅ Registration successful!"
        );

        setName("");
        setEmail("");
        setPassword("");

        setTimeout(() => {

          navigate("/login");

        }, 1200);

      } catch (error) {

        console.error(error);

        setMessage(
          "❌ Registration failed. Check backend."
        );
      }
    };

  return (

    <div className="page">

      <div className="auth-card">

        <div className="logo">
          📝
        </div>

        <h1>
          Student Task Manager
        </h1>

        <h2>
          📝 Register Student
        </h2>

        <form
          onSubmit={handleRegister}
        >

          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            required
          />

          <button
            className="main-button"
            type="submit"
          >
            📝 Register Student
          </button>

        </form>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

        <p className="small-text">
          Already registered?
        </p>

        <Link
          className="login-link"
          to="/login"
        >
          🔐 Go to Login
        </Link>

      </div>

    </div>
  );
}

/* =====================================================
   DASHBOARD
===================================================== */

function Dashboard({
  setIsLoggedIn
}) {

  const studentName =
    localStorage.getItem(
      "studentName"
    );

  const navigate =
    useNavigate();

  const [tasks, setTasks] =
    useState([]);

  /* SEARCH */

  const [search, setSearch] =
    useState("");

  /* STATUS FILTER */

  const [
    statusFilter,
    setStatusFilter
  ] = useState("ALL");

  /* PRIORITY FILTER */

  const [
    priorityFilter,
    setPriorityFilter
  ] = useState("ALL");

  /* FORM */

  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription
  ] = useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [priority, setPriority] =
    useState("MEDIUM");

  /* EDIT */

  const [
    editingId,
    setEditingId
  ] = useState(null);

  const [message, setMessage] =
    useState("");

  /* =====================================================
     LOAD TASKS
  ===================================================== */

  const loadTasks = async () => {

    try {

      const response =
        await fetch(
          `${API}/tasks`
        );

      if (!response.ok) {
        throw new Error(
          "Failed to load tasks"
        );
      }

      const data =
        await response.json();

      setTasks(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(error);

      setMessage(
        "❌ Failed to load tasks"
      );
    }
  };

  useEffect(() => {

    loadTasks();

  }, []);

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = () => {

    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem(
      "studentName"
    );

    localStorage.removeItem(
      "studentId"
    );

    setIsLoggedIn(false);

    navigate("/login");
  };

  /* =====================================================
     CLEAR FORM
  ===================================================== */

  const clearForm = () => {

    setTitle("");

    setDescription("");

    setDueDate("");

    setPriority("MEDIUM");

    setEditingId(null);
  };

  /* =====================================================
     ADD / UPDATE
  ===================================================== */

  const saveTask = async (e) => {

    e.preventDefault();

    setMessage("");

    if (!title.trim()) {

      setMessage(
        "❌ Title is required"
      );

      return;
    }

    if (!dueDate) {

      setMessage(
        "❌ Due Date is required"
      );

      return;
    }

    try {

      let response;

      if (
        editingId !== null
      ) {

        response =
          await fetch(
            `${API}/tasks/${editingId}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({

                  title:
                    title.trim(),

                  description:
                    description.trim(),

                  dueDate:
                    dueDate,

                  priority:
                    priority
                      .toUpperCase()

                })
            }
          );

      } else {

        response =
          await fetch(
            `${API}/tasks`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({

                  title:
                    title.trim(),

                  description:
                    description.trim(),

                  dueDate:
                    dueDate,

                  priority:
                    priority
                      .toUpperCase(),

                  status:
                    "PENDING"

                })
            }
          );
      }

      if (!response.ok) {
        throw new Error(
          "Task operation failed"
        );
      }

      if (
        editingId !== null
      ) {

        setMessage(
          "✅ Task updated successfully"
        );

      } else {

        setMessage(
          "✅ Task added successfully"
        );
      }

      clearForm();

      await loadTasks();

    } catch (error) {

      console.error(error);

      setMessage(
        "❌ Task operation failed"
      );
    }
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const editTask = (task) => {

    setEditingId(task.id);

    setTitle(
      task.title || ""
    );

    setDescription(
      task.description || ""
    );

    setDueDate(
      task.dueDate || ""
    );

    setPriority(
      String(
        task.priority ||
          "MEDIUM"
      )
        .trim()
        .toUpperCase()
    );

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const deleteTask = async (id) => {

    if (
      !window.confirm(
        "Are you sure you want to delete this task?"
      )
    ) {
      return;
    }

    try {

      const response =
        await fetch(
          `${API}/tasks/${id}`,
          {
            method: "DELETE"
          }
        );

      if (!response.ok) {
        throw new Error(
          "Delete failed"
        );
      }

      setMessage(
        "🗑️ Task deleted successfully"
      );

      await loadTasks();

    } catch (error) {

      console.error(error);

      setMessage(
        "❌ Failed to delete task"
      );
    }
  };

  /* =====================================================
     STATUS BUTTON
  ===================================================== */

  const changeStatus =
    async (task) => {

      const currentStatus =
        String(
          task.status ||
            "PENDING"
        )
          .trim()
          .toUpperCase();

      const newStatus =
        currentStatus ===
        "COMPLETED"
          ? "PENDING"
          : "COMPLETED";

      try {

        const response =
          await fetch(
            `${API}/tasks/${task.id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({

                  title:
                    task.title || "",

                  description:
                    task.description ||
                    "",

                  dueDate:
                    task.dueDate || "",

                  priority:
                    String(
                      task.priority ||
                        "MEDIUM"
                    )
                      .trim()
                      .toUpperCase(),

                  status:
                    newStatus
                })
            }
          );

        if (!response.ok) {
          throw new Error(
            "Status update failed"
          );
        }

        setMessage(
          `✅ Status changed to ${newStatus}`
        );

        await loadTasks();

      } catch (error) {

        console.error(error);

        setMessage(
          "❌ Failed to change status"
        );
      }
    };

  /* =====================================================
     SEARCH + FILTER
  ===================================================== */

  const filteredTasks =
    tasks.filter((task) => {

      const titleText =
        String(
          task.title || ""
        )
          .trim()
          .toLowerCase();

      const statusText =
        String(
          task.status ||
            "PENDING"
        )
          .trim()
          .toUpperCase();

      const priorityText =
        String(
          task.priority ||
            "MEDIUM"
        )
          .trim()
          .toUpperCase();

      const searchText =
        search
          .trim()
          .toLowerCase();

      const searchMatch =
        searchText === "" ||
        titleText.includes(
          searchText
        );

      const statusMatch =
        statusFilter ===
          "ALL" ||
        statusText ===
          statusFilter;

      const priorityMatch =
        priorityFilter ===
          "ALL" ||
        priorityText ===
          priorityFilter;

      return (
        searchMatch &&
        statusMatch &&
        priorityMatch
      );
    });

  /* =====================================================
     DASHBOARD
  ===================================================== */

  return (

    <div className="dashboard">

      {/* HEADER */}

      <header className="topbar">

        <div>

          <h1>
            🎓 Student Task Manager
          </h1>

          <p>
            Welcome,{" "}
            <strong>
              {studentName}
            </strong>{" "}
            👋
          </p>

        </div>

        <button
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>

      </header>

      {/* MESSAGE */}

      {message && (

        <div className="message-box">
          {message}
        </div>

      )}

      {/* ADD TASK */}

      <section className="box">

        <h2>

          {editingId !== null
            ? "✏️ Edit Task"
            : "➕ Add New Task"}

        </h2>

        <form
          onSubmit={saveTask}
        >

          <input
            type="text"
            placeholder="Task Title *"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />

          <label>
            📅 Due Date *
          </label>

          <input
            type="date"
            value={dueDate}
            onChange={(e) =>
              setDueDate(
                e.target.value
              )
            }
            required
          />

          <label>
            ⭐ Priority
          </label>

          <select
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value
              )
            }
          >

            <option value="LOW">
              LOW
            </option>

            <option value="MEDIUM">
              MEDIUM
            </option>

            <option value="HIGH">
              HIGH
            </option>

          </select>

          <button
            className="add-button"
            type="submit"
          >

            {editingId !== null
              ? "💾 Update Task"
              : "➕ Add Task"}

          </button>

          {editingId !== null && (

            <button
              type="button"
              className="cancel-button"
              onClick={() => {

                clearForm();

                setMessage("");

              }}
            >
              ❌ Cancel
            </button>

          )}

        </form>

      </section>

      {/* SEARCH AND FILTER */}

      <section className="filter-box">

        <input
          className="search"
          type="text"
          placeholder="🔍 Search task..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
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
            setPriorityFilter(
              e.target.value
            )
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

        <button
          className="clear-button"
          type="button"
          onClick={() => {

            setSearch("");

            setStatusFilter(
              "ALL"
            );

            setPriorityFilter(
              "ALL"
            );

          }}
        >
          🔄 Clear
        </button>

      </section>

      {/* TASK LIST */}

      <section className="box">

        <h2>
          📋 My Tasks (
          {filteredTasks.length}
          )
        </h2>

        {filteredTasks.length ===
        0 ? (

          <div className="empty">
            📭 No tasks found.
          </div>

        ) : (

          filteredTasks.map(
            (task) => {

              const status =
                String(
                  task.status ||
                    "PENDING"
                )
                  .trim()
                  .toUpperCase();

              const taskPriority =
                String(
                  task.priority ||
                    "MEDIUM"
                )
                  .trim()
                  .toUpperCase();

              return (

                <div
                  className="task"
                  key={task.id}
                >

                  <h3>
                    {task.title}
                  </h3>

                  {task.description && (

                    <p>
                      {task.description}
                    </p>

                  )}

                  <p>
                    📅 Due Date:{" "}
                    <strong>
                      {task.dueDate}
                    </strong>
                  </p>

                  <p>
                    ⭐ Priority:{" "}
                    <strong>
                      {taskPriority}
                    </strong>
                  </p>

                  <p>
                    📌 Status:{" "}
                    <strong>
                      {status}
                    </strong>
                  </p>

                  {/* YOUR BUTTONS */}

                  <div className="actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        editTask(
                          task
                        )
                      }
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteTask(
                          task.id
                        )
                      }
                    >
                      🗑️ Delete
                    </button>

                    <button
                      className="status-button"
                      onClick={() =>
                        changeStatus(
                          task
                        )
                      }
                    >
                      🔄 Status
                    </button>

                  </div>

                </div>

              );
            }
          )

        )}

      </section>

    </div>
  );
}

/* =====================================================
   APP
===================================================== */

function App() {

  const [
    isLoggedIn,
    setIsLoggedIn
  ] = useState(
    localStorage.getItem(
      "isLoggedIn"
    ) === "true"
  );

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate
                to="/dashboard"
              />
            ) : (
              <Login
                setIsLoggedIn={
                  setIsLoggedIn
                }
              />
            )
          }
        />

        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate
                to="/dashboard"
              />
            ) : (
              <Register />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard
                setIsLoggedIn={
                  setIsLoggedIn
                }
              />
            ) : (
              <Navigate
                to="/login"
              />
            )
          }
        />

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

/* =====================================================
   PINK + SKY BLUE CSS
===================================================== */

const style =
  document.createElement(
    "style"
  );

style.innerHTML = `

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;

  background:
    linear-gradient(
      135deg,
      #ffd6e7,
      #bdefff
    );

  min-height: 100vh;
}

/* AUTH */

.page {
  min-height: 100vh;

  display: flex;

  justify-content: center;

  align-items: center;

  padding: 20px;
}

.auth-card {

  width: 100%;

  max-width: 430px;

  background: white;

  padding: 35px;

  border-radius: 25px;

  text-align: center;

  box-shadow:
    0 10px 30px
    rgba(0,0,0,0.15);

  border-top:
    6px solid #ff69a4;

}

.logo {

  font-size: 55px;

  margin-bottom: 5px;

}

.auth-card h1 {

  color: #e83e8c;

  margin-bottom: 8px;

}

.auth-card h2 {

  color: #42a5df;

}

.auth-card input {

  width: 100%;

  padding: 13px;

  margin:
    8px 0;

  border:
    2px solid #bdefff;

  border-radius: 10px;

  outline: none;

}

.auth-card input:focus {

  border-color:
    #ff69a4;

}

.main-button {

  width: 100%;

  padding: 13px;

  margin-top: 10px;

  border: none;

  border-radius: 10px;

  background:
    linear-gradient(
      90deg,
      #ff69a4,
      #5bc9f5
    );

  color: white;

  font-size: 16px;

  font-weight: bold;

  cursor: pointer;

}

.register-link,
.login-link {

  color: #e83e8c;

  font-weight: bold;

  text-decoration: none;

}

.small-text {

  color: #777;

  margin-bottom: 5px;

}

.error {

  color: #e53935;

  font-weight: bold;

}

.message {

  color: #159957;

  font-weight: bold;

}

/* DASHBOARD */

.dashboard {

  max-width: 1100px;

  margin: auto;

  padding: 20px;

}

.topbar {

  display: flex;

  justify-content:
    space-between;

  align-items:
    center;

  gap: 20px;

  background: white;

  padding: 20px;

  border-radius: 18px;

  margin-bottom: 20px;

  border-left:
    7px solid #ff69a4;

  border-right:
    7px solid #5bc9f5;

  box-shadow:
    0 5px 20px
    rgba(0,0,0,0.1);

}

.topbar h1 {

  margin: 0;

  color: #e83e8c;

}

.topbar p {

  color: #42a5df;

}

.logout-button {

  background: #ff69a4;

  color: white;

  border: none;

  padding:
    11px 20px;

  border-radius: 9px;

  font-weight: bold;

  cursor: pointer;

}

/* BOX */

.box {

  background: white;

  padding: 22px;

  border-radius: 18px;

  margin-bottom: 20px;

  box-shadow:
    0 5px 20px
    rgba(0,0,0,0.08);

}

.box h2 {

  color: #42a5df;

}

.box input,
.box textarea,
.box select {

  width: 100%;

  padding: 12px;

  margin:
    7px 0 15px;

  border:
    2px solid #bdefff;

  border-radius: 9px;

  outline: none;

}

.box input:focus,
.box textarea:focus,
.box select:focus {

  border-color:
    #ff69a4;

}

.box textarea {

  min-height: 90px;

  resize: vertical;

}

.add-button {

  background:
    #5bc9f5;

  color: white;

  border: none;

  padding:
    11px 20px;

  border-radius: 9px;

  font-weight: bold;

  cursor: pointer;

}

.cancel-button {

  background:
    #ffb6d2;

  color: #8b2450;

  border: none;

  padding:
    11px 20px;

  border-radius: 9px;

  margin-left: 8px;

}

/* SEARCH */

.filter-box {

  background: white;

  padding: 18px;

  border-radius: 18px;

  margin-bottom: 20px;

  display: flex;

  gap: 10px;

  flex-wrap: wrap;

  box-shadow:
    0 5px 20px
    rgba(0,0,0,0.08);

}

.filter-box input,
.filter-box select {

  padding: 12px;

  border:
    2px solid #bdefff;

  border-radius: 9px;

  outline: none;

}

.filter-box .search {

  flex: 1;

  min-width: 220px;

}

.clear-button {

  padding:
    10px 16px;

  border: none;

  border-radius: 9px;

  background:
    #ffb6d2;

  color: #8b2450;

  font-weight: bold;

  cursor: pointer;

}

/* MESSAGE */

.message-box {

  background: white;

  padding: 13px;

  border-radius: 10px;

  margin-bottom: 20px;

  color: #e83e8c;

  font-weight: bold;

}

/* TASK */

.task {

  background:
    linear-gradient(
      135deg,
      #fff,
      #f0fbff
    );

  border:
    2px solid #bdefff;

  border-left:
    5px solid #ff69a4;

  padding: 18px;

  margin-bottom: 15px;

  border-radius: 13px;

}

.task h3 {

  color: #e83e8c;

  margin-top: 0;

}

.task p {

  color: #555;

}

/* BUTTONS */

.actions {

  display: flex;

  gap: 8px;

  flex-wrap: wrap;

  margin-top: 15px;

}

.actions button {

  border: none;

  padding:
    9px 14px;

  border-radius: 8px;

  color: white;

  font-weight: bold;

  cursor: pointer;

}

.edit-button {

  background:
    #5bc9f5;

}

.delete-button {

  background:
    #ff5c8a;

}

.status-button {

  background:
    #a56de2;

}

.empty {

  text-align: center;

  padding: 30px;

  color: #888;

}

/* MOBILE */

@media (
  max-width: 600px
) {

  .dashboard {

    padding: 10px;

  }

  .topbar {

    flex-direction:
      column;

    align-items:
      flex-start;

  }

  .filter-box {

    flex-direction:
      column;

  }

  .filter-box input,
  .filter-box select,
  .filter-box button {

    width: 100%;

  }

}

`;

document.head.appendChild(
  style
);

export default App;
