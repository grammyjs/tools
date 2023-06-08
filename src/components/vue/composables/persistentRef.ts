import { ref, watch } from "vue";

export function persistentRef<TValue>(itemName: string, initialValue: TValue) {
  const _ref = ref<TValue>(initialValue);

  const item = localStorage.getItem(itemName);
  if (item) _ref.value = JSON.parse(item);

  watch(_ref, (value) => {
    if (value === undefined) return localStorage.removeItem(itemName);
    localStorage.setItem(itemName, JSON.stringify(value));
  });

  return _ref;
}
