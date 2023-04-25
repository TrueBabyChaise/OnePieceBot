import { BaseClient, BaseInteraction } from '@src/structures';
import { ButtonInteraction, EmbedBuilder, Colors, ActionRowBuilder , ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuInteraction, ChannelSelectMenuInteraction} from 'discord.js';
import { PanelTicketEnum, PanelTicketHandler } from '@src/structures/database/handler/panelTicket.handler.class';
/**
 * @description TicketOpen button interaction
 * @class TicketOpenButtonInteraction
 * @extends BaseInteraction
 */
export class PanelSendChannelInteraction extends BaseInteraction {
    constructor() {
        super('panelsendchanneledit', 'Change the role for the ticket panel');
    }

    /**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, interaction: ChannelSelectMenuInteraction): Promise<void> {
        const message = interaction.message;
        const components = message.components;
        const newChannel = interaction.values;

        console.log(newChannel);

        if (!message) {
            await interaction.reply({ content: 'Something went wrong1', ephemeral: true });
            return;
        }

        if (!interaction.guild) {
            await interaction.reply({ content: 'Something went wrong2', ephemeral: true });
            return;
        }

        const panelTicket = await PanelTicketHandler.getPanelTicketByUserAndGuild(interaction.user.id, interaction.guild.id, PanelTicketEnum.EDIT);
        if (!panelTicket) {
            await interaction.reply({ content: 'Something went wrong3', ephemeral: true });
            return;
        }

        if (newChannel && newChannel.length >= 1) {
            const setChannel = newChannel[0];
            if (!panelTicket.updatePanelTicketSendChannel(setChannel)) {
                await interaction.reply({ content: 'Something went wrong4', ephemeral: true });
                return;
            }
        }

        const row = new ActionRowBuilder<ChannelSelectMenuBuilder>()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setChannelTypes([ChannelType.GuildText])
                    .setCustomId('panelsendchannel')
                    .setPlaceholder('Select a channel')
                    .setMaxValues(1)
            );

        
        await interaction.deferUpdate();
        await interaction.editReply({ embeds: message.embeds, components: message.components });
    }
}
