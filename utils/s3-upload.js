'use strict';

const AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

const bucketName = 'car-photos-b6dd541f-c942-49bc-88b4-886baccc2424';

function uploadPhoto(fileName, fileStream) {

    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    return s3.upload({
        Bucket: bucketName,
        Body: fileStream,
        Key: fileName
    }).promise();
}

module.exports = uploadPhoto;