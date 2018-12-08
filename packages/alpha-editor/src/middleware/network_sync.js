import MarkdownIt from 'markdown-it'

import {
  APPLY_DOCUMENT_OPERATION,
  OPEN_DOCUMENT,
  EMIT_DOCUMENT_OPERATION
} from '../constants/action_types'

export default store => {
  const graph = createGraph()
  const subsciptions = {}

  return next => action => {
    if (action.type === EMIT_DOCUMENT_OPERATION) {
      const activeDocumentId = `DOCUMENT_${action.payload.documentId}`

      const activeDocumentValue = selectActiveDocuemtValue(store.getState())
      graph.applyOpporation(activeDocumentValue, action.payload.operation)

      return
    }

    if (action.type === OPEN_DOCUMENT) {
      const oldDocumentId = `DOCUMENT_${store.getState().activeDocumentId}`
      const activeDocumentId = `DOCUMENT_${action.payload.documentId}`

      graph.unsubscribe(subsciptions[oldDocumentId])
      delete subsciptions[oldDocumentId]

      const activeDocument = graph.getDocument(activeDocumentId)
      activeDocument.getValue(value => {
        store.dispatch({
          SET_ACTIVE_DOCUMENT,
          payload: { value }
        })
      })

      subsciptions[activeDocumentId] = activeDocument.subscibe(operation => {
        store.dispatch({
          type: APPLY_SLATE_OPERATION,
          payload: operation
        })
      })
      return
    }

     next(action)

  }

}
