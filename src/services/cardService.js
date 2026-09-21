import {
  addDocument,
  deleteDocument,
  getDocuments,
  updateDocument,
} from "../firebase/firestoreService";
import { orderBy, where } from "firebase/firestore";
import { normalizeCard } from "../utils/cardNormalize";

export const getCardsByBoard = async (userId, boardId) => {
  if (!userId || !boardId) return [];
  const cards = await getDocuments(`users/${userId}/cards`, [
    where("boardId", "==", boardId),
    orderBy("position", "asc"),
  ]);
  return cards.map(normalizeCard);
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
    labels: [],
    dueDate: null,
    completed: false,
    checklist: [],
  };
  return normalizeCard(
    await addDocument(`users/${userId}/cards`, cardData),
  );
};

const sanitizeUpdates = (updates = {}) =>
  Object.fromEntries(
    Object.entries(updates).filter(([, value]) => value !== undefined),
  );

export const updateCard = async (userId, cardId, updates) => {
  if (!userId || !cardId) return;
  const sanitized = sanitizeUpdates(updates);
  if (Object.keys(sanitized).length === 0) return;
  await updateDocument(`users/${userId}/cards`, cardId, sanitized);
};

export const deleteCard = async (userId, cardId) => {
  if (!userId || !cardId) return;
  await deleteDocument(`users/${userId}/cards`, cardId);
};
