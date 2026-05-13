<template>
  <div class="app-layout">
    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
    <SidebarNav :class="{ 'sidebar-open': isSidebarOpen }" />
    <div class="main-wrapper">
      <TopHeader />
      <main class="page-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useState } from '#app'
const isSidebarOpen = useState('sidebarOpen', () => false)
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--bg-app);
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.sidebar-overlay {
  display: none;
}

@media (max-width: 1024px) {
  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(15, 23, 42, 0.5);
    z-index: 40;
    backdrop-filter: blur(4px);
  }
  
  .page-content {
    padding: 1rem;
  }
}
</style>
