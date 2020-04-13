const express = require('express');
const fetch = require('node-fetch');
const Datastore = require('nedb');
// Accès au doc .env pour la clé API
require('dotenv').config();
console.log(process.env);

const app = express();
const database = new Datastore('database.db');
database.loadDatabase();

// On utilise le port spécifié dans l'environnement, s'il n'y en a pas on utilise le port 3000 par défaut
const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`ort ${port} sur écoute pour l'appli`);
})

app.use(express.static("public"));
app.use(express.json({limit: '1mb'}));



// ! Gestion des routes
// Renvoi tous les objets du fichier database sous forme json quand requete GET vers /api 
app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    })
})

// Envoi les donénes sur le serveur
app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    // console.log(database);
    response.json(data);
})

// Quand requete GET avec des coordonnées géographique, cherche les infos dans les API puis renvoit ces infos
app.get('/weather/:latlon', async (request, response) =>{
    // Coté client, faire la requete avec lat,lon comme parametre
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];

    // API pour la météo
    const api_key = process.env.API_KEY;
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}&lang=fr`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    // API pour la qualité de l'air
    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();

    // On met les données des deux API ensemble
    const data = {
        weather: weather_data,
        air: aq_data
    }

    response.json(data);
})
