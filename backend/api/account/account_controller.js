import CryptoTools from '../../tools/crypto_tools.js';
import MariadbConnector from '../../tools/mariadb/mariadb_connector.js';
import MariadbEnums from '../../tools/mariadb/mariadb_enums.js';
import Controller from '../controller.js';
import AccountTable from "./account_table.js";
import AccountTools from './account_tools.js';
import DateTools from '../../tools/date_tools.js';
import TextTools from '../../tools/text_tools.js';

const TOKEN_DEADLINE = 2 * DateTools.DAY_IN_MS;

export default class AccountController extends Controller {
    static _mainTable = AccountTable;

    // TODO: field security
    // static async list(req, res, next) {
    //     if (req.query.count || req.query.and_slug_like) {
    //         super.list(req, res, next);
    //     } else {
    //         this.sendError({ req: req, res: res, message: MariadbEnums.DEFAULT_UNAUTHORISED_MESSAGE, statusCode: 401 });
    //     }
    // }

    static async create(req, res, next) {
        if (req.body.email && req.body.password
            // && req.body.pseudo
        ) {
            let validElements = {};
            validElements.email = await AccountTools.isEmailValid({ string: req.body.email });
            validElements.password = AccountTools.isPasswordValid({ string: req.body.password });
            let sumValid = 0;
            for (const row of Object.values(validElements)) {
                sumValid += row ? 1 : 0;
            }

            if (sumValid === Object.keys(validElements).length) {

                // if (await AccountTools.isPseudoValid({ pseudo: req.body.pseudo })) {
                    req.body.password = AccountTools.encrypt({ text: req.body.password });
                // req.body.slug = TextTools.generateSlug(req.body.pseudo);
                    await super.create(req, res, next, async ({ row }) => {
                        // TODO send email welcome
                    });

                // } else {
                //     super.sendError({ req: req, res: res, message: `Pseudo's length must be equal or greater than 3 and must not be already taken.` });
                // }

            } else {
                let message = "";
                if (!validElements.email) { message += `${message.length > 0 ? " " : ""}The email address is not valid (RFC 2822).`; }
                if (!validElements.password) {
                    message += `${message.length > 0 ? " " : ""} The password is not valid.`;
                    message += ` Its length must be equal or greater than 8.`;
                    message += ` The string must contain at least 1 lowercase alphabetical character.`;
                    message += ` The string must contain at least 1 uppercase alphabetical character.`;
                    message += ` The string must contain at least 1 numeric character.`;
                    message += ` The string must contain at least one special character: ${TextTools.SPECIAL_CHARACTERS.join(" ")}.`;
                    message += ` All characters are authorised.`;
                }
                super.sendError({ req: req, res: res, message: message });
            }
        } else {
            super.sendError({ req: req, res: res, message: "Wrong parameters in body: email, password, pseudo" });
        }
    }

    static async login(req, res, next) {
        if (req.body.pseudo && req.body.password) {
            const accounts = await MariadbConnector.listRows({
                inputs: {
                    from: AccountTable.label,
                    and_pseudo_like: req.body.pseudo,
                    and_password_like: AccountTools.encrypt({ text: req.body.password }),
                    and_state_like: MariadbEnums.States.ACTIVE
                }
            });

            if (accounts.length === 1) {
                const token = AccountTools.generateToken();
                const tokenDeadline = (new Date()).valueOf() + TOKEN_DEADLINE;
                await MariadbConnector.updateRow({
                    table: AccountTable, 
                    primaryValue: accounts[0].id, 
                    inputs: {
                        token: token,
                        token_deadline: tokenDeadline,
                    }
                });

                console.log(accounts[0]);

                res.status(200).json({
                    token_id: accounts[0].id,
                    token: token,
                    token_deadline: tokenDeadline,
                    hash: CryptoTools.sha512({ text: `${accounts[0].id}_${token}_${tokenDeadline}` }),
                    // pseudo: accounts[0].pseudo,
                    // slug: accounts[0].slug,
                    admin: accounts[0].admin
                });

            } else {
                this.sendError({ req: req, res: res, statusCode: 401, message: `Wrong parameters in the body: email or password.` });
            }
        } else {
            super.sendError({ req: req, res: res, message: "Missing parameters in body: email, password" });
        }
    }

    static async logout(req, res, next) {
        await MariadbConnector.updateRow({
            table: AccountTable, 
            primaryValue: req.body.token, 
            inputs: {
                token: "",
                token_deadline: 0,
            }
        });
        res.status(200).json({});
    }
}