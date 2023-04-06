import { BaseClient, BaseEvent } from '@src/structures';
import { GuildMember, Events } from 'discord.js';

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
	}
}