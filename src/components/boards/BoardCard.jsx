import { ArrowRight, Layout, Trash2 } from "lucide-react";
import { FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function BoardCard({ board, onDeleteBoard }) {
  const navigate = useNavigate();
  const listCount = board?.listCount ?? 0;

  const handleDelete = (event) => {
    event.stopPropagation();
    onDeleteBoard?.(board.id);
  };

  return (
    <div
      onClick={() => navigate(`/board/${board.id}`)}
      className="group relative min-h-36 cursor-pointer rounded-xl bg-blue-700 p-5 text-left text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative flex items-start justify-between gap-4">
        <FaList size={22} className="mb-8 text-white" />

        <button
          type="button"
          onClick={handleDelete}
          className="rounded-md bg-white/10 p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white"
          aria-label={`Delete ${board.name}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <h3 className="relative text-lg font-semibold">{board.name}</h3>

      <div className="relative mt-2 flex items-center justify-between">
        <span className="text-sm text-white/70">
          {listCount} {listCount === 1 ? "list" : "lists"}
        </span>

        <ArrowRight
          size={18}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </div>
  );
}

export default BoardCard;
