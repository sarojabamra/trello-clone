export const CARD_LABELS = [
  { id: "green", name: "Green", bg: "bg-emerald-400", hover: "hover:bg-emerald-500" },
  { id: "yellow", name: "Yellow", bg: "bg-yellow-400", hover: "hover:bg-yellow-500" },
  { id: "orange", name: "Orange", bg: "bg-orange-400", hover: "hover:bg-orange-500" },
  { id: "red", name: "Red", bg: "bg-red-400", hover: "hover:bg-red-500" },
  { id: "purple", name: "Purple", bg: "bg-violet-400", hover: "hover:bg-violet-500" },
  { id: "blue", name: "Blue", bg: "bg-blue-400", hover: "hover:bg-blue-500" },
  { id: "sky", name: "Sky", bg: "bg-sky-400", hover: "hover:bg-sky-500" },
  { id: "lime", name: "Lime", bg: "bg-lime-500", hover: "hover:bg-lime-600" },
  { id: "pink", name: "Pink", bg: "bg-pink-400", hover: "hover:bg-pink-500" },
  { id: "black", name: "Black", bg: "bg-slate-400", hover: "hover:bg-slate-500" },
];

export const getLabelById = (id) =>
  CARD_LABELS.find((label) => label.id === id) ?? null;

export const getLabelBgClass = (id) => getLabelById(id)?.bg ?? "bg-slate-400";
