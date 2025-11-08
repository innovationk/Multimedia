import MariadbConnector from '../../tools/mariadb/mariadb_connector.js';
import Controller from '../controller.js';
import BookTable from "./book_table.js";
import fs from 'node:fs';

const PATH_UPLOAD = `${process.cwd()}/uploads/books`;

export default class BookController extends Controller {
    static _mainTable = BookTable;

    static async create(req, res, next) {
        await super.create(req, res, next, async ({ row }) => {
            if(req.body.epub) {
                const dirPath = `${PATH_UPLOAD}`;
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }
                const filePath = `${dirPath}/${row.id}.epub`;
                const fileData = Buffer.from(req.body.epub, 'base64');
                fs.writeFileSync(filePath, fileData);
            }
        });
    }

    static async update(req, res, next) {
        await super.update(req, res, next, async ({ row }) => {
            if(req.body.epub) {
                const book = await MariadbConnector.readRow({
                    table: this._mainTable,
                    primaryField: this._mainTable.primaryKey,
                    primaryValue: req.params.primaryValue,
                });

                const dirPath = `${PATH_UPLOAD}`;
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }
                const filePath = `${dirPath}/${book['book.id']}.epub`;
                const fileData = Buffer.from(req.body.epub, 'base64');
                fs.writeFileSync(filePath, fileData);
            }
        });
    }

    static async tagDeleted(req, res, next) {
        const book = await MariadbConnector.readRow({
            table: this._mainTable,
            primaryField: this._mainTable.primaryKey,
            primaryValue: req.params.primaryValue,
        });
        const dirPath = `${PATH_UPLOAD}`;
        const filePath = `${dirPath}/${book['book.id']}.epub`;

        if(fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await super.tagDeleted(req, res, next, async ({ row }) => {});
    }

    static async download(req, res, next) {
        const book = await MariadbConnector.readRow({
            table: this._mainTable,
            primaryField: this._mainTable.primaryKey,
            primaryValue: req.params.primaryValue,
        });
        const albumPath = `${PATH_UPLOAD}`;
        const filePath = `${albumPath}/${book['book.id']}.epub`;

        if(fs.existsSync(filePath)) {
            const fileSize = fs.statSync(filePath).size;
            res.writeHead(200, {
                'Content-Length': fileSize,
            });

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);

            fileStream.on('error', (err) => {
                console.error('Error streaming file:', err);
                res.status(500).send('Error streaming file');
            });
        } else {
            res.status(400).send('File not found');
        }
    }
}