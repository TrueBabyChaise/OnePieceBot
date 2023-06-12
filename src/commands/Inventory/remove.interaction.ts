import { BaseSlashCommand, BaseClient, SlashCommandOptionType } from "@src/structures";
import { ItemHandler } from "@src/structures/database/handler/item.db.model";
import { ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, ButtonInteraction, Base } from "discord.js";

/**
 * @description ItemRemove command
 * @class ItemRemove
 * @extends BaseSlashCommand
 */

export class ItemRemoveCommand extends BaseSlashCommand {
    constructor() {
        super("item-remove", "Remove an item", [
            {
                name: "name",
                description: "The name of the item",
                type: SlashCommandOptionType.STRING,
                required: true,
            },
            {
                name: "target",
                description: "The target of the item",
                type: SlashCommandOptionType.USER,
                required: true,
            },
            {
                name: "amount",
                description: "The amount of the item",
                type: SlashCommandOptionType.INTEGER,
            },
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

    public async AddDataStringSelect(data: [{ name: string, value: string }], optionName: string, client: BaseClient): Promise<void> {
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
        const target = interaction.options.getUser("target", true);
        const amount = interaction.options.getInteger("amount") || 1;

        if (!name || !amount || amount < 1 || !target) {
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

        const item = await ItemHandler.getItemByName(name);
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

        if (item.stocks != -1 && item.stocks < amount) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Not enough stocks")
                        .setDescription(`There are not enough stocks for this item. You need ${amount - item.stocks} less.`)
                        .setColor(Colors.Red)
                        .setTimestamp()
                ],
                ephemeral: true,
            });
            return;
        }

        ItemHandler.removeItemFromUser(interaction.user.id, item.id, amount);
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Item removed")
                    .setDescription(`You have successfully removed ${amount} ${item.name} of ${target.tag} inventory`)
                    .setColor(Colors.Green)
                    .setTimestamp(new Date())
            ],
            ephemeral: true,
        });
    }
}
