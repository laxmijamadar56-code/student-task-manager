import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddTask() {
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
  });

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        alert("✅ Task added successfully!");
        navigate("/dashboard");
      } else {
        alert("❌ Failed to add task");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Cannot connect to Spring Boot backend");
    }
  };

  return (
    <div>
      <h1>🎓 Student Task Manager</h1>

      <h2>📝 Add Task</h2>

      <form onSubmit={handleSubmit}>

        <label>Title</label>
        <br />
        <input
          type="text"
          name="title"
          placeholder="Enter task title"
          value={task.title}
          onChange={handleChange}
          required
        />

        <br /><br />

        <label>Description</label>
        <br />
        <textarea
          name="description"
          placeholder="Enter task description"
          value={task.description}
          onChange={handleChange}
        />

        <br /><br />

        <label>Due Date</label>
        <br />
        <input
          type="date"
          name="dueDate"
          value={task.dueDate}
          onChange={handleChange}
          required
        />

        <br /><br />

        <label>Priority</label>
        <br />
        <select
          name="priority"
          value={task.priority}
          onChange={handleChange}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <br /><br />

        <label>Status</label>
        <br />
        <select
          name="status"
          value={task.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <br /><br />

        <button type="submit">
          ➕ Add Task
        </button>
      </form>

      <br />

      <button onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default AddTask;
