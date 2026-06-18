<script setup lang="ts">
defineProps({
  icons: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
    <div class="icon-picker">
        <div v-for="(icon, index) in icons" :key="index" class="icon-option">
            <i :class="[icon, 'user-icon']"></i>
        </div>
    </div>
</template>

<style scoped>
</style>