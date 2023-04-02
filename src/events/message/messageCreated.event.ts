import { Client, Message } from 'discord.js';
import { BaseEvent, BaseClient  } from "@src/baseClass";

export default class MessageCreatedEvent extends BaseEvent {
	constructor() {
		super('messageCreate', false);
	}

	async execute(client: BaseClient, message: Message) {
		
		// SKIP IF AUTHOR IS BOT
		if (message.author.bot) return;

		// SKIP IF MESSAGE DOES NOT START WITH PREFIX
		if (message.content.startsWith(client.getPrefix())) {
			console.log(message.content);
			const [commandName, ...args] = message.content.slice(client.getPrefix().length).trim().split(/ +/g);
			for (const module of client.getModules().values()) {
				if (!module.getCommands().has(commandName)) continue;
				if (!module.isEnabled() || !module.getCommands().get(commandName)!.isEnabled()) continue;
				const command = module.getCommands().get(commandName);
				if (command) {
					try {
						console.log(`Command ${commandName} executed by ${message.author.tag}`);
						await command.execute(client, message, args);
					} catch (error) {
						console.error(error);
						message.reply('Call the developer, something went wrong!');
					}
				}
			}
		}
	}
}