let coords;
let newCoord = '';
let addedMarker = null;
let map;

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(function (position) {
    const { latitude, longitude } = position.coords;

    console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

    coords = [latitude, longitude];

    map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    if (addedMarker) {
      map.removeLayer(addedMarker);
    }

    addedMarker = L.marker(coords)
      .addTo(map)
      .bindPopup(`${latitude}, ${longitude}`)
      .openPopup();
  });

const fetchData = async function () {
  try {
    const url = new URL(
      `https://geo.ipify.org/api/v2/country?apiKey=at_Tlrm974OH3O6SJ9W10Do8tqkJIi2o`
    );
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Data not found');
    }
    const result = await response.json();
    const res = {
      ip: result.ip,
      utc: result.isp,
      location: result.location.region,
      timezone: result.location.timezone,
    };

    console.log('Our now data', res);
    return res;
  } catch (err) {
    console.error(err);
  }
};

async function render() {
  let ipContainer = document.getElementById('location-container');
  const { ip, utc, location, timezone } = await fetchData();

  let renderAddress = `
  <div class="location">
    <h2 class="secondary-heading">IP Address</h2>
     <p class="details">${ip}</p>
    </div>
  <div class="location">
  <h2 class="secondary-heading">Location</h2>
  <p class="details">${location}</p>
    </div>
 <div class="location">
  <h2 class="secondary-heading">Timezone</h2>
  <p class="details">${timezone}</p>
    </div>
<div class="location">
  <h2 class="secondary-heading">UTC</h2>
  <p class="details">${utc}</p>
</div>
    `;
  ipContainer.innerHTML += renderAddress;
}

render();

let searchButton = document.getElementById('Search');
let search_bar = document.getElementById('searchBar');

searchButton.addEventListener('click', async function (e) {
  e.preventDefault();
  const value = search_bar.value;
  console.log(value);

  newCoord = extractNumbers(search_bar.value);
  if (addedMarker) {
    map.removeLayer(addedMarker);
  }
  addedMarker = L.marker(newCoord)
    .addTo(map)
    .bindPopup(`${newCoord[0]}, ${newCoord[1]}`) // Corrected the popup content
    .openPopup();

  search_bar.value = '';
  console.log(coords);
});

function extractNumbers(inputString) {
  const numbers = inputString.split(',').map(Number);
  if (numbers.length === 2) {
    return [numbers[0], numbers[1]];
  } else {
    return null; // Return null if the input format is incorrect
  }
}

console.log('The extracted number', extractNumbers('6.7220167, 3.4015718'));

// async function clickLocation() {
//   try {

//   } catch (error) {}
// }
// 6.7220167, 3.4015718;
