// MAP : 
const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution = '&copy; <a href="openstreetmap.org/copyright">OpenStreeMap</a>';
const tileUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, {attribution});
tiles.addTo(mymap);

getData();

async function getData(){
    // On récupère tout ce qu'il y a sur le serveur en json, collection d'objets
    const response = await fetch('/api');
    const data = await response.json();
    console.log(data);
    // Pour chaque élément récupéré, on garde les coord géo et on place un marqueur sur la carte
    for (item of data) {
        const marker = L.marker([item.lat, item.lon]).addTo(mymap);

        // Texte au hover de chaque point
        let txt = `Le temps aux coordonnées ${item.lat}&deg;,
        ${item.lon}&deg;, qui correspond à la ville de ${item.weather.name} est ${item.weather.weather[0].description} avec une température de ${item.weather.main.temp}&deg; C.`; 

        if(item.air.value < 0){
            // Pas de réponse de l'API air quality pour la localisation :
            txt += 'Aucune donnée sur l\'air disponible.'; 
        } else {
            txt += `La dernière concentration en ozone dans l'atmosphère (${item.air.parameter}) est
            ${item.air.value} ${item.air.unit} en date du
            ${item.air.lastUpdated}.`;
        }
        marker.bindPopup(txt);
    }
}