const ServerStatus = require('../minecraft/ServerStatus')
const { token, prefix, onlineChannel } = require('./config')
const Discord = require('discord.js');
const bot = require('bot-commander');
const client = new Discord.Client();
require('discord-buttons')(client)

const serverStatus = ServerStatus.getInstance()
const getStatusEmbed = () => {
  if (!serverStatus.online) {

  }
  new Discord.MessageEmbed()
    .setColor('#40cbbe')
    .setDescription('')
}

const activeMessages = []
const addStatusMessage = (channel) => {

}

bot.prefix(prefix)
bot
  .command('online')
  .description('Creates an online player display slot')
  .action(message => {
    if (message.channel.name === onlineChannel) {
      message.reply('hey')
    }
  })

module.exports = async () => {
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('message', message => {
    bot.parse(message.content, message)
  });

  await client.login(token);

}
