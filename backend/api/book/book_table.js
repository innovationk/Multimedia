import MariadbEnums from "../../tools/mariadb/mariadb_enums.js";
import MariadbTable from "../../tools/mariadb/mariadb_table.js";
import BookEnums from "./book_enums.js";

export default class BookTable extends MariadbTable {
    static _label = `book`;

    static _schema = {
        id: { dataType: MariadbEnums.DataTypes.BIGINT_UNSIGNED, nullable: false, unique: true, autoIncrement: true },
        state: { dataType: MariadbEnums.DataTypes.ENUM, nullable: false, values: Object.values(MariadbEnums.States), default: `"${MariadbEnums.States.ACTIVE}"`, index: true },
        category: { dataType: MariadbEnums.DataTypes.ENUM, values: Object.values(BookEnums.Categories), index: true },

        language: { dataType: MariadbEnums.DataTypes.ENUM, nullable: false, values: Object.values(MariadbEnums.LANGUAGES), default: `"${MariadbEnums.LANGUAGES.NONE}"`, index: true },
        title: { dataType: MariadbEnums.DataTypes.VARCHAR, length: 512, nullable: false },

        updated: { dataType: MariadbEnums.DataTypes.UNIX_TIMESTAMP, nullable: false, default: `(UNIX_TIMESTAMP())`, onUpdate: `(UNIX_TIMESTAMP())` },
        created: { dataType: MariadbEnums.DataTypes.UNIX_TIMESTAMP, nullable: false, default: `(UNIX_TIMESTAMP())` },
    };

    static _primaryKey = "id";
}