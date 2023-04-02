import BaseCommand from '@src/baseClass/BaseCommand.class';
import fs from 'fs';

export default class BaseModule {
	private name: string;
	private aliases: Map<string, BaseCommand> = new Map();
	private enabled: boolean;
	private commands: Map<string, BaseCommand> = new Map();

	constructor(name: string, isEnabled?: boolean) {
		this.name = name;
		this.enabled = isEnabled || true;
	}

	/**
	 * @description Returns the name of the module
	 * @returns {string}
	 */
	public getName(): string {
		return this.name;
	}
		
	/**
	 * @description Returns the active status of the module
	 * @returns {boolean}
	 * @example
	 * // returns true
	 * module.isEnabled();
	 */
	public isEnabled(): boolean {
		return this.enabled;
	}

	/**
	 * @description Sets the isEnabled status of the module
	 * @param {boolean} isEnabled
	 * @example
	 * // sets the isEnabled status to false
	 * module.setActive(false);
	 */
	public setisEnabled(isEnabled: boolean): void {
		this.enabled = isEnabled;
	}

	/**
	 * @description Returns the commands of the module
	 * @returns {Map<string, BaseCommand>}
	 * @example
	 * // returns Map(1) { 'ping' => [Function: Ping] }
	 * module.getCommands();
	 * @example
	 * // returns [Function: Ping]
	 * module.getCommands().get('ping');
	 * @example
	 */
	public getCommands(): Map<string, BaseCommand> {
		return this.commands;
	}

	/**
	 * @description Loads commands into the module
	 * @param {string} path
	 * @example
	 * // loads commands from src\commands\ping
	 * module.loadCommands('src/commands/ping');
	 * @example
	 */
	async loadCommands(path: string) {
		let commandFiles = await require('fs').promises.readdir(path);
		for (const file of commandFiles) {
			const lstat = await require('fs').promises.lstat(`${path}/${file}`);
			if (lstat.isDirectory()) {
				this.loadCommands(`${path}/${file}`);
				continue;
			}
			if (!file.endsWith('command.ts')) continue;
			const Command = (await import(`${path}/${file}`)).default;
			const command = new Command();
			console.log(`Loading command ${command.name}`);
			this.commands.set(command.name, command);
			if (!command.aliases) continue;
			for (const alias of command.aliases) {
				this.aliases.set(alias, command);
			}
			
		}
	}

	/**
	 * @description Execute the command
	 * @param {string} commandName Command name
	 * @param {Client} client Discord Client
	 * @param {Message} message Discord Message
	 * @param {string[]} args Command arguments
	 * @example
	 * // runs the ping command
	 * module.runCommand('ping', client, message, args);
	 * @example
	 * // runs the ping command with the argument 'test'
	 * module.runCommand('ping', client, message, ['test']);
	 */
	public executeCommand(commandName: string, client: any, message: any, args: string[]): void {
		const command = this.commands.get(commandName) || this.aliases.get(commandName);
		if (!command) return;
		try {
			command.execute(client, message, args);
		} catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
		}
	}
}