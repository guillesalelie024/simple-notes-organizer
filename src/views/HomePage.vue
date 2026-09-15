<template>
  <ion-page>
    <NotesHeaderComponents @new-note="openNewNote" />
    <ion-content>
      <main class="workspace">
        <NotesFiltersComponents v-model:search="search" v-model:filter="filter" :note-count="notes.length" />
        <NotesListComponents :notes="filteredNotes" :loading="loading" @edit="editNote" @new-note="openNewNote" />
      </main>

      <NoteEditor :is-open="isEditorOpen" :editing-id="editingId" :model-value="form" @close="closeEditor" @save="submitNote" @delete="deleteCurrentNote" />
      <NotesToastComponents :is-open="Boolean(successMessage)" :message="successMessage" color="success" @close="successMessage = ''" />
      <NotesToastComponents :is-open="Boolean(errorMessage)" :message="errorMessage" color="danger" @close="errorMessage = ''" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';
import NotesHeaderComponents from '../components/NotesHeaderComponents.vue';
import NotesFiltersComponents from '../components/NotesFiltersComponents.vue';
import NotesListComponents from '../components/NotesListComponents.vue';
import NoteEditor from '../components/NoteEditorComponents.vue';
import NotesToastComponents from '../components/NotesToastComponents.vue';
import { listNotes, removeNote, saveNote, type Note, type NoteDraft, type NoteStatus } from '../services/notes';

const notes = ref<Note[]>([]);
const loading = ref(true);
const search = ref('');
const filter = ref('All');
const isEditorOpen = ref(false);
const editingId = ref<string>();
const errorMessage = ref('');
const successMessage = ref('');
const form = reactive<NoteDraft>({ title: '', content: '', category: '', createdAt: new Date().toISOString(), status: 'Normal' });

const filteredNotes = computed(() => notes.value.filter((note) => {
  const matchesFilter = filter.value === 'All' || note.status === filter.value;
  const query = search.value.toLowerCase();
  return matchesFilter && (!query || `${note.title} ${note.content} ${note.category}`.toLowerCase().includes(query));
}));

onMounted(async () => {
  try {
    notes.value = await listNotes();
  } catch (error) {
    errorMessage.value = `Could not load notes: ${getErrorMessage(error)}`;
  } finally {
    loading.value = false;
  }
});

const openNewNote = () => { editingId.value = undefined; Object.assign(form, { title: '', content: '', category: '', status: 'Normal' }); isEditorOpen.value = true; };
const editNote = (note: Note) => { editingId.value = note.id; Object.assign(form, note); isEditorOpen.value = true; };
const closeEditor = () => { isEditorOpen.value = false; };
const deleteCurrentNote = async () => {
  if (!editingId.value) return;
  try {
    await removeNote(editingId.value);
    notes.value = notes.value.filter((note) => note.id !== editingId.value);
    closeEditor();
    successMessage.value = 'Note deleted successfully.';
  } catch (error) {
    errorMessage.value = `Could not delete note: ${getErrorMessage(error)}`;
  }
};
const submitNote = async (draft: NoteDraft) => {
  try {
    const saved = await saveNote(draft, editingId.value);
    const wasEditing = Boolean(editingId.value);
    notes.value = editingId.value ? notes.value.map((note) => note.id === saved.id ? saved : note) : [saved, ...notes.value];
    closeEditor();
    successMessage.value = wasEditing ? 'Note updated successfully.' : 'Note saved successfully.';
  } catch (error) {
    errorMessage.value = `Could not save note: ${getErrorMessage(error)}`;
  }
};
const getErrorMessage = (error: unknown) => error instanceof Error ? error.message : String(error);
</script>

<style scoped>
.workspace { max-width: 1160px; margin: 0 auto; padding: 54px 28px 80px; }
@media (max-width: 760px) { .workspace { padding: 30px 18px 60px; } }
</style>
