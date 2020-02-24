const domSearchButton = document.getElementById('searchButton');
const domErrorMessage = document.getElementById('errorMessage');
const domResultsContainer = document.getElementById('resultsContain');
const domFilterContainer = document.getElementById('filterContainer');
const domFilterHead = document.getElementById('filterHead');
const domResults = document.getElementById('results');

const templateResult = document.getElementById('resultTemplate');

let geo;

domSearchButton.addEventListener('click', function() {
    if (!navigator.geolocation) {
        domErrorMessage.innerText = 'Sorry, your browser does not support geolocation.';
    } else {
        domSearchButton.classList.add('loading');
        navigator.geolocation.getCurrentPosition(gotLocation, failedLocation, {timeout:3000});
    }
});

domFilterHead.addEventListener('click', function() {
    domFilterContainer.classList.toggle('open');
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
    domErrorMessage.innerText = 'Unable to get your location.';
}

async function search() {
    let searchResults = await fetch('/api/search?lat='+geo['lat']+'&lon='+geo['lon']).then(result => result.json());
    domResults.innerHTML = '';
    searchResults.forEach(result => {
        let root = templateResult.content.cloneNode(true);
        let domItem = root.querySelector('.item');
        domItem.querySelector('.itemImg').src = result['image_url'];
        domItem.querySelector('.location').innerText = result['location']['city'];
        domItem.querySelector('.stars').src = 'img/stars/'+result['rating'].toString().replace('.','_')+'.png';
        domItem.querySelector('.reviewNumber').innerText = result['review_count'].toString()+' ratings';
        domItem.querySelector('.goButton').href = 'https://www.google.com/maps/dir/?api=1&destination='+result['coordinates']['latitude']+','+result['coordinates']['longitude'];
        domResults.appendChild(domItem);
    });
    console.log(searchResults);
    domSearchButton.classList.remove('loading');
    domResultsContainer.classList.remove('hidden')
}