const serverData = require('../minecraft/serverData')
const { token, prefix } = require('./config')
const Discord = require('discord.js');
const client = new Discord.Client();

async function sendOnlinePlayers(channel) {
  const loadingEmbed = new Discord.MessageEmbed()
    .setColor('#40cbbe')
    .setAuthor("Récupération des joueurs en ligne...", 'https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif')
  const initialMessage = await channel.send(loadingEmbed)
  let players = []
  try {
    const data = await serverData()
    players = data.players
  } catch (e) {
    console.log('server isoffline')
    players.push({"name":"ponk___","id":"d2ee43c7188b4cf2b02bc39c58bf0264"})
    players.push({"name":"ponkadmin","id":"7cb8cae8a71343ff918e488694d22533"})
    players.push({"name":"happy_hyu","id":"d8d722a252ec46e9bcbbf5cde6bbff8e"})
  }
  const loadedEmbed = new Discord.MessageEmbed()
    .setColor('#40cbbe')
    .setTitle("Joueurs actuellement connectés au serveur:")
    .setAuthor('----------', 'https://image.flaticon.com/icons/png/128/1057/1057254.png')
  initialMessage.edit(loadedEmbed)
  players.forEach(player => {
    console.log(player)
    const embed = new Discord.MessageEmbed()
      .setColor('#40cbbe')
      // .setTitle(player.name)
      .setDescription('------------------------')
      // .setURL('https://fr.namemc.com/' + player.id)
      .setThumbnail('https://crafatar.com/renders/body/' + player.id + '?scale=10')
      // .setThumbnail('https://crafatar.com/avatars/' + player.id)
      .setAuthor(player.name, 'https://crafatar.com/avatars/' + player.id, 'https://fr.namemc.com/' + player.id)
    channel.send(embed)
  })
}

module.exports = async () => {
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('message', message => {
    if (message.content.startsWith(`${prefix}online`)) {
      sendOnlinePlayers(message.channel)
    }
  });

  await client.login(token);

}
