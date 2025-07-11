import type { PeriodType, BitcoinPrice } from "~/shared/types/BitcoinPrice";

export const useBitcoinData = (initialPeriod: PeriodType, initialStartDate: string, initialEndDate: string) => {
  const selectedPeriod = ref<PeriodType>(initialPeriod);
  const startDate = ref(initialStartDate);
  const endDate = ref(initialEndDate);
  const priceData = ref<BitcoinPrice[]>([]);
  const pending = ref(false);
  const error = ref<Error | null>(null);

  const params = computed(() => {
    if (selectedPeriod.value === "custom") {
      return {
        range: "custom",
        start: startDate.value,
        end: endDate.value,
      };
    }
    return { range: selectedPeriod.value };
  });

  const refresh = async () => {
    pending.value = true;
    error.value = null;

    try {
      const data = await $fetch<BitcoinPrice[]>("/api/prices", {
        query: params.value,
      });

      priceData.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err : Error(String(err));
      console.error("Ошибка загрузки данных:", err);
    } finally {
      pending.value = false;
    }
  };

  watch(
    [selectedPeriod, startDate, endDate],
    async () => {
      if (selectedPeriod.value === "custom") {
        if (!startDate.value || !endDate.value) return;
      }

      await refresh();
    },
    { deep: true }
  );

  return {
    pending: readonly(pending),
    error: readonly(error),
    selectedPeriod,
    startDate,
    endDate,
    priceData,
    refresh,
  };
};
