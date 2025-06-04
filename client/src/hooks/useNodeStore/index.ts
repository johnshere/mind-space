import { listToTree, treeToList } from '@/libs/treeUtils'
import { uuid } from '@/libs/util'
import { InjectionKey } from 'vue'

/**
 * 缓存id
 */
export const StorageId = 'MindSpaceStorageId'

export const ProvideKey: InjectionKey<NodeStore> = Symbol('NodeStoreProvideKey')

const getCache = (): Map<string, NodeData> => {
  const cache = localStorage.getItem(StorageId)
  if (cache) {
    return new Map(Object.entries(JSON.parse(cache)))
  } else {
    return new Map()
  }
}

const map = getCache()

const setTree = (data: NodeTree) => {
  treeToList(data).forEach((item) => {
    if (map.get(item.id)) {
      map.set(item.id, item)
    } else {
      map.set(item.id, item)
    }
  })
  const cacheData = Object.fromEntries(map)
  localStorage.setItem(StorageId, JSON.stringify(cacheData))
}

const newNodeTree = (pId: string, prevId?: string, title: string = '') => {
  return {
    id: uuid(),
    parentId: pId,
    prevId: prevId || undefined,
    nextId: undefined,
    title
  } as NodeTree
}

const getTree = (id: string) => {
  const allTree = listToTree(Array.from(map.values()))
  let tree = allTree?.find((item) => item.id === id)
  if (!tree) {
    const child = newNodeTree(id)
    child.title = '标题'
    tree = {
      id,
      title: '',
      hidden: true,
      children: [child]
    } as any as NodeTree
    setTree(tree)
  }
  return tree
}

const findParent = (
  node: NodeTree | string,
  tree: NodeTree
): NodeTree | null => {
  const pId = typeof node === 'string' ? node : node.parentId
  if (tree.id === pId) {
    return tree
  }
  for (const child of tree.children || []) {
    const parent = findParent(node, child)
    if (parent) {
      return parent
    }
  }
  return null
}

export type NodeStore = ReturnType<typeof useNodeStore>

export const useNodeStore = (id: string) => {
  const root = reactive(getTree(id))

  const setStorage = () => setTree(root)

  const nodeExposedMap = new Map<string, any>()
  const registerNode = (nodeId: string, instance: any) => {
    if (!nodeId || !instance) {
      throw new Error('Node ID and instance are required')
    }
    nodeExposedMap.set(nodeId, instance)
  }

  const nodeFocus = async (nodeId: string) => {
    await nextTick()
    nodeExposedMap.get(nodeId)?.focus()
  }

  const insertNewNodeAfter = async (node: NodeTree) => {
    const parent = findParent(node, root)
    if (!parent) {
      throw new Error('Parent node not found')
    }
    const newNode = newNodeTree(parent.id, node.id)
    parent.children?.push(newNode)
    await nodeFocus(newNode.id)
    return newNode
  }

  return { map, root, setStorage, registerNode, insertNewNodeAfter }
}
