import { listToTree, treeToList } from '@/libs/treeUtils'

/**
 * 缓存id
 */
export const StoreId = 'MindSpaceStorageId'

export const useNodeStorage = (id: string) => {
  const getCache = (): Map<string, NodeStore> => {
    const cache = localStorage.getItem(StoreId)
    if (cache) {
      return new Map(Object.entries(JSON.parse(cache)))
    } else {
      return new Map()
    }
  }

  const allData = getCache()

  const set = (data: NodeTree) => {
    treeToList(data).forEach((item) => {
      if (allData.get(item.id)) {
        allData.set(item.id, item)
      } else {
        allData.set(item.id, item)
      }
    })
    const cacheData = Object.fromEntries(allData)
    localStorage.setItem(StoreId, JSON.stringify(cacheData))
  }
  const get = () => {
    const allTree = listToTree(Array.from(allData.values()))
    let tree = allTree?.find((item) => item.id === id)
    if (!tree) {
      tree = {
        id,
        name: '1111',
        description: '2222',
        children: []
      } as any as NodeTree
      set(tree)
    }
    return tree
  }

  const state = reactive({
    data: get()
  })
  watch(() => state.data, set, { deep: true, immediate: true })

  return {
    allData,
    data: state.data
  }
}
