import { Message,Events } from "discord.js";
import { BaseEvent, BaseClient  } from "@src/structures";
import { Logger, LoggerEnum } from "@src/structures/logger/logger.class";
/**
 * @description MessageEdited event
 * @class MessageEditedEvent
 * @extends BaseEvent
 * @method execute - Executes the event
 */
export class MessageEditedEvent extends BaseEvent {
	constructor() {
		super(Events.MessageUpdate, false);
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
			Logger.logToFile(`Message edited: ${message.content}, new content: ${args[0]}`, LoggerEnum.USER);
		} else
			Logger.logToFile(`Message edited: ${message.content}, new content: ${args[0]} by ${message.author.tag}`, LoggerEnum.USER);
	}
}
