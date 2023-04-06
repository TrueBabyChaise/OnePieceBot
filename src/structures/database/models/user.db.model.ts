import Sequelize from "sequelize";
import { DBConnection } from "../dbConnection.db.class"
const sequelize = DBConnection.getInstance().sequelize

export const UserModel = sequelize.define("users", {
	id: {
		type: Sequelize.INTEGER,
	},
	username: {
		type: Sequelize.STRING,
	},
});


