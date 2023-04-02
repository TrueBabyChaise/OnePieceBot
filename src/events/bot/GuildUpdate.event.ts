import { Guild } from "discord.js";
import { BaseEvent, BaseClient } from "@src/baseClass";

export default class GuildUpdateEvent extends BaseEvent {
	constructor() {
		super('guildUpdate', false);
	}
	
	/**
	 * @description Executes the event
	 * @param {BaseClient} client
	 * @param {Guild} oldGuild
	 * @param {Guild} newGuild
	 * @returns {Promise<void>}
	 * @override
	 * @memberof GuildUpdateEvent
	 */
	async execute(client: BaseClient, oldGuild: Guild, newGuild: Guild): Promise<void> {
		console.log(`Guild updated: ${oldGuild.name} to ${newGuild.name}`);

		// DB stuff here
	}
}
		