// ─── Dashboard data composable ─────────────────────────────────
// Shell with mock data — will be populated from live modules later
// (inventory, POS/sales, prescriptions)

export function useDashboard() {
  // ─── Summary counts ──────────────────────────────────────────
  const totalProducts = ref(248)
  const lowStockCount = ref(12)
  const expiringSoonCount = ref(8)
  const expiredCount = ref(3)

  // ─── Sales ───────────────────────────────────────────────────
  const todaySalesTotal = ref(1245.0)
  const todaySalesTrend = ref(12) // percent vs yesterday
  const todayOrderCount = ref(64)
  const todayOrderTrend = ref(5) // percent vs yesterday
  const prescriptionsFilled = ref(28)
  const prescriptionsTrend = ref(-2) // negative = down

  // ─── Best-selling items (top 5) ──────────────────────────────
  const bestSellingItems = ref([
    { rank: 1, name: 'Paracetamol 500mg', category: 'OTC', unitsSold: 142, revenue: 710.0 },
    { rank: 2, name: 'Amoxicillin 500mg', category: 'Antibiotics', unitsSold: 98, revenue: 1470.0 },
    { rank: 3, name: 'Cetirizine 10mg', category: 'Antihistamines', unitsSold: 87, revenue: 435.0 },
    { rank: 4, name: 'Losartan 50mg', category: 'Cardiovascular', unitsSold: 76, revenue: 1140.0 },
    { rank: 5, name: 'Metformin 500mg', category: 'Diabetes', unitsSold: 64, revenue: 320.0 },
  ])

  // ─── Alert banners (critical stock & expiry) ─────────────────
  const alerts = ref([
    {
      id: 1,
      type: 'critical', // critical | warning | info
      severity: 'stock',
      title: 'Critical Stock: Amoxicillin 500mg',
      description: 'Only 2 boxes remaining — reorder immediately',
      time: '10 min ago',
    },
    {
      id: 2,
      type: 'critical',
      severity: 'expiry',
      title: 'Expired: Ibuprofen 400mg (Batch #3201)',
      description: 'Expired on May 10, 2026 — remove from shelf',
      time: '2 hours ago',
    },
    {
      id: 3,
      type: 'warning',
      severity: 'stock',
      title: 'Low Stock: Cetirizine 10mg',
      description: '8 units left — below reorder point of 20',
      time: '3 hours ago',
    },
    {
      id: 4,
      type: 'warning',
      severity: 'expiry',
      title: 'Expiring Soon: Metformin 500mg (Batch #4829)',
      description: 'Expires in 28 days — consider discount or return',
      time: '5 hours ago',
    },
    {
      id: 5,
      type: 'info',
      severity: 'stock',
      title: 'Stock Received: Losartan 50mg',
      description: '50 boxes added from PharmaCorp order #PO-1042',
      time: '6 hours ago',
    },
  ])

  // ─── Sales trend data (last 7 days) ──────────────────────────
  const salesTrendData = ref([
    { day: 'Mon', sales: 980 },
    { day: 'Tue', sales: 1150 },
    { day: 'Wed', sales: 890 },
    { day: 'Thu', sales: 1320 },
    { day: 'Fri', sales: 1045 },
    { day: 'Sat', sales: 1480 },
    { day: 'Sun', sales: 1245 },
  ])

  // ─── Recent transactions ────────────────────────────────────
  const recentTransactions = ref([
    { id: 'INV-2049', time: '10:42 AM', customer: 'Maria Garcia', amount: 65.00, status: 'completed' },
    { id: 'INV-2048', time: '10:37 AM', customer: 'Walk-in Customer', amount: 45.00, status: 'completed' },
    { id: 'INV-2047', time: '10:22 AM', customer: 'John Dela Cruz', amount: 120.50, status: 'completed' },
    { id: 'INV-2046', time: '10:15 AM', customer: 'Walk-in Customer', amount: 55.00, status: 'completed' },
    { id: 'INV-2045', time: '9:58 AM', customer: 'Angela Reyes', amount: 210.00, status: 'pending' },
  ])

  // ─── Computed helpers ────────────────────────────────────────
  const criticalAlerts = computed(() => alerts.value.filter(a => a.type === 'critical'))
  const warningAlerts = computed(() => alerts.value.filter(a => a.type === 'warning'))
  const hasCriticalAlerts = computed(() => criticalAlerts.value.length > 0)

  const salesTrendMax = computed(() => Math.max(...salesTrendData.value.map(d => d.sales)))
  const salesTrendMin = computed(() => Math.min(...salesTrendData.value.map(d => d.sales)))

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  return {
    // Counts
    totalProducts,
    lowStockCount,
    expiringSoonCount,
    expiredCount,
    // Sales
    todaySalesTotal,
    todaySalesTrend,
    todayOrderCount,
    todayOrderTrend,
    prescriptionsFilled,
    prescriptionsTrend,
    // Lists
    bestSellingItems,
    alerts,
    recentTransactions,
    // Chart
    salesTrendData,
    salesTrendMax,
    salesTrendMin,
    // Computed
    criticalAlerts,
    warningAlerts,
    hasCriticalAlerts,
    // Helpers
    formatCurrency,
  }
}
