const domSearchButton = document.getElementById('searchButton');
const domErrorMessage = document.getElementById('errorMessage');
const domResultsContainer = document.getElementById('resultsContain');
const domFilterContainer = document.getElementById('filterContainer');
const domFilterHead = document.getElementById('filterHead');
const domChilisFilter = document.getElementById('chilisFilter');
const domResults = document.getElementById('results');

const templateResult = document.getElementById('resultTemplate');

let geo;

domSearchButton.addEventListener('click', function() {
    if (!navigator.geolocation) {
        domErrorMessage.innerText = 'Sorry, your browser does not support geolocation.';
    } else {
        domSearchButton.classList.add('loading');
        navigator.geolocation.getCurrentPosition(gotLocation, failedLocation, {timeout:2500});
    }
});

domFilterHead.addEventListener('click', function() {
    domFilterContainer.classList.toggle('open');
});

domChilisFilter.addEventListener('click', function() {
    search(); //of course, this does nothing because that's the joke
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
    domResults.innerHTML = ''; //clear old results

    let response = await fetch('/api/search?lat=' + geo['lat'] + '&lon=' + geo['lon']).catch(e => console.log(e));

    if (!response || !response.ok) {
        domErrorMessage.innerText = 'Unable to contact Yelp. Check your internet connection.';
        domSearchButton.classList.remove('loading');
        domResultsContainer.classList.add('hidden');
        return;
    }

    let searchResults = await response.json();

    if (searchResults.length === 0) {
        domErrorMessage.innerText = 'Unbelievably, there are no Chili\'s nearby.';
        domSearchButton.classList.remove('loading');
        domResultsContainer.classList.add('hidden');
        return;
    }

    searchResults.forEach(result => {
        let root = templateResult.content.cloneNode(true);
        let domItem = root.querySelector('.item');
        domItem.querySelector('.itemImg').src = result['image_url'];
        domItem.querySelector('.location').innerText = result['location']['city']+' ('+Math.round(result['distance']*0.000621371)+' mi)'; //distance is given in meters, so convert to miles
        domItem.querySelector('.stars').src = 'img/stars/'+result['rating'].toString().replace('.','_')+'.png';
        domItem.querySelector('.reviewNumber').innerText = result['review_count'].toString()+' ratings';
        domItem.querySelector('.reviewNumber').href = result['url'];
        domItem.querySelector('.goButton').href = 'https://www.google.com/maps/dir/?api=1&destination='+result['coordinates']['latitude']+','+result['coordinates']['longitude'];
        domResults.appendChild(domItem);
    });
    console.log(searchResults);
    domSearchButton.classList.remove('loading');
    domResultsContainer.classList.remove('hidden');
}