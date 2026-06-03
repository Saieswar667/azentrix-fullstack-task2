import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./index.css";

const API = "https://azentrix-fullstack-task2.onrender.com/api";
const socket = io("https://azentrix-fullstack-task2.onrender.com");

function App() {
  const [token, setToken] = useState(localStorage.getItem("taskToken"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("taskUser")) || null);
  const [isRegister, setIsRegister] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignee: "",
    dueDate: "",
    priority: "Medium",
    status: "todo",
  });

  const headers = { Authorization: `Bearer ${token}` };

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/auth/login`, {
        email: authForm.email,
        password: authForm.password,
      });

      localStorage.setItem("taskToken", res.data.token);
      localStorage.setItem("taskUser", JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/auth/register`, authForm);
      alert("Account created. Please login now.");
      setIsRegister(false);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("taskToken");
    localStorage.removeItem("taskUser");
    setToken(null);
    setUser(null);
    setTasks([]);
    setUsers([]);
    setEditingId(null);
  };

  const fetchTasks = async () => {
    if (!token) return;
    const res = await axios.get(`${API}/tasks`, { headers });
    setTasks(res.data);
  };

  const fetchUsers = async () => {
    if (!token || user?.role !== "admin") return;
    const res = await axios.get(`${API}/users`, { headers });
    setUsers(res.data);
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();

    socket.on("tasksUpdated", fetchTasks);
    socket.on("usersUpdated", fetchUsers);

    return () => {
      socket.off("tasksUpdated", fetchTasks);
      socket.off("usersUpdated", fetchUsers);
    };
  }, [token, user?.role]);

  const saveTask = async (e) => {
    e.preventDefault();

    if (!taskForm.title) {
      alert("Task title is required");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API}/tasks/${editingId}`, taskForm, { headers });
        setEditingId(null);
      } else {
        await axios.post(`${API}/tasks`, taskForm, { headers });
      }

      setTaskForm({
        title: "",
        description: "",
        assignee: "",
        dueDate: "",
        priority: "Medium",
        status: "todo",
      });

      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Task save failed");
    }
  };

  const editTask = (task) => {
    setEditingId(task.id);
    setTaskForm({
      title: task.title || "",
      description: task.description || "",
      assignee: task.assignee || "",
      dueDate: task.due_date || "",
      priority: task.priority || "Medium",
      status: task.status || "todo",
    });
  };

  const deleteTask = async (id) => {
    if (!confirm("Delete this task?")) return;

    try {
      await axios.delete(`${API}/tasks/${id}`, { headers });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const moveTask = async (task, status) => {
    try {
      await axios.put(
        `${API}/tasks/${task.id}`,
        {
          title: task.title,
          description: task.description,
          assignee: task.assignee,
          dueDate: task.due_date,
          priority: task.priority,
          status,
        },
        { headers }
      );
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Move failed");
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const taskId = Number(result.draggableId);
    const newStatus = result.destination.droppableId;
    const task = tasks.find((t) => t.id === taskId);

    if (task && task.status !== newStatus) {
      moveTask(task, newStatus);
    }
  };

  const updateUserRole = async (id, role) => {
    await axios.put(`${API}/users/${id}`, { role }, { headers });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await axios.delete(`${API}/users/${id}`, { headers });
    fetchUsers();
  };

  const columnTasks = (status) => tasks.filter((task) => task.status === status);

  const renderAuth = () => (
    <div className="auth-page">
      <div className="auth-left">
        <div className="brand">
          <div className="brand-logo">T</div>
          <div>
            <h2>TaskFlow</h2>
            <p>Mini Trello Task Manager</p>
          </div>
        </div>

        <h1>Organize tasks, track progress, and collaborate with your team.</h1>

        <p className="hero-text">
          A full-stack mini Trello system with JWT auth, drag-and-drop board,
          real-time updates, role-based permissions, and MySQL storage.
        </p>

        <div className="feature-row">
          <div><span>✓</span><p>JWT Login</p></div>
          <div><span>✓</span><p>Drag Board</p></div>
          <div><span>✓</span><p>Admin Panel</p></div>
        </div>
      </div>

      <div className="auth-card">
        <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
        <p>{isRegister ? "Register as member or admin." : "Login to manage tasks."}</p>

        <form onSubmit={isRegister ? register : login}>
          {isRegister && (
            <input
              placeholder="Full name"
              value={authForm.name}
              onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
            />
          )}

          <input
            placeholder="Email address"
            value={authForm.email}
            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
          />

          {isRegister && (
            <select
              value={authForm.role}
              onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          )}

          <button className="primary-btn">
            {isRegister ? "Create Account" : "Login"}
          </button>
        </form>

        <button className="switch-btn" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Already have an account? Login" : "New here? Create an account"}
        </button>
      </div>
    </div>
  );

  if (!token) return renderAuth();

  return (
    <div className="app">
      <nav className="topbar">
        <div>
          <h1>TaskFlow Board</h1>
          <p>Welcome, {user?.name} • {user?.role}</p>
        </div>

        <button onClick={logout} className="logout-btn">Logout</button>
      </nav>

      <section className="task-form">
        <h2>{editingId ? "Edit Task" : "Create New Task"}</h2>
        <p>Add task details and assign status.</p>

        <form onSubmit={saveTask}>
          <input
            placeholder="Task title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
          />

          <input
            placeholder="Description"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          />

          <input
            placeholder="Assignee"
            value={taskForm.assignee}
            onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
          />

          <input
            type="date"
            value={taskForm.dueDate}
            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
          />

          <select
            value={taskForm.priority}
            onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select
            value={taskForm.status}
            onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
          >
            <option value="todo">To Do</option>
            <option value="progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <button className="primary-btn">
            {editingId ? "Update Task" : "Add Task"}
          </button>
        </form>
      </section>

      <DragDropContext onDragEnd={onDragEnd}>
        <section className="board">
          <Column title="To Do" status="todo" tasks={columnTasks("todo")} editTask={editTask} deleteTask={deleteTask} />
          <Column title="In Progress" status="progress" tasks={columnTasks("progress")} editTask={editTask} deleteTask={deleteTask} />
          <Column title="Done" status="done" tasks={columnTasks("done")} editTask={editTask} deleteTask={deleteTask} />
        </section>
      </DragDropContext>

      {user?.role === "admin" && (
        <section className="admin-panel">
          <h2>Admin User Management</h2>
          <p>Admins can update roles and delete users.</p>

          <div className="user-list">
            {users.map((u) => (
              <div className="user-card" key={u.id}>
                <div>
                  <h3>{u.name}</h3>
                  <p>{u.email}</p>
                </div>

                <select value={u.role} onChange={(e) => updateUserRole(u.id, e.target.value)}>
                  <option value="member">member</option>
                  <option value="admin">admin</option>
                </select>

                <button className="delete-user" onClick={() => deleteUser(u.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Column({ title, status, tasks, editTask, deleteTask }) {
  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          className={`column ${snapshot.isDraggingOver ? "drag-over" : ""}`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className="column-header">
            <h2>{title}</h2>
            <span>{tasks.length}</span>
          </div>

          {tasks.length === 0 && <p className="empty">Drag tasks here</p>}

          {tasks.map((task, index) => (
            <Draggable draggableId={String(task.id)} index={index} key={task.id}>
              {(provided) => (
                <div
                  className="task-card"
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <h3>{task.title}</h3>
                  <p>{task.description || "No description added."}</p>

                  <div className="meta">
                    <span>{task.assignee || "Unassigned"}</span>
                    <span className={`priority ${task.priority?.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>

                  <p className="date">Due: {task.due_date || "No date"}</p>

                  <div className="actions">
                    <button onClick={() => editTask(task)}>Edit</button>
                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                  </div>
                </div>
              )}
            </Draggable>
          ))}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default App;