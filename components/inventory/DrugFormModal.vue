<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEdit ? 'Edit Drug / Product' : 'Add New Drug / Product' }}</h2>
          <button class="close-btn" @click="$emit('update:modelValue', false)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-md"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form class="modal-body" @submit.prevent="handleSubmit">
          <!-- Section: Identity -->
          <p class="section-label">Drug Identity</p>
          <div class="field-row">
            <div class="field">
              <label>Generic Name <span class="req">*</span></label>
              <input v-model="form.genericName" required placeholder="e.g. Paracetamol" />
            </div>
            <div class="field">
              <label>Brand Name <span class="req">*</span></label>
              <input v-model="form.brandName" required placeholder="e.g. Biogesic" />
            </div>
          </div>

          <!-- Section: Classification -->
          <p class="section-label">Classification</p>
          <div class="field-row">
            <div class="field">
              <label>Drug Category <span class="req">*</span></label>
              <select v-model="form.category" required>
                <option value="" disabled>Select category</option>
                <option v-for="c in DRUG_CATEGORIES" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div class="field">
              <label>Dosage Form <span class="req">*</span></label>
              <select v-model="form.dosageForm" required>
                <option value="" disabled>Select form</option>
                <option v-for="f in DOSAGE_FORMS" :key="f" :value="f">{{ f }}</option>
              </select>
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label>Strength / Dosage <span class="req">*</span></label>
              <input v-model="form.strength" required placeholder="e.g. 500 mg" />
            </div>
            <div class="field">
              <label>Manufacturer / Brand <span class="req">*</span></label>
              <select v-model="form.manufacturer" required>
                <option value="" disabled>Select manufacturer</option>
                <option v-for="m in MANUFACTURERS" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
          </div>

          <!-- Section: Description -->
          <p class="section-label">Description / Indications</p>
          <div class="field">
            <textarea v-model="form.description" rows="3" placeholder="Drug uses, indications, contraindications..."></textarea>
          </div>

          <!-- Section: Packaging & Units -->
          <p class="section-label">Packaging & Unit Conversion</p>
          <div class="field-row three-col">
            <div class="field">
              <label>Pieces / Strip</label>
              <input v-model.number="form.piecesPerStrip" type="number" min="1" placeholder="10" />
            </div>
            <div class="field">
              <label>Strips / Box</label>
              <input v-model.number="form.stripsPerBox" type="number" min="1" placeholder="10" />
            </div>
            <div class="field conversion-display">
              <label>Pieces / Box</label>
              <div class="conversion-value">{{ piecesPerBoxCalc }}</div>
            </div>
          </div>
          <div class="field checkbox-field">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.sellByUnit" />
              <span>Allow selling by individual piece / strip</span>
            </label>
          </div>

          <!-- Section: Stock & Pricing -->
          <p class="section-label">Stock & Pricing</p>
          <div class="field-row three-col">
            <div class="field">
              <label>Current Stock (pieces)</label>
              <input v-model.number="form.stock" type="number" min="0" placeholder="0" />
            </div>
            <div class="field">
              <label>Reorder Level (pieces)</label>
              <input v-model.number="form.reorderLevel" type="number" min="0" placeholder="50" />
            </div>
            <div class="field">
              <label>Price per piece (₱)</label>
              <input v-model.number="form.price" type="number" min="0" step="0.01" placeholder="0.00" />
            </div>
          </div>

          <div class="modal-footer">
            <UiAppButton type="button" variant="secondary" @click="$emit('update:modelValue', false)">Cancel</UiAppButton>
            <UiAppButton type="submit" variant="primary">{{ isEdit ? 'Save Changes' : 'Add Drug' }}</UiAppButton>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  drug: { type: Object, default: null },
  DRUG_CATEGORIES: { type: Array, required: true },
  DOSAGE_FORMS: { type: Array, required: true },
  MANUFACTURERS: { type: Array, required: true },
})
const emit = defineEmits(['update:modelValue', 'submit'])

const isEdit = computed(() => !!props.drug)

const blank = () => ({
  genericName: '', brandName: '', category: '', dosageForm: '',
  strength: '', manufacturer: '', description: '',
  piecesPerStrip: 10, stripsPerBox: 10, sellByUnit: true,
  stock: 0, reorderLevel: 50, price: 0,
})

const form = ref(blank())

watch(() => props.modelValue, (open) => {
  form.value = open && props.drug ? { ...props.drug } : blank()
})

const piecesPerBoxCalc = computed(() =>
  (form.value.piecesPerStrip || 0) * (form.value.stripsPerBox || 0)
)

const handleSubmit = () => {
  emit('submit', { ...form.value })
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

.modal {
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  width: 100%; max-width: 680px;
  max-height: 90vh;
  display: flex; flex-direction: column;
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
  animation: slideUp 0.2s ease;
}

@keyframes slideUp { from { transform: translateY(16px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }

.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-title { margin: 0; font-size: 1.125rem; font-weight: 700; color: var(--text-main); }

.close-btn {
  background: transparent; border: none; cursor: pointer;
  color: var(--text-muted); padding: 0.25rem; border-radius: 6px;
  display: flex; align-items: center;
  transition: all 0.15s;
}
.close-btn:hover { background: var(--bg-app); color: var(--text-main); }

.modal-body {
  padding: 1.5rem; overflow-y: auto;
  display: flex; flex-direction: column; gap: 0.75rem;
}

.section-label {
  margin: 0.75rem 0 0.25rem 0;
  font-size: 0.75rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.05em;
  color: var(--primary);
}

.field { display: flex; flex-direction: column; gap: 0.375rem; flex: 1; }
.field label { font-size: 0.875rem; font-weight: 500; color: var(--text-muted); }
.req { color: var(--danger); }

.field input, .field select, .field textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-app);
  color: var(--text-main);
  font-family: inherit; font-size: 0.9rem;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}
.field input:focus, .field select:focus, .field textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(14,165,233,0.15);
}
.field textarea { resize: vertical; }

.field-row { display: flex; gap: 1rem; }
.field-row.three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }

.conversion-display { }
.conversion-value {
  padding: 0.625rem 0.875rem;
  border-radius: 8px;
  background: rgba(14,165,233,0.08);
  border: 1px solid rgba(14,165,233,0.2);
  color: var(--primary);
  font-weight: 700; font-size: 1.1rem;
  min-height: 40px; display: flex; align-items: center;
}

.checkbox-field { margin-top: 0.25rem; }
.checkbox-label {
  display: flex; align-items: center; gap: 0.625rem;
  font-size: 0.9rem; color: var(--text-main); cursor: pointer;
}
.checkbox-label input[type="checkbox"] {
  width: 16px; height: 16px; accent-color: var(--primary); cursor: pointer;
}

.modal-footer {
  display: flex; gap: 0.75rem; justify-content: flex-end;
  padding-top: 1rem; margin-top: 0.5rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 640px) {
  .field-row, .field-row.three-col { flex-direction: column; grid-template-columns: 1fr; }
}
</style>
