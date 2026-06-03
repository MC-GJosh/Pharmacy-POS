<template>
  <div>
    <UiPageHeader title="Inventory" subtitle="Manage medicines, track stock, and view substitutes">
      <template #actions>
        <div class="header-actions">
          <UiAppButton variant="secondary" size="sm" @click="downloadImportTemplate">
            <template #prefix>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-sm"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            </template>
            Template
          </UiAppButton>
          <UiAppButton variant="secondary" size="sm" @click="showImport = true">
            <template #prefix>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-sm"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            </template>
            Import XLSX
          </UiAppButton>
          <UiAppButton variant="secondary" size="sm" @click="exportInventoryToExcel">
            <template #prefix>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-sm"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            </template>
            Export Excel
          </UiAppButton>
          <UiAppButton variant="primary" @click="openAdd">
            <template #prefix>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-sm"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </template>
            Add Drug
          </UiAppButton>
        </div>
      </template>
    </UiPageHeader>

    <!-- Filters bar -->
    <div class="filters-bar">
      <div class="search-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="search-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 20.803z" /></svg>
        <input v-model="searchQuery" class="search-input" placeholder="Search by generic name, brand, strength…" />
        <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-sm"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <select v-model="filterCategory" class="filter-select">
        <option value="">All Categories</option>
        <option v-for="c in DRUG_CATEGORIES" :key="c" :value="c">{{ c }}</option>
      </select>

      <select v-model="filterForm" class="filter-select">
        <option value="">All Forms</option>
        <option v-for="f in DOSAGE_FORMS" :key="f" :value="f">{{ f }}</option>
      </select>

      <select v-model="filterStorage" class="filter-select">
        <option value="">All Storage</option>
        <option v-for="s in STORAGE_REQUIREMENTS" :key="s" :value="s">{{ s }}</option>
      </select>

      <span class="result-count">{{ filteredDrugs.length }} result{{ filteredDrugs.length !== 1 ? 's' : '' }}</span>
    </div>

    <!-- Drug Table -->
    <UiAppCard :noPadding="true">
      <div class="table-wrap">
        <table class="drug-table">
          <thead>
            <tr>
              <th>Drug (Generic / Brand)</th>
              <th>Category</th>
              <th>Form & Strength</th>
              <th>Manufacturer</th>
              <th>Packaging</th>
              <th>Stock</th>
              <th>Expiry</th>
              <th>Storage</th>
              <th>Pricing</th>
              <th>Flags</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredDrugs.length === 0">
              <td colspan="11" class="empty-row">
                <div class="empty-state">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="empty-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                  <p>No drugs found matching your filters.</p>
                </div>
              </td>
            </tr>
            <tr v-for="drug in filteredDrugs" :key="drug.id" class="drug-row" @click="viewDrug(drug)">
              <td>
                <div class="drug-name-cell">
                  <span class="brand-name">{{ drug.brandName }}</span>
                  <span class="generic-name">{{ drug.genericName }}</span>
                </div>
              </td>
              <td><span class="category-text">{{ drug.category }}</span></td>
              <td>
                <div class="form-strength">
                  <span class="form-pill">{{ drug.dosageForm }}</span>
                  <span class="strength-text">{{ drug.strength }}</span>
                </div>
              </td>
              <td class="muted-text">{{ drug.manufacturer }}</td>
              <td>
                <div class="packaging-cell">
                  <span class="pkg-main">{{ piecesPerBox(drug) }} pcs/box</span>
                  <span class="pkg-sub">{{ drug.stripsPerBox }} strips × {{ drug.piecesPerStrip }} pcs</span>
                </div>
              </td>
              <td>
                <div class="stock-cell">
                  <UiAppBadge :color="stockStatus(drug) === 'ok' ? 'success' : stockStatus(drug) === 'low' ? 'warning' : 'danger'">
                    {{ drug.stock === 0 ? 'Out' : drug.stock + ' ' + (drug.unitOfMeasure || 'pcs') }}
                  </UiAppBadge>
                </div>
              </td>
              <td>
                <div v-if="drug.expiryDate" class="expiry-cell">
                  <UiAppBadge :color="expiryStatus(drug) === 'expired' || expiryStatus(drug) === 'critical' ? 'danger' : expiryStatus(drug) === 'warning' ? 'warning' : 'success'">
                    {{ formatDate(drug.expiryDate) }}
                  </UiAppBadge>
                  <span v-if="expiryDaysLeft(drug) !== null" class="expiry-sub">{{ expiryDaysLeft(drug) > 0 ? expiryDaysLeft(drug) + ' days left' : 'Expired' }}</span>
                </div>
                <span v-else class="muted-text">-</span>
              </td>
              <td>
                <div class="storage-cell">
                  <span class="storage-main">{{ drug.storageLocation || '-' }}</span>
                  <span v-if="drug.storageRequirement" class="storage-sub">{{ drug.storageRequirement }}</span>
                </div>
              </td>
              <td>
                <div class="pricing-cell">
                  <span class="price-main" title="Selling Price / Retail">₱{{ drug.sellingPrice.toFixed(2) }}</span>
                  <span class="price-sub" title="Cost Price / Wholesale">C: ₱{{ drug.costPrice.toFixed(2) }} | W: ₱{{ drug.wholesalePrice.toFixed(2) }}</span>
                </div>
              </td>
              <td>
                <div class="flags-cell">
                  <span v-if="drug.sellByUnit" class="flag-dot flag-blue" title="Sell by piece"></span>
                  <span v-if="hasSubstitute(drug)" class="flag-dot flag-orange" title="Has substitutes"></span>
                </div>
              </td>
              <td @click.stop>
                <div class="row-actions">
                  <button class="action-btn" title="Adjust Stock" @click.stop="openAdjust(drug)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-sm"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </button>
                  <button class="action-btn" title="View details" @click="viewDrug(drug)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-sm"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.58-3.008-9.964-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </button>
                  <button class="action-btn" title="Edit" @click="openEdit(drug)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-sm"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                  </button>
                  <button class="action-btn action-danger" title="Delete" @click="deleteDrug(drug.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-sm"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Legend -->
      <div class="table-legend">
        <span class="legend-item"><span class="flag-dot flag-blue"></span> Sell by piece/strip</span>
        <span class="legend-item"><span class="flag-dot flag-orange"></span> Generic substitutes available</span>
      </div>
    </UiAppCard>

    <!-- Modals -->
    <InventoryDrugFormModal
      v-model="showForm"
      :drug="editingDrug"
      :DRUG_CATEGORIES="DRUG_CATEGORIES"
      :DOSAGE_FORMS="DOSAGE_FORMS"
      :MANUFACTURERS="MANUFACTURERS"
      :UNITS_OF_MEASURE="UNITS_OF_MEASURE"
      :STORAGE_REQUIREMENTS="STORAGE_REQUIREMENTS"
      @submit="handleFormSubmit"
    />

    <InventoryStockAdjustmentModal
      v-model="showAdjust"
      :drug="adjustingDrug"
      :ADJUSTMENT_REASONS="ADJUSTMENT_REASONS"
      @submit="handleAdjustSubmit"
    />

    <InventoryDrugDetailDrawer
      v-model="showDetail"
      :drug="selectedDrug"
      :substitutes="selectedSubstitutes"
      @edit="openEdit"
      @view="viewDrug"
    />

    <InventoryBulkImportModal
      v-model="showImport"
      @import="handleBulkImport"
      @downloadTemplate="downloadImportTemplate"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const {
  filteredDrugs, searchQuery, filterCategory, filterForm, filterStorage,
  DRUG_CATEGORIES, DOSAGE_FORMS, MANUFACTURERS, UNITS_OF_MEASURE, STORAGE_REQUIREMENTS, ADJUSTMENT_REASONS,
  piecesPerBox, stockStatus, expiryStatus, expiryDaysLeft, hasSubstitute, getSubstituteDetails,
  addDrug, updateDrug, deleteDrug, adjustStock,
  exportInventoryToExcel, downloadImportTemplate,
} = useInventory()

