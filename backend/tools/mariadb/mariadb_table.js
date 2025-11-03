import MariadbEnums from "./mariadb_enums.js";

// TODO: set if field can be updated or inserted
export default class MariadbTable {
    static _label = ``;
    static _schema = {
        id: { dataType: MariadbEnums.DataTypes.BIGINT_UNSIGNED, nullable: false, unique: true, autoIncrement: true },
        state: { dataType: MariadbEnums.DataTypes.ENUM, nullable: false, values: Object.values(MariadbEnums.States), default: `"${MariadbEnums.States.ACTIVE}"`, index: true },

        // foreign_id: { dataType: MariadbEnums.DataTypes.BIGINT_UNSIGNED, nullable: false },

        updated: { dataType: MariadbEnums.DataTypes.UNIX_TIMESTAMP, nullable: false, default: `(UNIX_TIMESTAMP())`, onUpdate: `(UNIX_TIMESTAMP())` },
        created: { dataType: MariadbEnums.DataTypes.UNIX_TIMESTAMP, nullable: false, default: `(UNIX_TIMESTAMP())` },
    };
    static _primaryKey = "id";

    // #region GETTERS

    static get label() { return this._label; }
    static get schema() { return this._schema; }
    static get primaryKey() { return this._primaryKey; }

    // #endregion GETTERS

    // #region TABLE

    static getCreateTableQuery() {
        let query = `CREATE TABLE IF NOT EXISTS \`${this._label}\` (`;

        let uniqueFields = [];
        for (const [key, settings] of Object.entries(this._schema)) {
            const fieldQuery = this._getCreateTableFieldQuery({ key: key, settings: settings });
            query += `\n\t${fieldQuery},`;

            if (settings.unique) {
                uniqueFields.push(`${key}`);
            }
        }

        query += `\n\tPRIMARY KEY(${this._primaryKey})`;
        for (const unique of uniqueFields) {
            query += `,\n\tCONSTRAINT UC_${unique} UNIQUE(${unique})`;
        }

        query += `\n) CHARACTER SET utf8mb4;`;
        return query;
    }

    static getCreateIndexesQueries() {
        let output = [];

        for (const [key, settings] of Object.entries(this._schema)) {
            if (settings.index) {
                output.push(`CREATE INDEX IDX_${this._label}_${key} ON ${this._label}(${key});`);
            }
        }

        return output;
    }

    static _getCreateTableFieldQuery({ key, settings }) {
        let output = `\`${key}\` ${settings.dataType}`;

        if (settings.dataType === MariadbEnums.DataTypes.VARCHAR) {
            output += `(${settings.length})`;
        } else if (settings.dataType === MariadbEnums.DataTypes.ENUM) {
            output += `(`;
            for (const value of settings.values) {
                output += `"${value}",`;
            }
            output = output.slice(0, -1);
            output += `)`;
        }

        if (settings.hasOwnProperty("nullable")) {
            if (settings.nullable) {
                output += ` NULL`;
            } else {
                output += ` NOT NULL`;
            }
        }
        if (settings.autoIncrement) {
            output += ` AUTO_INCREMENT`;
        }

        if (settings.hasOwnProperty("default")
            && settings.default !== "(UNIX_TIMESTAMP())" // (UNIX_TIMESTAMP()) Not available on MySQL 5.7
        ) {
            output += ` DEFAULT ${settings.default}`;
        }
        if (settings.hasOwnProperty("onUpdate")
            && settings.onUpdate !== "(UNIX_TIMESTAMP())" // (UNIX_TIMESTAMP()) Not available on MySQL 5.7
        ) {
            output += ` ON UPDATE ${settings.onUpdate}`;
        }

        // console.log(key, settings);
        // console.log(field);

        return output;
    }

    /*
        action: ADD or DROP
    */
    static getAlterTableQuery({ action, columnKey, columnSettings = {} }) {
        let query = `ALTER TABLE ${this._label}`;

        if (action === "ADD") {
            query += `\n\t ADD ${this._getCreateTableFieldQuery({ key: columnKey, settings: columnSettings })}`;
        } else if (action === "DROP") {
            query += `\n\tDROP ${columnKey}`;
        }

        return query;
    }

    // #endregion TABLE

    // #region ROWS

    static getCreateRowQuery({ inputs = {} }) {
        let fields = [];
        let values = [];
        for (const field of Object.keys(inputs)) {
            if (this._schema.hasOwnProperty(field)) {
                fields.push(`\`${field}\``);
                values.push(`?`);
            }
        }

        const timestamp = new Date().valueOf();
        if (!inputs.hasOwnProperty("created") &&
            this._schema.hasOwnProperty("created") && this._schema["created"].dataType === MariadbEnums.DataTypes.UNIX_TIMESTAMP
        ) {
            fields.push(`\`created\``);
            values.push(timestamp);
        }
        if (!inputs.hasOwnProperty("updated") &&
            this._schema.hasOwnProperty("updated") && this._schema["updated"].dataType === MariadbEnums.DataTypes.UNIX_TIMESTAMP
        ) {
            fields.push(`\`updated\``);
            values.push(timestamp);
        }

        let query = `INSERT INTO \`${this._label}\` (${fields.join(",")})`;
        query += `\nVALUES (${values.join(",")})`;

        return query;
    }

    static getUpdateRowQuery({ primaryValue: primaryValue, inputs: inputs }) {
        let fields = [];
        for (const field of Object.keys(inputs)) {
            if (this._schema.hasOwnProperty(field)) {
                fields.push(`\`${field}\` = ?`);
            }
        }

        if (!inputs.hasOwnProperty("updated") &&
            this._schema.hasOwnProperty("updated") && this._schema["updated"].dataType === MariadbEnums.DataTypes.UNIX_TIMESTAMP
        ) {
            const timestamp = new Date().valueOf();
            fields.push(`\`updated\` = ${timestamp}`);
        }

        let query = `UPDATE ${this._label}`;
        query += `\nSET\n\t${fields.join(",\n\t")}`;

        const comparator = MariadbEnums.Numerics.includes(this._schema[this._primaryKey].dataType) ? "=" : "LIKE";
        query += `\nWHERE \`${this._label}\`.\`${this._primaryKey}\` ${comparator} ?`;

        return query;
    }

    static getValuesToEscapte({ inputs = {} }) {
        let valuesToEscape = [];

        for (const [field, value] of Object.entries(inputs)) {
            if (this._schema.hasOwnProperty(field)) {
                valuesToEscape.push(this._getFormatedValue({ field: field, value: value }));
            }
        }

        return valuesToEscape;
    }

    // #endregion ROWS

    // #region VALIDATOR

    static _getFormatedValue({ field, value }) {
        let output;

        switch (this._schema[field].dataType) {
            case MariadbEnums.DataTypes.DATETIME:
                if (typeof value === "string") {
                    output = new Date(value).toISOString().slice(0, 19).replace('T', ' ');
                }

                break;
            default:
                output = value;
                break;
        }

        return output;
    }

    // #endregion VALIDATOR
}