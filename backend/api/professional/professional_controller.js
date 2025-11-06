import Controller from '../controller.js';
import ProfessionalTable from "./professional_table.js";
import fs from 'node:fs';
import FsTools from "../../tools/fs_tools.js";

const PATH_UPLOAD = `${process.cwd()}/uploads/professionals`;

export default class ProfessionalController extends Controller {
    static _mainTable = ProfessionalTable;

    static async create(req, res, next) {
        await super.create(req, res, next, async ({ row }) => {
            if (req.body.image&&
                req.body.image.startsWith("data:image")
            ) {
                FsTools.saveBase64ImageSync({
                    dirPath: `${PATH_UPLOAD}`,
                    fileName: `${row.id}.png`,
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
                FsTools.saveBase64ImageSync({
                    dirPath: `${PATH_UPLOAD}`,
                    fileName: `${req.params.primaryValue}.png`,
                    base64Str: req.body.image
                });
            }
        });
    }

    static async getImage(req, res, next) {
        const imgPath = `${PATH_UPLOAD}/${req.params.primaryValue}.png`;
        if(fs.existsSync(imgPath)) {
            res.sendFile(imgPath);

        } else {
            res.status(200).send('File not found');
        }
    }
}