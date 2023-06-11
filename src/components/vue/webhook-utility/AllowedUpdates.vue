<script setup lang="ts">
import GrammyButton from "../GrammyButton.vue";
import { UpdateTypes, ALL_UPDATE_TYPES } from "./update-types";
import { snakeToTitleCase } from "./case-utils";
import { computed } from "vue";

const props = defineProps<{ modelValue: UpdateTypes[] }>();
const emit = defineEmits<{ (event: "update:modelValue", allowedUpdates: UpdateTypes[]): void }>();

const allowedUpdates = computed(() =>
  Object.fromEntries(ALL_UPDATE_TYPES.map((updateType) => [updateType, props.modelValue.includes(updateType)]))
);

const set = (updateType: string, value: boolean) => {
  allowedUpdates.value[updateType] = value;
  emit(
    "update:modelValue",
    Object.entries(allowedUpdates.value)
      .filter(([_, allowed]) => Boolean(allowed))
      .map(([updateType]) => updateType as UpdateTypes)
  );
};

const allowAll = () => emit("update:modelValue", ALL_UPDATE_TYPES as any);
const allowNone = () => emit("update:modelValue", []);
</script>
<template>
  <div class="rounded bg-translucentbackground p-5">
    <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div v-for="updateType of ALL_UPDATE_TYPES">
        <input
          type="checkbox"
          class="checked:accent-grammy-600"
          :checked="allowedUpdates[updateType]"
          @click="set(updateType, $event.target.checked)"
        />
        {{ snakeToTitleCase(updateType) }}
      </div>
    </div>
    <div class="mt-3 flex justify-center">
      <grammy-button size="small" @click="allowAll"> select all </grammy-button>
      <grammy-button size="small" class="ms-2" @click="allowNone"> select none </grammy-button>
    </div>
  </div>
</template>
