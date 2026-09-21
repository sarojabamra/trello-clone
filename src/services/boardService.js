import { orderBy, where } from "firebase/firestore";
import { normalizeBoardThemeId } from "../constants/boardThemes";
import {
  addDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  updateDocument,
} from "../firebase/firestoreService";

export const getBoardsByUser = async (userId) => {
  if (!userId) return [];

  const [boards, allLists] = await Promise.all([
    getDocuments(`users/${userId}/boards`, [orderBy("createdAt", "asc")]),
    getDocuments(`users/${userId}/lists`),
  ]);

  const listCountByBoard = allLists.reduce((counts, list) => {
    const boardId = list.boardId;
    counts[boardId] = (counts[boardId] || 0) + 1;
    return counts;
  }, {});

  return boards.map((board) => ({
    ...board,
    listCount: listCountByBoard[board.id] ?? board.listCount ?? 0,
  }));
};

export const getBoardById = async (userId, boardId) => {
  if (!userId || !boardId) return null;
  return getDocument(`users/${userId}/boards`, boardId);
};

export const createBoard = async (userId, { name, theme }) => {
  if (!userId || !name?.trim()) return null;
  return addDocument(`users/${userId}/boards`, {
    name: name.trim(),
    theme: normalizeBoardThemeId(theme),
  });
};

export const deleteBoard = async (userId, boardId) => {
  if (!userId || !boardId) return;

  const listDocs = await getDocuments(`users/${userId}/lists`, [
    where("boardId", "==", boardId),
  ]);

  const cardDocs = await getDocuments(`users/${userId}/cards`, [
    where("boardId", "==", boardId),
  ]);

  await deleteDocument(`users/${userId}/boards`, boardId);

  await Promise.all([
    ...listDocs.map((doc) => deleteDocument(`users/${userId}/lists`, doc.id)),
    ...cardDocs.map((doc) => deleteDocument(`users/${userId}/cards`, doc.id)),
  ]);
};

export const updateBoard = async (userId, boardId, updates) => {
  if (!userId || !boardId) return;
  await updateDocument(`users/${userId}/boards`, boardId, updates);
};
