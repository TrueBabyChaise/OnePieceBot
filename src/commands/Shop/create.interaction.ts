import { BaseSlashCommand, BaseClient, SlashCommandOptionType } from "@src/structures";
import { ItemHandler } from "@src/structures/database/handler/item.db.model";
import { ChatInputCommandInteraction, PermissionFlagsBits, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, ButtonInteraction } from "discord.js";
import { ItemBuyCommand } from "./buy.interaction";
import { ItemDestroyCommand } from "./destroy.interaction";
import { ItemAddCommand } from "../Inventory/add.interaction";
import { ItemRemoveCommand } from "../Inventory/remove.interaction";
import { ItemEditCommand } from "./edit.interaction";
import { ItemInfoCommand } from "./info.interaction";

/**
 * @description ItemCreate command
 * @class ItemCreate
 * @extends BaseSlashCommand
 */
export class ItemCreateCommand extends BaseSlashCommand {
	constructor() {
		super("item-create", "Create an item", [
            {
                name: "name",
                description: "The name of the item",
                type: SlashCommandOptionType.STRING,
                required: true,
            },
            {
                name: "description",
                description: "The description of the item",
                type: SlashCommandOptionType.STRING,
            },
            {
                name: "price",
                description: "The price of the item",
                type: SlashCommandOptionType.INTEGER,
            },
            {
                name: "stocks",
                description: "The stocks of the item",
                type: SlashCommandOptionType.INTEGER,
            },
            {
                name: "useable",
                description: "can the item be used",
                type: SlashCommandOptionType.BOOLEAN,
            },
            {
                name: "sellable",
                description: "can the item be sold",
                type: SlashCommandOptionType.BOOLEAN,
            },
            {
                name: "image",
                description: "The image of the item",
                type: SlashCommandOptionType.STRING,
            },
            {
                name: "type",
                description: "The type of the item",
                type: SlashCommandOptionType.STRING,
            },
            {
                name: "stockable",
                description: "can the item be stocked",
                type: SlashCommandOptionType.BOOLEAN,
            },
        ], 0, true, [PermissionFlagsBits.Administrator]);
	}

	/**
	 * @description Executes the slash command
	 * @param {BaseClient} client
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns {Promise<void>}
	 */
	async execute(client: BaseClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const name = interaction.options.getString("name", true);
        const description = interaction.options.getString("description", false);
        const price = interaction.options.getInteger("price", false);
        const stocks = interaction.options.getInteger("stocks", false);
        const useable = interaction.options.getBoolean("useable", false);
        const sellable = interaction.options.getBoolean("sellable", false);
        const image = interaction.options.getString("image", false);
        const type = interaction.options.getString("type", false);
        const stockable = interaction.options.getBoolean("stockable", false);

        if ((await ItemHandler.getItemsByName(name)).length > 0) {
            await interaction.reply({
                content: "An item with the same name already exists",
                ephemeral: true,
            });
            return;
        }

        const item = new ItemHandler(name, description, price, stocks, useable, sellable, image, type, stockable);
        await item.save();

        let fields = [];

        description ? fields.push({name: "Description", value: description, inline: true}) : fields.push({name: "Description", value: "No description", inline: false});
        price && price > 0  ? fields.push({name: "Price", value: price.toString(), inline: true}) : fields.push({name: "Price", value: "Free", inline: true});
        stocks && stocks > 0 ? fields.push({name: "Stocks", value: stocks.toString(), inline: true}) : fields.push({name: "Stocks", value: "Unlimited", inline: true});
        type ? fields.push({name: "Type", value: type, inline: true}) : fields.push({name: "Type", value: "misc", inline: true});
        useable ? fields.push({name: "Useable", value: "Yes", inline: true}) : fields.push({name: "Useable", value: "No", inline: true});
        sellable ? fields.push({name: "Sellable", value: "Yes", inline: true}) : fields.push({name: "Sellable", value: "No", inline: true});
        // image ? fields.push({name: "Image", value: image, inline: true}) : fields.push({name: "Image", value: "No image", inline: true});
        stockable ? fields.push({name: "Stockable", value: "Yes", inline: true}) : fields.push({name: "Stockable", value: "No", inline: true});

        const embed = new EmbedBuilder()
            .setTitle("Item created")
            .setDescription(`The item **${name}** has been created`)
            .setColor(Colors.Green)
            .addFields(fields)
            .setTimestamp();

        if (image) embed.setImage(image);
        await interaction.reply({
            embeds: [
                embed
            ],
            ephemeral: true,
        });

        let tmp = client.getModules().get("Shop")?.getInteractions().get("item-buy");
        if (!tmp) return;
        let command = tmp as ItemBuyCommand;
        await command.addDataStringSelect([{name: name, value: name}], "name", client);

        tmp = client.getModules().get("Shop")?.getInteractions().get("item-edit");
        if (!tmp) return;
        command = tmp as ItemEditCommand;
        await command.addDataStringSelect([{name: name, value: name}], "item", client);

        tmp = client.getModules().get("Shop")?.getInteractions().get("item-info");
        if (!tmp) return;
        command = tmp as ItemInfoCommand;
        await command.addDataStringSelect([{name: name, value: name}], "name", client);

        tmp = client.getModules().get("Shop")?.getInteractions().get("item-destroy");
        if (!tmp) return;
        command = tmp as ItemDestroyCommand;
        await command.addDataStringSelect([{name: name, value: name}], "name", client);

        tmp = client.getModules().get("Inventory")?.getInteractions().get("item-add");
        if (!tmp) return;
        command = tmp as ItemAddCommand;
        await command.addDataStringSelect([{name: name, value: name}], "name", client);

        tmp = client.getModules().get("Inventory")?.getInteractions().get("item-remove");
        if (!tmp) return;
        command = tmp as ItemRemoveCommand;
        await command.addDataStringSelect([{name: name, value: name}], "name", client);
	}
}
