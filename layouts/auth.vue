<template>
  <div class="login-wrapper">
    <slot />
  </div>
</template>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-app);
  background-image:
    radial-gradient(at 0% 0%, rgba(14, 165, 233, 0.15) 0, transparent 50%),
    radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.1) 0, transparent 50%);
}
</style>
