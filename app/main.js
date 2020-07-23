const map2 = {
    link : '',
    lat : 45,
    lng : 0,
    ip : 0,
    weather : document.querySelector(".title-weather")
};

    function initMap() {
        map = DG.map('map', {
            center: [map2.lat, map2.lng],
            zoom: 13
        });

        DG.marker([map2.lat, map2.lng]).addTo(map);
    };

function getIP(){
    fetch('https://www.cloudflare.com/cdn-cgi/trace')
        .then(resp => resp.text())
        .then(d => formateIP(d));
}

function formateIP(str){
    const ipInfo = str.split(/\n/gm).reduce((acc, keyVal) => {
        const [ key, val ] = keyVal.split('=');
        acc[key] = val;
        return acc;
    }, {});
    map2.ip = ipInfo.ip;
    getLocation(ipInfo.ip);
}

function getLocation(ip){
    fetch(`http://ip-api.com/json/${ip}`)
        .then(resp => resp.json())
        .then(data => {
            map2.city = data.city;
            map2.lat = data.lat;
            map2.lng = data.lon;
            map2.location = data;
            mapRecenter();
        });
    
}

function mapRecenter(){
    initMap();
    getWeather();
}

function getWeather(){
    const apiKey = "9ca9045cad5b7186cc352589c8d68cc0";
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${map2.lat}&lon=${map2.lng}&appid=${apiKey}&units=metric`)
        .then((response) => response.json())
        .then((result) => {
            map2.weather.innerHTML = `${result.name}, ${Math.round(result.main.temp)} &deg;C`;
    });
}


getIP();