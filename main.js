const domSearchButton = document.getElementById('searchButton');
const domErrorMessage = document.getElementById('errorMessage');

const templateResult = document.getElementById('resultTemplate');

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
    domSearchButton.classList.remove('loading');
    domErrorMessage.innerText = 'You must allow geolocation so we can find local results.';
}

async function search() {
    let response = await fetch('/api/search?lat='+geo['lat']+'&lon='+geo['lon']).then(result => result.json());
    let searchResults = response['businesses'];
    searchResults.forEach(result => {
        let root = templateResult.content.cloneNode(true);
        let domResult = root.querySelector('.result');
        domResult.querySelector('.itemImg').src = result['image_url'];
        domResult.querySelector('.location').innerText = result['location']['city'];
        domResult.querySelector('.stars').src = result['rating'].toString.replace('.','_');
    });
    console.log(searchResults);
}