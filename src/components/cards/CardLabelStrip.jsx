import { useEffect, useState } from "react";

import { CARD_LABELS, getLabelBgClass } from "../../constants/cardLabels";
import {
  getLabelColor,
  getLabelTitle,
  hasLabelColor,
  toggleLabelColor,
  updateLabelTitle,
} from "../../utils/cardLabelModel";

function InlineLabelTitleInput({ value, onCommit }) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <input
      type="text"
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => onCommit(draft)}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
      onClick={(event) => event.stopPropagation()}
      placeholder="Title…"
      className="min-w-0 flex-1 rounded-r border border-l-0 border-slate-900/10 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30"
    />
  );
}

export function CardLabelPicker({ labels, onChange }) {
  const toggleLabel = (colorId) => {
    onChange(toggleLabelColor(labels, colorId));
  };

  const setLabelTitle = (colorId, title) => {
    const next = updateLabelTitle(labels, colorId, title);
    if (JSON.stringify(next) === JSON.stringify(labels)) return;
    onChange(next);
  };

  return (
    <div className="grid grid-cols-1 gap-1.5">
      {CARD_LABELS.map((label) => {
        const selected = hasLabelColor(labels, label.id);
        const title = getLabelTitle(
          labels.find((entry) => getLabelColor(entry) === label.id) ?? {
            color: label.id,
            title: "",
          },
        );

        if (!selected) {
          return (
            <button
              key={label.id}
              type="button"
              onClick={() => toggleLabel(label.id)}
              className={`flex h-8 w-full items-center justify-between rounded px-2 text-xs font-semibold text-white transition ${label.bg} ${label.hover}`}
            >
              {label.name}
            </button>
          );
        }

        return (
          <div
            key={label.id}
            className="flex h-8 w-full overflow-hidden rounded ring-2 ring-blue-600 ring-offset-1"
          >
            <button
              type="button"
              onClick={() => toggleLabel(label.id)}
              className={`flex shrink-0 items-center gap-1 px-2 text-xs font-semibold text-white ${label.bg} ${label.hover}`}
              title="Remove label"
            >
              <span>{label.name}</span>
              <span className="opacity-90">✓</span>
            </button>
            <InlineLabelTitleInput
              value={title}
              onCommit={(nextTitle) => setLabelTitle(label.id, nextTitle)}
            />
          </div>
        );
      })}
    </div>
  );
}

export function CardLabelStrip({ labels, className = "" }) {
  if (!labels?.length) return null;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {labels.map((entry) => {
        const color = getLabelColor(entry);
        const title = getLabelTitle(entry);

        if (title) {
          return (
            <span
              key={color}
              className={`inline-block max-w-full truncate rounded-sm px-2 py-0.5 text-[11px] font-semibold leading-4 text-white ${getLabelBgClass(color)}`}
            >
              {title}
            </span>
          );
        }

        return (
          <span
            key={color}
            className={`h-2 min-w-[40px] flex-1 rounded-sm ${getLabelBgClass(color)}`}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
