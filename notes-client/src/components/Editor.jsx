import React from 'react'
import Plain from 'slate-plain-serializer'
import { Editor } from 'slate-react'
import { connect } from 'react-redux'

import ActionBar from './ActionBar'
import Mark from './Mark'
import decorateNode from '../utils/decorate_node'
// import getDecorator from '../utils/decorate_node_2'
import * as actions from '../actions'
import { modes } from '../reducers/commands'

// const decorateNode2 = getDecorator({})
const emptyNote = () => Plain.deserialize('# ')
  .change()
  .selectAll()
  .collapseToEnd()
  .value

class MarkdownEditor extends React.Component {
  state = {
    timeStamp: new Date()
  }

  onKeyUp = event => {
    if (event.keyCode === 27) { // escape pressed
      this.props.toggleMode()
    }

  }

  onChange = (change) => {
    const { value } = change
    // console.log(change)
    console.log(change.value.blocks.map(block => block.text).toJS());
    console.log(JSON.stringify(change.value.blocks.toJS(), null, 4));
    // console.log(change.value.selection.toJS());
    this.props.editNote(value)
  }

  render() {
    const activeNote = this.props.activeNote
    const lastNote = this.props.lastNote
    const nextNote = this.props.nextNote

    // const currentEditor = (
    //   <Editor
    //     ref={editor => { this.editor = editor }}
    //     key={activeNote.id}
    //     autoFocus
    //     placeholder=""
    //     value={activeNote ? activeNote.value : emptyNote()}
    //     onChange={this.onChange}
    //     onKeyUp={this.onKeyUp}
    //     renderMark={Mark}
    //     decorateNode={decorateNode}
    //     style={{ width: '40em', paddingBottom: '2em' }}
    //   />
    // )
    //
    // const nextEditor = nextNote && (
    //   <Editor
    //     key={activeNote.id}
    //     placeholder=""
    //     value={nextNote}
    //     renderMark={Mark}
    //     decorateNode={decorateNode}
    //     style={{ width: '40em', paddingBottom: '2em' }}
    //   />
    // )
    //
    // const lastEditor = lastNote && (
    //   <Editor
    //     key={activeNote.id}
    //     placeholder=""
    //     value={lastNote}
    //     renderMark={Mark}
    //     decorateNode={decorateNode}
    //     style={{ width: '40em', paddingBottom: '2em' }}
    //   />
    // )
    //


    return (
      <div className="editor" style={{ fontSize: '1.2em' }}>
        <ActionBar
          inputRef={actionBar => { this.actionBar = actionBar}}
        />
        <div
          style={{
            float: 'left',
            width: '12em'
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
            key={activeNote.id}
            placeholder=""
            value={activeNote ? activeNote.value : emptyNote() }
            onChange={this.onChange}
            onKeyUp={this.onKeyUp}
            decorateNode={decorateNode}
            renderMark={Mark}
            style={{ width: '40em', paddingBottom: '2em' }}
          />
        </div>
      </div>
    )
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.mode === this.props.mode) return

    if (this.props.mode === modes.input) { this.editor.focus() }
    else if (this.props.mode === modes.command) { this.actionBar.focus() }
  }
}

const mapStateToProps = state => ({
  commandInput: state.commands.inputValue,
  mode: state.commands.mode,
  notes: state.notes.notesById,
  activeNote: state.notes.notesById[state.notes.activeNoteId]
})

export default connect(mapStateToProps, actions)(MarkdownEditor)
