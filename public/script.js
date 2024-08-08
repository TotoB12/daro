mapboxgl.accessToken = 'pk.eyJ1IjoidG90b2IxMjE3IiwiYSI6ImNsbXo4NHdocjA4dnEya215cjY0aWJ1cGkifQ.OMzA6Q8VnHLHZP-P8ACBRw';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/totob1217/cln13arba06c901ns2xacgakx',
    center: [-74.5, 40],
    zoom: 9
});

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResultsContainer = document.getElementById('search-results');
const navBar = document.getElementById('nav-bar');
const presetButtons = document.getElementById('preset-buttons');
const backButton = document.getElementById('back-button');
const detailsBar = document.getElementById('details-bar');
const detailsBackButton = document.getElementById('details-back-button');
const placeName = document.getElementById('place-name');
const placeText = document.getElementById('place-text');

searchButton.addEventListener('click', () => performSearch(searchInput.value));
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch(searchInput.value);
    }
});
searchInput.addEventListener('input', () => performLiveSearch(searchInput.value));

function performSearch(query) {
    if (query.trim() === '') return;

    fetch(`/search?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                const coordinates = data.features[0].center;
                map.flyTo({
                    center: coordinates,
                    zoom: 14
                });

                new mapboxgl.Marker()
                    .setLngLat(coordinates)
                    .addTo(map);

                showDetailsBar(data.features[0]);
            } else {
                alert('No results found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while searching');
        });
}

function performLiveSearch(query) {
    if (query.trim() === '') {
        searchResultsContainer.innerHTML = '';
        return;
    }

    fetch(`/search?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            searchResultsContainer.innerHTML = '';
            if (data.features && data.features.length > 0) {
                data.features.forEach(feature => {
                    const resultItem = document.createElement('div');
                    resultItem.classList.add('search-result');
                    resultItem.textContent = feature.place_name;
                    resultItem.addEventListener('click', () => {
                        const coordinates = feature.center;
                        map.flyTo({
                            center: coordinates,
                            zoom: 14
                        });

                        new mapboxgl.Marker()
                            .setLngLat(coordinates)
                            .addTo(map);

                        showDetailsBar(feature);
                    });
                    searchResultsContainer.appendChild(resultItem);
                });
            } else {
                searchResultsContainer.innerHTML = '<div class="search-result">No results found</div>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            searchResultsContainer.innerHTML = '<div class="search-result">An error occurred while searching</div>';
        });
}

searchInput.addEventListener('focus', () => {
    navBar.classList.add('expanded');
    presetButtons.style.display = 'none';
    backButton.style.display = 'block';
});

backButton.addEventListener('click', () => {
    searchInput.value = '';
    searchResultsContainer.innerHTML = '';
    navBar.classList.remove('expanded');
    presetButtons.style.display = 'flex';
    backButton.style.display = 'none';
});

detailsBackButton.addEventListener('click', () => {
    detailsBar.style.display = 'none';
    navBar.style.display = 'block';
});

presetButtons.querySelectorAll('.preset-button').forEach(button => {
    button.addEventListener('click', () => {
        console.log(`${button.querySelector('span').textContent} button clicked`);
    });
});

function showDetailsBar(feature) {
    navBar.style.display = 'none';
    detailsBar.style.display = 'block';
    placeName.textContent = feature.place_name;
    placeText.textContent = feature.text;
}
