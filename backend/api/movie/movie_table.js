import MariadbEnums from "../../tools/mariadb/mariadb_enums.js";
import MariadbTable from "../../tools/mariadb/mariadb_table.js";

export default class MovieTable extends MariadbTable {
    static _label = `movie`;

    static _schema = {
        id: { dataType: MariadbEnums.DataTypes.BIGINT_UNSIGNED, nullable: false, unique: true, autoIncrement: true },
        state: { dataType: MariadbEnums.DataTypes.ENUM, nullable: false, values: Object.values(MariadbEnums.States), default: `"${MariadbEnums.States.ACTIVE}"`, index: true },

        language: { dataType: MariadbEnums.DataTypes.ENUM, nullable: false, values: Object.values(MariadbEnums.LANGUAGES), default: `"${MariadbEnums.LANGUAGES.EN}"`, index: true },
        title: { dataType: MariadbEnums.DataTypes.VARCHAR, length: 512, nullable: false },

        updated: { dataType: MariadbEnums.DataTypes.UNIX_TIMESTAMP, nullable: false, default: `(UNIX_TIMESTAMP())`, onUpdate: `(UNIX_TIMESTAMP())` },
        created: { dataType: MariadbEnums.DataTypes.UNIX_TIMESTAMP, nullable: false, default: `(UNIX_TIMESTAMP())` },
    };

    static _primaryKey = "id";
}