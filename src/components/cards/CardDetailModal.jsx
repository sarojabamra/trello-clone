import {
  AlignLeft,
  Calendar,
  CheckSquare,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { CARD_LABELS, getLabelBgClass } from "../../constants/cardLabels";
import {
  getLabelColor,
  getLabelTitle,
} from "../../utils/cardLabelModel";
import { CardLabelPicker } from "./CardLabelStrip";
import { CardCompleteCheckbox } from "./CardCompleteCheckbox";
import Button from "../common/Button";

function SidebarAction({ icon: Icon, label, onClick, onOverlay = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        onOverlay
          ? "flex w-full items-center gap-2 rounded-md bg-white/20 px-3 py-1.5 text-left text-sm font-medium text-white transition hover:bg-white/30"
          : "flex w-full items-center gap-2 rounded-md bg-slate-900/5 px-3 py-1.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-900/10"
      }
    >
      <Icon size={16} className={`shrink-0 ${onOverlay ? "text-white" : "text-slate-600"}`} />
      {label}
    </button>
  );
}

function CardDetailModal({
  isOpen,
  card,
  listName,
  onClose,
  onSave,
  onDelete,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [labels, setLabels] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [checklist, setChecklist] = useState([]);
  const [newCheckItem, setNewCheckItem] = useState("");
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  useEffect(() => {
    if (!card) return;
    setTitle(card.title ?? "");
    setDescription(card.description ?? "");
    setLabels(Array.isArray(card.labels) ? [...card.labels] : []);
    setDueDate(card.dueDate ?? "");
    setCompleted(Boolean(card.completed));
    setChecklist(Array.isArray(card.checklist) ? [...card.checklist] : []);
    setShowLabelPicker(false);
    setShowDatePicker(false);
    setShowChecklist(Array.isArray(card.checklist) && card.checklist.length > 0);
    setIsEditingDescription(false);
    setNewCheckItem("");
  }, [card?.id]);

  useEffect(() => {
    if (!card) return;
    setCompleted(Boolean(card.completed));
  }, [card?.completed, card?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !card) return null;

  const persist = (patch) => {
    const payload = {
      title: (patch.title ?? title).trim() || card.title,
      description: (patch.description ?? description).trim(),
      labels: patch.labels ?? labels,
      dueDate: patch.dueDate !== undefined ? patch.dueDate || null : dueDate || null,
      completed: patch.completed ?? completed,
      checklist: patch.checklist ?? checklist,
    };
    onSave(card.id, payload);
  };

  const handleTitleBlur = () => {
    if (title.trim() && title.trim() !== card.title) {
      persist({ title: title.trim() });
    }
  };

  const handleSaveDescription = () => {
    persist({ description: description.trim() });
    setIsEditingDescription(false);
  };

  const handleDueDateChange = (value) => {
    setDueDate(value);
    persist({ dueDate: value || null });
  };

  const handleCompletedToggle = () => {
    const next = !completed;
    setCompleted(next);
    onSave(card.id, { completed: next });
  };

  const addChecklistItem = () => {
    const text = newCheckItem.trim();
    if (!text) return;
    const item = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };
    const next = [...checklist, item];
    setChecklist(next);
    setNewCheckItem("");
    persist({ checklist: next });
  };

  const toggleChecklistItem = (itemId) => {
    const next = checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item,
    );
    setChecklist(next);
    persist({ checklist: next });
  };

  const removeChecklistItem = (itemId) => {
    const next = checklist.filter((item) => item.id !== itemId);
    setChecklist(next);
    persist({ checklist: next });
  };

  const checklistDone = checklist.filter((item) => item.completed).length;
  const checklistTotal = checklist.length;
  const checklistPercent =
    checklistTotal > 0
      ? Math.round((checklistDone / checklistTotal) * 100)
      : 0;

  const formattedDueDate = dueDate
    ? new Date(`${dueDate}T12:00:00`).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div
      className="fixed inset-0 z-[200] overflow-y-auto bg-slate-900/50 p-4 sm:p-8"
      onMouseDown={onClose}
      role="presentation"
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          className="relative my-auto flex w-full max-w-[952px] flex-col gap-3 md:flex-row md:items-start md:justify-center"
          onMouseDown={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="card-detail-title"
        >
        <div className="relative w-full min-w-0 max-w-[768px] shrink-0 rounded-lg bg-slate-100 shadow-xl">
          <button
            type="button"
            onClick={onClose}
            className="ui-ghost-icon absolute right-3 top-3 z-10"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="max-h-[85vh] overflow-y-auto rounded-lg bg-white p-4 sm:p-6">
          {listName && (
            <p className="mb-3 text-sm text-slate-600">
              in list <span className="underline">{listName}</span>
            </p>
          )}

          <div className="mb-4 grid grid-cols-[18px_minmax(0,1fr)] items-center gap-x-2.5 gap-y-0 pr-8">
            <CardCompleteCheckbox
              completed={completed}
              onToggle={handleCompletedToggle}
            />
            <textarea
              id="card-detail-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={handleTitleBlur}
              rows={1}
              className={`min-h-[24px] w-full resize-none overflow-hidden border-0 bg-transparent py-0 text-xl font-semibold leading-6 text-slate-900 outline-none placeholder:text-slate-500 ${
                completed ? "text-slate-500 line-through" : ""
              }`}
              placeholder="Card title"
            />
          </div>

          <div className="mb-4 flex flex-wrap gap-2 md:hidden">
            <Button
              variant="neutral"
              className="px-3 py-1.5 text-xs"
              onClick={() => setShowLabelPicker((open) => !open)}
            >
              Labels
            </Button>
            <Button
              variant="neutral"
              className="px-3 py-1.5 text-xs"
              onClick={() => setShowDatePicker((open) => !open)}
            >
              Dates
            </Button>
          </div>

          {(labels.length > 0 || dueDate || showLabelPicker || showDatePicker) && (
            <div className="mb-5 flex flex-wrap gap-6">
              {labels.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-slate-600">
                    Labels
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {labels.map((entry) => {
                      const color = getLabelColor(entry);
                      const customTitle = getLabelTitle(entry);
                      return (
                        <span
                          key={color}
                          className={`rounded px-2 py-1 text-xs font-semibold text-white ${getLabelBgClass(color)}`}
                        >
                          {customTitle ||
                            CARD_LABELS.find((l) => l.id === color)?.name ||
                            color}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {dueDate && (
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-slate-600">
                    Due date
                  </p>
                  <span
                    className={`inline-block rounded px-2 py-1 text-sm font-medium ${
                      completed
                        ? "bg-emerald-700 text-white line-through"
                        : "bg-slate-900/5 text-slate-900"
                    }`}
                  >
                    {formattedDueDate}
                  </span>
                </div>
              )}
            </div>
          )}

          {showLabelPicker && (
            <div className="mb-5 rounded-lg border border-slate-900/10 bg-slate-100 p-3">
              <p className="mb-2 text-xs font-semibold text-slate-600">Labels</p>
              <CardLabelPicker
                labels={labels}
                onChange={(next) => {
                  setLabels(next);
                  persist({ labels: next });
                }}
              />
            </div>
          )}

          {showDatePicker && (
            <div className="mb-5 rounded-lg border border-slate-900/10 bg-slate-100 p-3">
              <p className="mb-2 text-xs font-semibold text-slate-600">Due date</p>
              <input
                type="date"
                value={dueDate}
                onChange={(event) => handleDueDateChange(event.target.value)}
                className="w-full max-w-xs rounded border border-slate-900/10 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
              {dueDate && (
                <button
                  type="button"
                  onClick={() => handleDueDateChange("")}
                  className="mt-2 text-sm text-slate-600 underline hover:text-slate-900"
                >
                  Remove due date
                </button>
              )}
            </div>
          )}

          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2">
              <AlignLeft size={18} className="text-slate-600" />
              <h3 className="text-base font-semibold text-slate-900">
                Description
              </h3>
            </div>
            {isEditingDescription || !description ? (
              <div>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Add a more detailed description..."
                  rows={4}
                  className="w-full resize-none rounded-lg border border-slate-900/10 bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                />
                <div className="mt-2 flex gap-2">
                  <Button type="button" onClick={handleSaveDescription}>
                    Save
                  </Button>
                  {description && (
                    <Button
                      variant="neutral"
                      onClick={() => {
                        setDescription(card.description ?? "");
                        setIsEditingDescription(false);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingDescription(true)}
                className="w-full rounded-lg bg-slate-100 px-3 py-2 text-left text-sm leading-relaxed text-slate-900 transition hover:bg-slate-900/5"
              >
                <span className="whitespace-pre-wrap">{description}</span>
              </button>
            )}
          </div>

          {(checklistTotal > 0 || showChecklist) && (
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckSquare size={18} className="text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-900">
                    Checklist
                  </h3>
                </div>
                <span className="text-xs font-medium text-slate-600">
                  {checklistPercent}%
                </span>
              </div>
              <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-900/10">
                <div
                  className="h-full rounded-full bg-blue-400 transition-all duration-300"
                  style={{ width: `${checklistPercent}%` }}
                />
              </div>
              <ul className="space-y-1">
                {checklist.map((item) => (
                  <li
                    key={item.id}
                    className="group flex items-start gap-2 rounded-md py-1 hover:bg-slate-900/5"
                  >
                    <CardCompleteCheckbox
                      size="compact"
                      checked={item.completed}
                      onClick={() => toggleChecklistItem(item.id)}
                      className="mt-0.5"
                      aria-label={
                        item.completed
                          ? "Mark checklist item incomplete"
                          : "Mark checklist item complete"
                      }
                    />
                    <span
                      className={`flex-1 text-sm ${
                        item.completed
                          ? "text-slate-500 line-through"
                          : "text-slate-900"
                      }`}
                    >
                      {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeChecklistItem(item.id)}
                      className="rounded p-1 text-slate-500 opacity-0 transition hover:bg-slate-900/10 group-hover:opacity-100"
                      aria-label="Remove item"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={newCheckItem}
                  onChange={(event) => setNewCheckItem(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addChecklistItem();
                    }
                  }}
                  placeholder="Add an item"
                  className="flex-1 rounded border border-slate-900/10 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
                <Button type="button" onClick={addChecklistItem}>
                  Add
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-2 border-t border-slate-900/10 pt-4 md:hidden">
            <Button variant="danger" onClick={() => onDelete(card.id)}>
              Delete card
            </Button>
          </div>
          </div>
        </div>

        <div className="hidden w-[168px] shrink-0 flex-col gap-2 md:flex">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-white/90">
            Add to card
          </p>
          <SidebarAction
            onOverlay
            icon={Tag}
            label="Labels"
            onClick={() => {
              setShowLabelPicker(true);
              setShowDatePicker(false);
            }}
          />
          <SidebarAction
            onOverlay
            icon={Calendar}
            label="Dates"
            onClick={() => {
              setShowDatePicker(true);
              setShowLabelPicker(false);
            }}
          />
          <SidebarAction
            onOverlay
            icon={CheckSquare}
            label="Checklist"
            onClick={() => setShowChecklist(true)}
          />
          <p className="mt-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-white/90">
            Actions
          </p>
          <SidebarAction
            onOverlay
            icon={Trash2}
            label="Delete"
            onClick={() => {
              onDelete(card.id);
              onClose();
            }}
          />
        </div>
      </div>
      </div>
    </div>
  );
}

export default CardDetailModal;
