<template>
  <article class="note-card" :class="{ important: note.status === 'Important' }">
    <div class="card-topline">
      <span class="category">{{ note.category || 'Uncategorized' }}</span>
      <ion-button fill="clear" class="more-button" aria-label="Edit note" @click="$emit('edit', note)">
        <ion-icon :icon="ellipsisHorizontal" />
      </ion-button>
    </div>
    <h2>{{ note.title }}</h2>
    <p>{{ note.content }}</p>
    <footer>
      <span>{{ formattedDate }}</span>
      <span v-if="note.status === 'Important'" class="status"><ion-icon :icon="star" /> Important</span>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';
import { ellipsisHorizontal, star } from 'ionicons/icons';
import type { Note } from '../services/notes';

const props = defineProps<{ note: Note }>();
defineEmits<{ edit: [note: Note] }>();

const formattedDate = computed(() => new Intl.DateTimeFormat('en', {
  month: 'short', day: 'numeric', year: 'numeric',
}).format(new Date(props.note.createdAt)));
</script>

<style scoped>
.note-card { background: var(--app-paper); border: 1px solid var(--app-line); border-radius: 5px; min-height: 220px; padding: 22px; display: flex; flex-direction: column; box-shadow: 0 12px 26px rgba(23, 51, 61, .04); }
.note-card.important { border-top: 4px solid var(--app-coral); }
.card-topline, footer { display: flex; justify-content: space-between; align-items: center; }
.category { color: var(--ion-color-primary); font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
.more-button { --color: var(--app-muted); margin: -10px -12px 0 0; }
.note-card h2 { color: var(--app-ink); font-size: 22px; margin: 20px 0 10px; }
.note-card p { color: #58717a; line-height: 1.55; margin: 0; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
footer { color: #91a4a5; font-size: 12px; margin-top: auto; padding-top: 20px; }
.status { color: var(--app-coral); display: flex; align-items: center; gap: 4px; font-weight: 700; }
</style>
