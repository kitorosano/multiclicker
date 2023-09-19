// Socket.io
const { Server } = require('socket.io')
const sharedSession = require('express-socket.io-session')
const GameState = require('./gamestate')
const UserController = require('./controllers/user.controller')

module.exports = async (server, sessionMiddleware) => {
  const players = await UserController.getPlayers()
  const GAME = new GameState(players)

  const io = new Server(server)
  io.use(sharedSession(sessionMiddleware))

  io.on('connection', (socket) => {
    const connectedPlayers = io.sockets.sockets.size

    const nickname = socket.handshake.session.nickname
    if (!nickname) return socket.disconnect()

    socket.join(nickname)

    GAME.addPlayer(nickname)
    io.in(nickname).emit('playerScore', GAME.getPlayerByNickname(nickname))
    io.emit('onlinePlayers', connectedPlayers)

    socket.on('disconnect', () => {
      io.emit('onlinePlayers', connectedPlayers)
    })

    socket.on('score', (wasCombo) => {
      const playerScore = GAME.playerScore(nickname, wasCombo)
      // SAVE TO MONGO?
      io.in(nickname).emit('playerScore', playerScore)
    })
  })

  setInterval(() => {
    io.emit('update', {
      newBall: GAME.addBall(),
      players: GAME.getTop10Players()
    })
  }, 300)

  setInterval(() => {
    // save to mongo
    UserController.updatePlayers(GAME.players)
  }, 1000 * 30) // 30s
}
