import Controller from '../controller.js';
import MovieTable from "./movie_table.js";

export default class MovieController extends Controller {
    static _mainTable = MovieTable;

}