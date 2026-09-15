import { initializeApp } from 'firebase/app';
import { get, getDatabase, push, ref, remove, set } from 'firebase/database';

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
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

export const firebaseConfigured = Object.values(firebaseConfig).every(Boolean);
const app = firebaseConfigured ? initializeApp(firebaseConfig) : null;
const database = app ? getDatabase(app) : null;
const notesReference = database ? ref(database, 'notes') : null;
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
  if (!notesReference) return readLocalNotes();
  const snapshot = await get(notesReference);
  const data = snapshot.val() as Record<string, Note> | null;
  const notes = data ? Object.entries(data).map(([id, note]) => ({ ...note, id })) : [];
  writeLocalNotes(notes);
  return notes;
}

export async function saveNote(note: NoteDraft, id?: string): Promise<Note> {
  if (!notesReference || !database) {
    const notes = readLocalNotes();
    const saved = { ...note, id: id ?? crypto.randomUUID() };
    writeLocalNotes(id ? notes.map((item) => item.id === id ? saved : item) : [saved, ...notes]);
    return saved;
  }

  const noteReference = id ? ref(database, `notes/${id}`) : push(notesReference);
  const saved = { ...note, id: noteReference.key as string };
  await set(noteReference, note);
  writeLocalNotes(id ? readLocalNotes().map((item) => item.id === id ? saved : item) : [saved, ...readLocalNotes()]);
  return saved;
}

export async function removeNote(id: string): Promise<void> {
  if (!notesReference || !database) {
    writeLocalNotes(readLocalNotes().filter((note) => note.id !== id));
    return;
  }
  await remove(ref(database, `notes/${id}`));
  writeLocalNotes(readLocalNotes().filter((note) => note.id !== id));
}
