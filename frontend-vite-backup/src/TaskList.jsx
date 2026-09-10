import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TaskList() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // =========================
  // LOAD TASKS
  // =========================
  const loadTasks = () => {
    fetch("http://localhost:8081/tasks")
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
        `http://localhost:8081/tasks/${id}`,
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
      console.error(error);
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
  // STATUS DISPLAY
  // =========================
  const getStatusText = (status) => {
    const currentStatus = (status || "")
      .toUpperCase()
      .trim();

    if (currentStatus === "COMPLETED") {
      return "🟢 COMPLETED";
    }

    if (
      currentStatus === "IN_PROGRESS" ||
      currentStatus === "IN PROGRESS"
    ) {
      return "🔵 IN PROGRESS";
    }

    return "🟡 PENDING";
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* =========================
          HEADER
          ========================= */}
      <h1>🎓 Student Task Manager</h1>

      <h2>📋 Task List</h2>

      {/* =========================
          TOP BUTTONS
          ========================= */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => navigate("/add-task")}
          style={{
            padding: "10px 15px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          ➕ Add Task
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "10px 15px",
            cursor: "pointer",
          }}
        >
          ← Dashboard
        </button>
      </div>

      {/* =========================
          SEARCH
          ========================= */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="🔍 Search task by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            maxWidth: "100%",
          }}
        />
      </div>

      {/* =========================
          STATUS FILTER
          ========================= */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          <b>Status: </b>
        </label>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "10px",
            marginLeft: "5px",
          }}
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* =========================
          TASK TABLE
          ========================= */}
      {filteredTasks.length === 0 ? (
        <p>
          ❌ No tasks found.
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            border="1"
            cellPadding="10"
            cellSpacing="0"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
            }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
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
                  <td>{task.id}</td>

                  <td>{task.title}</td>

                  <td>{task.description}</td>

                  <td>{task.dueDate}</td>

                  <td>{task.priority}</td>

                  <td>
                    {getStatusText(task.status)}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        navigate(`/edit-task/${task.id}`)
                      }
                      style={{
                        padding: "7px 12px",
                        marginRight: "8px",
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      style={{
                        padding: "7px 12px",
                        cursor: "pointer",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TaskList;
