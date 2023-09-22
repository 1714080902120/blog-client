<template>
  <div class="login_input relative flex-c py-2 -ml-5">
    <label
      :for="id"
      class="input_label w-28 text-right dark:text-orange-50 whitespace-nowrap"
      :title="label"
    >
      <span class="relative" :class="{ is_needed: isNeeded }">{{
        label
      }}</span></label
    >

    <template v-if="$slots.customInput">
      <slot name="customInput"></slot>
    </template>
    <template v-else>
      <input
        :id="id"
        :autocomplete="autocomplete"
        class="bg-transparent outline-none w-64 border-b dark:border-b-white/10 border-b-black/10 py-1 px-1"
        :type="type"
        :placeholder="placeholder"
        :maxlength="maxLength"
        v-model="value"
        @keydown.enter="onKeyEnter"
      />
    </template>
  </div>
  <slot name="input-tips"></slot>
</template>

<script setup lang="ts">

const props = defineProps({
  placeholder: String,
  type: {
    type: String,
    default: "text",
  },
  modelValue: {
    type: String || Number,
    default: "",
  },
  id: String,
  label: String,
  isNeeded: {
    type: Boolean,
    default: true,
  },
  maxLength: {
    type: Number,
    default: 20,
  },
  autocomplete: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const id = `_user_${props.id}`;

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

</script>

<style scoped>
.input_label::after {
  content: "：";
}

.is_needed::after {
  content: "*";
  color: rgba(250, 38, 91, 0.8);
  position: absolute;
  top: -3px;
  left: -6px;
  font-size: 14px;
}
</style>
