<template>
  <Teleport to="body">
    <div v-if="modelValue && drug" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
      <div class="modal">
        <div class="modal-header">
          <div>
            <h2 class="modal-title">Stock Adjustment</h2>
            <p class="modal-sub">{{ drug.brandName }} · {{ drug.genericName }} {{ drug.strength }}</p>
          </div>
          <button class="close-btn" @click="$emit('update:modelValue', false)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-md"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form class="modal-body" @submit.prevent="handleSubmit">
          <!-- Current stock display -->
          <div class="stock-summary">
            <div class="stock-box">
              <span class="stock-label">Current Stock</span>
              <span class="stock-num">{{ drug.stock }}</span>
              <span class="stock-unit">{{ drug.unitOfMeasure || 'pcs' }}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="arrow-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            <div class="stock-box stock-box-after">
              <span class="stock-label">Stock After</span>
              <span class="stock-num" :class="afterClass">{{ stockAfter }}</span>
              <span class="stock-unit">{{ drug.unitOfMeasure || 'pcs' }}</span>
            </div>
          </div>

          <!-- Reason -->
          <div class="field">
            <label>Reason for Adjustment <span class="req">*</span></label>
            <div class="reason-grid">
              <button
                v-for="r in ADJUSTMENT_REASONS" :key="r"
                type="button"
                :class="['reason-btn', { active: form.reason === r, 'reason-danger': isDangerReason(r) }]"
                @click="form.reason = r"
              >
                <span class="reason-icon">{{ reasonIcon(r) }}</span>
                {{ r }}
              </button>
            </div>
          </div>

          <!-- Quantity -->
          <div class="field">
            <label>Quantity to Deduct <span class="req">*</span></label>
            <div class="qty-wrap">
              <button type="button" class="qty-btn" @click="form.quantity = Math.max(1, form.quantity - 1)">−</button>
              <input
                v-model.number="form.quantity"
                type="number" min="1" :max="drug.stock"
                class="qty-input" required
              />
              <button type="button" class="qty-btn" @click="form.quantity = Math.min(drug.stock, form.quantity + 1)">+</button>
            </div>
            <span v-if="form.quantity > drug.stock" class="field-hint hint-danger">Cannot exceed current stock ({{ drug.stock }})</span>
          </div>

          <!-- Notes -->
          <div class="field">
            <label>Notes / Remarks</label>
            <textarea v-model="form.notes" rows="3" placeholder="Additional details about this adjustment..."></textarea>
          </div>

          <!-- Warning for full depletion -->
          <div v-if="stockAfter === 0" class="alert-box alert-danger">
            ⚠️ This will bring stock to zero. The item will be marked as <strong>Out of Stock</strong>.
          </div>
          <div v-else-if="stockAfter <= drug.reorderLevel" class="alert-box alert-warning">
            🟡 Stock will fall below the reorder level of {{ drug.reorderLevel }} {{ drug.unitOfMeasure || 'pcs' }}.
          </div>

          <div class="modal-footer">
            <UiAppButton type="button" variant="secondary" @click="$emit('update:modelValue', false)">Cancel</UiAppButton>
            <UiAppButton
              type="submit" variant="primary"
              :disabled="!form.reason || form.quantity < 1 || form.quantity > drug.stock"
            >
              Confirm Adjustment
            </UiAppButton>
          </div>
        </form>

        <!-- Adjustment Log -->
        <div v-if="drug.adjustmentLog && drug.adjustmentLog.length" class="log-section">
          <p class="log-title">Recent Adjustments</p>
          <div class="log-list">
            <div v-for="(entry, i) in [...drug.adjustmentLog].reverse().slice(0, 5)" :key="i" class="log-entry">
              <div class="log-left">
                <span class="log-reason">{{ entry.reason }}</span>
                <span class="log-date">{{ formatDate(entry.date) }}</span>
              </div>
              <div class="log-right">
                <span class="log-qty">−{{ entry.quantity }}</span>
                <span class="log-stock">{{ entry.stockBefore }} → {{ entry.stockAfter }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  drug: { type: Object, default: null },
  ADJUSTMENT_REASONS: { type: Array, required: true },
})
const emit = defineEmits(['update:modelValue', 'submit'])

const form = ref({ reason: '', quantity: 1, notes: '' })

const stockAfter = computed(() => {
  if (!props.drug) return 0
  return Math.max(0, props.drug.stock - (form.value.quantity || 0))
})

const afterClass = computed(() => {
  if (!props.drug) return ''
  if (stockAfter.value === 0) return 'num-danger'
  if (stockAfter.value <= props.drug.reorderLevel) return 'num-warning'
  return 'num-ok'
})

const isDangerReason = (r) => ['Damaged', 'Expired', 'Lost / Missing'].includes(r)

const reasonIcon = (r) => {
  const icons = {
    'Damaged': '💥', 'Expired': '⏰', 'Lost / Missing': '❓',
    'Return to Supplier': '↩️', 'Count Correction': '📋', 'Other': '✏️',
  }
  return icons[r] || '•'
}

const formatDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const handleSubmit = () => {
  if (!form.value.reason || form.value.quantity < 1) return
  emit('submit', { ...form.value })
  emit('update:modelValue', false)
  form.value = { reason: '', quantity: 1, notes: '' }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
  z-index: 1000; display: flex; align-items: center; justify-content: center;
  padding: 1rem; animation: fadeIn 0.15s ease;
}
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

.modal {
  background: var(--bg-card); border-radius: 16px;
  border: 1px solid var(--border-color); width: 100%; max-width: 520px;
  max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 25px 50px rgba(0,0,0,0.25); animation: slideUp 0.2s ease;
}
@keyframes slideUp { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }

.modal-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-color); gap: 1rem;
}
.modal-title { margin: 0 0 0.125rem; font-size: 1.125rem; font-weight: 700; color: var(--text-main); }
.modal-sub { margin: 0; font-size: 0.85rem; color: var(--text-muted); }

.close-btn {
  background: transparent; border: none; cursor: pointer; flex-shrink: 0;
  color: var(--text-muted); padding: 0.25rem; border-radius: 6px;
  display: flex; align-items: center; transition: all 0.15s;
}
.close-btn:hover { background: var(--bg-app); color: var(--text-main); }

.modal-body { padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.25rem; }

.stock-summary {
  display: flex; align-items: center; justify-content: center; gap: 1rem;
  padding: 1rem; background: var(--bg-app); border-radius: 10px;
  border: 1px solid var(--border-color);
}
.stock-box {
  display: flex; flex-direction: column; align-items: center; gap: 0.125rem; flex: 1;
}
.stock-box-after { }
.stock-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
.stock-num { font-size: 2rem; font-weight: 700; color: var(--text-main); line-height: 1; }
.num-ok { color: var(--success); }
.num-warning { color: var(--warning); }
.num-danger { color: var(--danger); }
.stock-unit { font-size: 0.75rem; color: var(--text-muted); }
.arrow-icon { width: 20px; height: 20px; color: var(--text-muted); flex-shrink: 0; }

.field { display: flex; flex-direction: column; gap: 0.5rem; }
.field label { font-size: 0.875rem; font-weight: 600; color: var(--text-main); }
.req { color: var(--danger); }
.field-hint { font-size: 0.75rem; }
.hint-danger { color: var(--danger); font-weight: 600; }

.reason-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; }
.reason-btn {
  display: flex; align-items: center; gap: 0.375rem; flex-direction: column;
  padding: 0.625rem 0.5rem; border-radius: 8px;
  border: 1px solid var(--border-color); background: var(--bg-app);
  color: var(--text-muted); font-size: 0.8rem; font-weight: 500;
  cursor: pointer; transition: all 0.15s; font-family: inherit; text-align: center;
}
.reason-btn:hover { border-color: var(--primary); color: var(--primary); }
.reason-btn.active { border-color: var(--primary); background: rgba(14,165,233,0.1); color: var(--primary); font-weight: 700; }
.reason-btn.reason-danger.active { border-color: var(--danger); background: rgba(239,68,68,0.08); color: var(--danger); }
.reason-icon { font-size: 1.25rem; }

.qty-wrap { display: flex; align-items: center; gap: 0.5rem; }
.qty-btn {
  width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border-color);
  background: var(--bg-app); color: var(--text-main); font-size: 1.25rem;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.qty-btn:hover { background: var(--primary); color: white; border-color: var(--primary); }
.qty-input {
  flex: 1; text-align: center; padding: 0.5rem;
  border: 1px solid var(--border-color); border-radius: 8px;
  background: var(--bg-app); color: var(--text-main);
  font-size: 1.125rem; font-weight: 700; font-family: inherit; outline: none;
}
.qty-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(14,165,233,0.15); }

.field textarea {
  width: 100%; padding: 0.625rem 0.875rem; resize: vertical;
  border: 1px solid var(--border-color); border-radius: 8px;
  background: var(--bg-app); color: var(--text-main);
  font-family: inherit; font-size: 0.9rem; outline: none;
}
.field textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(14,165,233,0.15); }

.alert-box {
  padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem;
}
.alert-danger { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: var(--danger); }
.alert-warning { background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2); color: var(--warning); }

.modal-footer {
  display: flex; gap: 0.75rem; justify-content: flex-end;
  padding: 1rem 1.5rem; border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

.log-section {
  border-top: 1px solid var(--border-color);
  padding: 1rem 1.5rem;
  flex-shrink: 0;
}
.log-title { margin: 0 0 0.75rem; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
.log-list { display: flex; flex-direction: column; gap: 0.375rem; }
.log-entry {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.5rem 0.75rem; background: var(--bg-app);
  border-radius: 6px; font-size: 0.8rem;
}
.log-left { display: flex; flex-direction: column; }
.log-reason { font-weight: 600; color: var(--text-main); }
.log-date { color: var(--text-muted); font-size: 0.72rem; }
.log-right { display: flex; flex-direction: column; align-items: flex-end; }
.log-qty { font-weight: 700; color: var(--danger); }
.log-stock { font-size: 0.72rem; color: var(--text-muted); }
</style>
