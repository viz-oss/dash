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

    <h3 class="metric-title">{{ title }}</h3>
    <div class="metric-value">{{ value }}</div>

    <div class="metric-change">
      <span class="trend-icon" :class="isUp ? 'up-arrow' : 'down-arrow'">
        <i :class="isUp ? 'fas fa-caret-up' : 'fas fa-caret-down'"></i>
      </span>
      
      <span class="percentage">{{ changeValue }}</span>
      <span class="vs-text">{{ periodText }}</span>
    </div>
  </div>
</template>

<style scoped>
/* Widget Card Container Styling */
.widget-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); /* Subtle shadow for depth */
  padding: 30px 40px;
  text-align: left;
  max-width: 350px; /* Limits the card width nicely */
}

/* User Icon Styling */
.icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.user-icon {
  font-size: 3rem;
  color: #4c9aee; /* A nice primary blue color */
}

/* Metric Title (e.g., "Users") */
.metric-title {
  font-size: 1rem;
  color: #6b7280; /* Gray text for secondary information */
  margin: 0 0 15px 0;
  font-weight: 500;
}

/* Large Value (e.g., "1,248") */
.metric-value {
  font-size: 3.5rem; /* Large and impactful font size */
  color: #1f2937; /* Darker text for main metric */
  margin-bottom: 20px;
  line-height: 1.1;
}

/* Change Indicator Container */
.metric-change {
  display: flex;
  align-items: center;
  gap: 8px; /* Space between elements in the change row */
}

/* Trend Icon (The arrow) */
.trend-icon {
  color: #10b981; /* Green for positive trend */
  font-size: 1rem;
}

/* Percentage Change (+ 12%) */
.percentage {
  font-size: 1.1rem;
  font-weight: 600;
  color: #10b981; /* Green color for the increase */
}

/* VS Last Week Text */
.vs-text {
  font-size: 0.95rem;
  color: #9ca3af; /* Lighter gray text */
}

/* Simple Responsive Adjustments */
@media (max-width: 480px) {
  .widget-card {
    padding: 20px 25px;
    max-width: 90%;
  }
  .metric-value {
    font-size: 3rem;
  }
}
</style>