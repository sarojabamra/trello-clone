import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

function ListHeader({ list, cardCount = 0, onEdit, onDelete }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <h2 className="truncate text-base font-semibold text-slate-800">
          {list.name}
        </h2>
        <span className="rounded px-1.5 py-0.5 text-xs font-medium text-slate-500">
          {cardCount}
        </span>
      </div>

      <div className="group relative">
        <button className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700">
          <MoreHorizontal size={18} />
        </button>

        <div className="absolute right-0 top-5 z-20 hidden w-32 rounded-lg border border-slate-200 bg-white p-1 shadow-lg group-focus-within:block group-hover:block">
          <button
            onClick={onEdit}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100"
          >
            <Pencil size={14} />
            Edit
          </button>

          <button
            onClick={onDelete}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListHeader;
