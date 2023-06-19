import { BaseSlashCommand, BaseClient, SlashCommandOptionType } from "@src/structures";
import { ItemHandler } from "@src/structures/database/handler/item.db.model";
import { AccountHandler } from "@src/structures/database/handler/money.handler.class";
import { ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, ButtonInteraction, Base, PermissionFlagsBits } from "discord.js";

/**
 * @description ItemBuy command
 * @class ItemBuy
 * @extends BaseSlashCommand
 */

export class MoneyCommand extends BaseSlashCommand {
    constructor() {
        super("money-add", "Show balance", [
            {
                name: "user",
                description: "The user to add money to",
                type: SlashCommandOptionType.USER,
            },
            {
                name: "amount",
                description: "The amount of money to add",
                type: SlashCommandOptionType.INTEGER,
            },
        ], 0, true, [PermissionFlagsBits.Administrator]);
    }

    /**
     * @description Executes the command
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     *  
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const user = interaction.options.getUser("user", true);
        const amount = interaction.options.getInteger("amount", true);
        

        if (!user || !amount)
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                        .setTitle("Error")
                        .setDescription("Invalid arguments")
                        .setTimestamp()
                ],
                ephemeral: true,
            });
        
        const account = await AccountHandler.getAccount(user.id);
        account.addBalance(amount);

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTitle("Balance")
            .setDescription(`${user.tag} have ${account.balance} coins now, before they had ${account.balance - amount} coins`)
            .setTimestamp()
    
        await interaction.reply({
            embeds: [
                embed
            ],              
        });
    }
}
