import { useState } from "react";

const TaskItem = ({ task, onDelete, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const save = () => {
    onUpdate(task._id, { title });
    setEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-2 border rounded mb-2">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() =>
            onUpdate(task._id, { completed: !task.completed })
          }
        />

        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-1"
          />
        ) : (
          <span
            className={task.completed ? "line-through text-gray-400" : ""}
          >
            {task.title}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {editing ? (
          <button onClick={save} className="text-green-600">
            Save
          </button>
        ) : (
          <button onClick={() => setEditing(true)} className="text-blue-600">
            Edit
          </button>
        )}

        <button
          onClick={() => onDelete(task._id)}
          className="text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;