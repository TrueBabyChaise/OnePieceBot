import { BaseClient, BaseEvent } from '@src/structures';
import { GuildMember, Events } from 'discord.js';

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
	}
}