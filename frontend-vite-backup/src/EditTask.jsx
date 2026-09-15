import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TaskForm.css";

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

  useEffect(() => {
    fetch(`http://127.0.0.1:8080/tasks/${id}`)
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
        console.error("Load task error:", error);
        alert("❌ Unable to load task.");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTask((oldTask) => ({
      ...oldTask,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!task.title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    if (!task.dueDate) {
      alert("Please select a due date.");
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8080/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      alert("✅ Task updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Update error:", error);
      alert("❌ Failed to update task.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="task-loading-page">
        <div className="loading-card">
          <div className="loading-icon">⏳</div>

          <p className="page-label">TASK MANAGEMENT</p>

          <h2>Loading Task...</h2>

          <p>
            Please wait while we fetch your task details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-form-page">

      {/* HEADER */}
      <header className="task-form-header">

        <div className="task-brand">
          <div className="task-brand-icon">✓</div>

          <div>
            <h1>Student Task Manager</h1>
            <p>Stay organized. Stay on track.</p>
          </div>
        </div>

        <button
          className="header-back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

      </header>

      {/* MAIN */}
      <main className="task-form-main">

        <div className="task-form-title">

          <div className="page-icon edit-icon">
            ✎
          </div>

          <div>
            <p className="page-label">
              TASK MANAGEMENT
            </p>

            <h2>Edit Task</h2>

            <p>
              Update your task details and keep your
              academic work on track.
            </p>
          </div>

        </div>

        {/* TASK ID */}
        <div className="edit-task-id">
          <span>Task ID</span>
          <strong>#{id}</strong>
        </div>

        <form
          className="task-form-card"
          onSubmit={handleUpdate}
        >

          {/* TASK INFORMATION */}
          <div className="form-section">

            <div className="section-heading">
              <span className="section-number">
                01
              </span>

              <div>
                <h3>Task Information</h3>
                <p>
                  Update the basic information about your task.
                </p>
              </div>
            </div>

            <div className="form-divider"></div>

            <div className="form-group">

              <label htmlFor="title">
                Task Title <span>*</span>
              </label>

              <div className="input-with-icon">
                <span>📝</span>

                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Example: Complete DSP assignment"
                  value={task.title}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="form-group">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={task.description}
                onChange={handleChange}
                rows="5"
                placeholder="Write a short description of the task..."
              />

              <small>
                Add details that will help you complete this task.
              </small>

            </div>

          </div>

          {/* TASK SETTINGS */}
          <div className="form-section">

            <div className="section-heading">
              <span className="section-number">
                02
              </span>

              <div>
                <h3>Task Settings</h3>
                <p>
                  Update the deadline, priority and current status.
                </p>
              </div>
            </div>

            <div className="form-divider"></div>

            <div className="form-grid">

              {/* DUE DATE */}
              <div className="form-group">

                <label htmlFor="dueDate">
                  Due Date <span>*</span>
                </label>

                <div className="input-with-icon">
                  <span>📅</span>

                  <input
                    id="dueDate"
                    type="date"
                    name="dueDate"
                    value={task.dueDate}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              {/* PRIORITY */}
              <div className="form-group">

                <label htmlFor="priority">
                  Priority
                </label>

                <div className="input-with-icon">
                  <span>🎯</span>

                  <select
                    id="priority"
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

              </div>

              {/* STATUS */}
              <div className="form-group">

                <label htmlFor="status">
                  Status
                </label>

                <div className="input-with-icon">
                  <span>📌</span>

                  <select
                    id="status"
                    name="status"
                    value={task.status}
                    onChange={handleChange}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

              </div>

            </div>

          </div>

          {/* TIP */}
          <div className="form-tip">

            <div className="tip-icon">
              💡
            </div>

            <div>
              <strong>
                Keep your tasks updated
              </strong>

              <p>
                Update the priority, deadline or status
                whenever your academic schedule changes.
              </p>
            </div>

          </div>

          {/* ACTIONS */}
          <div className="form-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/dashboard")}
              disabled={updating}
            >
              ← Back
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={updating}
            >
              {updating
                ? "⏳ Updating..."
                : "✓ Update Task"}
            </button>

          </div>

        </form>

      </main>

      {/* FOOTER */}
      <footer className="task-form-footer">
        <span>Student Task Manager</span>
        <span>•</span>
        <span>College Mini Project</span>
      </footer>

    </div>
  );
}

export default EditTask;
