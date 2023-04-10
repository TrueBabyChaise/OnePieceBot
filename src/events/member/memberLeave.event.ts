import { BaseClient, BaseEvent } from '@src/structures';
import { GuildMember, Events } from 'discord.js';
import { UserHandler } from '@src/structures/database/handler/user.handler.class';
import { GuildHandler } from '@src/structures/database/handler/guild.handler.class';

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

		const user = await UserHandler.getUserById(member.id);
		if (user) {
			await UserHandler.deleteUser(member.id);
		}

		if (!member.guild) { return; }
		let guild = await GuildHandler.getGuildById(member.guild.id);
		if (guild) {
			await guild.removeUserFromGuild(member.id);
		}
	}
}