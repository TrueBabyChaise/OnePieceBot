import { Message } from 'discord.js';
import { BaseEvent, BaseClient  } from "@src/baseClass";

/**
 * @description MessageEdited event
 * @class MessageEditedEvent
 * @extends BaseEvent
 * @method execute - Executes the event
 */
export class MessageEditedEvent extends BaseEvent {
	constructor() {
		super('messageUpdate', false);
	}

	/**
	 * @description Executes the event
	 * @param {BaseClient} client
	 * @param {Message} message
	 * @param {string[]} args
	 * @returns {Promise<void>}
	 */
	async execute(client: BaseClient, message: Message, ...args: string[]): Promise<void> {
		if (message.author && message.author.bot) return;

		if (!message.author) {
			console.log(`Message edited: ${message.content}, new content: ${args[0]}`);
		} else
			console.log(`Message edited: ${message.content}, new content: ${args[0]} by ${message.author.tag}`);
	}
}
