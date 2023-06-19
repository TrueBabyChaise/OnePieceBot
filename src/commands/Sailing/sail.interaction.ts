import { BaseSlashCommand, BaseClient, SlashCommandOptionType } from "@src/structures";
import { ItemHandler } from "@src/structures/database/handler/item.db.model";
import { AccountHandler } from "@src/structures/database/handler/money.handler.class";
import { ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, ButtonInteraction, Base } from "discord.js";

/**
 * @description Sail command
 * @class Sail
 * @extends BaseSlashCommand
 */

export class SailCommand extends BaseSlashCommand {
    constructor() {
        super("sail", "Change island", [
            {
                name: "destination",
                description: "The destination",
                type: SlashCommandOptionType.STRING,
                required: true,
            },
            {
                name: "boat",
                description: "The boat you want to use",
                type: SlashCommandOptionType.STRING,
                required: true,
            },
        ], 0, true, []);
    }

    /**
     * @description Executes the command
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     *  
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const destination = interaction.options.getString("destination", true);
        const boat = interaction.options.getString("boat", true);

        if (!destination || !boat) {
            await interaction.reply({
                content: "You must provide a destination and a boat",
                ephemeral: true,
            });
            return
        }
        const items = await ItemHandler.getItems();
        const item = items.find((item) => item.name == boat);
        if (!item) {
            await interaction.reply({
                content: "You must provide a valid boat",
                ephemeral: true,
            });
            return
        }


        
        
        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})

        await interaction.reply({
            embeds: [
                embed
            ],              
        });
    }
}
