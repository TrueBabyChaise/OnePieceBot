import { BaseClient, BaseInteraction } from "@src/structures";
import { ButtonInteraction, EmbedBuilder, StringSelectMenuBuilder,Colors, ActionRowBuilder , ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuInteraction, ChannelSelectMenuInteraction, StringSelectMenuInteraction} from "discord.js";
import { PanelTicketEnum, PanelTicketHandler } from "@src/structures/database/handler/panelTicket.handler.class";
/**
 * @description TicketOpen button interaction
 * @class TicketOpenButtonInteraction
 * @extends BaseInteraction
 */
export class PanelChangeEditSelectInteraction extends BaseInteraction {
	constructor() {
		super("panelchangeeditselect", "Change the role for the ticket panel");
	}

	/**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
	async execute(client: BaseClient, interaction: StringSelectMenuInteraction): Promise<void> {
		const message = interaction.message;

		if (interaction.values && interaction.values.length >= 1) {
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
			await toChangePanel.updatePanelTicketStatus(PanelTicketEnum.EDIT)
		}

		const ticketPanels = await PanelTicketHandler.getAllPanelTicketByUserAndGuild(interaction.user.id, interaction.guild!.id);
		if (!ticketPanels) {
			await interaction.reply({content: "An error occurred while getting your panel ticket", ephemeral: true});
			return;
		}

		const rowPanel = new ActionRowBuilder<StringSelectMenuBuilder>()
		const panelMenu = new StringSelectMenuBuilder()
			.setCustomId("panelchangeeditselect")
			.setMinValues(1)
			.setMaxValues(1)
			.setPlaceholder("Select a panel to edit")
			.addOptions(
				ticketPanels.map((panel) => {
					return {
						label: panel.name ? panel.name : "No name",
						value: panel.id,
						description: panel.description ? panel.description.slice(0, 95) + "..." : "No description",
						emoji: "🗒",
						default: panel.status === PanelTicketEnum.EDIT ? true : false
					}
				}
				));
        
		const row = new ActionRowBuilder<StringSelectMenuBuilder>()
		const selectMenu = new StringSelectMenuBuilder()
			.setCustomId("panelactioneditselect")
			.setMinValues(1)
			.setMaxValues(1)
			.setPlaceholder("Select a action to perform")
			.addOptions([
				{
					label: "Change the name or description",
					value: "name_description",
					description: "Change the name or description",
					emoji: "📝",
				},
				{
					label: "Change the role",
					value: "role",
					description: "Change the role",
					emoji: "👥"
				},
				{
					label: "Change the category",
					value: "category",
					description: "Change the category",
					emoji: "📁"
				},
				{
					label: "Change the transcript channel",
					value: "transcript",
					description: "Change the transcript channel",
					emoji: "📺"
				},
				{
					label: "Send the panel somewhere",
					value: "send",
					description: "Send the panel somewhere",
					emoji: "📤"
				},
			])
		row.addComponents(selectMenu)
		rowPanel.addComponents(panelMenu)
		const rowBack = new ActionRowBuilder<ButtonBuilder>()
		rowBack.addComponents(
			new ButtonBuilder()
				.setCustomId("ticketsetup")
				.setLabel("Back")
				.setStyle(ButtonStyle.Primary)
		);

		await interaction.deferUpdate();
		await interaction.editReply({ embeds: [], components: [rowPanel, row, rowBack] })
	}
}
