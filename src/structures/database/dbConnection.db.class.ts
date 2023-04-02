import { Sequelize } from "sequelize";
require('dotenv').config(); // LOAD CONFIG (.env)

export class DBConnection {
	private static instance: DBConnection;
	private _sequelize: Sequelize;

	private constructor() {
		this._sequelize = new Sequelize({
			dialect: "mariadb",
			host: process.env.DB_HOST,
			username: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
			port: Number(process.env.DB_PORT),
			storage: "./src/structures/database/dbConnection.db",
		});

		this._sequelize.authenticate().then(() => {
			console.log("Connection has been established successfully.");
		}).catch((err: Error) => {
			console.error("Unable to connect to the database:", err);
		});
	}

	public static getInstance(): DBConnection {
		if (!DBConnection.instance) {
			DBConnection.instance = new DBConnection();
		}

		return DBConnection.instance;
	}

	public get sequelize(): Sequelize {
		return this._sequelize;
	}
}