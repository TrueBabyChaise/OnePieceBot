import { BaseClient, BaseEvent } from '@src/structures';
import { GuildMember, Events } from 'discord.js';
import { User } from '@src/structures/class/user.class';
import { Guild } from '@src/structures/class/guild.class';

/**
 * @description Event for when a member joins a guild
 * @category Events
 * @extends BaseEvent
 */
export class MemberJoinEvent extends BaseEvent {
	constructor() {
		super(Events.GuildMemberAdd);
  	}

	public async execute(client: BaseClient, member: GuildMember) {
		console.log(`Member ${member.user.tag} has joined the guild ${member.guild.name}`);

		if (member.user.bot) { return; }
		if (!member.id || !member.user.tag) { return; }

		const user = await User.getUserById(member.id);
		if (!user) {
			await User.createUser(member.id, member.user.tag);
		}

		if (!member.guild) { return; }
		let guild = await Guild.getGuildById(member.guild.id);
		if (!guild) {
			guild = await Guild.createGuild(member.id, member.guild.name);
		}
		if (!guild) { return; }
		await guild.addUserToGuild(member.id);
	}
}