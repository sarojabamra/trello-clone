import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

export function CardVisual({
  card,
  onEdit,
  onDelete,
  isOverlay = false,
  isMenuOpen,
  setIsMenuOpen,
}) {
  return (
    <div
      className={`group relative overflow-visible rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 hover:shadow-md ${
        isOverlay ? "pointer-events-none z-999 shadow-2xl" : "z-0"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-5 text-slate-800">
          {card.title}
        </p>

        {!isOverlay && (
          <div className="relative z-60 shrink-0 overflow-visible">
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                setIsMenuOpen((open) => !open);
              }}
              className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <MoreHorizontal size={16} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-5 z-1000 w-28 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsMenuOpen(false);
                    onEdit();
                  }}
                  className="w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-slate-100"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsMenuOpen(false);
                    onDelete();
                  }}
                  className="w-full rounded-md px-2 py-1.5 text-left text-xs text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {card.description && (
        <p className="mt-2 text-xs leading-5 text-slate-500">
          {card.description}
        </p>
      )}
    </div>
  );
}

function CardItem({ card, onEdit, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 99999 : isMenuOpen ? 80 : 1,
    position: "relative",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative overflow-visible rounded-lg ${
        isDragging ? "pointer-events-none opacity-100" : ""
      } ${isMenuOpen ? "z-80" : "z-0"}`}
    >
      <CardVisual
        card={card}
        onEdit={onEdit}
        onDelete={onDelete}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
    </div>
  );
}

export default CardItem;
