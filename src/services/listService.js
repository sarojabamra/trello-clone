import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import {
  addDocument,
  deleteDocument,
  getDocuments,
  runBatch,
  updateDocument,
} from "../firebase/firestoreService";

export const getListsByBoard = async (userId, boardId) => {
  if (!userId || !boardId) return [];

  return getDocuments(`users/${userId}/lists`, [
    where("boardId", "==", boardId),
    orderBy("createdAt", "asc"),
  ]);
};

export const createList = async (userId, boardId, name) => {
  if (!userId || !boardId || !name?.trim()) return null;

  const listData = {
    boardId,
    name: name.trim(),
  };

  const newList = await addDocument(`users/${userId}/lists`, listData);

  await updateDocument(`users/${userId}/boards`, boardId, {
    listCount: increment(1),
  });

  return newList;
};

export const updateList = async (userId, listId, updates) => {
  if (!userId || !listId) return;
  await updateDocument(`users/${userId}/lists`, listId, updates);
};

export const deleteList = async (userId, boardId, listId) => {
  if (!userId || !boardId || !listId) return;

  await deleteDocument(`users/${userId}/lists`, listId);

  await updateDocument(`users/${userId}/boards`, boardId, {
    listCount: increment(-1),
  });
};
