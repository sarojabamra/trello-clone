import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

function ListHeader({ list, cardCount = 0, onEdit, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnOutside = (event) => {
      if (event.target.closest("[data-list-menu-root]")) return;
      setIsMenuOpen(false);
    };
    window.addEventListener("mousedown", closeOnOutside);
    return () => window.removeEventListener("mousedown", closeOnOutside);
  }, [isMenuOpen]);

  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <h2 className="truncate text-base font-semibold text-slate-900">
          {list.name}
        </h2>
        <span className="rounded px-1.5 py-0.5 text-xs font-medium text-slate-500">
          {cardCount}
        </span>
      </div>

      <div className="relative" data-list-menu-root>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setIsMenuOpen((open) => !open);
          }}
          className="ui-ghost-icon"
          aria-label="List actions"
        >
          <MoreHorizontal size={18} />
        </button>

        {isMenuOpen && (
          <div className="ui-dropdown absolute right-0 top-8 z-30 w-36">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsMenuOpen(false);
                onEdit();
              }}
              className="ui-menu-item"
            >
              <Pencil size={14} />
              Rename
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsMenuOpen(false);
                onDelete();
              }}
              className="ui-menu-item ui-menu-item-danger"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListHeader;
