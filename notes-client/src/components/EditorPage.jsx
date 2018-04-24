import React from 'react'
import Plain from 'slate-plain-serializer'
import {connect} from 'react-redux'


import ActionBar from './ActionBar'
import * as actions from '../actions'
import { modes } from '../reducers/commands'

import Editor from './Editor'
import { title } from '../blocks/'
import { punctuation } from '../marks/'

class MarkdownEditor extends React.Component {
  state = {
    timeStamp: new Date()
  }

  render() {
    const activeNote = this.props.activeNote

    return (<div className="editor" style={{
        fontSize: '1em'
      }}>
      <ActionBar inputRef={actionBar => {
          this.actionBar = actionBar
        }}/>
      <div style={{
          float: 'left',
          width: '12em'
        }}>
        <span style={{
            float: 'right',
            paddingRight: '1em',
            paddingTop: '0.4em',
            fontSize: '0.7em'
          }}>
          created by
          <em>des-des</em>
          <br/> {this.state.timeStamp.toISOString()}
        </span>
      </div>
      <div style={{
          float: 'left',
          opacity: this.props.mode === modes.input
            ? '1'
            : '0.2'
        }}>

        <Editor
          value={activeNote.value}
          editNote={this.props.editNote}
          toggleMode={this.props.toggleMode}
          blockPlugins={[title()]}
          markPlugins={[punctuation()]}
          attributes={{
            style:{
              width: '48.17em',
              paddingBottom: '2em'
            },
            ref: editor => { this.editor = editor },
            placeholder:"",
            key:activeNote.id
          }}
          />
      </div>
    </div>)
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.mode === this.props.mode) return

    if (this.props.mode === modes.input) {
      this.editor.focus()
    } else if (this.props.mode === modes.command) {
      this.actionBar.focus()
    }
  }
}

const mapStateToProps = state => ({
  commandInput: state.commands.inputValue,
  mode: state.commands.mode,
  notes: state.notes.notesById,
  activeNote: state.notes.notesById[state.notes.activeNoteId]
})

export default connect(mapStateToProps, actions)(MarkdownEditor)
