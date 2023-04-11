import { BaseSlashCommand, BaseClient } from "@src/structures";
import { ChatInputCommandInteraction, PermissionFlagsBits} from "discord.js";
import { SlashCommandOptions } from "@src/structures/base/BaseSlashCommand.class";

/**
 * @description Ban slash command
 * @class Ban
 * @extends BaseSlashCommand
 */
export class BanSlashCommand extends BaseSlashCommand {
	constructor() {
		super('ban', 'Ban a member', [
			{
				name: 'Target',
				description: 'The member to ban',
				required: true,
			},
		], 
		0, true, [PermissionFlagsBits.ModerateMembers]);
	}

	/**
	 * @description Executes the slash command
	 * @param {BaseClient} client
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns {Promise<void>}
	 */
	async execute(client: BaseClient, interaction: ChatInputCommandInteraction): Promise<void> {
		console.log(interaction.options);
		await interaction.reply('Ban!');
	}
}
