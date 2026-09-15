<template>
  <ion-toast :is-open="isOpen" :message="message" :duration="5000" :color="color" @didDismiss="$emit('close')" />
</template>

<script setup lang="ts">
import { IonToast } from '@ionic/vue';

defineProps<{ isOpen: boolean; message: string; color?: 'success' | 'danger' }>();
defineEmits<{ close: [] }>();
</script>
