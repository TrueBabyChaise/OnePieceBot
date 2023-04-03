import { Sequelize, Model, DataTypes } from 'sequelize';

export class User extends Model {
	public id!: string;
	public username!: string;
	public discriminator!: string;
	public avatar!: string;
	public createdAt!: Date;
	public updatedAt!: Date;
}