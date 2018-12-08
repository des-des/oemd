const path = require('path')

module.exports = {
	entry: { schema: "./schema.js" },
  output: {
		libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
	mode: "development",
	// module: {
	//   rules: [
	//     {
	//       test: /\.js$/,
	//       use: {
	//         loader: 'babel-loader',
	//         options: {
	//           presets: [
	// 						['@babel/preset-env', { targets: { node: true } }]
	// 					]
	//         }
	//       }
	//     }
	//   ]
	// }
}
