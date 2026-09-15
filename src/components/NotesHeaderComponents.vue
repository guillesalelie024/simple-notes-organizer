<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <ion-title>Note / keeper</ion-title>
      <ion-buttons slot="end">
        <ion-button fill="solid" class="new-note-button" @click="$emit('new-note')">
          <ion-icon slot="start" :icon="addOutline" /> New note
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/vue';
import { addOutline } from 'ionicons/icons';

defineEmits<{ 'new-note': [] }>();
</script>

<style scoped>
ion-toolbar { --background: transparent; --color: var(--app-ink); }
.new-note-button { --background: var(--ion-color-primary); --border-radius: 4px; text-transform: none; font-weight: 700; }
</style>
