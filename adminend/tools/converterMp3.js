import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';

const INPUT_DIR_PATH = `${process.cwd()}/input`;
const OUTPUT_DIR_PATH = `${process.cwd()}/output`;

const AUDIO_EXTENSIONS = ['.flac', '.wav', '.aac', '.ogg', '.m4a'];

async function listAudioFiles(directory) {
    try {
        const files = await fs.promises.readdir(directory);
        return files.filter(file =>
            AUDIO_EXTENSIONS.includes(path.extname(file).toLowerCase())
        );
    } catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
}

function convertToMp3(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
        .toFormat('mp3')
        .on('error', (err) => reject(err))
        .on('end', () => resolve(outputPath))
        .save(outputPath);
    });
}

async function main() {
    const audioFiles = await listAudioFiles(INPUT_DIR_PATH);
    if (audioFiles.length === 0) {
        console.log('No audio files found in the directory.');
        return;
    }

    if(!fs.existsSync(OUTPUT_DIR_PATH)) {
        fs.mkdirSync(OUTPUT_DIR_PATH, { recursive: true });
    }

    console.log(`Found ${audioFiles.length} audio file(s). Starting conversion...`);

    for (const file of audioFiles) {
        console.log(`Converting ${file} to MP3...`);

        const inputPath = path.join(INPUT_DIR_PATH, file);

        const parsedPathFile = path.parse(file);
        const baseName = parsedPathFile.name;

        const leadingNumberMatch = baseName.match(/^(\d+)[-.]/);
        const leadingNumber = leadingNumberMatch ? leadingNumberMatch[1] + '-' : '';

        const cleanedName = baseName
          .replace(/^(\d+)[-.]/, '')    // Remove leading number and separator
          .replace(/'/g, '')            // Remove apostrophes
          .replace(/[^\w\s]/g, '')      // Remove other special characters
          .replace(/\s+/g, '_');        // Replace spaces with underscores

        const outputName = `${leadingNumber}${cleanedName}`;
        const outputPath = path.join(OUTPUT_DIR_PATH, `${outputName}.mp3`);
        try {
            await convertToMp3(inputPath, outputPath);
            console.log(`Successfully converted: ${outputPath}`);
            
        } catch (error) {
            console.error(`Failed to convert ${file}:`, error);
            console.error(`Perhaps check if the command "ffmpeg" is well available. Do not hesitate to launch another terminal (ex: Powershell on Windows).`);
            return;
        }
    }

    console.log('Conversion complete!');
}
main();