const createDocument = (gun, documentId) => {
  const self = {}
  const nodes = {}

  const documentRoot = gun.get(documentId)
  const addNode = (nodeId, gunNode) => {
    nodes[nodeId] = gunNode
  }

  const addTree = (nodeId) => {
    const gunNode = gun.get(nodeId)

    addNode(nodeId, gunNode)

    gunNode
      .get('childBlocks')
      .map()
      .once(childBlock => {
        createDocumentTree(childBlock.id)
      })
  }

  const batch = (tasks, cb) => {
    let count = 0
    const results = []
    tasks.forEach((task, i) => {
      task(result => {
        results[i] = result

        count++
        if (count >= tasks.length) {
          cb(results)
        }
      })
    })
  }

  const identity = x => x

  const mapTree = (mapper = identity) => {
    const fn = (nodeId, cb) => {
      gun
        .get(nodeId)
        .once(nodeData => {
          node.get('childBlocks').once(childNodes => {
            nodeData.childNodes = []

            const getChildNodeTrees = childNodes.map(childNode => cb => {
              fn(childNode.id, cb)
            }

            batch(getChildNodeTrees, childNodeTrees => {
              childNodeTrees.forEach((childNodeTree, i) => {
                nodeData.childNodes[i] = childNodeTree
              })

              cb(mapper(nodeData))
            })
          })
        })

      childNodeIds

      const mappedNode = mapper(node)
      mappedNode.childNodes = childNodeIds.map(fn)

      return mappedNode
    }

    return fn
  }

  const getDocument = () => mapTree(node => ({
    data: {
      id: node.id
    },
    blocks: node.childNodes
  })(documentRootNodeId)

  self.getDocument = getDocument

  const subscibe = (listener) => {

  }

}

const createGraph = () => {
  const self = {}

  const gun = new Gun()

  const getDocument = documentId => createDocument(gun, documentId)
  self.getDocument = getDocument

}
