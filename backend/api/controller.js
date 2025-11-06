import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import Logger from "../tools/logger.js";
import MariadbConnector from "../tools/mariadb/mariadb_connector.js";
import MariadbEnums from "../tools/mariadb/mariadb_enums.js";
import AccountTools from "./account/account_tools.js";


export default class Controller {
    static _mainTable;

    static async list(req, res, next) {
        const inputs = { ...req.query };
        inputs.from = this._mainTable.label;

        // TODO : better management with schema because it doesn't work if JOIN request
        // if (this._publicFields.length > 0) {
        //     inputs.fields_to_retrieve = this._publicFields.join(",");
        // }

        if (this._mainTable.schema.hasOwnProperty("state")) {
            let found = false;
            for (const key of Object.keys(inputs)) {
                if (key.includes("_state_") || key.includes(".state_")) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                inputs[`and_${this._mainTable.label}.state_like`] = MariadbEnums.States.ACTIVE;
            };
        }

        const rows = await MariadbConnector.listRows({ inputs: inputs });
        if (rows.length === 1 && rows[0].hasOwnProperty('error')) {
            this.sendError({ req: req, res: res });
        } else {
            res.status(200).json({ rows: rows });
        }
    }

    static async read(req, res, next) {
        const row = await MariadbConnector.readRow({
            table: this._mainTable,
            primaryValue: req.params.primaryValue,
            primaryField: this._mainTable.primaryKey,
            // fieldsToRetrieve: this._publicFields // TODO : better management with schema because it doesn't work if JOIN request
        });
        res.status(200).json({ row: row });
    }

    static async create(req, res, next, callback = (async ({ row }) => { })) {
        if (Object.keys(req.body).length > 0) {
            // TODO: check if primary auto increment then delete field by security
            const dbResponse = await MariadbConnector.createRow({ table: this._mainTable, inputs: req.body });

            if (dbResponse.hasOwnProperty("error")) {
                this.sendError({ req: req, res: res, message: "Wrong inputs for this route." });
            } else {
                Logger.write(`Controller ${this._mainTable.label} created: ${JSON.stringify(dbResponse)}`);
                await callback({ row: dbResponse });

                res.status(201).json(dbResponse);
            }
        } else {
            res.status(204).json({ message: "Nothing to create." });
        }
    }

    static async update(req, res, next, callback = (async ({ row }) => { })) {
        if (Object.keys(req.body).length > 0) {
            const dbResponse = await MariadbConnector.updateRow({
                table: this._mainTable,
                primaryValue: req.params.primaryValue,
                inputs: req.body
            });

            if (dbResponse.hasOwnProperty("error")) {
                this.sendError({ req: req, res: res, message: "Wrong inputs for this route." });
            } else {
                Logger.write(`Controller ${this._mainTable.label} update: ${req.params.primaryValue} with ${JSON.stringify(req.body)}`);
                await callback({ row: dbResponse });

                res.status(200).json({});
            }
        } else {
            res.status(204).json({ message: "Nothing to update." });
        }
    }

    // Can't use "delete" function for obvious reasons
    static async tagDeleted(req, res, next, callback = (async ({ row }) => { })) {
        if (Object.keys(req.body).length > 0) {
            const dbResponse = await MariadbConnector.updateRow({
                table: this._mainTable,
                primaryValue: req.params.primaryValue,
                inputs: {
                    state: MariadbEnums.States.DELETED
                }
            });

            if (dbResponse.hasOwnProperty("error")) {
                this.sendError({ req: req, res: res, message: "Wrong inputs for this route." });
            } else {
                Logger.write(`Controller ${this._mainTable.label} delete: ${req.params.primaryValue} with ${JSON.stringify(req.body)}`);
                await callback({ row: dbResponse });

                res.status(200).json({});
            }
        } else {
            res.status(204).json({ message: "Nothing to delete." });
        }
    }

    static async checkAuthorisedAccount(req, res, next, rights = {}) {
        const account = await AccountTools.getAuthorisedAccount({ token_id: req.body.token_id, token: req.body.token, rights: rights });
        if (account.hasOwnProperty('id')) {
            next();
        } else {
            res.status(401).json({ message: MariadbEnums.DEFAULT_UNAUTHORISED_MESSAGE });
        }
    }

    static async sendError({ req, res, message, statusCode = 400 }) {
        res.status(statusCode).json({ message: message });
    }
}