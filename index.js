'use strict';
const express = require('express');
const sampleFetcher = require('./sample.fetcher');

const app = express();

app.get('/samples', (req, res, next) => {
    return sampleFetcher.getSampleFiles()
                        .then(samples => {
                            console.log(`From cache: ${samples.length}`);
                            return res.json(samples);
                        })
                        .catch(next);
});

app.get('/refresh', (req, res, next) => {
    return sampleFetcher.refresh()
                        .then(samples => {
                            console.log(`Refreshed: ${samples.length} samples.`);
                            return res.json(samples);
                        })
                        .catch(next);

});

const samplesPort = process.env.PORT || 8888;
const host = process.env.HOST || '0.0.0.0';
app.listen(samplesPort, () => console.log(`Running samples cache on ${host}:${samplesPort}`));
