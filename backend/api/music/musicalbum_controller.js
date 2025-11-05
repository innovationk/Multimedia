import Controller from '../controller.js';
import MusicAlbumTable from "./musicalbum_table.js";

export default class MusicAlbumController extends Controller {
    static _mainTable = MusicAlbumTable;
}