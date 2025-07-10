<template>
  <apexchart class="apexcharts-canvas" type="line" height="500" :options="chartOptions" :series="series" />
</template>

<script setup lang="ts">
import type { ApexOptions } from "apexcharts";
import type { BitcoinPrice } from "~/shared/types/BitcoinPrice";

const { priceData } = defineProps<{ priceData: BitcoinPrice[] }>();

const series = computed(() => {
  if (!priceData?.length) return [];

  return [
    {
      name: "Цена BTC",
      data: priceData.map((item) => ({
        x: new Date(item.timestamp).getTime(),
        y: item.price,
      })),
    },
  ];
});

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: "line",
    zoom: { enabled: true },
  },
  xaxis: {
    type: "datetime",
    labels: { format: "dd MMM" },
  },
  yaxis: {
    title: { text: "Цена (USD)" },
    labels: {
      formatter: (value: number) => `$${value.toFixed(2)}`,
    },
  },
  stroke: { curve: "smooth", width: 3 },
  tooltip: {
    x: { format: "dd MMM yyyy HH:mm" },
    y: {
      formatter: (value: number) => `$${value.toFixed(2)}`,
    },
  },
  colors: ["#3B82F6"],
}));
</script>

<style scoped>
.apexcharts-canvas {
  min-width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
