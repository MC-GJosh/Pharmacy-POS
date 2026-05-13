<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Customers</h1>
        <p class="page-subtitle">Manage patient profiles and purchase history</p>
      </div>
      <UiAppButton variant="primary">Add Customer</UiAppButton>
    </div>
    
    <UiAppCard>
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="empty-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        <h3>Customers Module</h3>
        <p>A CRM interface for patient details, contact info, and medical histories.</p>
      </div>
    </UiAppCard>
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

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  color: var(--primary);
  opacity: 0.5;
}

.empty-state h3 {
  color: var(--text-main);
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
