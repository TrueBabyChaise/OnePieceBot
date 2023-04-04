import { Interaction, SlashCommandBuilder } from "discord.js";
import { BaseClient } from "@src/structures";

/**
 * @description Base class for slash commands
 * @category BaseClass
 */
export abstract class BaseInteraction  {
	private name: string;
	private description: string;
	private options: any;
	private enabled: boolean;
	private cooldown: number;
	private permissions: string[];
	private module: string = '';

	constructor(name: string, description: string, options?: any, cooldown?: number, isEnabled?: boolean, permissions?: string[]) {
		this.name = name;
		this.description = description;
		this.options = options || [];
		this.enabled = isEnabled || true;
		this.cooldown = cooldown || 0;
		this.permissions = permissions || [];
	}

	/**
	 * @description Returns the name of the command
	 * @returns {string}
	 * @example
	 * // returns 'command'
	 * command.getName();
	 * @category Getter
	 */
	public getName(): string {
		return this.name;
	}

	/**
	 * @description Returns the description of the command
	 * @returns {string}
	 * @example
	 * // returns 'command'
	 * command.getDescription();
	 * @category Getter
	 */
	public getDescription(): string {
		return this.description;
	}

	/**
	 * @description Returns JSON data for the command
	 * @returns {Object}
	 */
	public getJSON(): Object {
		return {
			name: this.name,
			description: this.description,
			options: this.options,
		};
	}

	/**
	 * @description Executes the command
	 * @param {BaseClient} client
	 * @param {Interaction} interaction
	 */
	public execute(client: BaseClient, interaction: Interaction): Promise<void> {
		throw new Error(`Command ${this.name} doesn't have an execute method!`);
	}
}