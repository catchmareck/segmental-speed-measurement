'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });

const uuidv4 = require('uuid/v4');

const upload = require('../utils/s3-upload');
const scan = require('../utils/dynamodb-scan');

router.get('/', async (request, response) => {

    const rawItems = await scan();
    const items = rawItems.map((item) => ({
        Plate: item.Plate.S,
        Time: (new Date(+item.Time.N)).toLocaleString(),
        Amount: item.Amount.N,
        Currency: item.Currency.S
    }));
    
    const data = { items };
    response.render('main', data);
});

router.post('/gate', (request, response) => {

    const Busboy = require('busboy');
    const busboy = new Busboy({ headers: request.headers });

    busboy.on('file', (fieldName, file, fileName, encoding, mimetype) => {

        const [name, extension] = fileName.split('.');
        upload(`${name}-${uuidv4()}.${extension}`, file)
            .then((data) => {
                
                console.log(`File ${fileName} has been successfully saved.`, data);
                
                response.end();
            })
            .catch((error) => {
                
                console.error(error);
                
                response.sendStatus(500);
            });
    });

    request.pipe(busboy);
});

module.exports = router;