const { addLog, AUDIT_ACTIONS } = useAuditTrail()

// ── Bulk import modal ──────────────────────────────────────────────────────
const showImport = ref(false)

const handleBulkImport = (rows) => {
  rows.forEach(data => addDrug(data))
  // Log a single summary entry for the entire batch import
  addLog(AUDIT_ACTIONS.BULK_IMPORT, `${rows.length} product${rows.length !== 1 ? 's' : ''}`, {
    count: rows.length,
    products: rows.map(d => `${d.brandName} (${d.genericName})`),
  })
}

const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── Form modal ──────────────────────────────────────────────────────────────
const showForm = ref(false)
const editingDrug = ref(null)

const openAdd = () => { editingDrug.value = null; showForm.value = true }
const openEdit = (drug) => { editingDrug.value = drug; showForm.value = true; showDetail.value = false }

const handleFormSubmit = (data) => {
  if (editingDrug.value) updateDrug(editingDrug.value.id, data)
  else addDrug(data)
}

// ── Adjust modal ────────────────────────────────────────────────────────────
const showAdjust = ref(false)
const adjustingDrug = ref(null)

const openAdjust = (drug) => { adjustingDrug.value = drug; showAdjust.value = true }
const handleAdjustSubmit = (data) => {
  if (adjustingDrug.value) {
    adjustStock(adjustingDrug.value.id, data)
  }
}

// ── Detail drawer ───────────────────────────────────────────────────────────
const showDetail = ref(false)
const selectedDrug = ref(null)
const selectedSubstitutes = computed(() =>
  selectedDrug.value ? getSubstituteDetails(selectedDrug.value) : []
)

