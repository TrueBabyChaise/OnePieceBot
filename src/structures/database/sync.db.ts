import { DBConnection } from "./dbConnection.db.class";
import { GuildModel, GuildUserModel } from "./models/guild.db.model";
import { UserModel } from "./models/user.db.model";
import { TicketModel, UserTicketModel, GuildTicketModel } from "./models/ticket.db.model";
import { PanelTicketModel } from "./models/panelTicket.db.model";

export default async function databaseSynchronisation(): Promise<void> {
	const sequelize = DBConnection.getInstance().sequelize;
	await GuildModel.sync();
	await UserModel.sync();
	await GuildUserModel.sync();
	await PanelTicketModel.sync();
	await TicketModel.sync();
	await UserTicketModel.sync();
	await GuildTicketModel.sync();
	await sequelize.sync();

}