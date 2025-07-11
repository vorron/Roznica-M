<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">История цен на Биткоин</h1>

    <PeriodButtonGroup v-model="selectedPeriod" :periods="PERIOD_OPTIONS" />

    <PeriodSelector v-if="selectedPeriod === 'custom'" v-model:start="startDate" v-model:end="endDate" />

    <div v-if="validationError" class="bg-yellow-100 text-yellow-800 p-4 rounded mb-4">
      {{ validationError }}
    </div>

    <div v-if="pending" class="text-center py-12">
      <p>Загрузка данных...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded">
      {{ error.message || "Произошла ошибка при загрузке данных." }}
    </div>

    <div v-else>
      <ClientOnly>
        <BitcoinChart :price-data="priceData" :is-daily="selectedPeriod === 'day'" />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, subDays } from "date-fns";
import BitcoinChart from "~/components/pages/home/BitcoinChart.vue";
import PeriodButtonGroup from "~/components/pages/home/PeriodButtonGroup.vue";
import PeriodSelector from "~/components/pages/home/PeriodSelector.vue";
import { useBitcoinData } from "~/composables/pages/home/useBitcoinData";
import { PERIOD_OPTIONS } from "~/config/pages/period-options";

const initialStartDate = format(subDays(new Date(), 7), "yyyy-MM-dd");
const initialEndDate = new Date().toISOString().split("T")[0];
const initialPeriod = "month" as const;

const { pending, error, selectedPeriod, startDate, endDate, priceData, refresh, validationError } = useBitcoinData(
  initialPeriod,
  initialStartDate,
  initialEndDate
);

onMounted(async () => {
  try {
    await refresh();
  } catch (e) {
    console.error("Ошибка при загрузке данных:", e);
  }
});
</script>
