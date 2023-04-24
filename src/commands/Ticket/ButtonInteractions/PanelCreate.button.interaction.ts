import { BaseClient, BaseInteraction } from '@src/structures';
import { ButtonInteraction, EmbedBuilder, Colors, ActionRowBuilder , ButtonBuilder, ButtonStyle } from 'discord.js';

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
        await interaction.deferUpdate();
        await interaction.editReply(TicketOpenButtonInteraction.getMessageFormat());
    }

    public static getMessageFormat(): any {
        const embed = new EmbedBuilder()
            .setTitle('Step 1/5 - Set your panel name and description')
            .setDescription('Click the button below to setup a ticket panel')
            .setColor(Colors.DarkButNotBlack)
            .setTimestamp()
            
        const embed2 = new EmbedBuilder()
            .setTitle('Panel Name')
            .setDescription('```Panel Name 1```')

        const embed3 = new EmbedBuilder()
            .setTitle('Panel Description')
            .setDescription('```Panel Description 1```')
            

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('panelchangename')
                    .setLabel('Edit Name')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('panelchangedescription')
                    .setLabel('Edit Description')
                    .setStyle(ButtonStyle.Secondary),
            );
        
        const row2 = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('panelback')
                    .setLabel('Back')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('panelnext')
                    .setLabel('Save & Next')
                    .setStyle(ButtonStyle.Primary),
            );
            
        return {embeds: [embed, embed2, embed3], components: [row, row2]};
    }
}
