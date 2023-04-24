import { BaseClient, BaseInteraction } from '@src/structures';
import { ButtonInteraction, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, Colors, ButtonStyle } from 'discord.js';
import { PanelTicketEnum, PanelTicketHandler } from '@src/structures/database/handler/panelTicket.handler.class';

/**
 * @description TicketOpen button interaction
 * @class TicketOpenButtonInteraction
 * @extends BaseInteraction
 */
export class PanelDeleteInteraction extends BaseInteraction {
    constructor() {
        super('ticketpanelconfirmdelete', 'Delete a ticket panel');
    }

    /**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, interaction: ButtonInteraction): Promise<void> {
        const ticketPanels = await PanelTicketHandler.getAllPanelTicketByUserAndGuild(interaction.user.id, interaction.guild!.id, PanelTicketEnum.TO_DELETE);
        for (const panel of ticketPanels) {
            await panel.deletePanelTicket()
        }

        await new PanelDeleteInteraction().execute(client, interaction)
    }
}
