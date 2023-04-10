import { BaseClient, BaseInteraction } from '@src/structures';
import { TicketManager } from '@src/structures/utils/ticketManager.class';
import { ChatInputCommandInteraction } from 'discord.js';

/**
 * @description TicketClose button interaction
 * @class TicketCloseButtonInteraction
 * @extends BaseButtonInteraction
 */
export class TicketCloseButtonInteraction extends BaseInteraction {
    constructor() {
        super('ticketclose', 'Close a ticket');
    }

    /**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const ticket = TicketManager.getInstance().getTicket(interaction.channelId)
        if (ticket)
            await ticket.closeTicket(interaction, client);
        else
            interaction.reply('Ticket not found');
    }
}
