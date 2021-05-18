const BaseCommand = require('../../utils/structures/BaseCommand');

const playEnum = { "0":"Paper", "1":"Rock", "2":"Scissor"}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

module.exports = class RockPaperScissorCommand extends BaseCommand {
    constructor() {
        super('rps', 'RockPaperScissor', []);
  }

    async run(client, message, args) {
        if (args.length != 1) {
            message.channel.send("Example : +rps Scissor")
            return;
        }
        let playerPlay = args[0].toLowerCase()
        if (playerPlay != "paper" && playerPlay != "scissor" && playerPlay != "rock") {
            message.channel.send("Example : +rps Scissor")
            return;
        }
        let botPlay = getRndInteger(0, 2)
        message.channel.send(playEnum[botPlay.toString()])
        if (playerPlay == playEnum[botPlay.toString()].toLowerCase())
            message.channel.send("What a waste of time !");
        else if ((playerPlay == "paper" && botPlay == 2)
                || (playerPlay == "rock" && botPlay == 0)
                || (playerPlay == "scissor" && botPlay == 1))
            message.channel.send("I WON !");
        else
            message.channel.send("I lost... !")
    }
}
