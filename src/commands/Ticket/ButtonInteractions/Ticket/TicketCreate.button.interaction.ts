import { BaseClient, BaseInteraction } from "@src/structures";
import { TicketManager } from "@src/structures/tickets/ticketManager.class";
import { ButtonInteraction } from "discord.js";

/**
 * @description TicketClose button interaction
 * @class TicketCloseButtonInteraction
 * @extends BaseButtonInteraction
 */
export class TicketCloseButtonInteraction extends BaseInteraction {
	constructor() {
		super("ticketcreatepanel", "Close a ticket");
	}

	/**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
	async execute(client: BaseClient, interaction: ButtonInteraction): Promise<void> {
		await TicketManager.getInstance().createTicketFromPanel(interaction, client);
		if (interaction.guild)
			console.log(TicketManager.getInstance().getTicket(interaction.guild.id));
	}
}
