import { BaseClient, BaseInteraction } from '@src/structures';
import { ButtonInteraction, EmbedBuilder, Colors, TextInputBuilder, ModalActionRowComponentBuilder, ActionRowBuilder, ModalBuilder, TextInputStyle, RoleSelectMenuBuilder, ModalSubmitInteraction } from 'discord.js';

/**
 * @description TicketOpen button interaction
 * @class TicketOpenButtonInteraction
 * @extends BaseInteraction
 */
export class TicketOpenButtonInteraction extends BaseInteraction {
    constructor() {
        super('panelnamechangemodal', 'Change panel name');
    }

    /**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, interaction: ModalSubmitInteraction): Promise<void> {
        console.log(interaction);
    }
}
