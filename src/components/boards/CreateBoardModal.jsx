import { useEffect, useState } from "react";
import { LayoutGrid } from "lucide-react";

import {
  BOARD_THEME_LIST,
  DEFAULT_BOARD_THEME,
  getBoardCardBackgroundClass,
  getBoardThemeSwatchClass,
  normalizeBoardThemeId,
} from "../../constants/boardThemes";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";

function CreateBoardModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [themeId, setThemeId] = useState(DEFAULT_BOARD_THEME);

  useEffect(() => {
    if (!isOpen) return;
    setName("");
    setThemeId(DEFAULT_BOARD_THEME);
  }, [isOpen]);

  const previewBgClass = getBoardCardBackgroundClass(themeId);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      theme: normalizeBoardThemeId(themeId),
    });
    setName("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create board"
      description="Boards keep tasks organized."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className={`relative overflow-hidden rounded-xl p-4 text-white shadow-inner ${previewBgClass}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <LayoutGrid size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-white/80">
                Preview
              </p>
              <p className="mt-1 truncate text-lg font-semibold">
                {name.trim() || "Your board name"}
              </p>
            </div>
          </div>
        </div>

        <Input
          id="boardName"
          label="Board title"
          placeholder="e.g. Product launch"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoFocus
        />

        <div>
          <p className="ui-label mb-2">Background</p>
          <div className="flex flex-wrap gap-2">
            {BOARD_THEME_LIST.map((theme) => {
              const swatchClass = getBoardThemeSwatchClass(theme.id);
              const isSelected = themeId === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setThemeId(theme.id)}
                  className={`h-9 w-14 rounded-lg ring-offset-2 transition hover:scale-[1.02] ${swatchClass} ${
                    isSelected
                      ? "ring-2 ring-blue-600"
                      : "ring-1 ring-slate-900/10"
                  }`}
                  aria-label={`Select ${theme.label} background`}
                  title={theme.label}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            variant="neutral"
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!name.trim()}>
            Create board
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateBoardModal;
