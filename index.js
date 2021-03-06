'use strict';
const request = require('request');

const driveFilesEndpoint = 'https://content.googleapis.com/drive/v3/files';

const apiKey = 'AIzaSyB34kcbBYm9f0lpjwdm1_RDubFRZPwi0pA';
const folderId = '0B721XY-cG39uX3M3eFk3Y0dKRms';

// Super naive memory cache.
const sampleFiles = [];

function getSamplesAtPage(pageToken) {
    return new Promise(
        (resolve, reject) => {
            return request.get({
                    url: driveFilesEndpoint,
                    qs: { q: `'${ folderId }' in parents`, key: apiKey, pageToken },
                    json: true
                },
                (err, res, body) => err || !res || !body
                    ? reject(err || new Error('NORES'))
                    : resolve(body)
            );
        }
    );
}

/**
 * @param nextPageToken
 * @returns {Promise<Array>}
 */
function getSampleFiles(nextPageToken) {
    let pageToken;
    return getSamplesAtPage(nextPageToken)
        .then(response => {
            const { files, nextPageToken } = response;

            pageToken = nextPageToken;
            sampleFiles.push(...files);
            return nextPageToken ? getSampleFiles(pageToken) : sampleFiles;
        });
}

const allowedOrigins = [
    /^https?:\/\/localhost:?[\d]*$/,
    /^https?:.*bdtem\.co(m|\.in)$/,
    // todo remove:
    /^https:\/\/.+\.netlify\.com$/
];

module.exports = async (req, res) => {
    try {
        const reqOrigin = req.headers['origin'];
        if (allowedOrigins.some(ao => ao.test(reqOrigin))) {
            res.setHeader('Access-Control-Allow-Origin', reqOrigin);
        }

        const samples = await getSampleFiles();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify(samples));
    } catch (err) {
        console.error(err);
        res.statusCode = 503;
        res.end();
    }
};
