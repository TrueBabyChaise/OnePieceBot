import { AccountModel, InvoiceModel } from "../models/account.db.model";
import Sequelize from "sequelize";

export class InvoiceHandler {
    private _id: string = ""
    public fkSender: string;
    public fkReceiver: string;
    public amount: number;
    public reason: string;
    public status: string;

    constructor(fkSender: string = "", fkReceiver: string, amount: number = 0, reason: string = "", status: string = "pending") {
        this.fkSender = fkSender;
        this.fkReceiver = fkReceiver;
        this.amount = amount ? amount : 0;
        this.reason = reason ? reason : "";
        this.status = status ? status : "pending";
    }

    public get id(): string {
        return this._id;
    }

    public async save(): Promise<void> {
        if (this._id) return this.update();
        await InvoiceModel.create({
            fkSender: this.fkSender,
            fkReceiver: this.fkReceiver,
            amount: this.amount,
            reason: this.reason,
            status: this.status,
        }).then((invoice: any) => {
            this._id = invoice.id;
        });
    }

    public async update(): Promise<void> {
        await InvoiceModel.update({
            fkSender: this.fkSender,
            fkReceiver: this.fkReceiver,
            amount: this.amount,
            reason: this.reason,
            status: this.status,
        }, {
            where: {
                id: this._id,
            },
        });
    }

    public async delete(): Promise<void> {
        await InvoiceModel.destroy({
            where: {
                id: this._id,
            },
        });
    }

    public static async createInvoice(fkSender: string, fkReceiver: string, amount: number, reason: string, status: string): Promise<InvoiceHandler> {
        const invoice = new InvoiceHandler(fkSender, fkReceiver, amount, reason, status);
        await invoice.save();
        return invoice;
    }

    public static async getInvoicesOfAccount(accountId: string): Promise<InvoiceHandler[]> {
        const invoices: any[] = await InvoiceModel.findAll(
            {
                where: {
                    fkReceiver: accountId,
                },
            },
        );
        const data: InvoiceHandler[] = [];
        for (const invoice of invoices) {
            let tmp = new InvoiceHandler(invoice.fkSender, invoice.fkReceiver, invoice.amount, invoice.reason, invoice.status);
            tmp._id = invoice.id;
            data.push(tmp);
        }
        
        const invoices2: any[] = await InvoiceModel.findAll(
            {
                where: {
                    fkSender: accountId,
                },
            },
        );
        for (const invoice of invoices2) {
            let tmp = new InvoiceHandler(invoice.fkSender, invoice.fkReceiver, invoice.amount, invoice.reason, invoice.status);
            tmp._id = invoice.id;
            data.push(tmp); 
        }

        return data;
    }
}

export class AccountHandler {
    private _id: string = ""
    public user: string = ""
    public balance: number = 0

    public get id(): string {
        return this._id;
    }

    public async save(): Promise<void> {
        if (this._id) return this.update();
        await AccountModel.create({
            balance: this.balance,
            fkUser: this.user,
        }).then((account: any) => {
            this._id = account.id;
        });
    }

    public async update(): Promise<void> {
        await AccountModel.update({
            balance: this.balance,
        }, {
            where: {
                id: this._id,
            },
        });
    }

    public async delete(): Promise<void> {
        await AccountModel.destroy({
            where: {
                id: this._id,
            },
        });
    }

    public static async createAccount(userId: string, balance: number = 0): Promise<AccountHandler> {
        const account = new AccountHandler();
        account.user = userId;
        account.balance = balance;
        await account.save();
        return account;
    }

    public static async getAccount(userId: string): Promise<AccountHandler> {
        const account: any = await AccountModel.findOne(
            {
                where: {
                    fkUser: userId,
                },
            },
        );
        if (!account) {
            return await AccountHandler.createAccount(userId);
        }

        const data = new AccountHandler();
        data.user = account.fkUser;
        data.balance = account.balance;
        data._id = account.id;
        return data;
    }

    public static async makeTransaction(sender: AccountHandler, receiver: AccountHandler, amount: number, reason: string): Promise<void> {
        if (sender.balance < amount) throw new Error("Not enough money");
        sender.balance -= amount;
        receiver.balance += amount;
        await sender.update();
        await receiver.update();
        await InvoiceHandler.createInvoice(sender.id, receiver.id, amount, reason, "accepted");
    }

    public async addBalance(amount: number): Promise<void> {
        this.balance += amount;
        await this.update();
    }
}