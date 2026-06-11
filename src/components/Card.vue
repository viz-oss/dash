<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: 'fas fa-users'
  },
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  changeValue: {
    type: String,
    required: true
  },
  isUp: {
    type: Boolean,
    default: true
  },
  periodText: {
    type: String,
    default: 'vs last week'
  }
})
</script>

<template>
  <div class="widget-card">
    <div class="icon-container">
      <i :class="[icon, 'user-icon']"></i>
    </div>

    <div class="metric-title">{{ title }}</div>
    <div class="metric-value">{{ value }}</div>

    <div class="metric-change">
      <span class="trend-icon" :class="isUp ? 'up-arrow' : 'down-arrow'">
        <i :class="isUp ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"></i>
      </span>
      
      <span class="percentage">{{ changeValue }}</span>
      <span class="vs-text">{{ periodText }}</span>
    </div>
  </div>
</template>

<style scoped>

.widget-card {
  background: var(--white-color);
  border-radius: 10px;
  box-shadow: 0 0 4px var(--shadow-color);
  text-align: left;
  width: calc(32.33% - 20px);
  height: 96px;
  padding: 10px 14px;
}

/* User Icon Styling */
.icon-container {
  background: rgba(255, 0, 0, 0.323);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
}

.user-icon {
  font-size: 14px;
}

.row .widget-card:nth-child(1) .icon-container {
  background-color: var(--x1-color-light);
}

.row .widget-card:nth-child(1) .user-icon,
.row .widget-card:nth-child(1) .trend-icon,
.row .widget-card:nth-child(1) .percentage {
  color: var(--x1-color-dark);
}

.row .widget-card:nth-child(2) .icon-container {
  background-color: var(--x2-color-light);
}
.row .widget-card:nth-child(2) .user-icon,
.row .widget-card:nth-child(2) .trend-icon,
.row .widget-card:nth-child(2) .percentage {
  color: var(--x2-color-dark);
}

.row .widget-card:nth-child(3) .icon-container {
  background-color: var(--x3-color-light);
}
.row .widget-card:nth-child(3) .user-icon,
.row .widget-card:nth-child(3) .trend-icon,
.row .widget-card:nth-child(3) .percentage {
  color: var(--x3-color-dark);
}

/* Metric Title (e.g., "Users") */
.metric-title {
  font-size: 10px;
  color: var(--font-color-light);
  margin-top: 10px;
  margin-bottom: 0;
  font-weight: 400;
  letter-spacing: -0.8px;
}

/* Large Value (e.g., "1,248") */
.metric-value {
  font-size: 16px;
  color: var(--font-color-dark);
  font-weight: 600;
  margin-top: 6px;  
}

/* Change Indicator Container */
.metric-change {
  margin-top: 7px;
  display: flex;
  align-items: center;
  gap: 3px;
}

/* Trend Icon (The arrow) */
.trend-icon {
  font-size: 7px;
}

/* Percentage Change (+ 12%) */
.percentage {
  font-size: 7px;
  font-weight: 600;
}

/* VS Last Week Text */
.vs-text {
  font-size: 7px;
  color: var(--font-color-light);
}

</style>