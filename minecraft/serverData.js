const Query = require("minecraft-query");
const axios = require('axios')

function sameArrayContent(array1, array2) {
  array1.sort()
  array2.sort()
  // if the other array is a falsy value, return
  if (!array2)
    return false;

  // compare lengths - can save a lot of time
  if (array1.length !== array2.length)
    return false;

  for (let i = 0, l=array1.length; i < l; i++) {
    // Check if we have nested arrays
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      // recurse into the nested arrays
      if (!array1[i].equals(array2[i]))
        return false;
    }
    else if (array1[i] !== array2[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}

const q = new Query({host: 'localhost', port: 25565, timeout: 2000});
let prevPlayers = []
let cachedPlayers = []

module.exports = async function () {
  const serverData = await q.fullStat().catch(e => {
    console.log('error getting serverdata')
  })
  if(serverData.players) {
    if (sameArrayContent(prevPlayers, serverData.players)) {
      console.log('Players list not changed, using cached one')
      serverData.players = cachedPlayers
    } else {
      console.log('Players list updated, retreiving players info from Mojang')
      prevPlayers = serverData.players
      serverData.players = await Promise.all(serverData.players.map(async player => {
        const playerRequest = await axios.get('https://api.mojang.com/users/profiles/minecraft/' + player)
        return playerRequest.data ?? null
      }))
      cachedPlayers = serverData.players
    }
  }
  return serverData
}
