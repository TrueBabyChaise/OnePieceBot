import { BaseClient, BaseInteraction } from "@src/structures";
import { ButtonInteraction, TextInputStyle, TextInputBuilder, ModalActionRowComponentBuilder, ActionRowBuilder, ModalBuilder } from "discord.js";

/**
 * @description PanelChangeName button interaction
 * @class PanelChangeNameInteraction
 * @extends BaseInteraction
 */
export class PanelChangeNameInteraction extends BaseInteraction {
	constructor() {
		super("panelchangename", "Create a ticket panel");
	}

	/**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
	async execute(client: BaseClient, interaction: ButtonInteraction): Promise<void> {
		const message = interaction.message;
		if (!message) {
			await interaction.reply({ content: "Something went wrong", ephemeral: true });
			return;
		}

		const secondEmbed = message.embeds[1];
		if (!secondEmbed || !secondEmbed.description) {
			await interaction.reply({ content: "Something went wrong", ephemeral: true });
			return;
		}

		const name = secondEmbed.description.replace(/`/g, "");

		const modal = new ModalBuilder()
			.setTitle("Change the name of the panel")
			.setCustomId("panelnamemodal")


		const nameText = new TextInputBuilder()
			.setCustomId("panelname")
			.setLabel("Panel Name")
			.setStyle(TextInputStyle.Short)
			.setPlaceholder("Panel Name")
			.setMaxLength(100)

		if (name) {
			nameText.setValue(name);
		}

		const row = new ActionRowBuilder<ModalActionRowComponentBuilder>()
			.addComponents(
				nameText,
			); 

		modal.addComponents(row);
        
		await interaction.showModal(modal);
	}
}
