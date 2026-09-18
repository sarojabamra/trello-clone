import { Plus } from "lucide-react";
import { useState } from "react";

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
        onClick={() => setIsAdding(true)}
        className="flex h-fit w-[290px] shrink-0 items-center gap-2 rounded-xl bg-white/30 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-white/40"
      >
        <Plus size={18} />
        Add another list
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="h-fit w-[290px] shrink-0 rounded-xl bg-[#f1f2f4]/95 p-3 shadow-sm"
    >
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter list name..."
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <div className="mt-2 flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
        >
          Add List
        </button>

        <button
          type="button"
          onClick={() => {
            setIsAdding(false);
            setName("");
          }}
          className="rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddList;
