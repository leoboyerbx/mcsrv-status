const ServerStatus = require('../minecraft/ServerStatus')
const { token, prefix, onlineChannelId, webStatusUrl, webMapUrl } = require('../config')
const Discord = require('discord.js')
const bot = require('bot-commander')
const mergeImg = require('merge-img')
const { promisify } = require('util')
const fs = require('fs')
const { ButtonBuilder, EmbedBuilder } = require('discord.js')
const deleteFile = promisify(fs.unlink)
const checkExists = promisify(fs.access)
const client = new Discord.Client({ intents: [] })
// require('discord-buttons')(client)
// const { MessageButton } = require('discord-buttons')

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

        const offlineEmbed = new EmbedBuilder()
            .setColor('#d53c3c')
            .setDescription('_Le serveur est hors-ligne_')
        return { embeds: [offlineEmbed] }
    } else {
        const { players } = serverStatus
        let description = `**${players?.length} joueurs actuellement connecté${players?.length > 1 ? 's' : ''}**:`
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
        const embed = new EmbedBuilder()
            .setColor('#F5865B')
            .setDescription(description)
            //     .setThumbnail('attachment://online-' + imgIndex + '.png')
            .setImage('attachment://online-' + imgIndex + '.png')
        cleanFile('./public/online-' + (imgIndex - 1) + '.png').then(rs => console.log(rs ? 'cleaned an old file' : 'no old file cleaned'))
        imgIndex++


        const buttons = []
        if (webStatusUrl) {
            console.log('Web status url:', webStatusUrl)
            buttons.push(
                new ButtonBuilder()
                    .setLabel('Voir le statut en ligne')
                    .setStyle('Link')
                    .setURL(webStatusUrl)
            )
        }
        if (webMapUrl) {
            console.log('Web map url:', webMapUrl)
            buttons.push(
                new ButtonBuilder()
                    .setLabel('Ouvrir la Carte')
                    .setStyle('Link')
                    .setURL(webMapUrl)
            )
        }
        return { embeds: [embed], buttons, files: [attachment] }
    }
}

const updateStatusMessage = async () => {
    const embed = await getStatusEmbed()
    try {
        await onlineChannel.bulkDelete(10)
        await onlineChannel.send(embed)
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
