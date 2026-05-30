<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop" @click.self="close">
        <div class="modal-panel">
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-title-wrap">
              <div class="modal-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
              </div>
              <div>
                <h2 class="modal-title">Bulk Import Products</h2>
                <p class="modal-subtitle">Upload an XLSX file to import multiple drugs at once</p>
              </div>
            </div>
            <button class="close-btn" @click="close">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="modal-body">
            <!-- Step 1: Upload Zone (visible when no file yet) -->
            <div v-if="!parsedFile" class="upload-section">
              <!-- Drop zone -->
              <div
                class="drop-zone"
                :class="{ 'drop-zone-active': isDragging }"
                @dragenter.prevent="isDragging = true"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="onDrop"
                @click="$refs.fileInput.click()"
              >
                <input ref="fileInput" type="file" accept=".xlsx,.xls" class="hidden-input" @change="onFileChange" />
                <div class="drop-icon" :class="{ 'drop-icon-active': isDragging }">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                </div>
                <p class="drop-label">Drop your XLSX file here, or <span class="drop-link">browse</span></p>
                <p class="drop-hint">Supports .xlsx and .xls files</p>
              </div>

              <!-- Template download hint -->
              <div class="template-hint">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                <span>First time? <button class="template-link" @click.stop="$emit('downloadTemplate')">Download the import template</button> and fill it in.</span>
              </div>
            </div>

            <!-- Step 2: Parse Result Preview -->
            <div v-else class="preview-section">
              <!-- Summary bar -->
              <div class="summary-bar">
                <div class="summary-file">
                  <div class="summary-file-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                  </div>
                  <div>
                    <p class="summary-filename">{{ parsedFile.name }}</p>
                    <p class="summary-total">{{ totalRows }} row{{ totalRows !== 1 ? 's' : '' }} detected</p>
                  </div>
                </div>
                <div class="summary-stats">
                  <div class="stat-pill stat-valid">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    {{ validRows.length }} valid
                  </div>
                  <div v-if="errorRows.length" class="stat-pill stat-error">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    {{ errorRows.length }} error{{ errorRows.length !== 1 ? 's' : '' }}
                  </div>
                </div>
                <button class="change-file-btn" @click="reset">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                  Change File
                </button>
              </div>

              <!-- Error notice banner -->
              <div v-if="errorRows.length" class="error-banner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                <span><strong>{{ errorRows.length }} row{{ errorRows.length !== 1 ? 's' : '' }}</strong> have validation errors and will be skipped. Review the highlighted rows below.</span>
              </div>

              <!-- Preview table -->
              <div class="table-wrap">
                <table class="preview-table">
                  <thead>
                    <tr>
                      <th class="col-status">Status</th>
                      <th class="col-row">#</th>
                      <th>Generic Name</th>
                      <th>Brand Name</th>
                      <th>Category</th>
                      <th>Form</th>
                      <th>Strength</th>
                      <th>Stock</th>
                      <th>Expiry</th>
                      <th>Cost</th>
                      <th>Selling</th>
                      <th>Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in allRows"
                      :key="item.row"
                      :class="item.errors ? 'row-error' : 'row-valid'"
                    >
                      <td class="col-status">
                        <span v-if="!item.errors" class="status-badge status-valid" title="Ready to import">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        </span>
                        <span v-else class="status-badge status-error" title="Has errors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </span>
                      </td>
                      <td class="col-row row-num">{{ item.row }}</td>
                      <td>{{ item.data.genericName || '—' }}</td>
                      <td>{{ item.data.brandName || '—' }}</td>
                      <td>{{ item.data.category || '—' }}</td>
                      <td>{{ item.data.dosageForm || '—' }}</td>
                      <td>{{ item.data.strength || '—' }}</td>
                      <td>{{ item.data.stock }}</td>
                      <td>{{ item.data.expiryDate || '—' }}</td>
                      <td>{{ item.data.costPrice ? '₱' + item.data.costPrice.toFixed(2) : '—' }}</td>
                      <td>{{ item.data.sellingPrice ? '₱' + item.data.sellingPrice.toFixed(2) : '—' }}</td>
                      <td class="col-issues">
                        <div v-if="item.errors" class="issue-list">
                          <span
                            v-for="err in item.errors"
                            :key="err.field"
                            class="issue-chip"
                            :title="err.msg"
                          >{{ err.field }}: {{ err.msg }}</span>
                        </div>
                        <span v-else class="no-issues">—</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div v-if="parsedFile" class="modal-footer">
            <div class="footer-hint" v-if="errorRows.length && validRows.length">
              Error rows will be skipped automatically.
            </div>
            <div class="footer-hint error-hint" v-else-if="validRows.length === 0">
              No valid rows to import. Please fix the errors and re-upload.
            </div>
            <div class="footer-actions">
              <button class="btn btn-secondary" @click="close">Cancel</button>
              <button
                class="btn btn-primary"
                :disabled="validRows.length === 0 || isImporting"
                @click="confirmImport"
              >
                <svg v-if="isImporting" class="spin-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                {{ isImporting ? 'Importing…' : `Import ${validRows.length} Valid Row${validRows.length !== 1 ? 's' : ''}` }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue', 'import', 'downloadTemplate'])

