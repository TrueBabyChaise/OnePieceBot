import { BaseClient, BaseInteraction } from '@src/structures';
import { EmbedBuilder } from 'discord.js';
import { ModalSubmitInteraction } from 'discord.js';

/**
 * @description TicketOpen button interaction
 * @class TicketOpenButtonInteraction
 * @extends BaseInteraction
 */
export class TicketOpenButtonInteraction extends BaseInteraction {
    constructor() {
        super('panelnamemodal', 'Change panel name');
    }

    /**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, interaction: ModalSubmitInteraction): Promise<void> {
        console.log('panelnamemodal');
        const message = interaction.message;
        if (!message) {
            await interaction.reply({ content: 'Something went wrong', ephemeral: true });
            return;
        }
        const newName = interaction.fields.getTextInputValue('panelname');
        if (!newName) {
            await interaction.reply({ content: 'Something went wrong', ephemeral: true });
            return;
        }
        const secondEmbed = message.embeds[1];
        if (!secondEmbed || !secondEmbed.title) {
            await interaction.reply({ content: 'Something went wrong', ephemeral: true });
            return;
        }
        const newSecondEmbed = new EmbedBuilder()
            .setTitle(secondEmbed.title)
            .setDescription(`\`\`\`${newName}\`\`\``)
            .setColor(secondEmbed.color)


        await interaction.deferUpdate();
        await interaction.editReply({ embeds: [message.embeds[0], newSecondEmbed, message.embeds[2]], components: message.components });
    }
}
