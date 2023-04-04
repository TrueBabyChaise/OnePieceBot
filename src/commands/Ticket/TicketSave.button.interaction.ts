import { BaseClient, BaseInteraction } from '@src/structures';
import { Attachment, ChatInputCommandInteraction, AttachmentBuilder, AttachmentData } from 'discord.js';
import { TicketManager } from '@src/structures/utils/ticketManager.class';

/**
 * @description TicketSave button interaction
 * @class TicketSaveButtonInteraction
 * @extends BaseButtonInteraction
 */
export class TicketSaveButtonInteraction extends BaseInteraction {
    constructor() {
        super('ticketsave', 'Save transcript of a ticket');
    }

    /**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guildId) {
            await interaction.reply('This command can only be used in a server');
            return;
        }
        if (!interaction.channelId) {
            await interaction.reply('This command can only be used in a channel');
            return;
        }

        // Create Attachment
        const transcript = await TicketManager.getInstance().buildTranscript(interaction.channelId, interaction.guildId!, client);
        const bufferResolvable = Buffer.from(transcript);
        const attachment = new AttachmentBuilder(bufferResolvable, {
            name: 'transcript.html',
        });

        await interaction.reply({ files: [attachment] });
    }
}
