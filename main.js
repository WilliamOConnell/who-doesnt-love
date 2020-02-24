const domSearchButton = document.getElementById('searchButton');
const domErrorMessage = document.getElementById('errorMessage');
const domResults = document.getElementById('results');

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
    let searchResults = await fetch('/api/search?lat='+geo['lat']+'&lon='+geo['lon']).then(result => result.json());
    searchResults.forEach(result => {
        let root = templateResult.content.cloneNode(true);
        let domItem = root.querySelector('.item');
        domItem.querySelector('.itemImg').src = result['image_url'];
        domItem.querySelector('.location').innerText = result['location']['city'];
        domItem.querySelector('.stars').src = result['rating'].toString.replace('.','_');
        domItem.querySelector('.goButton').href = 'https://www.google.com/maps/dir/?api=1&destination='+result['location']['latitude']+','+result['location']['longitude'];
        domResults.appendChild(domItem);
    });
    console.log(searchResults);
}