/**
 * 将NodeStore列表转换为树形结构
 * @param nodes NodeStore列表
 * @returns 树形结构的Node数组
 */
export function listToTree(nodes: NodeData[]): NodeDataTree[] {
  const nodeMap = new Map<string, NodeDataTree>()
  const tree: NodeDataTree[] = []

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
        if (!parentNode.children) {
          parentNode.children = []
        }
        parentNode.children?.push(currentNode)
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
export function treeToList(tree: NodeDataTree): NodeData[] {
  const result: NodeData[] = []

  function traverse(node: NodeDataTree) {
    const rest = { ...node } as Partial<NodeDataTree>
    delete rest.children
    result.push(rest as NodeData)
    node.children?.forEach((child) => traverse(child))
  }

  ;[tree].forEach((root) => traverse(root))
  return result
}
