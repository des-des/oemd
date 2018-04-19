import React from 'react'
import Plain from 'slate-plain-serializer'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import generateId from 'uuid/v4'
import { connect } from 'react-redux'

import Mark from './Mark'
import decorateNode from '../utils/decorate_node'
import * as actions from '../actions'
import { modes } from '../reducers/commands'

const getCommands = notes => {
  return ([
    {
      name: 'new note',
      key: 'NEW'
    }
  ]).concat(
    notes
      .filter(note => note.title.trim() !== '')
      .map(note => ({
        key: 'OPEN',
        name: `open note ${note.title}`,
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
      marginLeft: '10em',
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

const emptyNote = () => Plain.deserialize('# ')
  .change()
  .selectAll()
  .collapseToEnd()
  .value

class MarkdownEditor extends React.Component {
  state = {
    timeStamp: new Date()
  }

  onChange = ({value}) => {
    this.props.editNote(value)
  }

  onKeyUp = event => {
    if (this.props.mode === modes.command) {
      const { keyCode } = event
      if (keyCode === 13) { // enter pressed
        const filtered = getCommands(Object.values(this.props.notes))
          .filter(commandFilterPred(this.props.commandInput))
        if (filtered.length === 0) return

        const action = filtered[0]

        if (action.key === 'NEW') {
          this.props.newNote()
        } else if (action.key === 'OPEN') {
          this.props.openNote(action.meta.noteId)
        }
      } else {
        this.props.commandInputKeyUp(event)
      }
    } else {
      if (event.keyCode === 27) { // escape pressed
        this.props.commandInputKeyUp(event)
      }
    }
  }


  render() {
    const activeNote = this.props.activeNote

    return (
      <div className="editor">
        <input
          ref={ actionBar => { this.actionBar = actionBar }}
          onKeyUp={this.onKeyUp}
          onChange={this.props.commandInputChange}
          value={this.props.mode === modes.command ? this.props.commandInput : ''}
          style={{
            display: 'block',
            marginLeft: '10em',
            width: '15em',
            fontSize: '2em',
            border: 'none',
            backgroundColor: 'black',
            color: 'white'
          }}
        />
      { this.props.mode === modes.command &&
          <CommandOpts inputValue={this.props.commandInput } notes={Object.values(this.props.notes)} />
        }
        <div
          style={{
            float: 'left',
            width: '20em'
          }}
        >
          <span style={{
              float: 'right',
              paddingRight: '1em',
              paddingTop: '0.4em',
              fontSize: '0.7em'
          }}>
            created by <em>des-des</em> <br />
          { this.state.timeStamp.toISOString() }
          </span>
        </div>
        <div style={{
          float: 'left',
          opacity: this.props.mode === modes.input ? '1' : '0.2' }}
        >

          <Editor
            ref={editor => { this.editor = editor }}
            autoFocus
            placeholder=""
            value={activeNote ? activeNote.value : emptyNote() }
            onChange={this.onChange}
            onKeyUp={this.onKeyUp}
            renderMark={Mark}
            decorateNode={decorateNode}
            style={{ width: '30em', paddingBottom: '2em' }}
          />
        </div>
      </div>
    )
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.mode === this.props.mode) return

    if (this.props.mode === modes.input) this.editor.focus()
    else if (this.props.mode === modes.command) this.actionBar.focus()
  }
}

const mapStateToProps = state => ({
  commandInput: state.commands.inputValue,
  mode: state.commands.mode,
  notes: state.notes.notesById,
  activeNote: state.notes.notesById[state.notes.activeNoteId]
})

export default connect(mapStateToProps, actions)(MarkdownEditor)
