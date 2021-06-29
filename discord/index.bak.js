const ServerStatus = require('../minecraft/ServerStatus')
const { token, prefix, onlineChannel } = require('./config')
const Discord = require('discord.js');
const client = new Discord.Client();
require('discord-buttons')(client)
const { MessageButton, MessageActionRow } = require('discord-buttons');

const serverStatus = ServerStatus.getInstance()

async function sendOnlinePlayers(channel) {
  const loadingEmbed = new Discord.MessageEmbed()
    .setColor('#40cbbe')
    .setAuthor("Récupération des joueurs en ligne...", 'https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif')
  const initialMessage = await channel.send(loadingEmbed)
  let players = []
  try {
    const data = serverStatus.fullServerData
    players = data.players
  } catch (e) {
    console.log('server isoffline')
    // players.push({"name":"ponk___","id":"d2ee43c7188b4cf2b02bc39c58bf0264"})
    // players.push({"name":"ponkadmin","id":"7cb8cae8a71343ff918e488694d22533"})
    // players.push({"name":"happy_hyu","id":"d8d722a252ec46e9bcbbf5cde6bbff8e"})
  }

  initialMessage.edit('', {
    embed: {
      color: '#40cbbe',
      title: 'Joueurs actuellement connectés au serveur:',
      author: {
        name: '----------',
        icon_url: 'https://image.flaticon.com/icons/png/128/1057/1057254.png'
      },
    }
  })
  if (players.length) {
    for (const player of players) {
      const embed = new Discord.MessageEmbed()
        .setColor('#40cbbe')
        // .setTitle(player.name)
        .setDescription('------------------------')
        // .setURL('https://fr.namemc.com/' + player.id)
        .setThumbnail('https://crafatar.com/renders/body/' + player.id + '?scale=10')
        // .setThumbnail('https://crafatar.com/avatars/' + player.id)
        .setAuthor(player.name, 'https://crafatar.com/avatars/' + player.id, 'https://fr.namemc.com/' + player.id)
       channel.send(embed)
    }
  } else {
    const embed = new Discord.MessageEmbed()
      .setColor('#40cbbe')
      .setDescription('_Aucun joueur connecté._')
    channel.send(embed)
  }

  const refreshButton = new MessageButton()
    .setLabel("Actualiser")
    .setStyle("blurple")
    .setID('refreshPlayers')
  console.log(refreshButton)
  const statusButton = new MessageButton()
    .setLabel("Voir le statut en temps réel")
    .setStyle('url')
    .setURL('https://status.bruleurs.ml')

  const buttonRow = new MessageActionRow()
    .addComponent(refreshButton)
    .addComponent(statusButton)

  const updateMessage = await channel.send(`_Mis à jour à ${new Date().toLocaleTimeString()} le ${new Date().toLocaleDateString()}_`, buttonRow)
}

module.exports = async () => {
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('message', message => {
    if (message.content.startsWith(`${prefix}online`) && message.channel.name === onlineChannel) {
      sendOnlinePlayers(message.channel)
    }
  });
  client.on('clickButton', async (button) => {
    if(button.id === 'refreshPlayers') {
      await button.reply.send('Mise à jour en cours...')
      await sendOnlinePlayers(button.channel)
      button.reply.delete()
    }
  });

  await client.login(token);

}
