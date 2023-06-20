import Sequelize from "sequelize";
import { DBConnection } from "../dbConnection.db.class"
import { UserModel } from "./user.db.model";
const sequelize = DBConnection.getInstance().sequelize

export const ItemModel = sequelize.define(
    "items", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING,
        },
        price: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        stocks: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        useable: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        sellable: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        image: {
            type: Sequelize.STRING,
        },
        type: {
            type: Sequelize.STRING,
            defaultValue: "misc",
        },
        unique: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        special: {
            type: Sequelize.STRING,
        },
    }
)

export const ItemUserModel = sequelize.define(
    "items_users", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        fkItem: {
            type: Sequelize.UUID,
            references: {
                model: ItemModel,
                key: "id",
            },
            allowNull: false,
            primaryKey: true,
        },
        fkUser: {
            type: Sequelize.STRING,
            references: {
                model: UserModel,
                key: "id",
            },
            allowNull: false,
            primaryKey: true,
        },
        quantity: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
        },
    }
)

