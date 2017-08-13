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
                                   qs: {q: `'${folderId}' in parents`, key: apiKey, pageToken},
                                   json: true
                               },
                               (err, res, body) => err || !res || !body
                                   ? reject(err || new Error('NORES'))
                                   : resolve(body)
            );
        }
    );
}


function getSampleFiles(nextPageToken) {

    let pageToken;
    return getSamplesAtPage(nextPageToken)
        .then(response => {
            const {files, nextPageToken} = response;

            pageToken = nextPageToken;
            sampleFiles.push(...files);
            return nextPageToken ? getSampleFiles(pageToken) : sampleFiles
        });
}

function refresh() {
    return getSampleFiles();
}

function _getCachedSampleFiles() {
    return sampleFiles.length > 0 ? Promise.resolve(sampleFiles) : refresh();
}


module.exports = {
    refresh,
    getSampleFiles: _getCachedSampleFiles
};