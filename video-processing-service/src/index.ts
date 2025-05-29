import express from 'express';
import ffmpeg from 'fluent-ffmpeg';

const app = express();
const port = 3000;
app.post('/process-video', (req, res) => {
    // Get path of input file from req body

    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if (!inputFilePath){
        res.status(400).send("Bad Request: Missing input file path.");
    }
    if (!outputFilePath){
        res.status(400).send("Bad Request: Missing output file path.");
    }

    ffmpeg(inputFilePath)
        .outputOptions()
        .
});



app.listen(port, () => {
    console.log(`video-processing-service running at http://localhost:${port}`);
});