export default (node, totalOffset) => {
  const textNodes = node.getTexts()

  const anchorKey = textNodes.first().key

  const searchStart = { offset: totalOffset, key: anchorKey, found: false };

  return textNodes.reduce((acc, textNode) => {
    const { key, offset, found } = acc
    if (found) return acc

    const currentText = textNode.text

    const nextOffset = offset - currentText.length
    if (nextOffset <= 0) {
      return {
        ...acc,
        found: true
      }
    }

    return {
      key: textNodes.first().key,
      offset: totalOffset,
      found: false
    }
  }, searchStart)
}
