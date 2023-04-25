import { BaseClient, BaseInteraction } from "@src/structures";
import { ButtonInteraction, EmbedBuilder, Colors, ActionRowBuilder , ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuInteraction, ChannelSelectMenuInteraction, StringSelectMenuInteraction} from "discord.js";
import { PanelTicketEnum, PanelTicketHandler } from "@src/structures/database/handler/panelTicket.handler.class";
/**
 * @description TicketOpen button interaction
 * @class TicketOpenButtonInteraction
 * @extends BaseInteraction
 */
export class PanelChangeDeleteSelectInteraction extends BaseInteraction {
	constructor() {
		super("panelchangedeleteselect", "Change the role for the ticket panel");
	}

	/**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
	async execute(client: BaseClient, interaction: StringSelectMenuInteraction): Promise<void> {
		if (interaction.values.length != 1) {
			await interaction.reply({ content: "Something went wrong", ephemeral: true });
		}

		if (!interaction.guild) {
			await interaction.reply({ content: "Something went wrong", ephemeral: true });
			return;
		}

		const data = interaction.values[0]
		const panelTicket = await PanelTicketHandler.getPanelTicketByUserAndGuild(interaction.user.id, interaction.guild.id);
		if (panelTicket) {
			await panelTicket.updatePanelTicketStatus(PanelTicketEnum.FINISHED)
		}
		const toChangePanel = await PanelTicketHandler.getPanelTicketById(data) 

		if (!toChangePanel) {
			await interaction.reply({ content: "Something went wrong", ephemeral: true });
			return;
		}
		toChangePanel.updatePanelTicketStatus(PanelTicketEnum.TO_DELETE)
       
		await interaction.deferUpdate();
	}
}
