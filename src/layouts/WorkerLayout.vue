<script setup>
import { useRouter, useRoute } from 'vue-router';
import { PhList, PhSignOut, PhHouse, PhCow, PhClockCounterClockwise, PhDrop } from '@phosphor-icons/vue';

const router = useRouter();
const route = useRoute();

const navItems = [
  { name: 'worker-home', label: 'ACCUEIL', icon: PhHouse },
  { name: 'worker-animals', label: 'ANIMAUX', icon: PhCow },
  { name: 'worker-history', label: 'HISTORIQUE', icon: PhClockCounterClockwise }
];

function navigateTo(routeName) {
  router.push({ name: routeName });
}

function isActive(routeName) {
  return route.name === routeName || route.path.startsWith('/worker/' + routeName.split('-')[1]);
}
</script>

<template>
  <div class="worker-layout">
    
    <!-- Header -->
    <header class="worker-topbar">
      <button class="icon-btn">
        <PhList :size="24" color="#FFFFFF" />
      </button>
      
      <div class="topbar-center">
        <div class="logo-box">
          <PhDrop :size="20" weight="fill" color="#1A1A1A" />
        </div>
        <div class="topbar-text">
          <span class="app-name">PINAL</span>
          <span class="farm-name">FERME DES NIAYES</span>
        </div>
      </div>

      <button class="icon-btn">
        <PhSignOut :size="24" color="#FFFFFF" />
      </button>
    </header>

    <!-- Main Content Area -->
    <main class="worker-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Bottom Navigation Bar -->
    <nav class="worker-bottom-nav">
      <button 
        v-for="item in navItems" 
        :key="item.name"
        class="nav-item"
        :class="{ active: isActive(item.name) }"
        @click="navigateTo(item.name)"
      >
        <component :is="item.icon" :size="24" :weight="isActive(item.name) ? 'bold' : 'regular'" />
        <span>{{ item.label }}</span>
      </button>
    </nav>
  </div>
</template>

<style>
/* Scoped worker global variables to match the rugged/industrial mockup */
:root {
  --w-bg: #F4F1EA;
  --w-dark: #1A1A1A;
  --w-yellow: #EBC137;
  --w-gray: #737373;
  --w-border: 2px solid #1A1A1A;
  --w-shadow: 4px 4px 0px #1A1A1A;
}

body {
  background-color: var(--w-bg);
}
</style>

<style scoped>
.worker-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  background-color: var(--w-bg);
  font-family: 'Inter', sans-serif;
  color: var(--w-dark);
}

/* Header */
.worker-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  background-color: #262626;
  padding: 0 16px;
  flex-shrink: 0;
}

.icon-btn {
  background: transparent;
  border: 1px solid #404040;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.topbar-center {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-box {
  background-color: var(--w-yellow);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
}

.topbar-text {
  display: flex;
  flex-direction: column;
}

.app-name {
  color: #FFFFFF;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.05em;
}

.farm-name {
  color: #A3A3A3;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Main Content */
.worker-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Bottom Navigation */
.worker-bottom-nav {
  display: flex;
  height: 72px;
  background-color: #FFFFFF;
  border-top: var(--w-border);
  flex-shrink: 0;
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1;
  height: 100%;
  background: #FFFFFF;
  border: none;
  border-right: var(--w-border);
  color: var(--w-dark);
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.1s;
}

.nav-item:last-child {
  border-right: none;
}

.nav-item span {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.nav-item.active {
  background-color: var(--w-yellow);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
