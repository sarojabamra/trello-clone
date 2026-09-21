import {
  normalizeLabels as normalizeLabelList,
} from "./cardLabelModel";

export function normalizeDueDate(value) {
  if (value == null || value === "") return null;

  if (typeof value === "string") {
    const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : null;
  }

  if (typeof value === "object") {
    if (typeof value.toDate === "function") {
      return value.toDate().toISOString().slice(0, 10);
    }
    if (typeof value.seconds === "number") {
      return new Date(value.seconds * 1000).toISOString().slice(0, 10);
    }
  }

  return null;
}

export function normalizeLabels(value) {
  return normalizeLabelList(value);
}

export function normalizeCard(card) {
  if (!card) return card;

  return {
    ...card,
    labels: normalizeLabels(card.labels),
    dueDate: normalizeDueDate(card.dueDate),
    completed: Boolean(card.completed),
    checklist: Array.isArray(card.checklist) ? card.checklist : [],
  };
}

export {
  getLabelColor,
  getLabelTitle,
  hasLabelColor,
  toggleLabelColor,
  updateLabelTitle,
} from "./cardLabelModel";
