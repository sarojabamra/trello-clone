export function CardCompleteCheckbox({
  checked,
  className = "",
  size = "board",
  ...props
}) {
  const isModal = size === "modal";
  const isCompact = size === "compact";
  const buttonClass = isModal
    ? "size-5"
    : isCompact
      ? "size-4"
      : "size-[18px]";
  const iconClass = isModal ? "h-3 w-3" : isCompact ? "h-2 w-2" : "h-2.5 w-2.5";

  return (
    <button
      type="button"
      className={`box-border flex shrink-0 items-center justify-center rounded-full border-2 transition-[background-color,border-color,box-shadow] ${buttonClass} ${
        checked
          ? "border-emerald-700 bg-emerald-700 text-white shadow-none"
          : "border-slate-400 bg-white text-white shadow-sm hover:border-slate-600"
      } ${className}`}
      aria-checked={checked}
      {...props}
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden
        className={`${iconClass} fill-current transition-opacity duration-150 ${
          checked ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        <path d="M6.5 11.5 3 8l1.2-1.2 2.3 2.3 5.3-5.3L13 5z" />
      </svg>
    </button>
  );
}
