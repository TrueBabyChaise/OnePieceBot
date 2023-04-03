import { BaseClient, BaseInteraction } from '@src/structures';
import { ChatInputCommandInteraction } from 'discord.js';

/**
 * @description TicketClose button interaction
 * @class TicketCloseButtonInteraction
 * @extends BaseButtonInteraction
 */
export class TicketCloseButtonInteraction extends BaseInteraction {
    constructor() {
        super('ticketdelete', 'Delete a ticket');
    }

    /**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply('Ticket will be deleted in 10 seconds');
        let i = 9;
        const loop = () => {setTimeout(async () => {
                try {
                    if (i > 0)
                        await interaction.editReply(`Ticket will be deleted in ${i} seconds`);
                    i--;
                    if (i < 0) {
                        await interaction.editReply('Ticket deleted!');
                        if (interaction.channel)
                            await interaction.channel.delete();
                        else
                            await interaction.editReply('Ticket could not be deleted!');
                    } else {
                        loop();
                    }
                } catch (e) {
                    console.log(e);
                }
            }, 1000);
        }

        loop();
    }

    
}
