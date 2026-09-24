<script setup>
import { PhSyringe, PhHeartbeat, PhStethoscope, PhWarningCircle } from '@phosphor-icons/vue';

const historique = [
  { id: 1, date: '12 Avr 2024', type: 'Insémination', desc: '1ère insémination artificielle, taureau Montbéliarde.', icon: PhHeartbeat, color: '#16A34A' },
  { id: 2, date: '05 Mar 2024', type: 'Vaccin', desc: 'Rappel Fièvre aphteuse.', icon: PhSyringe, color: '#3B82F6' },
  { id: 3, date: '10 Fév 2024', type: 'Traitement', desc: 'Soins pour légère mammite (Quartier Arrière Droit).', icon: PhStethoscope, color: '#D97706' },
];
</script>

<template>
  <div class="tab-sante">
    <div class="content-grid">
      <!-- Timeline Historique -->
      <div class="card historique-card">
        <h3 class="card-title">Historique santé</h3>
        <div class="timeline">
          <div v-for="event in historique" :key="event.id" class="timeline-item">
            <div class="timeline-icon" :style="{ backgroundColor: event.color + '15', color: event.color }">
              <component :is="event.icon" :size="20" weight="fill" />
            </div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-type">{{ event.type }}</span>
                <span class="timeline-date">{{ event.date }}</span>
              </div>
              <p class="timeline-desc">{{ event.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Alert Card -->
      <div class="card alert-card">
        <div class="alert-header">
          <PhWarningCircle :size="24" color="#DC2626" weight="fill" />
          <h3 class="card-title m-0 text-red">Règles d'alertes IA</h3>
        </div>
        <p class="alert-desc">
          Aucune anomalie détectée récemment. La production est stable et le comportement alimentaire est normal.
          <br><br>
          <i>Prochain événement prévu : Vérification gestation le 12 Mai 2024.</i>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-sante {
  display: flex;
  flex-direction: column;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.card-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 24px;
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.timeline-item {
  display: flex;
  gap: 16px;
}

.timeline-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.timeline-content {
  flex: 1;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-light);
}

.timeline-item:last-child .timeline-content {
  border-bottom: none;
  padding-bottom: 0;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.timeline-type {
  font-weight: 600;
  color: var(--text-dark);
  font-size: var(--font-size-sm);
}

.timeline-date {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.timeline-desc {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  line-height: 1.5;
}

/* Alert Card */
.alert-card {
  background: #FEF2F2;
  border: 1px solid #FCA5A5;
  height: fit-content;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.m-0 {
  margin: 0;
}

.text-red {
  color: #991B1B;
}

.alert-desc {
  font-size: var(--font-size-sm);
  color: #7F1D1D;
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
