import React, { Component } from 'react'
import { Provider } from 'react-redux'

import store from './store'
import EditorPage from './components/EditorPage'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <EditorPage />
        </Provider>
      </div>
    )
  }
}

export default App
