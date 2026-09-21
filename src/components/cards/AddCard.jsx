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
        className="ui-add-trigger mt-3"
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
        className="ui-input resize-none p-3"
      />

      <div className="mt-2 flex gap-2">
        <Button type="submit" variant="primary" className="px-3 py-1.5 text-xs">
          Add Card
        </Button>

        <Button
          type="button"
          variant="neutral"
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
