import { createReducer } from '../utils/redux'
import {
  EDIT_NOTE,
  NEW_NOTE,
  OPEN_NOTE,
  OPEN_NEXT_NOTE,
  OPEN_PREVIOUS_NOTE
} from '../constants/action_types'

const initialState = {
  notesById: {}
}

const openNextNote = state => {
  const noteIds = Object.keys(state.notesById)
  const currentIndex = noteIds.indexOf(state.activeNoteId)
  const targetIndex = (currentIndex + 1) % noteIds.length
  const nexActiveNoteId = noteIds[targetIndex]

  return openNote(state, { payload: nexActiveNoteId })
}

const openPreviousNote = state => {
  const noteIds = Object.keys(state.notesById)
  const currentIndex = noteIds.indexOf(state.activeNoteId)
  const targetIndex = (currentIndex - 1 + noteIds.length) % noteIds.length
  const nexActiveNoteId = noteIds[targetIndex]

  return openNote(state, { payload: nexActiveNoteId })
}

const noteTitle = value => {
  // console.log(value.document.nodes);
  // value.document.nodes.forEach(node => {
  //   console.log(node.toJS())
  // })
  // console.log(value.document.nodes)
  const title = value.document.nodes.first().text.split('#')[1]
  return title ? title.trim() : ''
}

const editNote = (state, action) => {
  const value = action.payload
  const title = noteTitle(value)

  return {
    ...state,
    notesById: {
      ...state.notesById,
      [state.activeNoteId]: {
        ...state.notesById[state.activeNoteId],
        value,
        title
      }
    }
  }
}

const newNote = (state, action) => {
  const newNote = action.payload

  return {
    ...state,
    activeNoteId: newNote.id,
    notesById: {
      ...state.notesById,
      [newNote.id]: {
        ...newNote,
        title: noteTitle(newNote.value),
      }
    }
  }
}

const openNote = (state, action) => {
  return {
    ...state,
    activeNoteId: action.payload
  }
}

export default createReducer(initialState, {
  EDIT_NOTE: editNote,
  NEW_NOTE: newNote,
  OPEN_NOTE: openNote,
  OPEN_NEXT_NOTE: openNextNote,
  OPEN_PREVIOUS_NOTE: openPreviousNote
})
