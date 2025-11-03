import assert from 'assert';
import DummyResponse from "./dummy_response.js";
import MariadbConnector from '../tools/mariadb/mariadb_connector.js';
import AccountController from '../api/account/account_controller.js';

const USER_PASSWORD = "Demo!123456";
const USERS = [
    { pseudo: "ElayneTrakand", password: USER_PASSWORD, admin: 1 },
    { pseudo: "MoiraineDamodred", password: USER_PASSWORD },
    { pseudo: "NynaeveAlMeara", password: USER_PASSWORD },
]

describe('Init', function () {
    before(`Prerequisites`, async function () {
        await MariadbConnector.loadTableFiles({ dirPath: `${process.cwd()}/api` });
    });

    it(`Users`, async function () {
        for (let iUser = 0; iUser < USERS.length; ++iUser) {
            let response = new DummyResponse();
            
            await AccountController.create({
                body: {...USERS[iUser]}
            }, response);

            assert.strictEqual(response.code, 201);
        }
    });

    it(`Login`, async function () {
        for (let iUser = 0; iUser < USERS.length; ++iUser) {
            let response = new DummyResponse();
            
            await AccountController.login({
                body: {...USERS[iUser]}
            }, response);

            assert.strictEqual(response.data.token_deadline > 0, true);
        }
    });
});