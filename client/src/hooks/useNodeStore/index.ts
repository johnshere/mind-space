import { listToTree, treeToList } from '@/libs/treeUtils'
import { uuid } from '@/libs/util'

/**
 * 缓存id
 */
export const StorageId = 'MindSpaceStorageId'

export const useNodeStore = (id: string): NodeStore => {
  const getCache = (): Map<string, NodeData> => {
    const cache = localStorage.getItem(StorageId)
    if (cache) {
      return new Map(Object.entries(JSON.parse(cache)))
    } else {
      return new Map()
    }
  }

  const allData = getCache()

  const set = (data: NodeDataTree) => {
    treeToList(data)
      .filter((item) => !!item.title)
      .forEach((item) => {
        if (allData.get(item.id)) {
          allData.set(item.id, item)
        } else {
          allData.set(item.id, item)
        }
      })
    const cacheData = Object.fromEntries(allData)
    localStorage.setItem(StorageId, JSON.stringify(cacheData))
  }
  const get = () => {
    const allTree = listToTree(Array.from(allData.values()))
    let tree = allTree?.find((item) => item.id === id)
    if (!tree) {
      tree = {
        id,
        title: '',
        hidden: true,
        children: [{ id: uuid(), title: '标题' }]
      } as any as NodeDataTree
      set(tree)
    }
    return tree
  }
  const data = get()
  const traserve = (d: NodeDataTree) => {
    const node = { data: d } as NodeTree
    if (d.children?.length) {
      node.children = d.children.map((item) => traserve(item))
    }
    return node
  }
  const node = traserve(data)
  const state = reactive({
    data,
    node
  })
  watch(() => state.data, set, { deep: true, immediate: true })

  return {
    allData,
    data: state.data,
    node: state.node
  }
}
