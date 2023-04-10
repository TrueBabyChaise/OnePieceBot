import { BaseClient, BaseInteraction } from '@src/structures';
import { Attachment, ChatInputCommandInteraction, AttachmentBuilder, AttachmentData } from 'discord.js';
import { TicketManager } from '@src/structures/tickets/ticketManager.class';

/**
 * @description TicketSave button interaction
 * @class TicketSaveButtonInteraction
 * @extends BaseInteraction
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
        const ticket = TicketManager.getInstance().getTicket(interaction.channelId);
        if (!ticket) {
            await interaction.reply('This command can only be used in a ticket');
            return;
        }
        const transcript = await ticket.buildTranscript(interaction.guildId!, client);
        if (!transcript) {
            await interaction.reply('An error occurred while building the transcript');
            return;
        }
        const bufferResolvable = Buffer.from(transcript);
        const attachment = new AttachmentBuilder(bufferResolvable, {
            name: 'transcript.html',
        });

        await interaction.reply({ files: [attachment] });
    }
}
