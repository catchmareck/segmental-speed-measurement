'use strict';

const AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

async function scanDb() {
    
    const dynamoDb = new AWS.DynamoDB();
    const dynamoRequest = {
        TableName: "SpeedTickets",
        Select: 'ALL_ATTRIBUTES'
    };
    const response = await dynamoDb.scan(dynamoRequest).promise()
        .catch((error) => {
            
            console.error('Error fetching SpeedTickets', error.message);
        });

    return response.Items;
}

module.exports = scanDb;
