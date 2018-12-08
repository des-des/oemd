import React from 'react'
import { Editor as SlateEditor } from 'slate-react'

const findPluginByType = plugins => type => {
  if (plugins) {
    for (let i = 0; i < plugins.length; i++) {
      if (plugins[i].type === type) return plugins[i]
    }
  }
}

const eventHandler = nodePlugins => eventName => (event, change) => {
  return nodePlugins
    .map(plugin => plugin[eventName])
    .reduce(
      (shouldContinue, onEvent) => {
        if (!shouldContinue) return shouldContinue
        if (!onEvent) return shouldContinue

        return shouldContinue && onEvent(event, change)
      },
      true)
}

class Editor extends React.Component {
  constructor(props) {
    super(props)

    this.block = findPluginByType(this.props.blockPlugins)
    this.mark = findPluginByType(this.props.markPlugins)
    this.event = eventHandler(this.props.blockPlugins)

    this.renderMark = this.renderMark.bind(this)
    this.decorateNode = this.decorateNode.bind(this)
    this.renderNode = this.renderNode.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  renderMark(props) {
    const { mark: { type } } = props

    const mark = this.mark(type)
    return mark && mark.render(props)
  }

  renderNode(props) {
    const currentBlock = this.block(props.node.type)

    if (currentBlock && currentBlock.render) return currentBlock.render(props)
  }

  decorateNode(node) {
    const currentBlock = this.block(node.type)

    if (currentBlock && currentBlock.decorations) {
      console.log('POW', currentBlock);
      return currentBlock.decorations(node)
    }
  }

  onKeyUp(event) {
    return this.event('onKeyUp')(event)

  }

  onKeyDown(event, change) {
    if (event.keyCode === 27) { // escape pressed
      this.props.toggleMode()

      return true
    }

    const onKeyDown = this.event('onKeyDown')

    if (onKeyDown) {
      return onKeyDown(event, change)
    }
  }

  onChange(change) {
    console.log('history', change.value.history.toJS());
    this.props.editNote(change.value)
  }

  render() {
    return (
      <SlateEditor
      {...this.props.attributes}
      renderNode={this.renderNode}
      decorateNode={this.decorateNode}
      onKeyUp={this.onKeyUp}
      onKeyDown={this.onKeyDown}
      renderMark={this.renderMark}
      onChange={this.onChange}
      value={this.props.value}
      />
    )
  }
}

export default Editor
