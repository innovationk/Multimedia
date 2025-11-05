import Logger from '../../tools/logger.js';
import Controller from '../controller.js';
import ProfessionalTable from "./professional_table.js";

export default class ProfessionalController extends Controller {
    static _mainTable = ProfessionalTable;
}