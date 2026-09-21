import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckSquare, Clock, MoreHorizontal, AlignLeft } from "lucide-react";
import { useEffect, useState } from "react";

import { normalizeDueDate } from "../../utils/cardNormalize";
import {
  CardLabelPicker,
  CardLabelStrip,
} from "./CardLabelStrip";
import { CardCompleteCheckbox } from "./CardCompleteCheckbox";

function getDueDateMeta(dueDate, completed) {
  const normalized = normalizeDueDate(dueDate);
  if (!normalized) return null;

  const due = new Date(`${normalized}T23:59:59`);
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
  );

  const label = due.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  if (completed) {
    return { label, className: "bg-emerald-700 text-white" };
  }
  if (due < startOfToday) {
    return { label, className: "bg-red-800 text-white" };
  }
  if (due <= endOfToday) {
    return { label, className: "bg-orange-700 text-white" };
  }
  return { label, className: "bg-slate-900/5 text-slate-600" };
}

function CardMetaMenu({
  card,
  onEdit,
  onDelete,
  onUpdate,
  onClose,
}) {
  const [panel, setPanel] = useState("main");
  const [draftDueDate, setDraftDueDate] = useState(
    normalizeDueDate(card.dueDate) ?? "",
  );

  useEffect(() => {
    setDraftDueDate(normalizeDueDate(card.dueDate) ?? "");
  }, [card.dueDate, card.id]);

  const labels = Array.isArray(card.labels) ? card.labels : [];

  const handleLabelsChange = (next) => {
    onUpdate({ labels: next });
  };

  const saveDueDate = () => {
    onUpdate({ dueDate: draftDueDate || null });
    onClose();
  };

  const removeDueDate = () => {
    setDraftDueDate("");
    onUpdate({ dueDate: null });
    onClose();
  };

  if (panel === "labels") {
    return (
      <div className="absolute right-0 top-8 z-1000 w-56 rounded-lg border border-slate-900/10 bg-white p-2 shadow-lg">
        <button
          type="button"
          onClick={() => setPanel("main")}
          className="mb-2 w-full rounded-md px-2 py-1 text-left text-xs font-medium text-slate-600 hover:bg-slate-900/5"
        >
          ← Back
        </button>
        <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          Labels
        </p>
        <CardLabelPicker labels={labels} onChange={handleLabelsChange} />
      </div>
    );
  }

  if (panel === "dueDate") {
    return (
      <div className="absolute right-0 top-7 z-1000 w-52 rounded-lg border border-slate-900/10 bg-white p-2 shadow-lg">
        <button
          type="button"
          onClick={() => setPanel("main")}
          className="mb-2 w-full rounded-md px-2 py-1 text-left text-xs font-medium text-slate-600 hover:bg-slate-900/5"
        >
          ← Back
        </button>
        <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          Due date
        </p>
        <input
          type="date"
          value={draftDueDate}
          onChange={(event) => setDraftDueDate(event.target.value)}
          className="w-full rounded border border-slate-900/10 px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-blue-600"
        />
        <div className="mt-2 flex flex-col gap-1">
          <button
            type="button"
            onClick={saveDueDate}
            className="w-full rounded-md bg-blue-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            Save
          </button>
          {normalizeDueDate(card.dueDate) && (
            <button
              type="button"
              onClick={removeDueDate}
              className="w-full rounded-md px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-900/5"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 top-7 z-1000 w-40 rounded-lg border border-slate-900/10 bg-white p-1 shadow-lg">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
          onEdit();
        }}
        className="w-full rounded-md px-2 py-1.5 text-left text-xs text-slate-900 hover:bg-slate-900/5"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => setPanel("labels")}
        className="w-full rounded-md px-2 py-1.5 text-left text-xs text-slate-900 hover:bg-slate-900/5"
      >
        Labels
      </button>
      <button
        type="button"
        onClick={() => setPanel("dueDate")}
        className="w-full rounded-md px-2 py-1.5 text-left text-xs text-slate-900 hover:bg-slate-900/5"
      >
        Due date
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
          onDelete();
        }}
        className="w-full rounded-md px-2 py-1.5 text-left text-xs text-red-800 hover:bg-red-50"
      >
        Delete
      </button>
    </div>
  );
}

