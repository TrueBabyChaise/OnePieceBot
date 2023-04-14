import { BaseClient, BaseInteraction } from '@src/structures';
import { ButtonInteraction, MessageEditOptions } from 'discord.js';
import { HelpSlashCommand } from '../Help.interaction';

/**
 * @description HelpNextModule button interaction
 * @class HelpNextModuleButtonInteraction
 * @extends BaseInteraction
 */
export class HelpNextModuleButtonInteraction extends BaseInteraction {
    constructor() {
        super('helpnextmodule', 'Go to the next module of the help menu');
    }

    /**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, interaction: ButtonInteraction): Promise<void> {
        const message = await interaction.message.fetch();
        const embed = message.embeds[0];
        const pageIndex = embed.footer?.text?.split(' ')[1];
        const moduleName = embed.footer?.text?.split(' ')[2];
        
        if (pageIndex && moduleName) {
            const newPageIndex = parseInt(pageIndex) + 1;
            await message.edit(HelpSlashCommand.optionsHelpCommandEmbed(client, moduleName, newPageIndex) as MessageEditOptions);
        }
    }

    
}
