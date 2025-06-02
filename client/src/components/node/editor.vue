<template>
  <div ref="elRef" :class="ns.b" @click="startEditing" @blur="handleChange" :contenteditable="editing">{{ processed }}
  </div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@/hooks/useNamespace';
import { ref, computed, nextTick } from 'vue';

const ns = useNamespace('node-editor');

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
});
const emit = defineEmits(['update:modelValue']);

const editing = ref(false);
const elRef = ref<HTMLElement>();

function extractPlainText(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}
const processed = computed(() => {
  let value = props.modelValue
  if (!editing.value) {
    return extractPlainText(value);
  }
  return value
    .replace(/@(\w+)/g, '<span class="mention" @click="showPopover($1)">@$1</span>')
    .replace(/\[\[(\w+)\]\]/g, '<span class="link" @click="showPopover($1)">[[$1]]</span>');
});

function startEditing() {
  editing.value = true;
  nextTick(() => elRef.value?.focus());
}

function handleChange() {
  if (editing.value) {
    emit('update:modelValue', elRef.value?.innerText as string)
    editing.value = false;
  }
}

function showPopover(content: string) {
  // 这里实现popover显示逻辑
  console.log('Show popover for:', content);
}
</script>

<style lang="scss" scoped>
@use '@/assets/style/mixins' as *;

@include b(node-editor) {
  font-size: 16px;
  height: 30px;
  width: 100%;
  padding: 2px;
  cursor: text;
  outline: none;
  border: 1px solid transparent;
  border-radius: 3px;
  word-break: break-word;
  @include text-ellipsis;

  &[contenteditable="true"] {
    border: 1px solid #ccc;
    white-space: pre-wrap;
    overflow: visible;
    height: auto;
  }

  .mention,
  .link {
    color: blue;
    cursor: pointer;
    text-decoration: underline;
  }

}
</style>