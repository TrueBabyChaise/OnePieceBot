import BaseClient from "./BaseClient.class";
import { Message } from "discord.js";

export default class BaseEvent {
	name: string;
	once: boolean;
	constructor(name: string, once: boolean = false) {
		this.name = name;
		this.once = once;
	}

	/**
	 * @description Executes the event
	 * @param {BaseClient} client
	 * @param {...args} args
	 */
	public execute(client: BaseClient, ...args: any): void {
		throw new Error(`The execute method has not been implemented in ${this.name}`);
	}
}