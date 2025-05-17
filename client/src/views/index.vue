<template>
  <div :class="ns.b">
    <div :class="ns.e('header')">
      <div :class="ns.e('header-left')">
        <img src="@/assets/imgs/logo/64.png" alt="系统logo" :class="ns.m('logo')" />
        <h1 :class="ns.m('title')">{{ title }}</h1>
      </div>
      <div :class="ns.e('header-right')">
        <span :class="ns.m('status')">{{ saveStatus }}</span>
        <button @click="toggleMindMap">切换思维导图</button>
        <button @click="openSettings">设置</button>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
export default {
  name: 'home',
  title: import.meta.env.APP_TITLE
}
</script>
<script lang="ts" setup>
import { useNamespace } from '@/hooks/useNamespace';

const title = import.meta.env.APP_TITLE

const ns = useNamespace('home')

const saveStatus = ref('已保存')
function toggleMindMap() {
  // 切换思维导图逻辑
}
function openSettings() {
  // 打开设置逻辑
}
</script>
<style lang="scss" scoped>
@use '@/assets/style/mixins' as *;

@include b(home) {
  // 块级样式
  display: flex;
  flex-direction: column;
  height: 100vh;

  @include e(header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
  }

  @include e(header-left) {
    display: flex;
    align-items: center;
    gap: 16px;

    @include m(logo) {
      height: 40px;
    }

    @include m(title) {
      margin: 0;
      font-size: 20px;
    }
  }

  @include e(header-right) {
    display: flex;
    align-items: center;
    gap: 16px;

    @include m(status) {
      color: #666;
    }

    button {
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
      cursor: pointer;
    }
  }

}
</style>