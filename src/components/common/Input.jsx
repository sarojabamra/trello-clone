function Input({
  label,
  id,
  error,
  required,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="ui-label">
          {label}
          {required ? <span className="text-red-600"> *</span> : null}
        </label>
      )}

      <input
        id={id}
        className={`ui-input ${error ? "ui-input-error" : ""} ${className}`}
        {...props}
      />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default Input;
