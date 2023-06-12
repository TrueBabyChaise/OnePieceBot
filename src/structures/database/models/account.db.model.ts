import Sequelize from "sequelize";
import { DBConnection } from "../dbConnection.db.class"
import { UserModel } from "./user.db.model";
const sequelize = DBConnection.getInstance().sequelize

export const AccountModel = sequelize.define(
    "accounts", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
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
        balance: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
        },
    }
)

export const InvoiceModel = sequelize.define(
    "invoices", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        fkSender: {
            type: Sequelize.UUID,
            references: {
                model: AccountModel,
                key: "id",
            },
            allowNull: true,
        },
        fkReceiver: {
            type: Sequelize.UUID,
            references: {
                model: AccountModel,
                key: "id",
            },
            allowNull: false,
        },
        amount: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        reason: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM("pending", "accepted", "refused"),
            defaultValue: "pending",
        },
    }
)

