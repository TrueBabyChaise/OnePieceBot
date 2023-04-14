import { BaseClient, BaseInteraction } from '@src/structures';
import { ChatInputCommandInteraction } from 'discord.js';

/**
 * @description HelpPreviousPage button interaction
 * @class HelpPreviousPageButtonInteraction
 * @extends BaseInteraction
 */
export class HelpPreviousPageButtonInteraction extends BaseInteraction {
    constructor() {
        super('helppreviouspage', 'Go to the previous page of the help menu');
    }

    /**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, interaction: ChatInputCommandInteraction): Promise<void> {
        console.log(interaction);
    }

    
}
