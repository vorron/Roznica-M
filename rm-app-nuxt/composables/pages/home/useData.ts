import { computed, onMounted, watch } from "vue";
import type { BitcoinPrice } from "~/shared/types/BitcoinPrice";

export const useData = () => {
  const selectedPeriod = useState<string>("selectedPeriod", () => "month");

  const startDate = useState<string>("startDate", () => "");
  const endDate = useState<string>("endDate", () => "");

  const priceData = useState<BitcoinPrice[]>("priceData", () => []);

  if (!startDate.value || !endDate.value) {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    endDate.value = today.toISOString().split("T")[0];
    startDate.value = oneWeekAgo.toISOString().split("T")[0];
  }

  const fetchParams = computed(() => {
    const params: { range: string; start?: string; end?: string } = { range: selectedPeriod.value };

    if (selectedPeriod.value === "custom") {
      if (startDate.value && endDate.value) {
        params.start = startDate.value;
        params.end = endDate.value;
      }
    }

    return params;
  });

  const { pending, error, refresh } = useAsyncData(
    "bitcoin-prices",
    async () => {
      try {
        priceData.value = await $fetch<BitcoinPrice[]>("/api/prices", {
          query: fetchParams.value,
        });
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        throw createError({
          statusCode: 500,
          statusMessage: "Ошибка при загрузке данных",
        });
      }
    },
    {
      server: true,
      immediate: false,
    }
  );

  watch(
    fetchParams,
    async (newParams) => {
      if (newParams.range !== "custom" || (newParams.start && newParams.end)) {
        await refresh();
      }
    },
    { deep: true }
  );

  onMounted(async () => {
    if (import.meta.client && priceData.value.length === 0) {
      await refresh();
    }
  });

  return {
    pending,
    error,
    selectedPeriod,
    startDate,
    endDate,
    priceData,
  };
};
