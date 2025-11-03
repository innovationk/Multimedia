import fs from "node:fs";
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const LEVEL = {
    NORMAL: 0,
    SUCCESS: 1,
    WARNING: 2,
    CRITICAL: 3,
};

const LEVEL_COLOUR = {
    [LEVEL.NORMAL]: "\x1b[34m",
    [LEVEL.SUCCESS]: "\x1b[32m",
    [LEVEL.WARNING]: "\x1b[33m",
    [LEVEL.CRITICAL]: "\x1b[31m",
};

export default class Logger {
    static #outputDirPath = `${process.cwd()}${process.env.LOGGER_DIR_PATH_RELATIVE || "/logs"}`;
    static #maxFileSize = parseInt(process.env.LOGGER_MAX_SIZE_BYTES || 51200000); // 1 024 000 bytes = 1MB -> 50MB = 51 200 000
    static #rootName = this.#getRootName();
    static #fileIndex = 0;
    static get LEVEL() { return LEVEL; }

    static #getRootName() {
        const today = new Date();
        const year = today.getUTCFullYear();
        const month = (today.getUTCMonth() + 1).toString().padStart(2, "0");
        const day = (today.getUTCDate()).toString().padStart(2, "0");
        return `${year}${month}${day}`;
    }

    static #getDate() {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
        const day = (now.getUTCDate()).toString().padStart(2, "0");
        const hours = (now.getUTCHours()).toString().padStart(2, "0");
        const seconds = (now.getUTCSeconds()).toString().padStart(2, "0");
        const milliseconds = (now.getMilliseconds()).toString().padStart(3, "0");
        return `${year}${month}${day} ${hours}:${seconds}:${milliseconds}`;
    }

    static write(message, level = LEVEL.NORMAL) {
        let log = message;
        if (typeof message === "object") {
            log = JSON.stringify(message, null, 4);
        }

        if (process.env.LOGGER_DEBUG === "TRUE") {
            console.log(`${LEVEL_COLOUR[level]}${log}\x1b[0m`);
        }

        if (process.env.LOGGER_SAVE === "TRUE") {
            fs.appendFileSync(
                this.#getFilePath(),
                `${this.#getDate()} ${log}\n`
            );
        }
    }

    static #getFilePath() {
        fs.mkdirSync(this.#outputDirPath, { recursive: true });
        let filePath = `${this.#outputDirPath}`;

        const rootName = this.#getRootName();
        if (rootName != this.#rootName) {
            this.#rootName = rootName;
            this.#fileIndex = 0;
        }
        filePath += `/${rootName}`;

        let pathToTest = `${filePath}_${this.#fileIndex}.log`;
        if (fs.existsSync(pathToTest)) {
            const stats = fs.statSync(pathToTest);
            if (stats.size > this.#maxFileSize) {
                ++this.#fileIndex;
            }
        }
        filePath += `_${this.#fileIndex}.log`;

        return filePath;
    }
}