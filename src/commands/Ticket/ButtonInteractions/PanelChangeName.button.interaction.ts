import { BaseClient, BaseInteraction } from '@src/structures';
import { ButtonInteraction, EmbedBuilder, Colors, ButtonStyle, ActionRowBuilder, ButtonBuilder } from 'discord.js';

/**
 * @description PanelChangeName button interaction
 * @class PanelChangeNameInteraction
 * @extends BaseInteraction
 */
export class PanelChangeNameInteraction extends BaseInteraction {
    constructor() {
        super('panelnamechange', 'Create a ticket panel');
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

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ticketpanelcreate')
                    .setLabel('Create a Panel')
                    .setStyle(ButtonStyle.Primary),
            );

        await interaction.deferUpdate();
        await interaction.editReply({embeds: [embed], components: [row]});
    }
}
