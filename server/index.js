require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.SERVER_PORT || 8080;
console.log('PORT:', port);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use(cors());

app.get('/api/get-speech-token', async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    const speechKey = process.env.SPEECH_KEY;
    const speechRegion = process.env.SPEECH_REGION;
    
    if (speechKey === 'paste-your-speech-key-here' || speechRegion === 'paste-your-speech-region-here') {
        res.status(400).send('You forgot to add your speech key or region to the .env file.');
    } 
    else 
    {
        const headers = { 
            headers: {
                'Ocp-Apim-Subscription-Key': speechKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        try {
            const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
            //console.log('Token fetched from Azure:', tokenResponse.data); // Log the token
            res.send({ token: tokenResponse.data, region: speechRegion });
        } catch (err) {
            res.status(401).send('There was an error authorizing your speech key.');
        }
    }
});

// Handle 404 for invalid routes
app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(port, () =>
    console.log(`Express server is running on port:${port}`)
);