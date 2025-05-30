import express from 'express';
import ffmpeg from 'fluent-ffmpeg';

const app = express();
app.use(express.json());

// TODO: Dynamic codec based on input file format

app.post('/process-video', (req, res) => {
    
    // Get path of input file from req body
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    // Check for file paths being defined
    if (!inputFilePath){
        res.status(400).send("Bad Request: Missing input file path.");
    }
    if (!outputFilePath){
        res.status(400).send("Bad Request: Missing output file path.");
    }

    // Create ffmpeg command
    ffmpeg(inputFilePath)
        .outputOptions('-vf', 'scale=-1:360') // 360p
        .on('end', function() {
            console.log('Processing completed successfully');
            res.status(200).send('Processing completed successfully');
        })
        .on('error', function(err: any) {
            console.log('An error occurred: ' + err.message);
            res.status(500).send('An error occurred: ' + err.message);
        })
        .save(outputFilePath);
    
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`video-processing-service running at http://localhost:${port}`);
});