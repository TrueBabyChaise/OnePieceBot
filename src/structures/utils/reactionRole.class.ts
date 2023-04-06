import { MessageReaction, User } from "discord.js";


export class ReactionRoleAdding {

	private static instance: ReactionRoleAdding = new ReactionRoleAdding();
	private roleMatch: Map<string, string> = new Map<string, string>();

	constructor() {
		if (ReactionRoleAdding.instance) {
			throw new Error('Error: Instantiation failed: Use ReactionRoleAdding.getInstance() instead of new.');
		}
		ReactionRoleAdding.instance = this;
		// LOAD ROLES HERE WITH DB
		this.roleMatch.set('👍', 'Test');
	}

	public static getInstance(): ReactionRoleAdding {
		return ReactionRoleAdding.instance;
	}


	async addRole(reaction: MessageReaction, user: User) {
		if (reaction.message.partial) {
			await reaction.message.fetch();
		}
		let { id } = reaction.message;
		try {
			if (!reaction.emoji.name) return;
			if (this.roleMatch.has(reaction.emoji.name)) {
				this.addMemberRole(reaction, user);
			}
		} catch (error) {
			console.error('Something went wrong when adding a role: ', error);
		}
	}

 	async addMemberRole(reaction: MessageReaction, user: User) {
		const member = reaction.message.guild?.members.cache.get(user.id);
		console.log(member);
		if (member) {
			const role = reaction.message.guild?.roles.cache.find(role => role.name === this.roleMatch.get(reaction.emoji.name!));
			if (role && !member.roles.cache.has(role.id)) {
				await member.roles.add(role);
			}
		}
	}

	async removeRole(reaction: MessageReaction, user: User) {
		if (reaction.message.partial) {
			await reaction.message.fetch();
		}
		let { id } = reaction.message;
		try {
			if (!reaction.emoji.name) return;
			if (this.roleMatch.has(reaction.emoji.name)) {
				this.removeMemberRole(reaction, user);
			}
		} catch (error) {
			console.error('Something went wrong when adding a role: ', error);
		}
	}

	async removeMemberRole(reaction: MessageReaction, user: User) {
		const member = reaction.message.guild?.members.cache.get(user.id);
		if (member) {
			const role = reaction.message.guild?.roles.cache.find(role => role.name === this.roleMatch.get(reaction.emoji.name!));
			if (role && member.roles.cache.has(role.id)) {
				await member.roles.remove(role);
			}
		}
	}
	
}

