import type { PeriodOption } from "~/components/pages/home/ButtonGroup.vue";

export const PERIOD_OPTIONS: PeriodOption[] = [
  { label: "День", value: "day" },
  { label: "Неделя", value: "week" },
  { label: "Месяц", value: "month" },
  { label: "Год", value: "year" },
  { label: "Произвольный", value: "custom" },
];
