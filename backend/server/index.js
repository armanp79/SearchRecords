const express = require('express');
const serverPort = process.env.PORT || 4000;
const clientPort = 3000;
const cors = require('cors');
const app = express();
const retrieveRecords = require('../database/controllers/retrieveRecords.js');



app.use(
    cors({
        origin: [`http://localhost:${clientPort}`],
       credentials: true,
    })
 );


app.get('/records', (req, res) => {
    const {query, lastSeenID, dir} = req.query;
    
    retrieveRecords(query, lastSeenID, dir, (err, data) => {
        if (err) {
            res.sendStatus(404)
        } else {
            res.status(200);
            res.send(data);
        }
    });
})


app.listen(serverPort, err => {
    if (err) throw err;
    console.log('Server running on port', serverPort);
})
