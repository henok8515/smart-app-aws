import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3002";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const load = async () => {
    const res = await axios.get(`${API}/tasks`);
    setTasks(res.data);
  };

  const create = async () => {
    await axios.post(`${API}/tasks`, { title });
    setTitle("");
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Smart Task App</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button type="submit" onClick={create}>
        Add
      </button>

      <ul>
        {tasks.map((t) => (
          <li key={t._id}>
            {t.title} - {t.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
