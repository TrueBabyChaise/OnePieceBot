import { BaseClient, BaseInteraction } from "@src/structures";
import { TicketManager } from "@src/structures/tickets/ticketManager.class";
import { ChatInputCommandInteraction } from "discord.js";

/**
 * @description TicketDelete button interaction
 * @class TicketDeleteButtonInteraction
 * @extends BaseInteraction
 */
export class TicketDeleteButtonInteraction extends BaseInteraction {
	constructor() {
		super("ticketdelete", "Delete a ticket");
	}

	/**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
	async execute(client: BaseClient, interaction: ChatInputCommandInteraction): Promise<void> {
		TicketManager.getInstance().deleteTicket(interaction, client);
	}

    
}
