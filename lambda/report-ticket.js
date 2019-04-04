const AWS = require('aws-sdk');

const ALLOWED_PASS_TIME_MS = 1000 * 30;

exports.handler = async (event) => {

    const records = event.Records;

    for (let record of records) {

        if (record.eventName !== 'INSERT') continue;

        const document = record.dynamodb.NewImage;
        const plate = document.Plate.S;
        
        const dynamoDb = new AWS.DynamoDB();
        const dynamoRequest = {
            ExpressionAttributeValues: {
                ":v1": {
                    S: plate
                }
            },
            KeyConditionExpression: "Plate = :v1",
            TableName: "CarsEntries",
            Select: 'ALL_ATTRIBUTES'
        };
        const response = await dynamoDb.query(dynamoRequest).promise();
        
        const entries = response.Items;

        if (entries.length <= 1 || entries.length % 2 !== 0){
            return {
                statusCode: 200,
                body: JSON.stringify('ok'),
            };
        }
        
        const [ enter, out ] = entries;

        if (+out.Time.N - +enter.Time.N < ALLOWED_PASS_TIME_MS) {

            const dynamoRequest = {
                Item: {
                    "Plate": {
                        S: plate
                    },
                    "Time": {
                        N: Date.now().toString()
                    },
                    "Amount": {
                        N: "100"
                    },
                    "Currency": {
                        S: "PLN"
                    }
                },
                ReturnConsumedCapacity: "TOTAL",
                TableName: "SpeedTickets"
            };
            const response = await dynamoDb.putItem(dynamoRequest).promise();
            console.log(response);

            return {
                statusCode: 201,
                body: JSON.stringify('inserted ticket'),
            };
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify('ok'),
        };
    }
};
