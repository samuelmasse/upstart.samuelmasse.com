import { CreateTodoRequest, TodoItem } from "@upstart.samuelmasse.com/common";
import { useState, useEffect } from "react";
import { api } from "./api";

function App() {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      const data = await api.listTodos({ page: 343, rank: 334 });
      setItems(data.items);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newItem: CreateTodoRequest = {
        title,
        description: description || undefined,
      };

      await api.createTodo(newItem);
      setTitle("");
      setDescription("");
      await fetchItems();
    } catch (err) {
      console.error("Failed to create item:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDone = async (item: TodoItem) => {
    try {
      await api.putTodo({ id: item.todoId, item: { done: !item.done } });
      await fetchItems();
    } catch (err) {
      console.error("Failed to update item:", err);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await api.deleteTodo({ id });
      await fetchItems();
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return (
    <main>
      <h1>Upstart</h1>

      <h2>Create Item</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit" disabled={loading}>
          Create Item
        </button>
      </form>

      <h2>Items ({items.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Done</th>
            <th>Title</th>
            <th>Description</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {[...items]
            .sort((a, b) => (a.done > b.done ? 1 : -1))
            .map((item) => (
              <tr key={item.todoId}>
                <td>
                  <input type="checkbox" checked={item.done} onChange={() => toggleDone(item)} />
                </td>
                <td>
                  <strong>{item.title}</strong>
                </td>
                <td>{item.description}</td>
                <td>
                  <button onClick={() => deleteItem(item.todoId)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;
