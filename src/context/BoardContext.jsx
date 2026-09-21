import { createContext, useContext, useEffect, useState } from "react";
import {
  createBoard,
  getBoardsByUser,
  deleteBoard,
} from "../services/boardService";
import { useAuth } from "./AuthContext";

const BoardContext = createContext(null);

export const useBoard = () => useContext(BoardContext);

export function BoardContextProvider({ children }) {
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
  const [boardDataNeedsRefresh, setBoardDataNeedsRefresh] = useState(false);
  const [isLoadingBoards, setIsLoadingBoards] = useState(true);

  useEffect(() => {
    const fetchBoards = async () => {
      if (!user?.id) {
        setBoards([]);
        setIsLoadingBoards(false);
        return;
      }

      setIsLoadingBoards(true);
      try {
        const userBoards = await getBoardsByUser(user.id);
        setBoards(userBoards);
      } catch (error) {
        console.error("Failed to fetch boards:", error);
        setBoards([]);
      } finally {
        setIsLoadingBoards(false);
      }
    };

    fetchBoards();
  }, [user?.id, boardDataNeedsRefresh]);

  const handleCreateBoard = async (name) => {
    if (!user?.id) return;

    const newBoard = await createBoard(user.id, { name });
    if (newBoard) {
      setBoards((prev) => [newBoard, ...prev]);
      setBoardDataNeedsRefresh((prev) => !prev);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (!user?.id) return;

    const confirmed = window.confirm(
      "Delete this board? This will also remove its lists and cards.",
    );
    if (!confirmed) return;

    await deleteBoard(user.id, boardId);
    setBoards((prev) => prev.filter((board) => board.id !== boardId));
    setBoardDataNeedsRefresh((prev) => !prev);
  };

  const handleBoardDataRefresh = () => {
    setBoardDataNeedsRefresh((prev) => !prev);
  };

  const value = {
    boards,
    isLoadingBoards,
    isCreateBoardModalOpen,
    setIsCreateBoardModalOpen,
    onCreateBoard: () => setIsCreateBoardModalOpen(true),
    onDeleteBoard: handleDeleteBoard,
    onCreateBoardSubmit: handleCreateBoard,
    onBoardDataRefresh: handleBoardDataRefresh,
  };

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
}
