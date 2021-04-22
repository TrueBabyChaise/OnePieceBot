const BaseCommand = require('../../utils/structures/BaseCommand');
const {Client, Message} = require("discord.js");

module.exports = class PingPongCommand extends BaseCommand {
  constructor() {
    super('ping', 'testing', ['pg', 'pong', 'Ping', 'Pong']);
  }

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array} args
   */
  async run(client, message, args) {
    if (message.content.slice(client.prefix.length).toLowerCase() == 'ping')
        message.channel.send('Pong');
    else 
        message.channel.send('Ping');
  }
}