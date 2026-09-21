import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  MoreHorizontal,
  Star,
  Zap,
} from "lucide-react";
import { RiBarChart2Line } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Loader from "../components/common/Loader";
import { CardVisual } from "../components/cards/CardItem";
import BoardListColumn from "../components/lists/BoardListColumn";
import AddList from "../components/lists/AddList";
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

function BoardPage({ user, onBoardDataRefresh }) {
  const { boardId } = useParams();
  const [boardName, setBoardName] = useState("My Board");
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [isLoadingBoard, setIsLoadingBoard] = useState(true);
  const [boardNotFound, setBoardNotFound] = useState(false);
  const [activeCardId, setActiveCardId] = useState(null);

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
  };

  const handleDeleteList = async (listId) => {
    if (!user?.id) return;

    await deleteList(user.id, boardId, listId);
    setLists((prev) => prev.filter((list) => list.id !== listId));
    setCards((prev) => prev.filter((card) => card.listId !== listId));
    onBoardDataRefresh();
  };

  const handleEditList = async (list) => {
    const newName = window.prompt("Enter new list name:", list.name);
    if (!newName?.trim() || !user?.id) return;

    const trimmed = newName.trim();
    await updateList(user.id, list.id, { name: trimmed });
    setLists((prev) =>
      prev.map((item) =>
        item.id === list.id ? { ...item, name: trimmed } : item,
      ),
    );
  };

  const handleEditCard = async (card) => {
    const newTitle = window.prompt("Enter new card title:", card.title);
    if (!newTitle?.trim() || !user?.id) return;

    const trimmed = newTitle.trim();
    await updateCard(user.id, card.id, { title: trimmed });
    setCards((prev) =>
      prev.map((item) =>
        item.id === card.id ? { ...item, title: trimmed } : item,
      ),
    );
  };

  const activeCard = cards.find((card) => card.id === activeCardId) ?? null;

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

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-700 via-blue-600 to-cyan-500 text-slate-800">
      <header className="  bg-slate-600/50 px-3 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex items-center gap-2">
              <h1 className="-ms-1 truncate text-xl font-bold text-white">
                {boardName || "New Board"}
              </h1>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-white transition hover:bg-white/10 hover:text-white"
                aria-label="Board options"
              >
                <RiBarChart2Line className="rotate-180" size={20} />
                <IoIosArrowDown size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 text-white">
            {user && (
              <div className="group relative mx-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                {user.name
                  ?.split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase())
                  .join("") || "U"}

                <span className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] text-white opacity-0 shadow-md transition group-hover:opacity-100">
                  {user.name || "User"}
                </span>
              </div>
            )}
            <button className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/10">
              <LuPlug size={18} />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/10">
              <Zap size={18} />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/10">
              <MdFilterList size={20} />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/10">
              <Star size={18} />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/10">
              <FiUsers size={18} />
            </button>

            <button className="inline-flex mx-1 items-center text-black gap-2 rounded-md bg-slate-300 hover:bg-white px-3 py-1.5 text-sm font-medium transition">
              <BsPersonPlus size={18} />
              Share
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/10">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="px-3 pb-8 pt-4 sm:px-6 lg:px-8">
        {isLoadingBoard ? (
          <Loader textColor="white" message="Loading board details..." />
        ) : boardNotFound ? (
          <div className="flex min-h-[calc(100vh-180px)] items-center justify-center px-4">
            <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-slate-800">
                Board not found
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                This board may have been deleted or you may not have access to
                it.
              </p>
              <Link
                to="/"
                className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
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
            <div className="mx-auto max-w-[1800px] overflow-x-auto overflow-y-visible pb-2">
              <div className="relative z-0 flex min-h-[calc(100vh-120px)] items-start gap-4 overflow-visible">
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
                      onEditCard={handleEditCard}
                      onDeleteCard={handleDeleteCard}
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
    </div>
  );
}

export default BoardPage;
