import { COMMAND_INPUT_KEY_UP } from '../constants/action_types'
import { openNextNote, openPreviousNote, toggleMode } from '../actions'

const keys = {
  ENTER: 13,
  ESCAPE: 27,
  LEFT: 37,
  RIGHT: 39
}

export default store => next => action => {
  if (action.type !== COMMAND_INPUT_KEY_UP) return next(action)

  const { keyCode } = action.payload
  const { LEFT, RIGHT, ESCAPE } = keys

  if (keyCode === LEFT) return next(openPreviousNote())
  if (keyCode === RIGHT) return next(openNextNote())
  if (keyCode === ESCAPE) return next(toggleMode())
}
