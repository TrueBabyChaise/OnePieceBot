import { Message } from "discord.js";
import { BaseEvent, BaseClient  } from "@src/baseClass";

/**
 * @description MessageDeleted event
 * @class MessageDeletedEvent
 * @extends BaseEvent
 * @method execute - Executes the event
 */
export class MessageDeletedEvent extends BaseEvent {
	constructor() {
		super('messageDelete', false);
	}

	/**
	 * @description Executes the event
	 * @param {BaseClient} client
	 * @param {Message} message
	 * @param {string[]} args
	 */
	async execute(client: BaseClient, message: Message, ...args: string[]): Promise<void> {

		if (message.author && message.author.bot) return;
		
		if (!message.author) {
			console.log(`Message deleted: ${message.content}`);
		} else
			console.log(`Message deleted: ${message.content} by ${message.author.tag}`);
	}
}