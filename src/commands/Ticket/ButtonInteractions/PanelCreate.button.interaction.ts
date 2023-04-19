import { BaseClient, BaseInteraction } from '@src/structures';
import { ButtonInteraction, EmbedBuilder, Colors, TextInputBuilder, ModalActionRowComponentBuilder, ActionRowBuilder, ModalBuilder, TextInputStyle, RoleSelectMenuBuilder } from 'discord.js';

/**
 * @description TicketOpen button interaction
 * @class TicketOpenButtonInteraction
 * @extends BaseInteraction
 */
export class TicketOpenButtonInteraction extends BaseInteraction {
    constructor() {
        super('ticketpanelcreate', 'Create a ticket panel');
    }

    /**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, interaction: ButtonInteraction): Promise<void> {
        const embed = new EmbedBuilder()
            .setTitle('Ticket Panel Setup - Step 1/3')
            .setDescription('Click the button below to setup a ticket panel')
            .setColor(Colors.DarkButNotBlack)
            .setTimestamp();

        const modal = new ModalBuilder()
            .setTitle('Change the name of the panel')
            .setCustomId('panelnamechange')

        const row = new ActionRowBuilder<ModalActionRowComponentBuilder>()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId('ticketpanelcreate')
                    .setPlaceholder('Enter the name of the panel')
                    .setMinLength(1)
                    .setMaxLength(100)
                    .setLabel('Panel Name')
                    .setStyle(TextInputStyle.Short),
            );

        modal.addComponents(row);
        
        await interaction.showModal(modal);
    }
}
