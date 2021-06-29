const Query = require("./lib/Query");
const axios = require('axios')
const EventEmitter = require('events')
const sameArrayContent = require('./helpers/sameArrayContent')


class ServerStatus extends EventEmitter {
  static instance

  constructor() {
    super();

    this.q = new Query({host: 'localhost', port: 25565, timeout: 2000});
    this.prevPlayers = []
    this.cachedPlayers = []
    this.serverOnline = false
    this.serverData = {}

    this.on('players', () => {
      this.emit('data', this.fullServerData)
    })
    this.on('status', () => {
      this.emit('data', this.fullServerData)
    })

    this.fetchInterval = setInterval(this.fetchData.bind(this), 1000)
    this.fetchData().then(() => {
      this.emit('players', this.serverData.players)
    })
  }

  get fullServerData() {
    return { ...this.serverData, online: this.serverOnline }
  }
  get players() {
    return this.cachedPlayers
  }

  async fetchData() {
    let serverData
    try {
      serverData = await this.q.fullStat()
    } catch (e) {
      console.log('Error getting server data:', e)
      this.changeServerOnline(false)
      return
    }
    this.changeServerOnline(true)

    let playersUpdated = false
    if(serverData.players) {
      if (sameArrayContent(this.prevPlayers, serverData.players)) {
        serverData.players = this.cachedPlayers
      } else {
        this.prevPlayers = serverData.players
        serverData.players = await Promise.all(serverData.players.map(async player => {
          const playerRequest = await axios.get('https://api.mojang.com/users/profiles/minecraft/' + player)
          return playerRequest.data ?? null
        }))
        this.cachedPlayers = serverData.players
        playersUpdated = true
      }
    }
    this.serverData = serverData
    if (playersUpdated) this.emit('players', serverData.players)
  }

  changeServerOnline(online) {
    const serverWasOnline = this.serverOnline
    this.serverOnline = online
    if (serverWasOnline !== online) {
      this.emit('status')
    }
  }

  static getInstance() {
    if (!ServerStatus.instance) {
      ServerStatus.instance = new ServerStatus()
    }
    return ServerStatus.instance
  }
}
module.exports = ServerStatus
