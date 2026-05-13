<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Overview of today's pharmacy operations</p>
      </div>
      <button class="btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="btn-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        New Sale
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon-wrapper bg-blue">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="stat-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Sales Today</p>
          <h3 class="stat-value">$1,245.00</h3>
          <p class="stat-trend positive">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="trend-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
            12% from yesterday
          </p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper bg-green">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="stat-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Orders</p>
          <h3 class="stat-value">64</h3>
          <p class="stat-trend positive">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="trend-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
            5% from yesterday
          </p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper bg-orange">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="stat-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Prescriptions Filled</p>
          <h3 class="stat-value">28</h3>
          <p class="stat-trend negative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="trend-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" /></svg>
            2% from yesterday
          </p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper bg-red">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="stat-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Low Stock Items</p>
          <h3 class="stat-value">12</h3>
          <p class="stat-trend neutral">Requires attention</p>
        </div>
      </div>
    </div>

    <!-- Recent Activity Placeholder -->
    <div class="dashboard-grid">
      <div class="card recent-orders">
        <div class="card-header">
          <h3 class="card-title">Recent Transactions</h3>
          <button class="btn-text">View All</button>
        </div>
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
              <tr>
                <td class="font-medium">INV-2048</td>
                <td class="text-muted">10:42 AM</td>
                <td>Walk-in Customer</td>
                <td class="font-medium">$42.50</td>
                <td><span class="badge bg-success-light text-success">Completed</span></td>
              </tr>
              <tr>
                <td class="font-medium">INV-2047</td>
                <td class="text-muted">10:15 AM</td>
                <td>Sarah Johnson</td>
                <td class="font-medium">$128.00</td>
                <td><span class="badge bg-success-light text-success">Completed</span></td>
              </tr>
              <tr>
                <td class="font-medium">INV-2046</td>
                <td class="text-muted">09:30 AM</td>
                <td>Michael Chen</td>
                <td class="font-medium">$15.75</td>
                <td><span class="badge bg-success-light text-success">Completed</span></td>
              </tr>
              <tr>
                <td class="font-medium">INV-2045</td>
                <td class="text-muted">09:05 AM</td>
                <td>Walk-in Customer</td>
                <td class="font-medium">$8.99</td>
                <td><span class="badge bg-success-light text-success">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card alerts">
        <div class="card-header">
          <h3 class="card-title">Alerts & Notifications</h3>
        </div>
        <div class="alert-list">
          <div class="alert-item">
            <div class="alert-icon bg-red-light text-red">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div class="alert-content">
              <p class="alert-title">Low Stock: Amoxicillin 500mg</p>
              <p class="alert-time">Only 2 boxes remaining</p>
            </div>
          </div>
          <div class="alert-item">
            <div class="alert-icon bg-orange-light text-orange">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div class="alert-content">
              <p class="alert-title">Expiring Soon: Ibuprofen</p>
              <p class="alert-time">Batch #4829 expires in 30 days</p>
            </div>
          </div>
          <div class="alert-item">
            <div class="alert-icon bg-blue-light text-blue">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
            </div>
            <div class="alert-content">
              <p class="alert-title">Pending Prescription</p>
              <p class="alert-time">Dr. Smith clinic sent a new Rx</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: var(--text-main);
  letter-spacing: -0.025em;
}

.page-subtitle {
  color: var(--text-muted);
  margin: 0;
  font-size: 0.95rem;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.625rem 1.25rem;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(14, 165, 233, 0.3);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.btn-text {
  background: transparent;
  border: none;
  color: var(--primary);
  font-weight: 600;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-text:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: var(--bg-card);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stat-icon {
  width: 24px;
  height: 24px;
}

.bg-blue { background-color: rgba(14, 165, 233, 0.1); color: var(--primary); }
.bg-green { background-color: rgba(16, 185, 129, 0.1); color: var(--success); }
.bg-orange { background-color: rgba(245, 158, 11, 0.1); color: var(--warning); }
.bg-red { background-color: rgba(239, 68, 68, 0.1); color: var(--danger); }

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: var(--text-main);
  letter-spacing: -0.025em;
}

.stat-trend {
  font-size: 0.75rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
}

.trend-icon {
  width: 14px;
  height: 14px;
}

.positive { color: var(--success); }
.negative { color: var(--danger); }
.neutral { color: var(--text-muted); }

/* Dashboard Grid Layout */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.card {
  background-color: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  overflow: hidden;
}

.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-main);
}

/* Table Styles */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, 
.data-table td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  background-color: #f8fafc;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.data-table td {
  font-size: 0.875rem;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background-color: #f8fafc;
}

.font-medium { font-weight: 500; }
.text-muted { color: var(--text-muted); }

/* Badge Styles */
.badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.bg-success-light { background-color: rgba(16, 185, 129, 0.1); }
.text-success { color: var(--success); }

/* Alerts List */
.alert-list {
  display: flex;
  flex-direction: column;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.alert-item:last-child {
  border-bottom: none;
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

.alert-icon svg {
  width: 18px;
  height: 18px;
}

.bg-red-light { background-color: rgba(239, 68, 68, 0.1); }
.text-red { color: var(--danger); }
.bg-orange-light { background-color: rgba(245, 158, 11, 0.1); }
.text-orange { color: var(--warning); }
.bg-blue-light { background-color: rgba(14, 165, 233, 0.1); }
.text-blue { color: var(--primary); }

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  font-size: 0.875rem;
  margin: 0 0 0.25rem 0;
  color: var(--text-main);
}

.alert-time {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}
</style>
