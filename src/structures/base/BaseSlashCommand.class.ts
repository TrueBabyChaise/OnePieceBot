/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlashCommandBuilder, ApplicationCommandOptionType, APIApplicationCommandOptionChoice, Base } from "discord.js";
import { BaseClient, BaseInteraction } from "@src/structures";

export enum SlashCommandOptionType {
	USER = ApplicationCommandOptionType.User,
	CHANNEL = ApplicationCommandOptionType.Channel,
	ROLE = ApplicationCommandOptionType.Role,
	STRING = ApplicationCommandOptionType.String,
	INTEGER = ApplicationCommandOptionType.Integer,
	BOOLEAN = ApplicationCommandOptionType.Boolean
}
export interface SlashCommandOptions {
	name: string;
	description: string;
	required?: boolean;
	choices?: APIApplicationCommandOptionChoice<string | number>[];
	type: SlashCommandOptionType
}

/**
 * @description Base class for slash commands
 * @category BaseClass
 */
export abstract class BaseSlashCommand extends BaseInteraction {
	private slashCommand: SlashCommandBuilder;
	private dmAllowed: boolean;

	constructor(name: string, description: string, options?: SlashCommandOptions[], cooldown?: number, isEnabled?: boolean, permissions?: bigint[], dmAllowed?: boolean) {
		super(name, description, options, cooldown, isEnabled, permissions);
		const bitField = permissions?.reduce((a, b) => a | b, BigInt(0)) || BigInt(1);
		this.dmAllowed = dmAllowed || false;

		this.slashCommand = this.buildSlashCommand(dmAllowed || false, bitField, options || []);
	}

	private buildSlashCommand(dmAllowed: boolean, bitField: bigint, options: SlashCommandOptions[]): SlashCommandBuilder {
		let newSlashCommand = new SlashCommandBuilder()
			.setName(this.getName())
			.setDescription(this.getDescription())
			.setDMPermission(dmAllowed || false)
			.setDefaultMemberPermissions(bitField)
		for (const option of options || []) {
			if (!option.choices) {
				if (option.type == SlashCommandOptionType.STRING)
					newSlashCommand.addStringOption(opt => opt.setName(option.name).setDescription(option.description).setRequired(option.required || false));
				else if (option.type == SlashCommandOptionType.USER)
					newSlashCommand.addUserOption(opt => opt.setName(option.name).setDescription(option.description).setRequired(option.required || false));
				else if (option.type == SlashCommandOptionType.CHANNEL)
					newSlashCommand.addChannelOption(opt => opt.setName(option.name).setDescription(option.description).setRequired(option.required || false));
				else if (option.type == SlashCommandOptionType.INTEGER)
					newSlashCommand.addIntegerOption(opt => opt.setName(option.name).setDescription(option.description).setRequired(option.required || false));
				else if (option.type == SlashCommandOptionType.ROLE)
					newSlashCommand.addRoleOption(opt => opt.setName(option.name).setDescription(option.description).setRequired(option.required || false));
				else if (option.type == SlashCommandOptionType.BOOLEAN)
					newSlashCommand.addBooleanOption(opt => opt.setName(option.name).setDescription(option.description).setRequired(option.required || false));
			} else {
				if (option.type == SlashCommandOptionType.STRING) {
					for (const choice of option.choices)
						if (typeof choice.value != "string")
							throw new Error("Choices must be of type string or number!");
					newSlashCommand.addStringOption(opt => 
						opt.setName(option.name).
							setDescription(option.description).
							setRequired(option.required || false).
							setChoices(...option.choices as APIApplicationCommandOptionChoice<string>[]))
				} else if (option.type == SlashCommandOptionType.USER)
					throw new Error("User options cannot have choices!");
				else if (option.type == SlashCommandOptionType.CHANNEL)
					throw new Error("Channel options cannot have choices!");
				else if (option.type == SlashCommandOptionType.INTEGER) {
					for (const choice of option.choices)
						if (typeof choice.value != "number")
							throw new Error("Choices must be of type string or number!");
					newSlashCommand.addNumberOption(opt => 
						opt.setName(option.name).
							setDescription(option.description).
							setRequired(option.required || false).
							setChoices(...option.choices as APIApplicationCommandOptionChoice<number>[]))
				} else if (option.type == SlashCommandOptionType.ROLE)
					throw new Error("Role options cannot have choices!");
				else if (option.type == SlashCommandOptionType.BOOLEAN)
					throw new Error("Boolean options cannot have choices!");
			}
		}
		return newSlashCommand;
	}

