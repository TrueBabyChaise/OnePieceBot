import { BaseSlashCommand, BaseClient, SlashCommandOptionType } from "@src/structures";
import { ItemHandler } from "@src/structures/database/handler/item.db.model";
import { AccountHandler } from "@src/structures/database/handler/money.handler.class";
import { ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, ButtonInteraction, Base } from "discord.js";

/**
 * @description ItemBuy command
 * @class ItemBuy
 * @extends BaseSlashCommand
 */

export class MoneyCommand extends BaseSlashCommand {
    constructor() {
        super("money", "Show balance", [
            {
                name: "private",
                description: "Show the balance privately",
                type: SlashCommandOptionType.BOOLEAN,
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
        const isPrivate = interaction.options.getBoolean("private", false);
        
        const account = await AccountHandler.getAccount(interaction.user.id);
        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTitle("Balance")
            .setDescription(`You have ${account.balance} coins`)
            .setTimestamp()

        await interaction.reply({
            embeds: [
                embed
            ],              
            ephemeral: isPrivate === null || isPrivate === true ? true : false,
        });
    }
}
