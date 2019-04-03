const AWS = require('aws-sdk');

const ALLOWED_PASS_TIME_MS = 1000 * 30;

exports.handler = async (event) => {

    const records = event.Records;

    const bucketName = 'car-photos-b6dd541f-c942-49bc-88b4-886baccc2424';
    
    for (let record of records) {

        const {s3: {object: {key}}} = record;

        const rekognition = new AWS.Rekognition();
        const rekognitionRequest = {
            Image: {
                S3Object: {
                    Bucket: bucketName,
                    Name: key
                }
            }
        };
        const rekognitionResponse = await rekognition.detectText(rekognitionRequest).promise();

        const plate = rekognitionResponse.TextDetections.reduce((res, detection) => detection.Type === 'LINE' ? res + detection.DetectedText : res, '');
        const currentTime = Date.now();

        const dynamoDb = new AWS.DynamoDB();
        const dynamoRequest = {
            Item: {
                "Plate": {
                    S: plate
                },
                "Time": {
                    N: currentTime.toString()
                },
                "Expiry": {
                    N: (currentTime + ALLOWED_PASS_TIME_MS).toString()
                }
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: "CarsEntries"
        };
        const response = await dynamoDb.putItem(dynamoRequest).promise();
        console.log(response);

        return {
            statusCode: 200,
            body: JSON.stringify(plate),
        };
    }
};
