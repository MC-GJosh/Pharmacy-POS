<template>
  <header class="top-header">
    <div class="search-bar">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="search-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <input type="text" placeholder="Search medicines, patients, or invoices..." class="search-input" />
    </div>

    <div class="header-actions">
      <button class="icon-btn">
        <span class="badge"></span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="action-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      </button>

      <div class="user-profile">
        <div class="avatar">A</div>
        <div class="user-info">
          <span class="user-name">Admin User</span>
          <span class="user-role">Pharmacist</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.top-header {
  height: 72px;
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: var(--bg-app);
  border: 1px solid var(--border-color);
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  width: 400px;
  transition: all 0.2s ease;
}

.search-bar:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  padding-left: 0.75rem;
  width: 100%;
  font-size: 0.95rem;
  color: var(--text-main);
  font-family: inherit;
}

.search-input::placeholder {
  color: #94a3b8;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.icon-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background-color: var(--bg-app);
}

.action-icon {
  width: 20px;
  height: 20px;
  color: var(--text-muted);
}

.badge {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 8px;
  height: 8px;
  background-color: var(--danger);
  border-radius: 50%;
  border: 2px solid var(--bg-card);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary), var(--primary-hover));
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-main);
}

.user-role {
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
