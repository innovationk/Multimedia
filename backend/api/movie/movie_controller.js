import Controller from '../controller.js';
import MovieTable from "./movie_table.js";
import fs from 'node:fs';

const PATH_UPLOAD = `${process.cwd()}/uploads/movies`;

export default class MovieController extends Controller {
    static _mainTable = MovieTable;

    static async stream(req, res, next) {
        const videoPath = `${PATH_UPLOAD}/${req.params.primaryValue}.mp4`;
        if(fs.existsSync(videoPath)) {
            const videoSize = fs.statSync(videoPath).size;

            const range = req.headers.range;
            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
                const chunkSize = end - start + 1;

                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunkSize,
                    'Content-Type': 'video/mp4',
                });

                const videoStream = fs.createReadStream(videoPath, { start, end });
                videoStream.pipe(res);

            } else {
                res.writeHead(200, {
                'Content-Length': videoSize,
                'Content-Type': 'video/mp4',
                });
                fs.createReadStream(videoPath).pipe(res);
            }
        
        } else {
            res.status(400).send('File not found');
        }
    }

    static async download(req, res, next) {        
        const videoPath = `${PATH_UPLOAD}/${req.params.primaryValue}.mp4`;
        if(fs.existsSync(videoPath)) {
            
            const fileSize = fs.statSync(videoPath).size;

            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Content-Disposition', 'attachment; filename="large-movie.mp4"');
            res.setHeader('Accept-Ranges', 'bytes');

            // Handle range requests for resuming downloads
            const range = req.headers.range;
            if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunkSize = end - start + 1;

                res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Content-Length': chunkSize,
                });

                const fileStream = fs.createReadStream(videoPath, { start, end });
                fileStream.pipe(res);

                fileStream.on('error', (err) => {
                console.error('Error streaming file:', err);
                res.status(500).send('Error streaming file');
                });
            } else {
                // No range request, send the entire file
                res.writeHead(200, {
                'Content-Length': fileSize,
                });

                const fileStream = fs.createReadStream(videoPath);
                fileStream.pipe(res);

                fileStream.on('error', (err) => {
                console.error('Error streaming file:', err);
                res.status(500).send('Error streaming file');
                });
            }

        } else {
            res.status(400).send('File not found');
        }
    }
}