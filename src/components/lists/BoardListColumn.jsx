import { useDroppable } from "@dnd-kit/core";

import ListHeader from "./ListHeader";
import CardList from "../cards/CardList";
import AddCard from "../cards/AddCard";

function BoardListColumn({
  list,
  cards,
  onAddCard,
  onEditList,
  onDeleteList,
  onDeleteCard,
  onOpenCard,
  onUpdateCard,
  onToggleComplete,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative z-0 flex w-72.5 shrink-0 flex-col overflow-visible rounded-xl border border-white/20 bg-slate-100/95 p-3 shadow-sm transition ${
        isOver ? "border-blue-300 bg-blue-50" : ""
      }`}
    >
      <ListHeader
        list={list}
        cardCount={cards.length}
        onEdit={() => onEditList(list)}
        onDelete={() => onDeleteList(list.id)}
      />

      <div className="overflow-visible">
        <CardList
          cards={cards}
          onDeleteCard={onDeleteCard}
          onOpenCard={onOpenCard}
          onUpdateCard={onUpdateCard}
          onToggleComplete={onToggleComplete}
        />
      </div>

      <AddCard onAdd={(title) => onAddCard(list.id, title)} />
    </div>
  );
}

export default BoardListColumn;
