import MariadbEnums from "../../tools/mariadb/mariadb_enums.js";
import MariadbTable from "../../tools/mariadb/mariadb_table.js";

const PASSWORD_LENGTH = 130; // SHA512: 128 hexadecimal digits + "0x" as hex string
const TOKEN_LENGTH = 258; // SHA512: 128 hexadecimal digits + "0x" as hex string

export default class AccountTable extends MariadbTable {
    static _label = `account`;

    static _schema = {
        id: { dataType: MariadbEnums.DataTypes.BIGINT_UNSIGNED, nullable: false, unique: true, autoIncrement: true },
        // slug: { dataType: MariadbEnums.DataTypes.VARCHAR, length: 510, nullable: false, unique: true, index: true },
        state: { dataType: MariadbEnums.DataTypes.ENUM, nullable: false, values: Object.values(MariadbEnums.States), default: `"${MariadbEnums.States.ACTIVE}"`, index: true },
        token: { dataType: MariadbEnums.DataTypes.VARCHAR, length: TOKEN_LENGTH, default: `""` },
        token_deadline: { dataType: MariadbEnums.DataTypes.UNIX_TIMESTAMP, default: 0 },

        pseudo: { dataType: MariadbEnums.DataTypes.VARCHAR, length: 255, nullable: false, unique: true },
        password: { dataType: MariadbEnums.DataTypes.VARCHAR, length: PASSWORD_LENGTH, default: `""` },
        
        admin: { dataType: MariadbEnums.DataTypes.BOOLEAN, default: 0, },

        updated: { dataType: MariadbEnums.DataTypes.UNIX_TIMESTAMP, nullable: false, default: `(UNIX_TIMESTAMP())`, onUpdate: `(UNIX_TIMESTAMP())` },
        created: { dataType: MariadbEnums.DataTypes.UNIX_TIMESTAMP, nullable: false, default: `(UNIX_TIMESTAMP())` },
    };

    static _primaryKey = "id";
}