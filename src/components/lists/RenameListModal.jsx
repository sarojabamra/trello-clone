import { useEffect, useState } from "react";

import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";

function RenameListModal({ isOpen, list, onClose, onSave }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!isOpen || !list) return;
    setName(list.name ?? "");
  }, [isOpen, list?.id, list?.name]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!list) return;
    const trimmed = name.trim();
    if (!trimmed || trimmed === list.name) {
      onClose();
      return;
    }
    onSave(trimmed);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen && Boolean(list)}
      onClose={onClose}
      title="Rename list"
      description="Lists group cards into stages."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="listName"
          label="List name"
          placeholder="e.g. In progress"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoFocus
        />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button variant="neutral" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!name.trim()}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default RenameListModal;
