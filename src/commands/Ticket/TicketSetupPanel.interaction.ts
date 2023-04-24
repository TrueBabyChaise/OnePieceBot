import { BaseSlashCommand, BaseClient } from "@src/structures";
import { ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, embedLength } from "discord.js";

/**
 * @description Ticket setup slash command
 * @class TicketSetupPanel
 * @extends BaseSlashCommand
 */
export class TicketSetupPanelCommand extends BaseSlashCommand {
	constructor() {
		super('ticketsetup', 'Setup a ticket panel', [], 0, true, []);
	}

	/**
	 * @description Executes the slash command
	 * @param {BaseClient} client
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns {Promise<void>}
	 */
	async execute(client: BaseClient, interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply(TicketSetupPanelCommand.getMessageFormat());
	}

    public static getMessageFormat(): any {
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ticketpanelcreate')
                    .setLabel('Create a Panel')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('ticketpaneledit')
                    .setLabel('Edit a panel')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('ticketpaneldelete')
                    .setLabel('Delete a panel')
                    .setStyle(ButtonStyle.Danger)
            );

        const embed = new EmbedBuilder()
            .setTitle('Ticket Panel')
            .setDescription('Click the button below to setup a ticket panel')
            .setColor(Colors.DarkButNotBlack)
            .setTimestamp();

        return {embeds: [embed], components: [row], ephemeral: true};
    }
}
