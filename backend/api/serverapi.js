import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import os from "os";
import Logger from '../tools/logger.js';
import FsTools from '../tools/fs_tools.js';
import MariadbConnector from '../tools/mariadb/mariadb_connector.js';
import MariadbEnums from '../tools/mariadb/mariadb_enums.js';

const SIZE_MAX = '50mb';
const API_DIR_PATH = `${process.cwd()}/api`;

export default class ServerAPI {
    static async loadTables() {
        const tablesFilesPaths = FsTools.getFilesPaths({
            inputPath: API_DIR_PATH,
            recursive: true,
            whitelist: ["_table.js"],
            output: []
        });
        for (const tableFilePath of tablesFilesPaths) {
            let cleanPath = tableFilePath;
            if (os.platform() === 'win32') {
                cleanPath = `file:///${cleanPath}`;
            }

            const isLoaded = await MariadbConnector.setTable({ inputPath: cleanPath });
            if (!isLoaded) {
                if (process.env.NODE_ENV === "development") {
                    Logger.write(cleanPath, Logger.LEVEL.CRITICAL);
                }

                throw new Error(`Load tables: failure`);
            }
        }
    }

    static async synchroniseTables() {
        for (const tableKey of MariadbConnector.getTablesKeys()) {
            const isSync = await MariadbConnector.synchronise({ tableKey: tableKey });
            if (!isSync) {
                throw new Error(`Synchronise tables: failure`);
            }
        }
    }

    static async listen() {
        try {
            const server = express();
            server.use(express.urlencoded({ extended: true, limit: SIZE_MAX }));
            server.use(express.json({ limit: SIZE_MAX }));
            server.use(bodyParser.urlencoded({ extended: false }));
            server.use(bodyParser.json());

            let allowedOrigins = [];
            if (process.env.NODE_ENV === "production") {
                allowedOrigins = [
                    "https://multimedia.innovation.fr",
                ];
            }

            if (allowedOrigins.length > 0) {
                const corsOptions = {
                    origin: (origin, callback) => {
                        if (allowedOrigins.includes(origin)) {
                            callback(null, true);
                        } else {
                            callback(new Error('Not allowed'));
                        }
                    },
                };
                server.use(cors(corsOptions));
            } else {
                server.use(cors({ origin: '*' }));
            }


            // #region Link routes

            await this.#connectRouter(server);

            // #endregion Link routes


            // #region Default error handler

            server.get('/api/hello', (req, res) => {
                res.status(200).json({ message: 'Greetings!' });
            });

            server.use(function (req, res) {
                if (!res.headersSent) {
                    Logger.write(`API default error handler for ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);

                    // For security, the server won't distinguish if the route exists or not
                    res.status(401).json({
                        message: MariadbEnums.DEFAULT_UNAUTHORISED_MESSAGE
                    });
                }
            });

            // #endregion  Default error handler

            if (process.env.PHUSION_PASSENGER && process.env.PHUSION_PASSENGER === "TRUE") {
                server.listen('passenger');
                Logger.write(`Server and API listening with passenger params`, Logger.LEVEL.SUCCESS);

            } else {
                let port;
                if (process.env.API_PORT) {
                    port = parseInt(process.env.API_PORT);
                }

                if (port > 0) {
                    server.listen(port, function () {
                        Logger.write(`Server and API listening on port ${port}`, Logger.LEVEL.SUCCESS);
                    });
                } else {
                    server.listen();
                    Logger.write(`Server and API listening with default params`, Logger.LEVEL.SUCCESS);
                }
            }


        } catch (err) {
            Logger.write(err.stack, Logger.LEVEL.CRITICAL);
            throw err;
        }
    }

    static async #connectRouter(server) {
        Logger.write(`## Connect Router: BEGIN`);

        const routersPaths = FsTools.getFilesPaths({ inputPath: API_DIR_PATH, recursive: true, whitelist: ["_router.js"] });
        for (const routerPath of routersPaths) {
            try {
                let cleanPath = routerPath;
                if (os.platform() === 'win32') {
                    cleanPath = `file:///${cleanPath}`;
                }

                const router = await import(cleanPath);
                server.use(`/api`, router.default);

                for (const layer of router.default.stack) {
                    for (const method of Object.keys(layer.route.methods)) {
                        Logger.write(`API route: ${method.toUpperCase()} /api${layer.route.path}`, Logger.LEVEL.SUCCESS);
                    }
                }

            } catch (err) {
                Logger.write(err.stack, Logger.LEVEL.CRITICAL);
                throw err;
            }
        }

        Logger.write(`## Connect Router: END`);
    }
}