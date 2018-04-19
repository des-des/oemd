import { createReducer } from '../utils/redux'

import {
  OPEN_NOTE,
  NEW_NOTE,
  TOGGLE_MODE,
  COMMAND_INPUT_CHANGE
} from '../constants/action_types'

export const modes = {
  input: 'INPUT',
  command: 'COMMAND'
}

const initialState = {
  mode: modes.input,
  inputValue: ''
}

const newNote = state => {
  return {
    ...state,
    mode: modes.input,
    inputValue: ''
  }
}

const openNote = state => {
  return {
    ...state,
    mode: modes.input,
    inputValue: ''
  }
}

const commandInputChange = (state, action) => {
  const event = action.payload

  return {
    ...state,
    inputValue: event.target.value
  }
}

const toggleMode = state => {
  const newMode = state.mode === modes.input ? modes.command : modes.input

  return {
    ...state,
    mode: newMode
  }
}

export default createReducer(initialState, {
  NEW_NOTE: newNote,
  OPEN_NOTE: openNote,
  TOGGLE_MODE: toggleMode,
  COMMAND_INPUT_CHANGE: commandInputChange 
})
