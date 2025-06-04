/**
 * 将NodeStore列表转换为树形结构
 * @param nodes NodeStore列表
 * @returns 树形结构的Node数组
 */
export function listToTree(nodes: NodeData[]): NodeTree[] {
  const nodeMap = new Map<string, NodeTree>()
  const tree: NodeTree[] = []

  // 第一遍：创建所有节点的映射
  nodes.forEach((node) => {
    nodeMap.set(node.id, { ...node, children: [] })
  })

  // 第二遍：构建树结构
  nodes.forEach((node) => {
    const curr = nodeMap.get(node.id)!
    if (!node.parentId) return tree.push(curr)
    const pNode = nodeMap.get(node.parentId)
    if (!pNode) return
    pNode.children = pNode.children || []
    pNode.children.push(curr)
  })

  // 根据 prevId 和 nextId 对同级节点排序
  function sortNodes(children: NodeTree[]): NodeTree[] {
    if (children.length < 2) return children
    const map = new Map<string, NodeTree>()
    children.forEach((child) => map.set(child.id, child))
    // 找到头节点：prevId 不存在或不在同级集合中的节点
    let head = children.find((child) => !child.prevId || !map.has(child.prevId))
    if (!head) {
      // 若找不到头节点，则直接返回原顺序
      return children
    }
    const sorted: NodeTree[] = []
    const visited = new Set<string>()
    let curr: NodeTree | undefined = head
    while (curr && !visited.has(curr.id)) {
      sorted.push(curr)
      visited.add(curr.id)
      if (curr.nextId && map.has(curr.nextId)) {
        curr = map.get(curr.nextId)
      } else {
        break
      }
    }
    // 如排序后个数不足，则把未排序的节点附加到末尾
    if (sorted.length !== children.length) {
      children.forEach((child) => {
        if (!visited.has(child.id)) sorted.push(child)
      })
    }
    return sorted
  }

  // 递归排序每个节点的 children 数组
  function sortTreeNodes(node: NodeTree) {
    if (node.children && node.children.length > 0) {
      node.children = sortNodes(node.children)
      node.children.forEach((child) => sortTreeNodes(child))
    }
  }

  tree.forEach((root) => sortTreeNodes(root))
  return tree
}

/**
 * 将树形结构展平为NodeStore列表
 * @param tree 树形结构的Node数组
 * @returns 展平后的NodeStore列表
 */
export function treeToList(tree: NodeTree): NodeData[] {
  const result: NodeData[] = []

  function traverse(node: NodeTree) {
    const rest = { ...node } as Partial<NodeTree>
    delete rest.children
    result.push(rest as NodeData)
    node.children?.forEach((child) => traverse(child))
  }

  ;[tree].forEach((root) => traverse(root))
  return result
}
