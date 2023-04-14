import { BaseClient, BaseInteraction } from '@src/structures';
import { ChatInputCommandInteraction } from 'discord.js';

/**
 * @description HelpNextPage button interaction
 * @class HelpNextPageButtonInteraction
 * @extends BaseInteraction
 */
export class HelpNextPageButtonInteraction extends BaseInteraction {
    constructor() {
        super('helpnextpage', 'Go to the next page of the help menu');
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
