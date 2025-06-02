/**
 * 将NodeStore列表转换为树形结构
 * @param nodes NodeStore列表
 * @returns 树形结构的Node数组
 */
export function listToTree(nodes: NodeStore[]): NodeTree[] {
  const nodeMap = new Map<string, NodeTree>()
  const tree: NodeTree[] = []

  // 第一遍：创建所有节点的映射
  nodes.forEach((node) => {
    nodeMap.set(node.id, { ...node, children: [] })
  })

  // 第二遍：构建树结构
  nodes.forEach((node) => {
    const currentNode = nodeMap.get(node.id)!
    if (!node.parentId) {
      tree.push(currentNode)
    } else {
      const parentNode = nodeMap.get(node.parentId)
      if (parentNode) {
        parentNode.children.push(currentNode)
      }
    }
  })

  return tree
}

/**
 * 将树形结构展平为NodeStore列表
 * @param tree 树形结构的Node数组
 * @returns 展平后的NodeStore列表
 */
export function treeToList(tree: NodeTree): NodeStore[] {
  const result: NodeStore[] = []

  function traverse(node: NodeTree) {
    const rest = { ...node } as Partial<NodeTree>
    delete rest.children
    result.push(rest as NodeStore)
    node.children?.forEach((child) => traverse(child))
  }

  ;[tree].forEach((root) => traverse(root))
  return result
}
