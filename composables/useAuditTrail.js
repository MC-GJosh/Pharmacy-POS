// ─── useAuditTrail.js ──────────────────────────────────────────────────────
// Central audit trail composable for the Pharmacy POS system.
// Logs every significant action (inventory CRUD, stock adjustments, bulk imports)
// with the acting user, timestamp, and action-specific details.

// ─── Action Types ──────────────────────────────────────────────────────────
export const AUDIT_ACTIONS = {
  PRODUCT_ADDED:   'PRODUCT_ADDED',
  PRODUCT_EDITED:  'PRODUCT_EDITED',
  PRODUCT_DELETED: 'PRODUCT_DELETED',
  STOCK_ADJUSTED:  'STOCK_ADJUSTED',
  BULK_IMPORT:     'BULK_IMPORT',
}

export const AUDIT_ACTION_LABELS = {
  [AUDIT_ACTIONS.PRODUCT_ADDED]:   'Product Added',
  [AUDIT_ACTIONS.PRODUCT_EDITED]:  'Product Edited',
  [AUDIT_ACTIONS.PRODUCT_DELETED]: 'Product Deleted',
  [AUDIT_ACTIONS.STOCK_ADJUSTED]:  'Stock Adjusted',
  [AUDIT_ACTIONS.BULK_IMPORT]:     'Bulk Import',
}

export const AUDIT_ACTION_COLORS = {
  [AUDIT_ACTIONS.PRODUCT_ADDED]:   'success',
  [AUDIT_ACTIONS.PRODUCT_EDITED]:  'info',
  [AUDIT_ACTIONS.PRODUCT_DELETED]: 'danger',
  [AUDIT_ACTIONS.STOCK_ADJUSTED]:  'warning',
  [AUDIT_ACTIONS.BULK_IMPORT]:     'primary',
}

// ─── Composable ────────────────────────────────────────────────────────────
export function useAuditTrail() {
  // Shared state across all components
  const logs = useState('auditLogs', () => [])
  const nextLogId = useState('auditLogNextId', () => 1)

  /**
   * Add a new audit log entry.
   * @param {string} actionType  — one of AUDIT_ACTIONS
   * @param {string} entityName  — display name of the affected record
   * @param {object} details     — freeform context (before/after values, reasons, etc.)
   */
  const addLog = (actionType, entityName, details = {}) => {
    const { currentUser } = useAuth()

    logs.value.unshift({
      id: nextLogId.value++,
      timestamp: new Date().toISOString(),
      actionType,
      entityName,
      details,
      user: {
        username: currentUser.value.username || 'system',
        name: currentUser.value.name || 'System',
        initials: currentUser.value.initials || 'SY',
        role: currentUser.value.role || '',
      },
    })
  }

  // ── Filter helpers ────────────────────────────────────────────────────
  const filterUser = ref('')
  const filterAction = ref('')
  const filterDateFrom = ref('')
  const filterDateTo = ref('')
  const searchQuery = ref('')

  const filteredLogs = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    return logs.value.filter(log => {
      // Text search across entity name and user
      if (q) {
        const haystack = [
          log.entityName,
          log.user.name,
          log.user.username,
          AUDIT_ACTION_LABELS[log.actionType] || log.actionType,
          log.details?.notes || '',
          log.details?.reason || '',
        ].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }

      // User filter
      if (filterUser.value && log.user.username !== filterUser.value) return false

      // Action type filter
      if (filterAction.value && log.actionType !== filterAction.value) return false

      // Date-from filter
      if (filterDateFrom.value) {
        const logDate = log.timestamp.slice(0, 10)
        if (logDate < filterDateFrom.value) return false
      }

      // Date-to filter
      if (filterDateTo.value) {
        const logDate = log.timestamp.slice(0, 10)
        if (logDate > filterDateTo.value) return false
      }

      return true
    })
  })

  const clearFilters = () => {
    filterUser.value = ''
    filterAction.value = ''
    filterDateFrom.value = ''
    filterDateTo.value = ''
    searchQuery.value = ''
  }

  // ── Stat helpers ──────────────────────────────────────────────────────
  const totalLogs = computed(() => logs.value.length)

  const todayLogs = computed(() => {
    const today = new Date().toISOString().slice(0, 10)
    return logs.value.filter(l => l.timestamp.slice(0, 10) === today).length
  })

  const uniqueUsers = computed(() => {
    const seen = new Set()
    return logs.value
      .map(l => l.user)
      .filter(u => {
        if (seen.has(u.username)) return false
        seen.add(u.username)
        return true
      })
  })

  return {
    logs,
    filteredLogs,
    addLog,
    AUDIT_ACTIONS,
    AUDIT_ACTION_LABELS,
    AUDIT_ACTION_COLORS,
    filterUser,
    filterAction,
    filterDateFrom,
    filterDateTo,
    searchQuery,
    clearFilters,
    totalLogs,
    todayLogs,
    uniqueUsers,
  }
}
