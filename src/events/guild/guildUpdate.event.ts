import { Guild, Events } from "discord.js";
import { BaseEvent, BaseClient } from "@src/structures";

/**
 * @description GuildUpdate event
 * @class GuildUpdateEvent
 * @extends BaseEvent
 * @method execute - Executes the event
 */
export class GuildUpdateEvent extends BaseEvent {
	constructor() {
		super(Events.GuildUpdate, false);
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
		