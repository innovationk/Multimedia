import Controller from '../controller.js';
import AlbumTable from "./album_table.js";
import fs from 'node:fs';
import FsTools from "../../tools/fs_tools.js";

const PATH_UPLOAD = `${process.cwd()}/uploads/albums`;

export default class AlbumController extends Controller {
    static _mainTable = AlbumTable;

    static async create(req, res, next) {
        await super.create(req, res, next, async ({ row }) => {
            if (req.body.image &&
                req.body.image.startsWith("data:image")
            ) {
                const albumPath = `${PATH_UPLOAD}/${row.id}`;
                FsTools.saveBase64ImageSync({
                    dirPath: `${albumPath}`,
                    fileName: `cover.png`,
                    base64Str: req.body.image
                });
            }
        });
    }

    static async update(req, res, next) {
        await super.update(req, res, next, async ({ row }) => {
            if (req.body.image &&
                req.body.image.startsWith("data:image")
            ) {
                const albumPath = `${PATH_UPLOAD}/${req.params.primaryValue}`;
                FsTools.saveBase64ImageSync({
                    dirPath: `${albumPath}`,
                    fileName: `cover.png`,
                    base64Str: req.body.image
                });
            }
        });
    }

    static async getImage(req, res, next) {
        const imgPath = `${PATH_UPLOAD}/${req.params.primaryValue}/cover.png`;
        if(fs.existsSync(imgPath)) {
            res.sendFile(imgPath);

        } else {
            res.status(200).send('File not found');
        }
    }
}