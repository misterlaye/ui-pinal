<template>
  <div class="tab-historique">
    <div class="card">
      <h3 class="card-title">Historique complet</h3>
      <p class="placeholder-text">
        Cette vue regroupera chronologiquement tous les événements de la vie de l'animal : naissances, changements de parc, ventes, traitements, etc.
        <br><br>
        <i>Fonctionnalité en cours de développement.</i>
      </p>
    </div>
  </div>
</template>

<style scoped>
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
  margin-bottom: 16px;
}

.placeholder-text {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  line-height: 1.5;
}
</style>
