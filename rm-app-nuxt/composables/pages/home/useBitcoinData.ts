import type { PeriodType, BitcoinPrice } from "~/shared/types/BitcoinPrice";

export const useBitcoinData = (initialPeriod: PeriodType, initialStartDate: string, initialEndDate: string) => {
  const selectedPeriod = ref<PeriodType>(initialPeriod);
  const startDate = ref(initialStartDate);
  const endDate = ref(initialEndDate);
  const priceData = ref<BitcoinPrice[]>([]);
  const pending = ref(false);
  const error = ref<Error | null>(null);

  // Валидация дат
  const validationError = ref<string | null>(null);
  const isDateValid = (date: string) => {
    if (!date) return false;
    const d = new Date(date);
    return !isNaN(d.getTime());
  };
  const isFuture = (date: string) => {
    const d = new Date(date);
    return d > new Date();
  };
  const validateDates = () => {
    if (!isDateValid(startDate.value) || !isDateValid(endDate.value)) {
      validationError.value = "Некорректный формат даты.";
      return false;
    }
    if (isFuture(startDate.value) || isFuture(endDate.value)) {
      validationError.value = "Даты не могут быть в будущем.";
      return false;
    }
    if (startDate.value > endDate.value) {
      validationError.value = "Начальная дата не может быть позже конечной.";
      return false;
    }
    validationError.value = null;
    return true;
  };

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
        if (!validateDates()) return;
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
    validationError: readonly(validationError),
  };
};
