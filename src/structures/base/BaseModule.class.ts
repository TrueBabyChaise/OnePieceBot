import { BaseCommand, BaseInteraction, BaseClient, BaseSlashCommand } from '@src/structures';

/**
 * @description Base class for modules
 * @category BaseClass
 */
export abstract class BaseModule {
	private name: string;
	private interactions: Map<string, BaseInteraction> = new Map();
	private aliases: Map<string, BaseCommand> = new Map();
	private enabled: boolean;
	// May need to change this to a Collection<string, BaseCommand> if we want to add more properties to the commands same goes the aliases
	// private commands: Collection<string, BaseCommand> = new Collection();
	private commands: Map<string, BaseCommand> = new Map(); 

	/**
	 * @description Creates a new module
	 * @param name 
	 * @param isEnabled 
	 */
	constructor(name: string, isEnabled?: boolean) {
		this.name = name;
		this.enabled = isEnabled || true;
	}

	/**
	 * @description Return interactions of the module
	 * @returns {Map<string, BaseInteraction>}
	 * @example
	 * // returns Map(1) { 'ping' => [Function: Ping] }
	 * module.getInteractions();
	 */
	public getInteractions(): Map<string, BaseInteraction> {
		return this.interactions;
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
	 */
	public getCommands(): Map<string, BaseCommand> {
		return this.commands;
	}
	
	/**
	 * @description Checks if the module has a command
	 * @param {string} name
	 * @returns {boolean}
	 * @example
	 * // returns true
	 * module.hasCommand('ping');
	 */
	public hasCommand(name: string): boolean {
		return this.commands.has(name) || this.aliases.has(name);
	}

	/**
	 * @description Returns a command from the module
	 * @param {string} name
	 * @returns {BaseCommand | undefined}
	 * @example
	 * // returns [Function: Ping]
	 * module.getCommand('ping');
	 */
	public getCommand(name: string): BaseCommand | undefined {
		if (this.commands.has(name)) return this.commands.get(name);
		if (this.aliases.has(name)) return this.aliases.get(name);
		return undefined;
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
			const Command = (await import(`${path}/${file}`));
			for (const kVal in Object.keys(Command)) {
				const value = Object.values(Command)[kVal];
				try {
					const command = new (value as any)();
					this.commands.set(command.name, command);
					if (!command.aliases) continue;
					for (const alias of command.aliases) {
						this.aliases.set(alias, command);
					}
				} catch (error) {
					console.error(error);
					console.log(`Could not load command ${path}/${file}`);
				}
			};
		}
	}

	/**
	 * @description Loads slash commands into the module
	 * @param {string} path
	 * @param path 
	 */
	async loadSlashCommands(path: string): Promise<void> {
		let commandFiles = await require('fs').promises.readdir(path);
		for (const file of commandFiles) {
			const lstat = await require('fs').promises.lstat(`${path}/${file}`);
			if (lstat.isDirectory()) {
				await this.loadSlashCommands(`${path}/${file}`);
				continue;
			}
			if (!file.endsWith('interaction.ts')) continue;
			const Interaction = (await import(`${path}/${file}`));
			for (const kVal in Object.keys(Interaction)) {
				const value = Object.values(Interaction)[kVal];
				try {
					const interaction = new (value as any)();
					this.interactions.set(interaction.name, interaction);
				} catch (error) {
					console.error(error);
					console.log(`Could not load interaction ${path}/${file}`);
				}
			};
		}
	}

	/**
	 * @description Registers slash commands
	 * @param {BaseClient} client Discord Client
	 * @param {string?} guildId Guild ID
	 * @example
	 * // registers slash commands globally
	 * module.registerSlashCommands(client);
	 * @example
	 * // registers slash commands in a guild
	 * module.registerSlashCommands(client, '123456789');
	 */
	public async registerSlashCommands(client: BaseClient, alreadyAdded: Array<string> , guildId?: string): Promise<void> {
		const toRegister = new Array();
		for (const [_, interaction] of this.interactions) {
			if (!(interaction instanceof BaseSlashCommand)) continue;
			if (alreadyAdded.includes(interaction.getName())) {
				console.log(`Interaction ${interaction.getName()} already added`);
				continue;
			}
			toRegister.push(interaction.getSlashCommand().toJSON());
		}
		
		if (toRegister.length === 0) {
			console.log(`No slash commands to register for module ${this.name}`);
			return;
		}

		console.table("To Register", toRegister)

		/*let data;
		if (!guildId) {
			data = await client.getBaseRest().put(
				Routes.applicationCommands(client.getClientId()),
				{ body: toRegister }
			)
		} else {
			data = await client.getBaseRest().put(
				Routes.applicationGuildCommands(client.getClientId(), guildId),
				{ body: toRegister }
			)
		}

		console.log(data);*/
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