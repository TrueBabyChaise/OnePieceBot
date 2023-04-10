import { BaseEvent, BaseClient  } from "@src/structures";
import { ActivitiesOptions, ActivityType, Events, Guild, TextChannel } from "discord.js";
import { Guild as GuildDB } from "@src/structures/class/guild.class";
import { User as UserDB } from "@src/structures/class/user.class";
import { TicketDB } from "@src/structures/class/ticket.class";
import { TicketManager } from "@src/structures/utils/ticketManager.class";

/**TicketDB
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
		await this.loadingGuilds(client);
	}

	async loadingGuilds(client: BaseClient): Promise<void> {
		(await client.guilds.fetch()).forEach(clientGuild => {
			clientGuild.fetch().then(async guild => {
				console.log(`Working on: ${guild.name} with ${guild.memberCount} members`);
				if (!parseInt(guild.id) || !guild.name) { return; }
				let guildDB = await GuildDB.getGuildById(guild.id);
				if (!guildDB) {
					console.log(`Guild ${guild.name} not found in database, creating it`);
					guildDB = await GuildDB.createGuild(guild.id, guild.name);
					if (!guildDB) { return console.log(`Guild ${guild.name} couldn't be created`); }
					console.log(`Guild ${guild.name} created`);
				}
				await this.loadingUsers(guild, guildDB);
				await this.loadingTickets(guild, guildDB);
			});
		})
	}

	async loadingUsers(guild: Guild, guildDB: GuildDB): Promise<void> {
		const guildMembers = await guild.members.fetch();
		const idAlreadyAdded = await guildDB.getUsers();
		for (const member of guildMembers) {
			if (member[1].user.bot) { continue; }
			if (idAlreadyAdded.find((userId) => userId === member[1].id)) { continue; }
			let userDB = await UserDB.getUserById(member[1].id);
			if (!userDB) {
				userDB = await UserDB.createUser(member[1].id, member[1].user.tag);
				if (!userDB) { console.log(`User ${member[1].user.tag} couldn't be created`); continue; }
			}
			await guildDB.addUserToGuild(member[1].id);
		}
	}

	async loadingTickets(guild: Guild, guildDB: GuildDB): Promise<void> {
		console.log(`Loading tickets for guild ${guild.name}, '${guild.id}'`);
		TicketDB.getTicketOfGuild(guildDB.id).then(async tickets => {
			if (!tickets) { return; }
			for (const ticketId of tickets) {
				const ticket = await TicketDB.getTicketById(ticketId);
				if (!ticket) { continue; }
				let channel;
				try {
					channel = await guild.channels.fetch(ticket.id.toString());
				} catch (e) {
					console.log(`Ticket ${ticket.id} deleted`);
					await TicketDB.deleteTicket(ticket.id);
					continue;
				}
				if (!channel || !channel.isTextBased()) { continue; }
				TicketManager.getInstance().createTicketFromDB(channel as TextChannel, ticket.owner, ticket.permissions)
				console.log(`Ticket ${ticket.id} loaded`);
			}
		});
	}
}