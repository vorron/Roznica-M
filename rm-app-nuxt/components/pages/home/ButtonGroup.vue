<template>
  <div class="mb-6 flex flex-wrap gap-4">
    <button
      v-for="item in periods"
      :key="item.value"
      class="px-4 py-2 rounded-lg transition"
      :class="{
        'bg-blue-500 text-white': period === item.value,
        'bg-gray-200 hover:bg-gray-300': period !== item.value,
      }"
      @click="period = item.value"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
export interface PeriodOption {
  label: string;
  value: string;
}

defineProps<{
  periods: PeriodOption[];
}>();

const period = defineModel<string>({ required: true });
</script>
