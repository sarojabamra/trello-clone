import {
  addDocument,
  deleteDocument,
  getDocuments,
  updateDocument,
} from "../firebase/firestoreService";
import { orderBy, where } from "firebase/firestore";

export const getCardsByBoard = async (userId, boardId) => {
  if (!userId || !boardId) return [];
  return getDocuments(`users/${userId}/cards`, [
    where("boardId", "==", boardId),
    orderBy("position", "asc"),
  ]);
};

export const createCard = async (
  userId,
  { boardId, listId, title, description },
) => {
  if (!userId || !boardId || !listId || !title?.trim()) return null;

  const listCards = await getDocuments(`users/${userId}/cards`, [
    where("boardId", "==", boardId),
    where("listId", "==", listId),
  ]);

  const cardData = {
    boardId,
    listId,
    title: title.trim(),
    description: description?.trim() || "",
    position: listCards.length,
  };
  return addDocument(`users/${userId}/cards`, cardData);
};

export const updateCard = async (userId, cardId, updates) => {
  if (!userId || !cardId) return;
  await updateDocument(`users/${userId}/cards`, cardId, updates);
};

export const deleteCard = async (userId, cardId) => {
  if (!userId || !cardId) return;
  await deleteDocument(`users/${userId}/cards`, cardId);
};
