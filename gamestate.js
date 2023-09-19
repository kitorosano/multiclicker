class GameState {
  constructor(players) {
    this._fps = 30
    this._ballRadius = 30

    this._players = players || []
  }

  get fps() {
    return this._fps
  }

  get balls() {
    return this._balls
  }

  getPlayerByNickname(nickname) {
    return this._players.find((player) => player.nickname === nickname)
  }

  addPlayer(nickname) {
    const playerExists = this.getPlayerByNickname(nickname)
    if (playerExists) return

    this._players.push({
      nickname,
      totalScore: 0,
      maxCombo: 0,
      currentCombo: 0
    })
  }

  addBall() {
    let rndX = Math.random()
    let rndY = Math.random()

    const radius = this._ballRadius

    const color = `hsl(${Math.random() * 360}, 100%, 50%)`

    return { rndX, rndY, radius, color }
  }

  playerScore(nickname, wasCombo) {
    const player = this.getPlayerByNickname(nickname)
    if (!player) return

    if (wasCombo) {
      player.currentCombo += 1
      player.totalScore += 10 * player.currentCombo
      if (player.currentCombo > player.maxCombo) {
        player.maxCombo = player.currentCombo
      }
    } else {
      player.currentCombo = 0
      player.totalScore -= 50
      if (player.totalScore < 0) player.totalScore = 0
    }

    return player
  }

  get players() {
    return this._players.filter((n) => n && n)
  }

  getTop10Players() {
    const players = this.players.sort((a, b) => {
      if (a.totalScore > b.totalScore) return -1
      if (a.totalScore < b.totalScore) return 1
      if (a.maxCombo > b.maxCombo) return -1
      if (a.maxCombo < b.maxCombo) return 1
      return 0
    })

    return players.slice(0, 10)
  }
}
module.exports = GameState
