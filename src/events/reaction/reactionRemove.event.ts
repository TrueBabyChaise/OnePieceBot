import { BaseClient, BaseEvent } from '@src/structures';
import { MessageReaction, User, Events } from 'discord.js';
import { ReactionRoleAdding } from '@src/structures/utils/reactionRole.class';

export class MessageReactionAddEvent extends BaseEvent {

	constructor() {
		super(Events.MessageReactionRemove);
	}

	public async execute(client: BaseClient, reaction: MessageReaction, user: User) {
		if (user.bot || user.id === client.user?.id) return;	
		await ReactionRoleAdding.getInstance().removeRole(reaction, user);
	}
}