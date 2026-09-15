import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TaskForm.css";

function AddTask() {
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!task.title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    if (!task.dueDate) {
      alert("Please select a due date.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8080/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        }
      );

      if (response.ok) {
        alert("✅ Task added successfully!");
        navigate("/dashboard");
      } else {
        alert("❌ Failed to add task.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Cannot connect to Spring Boot backend.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="task-form-page">

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

      <main className="task-form-main">

        <div className="task-form-title">
          <div className="page-icon">+</div>

          <div>
            <div className="page-label">TASK MANAGEMENT</div>
            <h2>Add New Task</h2>
            <p>
              Create a new academic task and keep track of your work.
            </p>
          </div>
        </div>

        <form
          className="task-form-card"
          onSubmit={handleSubmit}
        >

          <div className="form-section">
            <div className="section-heading">
              <div className="section-number">01</div>

              <div>
                <h3>Task Information</h3>
                <p>Enter the basic details of your task.</p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="title">
                Task Title <span>*</span>
              </label>

              <div className="input-with-icon">
                <span>✎</span>

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
                placeholder="Write a short description of the task..."
                value={task.description}
                onChange={handleChange}
                rows="5"
              />

              <small>
                Add details that will help you complete this task.
              </small>
            </div>
          </div>

          <div className="form-divider"></div>

          <div className="form-section">
            <div className="section-heading">
              <div className="section-number">02</div>

              <div>
                <h3>Task Settings</h3>
                <p>Set the deadline, priority and current status.</p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="dueDate">
                  Due Date <span>*</span>
                </label>

                <div className="input-with-icon">
                  <span>▣</span>

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

              <div className="form-group">
                <label htmlFor="priority">
                  Priority
                </label>

                <div className="input-with-icon">
                  <span>◆</span>

                  <select
                    id="priority"
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="status">
                  Status
                </label>

                <div className="input-with-icon">
                  <span>●</span>

                  <select
                    id="status"
                    name="status"
                    value={task.status}
                    onChange={handleChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          <div className="form-tip">
            <div className="tip-icon">!</div>

            <div>
              <strong>Helpful Tip</strong>
              <p>
                Set a realistic due date and priority to manage
                your academic workload more effectively.
              </p>
            </div>
          </div>

          <div className="form-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "✓ Create Task"}
            </button>

          </div>

        </form>

      </main>

      <footer className="task-form-footer">
        <span>Student Task Manager</span>
        <span>•</span>
        <span>College Mini Project</span>
      </footer>

    </div>
  );
}

export default AddTask;
