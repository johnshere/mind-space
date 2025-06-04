type NodeData = {
  id: string
  parentId?: string // 父节点的id
  prevId?: string // 上一个节点的id
  nextId?: string // 下一个节点的id
  title: string
  description?: string
}

interface NodeTree extends NodeData {
  hidden?: boolean
  children?: NodeTree[]
}
