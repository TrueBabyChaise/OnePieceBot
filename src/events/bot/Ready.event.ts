import { BaseEvent, BaseClient  } from "@src/structures";
import { ActivitiesOptions, ActivityType } from "discord.js";

/**
 * @description Ready event
 * @class ReadyEvent
 * @extends BaseEvent
 * @method execute - Executes the event
 */
export class ReadyEvent extends BaseEvent {
	constructor() {
		super('ready', false);
	}

	/**
	 * @description Executes the event
	 * @param {BaseClient} client
	 */
	async execute(client: BaseClient): Promise<void> {
		console.log(`Logged in as ${client.user?.tag}`);

		var statusIndex = 0;
		setInterval(() => {
			const status = ['NeedName v0.1', `Developed by Serena Satella`, `NeedName Beta`]; // You can change the status here
			const activity = { 
				type: ActivityType.Streaming, 
				name: status[statusIndex],
			} as ActivitiesOptions;
			client.user?.setPresence({
				activities: [activity],
				status: 'online'
			})
			if (statusIndex < status.length - 1) statusIndex++; else statusIndex = 0;
		}, 10000);

		(await client.guilds.fetch()).forEach(clientGuild => {
			clientGuild.fetch().then(async guild => {
				console.log(`Joined guild: ${guild.name} with ${guild.memberCount} members`);
			});
			// DB stuff here
		});
	}
}