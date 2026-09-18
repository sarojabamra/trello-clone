const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary:
    "bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-400",
  danger: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-400",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
};

function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  ...props
}) {
  const customTextColorPattern =
    /(^|\s)text-(?:\[[^\]]+\]|white|black|current|transparent|inherit|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-[a-z0-9]+|-[0-9]+|\/[a-z0-9%]+)*/;
  const hasCustomTextColor = customTextColorPattern.test(className);
  const resolvedVariant = hasCustomTextColor ? "" : variants[variant];

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
        resolvedVariant
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
