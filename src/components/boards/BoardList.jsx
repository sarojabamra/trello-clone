import { FolderOpen } from "lucide-react";
import BoardCard from "./BoardCard";

function BoardList({ boards, onDeleteBoard }) {
  if (boards.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <FolderOpen size={40} className="mx-auto text-slate-300" />

        <h3 className="mt-4 font-semibold text-slate-900">No boards yet</h3>

        <p className="mt-1 text-sm text-slate-500">
          Create your first board to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {boards.map((board) => (
        <BoardCard key={board.id} board={board} onDeleteBoard={onDeleteBoard} />
      ))}
    </div>
  );
}

export default BoardList;
