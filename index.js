'use strict';
const express = require('express');
const cors = require('cors');
const sampleFetcher = require('./sample.fetcher');

const app = express();

const whitelist = ['http://bdtem.co.in', 'http://localhost:4200'];

const corsOptions = {
    origin: function (origin, callback) {
        return whitelist.includes(origin) ? callback(null, true) : callback(Error('Not allowed'))
    }
};

app.use(cors(corsOptions));


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
