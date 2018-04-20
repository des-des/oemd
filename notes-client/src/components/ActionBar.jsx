import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../actions'
import { modes } from '../reducers/commands'

const getCommands = notes => {
  return ([
    {
      name: '',
      key: 'EMPTY'
    },
    {
      name: 'new note',
      key: 'NEW'
    }
  ]).concat(
    notes
      .filter(note => note.title.trim() !== '')
      .map(note => ({
        key: 'OPEN',
        name: `open ${note.title}`,
        meta: {
          noteId: note.id
        }
      }))
  )
}

const commandFilterPred = search => command => {
  return command.name.toLowerCase().includes(search.toLowerCase())
}

const CommandOpts = ({ inputValue, notes }) => {
  const remaining = getCommands(notes)
    .filter(commandFilterPred(inputValue))

  return (
    <div style={{
      display: 'block',
      marginLeft: '6em',
      width: '15em',
      fontSize: '2em',
      border: 'none',
      backgroundColor: 'black',
      color: 'white',
      position: 'absolute',
      top: 0
    }}>
      { remaining.map((command, i) =>  {
        const selected = i === 0
        const offset = command.name.toLowerCase().indexOf(inputValue.toLowerCase())
        const len = inputValue.length

        const start = command.name.slice(0, offset)
        const hightlighted = command.name.slice(offset, offset + len)
        const end = command.name.slice(offset + len)

        return (
          <span style={{
              display: 'block',
              backgroundColor: selected ? '#111111' : 'black'
            }}>
            {start}
            <strong>{hightlighted}</strong>
            {end}
          </span>
        )
      } )[0]}
    </div>
  )
}

class ActionBar extends React.Component {

  onKeyUp = event => {
    const { keyCode } = event
    if (keyCode === 13) { // enter pressed
      const filtered = getCommands(Object.values(this.props.notes))
        .filter(commandFilterPred(this.props.commandInput))
      if (filtered.length === 0) return

      const action = filtered[0]

      if (action.key === 'EMPTY') {
        this.props.toggleMode()
      } else if (action.key === 'NEW') {
        this.props.newNote()
      } else if (action.key === 'OPEN') {
        this.props.openNote(action.meta.noteId)
      }
    } else {
      this.props.commandInputKeyUp(event)
    }
  }


  render() {
    return (
      <div className="action_bar">
        <input
          ref={this.props.inputRef}
          onKeyUp={this.onKeyUp}
          onChange={this.props.commandInputChange}
          value={this.props.mode === modes.command ? this.props.commandInput : ''}
          style={{
            display: 'block',
            marginLeft: '6em',
            width: '15em',
            fontSize: '2em',
            border: 'none',
            backgroundColor: 'black',
            color: 'white'
          }}
        />
      { this.props.mode === modes.command &&
          <CommandOpts
            inputValue={this.props.commandInput}
            notes={Object.values(this.props.notes)}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  commandInput: state.commands.inputValue,
  mode: state.commands.mode,
  notes: state.notes.notesById,
  activeNote: state.notes.notesById[state.notes.activeNoteId]
})

export default connect(mapStateToProps, actions)(ActionBar)
