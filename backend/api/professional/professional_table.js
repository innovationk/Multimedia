import MariadbEnums from "../../tools/mariadb/mariadb_enums.js";
import MariadbTable from "../../tools/mariadb/mariadb_table.js";

export default class ProfessionalTable extends MariadbTable {
    static _label = `professional`;

    static _schema = {
        id: { dataType: MariadbEnums.DataTypes.BIGINT_UNSIGNED, nullable: false, unique: true, autoIncrement: true },
        state: { dataType: MariadbEnums.DataTypes.ENUM, nullable: false, values: Object.values(MariadbEnums.States), default: `"${MariadbEnums.States.ACTIVE}"`, index: true },

        name: { dataType: MariadbEnums.DataTypes.VARCHAR, length: 512, nullable: false },
        surname: { dataType: MariadbEnums.DataTypes.VARCHAR, length: 512, default: `""` },

        music: { dataType: MariadbEnums.DataTypes.BOOLEAN, default: 0, },
        movie: { dataType: MariadbEnums.DataTypes.BOOLEAN, default: 0, },

        updated: { dataType: MariadbEnums.DataTypes.UNIX_TIMESTAMP, nullable: false, default: `(UNIX_TIMESTAMP())`, onUpdate: `(UNIX_TIMESTAMP())` },
        created: { dataType: MariadbEnums.DataTypes.UNIX_TIMESTAMP, nullable: false, default: `(UNIX_TIMESTAMP())` },
    };

    static _primaryKey = "id";
}