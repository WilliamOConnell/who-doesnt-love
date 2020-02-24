let domSearchButton = document.getElementById('searchButton');
let domErrorMessage = document.getElementById('errorMessage');

let geo;

domSearchButton.addEventListener('click', function() {
    if (!navigator.geolocation) {
        domErrorMessage.innerText = 'Sorry, your browser does not support geolocation.';
    } else {
        domSearchButton.classList.add('loading');
        navigator.geolocation.getCurrentPosition(gotLocation, failedLocation);
    }
});

function gotLocation(pos) {
    geo = {
        'lat':pos.coords.latitude,
        'lon':pos.coords.longitude
    };
    search();
}

function failedLocation() {
    domErrorMessage.innerText = 'You must allow geolocation so we can find local results.';
}

async function search() {
    let searchResults = await fetch('/api/search?lat='+geo['lat']+'&lon='+geo['lon']).then(result => result.json());
    console.log(searchResults);
}