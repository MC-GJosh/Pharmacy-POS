<template>
  <div>
    <UiPageHeader title="Dashboard" subtitle="Overview of today's pharmacy operations">
      <template #actions>
        <UiAppButton variant="primary">
          <template #prefix>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-sm">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </template>
          New Sale
        </UiAppButton>
      </template>
    </UiPageHeader>

    <!-- Critical Alert Banner -->
    <div v-if="hasCriticalAlerts" class="critical-banner">
      <div class="critical-banner-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
      </div>
      <div class="critical-banner-content">
        <strong>{{ criticalAlerts.length }} Critical Alert{{ criticalAlerts.length > 1 ? 's' : '' }}</strong>
        <span> — {{ criticalAlerts[0].title }}</span>
      </div>
      <UiAppButton variant="text" size="sm" @click="scrollToAlerts">View All</UiAppButton>
    </div>

    <!-- Stats Cards Row 1: Sales -->
    <div class="stats-grid">
      <UiStatCard label="Today's Sales" :value="formatCurrency(todaySalesTotal)" color="blue"
        :trendText="`${todaySalesTrend}% from yesterday`" trendType="positive">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </template>
        <template #trend-icon>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="trend-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
        </template>
      </UiStatCard>

      <UiStatCard label="Total Products" :value="totalProducts" color="blue" trendText="Active SKUs" trendType="neutral">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
        </template>
      </UiStatCard>

      <UiStatCard label="Low Stock" :value="lowStockCount" color="orange" trendText="Requires attention" trendType="neutral">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
        </template>
      </UiStatCard>

      <UiStatCard label="Expiring Soon" :value="expiringSoonCount" color="orange" trendText="Within 30 days" trendType="neutral">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </template>
      </UiStatCard>

      <UiStatCard label="Expired" :value="expiredCount" color="red" trendText="Remove from shelf" trendType="negative">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
        </template>
      </UiStatCard>

      <UiStatCard label="Orders Today" :value="todayOrderCount" color="green"
        :trendText="`${todayOrderTrend}% from yesterday`" trendType="positive">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
        </template>
        <template #trend-icon>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="trend-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
        </template>
      </UiStatCard>
    </div>

    <!-- Main Dashboard Grid -->
    <div class="dashboard-grid">
      <!-- LEFT COLUMN -->
      <div class="dashboard-col-left">
        <!-- Sales Trend Chart -->
        <UiAppCard title="Sales Trend">
          <template #header>
            <UiAppBadge color="primary">Last 7 Days</UiAppBadge>
          </template>
          <UiSalesTrendChart
            :data="salesTrendData"
            :maxVal="salesTrendMax"
            :minVal="salesTrendMin"
            :formatCurrency="formatCurrency"
          />
        </UiAppCard>

        <!-- Recent Transactions -->
        <UiAppCard title="Recent Transactions" noPadding>
          <template #header>
            <UiAppButton variant="text" size="sm">View All</UiAppButton>
          </template>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Time</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tx in recentTransactions" :key="tx.id">
                  <td class="font-medium">{{ tx.id }}</td>
                  <td class="text-muted">{{ tx.time }}</td>
                  <td>{{ tx.customer }}</td>
                  <td class="font-medium">{{ formatCurrency(tx.amount) }}</td>
                  <td>
                    <UiAppBadge :color="tx.status === 'completed' ? 'success' : 'warning'">
                      {{ tx.status === 'completed' ? 'Completed' : 'Pending' }}
                    </UiAppBadge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </UiAppCard>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="dashboard-col-right">
        <!-- Best Selling Items -->
        <UiAppCard title="Best Sellers" noPadding>
          <template #header>
            <UiAppBadge color="success">Today</UiAppBadge>
          </template>
          <div class="bestseller-list">
            <div v-for="item in bestSellingItems" :key="item.rank" class="bestseller-item">
              <div class="bestseller-rank" :class="`rank-${item.rank}`">{{ item.rank }}</div>
              <div class="bestseller-info">
                <p class="bestseller-name">{{ item.name }}</p>
                <p class="bestseller-cat">{{ item.category }}</p>
              </div>
              <div class="bestseller-stats">
                <span class="bestseller-units">{{ item.unitsSold }} sold</span>
                <span class="bestseller-rev">{{ formatCurrency(item.revenue) }}</span>
              </div>
            </div>
          </div>
        </UiAppCard>

        <!-- Alerts & Notifications -->
        <UiAppCard title="Alerts & Warnings" ref="alertsCard">
          <template #header>
            <UiAppBadge v-if="criticalAlerts.length" color="danger">{{ criticalAlerts.length }} Critical</UiAppBadge>
          </template>
          <div class="alert-list">
            <div v-for="alert in alerts" :key="alert.id" :class="['alert-item', `alert-${alert.type}`]">
              <div :class="['alert-icon', `alert-icon-${alert.type}`]">
                <!-- Critical icon -->
                <svg v-if="alert.type === 'critical'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                <!-- Warning icon -->
                <svg v-else-if="alert.type === 'warning'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <!-- Info icon -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
              </div>
              <div class="alert-content">
                <p class="alert-title">{{ alert.title }}</p>
                <p class="alert-desc">{{ alert.description }}</p>
              </div>
              <span class="alert-time">{{ alert.time }}</span>
            </div>
          </div>
        </UiAppCard>
      </div>
    </div>
  </div>
