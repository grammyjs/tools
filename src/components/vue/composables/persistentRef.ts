import { ref, watch } from "vue";

export function localRef<TValue>(itemName: string, initialValue: TValue) {
  const _ref = ref<TValue>(JSON.parse(localStorage.getItem(itemName) ?? '""') || initialValue);

  watch(_ref, (value) => {
    if (value === undefined) return localStorage.removeItem(itemName);
    localStorage.setItem(itemName, JSON.stringify(value));
  });

  return _ref;
}
