import Logger from '../../tools/logger.js';
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
    
        try {
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

        } catch (err) {
            Logger.write(err.stack, Logger.LEVEL.CRITICAL);
            res.status(400).send('File error');
        }
    }

    static async download(req, res, next) {
        try {
            const videoPath = `${PATH_UPLOAD}/${req.params.primaryValue}.mp4`;
            
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

        } catch (err) {
            Logger.write(err.stack, Logger.LEVEL.CRITICAL);
            res.status(400).send('File error');
        }
    }
}