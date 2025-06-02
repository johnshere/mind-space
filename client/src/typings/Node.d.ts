type NodeStore = {
  id: string
  parentId: string | null // 父节点的id
  prevId: string | null // 上一个节点的id
  nextId: string | null // 下一个节点的id
  name: string
  description: string
}

interface NodeTree extends NodeStore {
  children: NodeTree[]
}
