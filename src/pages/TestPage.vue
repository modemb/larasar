<template>
  <div ref="scrollContainer" style="height: 400px; overflow-y: auto;">
    <div style="height: 800px;">
      <!-- Scrollable content -->
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';

export default {
  setup() {
    const scrollContainer = ref();

    onMounted(() => {
      const container = scrollContainer.value;
      container.addEventListener('scroll', handleScroll);
    });

    const handleScroll = (event: { preventDefault: () => void; stopPropagation: () => void; }) => {
      event.preventDefault();
      event.stopPropagation();
      // Handle other scroll-related logic if needed
    };

    return {
      scrollContainer
    };
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
