const BaseCommand = require('../../utils/structures/BaseCommand');
const {Client, Message} = require("discord.js");

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function printHelp(message) {
    message.channel.send('Dice: [diceFace] [diceCount]\n\
        diceFace doit être supérieur à 0\n\
        diceCount doit être supérieur à 0');
}

module.exports = class DiceRandomCommand extends BaseCommand {
  constructor() {
    super('dice', 'random', ['d']);
  }

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array} args
   */
  async run(client, message, args) {
    for (let i = 0; i < args.length; i++)
        if (isNaN(args[i])) {
            printHelp(message)
            return;
        }
    var tmp = ""
    var max = args.length > 0 ? args[0] : 6;
    var count = args.length > 1 ? args[1] : 1;
    for (let i = 0; i < count; i++) {
            tmp += getRndInteger(1, max).toString();
            tmp += i == count ? "" : " ";
    }
    message.channel.send('You rolled : ' + tmp);
  }
}