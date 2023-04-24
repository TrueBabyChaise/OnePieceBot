import { BaseClient, BaseInteraction } from '@src/structures';
import { ButtonInteraction, EmbedBuilder, Colors, ActionRowBuilder , ButtonBuilder, ButtonStyle } from 'discord.js';
import { TicketSetupPanelCommand } from '../TicketSetupPanel.interaction';

/**
 * @description TicketOpen button interaction
 * @class TicketOpenButtonInteraction
 * @extends BaseInteraction
 */
export class TicketNextButtonInteraction extends BaseInteraction {
    constructor() {
        super('panelnext', 'Create a ticket panel');
    }

    /**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, interaction: ButtonInteraction): Promise<void> {
        const message = interaction.message;
		const firstEmbed = message.embeds[0];
		if (!firstEmbed.title) {
			await interaction.deferUpdate();
			await interaction.editReply(TicketSetupPanelCommand.getMessageFormat());
			return
		}
		let step = firstEmbed.title.split(' ')[1].split('/')[0];
		if (step) {
			await interaction.deferUpdate();
			await interaction.editReply(TicketNextButtonInteraction.getMessageFormat(step));
		} else {
			await interaction.deferUpdate();
			await interaction.editReply(TicketSetupPanelCommand.getMessageFormat());
		}

    }

    public static getMessageFormat(step: string | number): any {
		switch (step) {
			case 1:
				return TicketSetupPanelCommand.getMessageFormat();
			default:
				return TicketSetupPanelCommand.getMessageFormat();
		}
    }
}
