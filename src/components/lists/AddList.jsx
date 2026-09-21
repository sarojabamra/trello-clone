import { Plus } from "lucide-react";
import { useState } from "react";

import Button from "../common/Button";

function AddList({ onAdd }) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    onAdd(name.trim());

    setName("");
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => setIsAdding(true)}
        className="flex h-fit w-72.5 shrink-0 items-center gap-2 rounded-xl bg-white/30 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-white/40"
      >
        <Plus size={18} />
        Add another list
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="h-fit w-72.5 shrink-0 rounded-xl bg-slate-100/95 p-3 shadow-sm"
    >
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter list name..."
        className="ui-input"
      />

      <div className="mt-2 flex gap-2">
        <Button type="submit" className="px-3 py-1.5 text-xs">
          Add List
        </Button>

        <Button
          type="button"
          variant="neutral"
          className="px-3 py-1.5 text-xs"
          onClick={() => {
            setIsAdding(false);
            setName("");
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default AddList;
