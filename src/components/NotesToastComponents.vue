<template>
  <div v-if="isOpen" class="toast-backdrop" role="status" aria-live="polite" @click="$emit('close')">
    <div class="confirmation-toast" :class="color" @click.stop>
      <span class="toast-icon">{{ color === 'success' ? '✓' : '!' }}</span>
      <span>{{ message }}</span>
      <button type="button" aria-label="Close message" @click="$emit('close')">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ isOpen: boolean; message: string; color?: 'success' | 'danger' }>();
defineEmits<{ close: [] }>();
</script>

<style scoped>
.toast-backdrop { position: fixed; inset: 0; z-index: 10000; display: grid; place-items: center; pointer-events: none; }
.confirmation-toast { pointer-events: auto; display: flex; align-items: center; gap: 12px; width: min(88vw, 360px); padding: 16px 18px; border: 1px solid var(--app-line); border-radius: 10px; background: var(--app-paper); color: var(--app-ink); box-shadow: 0 18px 48px rgba(23, 51, 61, .2); font-size: 14px; font-weight: 700; animation: toast-in .2s ease-out; }
.confirmation-toast.success { border-left: 5px solid var(--ion-color-primary); }
.confirmation-toast.danger { border-left: 5px solid var(--app-coral); }
.toast-icon { display: grid; flex: 0 0 26px; width: 26px; height: 26px; place-items: center; border-radius: 50%; background: var(--ion-color-primary); color: #fff; font-size: 16px; }
.danger .toast-icon { background: var(--app-coral); }
button { margin-left: auto; border: 0; background: transparent; color: var(--app-muted); font-size: 24px; line-height: 1; cursor: pointer; }
@keyframes toast-in { from { opacity: 0; transform: translateY(8px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
</style>
