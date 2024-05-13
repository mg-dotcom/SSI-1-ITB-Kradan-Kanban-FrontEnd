import { ref } from "vue";
const localTimeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone);

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleString("en-GB", { timeZone: localTimeZone.value });
};

export { formatDate, localTimeZone };