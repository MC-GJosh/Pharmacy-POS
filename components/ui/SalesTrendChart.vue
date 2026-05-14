<template>
  <div class="chart-wrapper">
    <div class="chart-container">
      <svg
        class="trend-svg"
        viewBox="0 0 800 280"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.35" />
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0" />
          </linearGradient>
        </defs>

        <!-- Horizontal Grid Lines -->
        <g class="grid-lines">
          <line x1="40" y1="40" x2="760" y2="40" stroke="var(--border-color)" stroke-dasharray="4 4" stroke-width="1" />
          <line x1="40" y1="106" x2="760" y2="106" stroke="var(--border-color)" stroke-dasharray="4 4" stroke-width="1" />
          <line x1="40" y1="173" x2="760" y2="173" stroke="var(--border-color)" stroke-dasharray="4 4" stroke-width="1" />
          <line x1="40" y1="240" x2="760" y2="240" stroke="var(--border-color)" stroke-dasharray="4 4" stroke-width="1" />
        </g>

        <!-- Area fill -->
        <path
          :d="areaPath"
          :fill="`url(#${gradientId})`"
          class="area-path"
        />
        
        <!-- Line -->
        <path
          :d="linePath"
          fill="none"
          stroke="var(--primary)"
          stroke-width="3.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="line-path"
        />

        <!-- Hover Indicator Line -->
        <line
          v-if="hoveredIndex !== null"
          :x1="points[hoveredIndex].x"
          y1="40"
          :x2="points[hoveredIndex].x"
          y2="240"
          stroke="var(--primary)"
          stroke-opacity="0.3"
          stroke-width="2"
          stroke-dasharray="4 4"
        />

        <!-- Data points -->
        <circle
          v-for="(point, i) in points"
          :key="i"
          :cx="point.x"
          :cy="point.y"
          :r="hoveredIndex === i ? 6 : 4"
          :fill="hoveredIndex === i ? 'var(--primary)' : 'var(--bg-card)'"
          stroke="var(--primary)"
          :stroke-width="hoveredIndex === i ? 0 : 2.5"
          class="data-dot"
        />
      </svg>
      
      <!-- Hover Interaction Zones -->
      <div class="hover-zones">
        <div
          v-for="(point, i) in points"
          :key="i"
          class="hover-zone"
          :style="{ left: `${(point.x / 800) * 100}%` }"
          @mouseenter="hoveredIndex = i"
          @mouseleave="hoveredIndex = null"
        />
      </div>

      <!-- Custom Tooltip -->
      <div
        v-if="hoveredIndex !== null"
        class="chart-tooltip"
        :style="tooltipStyle"
      >
        <div class="tooltip-dot"></div>
        <div class="tooltip-content">
          <span class="tooltip-day">{{ data[hoveredIndex].day }} Sales</span>
          <span class="tooltip-value">{{ formatCurrency(data[hoveredIndex].sales) }}</span>
        </div>
      </div>
    </div>

    <!-- X-axis labels -->
    <div class="chart-labels">
      <span 
        v-for="(d, i) in data" 
        :key="i" 
        class="chart-label"
        :class="{ 'is-active': hoveredIndex === i }"
      >
        {{ d.day }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  data: { type: Array, required: true },
  maxVal: { type: Number, required: true },
  minVal: { type: Number, required: true },
  formatCurrency: { type: Function, default: (v) => `$${v}` },
})

const gradientId = `chart-gradient-${Math.random().toString(36).slice(2, 8)}`
// Use a wider aspect ratio coordinate system so it doesn't look stretched
const width = 800
const height = 280
const padX = 40
const padY = 40

const hoveredIndex = ref(null)

const points = computed(() => {
  const len = props.data.length
  if (len === 0) return []
  const range = props.maxVal - props.minVal || 1
  return props.data.map((d, i) => ({
    x: padX + (i / (len - 1)) * (width - padX * 2),
    y: padY + (1 - (d.sales - props.minVal) / range) * (height - padY * 2),
  }))
})

// Straight line path
const linePath = computed(() => {
  if (points.value.length === 0) return ''
  return points.value
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')
})

const areaPath = computed(() => {
  if (points.value.length === 0) return ''
  const first = points.value[0]
  const last = points.value[points.value.length - 1]
  return `${linePath.value} L ${last.x} ${height - padY} L ${first.x} ${height - padY} Z`
})

const tooltipStyle = computed(() => {
  if (hoveredIndex.value === null) return {}
  const p = points.value[hoveredIndex.value]
  return {
    left: `${(p.x / width) * 100}%`,
    top: `${(p.y / height) * 100}%`,
  }
})
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.chart-container {
  position: relative;
  width: 100%;
}

.trend-svg {
  width: 100%;
  height: 220px;
  display: block;
}

.area-path {
  animation: fadeIn 0.8s ease-out;
}

.line-path {
  stroke-dasharray: 2000;
  stroke-dashoffset: 2000;
  animation: drawLine 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.data-dot {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
  transition: all 0.2s ease;
}

.data-dot:nth-child(4) { animation-delay: 0.2s; }
.data-dot:nth-child(5) { animation-delay: 0.3s; }
.data-dot:nth-child(6) { animation-delay: 0.4s; }
.data-dot:nth-child(7) { animation-delay: 0.5s; }
.data-dot:nth-child(8) { animation-delay: 0.6s; }
.data-dot:nth-child(9) { animation-delay: 0.7s; }
.data-dot:nth-child(10) { animation-delay: 0.8s; }

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ─── Axis Labels ─── */
.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 4%; /* approximate padding to align with padX */
}

.chart-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.2s;
}

.chart-label.is-active {
  color: var(--primary);
  font-weight: 700;
}

/* ─── Hover Interactions ─── */
.hover-zones {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.hover-zone {
  position: absolute;
  top: 0;
  width: 14%;
  height: 100%;
  transform: translateX(-50%);
  pointer-events: all;
  cursor: crosshair;
}

/* ─── Tooltip ─── */
.chart-tooltip {
  position: absolute;
  transform: translate(-50%, -120%);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  pointer-events: none;
  z-index: 10;
  animation: tooltipPop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  min-width: max-content;
}

@keyframes tooltipPop {
  from { opacity: 0; transform: translate(-50%, -90%) scale(0.95); }
  to { opacity: 1; transform: translate(-50%, -120%) scale(1); }
}

.tooltip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
}

.tooltip-content {
  display: flex;
  flex-direction: column;
}

.tooltip-day {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.tooltip-value {
  font-size: 0.9rem;
  color: var(--text-main);
  font-weight: 700;
}

/* ─── Grid Lines ─── */
.grid-lines line {
  opacity: 0.6;
}
</style>
