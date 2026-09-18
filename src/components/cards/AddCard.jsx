import { Plus } from "lucide-react";
import { useState } from "react";
import Button from "../common/Button";

function AddCard({ onAdd }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    onAdd(title.trim());

    setTitle("");
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="mt-3 bg-gray-100 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-600 transition hover:bg-slate-300 hover:text-slate-800"
      >
        <Plus size={17} />
        Add a card
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <textarea
        autoFocus
        rows={2}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter card title..."
        className="w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <div className="mt-2 flex gap-2">
        <Button type="submit" className="px-3 py-1.5 text-xs">
          Add Card
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="px-3 py-1.5 text-xs"
          onClick={() => {
            setIsAdding(false);
            setTitle("");
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default AddCard;
