<template>
  <div>
    <UiPageHeader title="Audit Trail" subtitle="Full history of every action performed across all modules">
      <template #actions>
        <UiAppButton variant="secondary" @click="exportToCSV">
          <template #prefix>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-sm">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </template>
          Export CSV
        </UiAppButton>
      </template>
    </UiPageHeader>

    <!-- Stats cards -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon stat-icon-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
        </div>
        <div class="stat-body">
          <span class="stat-value">{{ totalLogs }}</span>
          <span class="stat-label">Total Events</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon-success">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </div>
        <div class="stat-body">
          <span class="stat-value">{{ todayLogs }}</span>
          <span class="stat-label">Today's Events</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon-warning">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
        <div class="stat-body">
          <span class="stat-value">{{ uniqueUsers.length }}</span>
          <span class="stat-label">Active Users</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon-danger">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </div>
        <div class="stat-body">
          <span class="stat-value">{{ deletionCount }}</span>
          <span class="stat-label">Deletions</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <!-- Search -->
      <div class="search-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="search-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 20.803z" />
        </svg>
        <input v-model="searchQuery" class="search-input" placeholder="Search by product, user, or notes…" />
        <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-sm"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <!-- User filter -->
      <select v-model="filterUser" class="filter-select">
        <option value="">All Users</option>
        <option v-for="u in uniqueUsers" :key="u.username" :value="u.username">{{ u.name }}</option>
      </select>

      <!-- Action type filter -->
      <select v-model="filterAction" class="filter-select">
        <option value="">All Actions</option>
        <option v-for="(label, key) in AUDIT_ACTION_LABELS" :key="key" :value="key">{{ label }}</option>
      </select>

      <!-- Date from -->
      <input type="date" v-model="filterDateFrom" class="filter-select date-input" />

      <!-- Date to -->
      <input type="date" v-model="filterDateTo" class="filter-select date-input" />

      <!-- Clear all -->
      <button v-if="hasActiveFilters" class="clear-filters-btn" @click="clearFilters">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-sm"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        Clear Filters
      </button>

      <span class="result-count">{{ filteredLogs.length }} event{{ filteredLogs.length !== 1 ? 's' : '' }}</span>
    </div>

    <!-- Audit Log Table -->
    <UiAppCard :noPadding="true">
      <!-- Empty state -->
      <div v-if="filteredLogs.length === 0" class="empty-state">
        <div class="empty-icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
        </div>
        <p class="empty-title">{{ logs.length === 0 ? 'No events recorded yet' : 'No events match your filters' }}</p>
        <p class="empty-sub">{{ logs.length === 0 ? 'Perform an action in the Inventory module to start tracking.' : 'Try adjusting or clearing your filters.' }}</p>
        <button v-if="hasActiveFilters" class="btn-link" @click="clearFilters">Clear all filters</button>
      </div>

      <!-- Table -->
      <div v-else class="table-wrap">
        <table class="audit-table">
          <thead>
            <tr>
              <th class="col-time">Date & Time</th>
              <th class="col-user">User</th>
              <th class="col-action">Action</th>
              <th class="col-entity">Entity</th>
              <th class="col-details">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="log in filteredLogs"
              :key="log.id"
              class="audit-row"
              :class="`row-${AUDIT_ACTION_COLORS[log.actionType] || 'info'}`"
              @click="expandedId = expandedId === log.id ? null : log.id"
            >
              <td class="col-time">
                <div class="time-cell">
                  <span class="time-date">{{ formatDate(log.timestamp) }}</span>
                  <span class="time-clock">{{ formatTime(log.timestamp) }}</span>
                </div>
              </td>
              <td class="col-user">
                <div class="user-cell">
                  <div class="user-avatar">{{ log.user.initials }}</div>
                  <div class="user-info">
                    <span class="user-name">{{ log.user.name }}</span>
                    <span class="user-role">{{ log.user.role }}</span>
                  </div>
                </div>
              </td>
              <td class="col-action">
                <span
                  class="action-badge"
                  :class="`badge-${AUDIT_ACTION_COLORS[log.actionType] || 'info'}`"
                >
                  {{ AUDIT_ACTION_LABELS[log.actionType] || log.actionType }}
                </span>
              </td>
              <td class="col-entity">
                <span class="entity-name">{{ log.entityName }}</span>
              </td>
              <td class="col-details">
                <div class="details-cell">
                  <!-- Stock Adjusted -->
                  <template v-if="log.actionType === 'STOCK_ADJUSTED'">
                    <span class="detail-pill">{{ log.details.reason }}</span>
                    <span class="detail-text">
                      <span class="stock-from">{{ log.details.stockBefore }}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="arrow-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                      <span class="stock-to">{{ log.details.stockAfter }}</span>
                      <span class="stock-diff" :class="(log.details.stockAfter - log.details.stockBefore) >= 0 ? 'diff-pos' : 'diff-neg'">
                        ({{ (log.details.stockAfter - log.details.stockBefore) >= 0 ? '+' : '' }}{{ log.details.stockAfter - log.details.stockBefore }})
                      </span>
                    </span>
                  </template>

                  <!-- Product Added -->
                  <template v-else-if="log.actionType === 'PRODUCT_ADDED'">
                    <span class="detail-pill">{{ log.details.dosageForm }}</span>
                    <span class="detail-text">{{ log.details.strength }} · Initial stock: {{ log.details.initialStock }}</span>
                  </template>

                  <!-- Product Edited -->
                  <template v-else-if="log.actionType === 'PRODUCT_EDITED'">
                    <span v-if="Object.keys(log.details.changed || {}).length === 0" class="detail-muted">No tracked changes</span>
                    <span v-else class="detail-text">{{ Object.keys(log.details.changed).length }} field{{ Object.keys(log.details.changed).length !== 1 ? 's' : '' }} changed</span>
                    <!-- Expanded diff -->
                    <div v-if="expandedId === log.id && Object.keys(log.details.changed || {}).length > 0" class="diff-panel" @click.stop>
                      <div v-for="(val, field) in log.details.changed" :key="field" class="diff-row">
                        <span class="diff-field">{{ field }}</span>
                        <span class="diff-from">{{ val.from }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="arrow-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                        <span class="diff-to">{{ val.to }}</span>
                      </div>
                    </div>
                  </template>

                  <!-- Product Deleted -->
                  <template v-else-if="log.actionType === 'PRODUCT_DELETED'">
                    <span class="detail-pill pill-danger">{{ log.details.category }}</span>
                    <span class="detail-text">Stock at deletion: {{ log.details.stockAtDeletion }}</span>
                  </template>

                  <!-- Bulk Import -->
                  <template v-else-if="log.actionType === 'BULK_IMPORT'">
                    <span class="detail-pill">{{ log.details.count }} items</span>
                    <span v-if="expandedId !== log.id" class="detail-text">{{ (log.details.products || []).slice(0, 2).join(', ') }}{{ (log.details.products || []).length > 2 ? ` +${log.details.products.length - 2} more` : '' }}</span>
                    <div v-if="expandedId === log.id" class="bulk-list" @click.stop>
                      <span v-for="p in log.details.products" :key="p" class="bulk-item">{{ p }}</span>
                    </div>
                  </template>

                  <!-- Notes if any -->
                  <span v-if="log.details.notes" class="detail-notes">"{{ log.details.notes }}"</span>

                  <!-- Expand hint -->
                  <span v-if="isExpandable(log)" class="expand-hint">
                    {{ expandedId === log.id ? '▲ collapse' : '▼ expand' }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UiAppCard>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const {
  logs, filteredLogs, addLog,
  AUDIT_ACTIONS, AUDIT_ACTION_LABELS, AUDIT_ACTION_COLORS,
  filterUser, filterAction, filterDateFrom, filterDateTo, searchQuery,
  clearFilters, totalLogs, todayLogs, uniqueUsers,
} = useAuditTrail()

const expandedId = ref(null)

// ── Computed ────────────────────────────────────────────────────────────────
const deletionCount = computed(() =>
  logs.value.filter(l => l.actionType === 'PRODUCT_DELETED').length
)

const hasActiveFilters = computed(() =>
  filterUser.value || filterAction.value || filterDateFrom.value || filterDateTo.value || searchQuery.value
)

// ── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-PH', { month: 'short', day: '2-digit', year: 'numeric' })
}

const formatTime = (iso) => {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
}

const isExpandable = (log) =>
  log.actionType === 'PRODUCT_EDITED' ||
  log.actionType === 'BULK_IMPORT'

// ── CSV Export ───────────────────────────────────────────────────────────────
const exportToCSV = () => {
  const headers = ['Timestamp', 'User', 'Role', 'Action', 'Entity', 'Details']
  const rows = filteredLogs.value.map(l => [
    new Date(l.timestamp).toLocaleString('en-PH'),
    l.user.name,
    l.user.role,
    AUDIT_ACTION_LABELS[l.actionType] || l.actionType,
    l.entityName,
    JSON.stringify(l.details),
  ])

  const csv = [headers, ...rows]
    .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `audit-trail-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
/* ── Stats Row ────────────────────────────────────────────────────────────── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: box-shadow 0.2s;
}
.stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

.stat-icon {
  width: 44px; height: 44px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.stat-icon svg { width: 22px; height: 22px; }
.stat-icon-primary { background: rgba(14,165,233,0.1); color: var(--primary); }
.stat-icon-success { background: rgba(22,163,74,0.1); color: #16a34a; }
.stat-icon-warning { background: rgba(234,179,8,0.1); color: #ca8a04; }
.stat-icon-danger  { background: rgba(239,68,68,0.1); color: var(--danger); }

.stat-body { display: flex; flex-direction: column; }
.stat-value { font-size: 1.75rem; font-weight: 800; color: var(--text-main); line-height: 1; }
.stat-label { font-size: 0.78rem; color: var(--text-muted); margin-top: 0.25rem; }

/* ── Filters ──────────────────────────────────────────────────────────────── */
.filters-bar {
  display: flex; align-items: center; gap: 0.75rem;
  margin-bottom: 1.25rem; flex-wrap: wrap;
}

.search-wrap { position: relative; flex: 1; min-width: 220px; }
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
.search-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(14,165,233,0.12); }
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
.date-input { min-width: 130px; }

.clear-filters-btn {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.55rem 0.875rem; border-radius: 8px;
  background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.2);
  color: var(--danger); font-family: inherit; font-size: 0.85rem;
  font-weight: 600; cursor: pointer; transition: all 0.15s;
}
.clear-filters-btn:hover { background: rgba(239,68,68,0.14); }

.result-count { font-size: 0.85rem; color: var(--text-muted); white-space: nowrap; margin-left: auto; }

/* ── Empty State ──────────────────────────────────────────────────────────── */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  padding: 4rem 2rem; color: var(--text-muted); gap: 0.5rem;
}
.empty-icon-wrap {
  width: 64px; height: 64px; border-radius: 16px;
  background: rgba(14,165,233,0.06); color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 0.5rem;
}
.empty-icon-wrap svg { width: 32px; height: 32px; }
.empty-title { font-size: 1.05rem; font-weight: 600; color: var(--text-main); margin: 0; }
.empty-sub { font-size: 0.85rem; margin: 0; text-align: center; max-width: 340px; }
.btn-link { background: none; border: none; cursor: pointer; color: var(--primary); font-size: 0.875rem; font-weight: 600; padding: 0; margin-top: 0.25rem; }
.btn-link:hover { text-decoration: underline; }

/* ── Table ────────────────────────────────────────────────────────────────── */
.table-wrap { overflow-x: auto; }

.audit-table {
  width: 100%; border-collapse: collapse; font-size: 0.875rem;
}

.audit-table th {
  padding: 0.75rem 1rem;
  text-align: left; font-size: 0.7rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.05em;
  color: var(--text-muted); background: var(--bg-app);
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.audit-row {
  cursor: pointer;
  transition: background 0.1s;
  border-bottom: 1px solid var(--border-color);
  border-left: 3px solid transparent;
}
.audit-row:last-child { border-bottom: none; }

/* Accent left border by action color */
.row-success { border-left-color: #16a34a; }
.row-info    { border-left-color: #0ea5e9; }
.row-danger  { border-left-color: #ef4444; }
.row-warning { border-left-color: #ca8a04; }
.row-primary { border-left-color: var(--primary); }

.row-success:hover { background: rgba(22,163,74,0.03); }
.row-info:hover    { background: rgba(14,165,233,0.03); }
.row-danger:hover  { background: rgba(239,68,68,0.03); }
.row-warning:hover { background: rgba(234,179,8,0.03); }
.row-primary:hover { background: rgba(14,165,233,0.03); }

.audit-table td { padding: 0.875rem 1rem; vertical-align: top; }

/* Time cell */
.col-time { min-width: 160px; }
.time-cell { display: flex; flex-direction: column; gap: 0.1rem; }
.time-date { font-weight: 600; color: var(--text-main); font-size: 0.83rem; }
.time-clock { font-size: 0.75rem; color: var(--text-muted); font-feature-settings: 'tnum'; }

/* User cell */
.col-user { min-width: 180px; }
.user-cell { display: flex; align-items: center; gap: 0.625rem; }
.user-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), #6366f1);
  color: white; font-weight: 700; font-size: 0.72rem;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; letter-spacing: 0.03em;
}
.user-info { display: flex; flex-direction: column; gap: 0.05rem; }
.user-name { font-weight: 600; color: var(--text-main); font-size: 0.85rem; }
.user-role { font-size: 0.72rem; color: var(--text-muted); text-transform: capitalize; }

/* Action badge */
.action-badge {
  display: inline-flex; align-items: center;
  padding: 0.25rem 0.65rem; border-radius: 99px;
  font-size: 0.73rem; font-weight: 700; white-space: nowrap;
}
.badge-success { background: rgba(22,163,74,0.12); color: #16a34a; }
.badge-info    { background: rgba(14,165,233,0.12); color: var(--primary); }
.badge-danger  { background: rgba(239,68,68,0.12); color: var(--danger); }
.badge-warning { background: rgba(234,179,8,0.12); color: #ca8a04; }
.badge-primary { background: rgba(14,165,233,0.12); color: var(--primary); }

/* Entity */
.col-entity { min-width: 180px; }
.entity-name { font-weight: 600; color: var(--text-main); }

/* Details */
.col-details { min-width: 260px; }
.details-cell { display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem; }

.detail-pill {
  display: inline-block; padding: 0.15rem 0.55rem; border-radius: 99px;
  background: rgba(14,165,233,0.1); color: var(--primary);
  font-size: 0.73rem; font-weight: 600; white-space: nowrap;
}
.pill-danger { background: rgba(239,68,68,0.1); color: var(--danger); }

.detail-text { font-size: 0.83rem; color: var(--text-main); display: flex; align-items: center; gap: 0.3rem; flex-wrap: wrap; }
.detail-muted { font-size: 0.83rem; color: var(--text-muted); font-style: italic; }
.detail-notes { font-size: 0.78rem; color: var(--text-muted); font-style: italic; }

.arrow-icon { width: 14px; height: 14px; color: var(--text-muted); flex-shrink: 0; }

.stock-from { color: var(--text-muted); font-weight: 500; }
.stock-to   { color: var(--text-main); font-weight: 700; }
.stock-diff { font-size: 0.75rem; font-weight: 700; }
.diff-pos { color: #16a34a; }
.diff-neg { color: var(--danger); }

.expand-hint { font-size: 0.7rem; color: var(--text-muted); margin-left: 0.25rem; user-select: none; }

/* Diff panel (expanded product edit) */
.diff-panel {
  width: 100%; margin-top: 0.5rem;
  background: var(--bg-app); border-radius: 8px;
  border: 1px solid var(--border-color);
  padding: 0.5rem 0.75rem;
  display: flex; flex-direction: column; gap: 0.3rem;
}
.diff-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem; flex-wrap: wrap; }
.diff-field { font-weight: 700; color: var(--text-muted); min-width: 120px; }
.diff-from { color: var(--danger); text-decoration: line-through; }
.diff-to   { color: #16a34a; font-weight: 600; }

/* Bulk list (expanded) */
.bulk-list {
  width: 100%; margin-top: 0.5rem;
  display: flex; flex-wrap: wrap; gap: 0.35rem;
}
.bulk-item {
  padding: 0.15rem 0.55rem; border-radius: 99px;
  background: rgba(14,165,233,0.08); color: var(--primary);
  font-size: 0.72rem; font-weight: 500;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .stats-row { grid-template-columns: 1fr 1fr; }
}
</style>
