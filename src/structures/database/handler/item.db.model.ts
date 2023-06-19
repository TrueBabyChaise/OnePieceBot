import { ItemModel, ItemUserModel } from "../models/item.db.model";
import Sequelize from "sequelize";
export class ItemHandler {
    private _id: string | null;
    public name: string;
    public description: string;
    public price: number;
    public stocks: number;
    public useable: boolean;
    public sellable: boolean;
    public image: string;
    public type: string;
    public stockable: boolean;
    public special: string;

    constructor(name: string, description: string | null = "", price: number | null = 0, stocks: number | null = -1, 
                useable: boolean | null = true, sellable: boolean | null = true, image: string | null = "", 
                type: string | null = "misc", stockable: boolean | null = true, special: string | null = "") {
        this._id = null;
        this.name = name;
        this.description = description ? description : "";
        this.price = price ? price : 0;
        this.stocks = stocks ? stocks : -1;
        this.useable = useable != null ? useable : true;
        this.sellable = sellable != null ? sellable : true;
        this.image = image ? image : "";
        this.type = type ? type : "misc";
        this.stockable = stockable != null ? stockable : true;
        this.special = special ? special : "";
    }

    public get id(): string | null {
        return this._id;
    }

    public async save(): Promise<void> {
        if (this._id) return this.update();
        await ItemModel.create({
            name: this.name,
            description: this.description,
            price: this.price,
            stocks: this.stocks,
            useable: this.useable,
            sellable: this.sellable,
            image: this.image,
            type: this.type,
            stockable: this.stockable,
            special: this.special,
        });
    }

    public async update(): Promise<void> {
        await ItemModel.update({
            name: this.name,
            description: this.description,
            price: this.price,
            stocks: this.stocks,
            useable: this.useable,
            sellable: this.sellable,
            image: this.image,
            type: this.type,
            stockable: this.stockable,
            special: this.special,
        }, {
            where: {
                id: this._id,
            },
        });
    }

    public async delete(): Promise<void> {
        await ItemUserModel.destroy({
            where: {
                fkItem: this._id,
            },
        });
        await ItemModel.destroy({
            where: {
                id: this._id,
            },
        });
    }

    public static async getItem(id: string): Promise<ItemHandler | null> {
        const item: any = await ItemModel.findOne({
            where: {
                id: id,
            },
        });

        if (!item) return null;
        let tmp = new ItemHandler(item.name, item.description, item.price, item.stocks, item.useable, item.sellable, item.image, item.type, item.stockable, item.special);
        tmp._id = item.id;
        return tmp;
    }

    public static async getItems(): Promise<ItemHandler[]> {
        const items: any[] = await ItemModel.findAll();

        const itemHandlers: ItemHandler[] = [];

        for (let i = 0; i < items.length; i++) {
            let tmp = new ItemHandler(items[i].name, items[i].description, items[i].price, items[i].stocks, items[i].useable, items[i].sellable, items[i].image, items[i].type, items[i].stockable, items[i].special);
            tmp._id = items[i].id;
            itemHandlers.push(tmp);
        }

        return itemHandlers;
    }

    public static async getItemsByType(type: string): Promise<ItemHandler[]> {
        const items: any[] = await ItemModel.findAll({
            where: {
                type: type,
            },
        });

        const itemHandlers: ItemHandler[] = [];

        for (let i = 0; i < items.length; i++) {
            let tmp = new ItemHandler(items[i].name, items[i].description, items[i].price, items[i].stocks, items[i].useable, items[i].sellable, items[i].image, items[i].type, items[i].stockable, items[i].special);
            tmp._id = items[i].id;
            itemHandlers.push(tmp);
        }

        return itemHandlers;
    }

    public static async getItemByName(name: string): Promise<ItemHandler | null> {
        const item: any = await ItemModel.findOne({
            where: {
                name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), '=', name.toLocaleLowerCase())
            },
        });

        if (!item) return null;

        const itemHandler = new ItemHandler(item.name, item.description, item.price, item.stocks, item.useable, item.sellable, item.image, item.type, item.stockable, item.special);
        itemHandler._id = item.id;
        return itemHandler;
    }

    public static async getItemsByName(name: string): Promise<ItemHandler[]> {
        const items: any[] = await ItemModel.findAll({
            where: {
                name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), '=', name.toLocaleLowerCase())
            },
        });

        const itemHandlers: ItemHandler[] = [];

        for (let i = 0; i < items.length; i++) {
            let tmp = new ItemHandler(items[i].name, items[i].description, items[i].price, items[i].stocks, items[i].useable, items[i].sellable, items[i].image, items[i].type, items[i].stockable, items[i].special);
            tmp._id = items[i].id;
            itemHandlers.push(tmp);
        }

        return itemHandlers;
    }

    public static addItemToUser(userId: string, itemId: string, amount: number): void {
        ItemUserModel.create({
            fkUser: userId,
            fkItem: itemId,
            amount: amount,
        });
    }

    public static async removeItemFromUser(userId: string, itemId: string, amount: number): Promise<void> {
        const itemUser: any = await ItemUserModel.findOne({
            where: {
                fkUser: userId,
                fkItem: itemId,
            },
        });

        if (!itemUser) return;

        if (itemUser.amount < amount) {
            await ItemUserModel.destroy({
                where: {
                    fkUser: userId,
                    fkItem: itemId,
                },
            });
            return;
        }

        await ItemUserModel.update({
            amount: itemUser.amount - amount,
        }, {
            where: {
                fkUser: userId,
                fkItem: itemId,
            },
        });
    }

    public static async getItemsOfUser(userId: string): Promise<ItemHandler[]> {
        const items: any[] = await ItemUserModel.findAll({
            where: {
                fkUser: userId,
            },
        });

        const itemHandlers: ItemHandler[] = [];

        for (let i = 0; i < items.length; i++) {
            let tmp = await ItemHandler.getItem(items[i].fkItem);
            if (!tmp) continue;
            tmp.stocks = items[i].get('quantity') as number;
            itemHandlers.push(tmp);
        }

        return itemHandlers;
    }

}