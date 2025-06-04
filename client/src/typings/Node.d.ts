type NodeData = {
  id: string
  parentId: string | null // 父节点的id
  prevId: string | null // 上一个节点的id
  nextId: string | null // 下一个节点的id
  title: string
  description?: string
}

interface NodeDataTree extends NodeData {
  hidden?: boolean
  children?: NodeDataTree[]
}

interface EditorExposed {
  focus: () => void
  blur: () => void
}
interface NodeExposed {
  titleRef?: EditorExposed
  descRef?: EditorExposed
  children?: NodeProxy[]
  insertNewNode?: (
    node?: NodeProxy | NodeDataTree
  ) => Promise<NodeProxy | undefined>
}
type NodeProxy = {
  node: NodeTree
  store: NodeStore
} | null
interface NodeTree {
  data: NodeDataTree
  ref?: NodeProxy
  children?: NodeTree[]
}
