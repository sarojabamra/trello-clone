import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CardItem from "./CardItem";

function CardList({
  cards,
  onDeleteCard,
  onOpenCard,
  onUpdateCard,
  onToggleComplete,
}) {
  return (
    <SortableContext
      items={cards.map((card) => card.id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="space-y-2">
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onOpen={() => onOpenCard(card)}
            onDelete={() => onDeleteCard(card.id)}
            onUpdate={(patch) => onUpdateCard(card.id, patch)}
            onToggleComplete={() => onToggleComplete(card.id)}
          />
        ))}
      </div>
    </SortableContext>
  );
}

export default CardList;
