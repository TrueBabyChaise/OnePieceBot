import { Guild, Events } from "discord.js";
import { BaseEvent, BaseClient } from "@src/structures";
import { Guild as GuildDB } from "@src/structures/class/guild.class";
import { User as UserDB } from "@src/structures/class/user.class";


/**
 * @description GuildCreate event
 * @class GuildCreateEvent
 * @extends BaseEvent
 * @method execute - Executes the event
 */
export class GuildCreateEvent extends BaseEvent {
	constructor() {
		super(Events.GuildCreate, false);
	}

	/**
	 * @description Executes the event
	 * @param {BaseClient} client
	 * @param {Guild} guild
	 * @param {string[]} args
	 * @returns {Promise<void>}
	 */
	async execute(client: BaseClient, guild: Guild): Promise<void> {
		console.log(`Joined guild: ${guild.name} with ${guild.memberCount} member=s`);

		if (!guild.id || !guild.name) { return; }

		const guildDB = await GuildDB.getGuildById(guild.id);
		if (!guildDB) {
			console.log(`Guild ${guild.name} not found in database, creating it`);
			await GuildDB.createGuild(guild.id , guild.name);
			console.log(`Guild ${guild.name} created`);
		}

		if (!guildDB) { return; }
		const guildMembers = await guild.members.fetch();
		const idAlreadyAdded = await guildDB.getUsers();
		for (const member of guildMembers) {
			if (member[1].user.bot) { continue; }
			const userDB = await UserDB.getUserById(member[1].id);
			if (!userDB) {
				console.log(`User ${member[1].user.tag} not found in database, creating it`);
				await UserDB.createUser(member[1].id, member[1].user.tag);
				if (!userDB) { console.log(`User ${member[1].user.tag} couldn't be created`); continue; }
				console.log(`User ${member[1].user.tag} created`);
			}
			if (idAlreadyAdded.find((userId) => userId === member[1].id)) { continue; }
			await guildDB.addUserToGuild(member[1].id);
		}
	}
}