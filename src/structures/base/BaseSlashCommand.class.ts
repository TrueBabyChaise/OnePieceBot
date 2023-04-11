import { Interaction, SlashCommandBuilder } from "discord.js";
import { BaseClient, BaseInteraction } from "@src/structures";

export interface SlashCommandOptions {
	name: string;
	description: string;
	required?: boolean;
}

/**
 * @description Base class for slash commands
 * @category BaseClass
 */
export abstract class BaseSlashCommand extends BaseInteraction {
	private slashCommand: SlashCommandBuilder;

	constructor(name: string, description: string, options?: SlashCommandOptions[], cooldown?: number, isEnabled?: boolean, permissions?: bigint[], dmAllowed?: boolean) {
		super(name, description, options, cooldown, isEnabled, permissions);
		const bitField = permissions?.reduce((a, b) => a | b, BigInt(0)) || BigInt(0);
		this.slashCommand = new SlashCommandBuilder()
			.setName(this.getName())
			.setDescription(this.getDescription())
			.setDMPermission(dmAllowed || false)
			.setDefaultMemberPermissions(bitField)
	}

	/**
	 * @description Returns the SlashCommandBuilder of the command
	 * @returns {SlashCommandBuilder}
	 *
	 */
	public getSlashCommand(): SlashCommandBuilder {
		return this.slashCommand;
	}

	private getBiftField(permissions: bigint[]): bigint {
		let bitField = BigInt(0);
		permissions.forEach(permission => {
			bitField |= permission;
		});
		return bitField;
	}
}