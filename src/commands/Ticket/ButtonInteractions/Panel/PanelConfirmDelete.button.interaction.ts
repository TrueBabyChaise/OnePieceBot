import { BaseClient, BaseInteraction } from "@src/structures";
import { ButtonInteraction } from "discord.js";
import { PanelTicketEnum, PanelTicketHandler } from "@src/structures/database/handler/panelTicket.handler.class";
import { PanelDeleteInteraction } from "./PanelDelete.button.interaction";

/**
 * @description TicketOpen button interaction
 * @class TicketOpenButtonInteraction
 * @extends BaseInteraction
 */
export class PanelConfirmDeleteInteraction extends BaseInteraction {
	constructor() {
		super("ticketpanelconfirmdelete", "Delete a ticket panel");
	}

	/**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
	async execute(client: BaseClient, interaction: ButtonInteraction): Promise<void> {
		if (!interaction.guild) {
			await interaction.reply({ content: "Something went wrong", ephemeral: true });
			return;
		}
		const ticketPanel = await PanelTicketHandler.getPanelTicketByUserAndGuild(interaction.user.id, interaction.guild.id, PanelTicketEnum.TO_DELETE);
		if (ticketPanel) {
			await ticketPanel.deletePanelTicket()
		}

		await new PanelDeleteInteraction().execute(client, interaction)
	}
}
