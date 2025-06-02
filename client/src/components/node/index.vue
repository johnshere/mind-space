<template>
  <div :class="ns.e('wrap')">
    <Editor v-model="data.name" :class="ns.e('name')" />
    <Editor v-model="data.description" :class="ns.e('description')" />
    <Node v-for="d of data.children" :key="d.id" :data="d" :storageData="storageData" />
  </div>
</template>
<script lang="ts" setup>
import Editor from '@/components/node/editor.vue';
import Node from '@/components/node/index.vue';
import { useNamespace } from '@/hooks/useNamespace';

const ns = useNamespace('node');

const props = defineProps({
  data: {
    type: Object as PropType<NodeTree>,
    required: true
  },
  storageData: {
    type: Object as PropType<NodeStorage>,
    required: true
  }
})
</script>
<style lang="scss" scoped>
@use '@/assets/style/mixins' as *;
@include b(node);

@include e(wrap) {
  width: 100%;
  overflow: hidden;
  padding-left: 18px;
}

@include e(description) {
  font-size: 14px;
  height: 25px;
  padding: 0 2px 0 4px;

  &:not([contenteditable="true"]) {
    color: #999;
  }
}
</style>