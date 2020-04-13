if('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(async position => {
        let lat, long, weather, air;
        try{
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            document.getElementById('latitude').textContent = lat.toFixed(2);
            document.getElementById('longitude').textContent = lon.toFixed(2);
            const api_url = `weather/${lat},${lon}`;
            const response = await fetch(api_url);
            const json = await response.json();
    
            // Séparation des données propres à la météo et à la qualité de l'air
            weather = json.weather;
            // const air = json.air.results[0].measurements[0];
            air = json.air.results[0].measurements[0];
            console.log(air);
        
    
            document.getElementById('summary').textContent = weather.weather[0].description;
            document.getElementById('temp').textContent = weather.main.temp;
            document.getElementById('city').textContent = weather.name;
    
            document.getElementById('aq_parameter').textContent = air.parameter;
            document.getElementById('aq_value').textContent = air.value;
            document.getElementById('aq_units').textContent = air.unit;
            document.getElementById('aq_date').textContent = air.lastUpdated;

            
        } catch(error) {
            console.log("Il y a eu une erreur.");
            console.log(error);
            air = {value: -1};
        }

        // Envoi des données sur la database
        const data = {lat, lon, weather, air};
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
    
        // Envoi des data vers le serveur
        const db_response = await fetch('/api', options);
        // Réception de la réponse du serveur
        const db_json = await db_response.json();

    })
} else {
    console.log('geolocation not available');
}