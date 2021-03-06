import Automerge from 'automerge'
import { patch, h, toVNode as domToVNode } from './snabbdom.js'
import parse from './vnode_creators/vnode_markdown_it_ast.js'

const INSERT_TEXT = 'INSERT_TEXT'
const SPLIT_BLOCK = 'SPLIT_BLOCK'
const REMOVE_CHAR = 'REMOVE_CHAR'

let isDocumentOwner = false

socket.on('connected', msg => {
  if (msg.peers === 1) {
    isDocumentOwner = true
    let initialState = Automerge.init()
    initialState = Automerge.change(initialState, 'init1', doc => {
      doc.blocks = []
      const title = new Automerge.Text()
      doc.blocks.push(title)
    })

    initialState = Automerge.change(initialState, 'init2', doc => {
      doc.blocks[0].insertAt(0, ...'# Title with **bold**'.split(''))
    })

    oemd('editor', initialState)
  } else {
    isDocumentOwner = false
    socket.emit('get_state')
  }
  console.log('connected', msg)
})

socket.on('initial_state_changes', changes => {
  let initialState = Automerge.init()

  initialState = Automerge.applyChanges(initialState, changes)

  oemd('editor', initialState)
})
const reducers = {
  INSERT_TEXT: (state, { text, blockIndex, offset }) => {
    return Automerge.change(state, 'insert', state => {
      for (let i = 0; i < state.blocks.length; i++) {
        if (i !== blockIndex) continue

        state.blocks[i].insertAt(offset, text)
      }
    })
  },
  REMOVE_CHAR: (state, { text, blockIndex, offset }) => {
    return Automerge.change(state, 'insert', state => {
      for (let i = 0; i < state.blocks.length; i++) {
        if (i !== blockIndex) continue

        state.blocks[i].deleteAt(offset - 1, 1)
      }
    })
  },
  SPLIT_BLOCK: (state, { blockIndex, offset }) => {
    return Automerge.change(state, 'insert', state => {
      const { blocks } = state
      const targetBlock = blocks[blockIndex]

      blocks.deleteAt(blockIndex)
      blocks.insertAt(
        blockIndex,
        targetBlock.slice(0, offset),
        targetBlock.slice(offset)
      )
    })
  }
}

const updateState = (state, action) => {
  const oldState = JSON.parse(JSON.stringify(state))
  const reducer = reducers[action.type]

  if (!reducer) throw new Error(`${action.type} not supported`)

  const newState = reducer(state, action.payload)

  socket.emit('change', Automerge.getChanges(state, newState))

  // console.log({
  //   oldState,
  //   newState,
  //   action
  // })

  return newState
}

const oemd = (targetId, initialState) => {
  let state = initialState

  const domNode = document.getElementById(targetId)

  let vNode = stateToVNode(targetId, state)
  patch(domNode, vNode)

  socket.on('get_state', () => {
    if (isDocumentOwner) {
      const changes = Automerge.getChanges(Automerge.init(), state)

      socket.emit('initial_state_changes', changes)
    }
  })

  socket.on('change', changes => {
    state = Automerge.applyChanges(state, changes)

    render()
  })

  const update = action => {
    state = updateState(state, action)

    render()
  }

  const render = () => {
    const newVNode = stateToVNode(targetId, state)
    vNode = patch(vNode, newVNode)
  }

  domNode.addEventListener('keydown', keyDownHandler(update, targetId))
}

const findBlockParent = node => {
  if (node.dataset && node.dataset.isBlock === 'true') return node

  if (node.contenteditable) {
    throw new Error('Input fired outside blockNode')
  }

  return findBlockParent(node.parentNode)
}

const findNodeAtOffset = (targetId, blockIndex, offset) => {
  return findNodeInDomAtOffset(
    document.getElementById(targetId).childNodes[blockIndex],
    offset
  )
}

