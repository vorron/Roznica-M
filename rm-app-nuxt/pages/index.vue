<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">История цен на Биткоин</h1>

    <PagesHomeButtonGroup v-model="selectedPeriod" :periods="PERIOD_OPTIONS" />

    <PagesHomePeriodSelector v-if="selectedPeriod === 'custom'" v-model:start="startDate" v-model:end="endDate" />

    <div v-if="pending" class="text-center py-12">
      <p>Загрузка данных...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded">
      {{ error.message || "Произошла ошибка при загрузке данных." }}
    </div>

    <div v-else>
      <ClientOnly>
        <PagesHomeBitcoinChart :price-data="priceData" />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData } from "~/composables/pages/home/useData";
import { PERIOD_OPTIONS } from "~/config/pages/period-options";

const { pending, error, selectedPeriod, startDate, endDate, priceData } = useData();
</script>
