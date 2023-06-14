import { BaseSlashCommand, BaseClient, SlashCommandOptionType } from "@src/structures";
import { ItemHandler } from "@src/structures/database/handler/item.db.model";
import { ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, ButtonInteraction, Base } from "discord.js";

/**
 * @description ItemBuy command
 * @class ItemBuy
 * @extends BaseSlashCommand
 */

export class ItemUseCommand extends BaseSlashCommand {
    constructor() {
        super("item-use", "Use an item", [
            {
                name: "name",
                description: "The name of the item",
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
        const name = interaction.options.getString("name", true);

        if (!name) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Invalid arguments")
                        .setDescription("You need to provide a valid name and amount.")
                        .setColor(Colors.Red)
                        .setTimestamp()
                ],
                ephemeral: true,
            });
            return;
        }

        const usersItems = await ItemHandler.getItemsOfUser(interaction.user.id);
        const item = usersItems.find(i => i.name.toLowerCase() == name.toLowerCase());
        if (!item || !item.id) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Invalid item")
                        .setDescription("You need to provide a valid item.")
                        .setColor(Colors.Red)
                        .setTimestamp()
                ],
                ephemeral: true,
            });
            return;
        }

        if (!item.useable)
        {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Invalid item")
                        .setDescription("You need to provide a useable item.")
                        .setColor(Colors.Red)
                        .setTimestamp()
                ],
                ephemeral: true,
            });
            return;
        }

        if (item.stocks != -1 && item.stocks < 1) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Not enough stocks")
                        .setDescription(`There are not enough stocks for this item. You need ${1 - item.stocks} less.`)
                        .setColor(Colors.Red)
                        .setTimestamp()
                ],
                ephemeral: true,
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`Item used : **${item.name}**`)
            .setDescription(item.description)
            .setColor(Colors.Green)
            .setTimestamp();
        
        if (item.image.length > 0) {
            embed.setImage(item.image);
        }
        await interaction.reply({
            embeds: [
                embed
            ],              
        });
    }
}