const viewDrug = (drug) => {
  selectedDrug.value = drug
  showDetail.value = true
}
</script>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filters-bar {
  display: flex; align-items: center; gap: 0.75rem;
  margin-bottom: 1.25rem; flex-wrap: wrap;
}

.search-wrap {
  position: relative; flex: 1; min-width: 240px;
}
.search-icon {
  position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%);
  width: 16px; height: 16px; color: var(--text-muted); pointer-events: none;
}
.search-input {
  width: 100%; padding: 0.625rem 2.25rem 0.625rem 2.25rem;
  border: 1px solid var(--border-color); border-radius: 8px;
  background: var(--bg-card); color: var(--text-main);
  font-family: inherit; font-size: 0.9rem; outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(14,165,233,0.12);
}
.clear-btn {
  position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
  background: transparent; border: none; cursor: pointer;
  color: var(--text-muted); display: flex; align-items: center;
}
.clear-btn:hover { color: var(--text-main); }

.filter-select {
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--border-color); border-radius: 8px;
  background: var(--bg-card); color: var(--text-main);
  font-family: inherit; font-size: 0.875rem; outline: none; cursor: pointer;
  transition: border-color 0.15s;
}
.filter-select:focus { border-color: var(--primary); }

.result-count { font-size: 0.85rem; color: var(--text-muted); white-space: nowrap; }

/* Table */
.table-wrap { overflow-x: auto; }

.drug-table {
  width: 100%; border-collapse: collapse; font-size: 0.875rem;
}

.drug-table th {
  padding: 0.75rem 1rem;
  text-align: left; font-size: 0.72rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
  background: var(--bg-app);
}

.drug-row {
  cursor: pointer;
  transition: background 0.12s;
  border-bottom: 1px solid var(--border-color);
}
.drug-row:last-child { border-bottom: none; }
.drug-row:hover { background: rgba(14,165,233,0.03); }

.drug-table td { padding: 0.875rem 1rem; vertical-align: middle; }

.drug-name-cell { display: flex; flex-direction: column; gap: 0.125rem; }
.brand-name { font-weight: 600; color: var(--text-main); }
.generic-name { font-size: 0.78rem; color: var(--text-muted); }

.category-text { font-size: 0.8rem; color: var(--text-muted); }

.form-strength { display: flex; flex-direction: column; gap: 0.25rem; }
.form-pill {
  display: inline-block; padding: 0.1rem 0.5rem;
  background: rgba(14,165,233,0.08); color: var(--primary);
  border-radius: 99px; font-size: 0.72rem; font-weight: 600;
  width: fit-content;
}
.strength-text { font-weight: 600; color: var(--text-main); font-size: 0.85rem; }

.muted-text { color: var(--text-muted); }

.packaging-cell { display: flex; flex-direction: column; gap: 0.125rem; }
.pkg-main { font-weight: 600; color: var(--text-main); }
.pkg-sub { font-size: 0.75rem; color: var(--text-muted); }

.expiry-cell, .storage-cell { display: flex; flex-direction: column; gap: 0.125rem; }
.expiry-sub, .storage-sub { font-size: 0.72rem; color: var(--text-muted); }
.storage-main { font-weight: 500; color: var(--text-main); font-size: 0.85rem; }

.pricing-cell { display: flex; flex-direction: column; gap: 0.125rem; }
.price-main { font-weight: 700; color: var(--primary); font-size: 0.9rem; }
.price-sub { font-size: 0.72rem; color: var(--text-muted); }

.flags-cell { display: flex; gap: 0.375rem; align-items: center; }
.flag-dot {
  width: 10px; height: 10px; border-radius: 50%;
  display: inline-block; flex-shrink: 0;
}
.flag-blue { background: var(--primary); }
.flag-orange { background: var(--warning); }

.row-actions { display: flex; gap: 0.25rem; opacity: 0; transition: opacity 0.15s; }
.drug-row:hover .row-actions { opacity: 1; }

.action-btn {
  background: transparent; border: none; cursor: pointer;
  padding: 0.375rem; border-radius: 6px; color: var(--text-muted);
  display: flex; align-items: center; transition: all 0.15s;
}
.action-btn:hover { background: var(--bg-app); color: var(--text-main); }
.action-btn.action-danger:hover { background: rgba(239,68,68,0.1); color: var(--danger); }

.empty-row { padding: 0 !important; }
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  padding: 3rem 2rem; color: var(--text-muted); gap: 0.5rem;
}
.empty-icon { width: 48px; height: 48px; color: var(--primary); opacity: 0.4; }

.table-legend {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border-color);
  display: flex; gap: 1.25rem; flex-wrap: wrap;
}
.legend-item {
  display: flex; align-items: center; gap: 0.375rem;
  font-size: 0.78rem; color: var(--text-muted);
}
</style>
