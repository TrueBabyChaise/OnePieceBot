import { BaseEvent, BaseClient  } from "@src/structures";
import { ActivitiesOptions, ActivityType, Events } from "discord.js";
import { Guild as GuildDB } from "@src/structures/class/guild.class";
import { User as UserDB } from "@src/structures/class/user.class";

/**
 * @description Ready event
 * @class ReadyEvent
 * @extends BaseEvent
 * @method execute - Executes the event
 */
export class ReadyEvent extends BaseEvent {
	constructor() {
		super(Events.ClientReady, false);
	}

	/**
	 * @description Executes the event
	 * @param {BaseClient} client
	 */
	async execute(client: BaseClient): Promise<void> {
		console.log(`Logged in as ${client.user?.tag}`);

		var statusIndex = 0;
		setInterval(() => {
			const status = ['NeedName v0.1', `Developped by Serena Satella`, `NeedName Beta`]; // You can change the status here
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
				console.log(`Working on: ${guild.name} with ${guild.memberCount} members`);

				if (!parseInt(guild.id) || !guild.name) { return; }
				let guildDB = await GuildDB.getGuildById(parseInt(guild.id));
				if (!guildDB) {
					console.log(`Guild ${guild.name} not found in database, creating it`);
					guildDB = await GuildDB.createGuild(parseInt(guild.id), guild.name);
					if (!guildDB) { return console.log(`Guild ${guild.name} couldn't be created`); }
					console.log(`Guild ${guild.name} created`);
					const guildMembers = await guild.members.fetch();
					const idAlreadyAdded = await guildDB.getUsers();
					for (const member of guildMembers) {
						if (member[1].user.bot) { continue; }
						if (idAlreadyAdded.find((userId) => userId === parseInt(member[1].id))) { continue; }
						let userDB = await UserDB.getUserById(parseInt(member[1].id));
						if (!userDB) {
							console.log(`User ${member[1].user.tag} not found in database, creating it`);
							userDB = await UserDB.createUser(parseInt(member[1].id), member[1].user.tag);
							if (!userDB) { console.log(`User ${member[1].user.tag} couldn't be created`); continue; }
							console.log(`User ${member[1].user.tag} created`);
						}
						await guildDB.addUserToGuild(parseInt(member[1].id));
					}
				}
			});
			// DB stuff here
		});
	}
}