<template>
  <div>
    <div :class="ns.e('wrap')">outline
      <Node :data="storageData.data" :storageData="storageData" />
    </div>
  </div>
</template>
<script lang="ts">
export default { title: 'outline' }
</script>
<script lang="ts" setup>
import Node from '@/components/node/index.vue';
import { useNamespace } from '@/hooks/useNamespace';
import { useNodeStorage } from '@/hooks/useNodeStorage';
import { uuid } from '@/libs/util';

const ns = useNamespace('outline');

const route = useRoute()
const router = useRouter()

let id = route.query.id as string

if (!id) {
  id = uuid()
  const path = route.path
  router.replace({ path, query: { id } })
}
const storageData = useNodeStorage(id)
</script>
<style lang="scss" scoped>
@use '@/assets/style/mixins' as *;
@include b(outline);

@include e(wrap) {
  width: 700px;
  margin: 0 auto;
}
</style>
