import { combineReducers } from 'redux'

import notes from './notes'
import commands from './commands'

export default combineReducers({
  notes,
  commands
})
