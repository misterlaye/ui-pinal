<script setup>
defineProps({
  variant: {
    type: String,
    default: 'dark',
    validator: (v) => ['dark', 'light'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
});
</script>

<template>
  <div class="pn-logo" :class="[`pn-logo--${variant}`, `pn-logo--${size}`]">
    <svg class="pn-logo-icon" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
        :fill="variant === 'dark' ? '#FFFFFF' : '#C87533'"
      />
    </svg>
    <span class="pn-logo-text">PINAL</span>
  </div>
</template>

<style scoped>
.pn-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  user-select: none;
}

.pn-logo-icon {
  flex-shrink: 0;
}

.pn-logo-text {
  font-weight: 700;
  letter-spacing: 1.5px;
}

/* Sizes */
.pn-logo--sm .pn-logo-icon {
  width: 20px;
  height: 20px;
}
.pn-logo--sm .pn-logo-text {
  font-size: 14px;
}

.pn-logo--md .pn-logo-icon {
  width: 28px;
  height: 28px;
}
.pn-logo--md .pn-logo-text {
  font-size: 18px;
}

.pn-logo--lg .pn-logo-icon {
  width: 36px;
  height: 36px;
}
.pn-logo--lg .pn-logo-text {
  font-size: 22px;
}

/* Variants */
.pn-logo--dark .pn-logo-text {
  color: var(--text-white);
}

.pn-logo--light .pn-logo-text {
  color: var(--text-dark);
}
</style>
