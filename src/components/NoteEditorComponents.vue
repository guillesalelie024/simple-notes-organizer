<template>
  <ion-modal :is-open="isOpen" @didDismiss="$emit('close')">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>{{ editingId ? 'Edit note' : 'New note' }}</ion-title>
        <ion-buttons slot="end"><ion-button @click="$emit('close')">Close</ion-button></ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form class="note-form" @submit.prevent="$emit('save', localForm)">
        <ion-input v-model="localForm.title" label="Title" label-placement="stacked" placeholder="Give it a name" required />
        <ion-textarea v-model="localForm.content" label="Content" label-placement="stacked" placeholder="Write what is on your mind" :auto-grow="true" required />
        <ion-select v-model="localForm.category" label="Category" label-placement="stacked" placeholder="Choose a category">
          <ion-select-option value="School">School</ion-select-option>
          <ion-select-option value="Personal">Personal</ion-select-option>
          <ion-select-option value="Ideas">Ideas</ion-select-option>
          <ion-select-option value="Work">Work</ion-select-option>
        </ion-select>
        <ion-select v-model="localForm.status" label="Status" label-placement="stacked">
          <ion-select-option value="Normal">Normal</ion-select-option>
          <ion-select-option value="Important">Important</ion-select-option>
        </ion-select>
        <ion-button type="submit" expand="block">{{ editingId ? 'Save changes' : 'Save note' }}</ion-button>
        <ion-button v-if="editingId" type="button" expand="block" fill="clear" color="danger" @click="$emit('delete')">Delete note</ion-button>
      </form>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonModal, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from '@ionic/vue';
import type { NoteDraft } from '../services/notes';

const props = defineProps<{ isOpen: boolean; editingId?: string; modelValue: NoteDraft }>();
defineEmits<{ close: []; save: [draft: NoteDraft]; delete: [] }>();
const localForm = reactive<NoteDraft>({ ...props.modelValue });

watch(() => [props.isOpen, props.modelValue], () => Object.assign(localForm, props.modelValue), { deep: true });
</script>

<style scoped>
ion-toolbar { --background: transparent; --color: var(--app-ink); }
.note-form { display: grid; gap: 20px; padding-top: 16px; }
</style>
