import Controller from '../controller.js';
import ProfessionalTable from "./professional_table.js";
import fs from 'node:fs';

const PATH_UPLOAD = `${process.cwd()}/uploads/professionals`;

export default class ProfessionalController extends Controller {
    static _mainTable = ProfessionalTable;

    static async getImage(req, res, next) {
        const imgPath = `${PATH_UPLOAD}/${req.params.primaryValue}.png`;
        if(fs.existsSync(imgPath)) {
            res.sendFile(imgPath);
        } else {
            res.status(400).send('File not found');
        }
    }
}