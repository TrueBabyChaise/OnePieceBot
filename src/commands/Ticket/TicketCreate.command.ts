import { TicketManager } from "@src/structures/utils/ticketManager.class";
import { BaseCommand, BaseClient} from "@src/structures";
import { Message } from "discord.js";

/**
 * @description TicketCreate command
 * @class TicketCreate
 * @extends BaseCommand
 */
export class TicketCreateCommand extends BaseCommand {
    constructor() {
        super('ticketcreate', ['tc'], 'Create a ticket', 'Tickets', 0, true, []);
    }

    /**
     * @description Executes the command
     * @param {BaseClient} client
     * @param {Message} message
     * @param {string[]} args
     * @returns {Promise<void>}
     */

    async execute(client: BaseClient, message: Message, args: string[]): Promise<void> {
        await TicketManager.getInstance().createTicket(message, client);

		if (message.guild)
			console.log(TicketManager.getInstance().getTicket(message.guild.id));
    }

}
