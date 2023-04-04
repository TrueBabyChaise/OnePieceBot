import { Interaction, SlashCommandBuilder } from "discord.js";
import { BaseClient, BaseInteraction } from "@src/structures";

/**
 * @description Base class for slash commands
 * @category BaseClass
 */
export abstract class BaseSlashCommand extends BaseInteraction {
	private slashCommand: SlashCommandBuilder;

	constructor(name: string, description: string, options?: any, cooldown?: number, isEnabled?: boolean, permissions?: string[]) {
		super(name, description, options, cooldown, isEnabled, permissions);
		this.slashCommand = new SlashCommandBuilder()
			.setName(this.getName())
			.setDescription(this.getDescription())
	}

	/**
	 * @description Returns the SlashCommandBuilder of the command
	 * @returns {SlashCommandBuilder}
	 *
	 */
	public getSlashCommand(): SlashCommandBuilder {
		return this.slashCommand;
	}
}