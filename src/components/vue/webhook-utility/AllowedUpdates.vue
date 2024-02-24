<script setup lang="ts">
import { UpdateTypes, ALL_UPDATE_TYPES, DEFAULT_UPDATE_TYPES } from "./update-types";
import { computed } from "vue";

const props = defineProps<{ modelValue: UpdateTypes[] }>();
const emit = defineEmits<{ (event: "update:modelValue", allowedUpdates: UpdateTypes[]): void }>();

const allowedUpdates = computed(() =>
  Object.fromEntries(ALL_UPDATE_TYPES.map((updateType) => [updateType, props.modelValue.includes(updateType)])),
);

const set = (updateType: string, value: boolean) => {
  allowedUpdates.value[updateType] = value;
  emit(
    "update:modelValue",
    Object.entries(allowedUpdates.value)
      .filter(([_, allowed]) => Boolean(allowed))
      .map(([updateType]) => updateType as UpdateTypes),
  );
};

const allowAll = () => emit("update:modelValue", ALL_UPDATE_TYPES as any);
const allowNone = () => emit("update:modelValue", []);
const allowDefault = () => emit("update:modelValue", DEFAULT_UPDATE_TYPES as any);
</script>
<template>
  <div class="pl-2 pt-3">
    <div class="flex flex-col">
      <div v-for="updateType of [...ALL_UPDATE_TYPES]">
        <label>
          <input
            type="checkbox"
            class="checked:accent-grammy-600"
            :checked="allowedUpdates[updateType]"
            @click="set(updateType, ($event.target as HTMLInputElement).checked)"
          />
          {{ updateType }}
        </label>
      </div>
    </div>
    <div class="mt-3 flex">
      <button size="small" class="button py-1 pr-2 text-xs" @click="allowAll">All</button>
      <button size="small" class="button px-2 py-1 text-xs" @click="allowDefault">Default</button>
      <button size="small" class="button py-1 pl-2 text-xs" @click="allowNone">None</button>
    </div>
  </div>
</template>
