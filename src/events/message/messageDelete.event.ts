import { Message, Events } from "discord.js";
import { BaseEvent, BaseClient  } from "@src/structures";
import { Logger, LoggerEnum } from "@src/structures/logger/logger.class";

/**
 * @description MessageDeleted event
 * @class MessageDeletedEvent
 * @extends BaseEvent
 * @method execute - Executes the event
 */
export class MessageDeletedEvent extends BaseEvent {
	constructor() {
		super(Events.MessageDelete, false);
	}

	/**
	 * @description Executes the event
	 * @param {BaseClient} client
	 * @param {Message} message
	 */
	async execute(client: BaseClient, message: Message): Promise<void> {

		if (message.author && message.author.bot) return;
		
		if (!message.author) {
			Logger.logToFile(`Message deleted: ${message.content}`, LoggerEnum.USER);
			console.log(`Message deleted: ${message.content}`);
		} else
			Logger.logToFile(`Message deleted: ${message.content} by ${message.author.tag}`, LoggerEnum.USER);
			console.log(`Message deleted: ${message.content} by ${message.author.tag}`);
	}
}