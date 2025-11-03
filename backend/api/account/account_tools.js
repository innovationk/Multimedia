import TextTools from '../../tools/text_tools.js';
import CryptoTools from '../../tools/crypto_tools.js';
import MariadbConnector from '../../tools/mariadb/mariadb_connector.js';
import MariadbEnums from '../../tools/mariadb/mariadb_enums.js';
import AccountTable from './account_table.js';

// RFC 2822
// eslint-disable-next-line
const MAIL_FORMAT = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export default class AccountTools {
    static async getAuthorisedAccount({ token_id, token, rights = {} }) {
        let output = {};

        if (token_id && token_id.length > 0 && token && token.length > 0) {
            let inputs = {
                ...rights,
                ...{
                    from: AccountTable.label,
                    and_account_id_eq: token_id,
                    and_token_like: token,
                    and_state_like: MariadbEnums.States.ACTIVE,
                    elements_per_page: Number.MAX_SAFE_INTEGER
                }
            };

            const accounts = await MariadbConnector.listRows({ inputs: inputs });
            if (accounts.length > 0 && accounts[0][`account.id`] > 0) {
                const now = (new Date()).valueOf();
                const isTokenValid = accounts[0][`account.token_deadline`] - now > 0;
                if (isTokenValid) {
                    output = accounts[0];
                }
            }
        }

        return output;
    }

    static generatePassword() {
        const upperStart = TextTools.randomString({ length: 1, candidates: TextTools.BASIC_UPPER_CASE_CHARACTERS });
        const specialStart = TextTools.randomString({ length: 1, candidates: TextTools.SPECIAL_CHARACTERS });
        const numberStart = TextTools.getRandomInt({ max: 100 });
        const lower = TextTools.randomString({ length: 10, candidates: TextTools.BASIC_LOWER_CASE_CHARACTERS });
        const numberEnd = TextTools.getRandomInt({ max: 100 });
        const specialEnd = TextTools.randomString({ length: 1, candidates: TextTools.SPECIAL_CHARACTERS });
        const upperEnd = TextTools.randomString({ length: 1, candidates: TextTools.BASIC_UPPER_CASE_CHARACTERS });

        return `${upperStart}${specialStart}${numberStart}${lower}${numberEnd}${specialEnd}${upperEnd}`;
    }

    static generateToken() {
        return CryptoTools.randomString({ length: 128 });
    }

    static encrypt({ text }) {
        return CryptoTools.sha512({ text: text });
    }

    static async isPseudoValid({ pseudo }) {
        let output = false;

        if (pseudo.length >= 5) {
            const slug = TextTools.generateSlug(pseudo);
            const count = await MariadbConnector.countRows({
                inputs: {
                    from: AccountTable.label,
                    and_slug_like: slug,
                    and_state_in: Object.values(MariadbEnums.States).join(','),
                    count: AccountTable.primaryKey
                }
            });
            output = count === 0;
        }

        return output;
    }

    static isPasswordValid({ string }) {
        return string.length >= 8
            && TextTools.haveAtLeastOne({ string: string, array: TextTools.SPECIAL_CHARACTERS })
            && TextTools.haveAtLeastOne({ string: string, array: TextTools.NUMBER_CHARACTERS })
            && TextTools.haveAtLeastOne({ string: string, array: TextTools.LOWER_CASE_CHARACTERS })
            && TextTools.haveAtLeastOne({ string: string, array: TextTools.UPPER_CASE_CHARACTERS })
            && string === TextTools.filterAllowed({ string: string, array: TextTools.ALL_CHARACTERS })
            ;
    }

    static async isEmailValid({ string }) {
        let output = false;

        if (typeof string !== "undefined" && MAIL_FORMAT.test(string)) {
            const count = await MariadbConnector.countRows({
                inputs: {
                    from: AccountTable.label,
                    and_email_like: string,
                    and_state_in: Object.values(MariadbEnums.States).join(','),
                    count: AccountTable.primaryKey
                }
            });
            output = count === 0;
        }

        return output;
    }
}