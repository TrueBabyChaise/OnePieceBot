import { BaseSlashCommand, BaseClient, SlashCommandOptionType } from "@src/structures";
import { ItemHandler } from "@src/structures/database/handler/item.db.model";
import { ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, ButtonInteraction, Base } from "discord.js";

/**
 * @description ItemInfo command
 * @class ItemInfo
 * @extends BaseSlashCommand
 */

export class ItemInfoCommand extends BaseSlashCommand {
    constructor() {
        super("item-info", "Information on an item", [
            {
                name: "name",
                description: "The name of the item",
                type: SlashCommandOptionType.STRING,
                required: true,
            },
            {
                name: "private",
                description: "Show the item privately",
                type: SlashCommandOptionType.BOOLEAN,
            }
        ], 0, true, []);
    }

    public async beforeRegistered(client: BaseClient): Promise<void> {
        const items = await ItemHandler.getItems();
        const data = [];
        for (const item of items) {
            data.push({
                name: item.name,
                value: item.name,
            });
        }
        this.addChoices(data, "name");
    }

    async afterRegistered(client: BaseClient): Promise<void> {
        const items = await ItemHandler.getItems();
        const option = this.getOptions().find((option:any ) => option.name == "name");
        if (!option) return;
        const data = [];
        for (const item of items) {
            if (option.choices.find((choice: any) => choice.name == item.name)) continue;
            data.push({
                name: item.name,
                value: item.name,
            });
        }
        this.addChoices(data, "name");
        this.updateSlashCommand(client);
    }
            
    public async addDataStringSelect(data: [{ name: string, value: string }], optionName: string, client: BaseClient): Promise<void> {
        this.addChoices(data, optionName);
        this.updateSlashCommand(client);
    }

    public async removeDataStringSelect(data: [{ name: string, value: string }], optionName: string, client: BaseClient): Promise<void> {
        this.removeChoices(data, optionName);
        this.updateSlashCommand(client);
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
        const isPrivate = interaction.options.getBoolean("private", false);

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

        const items = await ItemHandler.getItems();
        const item = items.find(i => i.name.toLowerCase() == name.toLowerCase());
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

        const embed = new EmbedBuilder()
            .setTitle(item.name)
            .setDescription(item.description ? item.description : "This item has no description")
            .setColor(Colors.Blue)
            .addFields(
                {
                    name: "Price",
                    value: item.price == 0 ? "Free" : item.price.toString(),
                    inline: true,
                },
                {
                    name: "Useable",
                    value: item.useable ? "Yes" : "No",
                    inline: true,
                },
                {
                    name: "Sellable",
                    value: item.sellable ? "Yes" : "No",
                    inline: true,
                }
            )
            .setTimestamp();
        
        if (item.image.length > 0) {
            embed.setImage(item.image);
        }
        await interaction.reply({
            embeds: [
                embed
            ],              
            ephemeral: isPrivate === null || isPrivate === true ? true : false,
        });
    }
}