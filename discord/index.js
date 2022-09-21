const ServerStatus = require('../minecraft/ServerStatus')
const { token, prefix, onlineChannelId, webStatusUrl, webMapUrl } = require('../config')
const Discord = require('discord.js')
const bot = require('bot-commander')
const mergeImg = require('merge-img')
const { promisify } = require('util')
const fs = require('fs')
const deleteFile = promisify(fs.unlink)
const checkExists = promisify(fs.access)
const client = new Discord.Client()
require('discord-buttons')(client)
const { MessageButton } = require('discord-buttons')

const serverStatus = ServerStatus.getInstance()
let onlineChannel
let imgIndex = 0

const writeImage = (img, path) => {
  return new Promise(resolve => {
    img.write(path, () => {
      resolve()
    })
  })
}

const cleanFile = async filename => {
  try {
    await checkExists(filename)
    await deleteFile(filename)
    return true
  } catch (e) {
    return false
  }
}

const getStatusEmbed = async () => {
  if (!serverStatus.serverOnline) {
    return new Discord.MessageEmbed()
      .setColor('#d53c3c')
      .setDescription('_Le serveur est hors-ligne_')
  } else {
    const { players } = serverStatus
    let description = '**Joueurs actuellement connectés**:'
    let attachment
    const images = ['./public/blank.png']
    if (players?.length) {
      players.forEach(player => {
        description += '\n - ' + player.name
        images.push('https://crafatar.com/renders/body/' + player.id + '?scale=2')
      })
    } else {
      description += '\n\n_Aucun joueur connecté._'
    }
    const img = await mergeImg(images, { offset: 20 })
    await writeImage(img, './public/online-' + imgIndex + '.png')
    attachment = './public/online-' + imgIndex + '.png'
    const embed = new Discord.MessageEmbed()
      .setColor('#40cbbe')
      .setDescription(description)
    if (attachment) {
      embed.attachFiles(attachment)
        .setThumbnail('attachment://online-' + imgIndex + '.png')
    }
    cleanFile('./public/online-' + (imgIndex - 1) + '.png').then(rs => console.log(rs ? 'cleaned an old file' : 'no old file cleaned'))
    imgIndex++


    const buttons = []
    if (webStatusUrl) {
      console.log('Web status url:', webStatusUrl)
      buttons.push(
        new MessageButton()
          .setLabel('Voir le statut en ligne')
          .setStyle('url')
          .setURL(webStatusUrl)
      )
    }
    if (webMapUrl) {
      console.log('Web map url:', webMapUrl)
      buttons.push(
        new MessageButton()
          .setLabel('Ouvrir la Carte')
          .setStyle('url')
          .setURL(webMapUrl)
      )
    }
    return { embed, buttons }
  }
}

const updateStatusMessage = async () => {
  const embed = await getStatusEmbed()
  try {
    await onlineChannel.bulkDelete(10)
    await onlineChannel.send('_Statut en temps réel_\n__', embed)
  } catch (e) {
    console.log(e)
  }
}

bot.prefix(prefix)
bot
  .command('online')
  .description('Creates an online player display slot')
  .action(async message => {
    if (message.channel.id === onlineChannelId) {
      await message.delete()
      await updateStatusMessage()
    }
  })
bot.command('clean').action((message) => {
  if (message.channel.id === onlineChannelId) {
    message.channel.bulkDelete(100)
  }
})

module.exports = async () => {
  client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`)
    onlineChannel = await client.channels.fetch(onlineChannelId)
    updateStatusMessage()

    serverStatus.on('data', () => {
      updateStatusMessage()
    })
  })

  client.on('message', message => {
    bot.parse(message.content, message)
  })

  await client.login(token)

}
