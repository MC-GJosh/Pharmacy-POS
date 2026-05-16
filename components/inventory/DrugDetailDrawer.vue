<template>
  <Teleport to="body">
    <div v-if="modelValue && drug" class="drawer-overlay" @click.self="$emit('update:modelValue', false)">
      <div class="drawer">
        <!-- Header -->
        <div class="drawer-header">
          <div>
            <p class="drawer-sup">{{ drug.category }}</p>
            <h2 class="drawer-title">{{ drug.brandName }}</h2>
            <p class="drawer-generic">Generic: <strong>{{ drug.genericName }}</strong></p>
          </div>
          <button class="close-btn" @click="$emit('update:modelValue', false)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-md"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="drawer-body">
          <!-- Status badges -->
          <div class="badges-row">
            <UiAppBadge :color="stockColor">{{ stockLabel }}</UiAppBadge>
            <UiAppBadge color="primary">{{ drug.dosageForm }}</UiAppBadge>
            <UiAppBadge v-if="drug.sellByUnit" color="success">Sell by piece</UiAppBadge>
            <UiAppBadge v-if="hasSubstitute" color="warning">Substitutes available</UiAppBadge>
          </div>

          <!-- Info grid -->
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Strength / Dosage</span>
              <span class="info-value strong">{{ drug.strength }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Cost Price</span>
              <span class="info-value">₱{{ drug.costPrice.toFixed(2) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Manufacturer</span>
              <span class="info-value">{{ drug.manufacturer }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Wholesale Price</span>
              <span class="info-value">₱{{ drug.wholesalePrice.toFixed(2) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Dosage Form</span>
              <span class="info-value">{{ drug.dosageForm }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Selling / Retail Price</span>
              <span class="info-value strong">₱{{ drug.sellingPrice.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Description -->
          <div class="section">
            <p class="section-label">Description / Indications</p>
            <p class="description-text">{{ drug.description || 'No description provided.' }}</p>
          </div>

          <!-- Unit conversion -->
          <div class="section">
            <p class="section-label">Unit Conversion</p>
            <div class="conversion-row">
              <div class="conv-box">
                <span class="conv-num">1</span>
                <span class="conv-unit">Box</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="conv-arrow"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              <div class="conv-box">
                <span class="conv-num">{{ drug.stripsPerBox }}</span>
                <span class="conv-unit">Strips</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="conv-arrow"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              <div class="conv-box highlight">
                <span class="conv-num">{{ drug.piecesPerStrip * drug.stripsPerBox }}</span>
                <span class="conv-unit">Pieces</span>
              </div>
            </div>
            <p class="conv-note">{{ drug.piecesPerStrip }} pcs/strip × {{ drug.stripsPerBox }} strips/box</p>
          </div>

          <!-- Stock -->
          <div class="section">
            <p class="section-label">Stock</p>
            <div class="stock-bar-wrap">
              <div class="stock-bar">
                <div class="stock-fill" :class="`fill-${stockColor}`" :style="{ width: stockPct + '%' }"></div>
              </div>
              <span class="stock-text">{{ drug.stock }} / {{ drug.reorderLevel * 5 }} pcs</span>
            </div>
            <p class="conv-note">Reorder at {{ drug.reorderLevel }} pcs</p>
          </div>

          <!-- Generic substitutes -->
          <div class="section">
            <p class="section-label">Generic Substitutes</p>
            <div v-if="substitutes.length" class="substitutes-list">
              <div v-for="sub in substitutes" :key="sub.id" class="substitute-card" @click="$emit('view', sub)">
                <div>
                  <p class="sub-brand">{{ sub.brandName }}</p>
                  <p class="sub-meta">{{ sub.genericName }} · {{ sub.strength }}</p>
                </div>
                <div class="sub-right">
                  <span class="sub-price">₱{{ sub.sellingPrice.toFixed(2) }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-sm"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </div>
              </div>
            </div>
            <p v-else class="no-substitutes">No generic substitutes listed.</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="drawer-footer">
          <UiAppButton variant="secondary" @click="$emit('edit', drug)">
            <template #prefix>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-sm"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
            </template>
            Edit
          </UiAppButton>
          <UiAppButton variant="primary" @click="$emit('update:modelValue', false)">Close</UiAppButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  drug: { type: Object, default: null },
  substitutes: { type: Array, default: () => [] },
})
defineEmits(['update:modelValue', 'edit', 'view'])

const hasSubstitute = computed(() => props.substitutes?.length > 0)

const stockColor = computed(() => {
  if (!props.drug) return 'primary'
  if (props.drug.stock === 0) return 'danger'
  if (props.drug.stock <= props.drug.reorderLevel) return 'warning'
  return 'success'
})

const stockLabel = computed(() => {
  if (!props.drug) return ''
  if (props.drug.stock === 0) return 'Out of Stock'
  if (props.drug.stock <= props.drug.reorderLevel) return 'Low Stock'
  return 'In Stock'
})

const stockPct = computed(() => {
  if (!props.drug) return 0
  const max = props.drug.reorderLevel * 5
  return Math.min(100, Math.round((props.drug.stock / max) * 100))
})
</script>

<style scoped>
.drawer-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(3px);
  z-index: 999;
  display: flex; justify-content: flex-end;
  animation: fadeIn 0.15s ease;
}
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

.drawer {
  width: 420px; max-width: 100%;
  height: 100%;
  background: var(--bg-card);
  border-left: 1px solid var(--border-color);
  display: flex; flex-direction: column;
  box-shadow: -8px 0 32px rgba(0,0,0,0.15);
  animation: slideIn 0.25s ease;
}
@keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }

.drawer-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  gap: 1rem;
}
.drawer-sup { margin: 0 0 0.25rem; font-size: 0.75rem; color: var(--primary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.drawer-title { margin: 0 0 0.125rem; font-size: 1.375rem; font-weight: 700; color: var(--text-main); }
.drawer-generic { margin: 0; font-size: 0.85rem; color: var(--text-muted); }
.drawer-generic strong { color: var(--text-main); }

.close-btn {
  background: transparent; border: none; cursor: pointer;
  color: var(--text-muted); padding: 0.25rem; border-radius: 6px;
  display: flex; align-items: center; flex-shrink: 0;
  transition: all 0.15s;
}
.close-btn:hover { background: var(--bg-app); color: var(--text-main); }

.drawer-body { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }

.badges-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }

.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.info-item {
  display: flex; flex-direction: column; gap: 0.25rem;
  padding: 0.75rem; background: var(--bg-app);
  border-radius: 8px; border: 1px solid var(--border-color);
}
.info-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
.info-value { font-size: 0.9rem; color: var(--text-main); }
.info-value.strong { font-weight: 700; color: var(--primary); font-size: 1rem; }

.section { display: flex; flex-direction: column; gap: 0.5rem; }
.section-label { margin: 0; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }

.description-text { margin: 0; font-size: 0.875rem; color: var(--text-main); line-height: 1.6; }

.conversion-row { display: flex; align-items: center; gap: 0.5rem; }
.conv-box {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  padding: 0.75rem 0.5rem; border-radius: 8px;
  border: 1px solid var(--border-color); background: var(--bg-app);
}
.conv-box.highlight { background: rgba(14,165,233,0.08); border-color: rgba(14,165,233,0.3); }
.conv-box.highlight .conv-num { color: var(--primary); }
.conv-num { font-size: 1.25rem; font-weight: 700; color: var(--text-main); }
.conv-unit { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }
.conv-arrow { width: 16px; height: 16px; color: var(--text-muted); flex-shrink: 0; }
.conv-note { margin: 0; font-size: 0.8rem; color: var(--text-muted); }

.stock-bar-wrap { display: flex; align-items: center; gap: 0.75rem; }
.stock-bar { flex: 1; height: 8px; background: var(--border-color); border-radius: 99px; overflow: hidden; }
.stock-fill { height: 100%; border-radius: 99px; transition: width 0.4s ease; }
.fill-success { background: var(--success); }
.fill-warning { background: var(--warning); }
.fill-danger { background: var(--danger); }
.stock-text { font-size: 0.8rem; color: var(--text-muted); white-space: nowrap; }

.substitutes-list { display: flex; flex-direction: column; gap: 0.5rem; }
.substitute-card {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.75rem 1rem; border-radius: 8px;
  border: 1px solid var(--border-color); background: var(--bg-app);
  cursor: pointer; transition: all 0.15s;
}
.substitute-card:hover { border-color: var(--primary); background: rgba(14,165,233,0.04); }
.sub-brand { margin: 0 0 0.125rem; font-size: 0.9rem; font-weight: 600; color: var(--text-main); }
.sub-meta { margin: 0; font-size: 0.78rem; color: var(--text-muted); }
.sub-right { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); }
.sub-price { font-weight: 600; font-size: 0.85rem; color: var(--primary); }
.no-substitutes { margin: 0; font-size: 0.875rem; color: var(--text-muted); font-style: italic; }

.drawer-footer {
  padding: 1.25rem 1.5rem; border-top: 1px solid var(--border-color);
  display: flex; gap: 0.75rem; justify-content: flex-end;
}
</style>
