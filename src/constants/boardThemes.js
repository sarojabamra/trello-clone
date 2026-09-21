export const DEFAULT_BOARD_THEME = "ocean";

export const BOARD_THEME_LIST = [
  { id: "ocean", label: "Ocean" },
  { id: "sunset", label: "Sunset" },
  { id: "forest", label: "Forest" },
  { id: "grape", label: "Grape" },
];

const VALID_THEME_IDS = new Set(BOARD_THEME_LIST.map((theme) => theme.id));

/** @param {string | null | undefined} themeId */
export function normalizeBoardThemeId(themeId) {
  if (themeId && VALID_THEME_IDS.has(themeId)) {
    return themeId;
  }
  return DEFAULT_BOARD_THEME;
}

/**
 * Full class strings (not composed at runtime) so Tailwind includes them in the build.
 * @param {string | null | undefined} themeId
 */
export function getBoardCardBackgroundClass(themeId) {
  switch (normalizeBoardThemeId(themeId)) {
    case "sunset":
      return "bg-linear-to-br from-orange-500 via-rose-500 to-pink-500";
    case "forest":
      return "bg-linear-to-br from-emerald-600 via-green-500 to-lime-400";
    case "grape":
      return "bg-linear-to-br from-violet-600 via-purple-500 to-fuchsia-400";
    case "ocean":
    default:
      return "bg-linear-to-br from-blue-600 via-blue-500 to-cyan-400";
  }
}

/** @param {string | null | undefined} themeId */
export function getBoardPageBackgroundClass(themeId) {
  switch (normalizeBoardThemeId(themeId)) {
    case "sunset":
      return "bg-linear-to-r from-orange-600 via-rose-600 to-pink-500";
    case "forest":
      return "bg-linear-to-r from-emerald-700 via-green-600 to-lime-500";
    case "grape":
      return "bg-linear-to-r from-violet-700 via-purple-600 to-fuchsia-500";
    case "ocean":
    default:
      return "bg-linear-to-r from-blue-700 via-blue-600 to-cyan-500";
  }
}

/** @param {string | null | undefined} themeId */
export function getBoardThemeSwatchClass(themeId) {
  switch (normalizeBoardThemeId(themeId)) {
    case "sunset":
      return "bg-linear-to-br from-orange-500 via-rose-500 to-pink-500";
    case "forest":
      return "bg-linear-to-br from-emerald-600 via-green-500 to-lime-400";
    case "grape":
      return "bg-linear-to-br from-violet-600 via-purple-500 to-fuchsia-400";
    case "ocean":
    default:
      return "bg-linear-to-br from-blue-600 via-blue-500 to-cyan-400";
  }
}

/** @deprecated use getBoardCardBackgroundClass */
export function resolveBoardTheme(themeId) {
  const id = normalizeBoardThemeId(themeId);
  return {
    id,
    label: BOARD_THEME_LIST.find((t) => t.id === id)?.label ?? "Ocean",
  };
}
