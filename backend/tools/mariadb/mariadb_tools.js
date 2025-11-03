import { existsSync, readdirSync, lstatSync } from 'node:fs';

import MariadbEnums from './mariadb_enums.js';
import { table } from 'node:console';

export default class MariadbTools {

    static getTablesFilesPaths({ inputPath = `${process.cwd()}` }) {
        return this.#getFilesPaths({
            inputPath: inputPath,
            recursive: true,
            whitelist: ["_table.js"],
            output: []
        });
    }

    static #getFilesPaths({ inputPath, recursive = true, whitelist = ["*"], output = [] }) {
        if (existsSync(inputPath)) {
            const files = readdirSync(inputPath);

            for (const file of files) {
                const path = `${inputPath}/${file}`;

                if (lstatSync(path).isDirectory()) {
                    this.#getFilesPaths({ inputPath: path, recursive: recursive, whitelist: whitelist, output: output });

                } else {
                    if (whitelist[0] === "*") {
                        output.push(path);
                    } else {

                        let add = false;
                        for (const whiteKey of whitelist) {
                            add |= file.includes(whiteKey);
                        }
                        if (add) {
                            output.push(path);
                        }

                    }
                }
            }
        }

        return output;
    }

    // ====================================================

    static getSelectString({ defaultTableKey, tables, inputs }) {
        let selectElements = [];

        if (inputs.hasOwnProperty("count")) {
            /*
                inputKey: count
                inputValue: 
                    my_table.my_field
                    my_field
            */
            const table = this.extractTable({ defaultTableKey: defaultTableKey, tables: tables, inputString: inputs["count"] });
            const field = this.extractTableField({ table: table, inputString: inputs["count"] });
            selectElements.push(` COUNT(\`${table.label}\`.\`${field}\`) AS count `);
        }
        if (inputs.hasOwnProperty("count_distinct")) {
            /*
                inputKey: count_distinct
                inputValue: 
                    my_table.my_field
                    my_field
            */
            const table = this.extractTable({ defaultTableKey: defaultTableKey, tables: tables, inputString: inputs["count_distinct"] });
            const field = this.extractTableField({ table: table, inputString: inputs["count_distinct"] });
            selectElements.push(` COUNT(DISTINCT(\`${table.label}\`.\`${field}\`)) AS count `);
        }
        if (inputs.hasOwnProperty("distinct")) {
            /*
                inputKey: distinct
                inputValue: 
                    my_field1
                    my_table.my_field1,my_table.my_field2
                    my_field1,my_field2
            */
            const table = this.extractTable({ defaultTableKey: defaultTableKey, tables: tables, inputString: inputs["distinct"] });
            const field = this.extractTableField({ table: table, inputString: inputs["distinct"] });
            selectElements.push(` DISTINCT(\`${table.label}\`.\`${field}\`) `);
        }
        if (inputs.hasOwnProperty("sum")) {
            /*
                inputKey: sum
                inputValue: 
                    my_table.my_field
                    my_field
            */
            const table = this.extractTable({ defaultTableKey: defaultTableKey, tables: tables, inputString: inputs["sum"] });
            const field = this.extractTableField({ table: table, inputString: inputs["sum"] });
            selectElements.push(` SUM(\`${table.label}\`.\`${field}\`) AS sum `);
        }
        if (inputs.hasOwnProperty("fields_to_retrieve")) {
            /*
                inputKey: fields_to_retrieve
                inputValue: 
                    my_field1
                    my_table.my_field1,my_table.my_field2
                    my_field1,my_field2
            */
            const elements = inputs["fields_to_retrieve"].split(",");
            for (const element of elements) {
                const table = this.extractTable({ defaultTableKey: defaultTableKey, tables: tables, inputString: element });
                const field = this.extractTableField({ table: table, inputString: element });

                selectElements.push(` \`${table.label}\`.\`${field}\` AS "${table.label}.${field}" `);
            }
        }

        if (selectElements.length === 0) {
            if (inputs.hasOwnProperty("tables_joins")) {
                let tablesToSelect = {};
                const tablesLinks = inputs["tables_joins"].split(",");
                for (const tableLink of tablesLinks) {
                    const links = tableLink.split('-');
                    const leftTable = this.extractTable({ defaultTableKey: defaultTableKey, tables: tables, inputString: links[0] });
                    const rightTable = this.extractTable({ defaultTableKey: defaultTableKey, tables: tables, inputString: links[1] });
                    tablesToSelect[leftTable.label] = leftTable;
                    tablesToSelect[rightTable.label] = rightTable;
                }

                let fields = [];
                for (const table of Object.values(tablesToSelect)) {
                    for (const field of Object.keys(table.schema)) {
                        fields.push(`\`${table.label}\`.\`${field}\` as "${table.label}.${field}"`);
                    }
                }
                selectElements.push(` ${fields.join(", ")} `);

            } else {
                // Default case
                // selectElements.push(" * ");

                for(const field of Object.keys(tables[defaultTableKey].schema)) {
                    selectElements.push(` \`${tables[defaultTableKey].label}\`.\`${field}\` AS "${tables[defaultTableKey].label}.${field}" `);
                }
            }
        }

        return `SELECT ${selectElements.join(" ,")}`;
    }

    static getFromString({ defaultTableKey, tables }) {
        return `FROM \`${[tables[defaultTableKey].label]}\` `;
    }

    /*
        inputString:
            tables_joins = left_table1.left_field-right_table1.right_field
            tables_joins = left_table1.left_field-right_table1.right_field,left_table2.left_field-right_table2.right_field
    */
    static getJoinsLines({ defaultTableKey, tables, inputString }) {
        let output = [];

        const tablesLinks = inputString.split(',');
        for (const tableLink of tablesLinks) {
            const links = tableLink.split('-');

            const leftTable = this.extractTable({ defaultTableKey: defaultTableKey, tables: tables, inputString: links[0] });
            const leftField = this.extractTableField({ table: leftTable, inputString: links[0] });

            const rightTable = this.extractTable({ defaultTableKey: defaultTableKey, tables: tables, inputString: links[1] });
            const rightField = this.extractTableField({ table: rightTable, inputString: links[1] });

            // output.push(`INNER JOIN \`${rightTable.label}\` ON \`${leftTable.label}\`.\`${leftField}\` = \`${rightTable.label}\`.\`${rightField}\` `);
            output.push(`LEFT JOIN \`${rightTable.label}\` ON \`${leftTable.label}\`.\`${leftField}\` = \`${rightTable.label}\`.\`${rightField}\` `);
        }

        return output;
    }

    /*
        inputString:
            and_id_eq
            and_label_in
        inputValue:
            1
            "%lorem%,%ipsum%"
    */
    static getWhereElements({ defaultTableKey, tables, inputString, inputValue }) {
        let output = {
            table: "",
            field: "",
            logicalOperator: "",
            comparisonOperator: "",
            valueToEscape: [],
        };

        const table = this.extractTable({ defaultTableKey: defaultTableKey, tables: tables, inputString: inputString });
        output.table = table.label;
        output.field = this.extractTableField({ table: table, inputString: inputString });
        output.logicalOperator = this.extractLogicalOperator({ inputString });
        output.comparisonOperator = this.extractComparisonOperator({ table: table, field: output.field, inputString: inputString });

        if (typeof inputValue === 'string' && inputValue.toLowerCase() === "isnull") {
            output.comparisonOperator = "IS NULL";
        } else if (typeof inputValue === 'string' && inputValue.toLowerCase() === "isnotnull") {
            output.comparisonOperator = "IS NOT NULL";
        } else {
            if (typeof inputValue === 'string') {
                output.valueToEscape = inputValue.split(",");
            } else {
                output.valueToEscape.push(inputValue);
            }
        }

        return output;
    }

    static getWhereString({ defaultTableKey, tables, inputs }) {
        let output = { line: "", valuesToEscape: [] };

        let whereLines = [];
        let valuesToEscape = [];
        for (const [inputKey, inputValue] of Object.entries(inputs)) {
            if (!MariadbEnums.WHERE_KEYS_BLACKLIST.includes(inputKey)) {
                const whereElements = MariadbTools.getWhereElements({
                    defaultTableKey: defaultTableKey, tables: tables,
                    inputString: inputKey,
                    inputValue: inputValue
                });

                let whereLine = `\`${whereElements.table}\`.\`${whereElements.field}\` ${whereElements.comparisonOperator}`;
                if (whereElements.valueToEscape.length === 0) {
                    // isnull and isnotnull case
                    whereLines.push(`${whereLines.length === 0 ? "" : whereElements.logicalOperator} ${whereLine}`);

                } else {
                    if (whereElements.comparisonOperator === "IN" || whereElements.comparisonOperator === "NOT IN") {
                        whereLine += ` ( `;
                        let questionMarksArray = [];
                        for (let iSubValEsc = 0; iSubValEsc < whereElements.valueToEscape.length; ++iSubValEsc) {
                            questionMarksArray.push('?');
                            valuesToEscape.push(whereElements.valueToEscape[iSubValEsc]);
                        }
                        whereLine += questionMarksArray.join(", ");
                        whereLine += ` ) `;

                        whereLines.push(`${whereLines.length === 0 ? "" : whereElements.logicalOperator} ${whereLine}`);

                    } else {
                        // Default case
                        for (let iSubValEsc = 0; iSubValEsc < whereElements.valueToEscape.length; ++iSubValEsc) {
                            whereLines.push(`${whereLines.length === 0 ? "" : whereElements.logicalOperator} ${whereLine} ? `);
                            valuesToEscape.push(whereElements.valueToEscape[iSubValEsc]);
                        }
                    }
                }
            }
        }

        if (whereLines.length > 0) {
            output.line += whereLines.join("\n\t");
            output.valuesToEscape = valuesToEscape;
        }

        return output;
    }

    /*
        inputString:
            group_by = my_table.my_field
            group_by = my_field
    */
    static getGroupString({ defaultTableKey, tables, inputs }) {
        let output = ``;

        const isDefaultCase = this.isDefaultGroupCase({ inputs: inputs });
        if (isDefaultCase) {
            const table = tables[defaultTableKey];
            output = `GROUP BY \`${table.label}\`.\`${table.primaryKey}\``;

        } else if (inputs["group_by"]) {
            const table = this.extractTable({ defaultTableKey: defaultTableKey, tables: tables, inputString: inputs["group_by"] });
            const field = this.extractTableField({ table: table, inputString: inputs["group_by"] });
            output = `GROUP BY \`${table.label}\`.\`${field}\``;
        }

        return output;
    }

    /*
        inputString:
            sort = my_field_DESC
            sort = my_field1_ASC,my_field2_DESC
            sort = my_table1.my_field1_ASC,my_table1.my_field2_DESC
    */
    static getSortString({ defaultTableKey, tables, inputs }) {
        let output = ``;

        const isDefaultCase = this.isDefaultSortCase({ inputs: inputs });
        if (isDefaultCase) {
            const table = tables[defaultTableKey];
            output = `ORDER BY \`${table.label}\`.\`${table.primaryKey}\` ASC`;

        } else if (inputs["sort"]) {

            if (inputs["sort"] === "RAND") {
                output = `ORDER BY RAND()`;

            } else {
                let orderByArray = [];
                const sortElements = inputs["sort"].split(",");
                let table;
                for (const element of sortElements) {
                    table = this.extractTable({ defaultTableKey: defaultTableKey, tables: tables, inputString: element });

                    const pointElements = element.split(".");
                    const lastPointElement = pointElements[pointElements.length - 1];
                    const underscoreElements = lastPointElement.split("_");

                    const lastUnderscoreElement = (underscoreElements.pop()).toUpperCase();
                    let direction = "ASC";
                    if (MariadbEnums.SORT_DIRECTIONS.includes(lastUnderscoreElement)) {
                        direction = lastUnderscoreElement;
                    }

                    let field = table.schema.primaryKey;
                    const fieldToTest = underscoreElements.join("_");
                    if (table.schema.hasOwnProperty(fieldToTest)) {
                        field = fieldToTest;
                    }

                    orderByArray.push(`\`${table.label}\`.\`${field}\` ${direction}`);
                }
                if (orderByArray.length > 0) {
                    output += `ORDER BY ${orderByArray.join(" , ")}`;
                }
            }
        }

        return output;
    }

    /*
        inputs:
            elements_per_page = 10
            page = 3
        outputs:
            30
    */
    static getSkipNumber({ elementsPerPage, page }) {
        const countElements = parseInt(elementsPerPage) || 20;
        const countPage = parseInt(page) || 0;
        return countPage * countElements;
    }

    /*
        inputs:
            elements_per_page = 10
        outputs:
            10
    */
    static getLimitNumber({ elementsPerPage }) {
        return parseInt(elementsPerPage) || 20;
    }

    // // ====================================================

    /*
        inputString:
            my_table.my_field
            my_field
            and_my_field_like
            and_my_table.my_field_like
        output:
            my_table = { id: { dataType: MariadbEnums.DataTypes.BIGINT_UNSIGNED, ... }, ... }
    */
    static extractTable({ defaultTableKey, tables, inputString }) {
        let output = tables[defaultTableKey];

        const elements = inputString.split('.');
        if (elements.length === 2) {
            let candidate = elements[0];

            let subElements = elements[0].split("_");
            if (MariadbEnums.LOGICAL_OPERATORS.includes(subElements[0])) {
                subElements.shift();
                candidate = subElements.join("_");
            }

            if (tables.hasOwnProperty(candidate)) {
                output = tables[candidate];
            }
        }

        return output;
    }

    /*
        inputString: 
            my_table.my_field
            my_field
            and_my_field_like
            and_my_table.my_field_like
        output:
            my_field
    */
    static extractTableField({ table, inputString }) {
        let output = table.primaryKey;

        const elements = inputString.split('.');
        const element = elements.length === 1 ? elements[0] : elements[1];

        if (element.includes("_")) {
            let subElements = element.split("_");

            if (MariadbEnums.LOGICAL_OPERATORS.includes(subElements[0])) {
                subElements.shift();
            }
            if (MariadbEnums.COMPARISON_OPERATORS_TEXT.includes(subElements[subElements.length - 1])
                || MariadbEnums.COMPARISON_OPERATORS_NUMBERS.includes(subElements[subElements.length - 1])
                || MariadbEnums.SORT_DIRECTIONS.includes(subElements[subElements.length - 1])
            ) {
                subElements.pop();
            }

            const field = subElements.join("_");
            if (table.schema.hasOwnProperty(field)) {
                output = field;
            }

        } else if (table.schema.hasOwnProperty(element)) {
            // && !element.includes("_")
            output = element;
        }

        return output;
    }

    /*
        inputString: 
            and_my_field_like
            or_my_field_eq
        output:
            and
            or
    */
    static extractLogicalOperator({ inputString }) {
        let output = "AND";

        const elements = inputString.split("_");
        if (MariadbEnums.LOGICAL_OPERATORS.includes(elements[0])) {
            output = elements[0].toUpperCase();
        }

        return output;
    }

    /*
        inputString: 
            and_my_field_like
            or_my_field_eq
        output:
            like
            =
    */
    static extractComparisonOperator({ table, field, inputString }) {
        let output = "=";

        const elements = inputString.split("_");
        if (table.schema.hasOwnProperty(field) && table.schema[field].hasOwnProperty("dataType") && elements.length >= 3) {
            let validator = [];
            switch (table.schema[field].dataType) {
                case MariadbEnums.DataTypes.VARCHAR:
                case MariadbEnums.DataTypes.TEXT:
                case MariadbEnums.DataTypes.MEDIUMTEXT:
                case MariadbEnums.DataTypes.LONGTEXT:
                case MariadbEnums.DataTypes.ENUM:
                    validator = MariadbEnums.COMPARISON_OPERATORS_TEXT;
                    break;
                case MariadbEnums.DataTypes.TINYINT:
                case MariadbEnums.DataTypes.SMALLINT:
                case MariadbEnums.DataTypes.MEDIUMINT:
                case MariadbEnums.DataTypes.INT:
                case MariadbEnums.DataTypes.BIGINT:
                case MariadbEnums.DataTypes.TINYINT_UNSIGNED:
                case MariadbEnums.DataTypes.SMALLINT_UNSIGNED:
                case MariadbEnums.DataTypes.MEDIUMINT_UNSIGNED:
                case MariadbEnums.DataTypes.INT_UNSIGNED:
                case MariadbEnums.DataTypes.BIGINT_UNSIGNED:
                case MariadbEnums.DataTypes.DOUBLE:
                case MariadbEnums.DataTypes.UNIX_TIMESTAMP:
                    validator = MariadbEnums.COMPARISON_OPERATORS_NUMBERS;
                    break;
                case MariadbEnums.DataTypes.BOOLEAN:
                    validator = MariadbEnums.COMPARISON_OPERATORS_BOOLEAN;
                    break;
                default:
                    console.error(`MySQLTools extractComparisonOperator - datatype not found: ${table.label}.${fieldName}`);
                    break;
            }

            let comparator = elements[elements.length - 1];
            if (validator.includes(comparator)) {
                switch (comparator) {
                    case "like":
                        output = `LIKE`;
                        break;
                    case "nlike":
                        output = `NOT LIKE`;
                        break;
                    case "eq":
                        output = `=`;
                        break;
                    case "ne":
                        output = `!=`;
                        break;
                    case "gt":
                        output = `>`;
                        break;
                    case "gte":
                        output = `>=`;
                        break;
                    case "lt":
                        output = `<`;
                        break;
                    case "lte":
                        output = `<=`;
                        break;
                    case "in":
                        output = `IN`;
                        break;
                    case "nin":
                        output = `NOT IN`;
                        break;
                    default:
                        output = '';
                        break;
                }
            }

        } else {
            console.error(`MySQLTools extractComparisonOperator - ${inputString} -> ${table.label}.${field} not found in schema`);
        }

        return output;
    }

    static isDefaultSortCase({ inputs }) {
        return !inputs.hasOwnProperty("sort")
            && !inputs.hasOwnProperty("tables_joins")

            && !inputs.hasOwnProperty("fields_to_retrieve")
            && !inputs.hasOwnProperty("count")
            && !inputs.hasOwnProperty("distinct")
            && !inputs.hasOwnProperty("count_distinct");
    }

    static isDefaultGroupCase({ inputs }) {
        return !inputs.hasOwnProperty("group_by")
            && !inputs.hasOwnProperty("tables_joins")

            && !inputs.hasOwnProperty("fields_to_retrieve")
            && !inputs.hasOwnProperty("count")
            && !inputs.hasOwnProperty("distinct")
            && !inputs.hasOwnProperty("count_distinct");
    }
}