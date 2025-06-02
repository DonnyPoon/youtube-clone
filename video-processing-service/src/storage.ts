import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';


const storage = new Storage();

const rawVideoBucketName = "donnyp-yt-raw-vids";
const processedVideoBucketName = "donnyp-yt-processed-vids";


const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";


/**
 * Create local directories for raw and unprocessed videos
 */
export function setupDirectories() {
    ensureDirectoryExists(localRawVideoPath);
    ensureDirectoryExists(localProcessedVideoPath);
}

/**
 * 
 * @param rawVideoName The name of the video to convert from {@link localRawVideoPath}.
 * @param processedVideoName The name of the video to convert to {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video converts.
 */

export function convertVideo(rawVideoName: string, processedVideoName: string){
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOptions('-vf', 'scale=-1:360') // 360p
        //.outputOptions('-vf', 'scale=-1:360,fps=10') for 10 fps, messing around
        .on('end', function() {
            console.log('Processing completed successfully');
            resolve();
            
        })
        .on('error', function(err: any) {
            console.log('An error occurred: ' + err.message);
            reject(err);

        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);
    })     
}

/**
 * @param filename Name of the file being downloaded from the 
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(filename: string) {
    await storage.bucket(rawVideoBucketName)
    .file(filename)
    .download({ destination: `${localRawVideoPath}/${filename}` });

    console.log(`gs://${rawVideoBucketName}/${filename} downloaded to ${localRawVideoPath}/${filename}.`)
}

/**
 * @param filename Name of the file being uploaded to
 * {@link processedVideoBucketName} bucket from {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideo(filename: string) {
    const bucket  =  storage.bucket(processedVideoBucketName);
    
    await bucket.upload(`${localProcessedVideoPath}/${filename}`, { destination: filename });
    console.log(`gs://${localProcessedVideoPath}/${filename} uploaded to ${processedVideoBucketName}/${filename}.`);
    
    await bucket.file(filename).makePublic();
}

/**
 * 
 * @param filename Name of the raw video file to delete from
 * {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the raw video file has been deleted.
 */
export function deleteRawVideo(filename: string) {
    return deleteFile(`${localRawVideoPath}/${filename}`);
}

/**
 * 
 * @param filename Name of the raw video file to delete from
 * {@link localProcessedVideoPath} folder.
 * @returns A promise that resolves when the processed video file has been deleted.
 */
export function deleteProcessedVideo(filename: string) {
    return deleteFile(`${localProcessedVideoPath}/${filename}`);

}

/**
 * 
 * @param filePath Path of the file to delete.
 * @returns A promise that resolves once the file has been deleted.
 */
function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Failed to delete file at ${filePath}`, err);
                }
                else {
                    console.log(`Successfully deleted file at ${filePath}`);
                    resolve();
                }
            })
        }
        else {
            console.log(`File not found at ${filePath}, skipping deletion.`);
            resolve();
        }
    });
}

/**
 * Ensures a directory exists, creates one if it does not.
 * @param {string} dirPath The directory path to check.
 */
function ensureDirectoryExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); // recursive: true allows creating nested directories.
        console.log(`Directory made at ${dirPath}.`);
    }
}