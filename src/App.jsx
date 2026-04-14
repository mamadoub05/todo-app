import { useState, useEffect } from "react";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleAddTask() {
    if (task.trim() === "") return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: task,
        completed: false,
      },
    ]);
    setTask("");
  }

  function handleDeleteTask(idToDelete) {
    const updatedTasks = tasks.filter((item) => item.id !== idToDelete);
    setTasks(updatedTasks);
  }

  function toggleComplete(idToToggle) {
    const updatedTasks = tasks.map((item) => {
      if (item.id === idToToggle) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    setTasks(updatedTasks);
  }

  function startEditing(item) {
    setEditingId(item.id);
    setEditingText(item.text);
  }

  function saveEdit(idToUpdate) {
    if (editingText.trim() === "") return;

    const updatedTasks = tasks.map((item) => {
      if (item.id === idToUpdate) {
        return { ...item, text: editingText };
      }
      return item;
    });

    setTasks(updatedTasks);
    setEditingId(null);
    setEditingText("");
  }

  const filteredTasks = tasks.filter((item) => {
    if (filter === "active") return !item.completed;
    if (filter === "completed") return item.completed;
    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((item) => item.completed).length;
  const activeTasks = tasks.filter((item) => !item.completed).length;

  return (
    <div className="app">
      <div className="todo-container">
        <h1>To-Do List</h1>

        <div className="input-row">
          <input
            type="text"
            placeholder="Enter a task"
            value={task}
            onChange={(event) => setTask(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleAddTask();
              }
            }}
          />
          <button onClick={handleAddTask}>Add</button>
        </div>

        <div className="filter-buttons">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("active")}>Active</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
        </div>

        <div className="task-stats">
          <p>Total: {totalTasks}</p>
          <p>Active: {activeTasks}</p>
          <p>Completed: {completedTasks}</p>
        </div>

        <ul>
          {filteredTasks.map((item) => (
            <li key={item.id}>
              {editingId === item.id ? (
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
              ) : (
                <span
                  style={{
                    textDecoration: item.completed ? "line-through" : "none",
                  }}
                >
                  {item.text}
                </span>
              )}

              <button onClick={() => toggleComplete(item.id)}>
                {item.completed ? "Undo" : "Complete"}
              </button>

              <button onClick={() => handleDeleteTask(item.id)}>Delete</button>

              <button onClick={() => startEditing(item)}>Edit</button>

              {editingId === item.id && (
                <button onClick={() => saveEdit(item.id)}>Save</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;