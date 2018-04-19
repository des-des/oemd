import React, { Component } from 'react'
import { Provider } from 'react-redux'

import store from './store'
import Editor from './components/Editor'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <Editor />
        </Provider>
      </div>
    )
  }
}

export default App
