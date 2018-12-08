const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

let peers = 0

app.use(express.static('public'))

io.on('connection', socket => {
  peers++
  console.log(`Peer connected, now have ${peers} connections`)

  socket.on('change', msg => {
    // console.log('change', msg)
    socket.broadcast.emit('change', msg)
  })

  socket.on('initial_state_changes', msg => {
    // console.log('initial_state_changes', msg)
    socket.broadcast.emit('initial_state_changes', msg)
  })

  socket.on('get_state', msg => {
    // console.log('get_state', msg)
    socket.broadcast.emit('get_tate', msg)
  })

  socket.emit('connected', {
    peers
  })

  socket.on('disconnect', () => {
    peers--
    console.log(`Peer disconented, now have ${peers} connections`)
  })
})

http.listen(3000, function () {
  console.log('listening on *:3000')

  process.on('exit', code => {
    console.log('Bye bye!')
    io.httpServer.close()
    io.close()
    process.exit(code)
  })
})
