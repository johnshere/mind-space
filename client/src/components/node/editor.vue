<template>
  <div
    ref="elRef"
    :class="ns.b"
    :contenteditable="editing"
    @click="handleClick"
    @blur="handleBlur"
    @keydown="handleKeydown"
    @keyup="handleKeyup"
    v-html="html"
  />
</template>

<script lang="ts" setup>
import { useNamespace } from '@/hooks/useNamespace'
import { ref, computed, nextTick } from 'vue'
import {
  computePosition,
  autoUpdate,
  offset,
  flip,
  shift
} from '@floating-ui/dom'

const ns = useNamespace('node-editor')

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  'onUpdate:modelValue': {
    type: Function as PropType<(value: string) => void>
  },
  store: {
    type: Object as PropType<NodeStore>,
    required: true
  },
  onSingleEnter: {
    type: Function as PropType<
      (e: KeyboardEvent) => boolean | void | Promise<boolean | void>
    >,
    default: () => () => false
  },
  onComboEnter: {
    type: Function as PropType<
      (e: KeyboardEvent) => boolean | void | Promise<boolean | void>
    >,
    default: () => () => false
  }
})

const elRef = ref<HTMLElement>()
function focus() {
  handleClick()
}
function blur() {
  elRef.value?.blur()
}
defineExpose({ focus, blur })

const extractorId = 'plain-text-extractor'
const extractorRef = ref<HTMLElement>(document.getElementById(extractorId)!)
onBeforeMount(() => {
  if (!extractorRef.value) {
    const div = document.createElement('div')
    div.id = extractorId
    div.style.visibility = 'hidden'
    document.body.appendChild(div)
    extractorRef.value = div
  }
})

const editing = ref(false)
const html = computed(() => {
  let value = props.modelValue
  if (!editing.value) {
    extractorRef.value!.innerHTML = value
    value = extractorRef.value.textContent || extractorRef.value.innerText || ''
  }
  return value
})

function handleClick() {
  mentionSpan = null
  hidePopover()
  editing.value = true
  nextTick(() => elRef.value?.focus())
}
function handleBlur() {
  if (editing.value) {
    mentionSpan = null
    hidePopover()
    props['onUpdate:modelValue']?.(elRef.value?.innerHTML as string)
    editing.value = false
  }
}
async function handleKeydown(e: KeyboardEvent) {
  if (!editing.value) return
  if (e.key === 'Enter') {
    let notEnd: boolean | void
    if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
      notEnd = await Promise.resolve(props.onComboEnter(e))
    } else {
      notEnd = await Promise.resolve(props.onSingleEnter(e))
    }
    if (notEnd === true) return
    e.preventDefault()
    blur()
  }
}
let mentionSpan: HTMLSpanElement | null = null
function handleKeyup(e: KeyboardEvent) {
  if (!editing.value) {
    mentionSpan = null
    return
  }
  // 处理输入法状态
  if (e.isComposing) return

  // 检测是否按下了@符号
  if (e.key === '@' || e.key === 'Shift+2') {
    e.preventDefault()
    // 获取当前选区
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      // 检查光标前是否有@符号
      const textBeforeCursor =
        range.startContainer.textContent?.substring(0, range.startOffset) || ''
      const lastAtPos = textBeforeCursor.lastIndexOf('@')

      if (lastAtPos >= 0) {
        // 创建mention元素
        mentionSpan = document.createElement('span')
        mentionSpan.className = 'mention'
        mentionSpan.textContent = textBeforeCursor.substring(lastAtPos)

        // 删除原@符号及后面的文本
        range.setStart(range.startContainer, lastAtPos)
        range.deleteContents()

        // 插入mention元素
        range.insertNode(mentionSpan)

        // 移动光标到元素后面
        const newRange = document.createRange()
        newRange.setStartAfter(mentionSpan)
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)
      }
    }
    hidePopover()
  } else if (mentionSpan && popContent) {
    const slt = popContent.querySelector('.selected')
    if (!slt) {
      popContent.querySelector('.mention-option')?.classList.add('selected')
      return
    }
    if (e.key === 'ArrowUp') {
      if (slt.previousElementSibling) {
        slt.previousElementSibling.classList.add('selected')
        slt.classList.remove('selected')
      }
    }
    if (e.key === 'ArrowDown') {
      if (slt.nextElementSibling) {
        slt.nextElementSibling.classList.add('selected')
        slt.classList.remove('selected')
      }
    }
  } else if (mentionSpan) {
    // 持续监测输入状态
    // 检测是否输入了回车、空格或特殊字符
    if (
      e.key === ' ' ||
      e.key === 'Enter' ||
      e.key === 'Tab' ||
      e.key === 'Escape' ||
      e.key === 'Delete' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'Home' ||
      e.key === 'End' ||
      e.key === 'PageUp' ||
      e.key === 'PageDown' ||
      /[^\u4e00-\u9fa5a-zA-Z0-9]/.test(e.key)
    ) {
      mentionSpan = null
    } else {
      // 更新popover内容
    }
    handlePopover()
  }
}

let cleanup: (() => void) | null = null
let popContent: HTMLElement | null = null
const hidePopover = () => {
  if (popContent) {
    popContent.style.display = 'none'
    popContent.remove()
    popContent = null
  }
  if (cleanup) {
    cleanup()
    cleanup = null
  }
}
function handlePopoverSelect() {
  hidePopover()
}
async function handlePopover() {
  if (!mentionSpan || !editing.value) return hidePopover()
  if (mentionSpan.textContent === '@') return hidePopover()
  const txt = mentionSpan.textContent?.replace(/@/g, '') || ''
  if (!txt) return hidePopover()
  if (!popContent) {
    popContent = document.createElement('div')
    popContent.className = 'mention-popover'
    document.body.appendChild(popContent)
  }
  popContent.textContent = ''
  Array.from(props.store.allData.values()).forEach((node) => {
    if (!node.title.includes(txt)) return
    const op = document.createElement('div')
    op.className = 'mention-option'
    op.innerHTML = node.title.replace(txt, `<i class="mention">${txt}</i>`)
    popContent?.appendChild(op)
  })
  // 创建或更新popover
  cleanup = autoUpdate(mentionSpan, popContent, async () => {
    if (!mentionSpan || !popContent) return hidePopover()
    const { x, y } = await computePosition(mentionSpan, popContent, {
      placement: 'bottom-start',
      middleware: [offset(4), flip(), shift({ padding: 5 })]
    })

    Object.assign(popContent!.style, {
      left: `${x}px`,
      top: `${y}px`
    })
  })
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

  &[contenteditable='true'] {
    border: 1px solid #ccc;
    white-space: pre-wrap;
    overflow: visible;
    height: auto;
  }
}
</style>
<style lang="scss">
.mention,
.link {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}
.mention-popover {
  position: absolute;
  z-index: 999;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 5px;
  max-height: 200px;
  overflow-y: auto;
  .mention-option {
    padding: 5px;
    cursor: pointer;
    outline: none;
    &.selected,
    &:focus {
      background-color: #e0e0e0;
    }
    &:hover {
      background-color: #f0f0f0;
    }
  }
}
</style>
