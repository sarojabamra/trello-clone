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
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

// Generic function to add a document
export const addDocument = async (path, data) => {
  const collectionRef = collection(db, path);
  const docRef = await addDoc(collectionRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
};

// Generic function to get a document by ID
export const getDocument = async (path, id) => {
  const docRef = doc(db, path, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

// Generic function to get documents with optional queries
export const getDocuments = async (path, queryConstraints = []) => {
  const collectionRef = collection(db, path);
  const q = query(collectionRef, ...queryConstraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Generic function to update a document
export const updateDocument = async (path, id, updates) => {
  const docRef = doc(db, path, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

// Generic function to delete a document
export const deleteDocument = async (path, id) => {
  const docRef = doc(db, path, id);
  await deleteDoc(docRef);
};

// Generic function for batch operations
export const runBatch = async (operations) => {
  const batch = writeBatch(db);
  operations.forEach((op) => {
    const docRef = doc(db, op.path, op.id);
    if (op.type === "delete") {
      batch.delete(docRef);
    } else if (op.type === "update") {
      batch.update(docRef, op.data);
    } else if (op.type === "set") {
      batch.set(docRef, op.data);
    }
  });
  await batch.commit();
};
