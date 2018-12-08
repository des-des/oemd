import { Range } from 'slate'

import getCursorAtOffset from './get_cursor_at_offset'

const punctuateAt = (offset, blockKey, length = 1) => change => {
  const targetBlock = change.value.document.getDescendant(blockKey)

  const {
    key: anchorKey,
    offset: anchorOffset
  } = getCursorAtOffset(targetBlock, offset)

  const {
    key: focusKey,
    offset: focusOffset
  } = getCursorAtOffset(targetBlock, offset + length)

  const range = Range.create({
    anchorKey,
    anchorOffset,
    focusKey,
    focusOffset
  })

  change.addMarkAtRange(range, 'punctuation')
}


export default punctuateAt
