<template>
  <div class="stat-card">
    <div :class="['stat-icon-wrapper', `bg-${color}`]">
      <slot name="icon"></slot>
    </div>
    <div class="stat-content">
      <p class="stat-label">{{ label }}</p>
      <h3 class="stat-value">{{ value }}</h3>
      <p v-if="trendText" :class="['stat-trend', trendType]">
        <slot name="trend-icon"></slot>
        {{ trendText }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  color: {
    type: String,
    default: 'blue' 
  },
  trendText: String,
  trendType: {
    type: String,
    default: 'neutral' 
  }
})
</script>

<style scoped>
.stat-card {
  background-color: var(--bg-card);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bg-blue { background-color: rgba(14, 165, 233, 0.1); color: var(--primary); }
.bg-green { background-color: rgba(16, 185, 129, 0.1); color: var(--success); }
.bg-orange { background-color: rgba(245, 158, 11, 0.1); color: var(--warning); }
.bg-red { background-color: rgba(239, 68, 68, 0.1); color: var(--danger); }

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: var(--text-main);
  letter-spacing: -0.025em;
}

.stat-trend {
  font-size: 0.75rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
}

.positive { color: var(--success); }
.negative { color: var(--danger); }
.neutral { color: var(--text-muted); }

:slotted(svg) {
  width: 24px;
  height: 24px;
}

:slotted(.trend-icon) {
  width: 14px;
  height: 14px;
}
</style>
