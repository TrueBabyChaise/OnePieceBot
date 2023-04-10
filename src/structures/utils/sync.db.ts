import { DBConnection } from "../database/dbConnection.db.class";
import { GuildModel, GuildUserModel } from "../database/models/guild.db.model";
import { UserModel } from "../database/models/user.db.model";
import { TicketModel, UserTicketModel, GuildTicketModel } from "../database/models/ticket.db.model";

export default async function databaseSynchronisation(): Promise<void> {
	const sequelize = DBConnection.getInstance().sequelize;
	await GuildModel.sync();
	await UserModel.sync();
	await GuildUserModel.sync();
	await TicketModel.sync();
	await UserTicketModel.sync();
	await GuildTicketModel.sync();
	await sequelize.sync();

}