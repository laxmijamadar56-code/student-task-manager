import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

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
        setTasks(data);
      })
      .catch((error) => {
        console.error(error);
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
    if (!window.confirm("Are you sure you want to delete this task?")) {
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
  // CHANGE STATUS
  // =========================
  const changeStatus = async (task) => {
    let newStatus;

    if (task.status === "PENDING") {
      newStatus = "IN_PROGRESS";
    } else if (task.status === "IN_PROGRESS") {
      newStatus = "COMPLETED";
    } else {
      newStatus = "PENDING";
    }

    try {
      const response = await fetch(
        `http://localhost:8081/tasks/${task.id}`,
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
      alert("❌ Failed to update status");
    }
  };

  // =========================
  // STATUS TEXT
  // =========================
  const getStatusButton = (status) => {
    if (status === "COMPLETED") {
      return "🟢 COMPLETED";
    }

    if (status === "IN_PROGRESS") {
      return "🔵 IN PROGRESS";
    }

    return "🟡 PENDING";
  };

  // =========================
  // STATUS COLOR
  // =========================
  const getStatusStyle = (status) => {
    if (status === "COMPLETED") {
      return {
        backgroundColor: "#90EE90",
        color: "#14532D",
      };
    }

    if (status === "IN_PROGRESS") {
      return {
        backgroundColor: "#87CEEB",
        color: "#075985",
      };
    }

    return {
      backgroundColor: "#FFE082",
      color: "#854D0E",
    };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F8FBFF",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          backgroundColor: "#87CEEB",
          padding: "25px",
          borderRadius: "15px",
          textAlign: "center",
          marginBottom: "25px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#075985",
          }}
        >
          🎓 Student Task Manager
        </h1>

        <h2
          style={{
            marginBottom: 0,
            color: "#831843",
          }}
        >
          📊 Dashboard
        </h2>
      </div>

      {/* TOP BUTTONS */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        <button
          onClick={() => navigate("/add-task")}
          style={{
            backgroundColor: "#87CEEB",
            color: "#075985",
            border: "none",
            borderRadius: "8px",
            padding: "12px 18px",
            margin: "5px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ➕ Add Task
        </button>

        <button
          onClick={() => navigate("/tasks")}
          style={{
            backgroundColor: "#F9A8D4",
            color: "#831843",
            border: "none",
            borderRadius: "8px",
            padding: "12px 18px",
            margin: "5px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          📋 Task List
        </button>

        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#F472B6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px 18px",
            margin: "5px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* TASK SECTION */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
          overflowX: "auto",
        }}
      >
        <h2
          style={{
            color: "#075985",
            borderBottom: "3px solid #F9A8D4",
            paddingBottom: "10px",
          }}
        >
          📝 All Tasks
        </h2>

        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#87CEEB",
                  color: "#075985",
                }}
              >
                <th style={{ padding: "12px" }}>No.</th>
                <th style={{ padding: "12px" }}>Title</th>
                <th style={{ padding: "12px" }}>Description</th>
                <th style={{ padding: "12px" }}>Due Date</th>
                <th style={{ padding: "12px" }}>Priority</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task, index) => (
                <tr
                  key={task.id}
                  style={{
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  <td style={{ padding: "12px" }}>
                    {index + 1}
                  </td>

                  <td style={{ padding: "12px", fontWeight: "bold" }}>
                    {task.title}
                  </td>

                  <td style={{ padding: "12px" }}>
                    {task.description}
                  </td>

                  <td style={{ padding: "12px" }}>
                    {task.dueDate}
                  </td>

                  <td style={{ padding: "12px" }}>
                    {task.priority}
                  </td>

                  {/* STATUS */}
                  <td style={{ padding: "12px" }}>
                    <button
                      onClick={() => changeStatus(task)}
                      style={{
                        ...getStatusStyle(task.status),
                        border: "none",
                        borderRadius: "20px",
                        padding: "8px 12px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      {getStatusButton(task.status)}
                    </button>
                  </td>

                  {/* ACTIONS */}
                  <td style={{ padding: "12px" }}>
                    <button
                      onClick={() =>
                        navigate(`/edit-task/${task.id}`)
                      }
                      style={{
                        backgroundColor: "#F9A8D4",
                        color: "#831843",
                        border: "none",
                        borderRadius: "7px",
                        padding: "8px 12px",
                        marginRight: "5px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      style={{
                        backgroundColor: "#F472B6",
                        color: "white",
                        border: "none",
                        borderRadius: "7px",
                        padding: "8px 12px",
                        fontWeight: "bold",
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
        )}
      </div>
    </div>
  );
}

export default Dashboard;
