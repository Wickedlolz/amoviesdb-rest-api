const { google } = require('googleapis');
const fs = require('fs');
const crypto = require('crypto');

const auth = new google.auth.GoogleAuth({
    keyFile: './src/config/amoviesdb-355904-f365111d86b3.json',
    scopes: 'https://www.googleapis.com/auth/drive',
});

const drive = google.drive({
    version: 'v3',
    auth: auth,
});

/**
 *
 * @param {File} file
 * @return {Promise<string>}
 */

exports.uploadFile = function (file) {
    const fileMetadata = {
        name: `${crypto.randomBytes(20).toString('hex')}.png`,
        parents: ['1Bzv_dj0LQFq4azlruTgl4pOs1ZiPjCCZ'],
    };
    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(file.path),
    };
    return drive.files
        .create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        })
        .then((file) => {
            console.log('File Id: ', file.data.id);
            return file.data.id;
        })
        .catch((error) => console.log(error));
};
