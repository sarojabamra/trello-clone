import { useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";

function CreateBoardModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    onCreate(name.trim());

    setName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a new board">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="boardName"
          label="Board name"
          placeholder="e.g. Website Project"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">Create Board</Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateBoardModal;