const findNodeInDomAtOffset = (container, offset) => {
  let current = 0
  let node = container.firstChild
  while (node) {
    const len = node.textContent.length
    current += len

    if (current >= offset) {
      const offsetInNode = offset - (current - len)
      if (node.nodeName === '#text') {
        return {
          innerOffset: offsetInNode,
          node
        }
      }

      return findNodeInDomAtOffset(node, offsetInNode)
    }

    const nextNode = node.nextSibling

    if (!nextNode) {
      return {
        node,
        innerOffset: current
      }
    }

    node = nextNode
  }

  return {
    innerOffset: 0,
    container
  }

  // alert('cursor out of range')
}

const setCursor = (targetId, range, blockIndex, offset) => {
  const {
    node: newCursorNode,
    innerOffset: newCursorOffset
  } = findNodeAtOffset(targetId, blockIndex, offset)

  range.setStart(newCursorNode, newCursorOffset)
  range.setEnd(newCursorNode, newCursorOffset)

  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}

const keysSkip = ['Control', 'Shift', 'Alt']

const keyDownHandler = (update, targetId) => e => {
  const selection = window.getSelection()
  const initRange = selection.getRangeAt(0)
  const key = e.key

  if (keysSkip.includes(key)) return

  if (!initRange.collapsed) {
    alert('operations not supported on selections')
  }

  const eventNode = initRange.startContainer

  const blockParent = findBlockParent(eventNode)
  const preCaretRange = document.createRange()
  preCaretRange.selectNodeContents(blockParent)
  preCaretRange.setEnd(initRange.startContainer, initRange.startOffset)
  const offset = preCaretRange.toString().length
  const blockIndex = parseInt(blockParent.dataset.index, 10)
  const blocks = document.getElementById(targetId).childNodes

  e.preventDefault()

  const range = document.createRange()

  let newCursorNode, newCursorOffset
  if (key === 'Enter') {
    update({
      type: SPLIT_BLOCK,
      payload: {
        blockIndex,
        offset
      }
    })
    setCursor(targetId, range, blockIndex + 1, 0)
  } else if (key === 'ArrowLeft') {
    if (offset !== 0) setCursor(targetId, range, blockIndex, offset - 1)
  } else if (key === 'ArrowDown') {
    if (blockIndex !== blocks.length - 1) {
      setCursor(targetId, range, blockIndex + 1, offset)
    }
  } else if (key === 'ArrowUp') {
    if (blockIndex !== 0) {
      setCursor(targetId, range, blockIndex - 1, offset)
    }
  } else if (key === 'ArrowRight') {
    if (offset !== blockParent.textContent.length) {
      setCursor(targetId, range, blockIndex, offset + 1)
    }
  } else if (key === 'Backspace') {
    update({
      type: REMOVE_CHAR,
      payload: {
        blockIndex: blockIndex,
        offset
      }
    })

    setCursor(targetId, range, blockIndex, offset - 1)
  } else if (key === 'Delete') {
    update({
      type: REMOVE_CHAR,
      payload: {
        blockIndex: blockIndex,
        offset: offset + 1
      }
    })

    setCursor(targetId, range, blockIndex, offset)
  } else {
    update({
      type: INSERT_TEXT,
      payload: {
        blockIndex: blockIndex,
        text: key,
        offset
      }
    })

    setCursor(targetId, range, blockIndex, offset + 1)
  }
}

const stateToVNode = (targetId, state) => {
  return h(
    `div#${targetId}`,
    {},
    state.blocks.map((block, index) => {
      const tree = parse(block.join(''))[0]

      return h(
        tree.tag,
        { dataset: { isBlock: true, index: index.toString() } },
        tree.children.map(stateToVNodeChild)
      )
    })
  )
}

const stateToVNodeChild = tree => {
  if (typeof tree === 'string') return tree
  if (tree.tag === 'text') return tree.children

  const { children } = tree
  return h(
    tree.tag,
    { props: tree.attrs },
    typeof children === 'string' ? children : children.map(stateToVNodeChild)
  )
}
