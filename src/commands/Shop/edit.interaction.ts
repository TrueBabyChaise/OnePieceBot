import { BaseSlashCommand, BaseClient, SlashCommandOptionType } from "@src/structures";
import { ItemHandler } from "@src/structures/database/handler/item.db.model";
import { ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, PermissionFlagsBits } from "discord.js";
import { ItemBuyCommand } from "./buy.interaction";
import { ItemDestroyCommand } from "./destroy.interaction";
import { ItemAddCommand } from "../Inventory/add.interaction";
import { ItemRemoveCommand } from "../Inventory/remove.interaction";
import { ItemInfoCommand } from "./info.interaction";

/**
 * @description ItemCreate command
 * @class ItemCreate
 * @extends BaseSlashCommand
 */
export class ItemEditCommand extends BaseSlashCommand {
	constructor() {
		super("item-edit", "Edit an item", [
            {
                name: "item",
                description: "Item to edit",
                type: SlashCommandOptionType.STRING,
                required: true,
            },
            {
                name: "name",
                description: "Item to edit",
                type: SlashCommandOptionType.STRING,
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

    public async beforeRegistered(client: BaseClient): Promise<void> {
        const items = await ItemHandler.getItems();
        const data = [];
        for (const item of items) {
            data.push({
                name: item.name,
                value: item.name,
            });
        }
        this.addChoices(data, "item");
    }

    async afterRegistered(client: BaseClient): Promise<void> {
        const items = await ItemHandler.getItems();
        const option = this.getOptions().find((option:any ) => option.name == "item");
        if (!option) return;
        const data = [];
        for (const item of items) {
            if (!option.choices)
                data.push({
                    name: item.name,
                    value: item.name,
                });
            else if (option.choices.find((choice: any) => choice.name == item.name)) continue;
                data.push({
                    name: item.name,
                    value: item.name,
                });
        }
        this.addChoices(data, "item");
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
	 * @description Executes the slash command
	 * @param {BaseClient} client
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns {Promise<void>}
	 */
	async execute(client: BaseClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const lastName = interaction.options.getString("item", true);
        const name = interaction.options.getString("name", false);
        const description = interaction.options.getString("description", false);
        const price = interaction.options.getInteger("price", false);
        const stocks = interaction.options.getInteger("stocks", false);
        const useable = interaction.options.getBoolean("useable", false);
        const sellable = interaction.options.getBoolean("sellable", false);
        const image = interaction.options.getString("image", false);
        const type = interaction.options.getString("type", false);
        const stockable = interaction.options.getBoolean("stockable", false);
        let item = await ItemHandler.getItemByName(lastName);
        if (!item) {
            await interaction.reply({
                content: "This item does not exist",
                ephemeral: true,
            });
            return;
        }

        console.log(item, useable, item.useable);

        if (name) item.name = name;
        if (description) item.description = description;
        if (price) item.price = price;
        if (stocks) item.stocks = stocks;
        if (useable != null) item.useable = useable;
        if (sellable != null) item.sellable = sellable;
        if (image) item.image = image;
        if (type) item.type = type;
        if (stockable != null) item.stockable = stockable;
        
        console.log(item,  useable, item.useable);
        await item.save();

        let priceStr = item.price && item.price > 0 ? item.price.toString() : "Free";
        let stocksStr = item.stocks && item.stocks > 0 ? item.stocks.toString() : "Unlimited";
        let fields = [];


        item.description ? fields.push({name: "Description", value: item.description, inline: true}) : fields.push({name: "Description", value: "No description", inline: false});
        item.price && item.price > 0  ? fields.push({name: "Price", value: priceStr, inline: true}) : fields.push({name: "Price", value: "Free", inline: true});
        item.stocks && item.stocks > 0 ? fields.push({name: "Stocks", value: stocksStr, inline: true}) : fields.push({name: "Stocks", value: "Unlimited", inline: true});
        item.type ? fields.push({name: "Type", value: item.type, inline: true}) : fields.push({name: "Type", value: "misc", inline: true});
        item.useable ? fields.push({name: "Useable", value: "Yes", inline: true}) : fields.push({name: "Useable", value: "No", inline: true});
        item.sellable ? fields.push({name: "Sellable", value: "Yes", inline: true}) : fields.push({name: "Sellable", value: "No", inline: true});
        // image ? fields.push({name: "Image", value: image, inline: true}) : fields.push({name: "Image", value: "No image", inline: true});
        item.stockable ? fields.push({name: "Stockable", value: "Yes", inline: true}) : fields.push({name: "Stockable", value: "No", inline: true});

        const embed = new EmbedBuilder()
            .setTitle("Item edited")
            .setDescription(`The item **${lastName}** has been edited${name ? ` now called **${name}**` : ""}`)
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

        if (!name) return;
        await this.addDataStringSelect([{name: name, value: name}], "item", client);
        await this.removeDataStringSelect([{name: lastName, value: lastName}], "item", client);

        let tmp = client.getModules().get("Shop")?.getInteractions().get("item-buy");
        if (!tmp) return;
        let command = tmp as ItemBuyCommand;
        await command.removeDataStringSelect([{name: lastName, value: lastName}], "name", client);
        await command.addDataStringSelect([{name: name, value: name}], "name", client);

        tmp = client.getModules().get("Shop")?.getInteractions().get("item-destroy");
        if (!tmp) return;
        command = tmp as ItemDestroyCommand;
        await command.removeDataStringSelect([{name: lastName, value: lastName}], "name", client);
        await command.addDataStringSelect([{name: name, value: name}], "name", client);

        tmp = client.getModules().get("Inventory")?.getInteractions().get("item-add");
        if (!tmp) return;
        command = tmp as ItemAddCommand;
        await command.removeDataStringSelect([{name: lastName, value: lastName}], "name", client);
        await command.addDataStringSelect([{name: name, value: name}], "name", client);

        tmp = client.getModules().get("Inventory")?.getInteractions().get("item-remove");
        if (!tmp) return;
        command = tmp as ItemRemoveCommand;
        await command.removeDataStringSelect([{name: lastName, value: lastName}], "name", client);
        await command.addDataStringSelect([{name: name, value: name}], "name", client);

        tmp = client.getModules().get("Shop")?.getInteractions().get("item-info");
        if (!tmp) return;
        command = tmp as ItemInfoCommand;
        await command.removeDataStringSelect([{name: lastName, value: lastName}], "name", client);
        await command.addDataStringSelect([{name: name, value: name}], "name", client);

	}
}
