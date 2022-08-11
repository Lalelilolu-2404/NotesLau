// const Datastore = require('nedb');
const express = require('express');
const fs = require('fs-extra');
// const fetch = import('node-fetch');
// require('dotenv').config();
// console.log(process.env);
// const api_key = process.env.API_KEY;

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Starting server at ${port}`);
});

app.use(express.static('public'));
app.use(express.json({limit: '2mb'}));

// const database = new Datastore('database.db');
// database.loadDatabase();

// app.get('/apiget', (request, response) => {
//     database.find({}, (err, data) => {
//         if (err) {
//             response.end();
//             return;
//         }
//         console.log(json(data));
//         response.json(data);
//     });
// });
// app.post('/api', (request, response) => {
//     const data = request.body;
//     database.insert(data);
//     response.json(data);
// });

const data = loadJSON('dbnotes.json');

app.get('/apiget', (request, response) => {
    response.json(data);
});
app.post('/api', (request, response) => {
    const database = request.body;
    // console.log(database)
    const Idindex = database.action.index;
    const upnote = database.action.upnote;
    if(upnote == 'neutral'){
        data.push(database);
        saveJSON('dbnotes.json', data);
        response.json(data);
    }else if(upnote == 'update'){
        data[Idindex] = database;
        saveJSON('dbnotes.json', data);
        // console.log(Idindex)
        response.json(data);
    }else if(upnote == 'delete'){
        data.splice(Idindex, 1);
        saveJSON('dbnotes.json', data);
        response.json(data);
    }
});

// app.get('/tofitos/:latlon', async (request, response) => {
//     const latlon = request.params.latlon.split(',');
//     const lat = latlon[0].toFixed(2);
//     const lon = latlon[1];
//     const api_url = `https://${lat}:${lon}`;
//     const repfetch = await fetch(api_url);
//     const json11 = await repfetch.json();

//     const api_url11 = `https://${lat}:${lon}`;
//     const repfetch11 = await fetch(api_url11);
//     const json22 = await repfetch.json();

//     const data = {
//         lau: json11,
//         pesc: json22
//     }
//     response.json(data);
// })

function loadJSON(filename = '') {
    return JSON.parse(
        fs.existsSync(filename)
            ? fs.readFileSync(filename).toString()
            :'""'
    )
}

function saveJSON(filename ='', json = '""') {
    return fs.writeFileSync(
        filename, 
        JSON.stringify(
            json,
            null,
            2
        )
    )
}