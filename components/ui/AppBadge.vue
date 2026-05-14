<template>
  <span :class="['badge', `bg-${color}-light`, `text-${color}`]">
    <slot></slot>
  </span>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'success', 'warning', 'danger'].includes(val),
  },
})
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.bg-success-light { background-color: rgba(16, 185, 129, 0.1); }
.text-success { color: var(--success); }

.bg-warning-light { background-color: rgba(245, 158, 11, 0.1); }
.text-warning { color: var(--warning); }

.bg-danger-light { background-color: rgba(239, 68, 68, 0.1); }
.text-danger { color: var(--danger); }

.bg-primary-light { background-color: rgba(14, 165, 233, 0.1); }
.text-primary { color: var(--primary); }
</style>
