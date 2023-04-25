import { BaseClient, BaseInteraction } from "@src/structures";
import { EmbedBuilder } from "discord.js";
import { ModalSubmitInteraction } from "discord.js";
import { PanelTicketEnum, PanelTicketHandler } from "@src/structures/database/handler/panelTicket.handler.class";

/**
 * @description TicketOpen button interaction
 * @class TicketOpenButtonInteraction
 * @extends BaseInteraction
 */
export class TicketOpenButtonInteraction extends BaseInteraction {
	constructor() {
		super("paneldescriptionmodaledit", "Change panel name");
	}

	/**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
	async execute(client: BaseClient, interaction: ModalSubmitInteraction): Promise<void> {
		console.log("paneldescriptionmodal");
		const message = interaction.message;
		if (!message) {
			await interaction.reply({ content: "Something went wrong", ephemeral: true });
			return;
		}
		const newDescription = interaction.fields.getTextInputValue("paneldescription");
		if (!newDescription) {
			await interaction.reply({ content: "Something went wrong", ephemeral: true });
			return;
		}
		const thirdEmbed = message.embeds[2];
		if (!thirdEmbed || !thirdEmbed.title) {
			await interaction.reply({ content: "Something went wrong", ephemeral: true });
			return;
		}
		const newThirdEmbed = new EmbedBuilder()
			.setTitle(thirdEmbed.title)
			.setDescription(`\`\`\`${newDescription}\`\`\``)
			.setColor(thirdEmbed.color)
		if (interaction.guildId) {
			PanelTicketHandler.getPanelTicketByUserAndGuild(interaction.user.id, interaction.guildId, PanelTicketEnum.EDIT).then((panel) => {
				if (panel) {
					const status = panel.updatePanelTicketDescription(newDescription);
					if (!status) {
						interaction.reply({ content: "Something went wrong", ephemeral: true });
						return;
					}
				}
			});
		}

		await interaction.deferUpdate();
		await interaction.editReply({ embeds: [message.embeds[0], message.embeds[1], newThirdEmbed], components: message.components });
	}
}
