<script setup>
import { ref } from 'vue';
import PnLogo from '../components/ui/PnLogo.vue';
import { PhBell, PhCaretDown, PhCalendarBlank, PhList, PhX } from '@phosphor-icons/vue';

const navItems = [
  { label: 'Dashboard', route: '/dashboard' },
  { label: 'Troupeau', route: '/dashboard/troupeau' },
  { label: 'Production', route: '/dashboard/production' },
  { label: 'Santé', route: '/dashboard/sante' },
];

const mobileMenuOpen = ref(false);
const selectedPeriod = ref('7 derniers jours');

const exploitationName = ref(
  localStorage.getItem('exploitation_name') || 'Mon exploitation'
);
</script>

<template>
  <div class="dashboard-shell">
    <!-- Top Navigation -->
    <header class="topnav">
      <div class="topnav-inner">
        <!-- Left: Logo + Exploitation -->
        <div class="topnav-left">
          <PnLogo variant="light" size="sm" />

          <button class="topnav-exploitation">
            <span class="topnav-exploitation-text">{{ exploitationName }}</span>
            <PhCaretDown :size="14" weight="bold" />
          </button>
        </div>

        <!-- Center: Nav links (desktop) -->
        <nav class="topnav-links">
          <router-link
            v-for="item in navItems"
            :key="item.label"
            :to="item.route"
            class="topnav-link"
            exact-active-class="active"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <!-- Right: Period + Notifications + Avatar -->
        <div class="topnav-right">
          <button class="topnav-period">
            <PhCalendarBlank :size="16" weight="regular" />
            <span>{{ selectedPeriod }}</span>
            <PhCaretDown :size="12" weight="bold" />
          </button>

          <button class="topnav-icon-btn" aria-label="Notifications">
            <PhBell :size="20" weight="regular" />
            <span class="topnav-badge">3</span>
          </button>

          <div class="topnav-avatar">
            <span>AD</span>
          </div>
        </div>

        <!-- Mobile menu toggle -->
        <button
          class="topnav-mobile-toggle"
          @click="mobileMenuOpen = !mobileMenuOpen"
          :aria-label="mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
        >
          <PhX v-if="mobileMenuOpen" :size="24" weight="bold" />
          <PhList v-else :size="24" weight="bold" />
        </button>
      </div>

      <!-- Mobile menu -->
      <transition name="slide-down">
        <div v-if="mobileMenuOpen" class="topnav-mobile-menu">
          <router-link
            v-for="item in navItems"
            :key="item.label"
            :to="item.route"
            class="topnav-mobile-link"
            exact-active-class="active"
            @click="mobileMenuOpen = false"
          >
            {{ item.label }}
          </router-link>
          <div class="topnav-mobile-period">
            <PhCalendarBlank :size="16" />
            <span>{{ selectedPeriod }}</span>
          </div>
        </div>
      </transition>
    </header>

    <!-- Main Content -->
    <main class="dashboard-main">
      <div class="dashboard-container">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-shell {
  min-height: 100vh;
  background: var(--bg-page);
}

/* --- Top Navigation --- */
.topnav {
  background: var(--bg-white);
  border-bottom: 1px solid var(--border-light);
  position: sticky;
  top: 0;
  z-index: 100;
}

.topnav-inner {
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

/* Left */
.topnav-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.topnav-exploitation {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--bg-page);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-dark);
  cursor: pointer;
  transition: border-color var(--transition-fast);
  white-space: nowrap;
}

.topnav-exploitation:hover {
  border-color: var(--text-muted);
}

/* Center Nav */
.topnav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.topnav-link {
  padding: 6px 14px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background var(--transition-fast);
  white-space: nowrap;
}

.topnav-link:hover {
  color: var(--text-dark);
  background: var(--bg-page);
}

.topnav-link.active {
  color: var(--text-dark);
  font-weight: 600;
}

/* Right */
.topnav-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.topnav-period {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--text-dark);
  cursor: pointer;
  transition: border-color var(--transition-fast);
  white-space: nowrap;
}

.topnav-period:hover {
  border-color: var(--text-muted);
}

.topnav-icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-body);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.topnav-icon-btn:hover {
  background: var(--bg-page);
}

.topnav-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  background: var(--error);
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.topnav-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* Mobile Toggle */
.topnav-mobile-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  color: var(--text-dark);
  cursor: pointer;
}

/* Mobile Menu */
.topnav-mobile-menu {
  border-top: 1px solid var(--border-light);
  padding: 12px 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.topnav-mobile-link {
  padding: 10px 12px;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.topnav-mobile-link:hover,
.topnav-mobile-link.active {
  color: var(--text-dark);
  background: var(--primary-light);
}

.topnav-mobile-period {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

/* Main Content */
.dashboard-main {
  padding: 24px;
}

.dashboard-container {
  max-width: 1360px;
  margin: 0 auto;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Responsive */
@media (max-width: 1024px) {
  .topnav-links {
    display: none;
  }

  .topnav-period {
    display: none;
  }

  .topnav-mobile-toggle {
    display: flex;
  }
}

@media (max-width: 640px) {
  .topnav-inner {
    padding: 0 16px;
  }

  .topnav-exploitation {
    display: none;
  }

  .dashboard-main {
    padding: 16px;
  }
}
</style>
