import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import os from "os";
import { existsSync, readdirSync, lstatSync } from 'node:fs';

import mariadb from "mariadb";
import MariadbTools from './mariadb_tools.js';
import MariadbEnums from "./mariadb_enums.js";

export default class MariadbConnector {
    static instance = null;
    static #tables = {};

    // #region GETTER

    static getTablesKeys() { return Object.keys(this.#tables); }

    // #endregion GETTER

    constructor() {
        if (!MariadbConnector.instance) {
            this._pool = mariadb.createPool({
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                database: process.env.DB_DATABASE,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                connectionLimit: 10,
                allowPublicKeyRetrieval: true 
            });
            MariadbConnector.instance = this;
            Object.freeze(MariadbConnector.instance);
        }
        return MariadbConnector.instance;
    }

    static getInstance() {
        if (!MariadbConnector.instance) {
            new MariadbConnector();
        }
        return MariadbConnector.instance;
    }

    static mariadbReplacer(key, value) {
        if (typeof value === 'bigint') {
            return value.toString();
        }
        return value;
    }

    static async query({ inquiry, valuesToEscape = [], debug = (process.env.DB_DEBUG === "TRUE") }) {
        let output = null;

        if (debug) {
            let inquiryElements = inquiry.split("?");
            let logInquiry = "";
            const valuesToEscapeLength = valuesToEscape.length;
            for (let iElement = 0; iElement < inquiryElements.length; ++iElement) {
                logInquiry += `${inquiryElements[iElement]} `;
                if (iElement < valuesToEscapeLength) {
                    if (typeof valuesToEscape[iElement] === "string") {
                        logInquiry += `"${valuesToEscape[iElement]}"`;
                    } else {
                        logInquiry += valuesToEscape[iElement];
                    }
                }
            }
            console.log("\n", logInquiry, "\n");
        }

        let connection;
        try {
            connection = await MariadbConnector.getInstance()._pool.getConnection();
            const result = await connection.query(inquiry, valuesToEscape);
            output = JSON.parse(JSON.stringify(result, this.mariadbReplacer));

        } catch (error) {
            console.error('DATABASE INQUIRY error:', error);

        } finally {
            if (connection) {
                connection.release();
            }
        }

        return output;
    }

    static async isReady() {
        const result = await this.query({ inquiry: 'SELECT 1' });
        return result !== null;
    }

    // #region TABLES

    static async setTable({ inputPath }) {
        let output = false;

        try {
            const table = (await import(inputPath)).default;
            if (table.label?.length > 0) {
                this.#tables[table.label] = table;

                output = true;
            }

        } catch (error) {
            console.error(`DATABASE LOAD TABLE error:`, error);
        }

        return output;
    }

    static async synchronise({ tableKey }) {
        let output = false;

        try {
            const table = this.#tables[tableKey];

            // Synchronise TABLE
            const result = await this.query({
                inquiry: `SELECT * 
                FROM information_schema.tables
                WHERE table_schema = '${process.env.DB_DATABASE}' 
                    AND table_name = '${table.label}'
                LIMIT 1;`
            });
            // [
            //     {
            //       ...
            //       TABLE_NAME: 'account',
            //       ...
            //     },
            //     ...
            // ]

            if (result.length === 0) {
                await this.query({ inquiry: table.getCreateTableQuery() });

                const indexesReq = table.getCreateIndexesQueries();
                for (const req of indexesReq) {
                    await this.query({ inquiry: req });
                }
            } else {

                // Synchronise FIELDS
                const fields = await this.query({
                    inquiry: `SELECT COLUMN_NAME, DATA_TYPE 
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_SCHEMA = '${process.env.DB_DATABASE}'
                    AND TABLE_NAME = '${table.label}';`
                });
                // [
                //     { COLUMN_NAME: 'id', DATA_TYPE: 'bigint' },
                //      ...
                // ]

                let toAdd = {};
                for (const key of Object.keys(table.schema)) {
                    let found = false;
                    for (const field of fields) {
                        if (field.COLUMN_NAME === key) {
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        toAdd[key] = table.schema[key];
                    }
                }
                for (const [key, seetings] of Object.entries(toAdd)) {
                    await this.query({
                        inquiry:
                            table.getAlterTableQuery({ action: "ADD", columnKey: key, columnSettings: seetings })
                    });
                }

                let toDelete = [];
                for (const field of fields) {
                    let found = false;
                    for (const key of Object.keys(table.schema)) {
                        if (field.COLUMN_NAME === key) {
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        toDelete.push(field.COLUMN_NAME);
                    }
                }
                for (const key of toDelete) {
                    await this.query({
                        inquiry:
                            table.getAlterTableQuery({ action: "DROP", columnKey: key })
                    });
                }
            }
            output = true;

        } catch (error) {
            console.error(`DATABASE SYNCHRONISE TABLE error:`, error);
        }

        return output;
    }

    // #endregion ROWS CRUD

    // #region ROWS CRUD

    static async createRow({ table, inputs }) {
        let output = { [table.primaryKey]: null };

        let query = "";
        try {
            query = table.getCreateRowQuery({ inputs: inputs });
            const valuesToEscape = table.getValuesToEscapte({ inputs: inputs });
            const response = await this.query({ inquiry: query, valuesToEscape: valuesToEscape });
            output[table.primaryKey] = response.insertId;

        } catch (error) {
            console.error(`DATABASE CREATE ROW ${table.label}`, inputs, query, error);
            output = { error: error.sqlMessage };
        }

        return output;
    }

    /*
        inputs
            table: { id: { dataType: MariadbEnums.DataTypes.BIGINT_UNSIGNED, ... }, ... }
            primaryValue: 1
    */
    static async readRow({ table, primaryValue, primaryField = "", fieldsToRetrieve = [], debug = (process.env.DB_DEBUG === "TRUE") }) {
        let rows = [];

        if (primaryValue.toString().length > 0) {
            let field = table.primaryKey;
            if (primaryField.length > 0 && table.schema.hasOwnProperty(primaryField)) {
                field = primaryField;
            }
            const comparison = MariadbEnums.Numerics.includes(table.schema[field].dataType) ? "eq" : "like";

            let inputs = {
                from: table.label,
                [`and_${field}_${comparison}`]: primaryValue,
                elements_per_page: 1,
                page: 0,
            };
            if (fieldsToRetrieve.length > 0) {
                inputs.fields_to_retrieve = fieldsToRetrieve.join(',');
            }

            rows = await this.listRows({
                inputs: inputs,
                debug: debug
            });
        }

        return rows.length === 1 ? rows[0] : {};
    }

    /*
        inputs
            rf listRows inputs
        outputs
            -1 by default
            an int
    */
    static async countRows({ inputs }) {
        let output = -1;

        if (inputs.hasOwnProperty("count")) {
            const rows = await this.listRows({ inputs: inputs });
            if (rows.length === 1) {
                output = parseInt(rows[0].count, 10);
            }
        }

        return output;
    }

    static async listRows({ inputs }) {
        let output = [];

        if (inputs.from && this.#tables.hasOwnProperty(inputs.from)) {
            let query = "";
            let valuesToEscape = [];
            try {
                query = MariadbTools.getSelectString({ defaultTableKey: inputs.from, tables: this.#tables, inputs: inputs });

                query += `\n${MariadbTools.getFromString({ defaultTableKey: inputs.from, tables: this.#tables })}`;

                if (inputs.hasOwnProperty("tables_joins")) {
                    const joinsLines = MariadbTools.getJoinsLines({
                        defaultTableKey: inputs.from, tables: this.#tables,
                        inputString: inputs["tables_joins"]
                    });
                    query += `\n${joinsLines.join("\n")}`;
                }

                const whereElements = MariadbTools.getWhereString({ defaultTableKey: inputs.from, tables: this.#tables, inputs: inputs });
                if (whereElements.line.length > 0) {
                    query += `\nWHERE ${whereElements.line}`;
                    valuesToEscape = whereElements.valuesToEscape;
                }

                const groupString = MariadbTools.getGroupString({ defaultTableKey: inputs.from, tables: this.#tables, inputs: inputs });
                if (groupString.length > 0) {
                    query += `\n${groupString}`;
                }

                const sortString = MariadbTools.getSortString({ defaultTableKey: inputs.from, tables: this.#tables, inputs: inputs });
                if (sortString.length > 0) {
                    query += `\n${sortString}`;
                }

                if (!inputs.hasOwnProperty("count")) {
                    const skip = MariadbTools.getSkipNumber({ elementsPerPage: inputs["elements_per_page"], page: inputs["page"] });
                    const limit = MariadbTools.getLimitNumber({ elementsPerPage: inputs["elements_per_page"] });
                    query += `\nLIMIT ${skip}, ${limit}`;
                }

                output = await this.query({ inquiry: query, valuesToEscape: valuesToEscape });
            } catch (error) {
                console.error(`DATABASE LIST ROWS`, inputs, valuesToEscape, query, error);
                output = [{ error: error.sqlMessage }];
            }
        }

        return output;
    }

    /*
        inputs
            table: { id: { dataType: ..., ... }, ... }
            primaryValue: 1
            inputs: { state: "deleted" }
    */
    static async updateRow({ table, primaryValue, inputs }) {
        let output = { affectedRows: -1 };

        let query = "";
        try {
            query = table.getUpdateRowQuery({ primaryValue: primaryValue, inputs: inputs });
            let valuesToEscape = table.getValuesToEscapte({ inputs: inputs });
            valuesToEscape.push(primaryValue);
            const response = await this.query({ inquiry: query, valuesToEscape: valuesToEscape });
            output.affectedRows = response.affectedRows;

        } catch (error) {
            console.error(`DATABASE UPDATE ROW ${table.label}.${table.primaryKey} ${primaryValue} with`, inputs, query, error);
            output = { error: error.sqlMessage };
        }

        return output;
    }

    // #endregion ROWS CRUD


    static getFilesPaths({ inputPath, recursive = true, whitelist = ["*"], output = [] }) {
        if (existsSync(inputPath)) {
            const files = readdirSync(inputPath);

            for (const file of files) {
                const filePath = `${inputPath}/${file}`;

                if (lstatSync(filePath).isDirectory()) {
                    this.getFilesPaths({ inputPath: filePath, recursive: recursive, whitelist: whitelist, output: output });

                } else {
                    if (whitelist[0] === "*") {
                        output.push(filePath);
                    } else {

                        let add = false;
                        for (const whiteKey of whitelist) {
                            add |= file.includes(whiteKey);
                        }
                        if (add) {
                            output.push(filePath);
                        }

                    }
                }
            }
        }

        return output;
    }

    static async loadTableFiles({ dirPath }) {
        const tablesFilesPaths = this.getFilesPaths({
            inputPath: dirPath,
            recursive: true,
            whitelist: ["_table.js"],
            output: []
        });
        for (const tableFilePath of tablesFilesPaths) {
            let cleanPath = tableFilePath;
            if (os.platform() === 'win32') {
                cleanPath = `file:///${cleanPath}`;
            }

            const isLoaded = await this.setTable({ inputPath: cleanPath });
            if (!isLoaded) {
                throw new Error(`Load tables: failure`);
            }
        }
        for (const tableKey of this.getTablesKeys()) {
            const isSync = await this.synchronise({ tableKey: tableKey });
            if (!isSync) {
                throw new Error(`Synchronise tables: failure`);
            }
        }
    }
}