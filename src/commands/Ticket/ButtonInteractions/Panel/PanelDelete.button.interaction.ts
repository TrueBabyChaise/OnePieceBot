import { BaseClient, BaseInteraction } from "@src/structures";
import { ButtonInteraction, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, Colors, ButtonStyle } from "discord.js";
import { PanelTicketEnum, PanelTicketHandler } from "@src/structures/database/handler/panelTicket.handler.class";
import { PanelCreateInteraction } from "./PanelCreate.button.interaction";
import { TicketSetupPanelCommand } from "../../TicketSetupPanel.interaction";

/**
 * @description TicketOpen button interaction
 * @class TicketOpenButtonInteraction
 * @extends BaseInteraction
 */
export class PanelDeleteInteraction extends BaseInteraction {
	constructor() {
		super("ticketpaneldelete", "Delete a ticket panel");
	}

	/**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
	async execute(client: BaseClient, interaction: ButtonInteraction): Promise<void> {
		const ticketPanels = await PanelTicketHandler.getAllPanelTicketByUserAndGuild(interaction.user.id, interaction.guild!.id);
		if (!ticketPanels) {
			await interaction.reply({content: "An error occurred while getting your panel ticket", ephemeral: true});
			return;
		}

		if (ticketPanels.length === 0) {
			await new TicketSetupPanelCommand().execute(client, interaction)
			return;
		}

		const row = new ActionRowBuilder<StringSelectMenuBuilder>()
		const row2  = new ActionRowBuilder<ButtonBuilder>()
		const selectMenu = new StringSelectMenuBuilder()
			.setCustomId("panelchangedeleteselect")
			.setMinValues(1)
			.setMaxValues(1)
			.setPlaceholder("Select a panel to delete")
			.addOptions(
				ticketPanels.map((panel) => {
					return {
						label: panel.name ? panel.name : "No name",
						value: panel.id,
						description: panel.description ? panel.description.slice(0, 95) + "..." : "No description",
						emoji: "🗒",
					}
				}
				));
    
                
		row.addComponents(selectMenu);
		row2.addComponents(
			new ButtonBuilder()
				.setCustomId("ticketsetup")
				.setLabel("Back")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("ticketpanelconfirmdelete")
				.setLabel("Delete")
				.setStyle(ButtonStyle.Primary)
		);

		await interaction.deferUpdate();
		await interaction.editReply({content: "Select a panel to edit", components: [row, row2]});
	}
}