</template>

<script setup>
const {
  totalProducts, lowStockCount, expiringSoonCount, expiredCount,
  todaySalesTotal, todaySalesTrend, todayOrderCount, todayOrderTrend,
  bestSellingItems, alerts, recentTransactions,
  salesTrendData, salesTrendMax, salesTrendMin,
  criticalAlerts, hasCriticalAlerts,
  formatCurrency,
} = useDashboard()

const alertsCard = ref(null)

const scrollToAlerts = () => {
  alertsCard.value?.$el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<style scoped>
/* ─── Critical alert banner ────────────────────────────────── */
.critical-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.03));
  border: 1px solid rgba(239, 68, 68, 0.2);
  animation: bannerPulse 3s ease-in-out infinite;
}
.critical-banner-icon {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  color: var(--danger);
}
.critical-banner-icon svg { width: 100%; height: 100%; }
.critical-banner-content {
  flex: 1;
  font-size: 0.875rem;
  color: var(--text-main);
}
.critical-banner-content strong { color: var(--danger); }

@keyframes bannerPulse {
  0%, 100% { border-color: rgba(239, 68, 68, 0.2); }
  50% { border-color: rgba(239, 68, 68, 0.45); }
}

/* ─── Stats grid (6 cards, 3 per row) ──────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

/* ─── Dashboard 2-column layout ────────────────────────────── */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.dashboard-col-left,
.dashboard-col-right {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ─── Table ────────────────────────────────────────────────── */
.table-container { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th,
.data-table td {
  padding: 0.875rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}
.data-table th {
  background-color: var(--bg-app);
  font-weight: 600;
  font-size: 0.7rem;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}
.data-table td { font-size: 0.85rem; }
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr { transition: background-color 0.15s ease; }
.data-table tbody tr:hover { background-color: var(--bg-app); }
.font-medium { font-weight: 500; }
.text-muted { color: var(--text-muted); }

/* ─── Best sellers ─────────────────────────────────────────── */
.bestseller-list { 
  display: flex;
  flex-direction: column;
}
.bestseller-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.15s ease;
}
.bestseller-item:last-child { border-bottom: none; }
.bestseller-item:hover { background-color: var(--bg-app); }

.bestseller-rank {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
  background: rgba(14, 165, 233, 0.08);
  color: var(--primary);
}
.bestseller-rank.rank-1 {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05));
  color: #d97706;
}
.bestseller-rank.rank-2 {
  background: rgba(148, 163, 184, 0.12);
  color: var(--text-muted);
}
.bestseller-rank.rank-3 {
  background: rgba(180, 83, 9, 0.1);
  color: #b45309;
}

.bestseller-info { flex: 1; min-width: 0; }
.bestseller-name {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--text-main);
  line-height: 1.2;
}
.bestseller-cat {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin: 0;
}
.bestseller-stats { text-align: right; flex-shrink: 0; }
.bestseller-units {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-main);
}
.bestseller-rev {
  display: block;
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* ─── Alert list ───────────────────────────────────────────── */
.alert-list {
  display: flex;
  flex-direction: column;
}
.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.15s ease;
}
.alert-item:last-child { border-bottom: none; }
.alert-item:hover { background-color: var(--bg-app); }

.alert-item.alert-critical {
  border-left: 3px solid var(--danger);
}
.alert-item.alert-warning {
  border-left: 3px solid var(--warning);
}
.alert-item.alert-info {
  border-left: 3px solid var(--primary);
}

.alert-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}
.alert-icon svg { width: 18px; height: 18px; }

.alert-icon-critical {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}
.alert-icon-warning {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}
.alert-icon-info {
  background-color: rgba(14, 165, 233, 0.1);
  color: var(--primary);
}

.alert-content { flex: 1; min-width: 0; }
.alert-title {
  font-weight: 600;
  font-size: 0.85rem;
  margin: 0 0 0.2rem 0;
  color: var(--text-main);
}
.alert-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}
.alert-time {
  font-size: 0.7rem;
  color: var(--text-muted);
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

/* ─── Responsive ───────────────────────────────────────────── */
@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .dashboard-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
