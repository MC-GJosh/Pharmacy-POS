<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Prescriptions</h1>
        <p class="page-subtitle">Track and process patient prescriptions</p>
      </div>
      <UiAppButton variant="primary">New Prescription</UiAppButton>
    </div>
    
    <UiAppCard>
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="empty-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <h3>Prescriptions Module</h3>
        <p>Manage incoming prescriptions from clinics, check validity, and process dispensing.</p>
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