// ── State ──────────────────────────────────────────────────────────────────
const isDragging   = ref(false)
const parsedFile   = ref(null)
const validRows    = ref([])
const errorRows    = ref([])
const isImporting  = ref(false)
const fileInput    = ref(null)

const { importFromExcel } = useInventory()

// ── Computed ────────────────────────────────────────────────────────────────
const totalRows = computed(() => validRows.value.length + errorRows.value.length)

const allRows = computed(() => {
  const valid = validRows.value.map(r => ({ row: r.row, data: r.data, errors: null }))
  const errs  = errorRows.value.map(r => ({ row: r.row, data: r.data, errors: r.errors }))
  return [...valid, ...errs].sort((a, b) => a.row - b.row)
})

// ── File handling ───────────────────────────────────────────────────────────
const processFile = async (file) => {
  if (!file) return
  if (!file.name.match(/\.(xlsx|xls)$/i)) {
    alert('Please upload a valid Excel file (.xlsx or .xls)')
    return
  }
  parsedFile.value = file
  const result = await importFromExcel(file)
  validRows.value = result.imported
  errorRows.value = result.errors
}

const onFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) processFile(file)
}

const onDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) processFile(file)
}

const reset = () => {
  parsedFile.value = null
  validRows.value  = []
  errorRows.value  = []
  isImporting.value = false
  if (fileInput.value) fileInput.value.value = ''
}

const close = () => {
  emit('update:modelValue', false)
}

const confirmImport = () => {
  isImporting.value = true
  setTimeout(() => {
    emit('import', validRows.value.map(r => r.data))
    isImporting.value = false
    reset()
    close()
  }, 400)
}

// Reset when modal closes
watch(() => props.modelValue, (val) => {
  if (!val) reset()
})
</script>

<style scoped>
/* ── Backdrop & Panel ──────────────────────────────────────────────────────── */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}

.modal-panel {
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px var(--border-color);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Header ────────────────────────────────────────────────────────────────── */
.modal-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 1.5rem 1.75rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.modal-title-wrap { display: flex; align-items: center; gap: 1rem; }

.modal-icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: linear-gradient(135deg, rgba(14,165,233,0.15), rgba(14,165,233,0.05));
  display: flex; align-items: center; justify-content: center;
  color: var(--primary); flex-shrink: 0;
}
.modal-icon svg { width: 22px; height: 22px; }

.modal-title { font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin: 0; }
.modal-subtitle { font-size: 0.82rem; color: var(--text-muted); margin: 0.2rem 0 0; }

.close-btn {
  background: transparent; border: none; cursor: pointer;
  color: var(--text-muted); padding: 0.25rem; border-radius: 6px;
  display: flex; align-items: center; transition: all 0.15s;
  flex-shrink: 0;
}
.close-btn:hover { color: var(--text-main); background: var(--bg-app); }
.close-btn svg { width: 20px; height: 20px; }

/* ── Body ───────────────────────────────────────────────────────────────────── */
.modal-body { padding: 1.5rem 1.75rem; overflow-y: auto; flex: 1; }

/* ── Upload Zone ───────────────────────────────────────────────────────────── */
.upload-section { display: flex; flex-direction: column; gap: 1rem; }

.drop-zone {
  border: 2px dashed var(--border-color);
  border-radius: 14px;
  padding: 3rem 2rem;
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg-app);
}
.drop-zone:hover, .drop-zone-active {
  border-color: var(--primary);
  background: rgba(14,165,233,0.04);
}

.hidden-input { display: none; }

.drop-icon {
  width: 56px; height: 56px; border-radius: 14px;
  background: rgba(14,165,233,0.08);
  display: flex; align-items: center; justify-content: center;
  color: var(--primary);
  transition: transform 0.2s;
}
.drop-icon-active { transform: translateY(-4px); }
.drop-icon svg { width: 28px; height: 28px; }

.drop-label { font-size: 0.95rem; color: var(--text-main); font-weight: 500; margin: 0; }
.drop-link { color: var(--primary); text-decoration: underline; }
.drop-hint { font-size: 0.8rem; color: var(--text-muted); margin: 0; }

.template-hint {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.875rem 1.1rem;
  background: rgba(14,165,233,0.05);
  border: 1px solid rgba(14,165,233,0.15);
  border-radius: 10px;
  font-size: 0.85rem;
  color: var(--text-muted);
}
.template-hint svg { width: 16px; height: 16px; color: var(--primary); flex-shrink: 0; }
.template-link {
  background: none; border: none; cursor: pointer;
  color: var(--primary); font-size: inherit; padding: 0;
  text-decoration: underline; font-weight: 600;
}
.template-link:hover { color: var(--primary-hover); }

