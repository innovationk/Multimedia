import Controller from '../controller.js';
import MovieTable from "./movie_table.js";
import fs from 'node:fs';

const PATH_UPLOAD = `${process.cwd()}/api/movie/uploads`;

export default class MovieController extends Controller {
    static _mainTable = MovieTable;

    static async stream(req, res, next) {
        const range = req.headers.range;
        if (!range) {
            return res.status(400).send('Requires Range header');
        }

        const videoPath = `${PATH_UPLOAD}/${req.params.primaryValue}.mp4`;
        const videoSize = fs.statSync(videoPath).size;
        const CHUNK_SIZE = 10 ** 6; // 1MB chunks
        const start = Number(range.replace(/\D/g, ''));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        const contentLength = end - start + 1;
        const headers = {
            'Content-Range': `bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, headers);
        const videoStream = fs.createReadStream(videoPath, { start, end });
        videoStream.pipe(res);
    }
}