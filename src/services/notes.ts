import { addDoc, collection, deleteDoc, doc, getDocs, initializeFirestore, persistentLocalCache, updateDoc, waitForPendingWrites } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

export type NoteStatus = 'Important' | 'Normal';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  status: NoteStatus;
}

export type NoteDraft = Omit<Note, 'id'>;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);
const firebaseApp = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;
const db = firebaseApp ? initializeFirestore(firebaseApp, { localCache: persistentLocalCache() }) : null;
const storageKey = 'simple-notes-organizer-notes';

const readLocalNotes = (): Note[] => {
  const saved = localStorage.getItem(storageKey);
  try {
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const writeLocalNotes = (notes: Note[]) => localStorage.setItem(storageKey, JSON.stringify(notes));

export async function listNotes(): Promise<Note[]> {
  if (!db) return readLocalNotes();
  try {
    const snapshot = await getDocs(collection(db, 'notes'));
    const notes = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Note));
    writeLocalNotes(notes);
    return notes;
  } catch (error) {
    const cachedNotes = readLocalNotes();
    if (cachedNotes.length) return cachedNotes;
    throw error;
  }
}

export async function saveNote(note: NoteDraft, id?: string): Promise<Note> {
  if (!db) {
    const notes = readLocalNotes();
    const saved = { ...note, id: id ?? crypto.randomUUID() };
    writeLocalNotes(id ? notes.map((item) => item.id === id ? saved : item) : [saved, ...notes]);
    return saved;
  }
  if (id) {
    await updateDoc(doc(db, 'notes', id), note);
    await waitForPendingWrites(db);
    const saved = { ...note, id };
    writeLocalNotes(readLocalNotes().map((item) => item.id === id ? saved : item));
    return saved;
  }
  const created = await addDoc(collection(db, 'notes'), note);
  await waitForPendingWrites(db);
  const saved = { ...note, id: created.id };
  writeLocalNotes([saved, ...readLocalNotes()]);
  return saved;
}

export async function removeNote(id: string): Promise<void> {
  if (!db) {
    writeLocalNotes(readLocalNotes().filter((note) => note.id !== id));
    return;
  }
  await deleteDoc(doc(db, 'notes', id));
  await waitForPendingWrites(db);
  writeLocalNotes(readLocalNotes().filter((note) => note.id !== id));
}
