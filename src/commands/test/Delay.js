const BaseCommand = require('../../utils/structures/BaseCommand');
const {Client, Message} = require("discord.js");

module.exports = class DelayCommand extends BaseCommand {
  constructor() {
    super('delay', 'testing', []);
  }

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array} args
   */
  async run(client, message, args) {
    if (args.length == 0)
        setTimeout(function(){ message.channel.send("&hourly"); }, 3000);
    else
        setTimeout(function(){ message.channel.send("&daily") }, 2000);
  }
}