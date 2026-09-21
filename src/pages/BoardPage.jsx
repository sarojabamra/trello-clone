import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { MoreHorizontal, Star, Zap } from "lucide-react";
import { RiBarChart2Line } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Loader from "../components/common/Loader";
import CardDetailModal from "../components/cards/CardDetailModal";
import { CardVisual } from "../components/cards/CardItem";
import BoardListColumn from "../components/lists/BoardListColumn";
import AddList from "../components/lists/AddList";
import RenameListModal from "../components/lists/RenameListModal";
import { getBoardById } from "../services/boardService";
import {
  createList,
  deleteList,
  getListsByBoard,
  updateList,
} from "../services/listService";
import {
  createCard,
  deleteCard,
  getCardsByBoard,
  updateCard,
} from "../services/cardService";
import { BsPersonPlus } from "react-icons/bs";
import { LuPlug } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { MdFilterList } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useBoard } from "../context/BoardContext";
import { normalizeCard } from "../utils/cardNormalize";
import { getBoardPageBackgroundClass } from "../constants/boardThemes";

function BoardPage() {
  const { user } = useAuth();
  const { onBoardDataRefresh } = useBoard();
  const { boardId } = useParams();
  const [boardName, setBoardName] = useState("My Board");
  const [boardThemeId, setBoardThemeId] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [isLoadingBoard, setIsLoadingBoard] = useState(true);
  const [boardNotFound, setBoardNotFound] = useState(false);
  const [activeCardId, setActiveCardId] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [renameList, setRenameList] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const sortCardsByPosition = (items = []) =>
    [...items].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  useEffect(() => {
    const fetchBoardData = async () => {
      if (!user?.id || !boardId) {
        setBoardName("My Board");
        setBoardNotFound(true);
        setLists([]);
        setCards([]);
        setIsLoadingBoard(false);
        return;
      }

      setIsLoadingBoard(true);
      setBoardNotFound(false);

      try {
        const [board, boardLists, boardCards] = await Promise.all([
          getBoardById(user.id, boardId),
          getListsByBoard(user.id, boardId),
          getCardsByBoard(user.id, boardId),
        ]);

        if (!board) {
          setBoardNotFound(true);
          setBoardName("Board not found");
          setLists([]);
          setCards([]);
          return;
        }

        setBoardName(board.name);
        setBoardThemeId(board.theme ?? null);
        setLists(boardLists);
        setCards(boardCards);
      } catch (error) {
        console.error("Failed to load board data:", error);
        setBoardName("Board not found");
        setBoardNotFound(true);
        setLists([]);
        setCards([]);
      } finally {
        setIsLoadingBoard(false);
      }
    };

    fetchBoardData();
  }, [boardId, user?.id]);

  const handleAddList = async (name) => {
    if (!user?.id) return;

    const newList = await createList(user.id, boardId, name);
    if (newList) {
      setLists((prev) => [...prev, newList]);
      onBoardDataRefresh();
    }
  };

  const handleAddCard = async (listId, title) => {
    if (!user?.id) return;

    const newCard = await createCard(user.id, {
      boardId,
      listId,
      title,
      description: "",
    });

    if (newCard) {
      setCards((prev) => {
        const updated = [
          ...prev,
          { ...newCard, position: newCard.position ?? prev.length },
        ];
        return sortCardsByPosition(updated);
      });
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!user?.id) return;

    await deleteCard(user.id, cardId);
    setCards((prev) => prev.filter((card) => card.id !== cardId));
    setSelectedCardId((current) => (current === cardId ? null : current));
  };

  const handleDeleteList = async (listId) => {
    if (!user?.id) return;

    await deleteList(user.id, boardId, listId);
    setLists((prev) => prev.filter((list) => list.id !== listId));
    setCards((prev) => prev.filter((card) => card.listId !== listId));
    onBoardDataRefresh();
  };

  const handleEditList = (list) => {
    setRenameList(list);
  };

  const handleSaveListName = async (trimmed) => {
    if (!user?.id || !renameList?.id || !trimmed) return;

    await updateList(user.id, renameList.id, { name: trimmed });
    setLists((prev) =>
      prev.map((item) =>
        item.id === renameList.id ? { ...item, name: trimmed } : item,
      ),
    );
  };

  const handleOpenCard = (card) => {
    setSelectedCardId(card.id);
  };

  const handleUpdateCard = async (cardId, updates) => {
    if (!user?.id) return;

    await updateCard(user.id, cardId, updates);
    setCards((prev) =>
      prev.map((item) =>
        item.id === cardId ? normalizeCard({ ...item, ...updates }) : item,
      ),
    );
  };

  const handlePatchCard = async (cardId, patch) => {
    if (!user?.id || !patch || Object.keys(patch).length === 0) return;
    await handleUpdateCard(cardId, patch);
  };

  const handleToggleComplete = async (cardId) => {
    const card = cards.find((item) => item.id === cardId);
    if (!card || !user?.id) return;

    const completed = !card.completed;
    await updateCard(user.id, cardId, { completed });
    setCards((prev) =>
      prev.map((item) =>
        item.id === cardId ? { ...item, completed } : item,
      ),
    );
  };

  const activeCard = cards.find((card) => card.id === activeCardId) ?? null;
  const selectedCard =
    cards.find((card) => card.id === selectedCardId) ?? null;
  const selectedListName =
    lists.find((list) => list.id === selectedCard?.listId)?.name ?? "";

  const handleDragStart = ({ active }) => {
    setActiveCardId(active.id);
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveCardId(null);
    if (!over || !user?.id) return;

    const activeId = active.id;
    const overId = over.id;
    const activeCard = cards.find((card) => card.id === activeId);
    if (!activeCard) return;

    const overCard = cards.find((card) => card.id === overId);
    const overList = lists.find((list) => list.id === overId);
    const targetListId = overCard?.listId ?? overList?.id ?? activeCard.listId;

    if (activeCard.listId === targetListId) {
      const listCards = sortCardsByPosition(
        cards.filter((card) => card.listId === targetListId),
      );
      const oldIndex = listCards.findIndex((card) => card.id === activeId);
      const newIndex = listCards.findIndex((card) => card.id === overId);

      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(listCards, oldIndex, newIndex);
      const updatedCards = cards.map((card) => {
        if (card.listId !== targetListId) return card;
        const index = reordered.findIndex((item) => item.id === card.id);
        return { ...card, position: index };
      });

      setCards(sortCardsByPosition(updatedCards));

      await Promise.all(
        reordered.map((card, index) =>
          updateCard(user.id, card.id, {
            listId: targetListId,
            position: index,
          }),
        ),
      );

      return;
    }

    const sourceCards = sortCardsByPosition(
      cards.filter(
        (card) => card.listId === activeCard.listId && card.id !== activeId,
      ),
    );
    const targetCards = sortCardsByPosition(
      cards.filter((card) => card.listId === targetListId),
    );

    const insertIndex = overCard
      ? targetCards.findIndex((card) => card.id === overId)
      : targetCards.length;

    const movedCard = {
      ...activeCard,
      listId: targetListId,
      position: insertIndex >= 0 ? insertIndex : targetCards.length,
    };

    const nextTargetCards = [...targetCards];
    nextTargetCards.splice(
      insertIndex >= 0 ? insertIndex : nextTargetCards.length,
      0,
      movedCard,
    );

    const nextSourceCards = sourceCards.map((card, index) => ({
      ...card,
      position: index,
    }));

    const nextTargetCardsWithPositions = nextTargetCards.map((card, index) => ({
      ...card,
      position: index,
    }));

    const remainingCards = cards.filter(
      (card) =>
        card.id !== activeId &&
        card.listId !== activeCard.listId &&
        card.listId !== targetListId,
    );

    const nextCards = [
      ...remainingCards,
      ...nextSourceCards,
      ...nextTargetCardsWithPositions,
    ];

    setCards(sortCardsByPosition(nextCards));

    await Promise.all(
      [...nextSourceCards, ...nextTargetCardsWithPositions].map((card) =>
        updateCard(user.id, card.id, {
          listId: card.listId,
          position: card.position,
        }),
      ),
    );
  };

  const pageBgClass = getBoardPageBackgroundClass(boardThemeId);

  return (
    <div className={`flex h-screen flex-col text-slate-900 ${pageBgClass}`}>
      <header className="bg-slate-600/50 px-3 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="-ms-1 truncate text-base font-bold text-white sm:text-xl">
                {boardName || "New Board"}
              </h1>

              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-white transition hover:bg-white/10"
                aria-label="Board options"
              >
                <RiBarChart2Line className="rotate-180" size={19} />
                <IoIosArrowDown size={17} />
              </button>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 text-white">
            {user && (
              <div className="ui-user-avatar-sm group relative mx-1">
                {user.name
                  ?.split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase())
                  .join("") || "U"}

                <span className="ui-tooltip text-[10px]">
                  {user.name || "User"}
                </span>
              </div>
            )}

            <button
              className="ui-board-icon-btn hidden sm:flex"
              aria-label="Integrations"
            >
              <LuPlug size={18} />
            </button>

            <button
              className="ui-board-icon-btn hidden md:flex"
              aria-label="Automation"
            >
              <Zap size={18} />
            </button>

            <button
              className="ui-board-icon-btn hidden sm:flex"
              aria-label="Filter"
            >
              <MdFilterList size={20} />
            </button>

            <button
              className="ui-board-icon-btn hidden lg:flex"
              aria-label="Favorite"
            >
              <Star size={18} />
            </button>

            <button
              className="ui-board-icon-btn hidden md:flex"
              aria-label="Members"
            >
              <FiUsers size={18} />
            </button>

            <button
              type="button"
              className="mx-1 inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-2.5 py-1.5 text-sm font-medium text-white transition hover:bg-white/30 sm:px-3"
            >
              <BsPersonPlus size={17} />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              className="ui-board-icon-btn flex"
              aria-label="More options"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden px-3 pb-8 pt-4 sm:px-6 lg:px-8">
        {isLoadingBoard ? (
          <Loader textColor="white" message="Loading board details..." />
        ) : boardNotFound ? (
          <div className="flex min-h-[calc(100vh-180px)] items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold text-slate-900">
                Board not found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                This board may have been deleted or you may not have access to
                it.
              </p>

              <Link
                to="/"
                className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="mx-auto h-full max-w-[1800px] overflow-x-auto pb-2">
              <div className="relative z-0 flex h-full w-max min-w-full items-start gap-3 overflow-visible sm:gap-4">
                {lists.map((list) => {
                  const listCards = sortCardsByPosition(
                    cards.filter((card) => card.listId === list.id),
                  );

                  return (
                    <BoardListColumn
                      key={list.id}
                      list={list}
                      cards={listCards}
                      onAddCard={handleAddCard}
                      onEditList={handleEditList}
                      onDeleteList={handleDeleteList}
                      onDeleteCard={handleDeleteCard}
                      onOpenCard={handleOpenCard}
                      onUpdateCard={handlePatchCard}
                      onToggleComplete={handleToggleComplete}
                    />
                  );
                })}

                <AddList onAdd={handleAddList} />
              </div>
            </div>

            <DragOverlay>
              {activeCard ? <CardVisual card={activeCard} isOverlay /> : null}
            </DragOverlay>
          </DndContext>
        )}
      </main>

      <CardDetailModal
        key={selectedCardId ?? "closed"}
        isOpen={Boolean(selectedCard)}
        card={selectedCard}
        listName={selectedListName}
        onClose={() => setSelectedCardId(null)}
        onSave={handleUpdateCard}
        onDelete={handleDeleteCard}
      />

      <RenameListModal
        isOpen={Boolean(renameList)}
        list={renameList}
        onClose={() => setRenameList(null)}
        onSave={handleSaveListName}
      />
    </div>
  );
}

export default BoardPage;
