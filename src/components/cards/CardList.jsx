import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CardItem from "./CardItem";

function CardList({ cards, onEditCard, onDeleteCard }) {
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
            onEdit={() => onEditCard(card)}
            onDelete={() => onDeleteCard(card.id)}
          />
        ))}
      </div>
    </SortableContext>
  );
}

export default CardList;
