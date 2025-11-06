import Controller from '../controller.js';
import SongTable from "./song_table.js";

export default class SongController extends Controller {
    static _mainTable = SongTable;
}