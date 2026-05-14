<template>
  <button :class="['btn', variantClass, sizeClass]">
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="suffix"></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'secondary', 'text', 'icon'].includes(val)
  },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg'].includes(val)
  }
})



const variantClass = computed(() => `btn-${props.variant}`)
const sizeClass = computed(() => `btn-${props.size}`)
</script>

<style scoped>
.btn {
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  font-weight: 600;
}

.btn-md {
  padding: 0.625rem 1.25rem;
  font-size: 0.95rem;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.btn-lg {
  padding: 0.875rem 1.5rem;
  font-size: 1.05rem;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(14, 165, 233, 0.3);
}

.btn-secondary {
  background-color: #f1f5f9;
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}

.btn-text {
  background: transparent;
  color: var(--primary);
  padding: 0.5rem;
}

.btn-text:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.btn-icon {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  color: var(--text-muted);
}

.btn-icon:hover {
  background-color: var(--bg-app);
  color: var(--text-main);
}
</style>
