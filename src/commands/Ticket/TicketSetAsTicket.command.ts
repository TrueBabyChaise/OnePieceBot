import { TicketManager } from "@src/structures/tickets/ticketManager.class";
import { BaseCommand, BaseClient} from "@src/structures";
import { Message } from "discord.js";

/**
 * @description TicketCreate command
 * @class TicketCreate
 * @extends BaseCommand
 */
export class TicketCreateCommand extends BaseCommand {
	constructor() {
		super("ticketset", ["ts"], "Set a channel as ticket", "Tickets", 0, true, []);
	}

	/**
     * @description Executes the command
     * @param {BaseClient} client
     * @param {Message} message
     * @param {string[]} args
     * @returns {Promise<void>}
     */

	async execute(client: BaseClient, message: Message, args: string[]): Promise<void> {
       	TicketManager.getInstance().setNewTicketFromMessage(message);
		console.log(TicketManager.getInstance().getTicket(message.channel.id));
	}

}
