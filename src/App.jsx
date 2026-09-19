import { useEffect, useState } from 'react';

const STORAGE_KEY = 'task-board.tasks';

const loadSavedTasks = () => {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (!savedTasks) {
      return [];
    }

    const parsedTasks = JSON.parse(savedTasks);
    if (!Array.isArray(parsedTasks)) {
      return [];
    }

    return parsedTasks.filter(
      (task) =>
        task &&
        typeof task.id === 'string' &&
        typeof task.title === 'string' &&
        typeof task.completed === 'boolean',
    );
  } catch {
    return [];
  }
};

function App() {
  const [tasks, setTasks] = useState(loadSavedTasks);
  const [taskText, setTaskText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // localStorage may be unavailable in restricted browser settings.
    }
  }, [tasks]);

  const addTask = (event) => {
    event.preventDefault();

    const title = taskText.trim();
    if (!title) {
      return;
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
      },
    ]);
    setTaskText('');
  };

  const toggleTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (taskId) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  };

  return (
    <main className="app">
      <section className="task-board" aria-labelledby="task-board-title">
        <header className="board-header">
          <h1 id="task-board-title">Task Board</h1>
          <p>今日やることを小さく並べて、終わったらチェックします。</p>
        </header>

        <form className="task-form" onSubmit={addTask}>
          <label htmlFor="task-input">タスク</label>
          <div className="task-input-row">
            <input
              id="task-input"
              type="text"
              value={taskText}
              onChange={(event) => setTaskText(event.target.value)}
              placeholder="例: React の state を練習する"
            />
            <button type="submit">追加</button>
          </div>
        </form>

        <ul className="task-list" aria-label="タスク一覧">
          {tasks.map((task) => (
            <li
              className={`task-item${task.completed ? ' is-completed' : ''}`}
              key={task.id}
            >
              <label className="task-check">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.title}</span>
              </label>
              <button
                className="delete-button"
                type="button"
                onClick={() => deleteTask(task.id)}
              >
                削除
              </button>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && (
          <p className="empty-message">まだタスクはありません。</p>
        )}
      </section>
    </main>
  );
}

export default App;
