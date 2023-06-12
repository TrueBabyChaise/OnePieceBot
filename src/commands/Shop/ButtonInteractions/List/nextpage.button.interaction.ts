import { BaseClient, BaseInteraction } from "@src/structures";
import { ButtonInteraction } from "discord.js";
import { ListShopCommand } from "../../list.interaction";

/**
 * @description HelpNextPage button interaction
 * @class HelpNextPageButtonInteraction
 * @extends BaseInteraction
 */
export class HelpNextPageButtonInteraction extends BaseInteraction {
	constructor() {
		super("shopnextpage", "Go to the next page of the shop menu");
	}

	/**
     * @description Executes the interaction
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
	async execute(client: BaseClient, interaction: ButtonInteraction): Promise<void> {
		const message = interaction.message
		const embed = message.embeds[0];
		const pageIndex = embed.footer?.text?.split("/")[0];
        
		if (pageIndex) {
			const newPageIndex = parseInt(pageIndex) + 1;
			await interaction.deferUpdate();
			await interaction.editReply(await ListShopCommand.optionsListCommandEmbed(client, newPageIndex));
		} else {
			throw new Error("There was an error while executing the helpnextpage button interaction!");
		}
	}
}
	