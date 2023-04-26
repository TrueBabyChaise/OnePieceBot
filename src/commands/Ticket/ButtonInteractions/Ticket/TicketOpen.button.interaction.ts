import { BaseClient, BaseInteraction } from "@src/structures";
import { TicketManager } from "@src/structures/tickets/ticketManager.class";
import { ChatInputCommandInteraction } from "discord.js";

/**
 * @description TicketOpen button interaction
 * @class TicketOpenButtonInteraction
 * @extends BaseInteraction
 */
export class TicketOpenButtonInteraction extends BaseInteraction {
	constructor() {
		super("ticketopen", "Open a ticket");
	}

	/**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
	async execute(client: BaseClient, interaction: ChatInputCommandInteraction): Promise<void> {
		const ticket = TicketManager.getInstance().getTicket(interaction.channelId)
		if (ticket)
			await ticket.openTicket(interaction, client);
		else
			interaction.reply("Ticket not found");
	}
}
