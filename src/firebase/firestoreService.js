import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

export const addDocument = async (path, data) => {
  const collectionRef = collection(db, path);
  const docRef = await addDoc(collectionRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
};

export const getDocument = async (path, id) => {
  const docRef = doc(db, path, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

export const getDocuments = async (path, queryConstraints = []) => {
  const collectionRef = collection(db, path);
  const q = query(collectionRef, ...queryConstraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const updateDocument = async (path, id, updates) => {
  const docRef = doc(db, path, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteDocument = async (path, id) => {
  const docRef = doc(db, path, id);
  await deleteDoc(docRef);
};