<template>
  <div :class="ns.e('wrap')">
    <div :class="ns.e('menu')">
      menu
    </div>
    <RouterView :class="ns.e('main')" />
  </div>
</template>

<script lang="ts">
export default { title: 'edit' }
</script>
<script lang="ts" setup>
import { useNamespace } from '@/hooks/useNamespace';

const ns = useNamespace('edit');
</script>
<style lang="scss" scoped>
@use '@/assets/style/mixins' as *;
@include b(edit);

@include e(wrap) {
  flex: 1;
  display: flex;
  gap: 10px;
}

@include e(menu) {
  width: 200px;
  background-color: #f0f0f0;
}

@include e(main) {
  flex: 1;
  padding: 18px 36px;
}
</style>