	/**
	 * @description Returns the SlashCommandBuilder of the command
	 * @returns {SlashCommandBuilder}
	 *
	 */
	public getSlashCommand(): SlashCommandBuilder {
		return this.slashCommand;
	}

	/**
	 * @description Add Choices to the SlashCommandBuilder
	 * @param {APIApplicationCommandOptionChoice<string | number>[]} choices
	 * @returns {void}
	 */
	public addChoices(choices: APIApplicationCommandOptionChoice<string | number>[], optionName: string): void {
		if (this.slashCommand.options.length == 0) throw new Error("You cannot add choices to a command without options!");
		for (let option of this.options)
			if (option.name == optionName) {
				for (const choice of choices) {
					if (typeof choice.value != "string" && typeof choice.value != "number")
						throw new Error("Choices must be of type string or number!");
					if ((typeof choice.value == "number" && option.type != SlashCommandOptionType.INTEGER)
						|| (typeof choice.value == "string" && option.type != SlashCommandOptionType.STRING))
						throw new Error("Choices must fit the type of the option!");
					if (option.type== SlashCommandOptionType.STRING) {
						if (option.choices) option.choices.push(choice as APIApplicationCommandOptionChoice<string>);
						else option.choices = [choice as APIApplicationCommandOptionChoice<string>];
					}
					else if (option.type == SlashCommandOptionType.INTEGER) {
						if (option.choices) option.choices.push(choice as APIApplicationCommandOptionChoice<number>);
						else option.choices = [choice as APIApplicationCommandOptionChoice<number>];
					}
				}
		}
		this.slashCommand = this.buildSlashCommand(this.dmAllowed || false, this.getPermissionValue(), this.getOptions() || []);
	}

	/**
	 * @description Remove choices the SlashCommandBuilder
	 * @param {APIApplicationCommandOptionChoice<string | number>[]} choices
	 * @returns {void}
	 *
	 */
	public removeChoices(choices: APIApplicationCommandOptionChoice<string | number>[], optionName: string): void {
		if (this.slashCommand.options.length == 0) throw new Error("You cannot remove choices from a command without options!");
		for (let option of this.options)
			if (option.name == optionName) {
				for (const choice of choices) {
					if (typeof choice.value != "string" && typeof choice.value != "number")
						throw new Error("Choices must be of type string or number!");
					if ((typeof choice.value == "number" && option.type != SlashCommandOptionType.INTEGER)
						|| (typeof choice.value == "string" && option.type != SlashCommandOptionType.STRING))
						throw new Error("Choices must fit the type of the option!");
					if (option.type== SlashCommandOptionType.STRING) {
						if (option.choices) option.choices = option.choices.filter((c: APIApplicationCommandOptionChoice<string>) => c.name != choice.name);
					}
					else if (option.type == SlashCommandOptionType.INTEGER) {
						if (option.choices) option.choices = option.choices.filter((c: APIApplicationCommandOptionChoice<number>) => c.name != choice.name);
					}
				}
			}
		this.slashCommand = this.buildSlashCommand(this.dmAllowed || false, this.getPermissionValue(), this.getOptions() || []);
	}
						 

	
	public async updateSlashCommand(client: BaseClient): Promise<void> {
		this.slashCommand = this.buildSlashCommand(this.dmAllowed || false, this.getPermissionValue(), this.getOptions() || []);
		let restSlashCommands = await client.getBaseRest().get(
			`/applications/${client.getClientId()}/commands`,
		) as unknown as any[];

		if (restSlashCommands.length == 0) return;
		if (restSlashCommands.find((command: any) => command.name == this.getName())) {
			const command = restSlashCommands.find((command: any) => command.name == this.getName());
			await client.getBaseRest().patch(
				`/applications/${client.getClientId()}/commands/${command.id}`,
				{ body: this.getSlashCommand().toJSON() },
			);
		}
	}
			
	/**
	 * @description Update the SlashCommandBuilder before registering
	 * @param {SlashCommandBuilder} slashCommand
	 * @returns {void}
	 * @example
	 */
	public async beforeRegistered(client: BaseClient): Promise<void> {
		return;
	}

	/**
	 * @description Update the SlashCommandBuilder after registering
	 * @param {BaseClient} client
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns {Promise<void>}
	 */
	public async afterRegistered(client: BaseClient):  Promise<void> {
		return;
	}

}