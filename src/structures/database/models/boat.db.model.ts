import Sequelize from "sequelize";
import { DBConnection } from "../dbConnection.db.class"
import { UserModel } from "./user.db.model";
const sequelize = DBConnection.getInstance().sequelize

export const BoatModel = sequelize.define(
    "boats", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        place: {
            type: Sequelize.STRING,
        },
        speed: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        isMoving: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        durability: {
            type: Sequelize.INTEGER,
            defaultValue: 100,
        },
        special: {
            type: Sequelize.STRING,
        },
        status: {
			type: Sequelize.ENUM("building", "working", "grounded", "destroyed", "worn_out"),
			defaultValue: "building",
		},
        fkUser: {
            type: Sequelize.STRING,
            references: {
                model: UserModel,
                key: "id",
            },
            allowNull: false,
        },
    }
);