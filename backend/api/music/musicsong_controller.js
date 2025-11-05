import Controller from '../controller.js';
import MusicSongTable from "./musicsong_table.js";

export default class MusicSongController extends Controller {
    static _mainTable = MusicSongTable;
}