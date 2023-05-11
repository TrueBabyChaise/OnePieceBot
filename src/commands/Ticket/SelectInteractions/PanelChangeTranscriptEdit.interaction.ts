import { BaseClient, BaseInteraction } from "@src/structures";
import { EmbedBuilder, ChannelSelectMenuInteraction} from "discord.js";
import { PanelTicketEnum, PanelTicketHandler } from "@src/structures/database/handler/panelTicket.handler.class";
/**
 * @description TicketOpen button interaction
 * @class TicketOpenButtonInteraction
 * @extends BaseInteraction
 */
export class PanelChangeTranscriptInteraction extends BaseInteraction {
	constructor() {
		super("paneltranscriptedit", "Change the role for the ticket panel");
	}

	/**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
	async execute(client: BaseClient, interaction: ChannelSelectMenuInteraction): Promise<void> {
		const message = interaction.message;

		if (!message) {
			await interaction.reply({ content: "Something went wrong", ephemeral: true });
			return;
		}

		const newChannel = interaction.values;
       

		const secondEmbed = message.embeds[1];
		if (!secondEmbed || !secondEmbed.title) {
			await interaction.reply({ content: "Something went wrong", ephemeral: true });
			return;
		}

		let stringChannel = "None selected...";
		if (newChannel && newChannel.length >= 1) {
			stringChannel = newChannel.map((channel) => `<#${channel}>\n`).join(" ");
			if (!interaction.guild) {
				await interaction.reply({ content: "Something went wrong", ephemeral: true });
				return;
			}
			PanelTicketHandler.getPanelTicketByUserAndGuild(interaction.user.id, interaction.guild.id, PanelTicketEnum.EDIT).then((panelTicket) => {
				const setChannel = newChannel[0]; 
				if (panelTicket) {
					if (!panelTicket.updatePanelTicketTranscriptChannel(setChannel)) {
						interaction.reply({ content: "Something went wrong", ephemeral: true });
						return; 
					}
				}
			});
		}

		const newSecondEmbed = new EmbedBuilder()
			.setTitle(secondEmbed.title)
			.setDescription(`${stringChannel}`)
			.setColor(secondEmbed.color)

		await interaction.deferUpdate();
		await interaction.editReply({ embeds: [message.embeds[0], newSecondEmbed], components: message.components });
	}
}
