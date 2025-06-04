<template>
  <div :class="[ns.e('wrap'), { 'is-hidden': node.hidden }]">
    <div
      v-if="!node.hidden"
      :class="ns.e('content')"
    >
      <Editor
        ref="titleRef"
        v-model="node.title"
        :class="ns.e('title')"
        @single-enter="nextNode"
        @combo-enter="editDesc"
      />
      <Editor
        ref="descRef"
        v-if="node.description !== undefined"
        v-model="node.description"
        :class="ns.e('description')"
        @combo-enter="() => false"
      />
    </div>
    <div :class="ns.e('children')">
      <Node
        v-for="(n, i) of node.children"
        :key="n.id"
        :node="n"
        :ref="(el) => setRefs(el, i)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import Editor from '@/components/node/editor.vue'
import Node from '@/components/node/index.vue'
import { useNamespace } from '@/hooks/useNamespace'
import { ProvideKey } from '@/hooks/useNodeStore'

const ns = useNamespace('node')

const props = defineProps({
  node: {
    type: Object as PropType<NodeTree>,
    required: true
  }
})

const store = inject(ProvideKey)
onMounted(() => {
  const curr = getCurrentInstance()
  store?.registerNode(props.node.id, curr?.exposed)
})

const titleRef = ref<InstanceType<typeof Editor>>()
const descRef = ref<InstanceType<typeof Editor>>()

const childRefs = [] as InstanceType<typeof Node>[]
const setRefs = (el: any, index: number) => {
  childRefs[index] = el
}

async function nextNode(e: KeyboardEvent) {
  const next = await store?.insertNewNodeAfter(props.node)
  props.node.nextId = next?.id
}

async function editDesc(e: KeyboardEvent) {
  props.node.description = ''
  await nextTick()
  descRef.value?.blur()
}

const focus = () => titleRef.value?.focus()
const exposed = {
  titleRef,
  descRef,
  focus
}
defineExpose<typeof exposed>(exposed)
</script>
<style lang="scss" scoped>
@use '@/assets/style/mixins' as *;
@include b(node);

@include e(wrap) {
  width: 100%;
  overflow: hidden;
  position: relative;
  padding-left: 18px;
  &.is-hidden > *::before {
    display: none;
  }
}

@include e(title) {
  font-weight: bold;
}

@mixin line($bgColor: #ccc) {
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -9px;
    width: 1px;
    height: 100%;
    background-color: $bgColor;
  }
}

@include e(description) {
  position: relative;
  @include line;
  :deep(div) {
    font-size: 14px;
    height: 25px;
    padding: 0 2px 0 4px;

    &:not([contenteditable='true']) {
      color: #999;
    }
  }
}

@include e(children) {
  position: relative;
  @include line;
}
</style>
