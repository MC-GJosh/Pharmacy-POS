// Role definitions and permissions for Pharmacy POS
// Roles: admin, pharmacist, cashier, inventory_staff

const ROLES = {
  ADMIN: 'admin',
  PHARMACIST: 'pharmacist',
  CASHIER: 'cashier',
  INVENTORY: 'inventory_staff',
}

const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.PHARMACIST]: 'Pharmacist',
  [ROLES.CASHIER]: 'Cashier',
  [ROLES.INVENTORY]: 'Inventory Staff',
}

// ─── Per-action permissions ────────────────────────────────────
// Granular actions that can be toggled independently per role
const ACTIONS = {
  DELETE_ITEM: 'delete_item',
  APPLY_DISCOUNT: 'apply_discount',
  PROCESS_REFUND: 'process_refund',
  ADJUST_STOCK: 'adjust_stock',
  VOID_TRANSACTION: 'void_transaction',
  VIEW_COST_PRICE: 'view_cost_price',
  MANAGE_USERS: 'manage_users',
  EXPORT_REPORTS: 'export_reports',
  RECEIVE_STOCK: 'receive_stock',
  APPROVE_RX: 'approve_rx',
}

const ROLE_ACTIONS = {
  [ROLES.ADMIN]: Object.values(ACTIONS), // Full access — every action
  [ROLES.PHARMACIST]: [
    ACTIONS.APPLY_DISCOUNT,
    ACTIONS.PROCESS_REFUND,
    ACTIONS.ADJUST_STOCK,
    ACTIONS.VIEW_COST_PRICE,
    ACTIONS.RECEIVE_STOCK,
    ACTIONS.APPROVE_RX,
  ],
  [ROLES.CASHIER]: [
    ACTIONS.APPLY_DISCOUNT,
  ],
  [ROLES.INVENTORY]: [
    ACTIONS.ADJUST_STOCK,
    ACTIONS.VIEW_COST_PRICE,
    ACTIONS.RECEIVE_STOCK,
  ],
}

// ─── Route permissions ─────────────────────────────────────────
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ['/', '/pos', '/inventory', '/prescriptions', '/customers', '/reports', '/settings'],
  [ROLES.PHARMACIST]: ['/', '/pos', '/inventory', '/prescriptions', '/customers'],
  [ROLES.CASHIER]: ['/', '/pos', '/customers'],
  [ROLES.INVENTORY]: ['/', '/inventory'],
}

// ─── Sidebar nav visibility ────────────────────────────────────
const ROLE_NAV_SECTIONS = {
  [ROLES.ADMIN]: {
    core: ['dashboard', 'pos', 'inventory', 'prescriptions'],
    management: ['customers', 'reports'],
    footer: ['settings'],
  },
  [ROLES.PHARMACIST]: {
    core: ['dashboard', 'pos', 'inventory', 'prescriptions'],
    management: ['customers'],
    footer: [],
  },
  [ROLES.CASHIER]: {
    core: ['dashboard', 'pos'],
    management: ['customers'],
    footer: [],
  },
  [ROLES.INVENTORY]: {
    core: ['dashboard', 'inventory'],
    management: [],
    footer: [],
  },
}

// ─── Test user accounts ────────────────────────────────────────
const TEST_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Dr. Sarah Chen',
    initials: 'SC',
    role: ROLES.ADMIN,
  },
  {
    username: 'pharmacist',
    password: 'pharma123',
    name: 'James Rodriguez',
    initials: 'JR',
    role: ROLES.PHARMACIST,
  },
  {
    username: 'cashier',
    password: 'cash123',
    name: 'Maria Santos',
    initials: 'MS',
    role: ROLES.CASHIER,
  },
  {
    username: 'inventory',
    password: 'stock123',
    name: 'David Park',
    initials: 'DP',
    role: ROLES.INVENTORY,
  },
]

export function useAuth() {
  const currentUser = useState('currentUser', () => ({
    username: '',
    name: '',
    initials: '',
    role: '',
  }))

  const loginError = useState('loginError', () => '')

  const isAuthenticated = computed(() => !!currentUser.value.role)

  const roleLabel = computed(() => ROLE_LABELS[currentUser.value.role] || 'Unknown')

  const allowedRoutes = computed(() => ROLE_PERMISSIONS[currentUser.value.role] || [])

  const navSections = computed(() => ROLE_NAV_SECTIONS[currentUser.value.role] || { core: [], management: [], footer: [] })

  const allowedActions = computed(() => ROLE_ACTIONS[currentUser.value.role] || [])

  // ─── Route-level access ────────────────────────────────────
  const canAccess = (route) => {
    if (currentUser.value.role === ROLES.ADMIN) return true
    return allowedRoutes.value.includes(route)
  }

  // ─── Sidebar nav visibility ────────────────────────────────
  const canSeeNav = (navId) => {
    const sections = navSections.value
    return (
      sections.core.includes(navId) ||
      sections.management.includes(navId) ||
      sections.footer.includes(navId)
    )
  }

  // ─── Per-action permission check ───────────────────────────
  const canPerform = (action) => {
    if (currentUser.value.role === ROLES.ADMIN) return true
    return allowedActions.value.includes(action)
  }

  // ─── Login with credentials ────────────────────────────────
  const login = (username, password) => {
    loginError.value = ''
    const user = TEST_USERS.find(
      (u) => u.username === username && u.password === password
    )
    if (!user) {
      loginError.value = 'Invalid username or password'
      return false
    }
    currentUser.value = {
      username: user.username,
      name: user.name,
      initials: user.initials,
      role: user.role,
    }
    return true
  }

  // ─── Legacy role setter (for quick switch) ─────────────────
  const setRole = (role) => {
    const user = TEST_USERS.find((u) => u.role === role)
    if (user) {
      currentUser.value = {
        username: user.username,
        name: user.name,
        initials: user.initials,
        role: user.role,
      }
    }
  }

  const logout = () => {
    currentUser.value = { username: '', name: '', initials: '', role: '' }
    navigateTo('/login')
  }

  return {
    ROLES,
    ROLE_LABELS,
    ACTIONS,
    TEST_USERS,
    currentUser,
    loginError,
    isAuthenticated,
    roleLabel,
    allowedRoutes,
    allowedActions,
    navSections,
    canAccess,
    canSeeNav,
    canPerform,
    login,
    setRole,
    logout,
  }
}
