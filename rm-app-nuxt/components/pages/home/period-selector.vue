<template>
  <div class="flex gap-2 items-center">
    <input v-model="start" type="date" class="border rounded px-3 py-2" />
    <span>—</span>
    <input v-model="end" type="date" class="border rounded px-3 py-2" />
    <button class="bg-blue-500 text-white px-4 py-2 rounded-lg" @click="onClick">Применить</button>
  </div>
</template>

<script setup lang="ts">
const startDate = defineModel<string>("start", { required: true });
const endDate = defineModel<string>("end", { required: true });

const start = ref(startDate);
const end = ref(endDate);

const onClick = () => {
  startDate.value = start.value;
  endDate.value = end.value;
};
</script>
