import { CARD_LABELS } from "../constants/cardLabels";

const validLabelIds = new Set(CARD_LABELS.map((label) => label.id));

export function normalizeLabelEntry(entry) {
  if (typeof entry === "string" && validLabelIds.has(entry)) {
    return { color: entry, title: "" };
  }

  if (entry && typeof entry === "object") {
    const color = entry.color ?? entry.id ?? entry.colorId;
    if (validLabelIds.has(color)) {
      return {
        color,
        title: String(entry.title ?? entry.name ?? "").trim(),
      };
    }
  }

  return null;
}

export function normalizeLabels(value) {
  if (!Array.isArray(value)) return [];

  const seen = new Set();
  const normalized = [];

  for (const entry of value) {
    const label = normalizeLabelEntry(entry);
    if (!label || seen.has(label.color)) continue;
    seen.add(label.color);
    normalized.push(label);
  }

  return normalized;
}

export function getLabelColor(entry) {
  if (typeof entry === "string") return entry;
  return entry?.color ?? "";
}

export function getLabelTitle(entry) {
  if (typeof entry === "string") return "";
  return entry?.title ?? "";
}

export function hasLabelColor(labels, colorId) {
  return labels.some((entry) => getLabelColor(entry) === colorId);
}

export function toggleLabelColor(labels, colorId) {
  if (hasLabelColor(labels, colorId)) {
    return labels.filter((entry) => getLabelColor(entry) !== colorId);
  }
  return [...labels, { color: colorId, title: "" }];
}

export function updateLabelTitle(labels, colorId, title) {
  return labels.map((entry) =>
    getLabelColor(entry) === colorId
      ? { color: colorId, title: title.trim() }
      : entry,
  );
}