/* ── Preview Section ──────────────────────────────────────────────────────── */
.preview-section { display: flex; flex-direction: column; gap: 1rem; }

.summary-bar {
  display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
  padding: 1rem 1.25rem;
  background: var(--bg-app);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.summary-file { display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 0; }
.summary-file-icon {
  width: 38px; height: 38px; border-radius: 10px;
  background: rgba(22,163,74,0.1); color: #16a34a;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.summary-file-icon svg { width: 20px; height: 20px; }
.summary-filename { font-size: 0.9rem; font-weight: 600; color: var(--text-main); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.summary-total { font-size: 0.75rem; color: var(--text-muted); margin: 0.15rem 0 0; }

.summary-stats { display: flex; gap: 0.5rem; }
.stat-pill {
  display: flex; align-items: center; gap: 0.35rem;
  padding: 0.35rem 0.75rem; border-radius: 99px;
  font-size: 0.8rem; font-weight: 600;
}
.stat-pill svg { width: 14px; height: 14px; }
.stat-valid { background: rgba(22,163,74,0.12); color: #16a34a; }
.stat-error { background: rgba(239,68,68,0.12); color: var(--danger); }

.change-file-btn {
  display: flex; align-items: center; gap: 0.5rem;
  background: transparent; border: 1px solid var(--border-color);
  border-radius: 8px; cursor: pointer; padding: 0.45rem 0.875rem;
  font-size: 0.82rem; color: var(--text-muted); transition: all 0.15s;
  font-family: inherit;
}
.change-file-btn svg { width: 15px; height: 15px; }
.change-file-btn:hover { color: var(--text-main); border-color: var(--primary); }

.error-banner {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.875rem 1.1rem;
  background: rgba(239,68,68,0.06);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: 10px;
  font-size: 0.85rem; color: var(--text-main);
}
.error-banner svg { width: 18px; height: 18px; color: var(--danger); flex-shrink: 0; }
.error-banner strong { color: var(--danger); }

/* ── Preview Table ─────────────────────────────────────────────────────────── */
.table-wrap { overflow-x: auto; border-radius: 10px; border: 1px solid var(--border-color); }

.preview-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }

.preview-table th {
  padding: 0.6rem 0.875rem;
  text-align: left; font-size: 0.68rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.05em;
  color: var(--text-muted); background: var(--bg-app);
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.preview-table td {
  padding: 0.6rem 0.875rem;
  border-bottom: 1px solid var(--border-color);
  vertical-align: top;
  white-space: nowrap;
  color: var(--text-main);
}
.preview-table tr:last-child td { border-bottom: none; }

/* Row states */
.row-valid { background: rgba(22,163,74,0.03); border-left: 3px solid #16a34a; }
.row-error { background: rgba(239,68,68,0.04); border-left: 3px solid var(--danger); }

.col-status { width: 52px; text-align: center; }
.col-row    { width: 42px; }
.row-num    { color: var(--text-muted); font-weight: 600; }

.status-badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 50%;
}
.status-badge svg { width: 12px; height: 12px; }
.status-valid { background: rgba(22,163,74,0.15); color: #16a34a; }
.status-error { background: rgba(239,68,68,0.15); color: var(--danger); }

.col-issues { white-space: normal; min-width: 220px; }
.issue-list { display: flex; flex-direction: column; gap: 0.25rem; }
.issue-chip {
  display: inline-block; padding: 0.15rem 0.5rem;
  background: rgba(239,68,68,0.1); color: var(--danger);
  border-radius: 4px; font-size: 0.73rem; font-weight: 500;
  white-space: normal; word-break: break-word;
}
.no-issues { color: var(--text-muted); }

/* ── Footer ────────────────────────────────────────────────────────────────── */
.modal-footer {
  padding: 1.25rem 1.75rem;
  border-top: 1px solid var(--border-color);
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 1rem;
  flex-shrink: 0;
}

.footer-hint { font-size: 0.82rem; color: var(--text-muted); }
.error-hint { color: var(--danger); }

.footer-actions { display: flex; gap: 0.75rem; margin-left: auto; }

.btn {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.625rem 1.25rem; border-radius: 9px;
  font-family: inherit; font-size: 0.9rem; font-weight: 600;
  cursor: pointer; border: none; transition: all 0.2s;
}
.btn svg { width: 16px; height: 16px; }

.btn-secondary {
  background: var(--bg-app); color: var(--text-main);
  border: 1px solid var(--border-color);
}
.btn-secondary:hover { background: var(--border-color); }

.btn-primary {
  background: var(--primary); color: #fff;
  box-shadow: 0 2px 8px rgba(14,165,233,0.25);
}
.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14,165,233,0.35);
}
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin-icon { animation: spin 0.8s linear infinite; }

/* ── Transition ────────────────────────────────────────────────────────────── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-active .modal-panel, .modal-fade-leave-active .modal-panel { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-panel, .modal-fade-leave-to .modal-panel { transform: translateY(16px) scale(0.98); opacity: 0; }
</style>
