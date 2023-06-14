import { BaseSlashCommand, BaseClient, SlashCommandOptionType } from "@src/structures";
import { ItemHandler } from "@src/structures/database/handler/item.db.model";
import { ChatInputCommandInteraction, PermissionFlagsBits, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, ButtonInteraction, Base } from "discord.js";
import { ItemBuyCommand } from "./buy.interaction";
import { ItemAddCommand } from "../Inventory/add.interaction";
import { ItemRemoveCommand } from "../Inventory/remove.interaction";
import { ItemEditCommand } from "./edit.interaction";
import { ItemInfoCommand } from "./info.interaction";

/**
 * @description ItemDestroy command
 * @class ItemDestroy
 * @extends BaseSlashCommand
 */

export class ItemDestroyCommand extends BaseSlashCommand {
    constructor() {
        super("item-destroy", "Destroy an item", [
            {
                name: "name",
                description: "The name of the item",
                type: SlashCommandOptionType.STRING,
                required: true,
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

        
        await item.delete();

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Item deleted")
                    .setDescription(`The item ${item.name} has been deleted.`)
                    .setColor(Colors.Green)
                    .setTimestamp()
            ],
            ephemeral: true,
        });

        let tmp = client.getModules().get("Shop")?.getInteractions().get("item-buy");
        if (!tmp) return;
        let command = tmp as ItemBuyCommand;
        await command.removeDataStringSelect([{name: name, value: name}], "name", client);

        tmp = client.getModules().get("Shop")?.getInteractions().get("item-edit");
        if (!tmp) return;
        command = tmp as ItemEditCommand;
        await command.removeDataStringSelect([{name: name, value: name}], "item", client);

        tmp = client.getModules().get("Shop")?.getInteractions().get("item-destroy");
        if (!tmp) return;
        command = tmp as ItemDestroyCommand;
        await command.removeDataStringSelect([{name: name, value: name}], "name", client);

        tmp = client.getModules().get("Shop")?.getInteractions().get("item-info");
        if (!tmp) return;
        command = tmp as ItemInfoCommand
        await command.removeDataStringSelect([{name: name, value: name}], "name", client);


        tmp = client.getModules().get("Inventory")?.getInteractions().get("item-add");
        if (!tmp) return;
        command = tmp as ItemAddCommand;
        await command.removeDataStringSelect([{name: name, value: name}], "name", client);

        tmp = client.getModules().get("Inventory")?.getInteractions().get("item-remove");
        if (!tmp) return;
        command = tmp as ItemRemoveCommand;
        await command.removeDataStringSelect([{name: name, value: name}], "name", client);
    }
}
