import { API_URL } from "./api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./App.css";

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    fetch(`${API_URL}/tasks/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setDueDate(data.dueDate || "");
        setPriority(data.priority || "Medium");
        setStatus(data.status || "Pending");
      })
      .catch((error) => {
        console.error("Error fetching task:", error);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTask = {
      title,
      description,
      dueDate,
      priority,
      status,
    };

    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        alert("Task updated successfully!");
        navigate("/tasks");
      } else {
        alert("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Cannot connect to Spring Boot backend");
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h1>Edit Task</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button type="submit" className="login-button">
            UPDATE TASK
          </button>

          <button
            type="button"
            className="admin-login-button"
            onClick={() => navigate("/tasks")}
          >
            CANCEL
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditTask;
