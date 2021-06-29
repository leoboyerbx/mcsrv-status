const ServerStatus = require('../minecraft/ServerStatus')
const { token, prefix, onlineChannelId } = require('./config')
const Discord = require('discord.js');
const bot = require('bot-commander');
const client = new Discord.Client();
require('discord-buttons')(client)

const serverStatus = ServerStatus.getInstance()
let onlineChannel

const getStatusEmbed = () => {
  if (!serverStatus.serverOnline) {
    return new Discord.MessageEmbed()
      .setColor('#d53c3c')
      .setDescription('_Le serveur est hors-ligne_')
  } else {
    const { players } = serverStatus
    let description = '**Joueurs actuellement connectés**:'
    if (players?.length) {
      players.forEach(player => {
        description += '\n - ' + player.name
      })
    } else {
      description += '\n\n_Aucun joueur connecté._'
    }
    return new Discord.MessageEmbed()
      .setColor('#40cbbe')
      .setDescription(description)
  }
}

const activeMessages = []
const addStatusMessage = async (channel) => {
  const embedMessage = getStatusEmbed()
  const message = await channel.send('_Statut en temps réel_', embedMessage)
  activeMessages.push(message.id)
}

const updateStatusMessages = async () => {
  const toDelete = []
  const embedMessage = getStatusEmbed()
  for (const messageId of activeMessages) {
    try {
      const message = await onlineChannel.messages.fetch(messageId)
      message.edit('_Statut en temps réel_', embedMessage)
    } catch (e) {
      toDelete.push(messageId)
    }
  }
  toDelete.forEach(v => {
    const index = activeMessages.indexOf(v);
    if (index > -1) {
      activeMessages.splice(index, 1);
    }
  })
}

bot.prefix(prefix)
bot
  .command('online')
  .description('Creates an online player display slot')
  .action(message => {
    if (message.channel.id === onlineChannelId) {
      addStatusMessage(message.channel)
    }
  })
bot.command('tmp').action(() => {updateStatusMessages()})

module.exports = async () => {
  client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    onlineChannel = await client.channels.fetch(onlineChannelId)

    serverStatus.on('data', () => {
      updateStatusMessages()
    })
  });

  client.on('message', message => {
    bot.parse(message.content, message)
  });

  await client.login(token);

}
