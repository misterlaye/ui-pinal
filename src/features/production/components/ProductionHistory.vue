<script setup>
import { PhClockCounterClockwise, PhSun, PhMoon } from '@phosphor-icons/vue';

const props = defineProps({
  historyData: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="history-card">
    <div class="card-header">
      <div class="title-group">
        <PhClockCounterClockwise :size="20" color="#C87533" />
        <h3 class="card-title">Historique des traites</h3>
      </div>
    </div>

    <div class="timeline-container">
      <div v-for="(dayGroup, index) in historyData" :key="index" class="day-group">
        
        <!-- Day Label (Left column in the grid) -->
        <div class="day-label-col">
          <span class="day-label">{{ dayGroup.dayLabel }}</span>
          <span class="day-date">{{ dayGroup.date }}</span>
        </div>

        <!-- Milkings List for that day -->
        <div class="milkings-list-col">
          <div class="milking-item" v-for="(milking, mIndex) in dayGroup.milkings" :key="mIndex">
            
            <!-- Timeline Bullet -->
            <div class="bullet-col">
              <div class="bullet" :class="milking.type === 'matin' ? 'bullet-matin' : 'bullet-soir'"></div>
              <!-- Vertical line is handled by border on bullet-col via CSS -->
            </div>

            <!-- Icon -->
            <div class="icon-wrapper" :class="milking.type === 'matin' ? 'bg-matin' : 'bg-soir'">
              <PhSun v-if="milking.type === 'matin'" :size="16" weight="fill" color="#D97706" />
              <PhMoon v-else :size="16" weight="fill" color="#374151" />
            </div>

            <!-- Milking Details -->
            <div class="milking-details">
              <span class="milking-title">Traite du {{ milking.type }}</span>
              <span class="milking-meta">{{ milking.time }} • {{ milking.cowsCount }} animaux traits</span>
            </div>

            <!-- Volume -->
            <div class="milking-volume">
              {{ milking.volume }} L
            </div>
            
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.history-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.card-header {
  margin-bottom: 32px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

/* Timeline Layout */
.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.day-group {
  display: flex;
  gap: 32px;
}

.day-label-col {
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
  padding-top: 10px; /* Align with first item */
}

.day-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-dark);
}

.day-date {
  font-size: 11px;
  color: var(--text-muted);
}

.milkings-list-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.milking-item {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  padding-bottom: 24px;
}

/* Connect lines logic */
.bullet-col {
  position: relative;
  width: 8px;
  display: flex;
  justify-content: center;
}

.milking-item:not(:last-child) .bullet-col::after,
.day-group:not(:last-child) .milking-item:last-child .bullet-col::after {
  content: '';
  position: absolute;
  top: 12px; /* starts below bullet */
  bottom: -24px; /* reaches to the next item */
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  background-color: var(--border-light);
  z-index: 0;
}

.bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  z-index: 1;
  background-color: white;
  border: 2px solid;
}

.bullet-matin { border-color: #D97706; }
.bullet-soir { border-color: #374151; }

/* Icon */
.icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-matin { background-color: #FEF3C7; } /* Yellow light */
.bg-soir { background-color: #F3F4F6; } /* Gray light */

/* Details */
.milking-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.milking-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dark);
}

.milking-meta {
  font-size: 11px;
  color: var(--text-muted);
}

/* Volume */
.milking-volume {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-dark);
  padding-right: 16px;
}

/* Responsive */
@media (max-width: 640px) {
  .day-group {
    flex-direction: column;
    gap: 16px;
  }
  
  .day-label-col {
    align-items: flex-start;
    padding-top: 0;
    width: 100%;
  }

  .day-label-col::after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: var(--border-light);
    margin-top: 8px;
  }
}
</style>