export function CardVisual({
  card,
  onDelete,
  onOpen,
  onUpdate,
  onToggleComplete,
  dragListeners,
  isOverlay = false,
  isMenuOpen,
  setIsMenuOpen,
}) {
  const labels = Array.isArray(card.labels) ? card.labels : [];
  const checklist = Array.isArray(card.checklist) ? card.checklist : [];
  const checklistDone = checklist.filter((item) => item.completed).length;
  const checklistTotal = checklist.length;
  const dueMeta = getDueDateMeta(card.dueDate, card.completed);
  const isCompleted = Boolean(card.completed);
  const showCompleteControl = !isOverlay && Boolean(onToggleComplete);
  const hasDescription = Boolean(card.description?.trim());
  const hasMeta = dueMeta || checklistTotal > 0 || hasDescription;

  const openCard = () => {
    onOpen?.();
  };

  const handleContentClick = (event) => {
    if (isOverlay) return;
    if (event.target.closest("[data-card-action]")) return;
    openCard();
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div
      className={`group/card relative overflow-visible rounded-lg border bg-white shadow-sm transition-all duration-200 ease-out ${
        isCompleted
          ? "border-slate-200/80"
          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
      } ${isOverlay ? "pointer-events-none z-999 shadow-2xl" : "z-0"}`}
    >
      <div className="p-2">
        <CardLabelStrip labels={labels} className="mb-1.5" />

        <div className="flex items-center gap-1.5">
          {showCompleteControl && (
            <div
              className={`shrink-0 transition-[width,opacity] duration-200 ease-out ${
                isCompleted
                  ? "w-[18px] opacity-100"
                  : "w-0 overflow-hidden opacity-0 group-hover/card:w-[18px] group-hover/card:overflow-visible group-hover/card:opacity-100"
              }`}
            >
              <CardCompleteCheckbox
                checked={isCompleted}
                data-card-action
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  onToggleComplete();
                }}
                className={
                  isCompleted
                    ? "pointer-events-auto"
                    : "pointer-events-none group-hover/card:pointer-events-auto"
                }
                aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
              />
            </div>
          )}

          <div
            {...(isOverlay ? {} : dragListeners)}
            onClick={handleContentClick}
            className={`min-w-0 flex-1 ${isOverlay ? "" : "cursor-pointer touch-none"}`}
          >
            <p
              className={`text-sm font-normal leading-[18px] text-slate-900 ${
                isCompleted ? "text-slate-500 line-through" : ""
              }`}
            >
              {card.title}
            </p>
          </div>

          {!isOverlay && (
            <div
              className="relative z-60 shrink-0 overflow-visible"
              data-card-action
              data-card-menu-root
            >
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  setIsMenuOpen((open) => !open);
                }}
                className={`rounded-md p-1.5 text-slate-500 transition hover:bg-slate-900/10 hover:text-slate-900 ${
                  isMenuOpen
                    ? "opacity-100"
                    : "opacity-0 group-hover/card:opacity-100"
                }`}
              >
                <MoreHorizontal size={16} />
              </button>

              {isMenuOpen && onUpdate && (
                <CardMetaMenu
                  card={card}
                  onEdit={openCard}
                  onDelete={onDelete}
                  onUpdate={(patch) => {
                    onUpdate(patch);
                  }}
                  onClose={closeMenu}
                />
              )}
            </div>
          )}
        </div>

        {hasMeta && (
          <div
            className={`mt-1.5 flex flex-wrap items-center gap-1.5 transition-[padding] duration-200 ${
              showCompleteControl && isCompleted
                ? "pl-6"
                : showCompleteControl
                  ? "pl-0 group-hover/card:pl-6"
                  : ""
            }`}
          >
            {dueMeta && (
              <span
                className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium ${dueMeta.className}`}
              >
                <Clock size={12} className="shrink-0" />
                {dueMeta.label}
              </span>
            )}
            {hasDescription && (
              <span
                className="inline-flex items-center text-slate-600"
                title="This card has a description"
                aria-label="Has description"
              >
                <AlignLeft size={14} strokeWidth={2.25} />
              </span>
            )}
            {checklistTotal > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
                <CheckSquare size={12} />
                {checklistDone}/{checklistTotal}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CardItem({ card, onOpen, onDelete, onUpdate, onToggleComplete }) {
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

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnOutside = (event) => {
      if (event.target.closest("[data-card-menu-root]")) return;
      setIsMenuOpen(false);
    };
    window.addEventListener("mousedown", closeOnOutside);
    return () => window.removeEventListener("mousedown", closeOnOutside);
  }, [isMenuOpen]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`group relative overflow-visible rounded-lg ${
        isDragging ? "pointer-events-none opacity-100" : ""
      } ${isMenuOpen ? "z-80" : "z-0"}`}
    >
      <CardVisual
        card={card}
        onDelete={onDelete}
        onOpen={onOpen}
        onUpdate={onUpdate}
        onToggleComplete={onToggleComplete}
        dragListeners={listeners}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
    </div>
  );
}

export default CardItem;
