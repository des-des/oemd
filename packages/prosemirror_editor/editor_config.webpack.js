const path = require('path')

module.exports = {
	entry: {editor: './editor.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
	mode: "development"
}
