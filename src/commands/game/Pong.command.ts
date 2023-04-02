import { Message } from 'discord.js';
import { BaseCommand, BaseClient } from "@src/baseClass";

/**
 * @description Pong command
 * @class Pong
 * @extends BaseCommand
 * @method execute - Executes the command
 */
export class PongCommand extends BaseCommand {
	constructor() {
		super('pong', ['ping'], 'Ping! Pong!', 'Test', 0, true, []);
	}

	/**
	 * @description Executes the command
	 * @param {BaseClient} client
	 * @param {Message} message
	 * @param {string[]} args
	 */
	async execute(client: BaseClient, message: Message, args: string[]): Promise<void> {

		if (args.length == 0) {
			message.channel.send('Ping!');
			return;
		}
	
		if (message.content.includes('ping')) {
			message.channel.send('Pong!');
		} else {
			message.channel.send('Ping!');
		}
	}
}