import { DBConnection } from "./dbConnection.db.class";
import { GuildModel, GuildUserModel } from "./models/guild.db.model";
import { UserModel } from "./models/user.db.model";
import { TicketModel, UserTicketModel, GuildTicketModel } from "./models/ticket.db.model";
import { PanelTicketModel } from "./models/panelTicket.db.model";
import { ItemModel, ItemUserModel } from "./models/item.db.model";
import { AccountModel, InvoiceModel } from "./models/account.db.model";
import { BoatModel } from "./models/boat.db.model";

export default async function databaseSynchronisation(): Promise<void> {
	const sequelize = DBConnection.getInstance().sequelize;
	await GuildModel.sync();
	await UserModel.sync();
	await GuildUserModel.sync();
	await PanelTicketModel.sync();
	await TicketModel.sync();
	await UserTicketModel.sync();
	await GuildTicketModel.sync();
	await ItemModel.sync();
	await ItemUserModel.sync();
	await AccountModel.sync();
	await InvoiceModel.sync();
	await BoatModel.sync();
	await sequelize.sync();

}