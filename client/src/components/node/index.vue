<template>
  <div :class="ns.e('wrap')">
    <div :class="[ns.e('content'), node.data.hidden ? ns.m('hidden') : null]">
      <Editor
        ref="titleRef"
        v-model="node.data.title"
        :store="store"
        :class="ns.e('title')"
        @single-enter="generateNextNode"
        @combo-enter="generateDescription"
      />
      <Editor
        ref="descRef"
        v-if="node.data.description !== undefined"
        v-model="node.data.description"
        :store="store"
        :class="ns.e('description')"
        @combo-enter="() => false"
      />
    </div>
    <div v-if="node.children?.length" :class="ns.e('children')">
      <Node
        v-for="(n, i) of node.children"
        :key="n.data.id"
        :ref="(el) => setRefs(el, i)"
        :node="n"
        :store="store"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import Editor from '@/components/node/editor.vue'
import Node from '@/components/node/index.vue'
import { useNamespace } from '@/hooks/useNamespace'
import { uuid } from '@/libs/util'

const ns = useNamespace('node')

const props = defineProps({
  node: {
    type: Object as PropType<NodeTree>,
    required: true
  },
  store: {
    type: Object as PropType<NodeStore>,
    required: true
  }
})

// 设置当前实例到node节点上
const current = getCurrentInstance()
props.node.ref = current?.proxy as NodeProxy
// 设置子节点的parent引用
const subNodeRefs = [] as NodeExposed[]
const setRefs = (el: any, index: number) => {
  if (!el) return
  subNodeRefs[index] = el
}

const titleRef = ref<InstanceType<typeof Editor>>()
const descRef = ref<InstanceType<typeof Editor>>()

async function generateNextNode(e: KeyboardEvent) {
  if (!current?.parent) {
    return
  }
  ;(current.parent.exposed as NodeExposed)?.insertNewNode?.()
}
async function insertNewNode(node?: NodeProxy | NodeDataTree) {
  if (!node) {
    if (!props.node.data.children) {
      props.node.data.children = []
    }
    props.node.data.children.push({ id: uuid(), title: '' } as NodeDataTree)
    await nextTick()
    const lastSubNode = subNodeRefs?.at(-1)
    if (lastSubNode) {
      lastSubNode.titleRef?.focus()
      return lastSubNode
    }
  }
}

async function generateDescription(e: KeyboardEvent) {
  props.node.data.description = ''
  await nextTick()
  descRef.value?.blur()
}
defineExpose({ titleRef, descRef, subNodeRefs, insertNewNode })
</script>
<style lang="scss" scoped>
@use '@/assets/style/mixins' as *;
@include b(node);

@include e(wrap) {
  width: 100%;
  overflow: hidden;
}
@include e(content) {
  @include m(hidden) {
    display: none;
  }
}

@include e(description) {
  font-size: 14px;
  height: 25px;
  padding: 0 2px 0 4px;

  &:not([contenteditable='true']) {
    color: #999;
  }
}
@include e(children) {
  padding-left: 18px;
}
</style>
