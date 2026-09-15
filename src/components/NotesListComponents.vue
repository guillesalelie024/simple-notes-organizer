<template>
  <div v-if="loading" class="empty-state">Loading your notes...</div>
  <section v-else-if="notes.length" class="notes-grid">
    <NoteCardComponents v-for="note in notes" :key="note.id" :note="note" @edit="$emit('edit', $event)" />
  </section>
  <section v-else class="empty-state">
    <ion-icon :icon="createOutline" />
    <h2>{{ searchActive ? 'No notes found' : 'No notes here yet' }}</h2>
    <p>{{ searchActive ? 'Try a different search term.' : 'Capture the next idea before it wanders off.' }}</p>
    <ion-button fill="outline" @click="$emit('new-note')">Create a note</ion-button>
  </section>
</template>

<script setup lang="ts">
import { IonButton, IonIcon } from '@ionic/vue';
import { createOutline } from 'ionicons/icons';
import NoteCardComponents from './NoteCardComponents.vue';
import type { Note } from '../services/notes';

defineProps<{ notes: Note[]; loading: boolean; searchActive: boolean }>();
defineEmits<{ edit: [note: Note]; 'new-note': [] }>();
</script>

<style scoped>
.notes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.empty-state { color: var(--app-muted); text-align: center; padding: 90px 20px; }
.empty-state ion-icon { color: var(--app-coral); font-size: 42px; }
.empty-state h2 { color: var(--app-ink); margin-bottom: 4px; }
@media (max-width: 760px) { .notes-grid { grid-template-columns: 1fr; } }
</style>
