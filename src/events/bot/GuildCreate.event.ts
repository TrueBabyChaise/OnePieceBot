import { Guild } from "discord.js";
import { BaseEvent, BaseClient } from "@src/baseClass";


export default class GuildCreateEvent extends BaseEvent {
	constructor() {
		super('guildCreate', false);
	}

	/**
	 * @description Executes the event
	 * @param {BaseClient} client
	 * @param {Guild} guild
	 * @param {string[]} args
	 * @returns {Promise<void>}
	 */
	async execute(client: BaseClient, guild: Guild): Promise<void> {
		console.log(`Joined guild: ${guild.name} with ${guild.memberCount} members`);

		// DB stuff here
	}
}