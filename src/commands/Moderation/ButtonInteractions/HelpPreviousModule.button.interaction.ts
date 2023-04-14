import { BaseClient, BaseInteraction } from '@src/structures';
import { ChatInputCommandInteraction } from 'discord.js';

/**
 * @description HelpPreviousModule button interaction
 * @class HelpPreviousModuleButtonInteraction
 * @extends BaseInteraction
 */
export class HelpPreviousModuleButtonInteraction extends BaseInteraction {
    constructor() {
        super('helppreviousmodule', 'Go to the previous module of the help menu');
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
