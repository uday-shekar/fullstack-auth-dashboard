import { useState } from "react";

const TaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd(title);
    setTitle("");
  };

  return (
    <form onSubmit={submit} className="flex gap-2 mb-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task..."
        className="flex-1 p-2 border rounded"
      />
      <button className="bg-blue-600 text-white px-4 rounded">
        Add
      </button>
    </form>
  );
};

export default TaskForm;