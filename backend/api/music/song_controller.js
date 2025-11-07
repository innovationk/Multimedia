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
            }
        });
    }

    static async update(req, res, next) {
        await super.update(req, res, next, async ({ row }) => {
            if(req.body.audio) {
                const song = await MariadbConnector.readRow({
                    table: this._mainTable,
                    primaryValue: req.params.primaryValue,
                    primaryField: this._mainTable.primaryKey,
                });

                const albumPath = `${PATH_UPLOAD}/${song.album_id}`;
                if (!fs.existsSync(albumPath)) {
                    fs.mkdirSync(albumPath, { recursive: true });
                }
                const filePath = `${albumPath}/${song.track}`;

                const fileData = Buffer.from(req.body.audio, 'base64');
                fs.writeFileSync(filePath, fileData);
            }
        });
    }
}