import { Message } from 'discord.js';
import { BaseClient } from './BaseClient.class';


/**
 * @description Base class for commands
 * @category BaseClass
 */
export abstract class BaseCommand {
	private name: string;
	private aliases: string[];
	private enabled: boolean;
	private module: string = '';
	private description: string;
	private usage: string;
	private cooldown: number;
	private permissions: string[];

	constructor(name: string, aliases: string[], description?: string, usage?: string, cooldown?: number,isEnabled?: boolean, permissions?: string[]) {
		this.name = name;
		this.aliases = aliases;
		this.enabled = isEnabled || true;
		this.description = description || '';
		this.usage = usage || '';
		this.cooldown = cooldown || 0;
		this.permissions = permissions || [];
	}

	/**
	 * @description Returns the name of the command
	 * @returns {string}
	 * @example
	 * // returns 'command'
	 * command.getName();
	 */
	public getName(): string {
		return this.name;
	}

	/**
	 * @description Returns the aliases of the command
	 * @returns {string[]}
	 * @example
	 * // returns ['alias1', 'alias2']
	 * command.getAliases();
	 */
	public getAliases(): string[] {
		return this.aliases;
	}

	/**
	 * @description Returns the active status of the command
	 * @returns {boolean}
	 * @example
	 * // returns true
	 * command.isEnabled();
	 */
	public isEnabled(): boolean {
		return this.enabled;
	}


	/**
	 * @description Executes the command
	 * @param {Message} message
	 * @param {string[]} args
	 * @example
	 * // executes the command
	 * command.execute(message, args);
	 */
	async execute(client: BaseClient, message: Message, args: string[]): Promise<void> {
		throw new Error(`Command ${this.name} doesn't provide an execute method!`);
	}

}