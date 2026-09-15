<template>
  <section class="intro">
    <div>
      <p class="eyebrow">YOUR THOUGHTS, IN ORDER</p>
      <h1>A quieter place<br /><em>to think.</em></h1>
    </div>
    <p class="note-count">{{ noteCount }} {{ noteCount === 1 ? 'note' : 'notes' }} saved</p>
  </section>

  <section class="controls" aria-label="Note filters">
    <ion-searchbar :value="search" placeholder="Search your notes" show-clear-button="always" @ion-input="updateSearch" />
    <ion-segment :value="filter" @ion-change="updateFilter">
      <ion-segment-button value="All">All</ion-segment-button>
      <ion-segment-button value="Important">Important</ion-segment-button>
      <ion-segment-button value="Normal">Normal</ion-segment-button>
    </ion-segment>
  </section>
</template>

<script setup lang="ts">
import { IonSearchbar, IonSegment, IonSegmentButton } from '@ionic/vue';

defineProps<{ noteCount: number; search: string; filter: string }>();
const emit = defineEmits<{ 'update:search': [value: string]; 'update:filter': [value: string] }>();

type IonicValueEvent = CustomEvent<{ value?: string | number | null }>;

const updateSearch = (event: IonicValueEvent) => emit('update:search', String(event.detail.value ?? ''));
const updateFilter = (event: IonicValueEvent) => emit('update:filter', String(event.detail.value ?? 'All'));
</script>

<style scoped>
.intro { display: flex; justify-content: space-between; align-items: end; border-bottom: 1px solid var(--app-line); padding-bottom: 42px; }
.eyebrow { color: var(--ion-color-primary); font-size: 11px; font-weight: 800; letter-spacing: 2px; margin: 0 0 16px; }
h1 { color: var(--app-ink); font-size: clamp(42px, 7vw, 78px); line-height: .95; letter-spacing: 0; margin: 0; }
h1 em { color: var(--app-coral); font-family: Georgia, serif; font-weight: 400; }
.note-count { color: var(--app-muted); font-size: 14px; }
.controls { display: flex; gap: 18px; align-items: center; padding: 26px 0; }
ion-searchbar { --background: var(--app-paper); --border-radius: 5px; --box-shadow: none; border: 1px solid var(--app-line); max-width: 330px; padding: 0; }
ion-segment { max-width: 360px; margin-left: auto; --background: #e8efeb; }
@media (max-width: 760px) { .intro { display: block; } .note-count { margin-top: 24px; } .controls { display: block; } ion-searchbar, ion-segment { max-width: none; margin: 0 0 14px; } }
</style>
