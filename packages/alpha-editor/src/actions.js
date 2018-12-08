import {
  EDIT_NOTE,
  NEW_NOTE,
  OPEN_NOTE,
  OPEN_NEXT_NOTE,
  OPEN_PREVIOUS_NOTE,
  COMMAND_INPUT_KEY_UP,
  COMMAND_INPUT_KEY_DOWN,
  COMMAND_INPUT_CHANGE,
  TOGGLE_MODE
} from './constants/action_types'
import { plainAction } from './utils/action'
import Plain from 'slate-plain-serializer'

import generateId from 'uuid/v4'


const emptyNote = () => Plain.deserialize('# ')
  .change()
  .selectAll()
  .collapseToEnd()
  .value


export const openNote = plainAction(OPEN_NOTE)
export const openNextNote = plainAction(OPEN_NEXT_NOTE)
export const openPreviousNote = plainAction(OPEN_PREVIOUS_NOTE)
export const editNote = plainAction(EDIT_NOTE)

export const newNote = payload => {
  const value = payload === undefined
    ? emptyNote()
    : Plain.deserialize(payload)

  return {
    type: NEW_NOTE,
    payload: {
      value,
      id: generateId()
    }
  }
}

export const commandInputKeyUp = plainAction(COMMAND_INPUT_KEY_UP)
export const commandInputKeyDown = plainAction(COMMAND_INPUT_KEY_DOWN)
export const commandInputChange = plainAction(COMMAND_INPUT_CHANGE)
export const toggleMode = plainAction(TOGGLE_MODE)
