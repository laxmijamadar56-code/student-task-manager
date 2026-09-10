import { useEffect, useState } from "react";

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [studentSearch, setStudentSearch] = useState("");
  const [taskSearch, setTaskSearch] = useState("");

  const [loading, setLoading] = useState(true);

  // ==============================
  // FETCH STUDENTS AND TASKS
  // ==============================

  const fetchData = async () => {
    try {
      const studentResponse = await fetch(
        "http://localhost:8081/students"
      );

      const taskResponse = await fetch(
        "http://localhost:8081/tasks"
      );

      if (!studentResponse.ok || !taskResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const studentData = await studentResponse.json();
      const taskData = await taskResponse.json();

      setStudents(studentData);
      setTasks(taskData);

    } catch (error) {
      console.error(error);
      alert("Cannot connect to Spring Boot backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  // ==============================
  // DELETE STUDENT
  // ==============================

  const deleteStudent = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:8081/students/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      alert("Student deleted successfully.");

      fetchData();

    } catch (error) {

      console.error(error);

      alert("Unable to delete student.");

    }
  };


  // ==============================
  // DELETE TASK
  // ==============================

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
        throw new Error("Failed to delete task");
      }

      alert("Task deleted successfully.");

      fetchData();

    } catch (error) {

      console.error(error);

      alert("Unable to delete task.");

    }
  };


  // ==============================
  // VIEW STUDENT
  // ==============================

  const viewStudent = (student) => {

    alert(
      `Student Details\n\n` +
      `ID: ${student.id}\n` +
      `Name: ${student.name}\n` +
      `Email: ${student.email}`
    );

  };


  // ==============================
  // VIEW TASK
  // ==============================

  const viewTask = (task) => {

    alert(
      `Task Details\n\n` +
      `ID: ${task.id}\n` +
      `Title: ${task.title}\n` +
      `Description: ${task.description}\n` +
      `Due Date: ${task.dueDate}\n` +
      `Priority: ${task.priority}\n` +
      `Status: ${task.status}`
    );

  };


  // ==============================
  // EDIT STUDENT
  // ==============================

  const editStudent = (student) => {

    const newName = window.prompt(
      "Enter new student name:",
      student.name
    );

    if (newName === null || newName.trim() === "") {
      return;
    }

    const newEmail = window.prompt(
      "Enter new student email:",
      student.email
    );

    if (newEmail === null || newEmail.trim() === "") {
      return;
    }

    updateStudent(
      student.id,
      newName.trim(),
      newEmail.trim()
    );

  };


  // ==============================
  // UPDATE STUDENT
  // ==============================

  const updateStudent = async (
    id,
    name,
    email
  ) => {

    try {

      const response = await fetch(
        `http://localhost:8081/students/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name,
            email: email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Student update failed");
      }

      alert("Student updated successfully.");

      fetchData();

    } catch (error) {

      console.error(error);

      alert(
        "Student update failed.\n\n" +
        "If your Spring Boot backend does not have PUT /students/{id}, " +
        "this button will need a backend update endpoint."
      );

    }
  };


  // ==============================
  // EDIT TASK
  // ==============================

  const editTask = (task) => {

    window.location.href = `/edit-task/${task.id}`;

  };


  // ==============================
  // LOGOUT
  // ==============================

  const logout = () => {

    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {

      window.location.href = "/";

    }

  };


  // ==============================
  // SEARCH STUDENTS
  // ==============================

  const filteredStudents = students.filter((student) => {

    const search = studentSearch.toLowerCase();

    return (
      String(student.id)
        .toLowerCase()
        .includes(search) ||

      student.name
        ?.toLowerCase()
        .includes(search) ||

      student.email
        ?.toLowerCase()
        .includes(search)
    );

  });


  // ==============================
  // SEARCH TASKS
  // ==============================

  const filteredTasks = tasks.filter((task) => {

    const search = taskSearch.toLowerCase();

    return (
      String(task.id)
        .toLowerCase()
        .includes(search) ||

      task.title
        ?.toLowerCase()
        .includes(search) ||

      task.description
        ?.toLowerCase()
        .includes(search) ||

      task.priority
        ?.toLowerCase()
        .includes(search) ||

      task.status
        ?.toLowerCase()
        .includes(search)
    );

  });


  // ==============================
  // TASK COUNTS
  // ==============================

  const completedTasks = tasks.filter(
    (task) =>
      task.status?.toUpperCase() === "COMPLETED"
  ).length;

  const pendingTasks = tasks.filter(
    (task) =>
      task.status?.toUpperCase() === "PENDING"
  ).length;


  // ==============================
  // LOADING
  // ==============================

  if (loading) {

    return (
      <div className="admin-dashboard">

        <h2>Loading Admin Dashboard...</h2>

      </div>
    );

  }


  // ==============================
  // UI
  // ==============================

  return (

    <div className="admin-dashboard">

      {/* ==========================
          HEADER
      ========================== */}

      <div className="dashboard-header">

        <h1>
          🎓 Student Task Manager
        </h1>

        <h2>
          👨‍💼 Admin Dashboard
        </h2>

        <button
          className="logout-btn"
          onClick={logout}
        >
          🚪 Logout
        </button>

      </div>


      {/* ==========================
          SUMMARY
      ========================== */}

      <div className="admin-summary">

        <div className="dashboard-card">

          <h3>
            👨‍🎓 Students
          </h3>

          <h2>
            {students.length}
          </h2>

          <p>
            Total Students
          </p>

        </div>


        <div className="dashboard-card">

          <h3>
            📝 Tasks
          </h3>

          <h2>
            {tasks.length}
          </h2>

          <p>
            Total Tasks
          </p>

        </div>


        <div className="dashboard-card">

          <h3>
            ⏳ Pending
          </h3>

          <h2>
            {pendingTasks}
          </h2>

          <p>
            Pending Tasks
          </p>

        </div>


        <div className="dashboard-card">

          <h3>
            ✅ Completed
          </h3>

          <h2>
            {completedTasks}
          </h2>

          <p>
            Completed Tasks
          </p>

        </div>

      </div>


      {/* ==========================
          STUDENTS
      ========================== */}

      <div className="admin-section">

        <div className="section-header">

          <h2>
            👨‍🎓 Students
          </h2>

          <h3>
            Total Students: {students.length}
          </h3>

        </div>


        {/* Student Search */}

        <div className="search-box">

          <input
            type="text"
            placeholder="🔍 Search student by ID, name or email..."
            value={studentSearch}
            onChange={(e) =>
              setStudentSearch(e.target.value)
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

              {filteredStudents.length > 0 ? (

                filteredStudents.map((student) => (

                  <tr key={student.id}>

                    <td>
                      {student.id}
                    </td>

                    <td>
                      {student.name}
                    </td>

                    <td>
                      {student.email}
                    </td>

                    <td>

                      <button
                        className="view-btn"
                        onClick={() =>
                          viewStudent(student)
                        }
                      >
                        👁️ View
                      </button>


                      <button
                        className="edit-btn"
                        onClick={() =>
                          editStudent(student)
                        }
                      >
                        ✏️ Edit
                      </button>


                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteStudent(student.id)
                        }
                      >
                        🗑️ Delete
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td colSpan="4">
                    No students found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ==========================
          TASKS
      ========================== */}

      <div className="admin-section">

        <div className="section-header">

          <h2>
            📝 All Tasks
          </h2>

          <h3>
            Total Tasks: {tasks.length}
          </h3>

        </div>


        {/* Task Search */}

        <div className="search-box">

          <input
            type="text"
            placeholder="🔍 Search task by ID, title, description..."
            value={taskSearch}
            onChange={(e) =>
              setTaskSearch(e.target.value)
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

              {filteredTasks.length > 0 ? (

                filteredTasks.map((task) => (

                  <tr key={task.id}>

                    <td>
                      {task.id}
                    </td>

                    <td>
                      {task.title}
                    </td>

                    <td>
                      {task.description}
                    </td>

                    <td>
                      {task.dueDate}
                    </td>

                    <td>
                      {task.priority}
                    </td>

                    <td>
                      {task.status}
                    </td>

                    <td>

                      <button
                        className="view-btn"
                        onClick={() =>
                          viewTask(task)
                        }
                      >
                        👁️ View
                      </button>


                      <button
                        className="edit-btn"
                        onClick={() =>
                          editTask(task)
                        }
                      >
                        ✏️ Edit
                      </button>


                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteTask(task.id)
                        }
                      >
                        🗑️ Delete
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td colSpan="7">
                    No tasks found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default AdminDashboard;
