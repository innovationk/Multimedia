import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import Logger from './tools/logger.js';
import MariadbConnector from './tools/mariadb/mariadb_connector.js';
import ServerAPI from './api/serverapi.js'

process.on('SIGINT', function () {
    Logger.write("\n\nGoodbye!");
    process.exit(0);
});

async function main() {
    Logger.write("Greetings!\n\n");

    try {
        const isReady = await MariadbConnector.isReady();
        if (!isReady) {
            throw new Error(`Connection to database: failure`);
        }
        Logger.write(`Connection to database: success`, Logger.LEVEL.SUCCESS);

        await ServerAPI.loadTables();
        Logger.write(`Load tables: success`, Logger.LEVEL.SUCCESS);

        await ServerAPI.synchroniseTables();
        Logger.write(`Synchronise tables: success`, Logger.LEVEL.SUCCESS);

        await ServerAPI.listen();

    } catch (err) {
        Logger.write(err.stack);
        throw err;
    }
}
main();