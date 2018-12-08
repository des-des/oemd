import React from 'react'
import Plain from 'slate-plain-serializer'
import {connect} from 'react-redux'


import ActionBar from './ActionBar'
import * as actions from '../actions'
import { modes } from '../reducers/commands'

import Editor from './Editor'
import { title, list, listItem } from '../blocks/'
import { punctuation } from '../marks/'
import html from '../utils/html'

class MarkdownEditor extends React.Component {
  state = {
    timeStamp: new Date()
  }

  getHtml = () => {
    console.log('POW');
    // if (this.props.activeNote.value) {
      console.log('WOW');
      console.log(html.serialize(this.props.activeNote.value))
    // }
  }

  render() {
    const activeNote = this.props.activeNote

    return (<div className="editor" style={{
        fontSize: '1.2em'
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
          blockPlugins={[title(), listItem(), list()]}
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
      <div onClick={this.getHtml}>GET HTML</div>
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
// {/*markPlugins={[punctuation()]}*/}

const mapStateToProps = state => ({
  commandInput: state.commands.inputValue,
  mode: state.commands.mode,
  notes: state.notes.notesById,
  activeNote: state.notes.notesById[state.notes.activeNoteId]
})

export default connect(mapStateToProps, actions)(MarkdownEditor)
