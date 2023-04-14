import { BaseClient, BaseInteraction } from '@src/structures';
import { ButtonInteraction } from 'discord.js';

/**
 * @description HelpClose button interaction
 * @class HelpCloseButtonInteraction
 * @extends BaseInteraction
 */
export class HelpCloseButtonInteraction extends BaseInteraction {
    constructor() {
        super('helpclose', 'Close the help menu');
    }

    /**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, interaction: ButtonInteraction): Promise<void> {
        await interaction.reply({ content: 'Help menu closed', ephemeral: true });
        await interaction.message.delete();
    }

    
}
