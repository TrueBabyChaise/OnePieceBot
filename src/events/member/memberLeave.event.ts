import { BaseClient, BaseEvent } from '@src/structures';
import { GuildMember, Events } from 'discord.js';
import { User } from '@src/structures/class/user.class';
import { Guild } from '@src/structures/class/guild.class';

/**
 * @description Event for when a member leave a guild
 * @category Events
 * @extends BaseEvent
 */
export class MemberLeaveEvent extends BaseEvent {
	constructor() {
		super(Events.GuildMemberRemove);
  	}

	public async execute(client: BaseClient, member: GuildMember) {
		console.log(`Member ${member.user.tag} has leaved the guild ${member.guild.name}`);

		if (member.user.bot) { return; }
		if (!member.id || !member.user.tag) { return; }

		const user = await User.getUserById(member.id);
		if (user) {
			await User.deleteUser(member.id);
		}

		if (!member.guild) { return; }
		let guild = await Guild.getGuildById(member.guild.id);
		if (guild) {
			await guild.removeUserFromGuild(member.id);
		}
	}
}