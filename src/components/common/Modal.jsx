import { X } from "lucide-react";

function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-md",
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[1px]"
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        className={`w-full ${maxWidth} overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/10`}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-900/10 bg-linear-to-b from-slate-50 to-white px-5 py-4 sm:px-6">
          <div>
            <h2
              id="modal-title"
              className="text-lg font-semibold tracking-tight text-slate-900"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ui-ghost-icon"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
