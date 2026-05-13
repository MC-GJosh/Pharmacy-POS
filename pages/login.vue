<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 24px; height: 24px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <h1 class="login-title">Pharma<span class="highlight">POS</span></h1>
        <p class="login-subtitle">Sign in to your account</p>
      </div>

      <!-- Error Message -->
      <div v-if="loginError" class="error-banner">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="error-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        {{ loginError }}
      </div>

      <!-- Login Form -->
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label" for="username">Username</label>
          <div class="input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="input-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Enter your username"
              class="form-input"
              autocomplete="username"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <div class="input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="input-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              class="form-input"
              autocomplete="current-password"
            />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:18px;height:18px">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:18px;height:18px">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>
        </div>

        <UiAppButton
          variant="primary"
          size="lg"
          class="login-btn"
          :class="{ disabled: !username || !password }"
        >
          Sign In
        </UiAppButton>
      </form>

      <!-- Test Accounts -->
      <div class="test-accounts">
        <div class="divider">
          <span>Test Accounts</span>
        </div>
        <div class="accounts-grid">
          <button
            v-for="user in TEST_USERS"
            :key="user.username"
            class="account-chip"
            @click="quickLogin(user)"
          >
            <div :class="['chip-avatar', `chip-${user.role}`]">{{ user.initials }}</div>
            <div class="chip-info">
              <span class="chip-name">{{ user.name }}</span>
              <span class="chip-role">{{ ROLE_LABELS[user.role] }}</span>
            </div>
            <div class="chip-creds">
              <code>{{ user.username }}</code>
              <code>{{ user.password }}</code>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'auth',
})

const { login, loginError, TEST_USERS, ROLE_LABELS } = useAuth()

const username = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = () => {
  if (!username.value || !password.value) return
  const success = login(username.value, password.value)
  if (success) {
    navigateTo('/')
  }
}

const quickLogin = (user) => {
  username.value = user.username
  password.value = user.password
  const success = login(user.username, user.password)
  if (success) {
    navigateTo('/')
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  max-width: 480px;
  padding: 2rem;
}

.login-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-icon {
  background: var(--primary);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.4);
}

.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--text-main);
  letter-spacing: -0.025em;
}

.highlight {
  color: var(--primary);
}

.login-subtitle {
  color: var(--text-muted);
  margin: 0;
  font-size: 1rem;
}

/* Error Banner */
.error-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: var(--bg-app);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0 1rem;
  transition: all 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.input-icon {
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.form-input {
  border: none;
  background: transparent;
  outline: none;
  padding: 0.875rem 0.75rem;
  width: 100%;
  font-size: 0.95rem;
  color: var(--text-main);
  font-family: inherit;
}

.form-input::placeholder {
  color: #94a3b8;
}

.toggle-password {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 0.25rem;
  display: flex;
  align-items: center;
}

.toggle-password:hover {
  color: var(--text-main);
}

.login-btn {
  width: 100%;
  justify-content: center;
  margin-top: 0.5rem;
}

.login-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Test Accounts Section */
.test-accounts {
  margin-top: 1.5rem;
}

.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--border-color);
}

.divider span {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  white-space: nowrap;
}

.accounts-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.account-chip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--bg-app);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  text-align: left;
  width: 100%;
}

.account-chip:hover {
  border-color: var(--primary);
  background-color: rgba(14, 165, 233, 0.03);
  transform: translateX(4px);
}

.chip-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 0.75rem;
  flex-shrink: 0;
  color: white;
}

.chip-admin { background: linear-gradient(135deg, #0ea5e9, #0284c7); }
.chip-pharmacist { background: linear-gradient(135deg, #10b981, #059669); }
.chip-cashier { background: linear-gradient(135deg, #f59e0b, #d97706); }
.chip-inventory_staff { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

.chip-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chip-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-main);
}

.chip-role {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.chip-creds {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  align-items: flex-end;
}

.chip-creds code {
  font-size: 0.675rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  color: var(--text-muted);
  font-family: 'Courier New', monospace;
}

@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }
  .login-card {
    padding: 1.5rem;
  }
  .chip-creds {
    display: none;
  }
}
</style>
