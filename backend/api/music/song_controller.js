import MariadbConnector from '../../tools/mariadb/mariadb_connector.js';
import Controller from '../controller.js';
import SongTable from "./song_table.js";
import fs from 'node:fs';

const PATH_UPLOAD = `${process.cwd()}/uploads/albums`;

export default class SongController extends Controller {
    static _mainTable = SongTable;

    static async create(req, res, next) {
        await super.create(req, res, next, async ({ row }) => {
            if(req.body.audio) {
                const albumPath = `${PATH_UPLOAD}/${req.body.album_id}`;
                if (!fs.existsSync(albumPath)) {
                    fs.mkdirSync(albumPath, { recursive: true });
                }
                const filePath = `${albumPath}/${req.body.track}.mp3`;
                const fileData = Buffer.from(req.body.audio, 'base64');
                fs.writeFileSync(filePath, fileData);
            }
        });
    }

    static async update(req, res, next) {
        await super.update(req, res, next, async ({ row }) => {
            if(req.body.audio) {
                const song = await MariadbConnector.readRow({
                    table: this._mainTable,
                    primaryField: this._mainTable.primaryKey,
                    primaryValue: req.params.primaryValue,
                });

                const albumPath = `${PATH_UPLOAD}/${song['song.album_id']}`;
                if (!fs.existsSync(albumPath)) {
                    fs.mkdirSync(albumPath, { recursive: true });
                }
                const filePath = `${albumPath}/${song['song.track']}.mp3`;
                const fileData = Buffer.from(req.body.audio, 'base64');
                fs.writeFileSync(filePath, fileData);
            }
        });
    }

    static async stream(req, res, next) {
        const song = await MariadbConnector.readRow({
            table: this._mainTable,
            primaryField: this._mainTable.primaryKey,
            primaryValue: req.params.primaryValue,
        });
        const albumPath = `${PATH_UPLOAD}/${song['song.album_id']}`;
        const filePath = `${albumPath}/${song['song.track']}.mp3`;

        if(fs.existsSync(filePath)) {
            const fileStream = fs.createReadStream(filePath);
            res.writeHead(200, { 'Content-Type': 'audio/mpeg' });
            fileStream.pipe(res);

        } else {
            res.status(400).send('File not found');
        }
    }

    static async tagDeleted(req, res, next) {
        const song = await MariadbConnector.readRow({
            table: this._mainTable,
            primaryField: this._mainTable.primaryKey,
            primaryValue: req.params.primaryValue,
        });
        const albumPath = `${PATH_UPLOAD}/${song['song.album_id']}`;
        const filePath = `${albumPath}/${song['song.track']}.mp3`;

        if(fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await super.tagDeleted(req, res, next, async ({ row }) => {});
    }

    static async download(req, res, next) {
        const song = await MariadbConnector.readRow({
            table: this._mainTable,
            primaryField: this._mainTable.primaryKey,
            primaryValue: req.params.primaryValue,
        });
        const albumPath = `${PATH_UPLOAD}/${song['song.album_id']}`;
        const filePath = `${albumPath}/${song['song.track']}.mp3`;

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