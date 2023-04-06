import Sequelize from "sequelize";
import { DBConnection } from "../dbConnection.db.class"
const sequelize = DBConnection.getInstance().sequelize

export const UserModel = sequelize.define(
	"users", {
		id: {
			type: Sequelize.BIGINT,
			primaryKey: true,
		},
		username: {
			type: Sequelize.STRING,
		},
	}
);


