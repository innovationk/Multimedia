import MariadbEnums from "../../tools/mariadb/mariadb_enums.js";
import MariadbTable from "../../tools/mariadb/mariadb_table.js";

export default class AlbumTable extends MariadbTable {
    static _label = `album`;

    static _schema = {
        id: { dataType: MariadbEnums.DataTypes.BIGINT_UNSIGNED, nullable: false, unique: true, autoIncrement: true },
        state: { dataType: MariadbEnums.DataTypes.ENUM, nullable: false, values: Object.values(MariadbEnums.States), default: `"${MariadbEnums.States.ACTIVE}"`, index: true },
        professional_id: { dataType: MariadbEnums.DataTypes.BIGINT_UNSIGNED, nullable: false, index: true },

        title: { dataType: MariadbEnums.DataTypes.VARCHAR, length: 512, nullable: false },
        year: { dataType: MariadbEnums.DataTypes.INT_UNSIGNED, default: 0 },

        updated: { dataType: MariadbEnums.DataTypes.UNIX_TIMESTAMP, nullable: false, default: `(UNIX_TIMESTAMP())`, onUpdate: `(UNIX_TIMESTAMP())` },
        created: { dataType: MariadbEnums.DataTypes.UNIX_TIMESTAMP, nullable: false, default: `(UNIX_TIMESTAMP())` },
    };

    static _primaryKey = "id";
}