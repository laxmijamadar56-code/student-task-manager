import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "LOW",
    status: "PENDING",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Load task details
  useEffect(() => {
    fetch(`http://localhost:8080/tasks/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Task not found");
        }
        return response.json();
      })
      .then((data) => {
        setTask({
          title: data.title || "",
          description: data.description || "",
          dueDate: data.dueDate || "",
          priority: data.priority || "LOW",
          status: data.status || "PENDING",
        });

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        alert("❌ Unable to load task");
        setLoading(false);
      });
  }, [id]);

  // Change input values
  const handleChange = (e) => {
    const { name, value } = e.target;

    setTask((oldTask) => ({
      ...oldTask,
      [name]: value,
    }));
  };

  // Update task
  const handleUpdate = async (e) => {
    e.preventDefault();

    setUpdating(true);

    try {
      const response = await fetch(
        `http://localhost:8080/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Backend error:", errorMessage);
        throw new Error("Update failed");
      }

      const updatedTask = await response.json();

      console.log("Updated task:", updatedTask);

      alert("✅ Task updated successfully!");

      // Go back to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Update error:", error);

      alert("❌ Failed to update task");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>⏳ Loading task...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "30px auto",
        padding: "30px",
      }}
    >
      <h1>🎓 Student Task Manager</h1>

      <h2>✏️ Edit Task</h2>

      <form onSubmit={handleUpdate}>

        {/* Title */}
        <label>
          <b>Title</b>
        </label>

        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            marginBottom: "15px",
          }}
        />

        {/* Description */}
        <label>
          <b>Description</b>
        </label>

        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          required
          rows="4"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            marginBottom: "15px",
          }}
        />

        {/* Due Date */}
        <label>
          <b>Due Date</b>
        </label>

        <input
          type="date"
          name="dueDate"
          value={task.dueDate}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            marginBottom: "15px",
          }}
        />

        {/* Priority */}
        <label>
          <b>Priority</b>
        </label>

        <select
          name="priority"
          value={task.priority}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            marginBottom: "15px",
          }}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        {/* Status */}
        <label>
          <b>Status</b>
        </label>

        <select
          name="status"
          value={task.status}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            marginBottom: "20px",
          }}
        >
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {/* Update button */}
        <button
          type="submit"
          disabled={updating}
          style={{
            padding: "10px 20px",
          }}
        >
          {updating ? "⏳ Updating..." : "💾 Update Task"}
        </button>

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "10px 20px",
            marginLeft: "10px",
          }}
        >
          ← Back to Dashboard
        </button>

      </form>
    </div>
  );
}

export default EditTask;
