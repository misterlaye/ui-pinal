<script setup>
import { PhStar, PhTrendUp, PhTrendDown } from '@phosphor-icons/vue';

const props = defineProps({
  rentability: {
    type: Object,
    required: true
  }
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(value);
};
</script>

<template>
  <div class="rentability-bar" :class="rentability.netProfit >= 0 ? 'bg-green-light' : 'bg-red-light'">
    
    <div class="bar-left">
      <div class="icon-wrapper" :class="rentability.netProfit >= 0 ? 'bg-green text-white' : 'bg-red text-white'">
        <PhStar :size="20" weight="fill" />
      </div>
      <div class="rentability-info">
        <span class="rentability-label">RENTABILITÉ — BÉNÉFICE NET DE LA PÉRIODE</span>
        <span class="rentability-value" :class="rentability.netProfit >= 0 ? 'text-green-dark' : 'text-red-dark'">
          {{ formatCurrency(rentability.netProfit) }}
        </span>
      </div>
    </div>

    <div class="bar-right">
      <div class="margin-info">
        <span class="margin-label">Marge nette</span>
        <span class="margin-value">{{ rentability.netMarginPercentage }}%</span>
      </div>
      <div class="trend-info" :class="rentability.trend >= 0 ? 'text-green-dark' : 'text-red-dark'">
        <span class="trend-label">Évolution vs période préc.</span>
        <span class="trend-value">
          <PhTrendUp v-if="rentability.trend >= 0" :size="14" weight="bold" />
          <PhTrendDown v-else :size="14" weight="bold" />
          {{ rentability.trend > 0 ? '+' : '' }}{{ rentability.trend }}%
        </span>
      </div>
    </div>

  </div>
</template>

<style scoped>
.rentability-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-radius: var(--radius-lg);
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

/* Backgrounds */
.bg-green-light { background-color: #ECFDF5; border: 1px solid #D1FAE5; }
.bg-red-light { background-color: #FEE2E2; border: 1px solid #FECACA; }

/* Left Side */
.bar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-green { background-color: #10B981; }
.bg-red { background-color: #EF4444; }
.text-white { color: #FFFFFF; }

.rentability-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rentability-label {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.rentability-value {
  font-size: 24px;
  font-weight: 700;
}

.text-green-dark { color: #065F46; }
.text-red-dark { color: #991B1B; }

/* Right Side */
.bar-right {
  display: flex;
  align-items: center;
  gap: 32px;
}

.margin-info, .trend-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.margin-label, .trend-label {
  font-size: 11px;
  color: var(--text-muted);
}

.margin-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-dark);
}

.trend-value {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 700;
}

/* Responsive */
@media (max-width: 768px) {
  .rentability-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .bar-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .margin-info, .trend-info {
    align-items: flex-start;
  }
}
</style>
